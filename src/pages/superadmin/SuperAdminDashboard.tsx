import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  collegesApi,
  usersApi,
  College,
  User,
  resetDemoData,
} from '@/lib/storage';
import {
  Building2,
  UserPlus,
  RefreshCw,
  LogOut,
  Plus,
  Trash2,
  Shield,
  GraduationCap,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export const SuperAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [colleges, setColleges] = useState<College[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // College form state
  const [collegeDialogOpen, setCollegeDialogOpen] = useState(false);
  const [collegeName, setCollegeName] = useState('');
  const [collegeCode, setCollegeCode] = useState('');

  // Admin form state
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminCollegeId, setAdminCollegeId] = useState('');

  useEffect(() => {
    // Redirect non-superAdmin users
    if (user && user.role !== 'superAdmin') {
      navigate('/');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      const [collegeList, userList] = await Promise.all([
        collegesApi.getAll(),
        usersApi.getAll(),
      ]);

      setColleges(collegeList);
      setAdmins(userList.filter(u => u.role === 'admin'));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCollege = async () => {
    if (!collegeName.trim() || !collegeCode.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await collegesApi.create({
        name: collegeName.trim(),
        code: collegeCode.trim().toUpperCase(),
      });

      toast.success('College created successfully');
      setCollegeDialogOpen(false);
      setCollegeName('');
      setCollegeCode('');
      loadData();
    } catch (error) {
      toast.error('Failed to create college');
    }
  };

  const handleCreateAdmin = async () => {
    if (!adminName.trim() || !adminEmail.trim() || !adminPassword.trim() || !adminCollegeId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await usersApi.create({
        name: adminName.trim(),
        email: adminEmail.trim().toLowerCase(),
        password: adminPassword,
        role: 'admin',
        collegeId: adminCollegeId,
      });

      toast.success('College Admin created successfully');
      setAdminDialogOpen(false);
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
      setAdminCollegeId('');
      loadData();
    } catch (error) {
      toast.error('Failed to create admin');
    }
  };

  const handleResetData = () => {
    resetDemoData();
    toast.success('Demo data has been reset');
    loadData();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || user.role !== 'superAdmin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-hero">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display text-xl font-semibold text-foreground">Super Admin</span>
                <span className="ml-2 text-sm text-muted-foreground">Platform Management</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2 text-warning border-warning hover:bg-warning/10">
                    <RefreshCw className="h-4 w-4" />
                    Reset Demo Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      Reset Demo Data?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete all existing data and recreate the demo dataset. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetData} className="bg-warning text-warning-foreground hover:bg-warning/90">
                      Reset Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button variant="ghost" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Notice Banner */}
        <div className="mb-8 p-4 rounded-lg bg-primary/5 border border-primary/20 animate-fade-up">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Super Admin Mode</p>
              <p className="text-sm text-muted-foreground mt-1">
                You are managing the platform as a developer. You can create colleges and admin users, but cannot view feedback, reports, or faculty performance data.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Colleges Section */}
          <div className="glass-card rounded-xl p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-lg font-semibold text-foreground">Colleges</h2>
              </div>

              <Dialog open={collegeDialogOpen} onOpenChange={setCollegeDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 gradient-hero text-primary-foreground hover:opacity-90">
                    <Plus className="h-4 w-4" />
                    Add College
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New College</DialogTitle>
                    <DialogDescription>
                      Add a new college to the platform. You'll be able to create admin users for this college.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="collegeName">College Name</Label>
                      <Input
                        id="collegeName"
                        placeholder="e.g., Gryphon Institute of Technology"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="collegeCode">College Code</Label>
                      <Input
                        id="collegeCode"
                        placeholder="e.g., GIT"
                        value={collegeCode}
                        onChange={(e) => setCollegeCode(e.target.value.toUpperCase())}
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCollegeDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCollege} className="gradient-hero text-primary-foreground hover:opacity-90">
                      Create College
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {colleges.map((college, index) => (
                <div
                  key={college.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{college.name}</p>
                      <p className="text-sm text-muted-foreground">Code: {college.code}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {admins.filter(a => a.collegeId === college.id).length} admin(s)
                  </span>
                </div>
              ))}

              {colleges.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>No colleges yet</p>
                  <p className="text-sm">Create your first college to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* College Admins Section */}
          <div className="glass-card rounded-xl p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-lg font-semibold text-foreground">College Admins</h2>
              </div>

              <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="gap-2 gradient-hero text-primary-foreground hover:opacity-90"
                    disabled={colleges.length === 0}
                  >
                    <Plus className="h-4 w-4" />
                    Add Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create College Admin</DialogTitle>
                    <DialogDescription>
                      Create a new admin user for a college. They will have full control within their college scope.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminName">Full Name</Label>
                      <Input
                        id="adminName"
                        placeholder="e.g., Dr. Sarah Mitchell"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Email Address</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="e.g., dean@college.edu"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminPassword">Password</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        placeholder="Secure password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminCollege">Assign to College</Label>
                      <select
                        id="adminCollege"
                        value={adminCollegeId}
                        onChange={(e) => setAdminCollegeId(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Select a college...</option>
                        {colleges.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAdminDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAdmin} className="gradient-hero text-primary-foreground hover:opacity-90">
                      Create Admin
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {admins.map((admin, index) => {
                const college = colleges.find(c => c.id === admin.collegeId);

                return (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 animate-fade-up"
                    style={{ animationDelay: `${(index + colleges.length) * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                        <span className="text-sm font-medium text-accent-foreground">
                          {admin.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{admin.name}</p>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {college?.code || 'N/A'}
                    </span>
                  </div>
                );
              })}

              {admins.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>No admin users yet</p>
                  <p className="text-sm">Create a college first, then add admins</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-8 glass-card rounded-xl p-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Demo Credentials</h3>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm font-medium text-foreground mb-1">Super Admin</p>
              <p className="text-xs text-muted-foreground">superadmin@gryphon.edu</p>
              <p className="text-xs text-muted-foreground">admin123</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm font-medium text-foreground mb-1">College Admin</p>
              <p className="text-xs text-muted-foreground">dean@gryphon.edu</p>
              <p className="text-xs text-muted-foreground">dean123</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm font-medium text-foreground mb-1">HOD</p>
              <p className="text-xs text-muted-foreground">hod.icem@gryphon.edu</p>
              <p className="text-xs text-muted-foreground">hod123</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm font-medium text-foreground mb-1">Faculty</p>
              <p className="text-xs text-muted-foreground">faculty1@gryphon.edu</p>
              <p className="text-xs text-muted-foreground">faculty123</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
