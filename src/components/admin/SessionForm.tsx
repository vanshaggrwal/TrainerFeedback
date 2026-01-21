import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { departmentsApi, facultyApi, feedbackSessionsApi, Department, Faculty } from '@/lib/storage';
import { toast } from 'sonner';

// Course/Program data structure
const courseData = {
  'Engineering': {
    years: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    departments: ['Computer Science & Engineering', 'Information Technology', 'Mechanical Engineering']
  },
  'MBA': {
    years: ['1st Year', '2nd Year'],
    departments: ['Business Administration', 'Finance & Accounting', 'Marketing & Sales']
  },
  'MCA': {
    years: ['1st Year', '2nd Year'],
    departments: ['Computer Applications', 'Software Development']
  },
  'BBA+MBA': {
    years: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'],
    departments: ['Business Administration', 'Finance & Accounting', 'Marketing & Sales']
  },
  'BCA+MCA': {
    years: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'],
    departments: ['Computer Applications', 'Software Development']
  },
};

// Subject data structure
const subjectsData = {
  'Engineering': {
    '1st Year': {
      'Computer Science & Engineering': ['Programming Fundamentals', 'Data Structures', 'Database Systems'],
      'Information Technology': ['Web Development', 'Networking', 'Software Engineering'],
      'Mechanical Engineering': ['Thermodynamics', 'Fluid Mechanics', 'Materials Science']
    },
    '2nd Year': {
      'Computer Science & Engineering': ['Algorithms', 'Operating Systems', 'Computer Networks'],
      'Information Technology': ['Mobile Development', 'Cloud Computing', 'Cyber Security'],
      'Mechanical Engineering': ['Heat Transfer', 'Dynamics', 'Manufacturing Processes']
    },
    '3rd Year': {
      'Computer Science & Engineering': ['Machine Learning', 'Distributed Systems', 'Software Architecture'],
      'Information Technology': ['Data Analytics', 'IoT', 'Blockchain'],
      'Mechanical Engineering': ['CAD/CAM', 'Robotics', 'Quality Control']
    },
    '4th Year': {
      'Computer Science & Engineering': ['AI & Deep Learning', 'Big Data', 'Project Management'],
      'Information Technology': ['DevOps', 'Advanced Security', 'Digital Transformation'],
      'Mechanical Engineering': ['Advanced Manufacturing', 'Sustainable Energy', 'Project Management']
    }
  },
  'MBA': {
    '1st Year': {
      'Business Administration': ['Management Principles', 'Business Ethics', 'Organizational Behavior'],
      'Finance & Accounting': ['Financial Accounting', 'Cost Accounting', 'Business Finance'],
      'Marketing & Sales': ['Marketing Management', 'Consumer Behavior', 'Sales Management']
    },
    '2nd Year': {
      'Business Administration': ['Strategic Management', 'Human Resource Management', 'International Business'],
      'Finance & Accounting': ['Investment Analysis', 'Financial Markets', 'Corporate Finance'],
      'Marketing & Sales': ['Brand Management', 'Digital Marketing', 'Market Research']
    }
  },
  'MCA': {
    '1st Year': {
      'Computer Applications': ['Advanced Programming', 'Data Structures', 'Database Management'],
      'Software Development': ['Software Engineering', 'Web Technologies', 'Mobile Apps']
    },
    '2nd Year': {
      'Computer Applications': ['System Analysis', 'Network Security', 'Cloud Computing'],
      'Software Development': ['Agile Development', 'DevOps', 'Quality Assurance']
    }
  },
  'BBA+MBA': {
    '1st Year': {
      'Business Administration': ['Business Communication', 'Principles of Management', 'Business Law'],
      'Finance & Accounting': ['Financial Literacy', 'Basic Accounting', 'Business Mathematics'],
      'Marketing & Sales': ['Marketing Fundamentals', 'Retail Management', 'Customer Service']
    },
    '2nd Year': {
      'Business Administration': ['Business Strategy', 'Entrepreneurship', 'Operations Management'],
      'Finance & Accounting': ['Financial Planning', 'Taxation', 'Risk Management'],
      'Marketing & Sales': ['Advertising', 'E-commerce', 'International Marketing']
    },
    '3rd Year': {
      'Business Administration': ['Advanced Management', 'Corporate Governance', 'Business Analytics'],
      'Finance & Accounting': ['Investment Banking', 'Mergers & Acquisitions', 'Financial Modeling'],
      'Marketing & Sales': ['Strategic Marketing', 'Brand Strategy', 'Sales Leadership']
    },
    '4th Year': {
      'Business Administration': ['Global Business', 'Innovation Management', 'Leadership'],
      'Finance & Accounting': ['Portfolio Management', 'Derivatives', 'Financial Risk'],
      'Marketing & Sales': ['Marketing Analytics', 'Customer Experience', 'Digital Strategy']
    },
    '5th Year': {
      'Business Administration': ['Executive Leadership', 'Change Management', 'Strategic Planning'],
      'Finance & Accounting': ['Advanced Finance', 'Capital Markets', 'Financial Strategy'],
      'Marketing & Sales': ['Marketing Innovation', 'Global Marketing', 'Business Development']
    }
  },
  'BCA+MCA': {
    '1st Year': {
      'Computer Applications': ['Computer Fundamentals', 'Programming Logic', 'Database Concepts'],
      'Software Development': ['Object Oriented Programming', 'Web Design', 'System Analysis']
    },
    '2nd Year': {
      'Computer Applications': ['Data Structures', 'Operating Systems', 'Software Engineering'],
      'Software Development': ['Advanced Programming', 'Database Design', 'Network Programming']
    },
    '3rd Year': {
      'Computer Applications': ['System Programming', 'Computer Networks', 'Information Security'],
      'Software Development': ['Mobile Applications', 'Cloud Computing', 'Project Management']
    },
    '4th Year': {
      'Computer Applications': ['Big Data Analytics', 'Machine Learning', 'IoT'],
      'Software Development': ['DevOps', 'Microservices', 'AI Applications']
    },
    '5th Year': {
      'Computer Applications': ['Advanced Analytics', 'Blockchain', 'Cyber Security'],
      'Software Development': ['Full Stack Development', 'Enterprise Solutions', 'Innovation Lab']
    }
  }
};

interface SessionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const SessionForm: React.FC<SessionFormProps> = ({ open, onOpenChange, onSuccess }) => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [course, setCourse] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [department, setDepartment] = useState('');
  const [subject, setSubject] = useState('');
  const [batch, setBatch] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      const [depts, fac] = await Promise.all([
        departmentsApi.getAll(),
        facultyApi.getAll()
      ]);
      setDepartments(depts);
      setFaculty(fac);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const availableYears = course ? courseData[course as keyof typeof courseData]?.years || [] : [];
  const availableSubjects = (course && academicYear && department)
    ? subjectsData[course as keyof typeof subjectsData]?.[academicYear]?.[department] || []
    : [];
  const availableFaculty = faculty.filter(f =>
    f.departmentId === departments.find(d => d.name === department)?.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.collegeId) return;

    setIsLoading(true);
    try {
      const selectedDept = departments.find(d => d.name === department);
      if (!selectedDept) throw new Error('Department not found');

      const uniqueUrl = `session-${crypto.randomUUID().slice(0, 8)}`;

      await feedbackSessionsApi.create({
        collegeId: user.collegeId,
        departmentId: selectedDept.id,
        facultyId: selectedFaculty,
        course,
        academicYear,
        subject,
        batch,
        accessMode: 'anonymous',
        uniqueUrl,
        isActive: true,
        expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
      });

      toast.success('Feedback session created successfully!');
      onOpenChange(false);
      onSuccess?.();

      // Reset form
      setCourse('');
      setAcademicYear('');
      setDepartment('');
      setSubject('');
      setBatch('');
      setSelectedFaculty('');
      setExpiresAt('');
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Feedback Session</DialogTitle>
          <DialogDescription>
            Set up a new feedback session for a specific academic context.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course">Course/Program</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(courseData).map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Select value={academicYear} onValueChange={setAcademicYear} disabled={!course}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={department} onValueChange={setDepartment} disabled={!course}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {courseData[course as keyof typeof courseData]?.departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject} disabled={!department}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((subj) => (
                    <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch">Batch</Label>
              <Select value={batch} onValueChange={setBatch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  {['A', 'B', 'C', 'D'].map((b) => (
                    <SelectItem key={b} value={b}>Batch {b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty">Faculty</Label>
            <Select value={selectedFaculty} onValueChange={setSelectedFaculty} disabled={!department}>
              <SelectTrigger>
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                {availableFaculty.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name} - {f.designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expires At (Optional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for 30 days default expiry
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};