// localStorage utility functions with simulated API delays

export const STORAGE_KEYS = {
  COLLEGES: 'ffs_colleges',
  USERS: 'ffs_users',
  FACULTY: 'ffs_faculty',
  DEPARTMENTS: 'ffs_departments',
  FEEDBACK_CYCLES: 'ffs_feedback_cycles',
  ACCESS_CODES: 'ffs_access_codes',
  FEEDBACK_SESSIONS: 'ffs_feedback_sessions',
  QUESTIONS: 'ffs_questions',
  FEEDBACK_SUBMISSIONS: 'ffs_feedback_submissions',
  CURRENT_USER: 'ffs_current_user',
};

// Simulated delay for realistic UX
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generic storage helpers
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};

// Types
export interface College {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'superAdmin' | 'admin' | 'hod' | 'faculty';
  collegeId?: string;
  departmentId?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  collegeId: string;
  hodId?: string;
  createdAt: string;
}

export interface Faculty {
  id: string;
  userId: string;
  employeeId: string;
  name: string;
  email: string;
  designation: string;
  specialization: string;
  experience: number;
  qualifications: string;
  researchInterests: string[];
  publications: number;
  teachingSubjects: string[];
  achievements: string[];
  departmentId: string;
  collegeId: string;
  subjects: string[];
  createdAt: string;
}

export interface FeedbackCycle {
  id: string;
  name: string;
  title?: string;
  description?: string;
  collegeId: string;
  startDate: string;
  endDate: string;
  accessMode: 'anonymous' | 'authenticated' | 'mixed';
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
}

export interface AccessCode {
  id: string;
  code: string;
  cycleId: string;
  facultyId: string;
  collegeId: string;
  used: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface FeedbackSession {
  id: string;
  collegeId: string;
  departmentId: string;
  facultyId: string;
  course: string;           // Academic program (Engineering, MBA, MCA, etc.)
  academicYear: string;     // Academic year (1st Year, 2nd Year, etc.)
  subject: string;          // Specific subject being taught
  batch: string;            // Class batch (A, B, C, D)
  accessMode: 'anonymous';  // Access mode for the session
  uniqueUrl: string;        // Unique URL for anonymous feedback
  isActive: boolean;        // Whether the session is currently active
  createdAt: string;        // Creation timestamp
  expiresAt: string;        // Expiration timestamp
}

export interface Question {
  id: string;
  collegeId: string;
  category: string;
  text: string;
  responseType: 'rating' | 'text' | 'both' | 'select' | 'boolean';
  required: boolean;
  order: number;
  createdAt: string;
  options?: string[]; // For select type questions
}

export interface FeedbackSubmission {
  id: string;
  sessionId: string;        // Required: Reference to the feedback session
  facultyId: string;
  collegeId: string;
  responses: {
    questionId: string;
    rating?: number;
    comment?: string;
    selectValue?: string;
    booleanValue?: boolean;
  }[];
  submittedAt: string;
}

// Data access functions
export const collegesApi = {
  getAll: async (): Promise<College[]> => {
    await delay();
    return storage.get<College[]>(STORAGE_KEYS.COLLEGES) || [];
  },

  create: async (college: Omit<College, 'id' | 'createdAt'>): Promise<College> => {
    await delay();
    const colleges = storage.get<College[]>(STORAGE_KEYS.COLLEGES) || [];
    const newCollege: College = {
      ...college,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.COLLEGES, [...colleges, newCollege]);
    return newCollege;
  },
};

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    await delay();
    return storage.get<User[]>(STORAGE_KEYS.USERS) || [];
  },

  getByEmail: async (email: string): Promise<User | undefined> => {
    await delay();
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  create: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    await delay();
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.USERS, [...users, newUser]);
    return newUser;
  },

  authenticate: async (email: string, password: string): Promise<User | null> => {
    await delay(500);
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      storage.set(STORAGE_KEYS.CURRENT_USER, user);
    }
    return user || null;
  },

  getCurrentUser: (): User | null => {
    return storage.get<User>(STORAGE_KEYS.CURRENT_USER);
  },

  logout: (): void => {
    storage.remove(STORAGE_KEYS.CURRENT_USER);
  },
};

export const departmentsApi = {
  getAll: async (): Promise<Department[]> => {
    await delay();
    return storage.get<Department[]>(STORAGE_KEYS.DEPARTMENTS) || [];
  },

  getByCollege: async (collegeId: string): Promise<Department[]> => {
    await delay();
    const departments = storage.get<Department[]>(STORAGE_KEYS.DEPARTMENTS) || [];
    return departments.filter(d => d.collegeId === collegeId);
  },

  create: async (department: Omit<Department, 'id' | 'createdAt'>): Promise<Department> => {
    await delay();
    const departments = storage.get<Department[]>(STORAGE_KEYS.DEPARTMENTS) || [];
    const newDept: Department = {
      ...department,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.DEPARTMENTS, [...departments, newDept]);
    return newDept;
  },
};

export const facultyApi = {
  getAll: async (): Promise<Faculty[]> => {
    await delay();
    return storage.get<Faculty[]>(STORAGE_KEYS.FACULTY) || [];
  },

  getByCollege: async (collegeId: string): Promise<Faculty[]> => {
    await delay();
    const faculty = storage.get<Faculty[]>(STORAGE_KEYS.FACULTY) || [];
    return faculty.filter(f => f.collegeId === collegeId);
  },

  getByDepartment: async (departmentId: string): Promise<Faculty[]> => {
    await delay();
    const faculty = storage.get<Faculty[]>(STORAGE_KEYS.FACULTY) || [];
    return faculty.filter(f => f.departmentId === departmentId);
  },

  create: async (member: Omit<Faculty, 'id' | 'createdAt'>): Promise<Faculty> => {
    await delay();
    const faculty = storage.get<Faculty[]>(STORAGE_KEYS.FACULTY) || [];
    const newFaculty: Faculty = {
      ...member,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.FACULTY, [...faculty, newFaculty]);
    return newFaculty;
  },
};

export const feedbackCyclesApi = {
  getAll: async (): Promise<FeedbackCycle[]> => {
    await delay();
    return storage.get<FeedbackCycle[]>(STORAGE_KEYS.FEEDBACK_CYCLES) || [];
  },

  getByCollege: async (collegeId: string): Promise<FeedbackCycle[]> => {
    await delay();
    const cycles = storage.get<FeedbackCycle[]>(STORAGE_KEYS.FEEDBACK_CYCLES) || [];
    return cycles.filter(c => c.collegeId === collegeId);
  },

  create: async (cycle: Omit<FeedbackCycle, 'id' | 'createdAt'>): Promise<FeedbackCycle> => {
    await delay();
    const cycles = storage.get<FeedbackCycle[]>(STORAGE_KEYS.FEEDBACK_CYCLES) || [];
    const newCycle: FeedbackCycle = {
      ...cycle,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.FEEDBACK_CYCLES, [...cycles, newCycle]);
    return newCycle;
  },

  update: async (id: string, updates: Partial<FeedbackCycle>): Promise<FeedbackCycle | null> => {
    await delay();
    const cycles = storage.get<FeedbackCycle[]>(STORAGE_KEYS.FEEDBACK_CYCLES) || [];
    const index = cycles.findIndex(c => c.id === id);
    if (index === -1) return null;
    cycles[index] = { ...cycles[index], ...updates };
    storage.set(STORAGE_KEYS.FEEDBACK_CYCLES, cycles);
    return cycles[index];
  },
};

export const accessCodesApi = {
  getAll: async (): Promise<AccessCode[]> => {
    await delay();
    return storage.get<AccessCode[]>(STORAGE_KEYS.ACCESS_CODES) || [];
  },

  getByCode: async (code: string): Promise<AccessCode | undefined> => {
    await delay(500);
    const codes = storage.get<AccessCode[]>(STORAGE_KEYS.ACCESS_CODES) || [];
    return codes.find(c => c.code === code);
  },

  create: async (accessCode: Omit<AccessCode, 'id' | 'createdAt'>): Promise<AccessCode> => {
    await delay();
    const codes = storage.get<AccessCode[]>(STORAGE_KEYS.ACCESS_CODES) || [];
    const newCode: AccessCode = {
      ...accessCode,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.ACCESS_CODES, [...codes, newCode]);
    return newCode;
  },

  markUsed: async (id: string): Promise<void> => {
    await delay();
    const codes = storage.get<AccessCode[]>(STORAGE_KEYS.ACCESS_CODES) || [];
    const index = codes.findIndex(c => c.id === id);
    if (index !== -1) {
      codes[index].used = true;
      storage.set(STORAGE_KEYS.ACCESS_CODES, codes);
    }
  },
};

export const feedbackSessionsApi = {
  getAll: async (): Promise<FeedbackSession[]> => {
    await delay();
    return storage.get<FeedbackSession[]>(STORAGE_KEYS.FEEDBACK_SESSIONS) || [];
  },

  getById: async (id: string): Promise<FeedbackSession | null> => {
    await delay();
    const sessions = storage.get<FeedbackSession[]>(STORAGE_KEYS.FEEDBACK_SESSIONS) || [];
    return sessions.find(s => s.id === id) || null;
  },

  getByUrl: async (url: string): Promise<FeedbackSession | null> => {
    await delay();
    const sessions = storage.get<FeedbackSession[]>(STORAGE_KEYS.FEEDBACK_SESSIONS) || [];
    return sessions.find(s => s.uniqueUrl === url) || null;
  },

  getByFaculty: async (facultyId: string): Promise<FeedbackSession[]> => {
    await delay();
    const sessions = storage.get<FeedbackSession[]>(STORAGE_KEYS.FEEDBACK_SESSIONS) || [];
    return sessions.filter(s => s.facultyId === facultyId);
  },

  getByCollege: async (collegeId: string): Promise<FeedbackSession[]> => {
    await delay();
    const sessions = storage.get<FeedbackSession[]>(STORAGE_KEYS.FEEDBACK_SESSIONS) || [];
    return sessions.filter(s => s.collegeId === collegeId);
  },

  create: async (session: Omit<FeedbackSession, 'id' | 'createdAt'>): Promise<FeedbackSession> => {
    await delay();
    const sessions = storage.get<FeedbackSession[]>(STORAGE_KEYS.FEEDBACK_SESSIONS) || [];
    const newSession: FeedbackSession = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.FEEDBACK_SESSIONS, [...sessions, newSession]);
    return newSession;
  },

  update: async (id: string, updates: Partial<FeedbackSession>): Promise<FeedbackSession | null> => {
    await delay();
    const sessions = storage.get<FeedbackSession[]>(STORAGE_KEYS.FEEDBACK_SESSIONS) || [];
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) return null;
    sessions[index] = { ...sessions[index], ...updates };
    storage.set(STORAGE_KEYS.FEEDBACK_SESSIONS, sessions);
    return sessions[index];
  },

  getByCourse: async (course: string): Promise<FeedbackSession[]> => {
    await delay();
    const sessions = storage.get<FeedbackSession[]>(STORAGE_KEYS.FEEDBACK_SESSIONS) || [];
    return sessions.filter(s => s.course === course);
  },

  getByAcademicYear: async (academicYear: string): Promise<FeedbackSession[]> => {
    await delay();
    const sessions = storage.get<FeedbackSession[]>(STORAGE_KEYS.FEEDBACK_SESSIONS) || [];
    return sessions.filter(s => s.academicYear === academicYear);
  },

  getBySubject: async (subject: string): Promise<FeedbackSession[]> => {
    await delay();
    const sessions = storage.get<FeedbackSession[]>(STORAGE_KEYS.FEEDBACK_SESSIONS) || [];
    return sessions.filter(s => s.subject === subject);
  },

  getByDepartment: async (departmentId: string): Promise<FeedbackSession[]> => {
    await delay();
    const sessions = storage.get<FeedbackSession[]>(STORAGE_KEYS.FEEDBACK_SESSIONS) || [];
    return sessions.filter(s => s.departmentId === departmentId);
  },

  getActive: async (): Promise<FeedbackSession[]> => {
    await delay();
    const sessions = storage.get<FeedbackSession[]>(STORAGE_KEYS.FEEDBACK_SESSIONS) || [];
    return sessions.filter(s => s.isActive);
  },

  delete: async (id: string): Promise<boolean> => {
    await delay();
    const sessions = storage.get<FeedbackSession[]>(STORAGE_KEYS.FEEDBACK_SESSIONS) || [];
    const filteredSessions = sessions.filter(s => s.id !== id);
    if (filteredSessions.length < sessions.length) {
      storage.set(STORAGE_KEYS.FEEDBACK_SESSIONS, filteredSessions);
      return true;
    }
    return false;
  },
};

export const questionsApi = {
  getAll: async (): Promise<Question[]> => {
    await delay();
    return storage.get<Question[]>(STORAGE_KEYS.QUESTIONS) || [];
  },

  getByCollege: async (collegeId: string): Promise<Question[]> => {
    await delay();
    const questions = storage.get<Question[]>(STORAGE_KEYS.QUESTIONS) || [];
    return questions.filter(q => q.collegeId === collegeId).sort((a, b) => a.order - b.order);
  },

  create: async (question: Omit<Question, 'id' | 'createdAt'>): Promise<Question> => {
    await delay();
    const questions = storage.get<Question[]>(STORAGE_KEYS.QUESTIONS) || [];
    const newQuestion: Question = {
      ...question,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.QUESTIONS, [...questions, newQuestion]);
    return newQuestion;
  },
};

export const submissionsApi = {
  getAll: async (): Promise<FeedbackSubmission[]> => {
    await delay();
    return storage.get<FeedbackSubmission[]>(STORAGE_KEYS.FEEDBACK_SUBMISSIONS) || [];
  },

  getBySession: async (sessionId: string): Promise<FeedbackSubmission[]> => {
    await delay();
    const submissions = storage.get<FeedbackSubmission[]>(STORAGE_KEYS.FEEDBACK_SUBMISSIONS) || [];
    return submissions.filter(s => s.sessionId === sessionId);
  },

  getByCollege: async (collegeId: string): Promise<FeedbackSubmission[]> => {
    await delay();
    const submissions = storage.get<FeedbackSubmission[]>(STORAGE_KEYS.FEEDBACK_SUBMISSIONS) || [];
    return submissions.filter(s => s.collegeId === collegeId);
  },

  getByFaculty: async (facultyId: string): Promise<FeedbackSubmission[]> => {
    await delay();
    const submissions = storage.get<FeedbackSubmission[]>(STORAGE_KEYS.FEEDBACK_SUBMISSIONS) || [];
    return submissions.filter(s => s.facultyId === facultyId);
  },

  create: async (submission: Omit<FeedbackSubmission, 'id' | 'submittedAt'>): Promise<FeedbackSubmission> => {
    await delay();
    const submissions = storage.get<FeedbackSubmission[]>(STORAGE_KEYS.FEEDBACK_SUBMISSIONS) || [];
    const newSubmission: FeedbackSubmission = {
      ...submission,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.FEEDBACK_SUBMISSIONS, [...submissions, newSubmission]);
    return newSubmission;
  },
};

// Initialize comprehensive demo data for full UI flow demonstration
export const initializeDemoData = (): void => {
  // Check if data already exists
  if (storage.get<User[]>(STORAGE_KEYS.USERS)?.length) return;

  // Create demo colleges
  const icemCollegeId = crypto.randomUUID();
  const igsbCollegeId = crypto.randomUUID();

  const colleges: College[] = [
    {
      id: icemCollegeId,
      name: 'Indira College of Engineering and Management',
      code: 'ICEM',
      createdAt: new Date().toISOString(),
    },
    {
      id: igsbCollegeId,
      name: 'Indira Global School of Business',
      code: 'IGSB',
      createdAt: new Date().toISOString(),
    },
  ];
  storage.set(STORAGE_KEYS.COLLEGES, colleges);

  // Create departments
  const departments: Department[] = [
    // ICEM Departments
    {
      id: crypto.randomUUID(),
      name: 'Computer Science & Engineering',
      code: 'CSE',
      collegeId: icemCollegeId,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Information Technology',
      code: 'IT',
      collegeId: icemCollegeId,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Mechanical Engineering',
      code: 'ME',
      collegeId: icemCollegeId,
      createdAt: new Date().toISOString(),
    },
    // IGSB Departments
    {
      id: crypto.randomUUID(),
      name: 'Business Administration',
      code: 'BA',
      collegeId: igsbCollegeId,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Finance & Accounting',
      code: 'FA',
      collegeId: igsbCollegeId,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Marketing & Sales',
      code: 'MS',
      collegeId: igsbCollegeId,
      createdAt: new Date().toISOString(),
    },
  ];
  storage.set(STORAGE_KEYS.DEPARTMENTS, departments);

  // Create users
  const users: User[] = [
    // Super Admin
    {
      id: crypto.randomUUID(),
      email: 'superadmin@gryphon.edu',
      password: 'admin123',
      name: 'System Administrator',
      role: 'superAdmin',
      createdAt: new Date().toISOString(),
    },
    // ICEM Admin
    {
      id: crypto.randomUUID(),
      email: 'dean@gryphon.edu',
      password: 'admin123',
      name: 'Dr. Rajesh Kumar',
      role: 'admin',
      collegeId: icemCollegeId,
      createdAt: new Date().toISOString(),
    },
    // IGSB Admin
    {
      id: crypto.randomUUID(),
      email: 'admin.igsb@gryphon.edu',
      password: 'admin123',
      name: 'Dr. Priya Sharma',
      role: 'admin',
      collegeId: igsbCollegeId,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      email: 'dean.igsb@gryphon.edu',
      password: 'admin123',
      name: 'Dr. Vikram Rao',
      role: 'admin',
      collegeId: igsbCollegeId,
      createdAt: new Date().toISOString(),
    },
    // ICEM HODs
    {
      id: crypto.randomUUID(),
      email: 'hod.icem@gryphon.edu',
      password: 'hod123',
      name: 'Prof. Amit Singh',
      role: 'hod',
      collegeId: icemCollegeId,
      departmentId: departments[0].id,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      email: 'hod.it@gryphon.edu',
      password: 'hod123',
      name: 'Prof. Sunita Patel',
      role: 'hod',
      collegeId: icemCollegeId,
      departmentId: departments[1].id,
      createdAt: new Date().toISOString(),
    },
    // IGSB HODs
    {
      id: crypto.randomUUID(),
      email: 'hod.igsb@gryphon.edu',
      password: 'hod123',
      name: 'Prof. Vikram Rao',
      role: 'hod',
      collegeId: igsbCollegeId,
      departmentId: departments[3].id,
      createdAt: new Date().toISOString(),
    },
    // Faculty members
    {
      id: crypto.randomUUID(),
      email: 'faculty1@gryphon.edu',
      password: 'faculty123',
      name: 'Dr. Arjun Mehta',
      role: 'faculty',
      collegeId: icemCollegeId,
      departmentId: departments[0].id,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      email: 'faculty2.cse@icem.edu',
      password: 'faculty123',
      name: 'Prof. Kavita Joshi',
      role: 'faculty',
      collegeId: icemCollegeId,
      departmentId: departments[0].id,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      email: 'faculty1.it@icem.edu',
      password: 'faculty123',
      name: 'Dr. Rohan Gupta',
      role: 'faculty',
      collegeId: icemCollegeId,
      departmentId: departments[1].id,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      email: 'faculty1.me@icem.edu',
      password: 'faculty123',
      name: 'Prof. Deepak Sharma',
      role: 'faculty',
      collegeId: icemCollegeId,
      departmentId: departments[2].id,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      email: 'faculty1.igsb@gryphon.edu',
      password: 'faculty123',
      name: 'Dr. Meera Iyer',
      role: 'faculty',
      collegeId: igsbCollegeId,
      departmentId: departments[3].id,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      email: 'faculty2.ba@igsb.edu',
      password: 'faculty123',
      name: 'Prof. Karan Malhotra',
      role: 'faculty',
      collegeId: igsbCollegeId,
      departmentId: departments[3].id,
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      email: 'faculty1.fa@igsb.edu',
      password: 'faculty123',
      name: 'Dr. Anjali Desai',
      role: 'faculty',
      collegeId: igsbCollegeId,
      departmentId: departments[4].id,
      createdAt: new Date().toISOString(),
    },
  ];
  storage.set(STORAGE_KEYS.USERS, users);

  // Update department HOD assignments
  departments[0].hodId = users[4].id; // CSE HOD
  departments[1].hodId = users[5].id; // IT HOD
  departments[3].hodId = users[6].id; // BA HOD
  storage.set(STORAGE_KEYS.DEPARTMENTS, departments);

  // Create faculty profiles
  const facultyProfiles: Faculty[] = [
    {
      id: crypto.randomUUID(),
      userId: users[6].id, // Dr. Arjun Mehta
      employeeId: 'ICEM-CSE-001',
      name: users[6].name,
      email: 'faculty1@gryphon.edu',
      designation: 'Associate Professor',
      specialization: 'Machine Learning & Data Science',
      experience: 12,
      qualifications: 'Ph.D. in Computer Science, IIT Delhi',
      researchInterests: ['Machine Learning', 'Artificial Intelligence', 'Data Mining'],
      publications: 25,
      teachingSubjects: ['Data Structures', 'Machine Learning', 'AI Fundamentals'],
      achievements: ['Best Teacher Award 2022', 'Published 15 papers in reputed journals'],
      departmentId: departments[0].id, // CSE
      collegeId: icemCollegeId,
      subjects: ['Data Structures', 'Machine Learning', 'AI Fundamentals'],
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      userId: users[7].id, // Prof. Kavita Joshi
      employeeId: 'ICEM-CSE-002',
      name: users[7].name,
      email: users[7].email,
      designation: 'Assistant Professor',
      specialization: 'Software Engineering',
      experience: 8,
      qualifications: 'M.Tech in Software Engineering, IIT Bombay',
      researchInterests: ['Software Architecture', 'Agile Development', 'DevOps'],
      publications: 12,
      teachingSubjects: ['Software Engineering', 'System Design', 'Web Technologies'],
      achievements: ['Certified Scrum Master', 'Led 5 major software projects'],
      departmentId: departments[0].id, // CSE
      collegeId: icemCollegeId,
      subjects: ['Software Engineering', 'System Design', 'Web Technologies'],
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      userId: users[8].id, // Dr. Rohan Gupta
      employeeId: 'ICEM-IT-001',
      name: users[8].name,
      email: users[8].email,
      designation: 'Associate Professor',
      specialization: 'Cybersecurity & Network Security',
      experience: 10,
      qualifications: 'Ph.D. in Information Technology, IIT Madras',
      researchInterests: ['Cybersecurity', 'Network Security', 'Blockchain'],
      publications: 18,
      teachingSubjects: ['Network Security', 'Cryptography', 'Ethical Hacking'],
      achievements: ['CEH Certified', 'Led cybersecurity research projects'],
      departmentId: departments[1].id, // IT
      collegeId: icemCollegeId,
      subjects: ['Network Security', 'Cryptography', 'Ethical Hacking'],
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      userId: users[9].id, // Prof. Deepak Sharma
      employeeId: 'ICEM-ME-001',
      name: users[9].name,
      email: users[9].email,
      designation: 'Professor',
      specialization: 'Mechanical Design & Manufacturing',
      experience: 18,
      qualifications: 'Ph.D. in Mechanical Engineering, IIT Kharagpur',
      researchInterests: ['CAD/CAM', 'Manufacturing Processes', 'Robotics'],
      publications: 35,
      teachingSubjects: ['Machine Design', 'Manufacturing Technology', 'CAD/CAM'],
      achievements: ['Fellow of Institution of Engineers', '15 patents filed'],
      departmentId: departments[2].id, // ME
      collegeId: icemCollegeId,
      subjects: ['Machine Design', 'Manufacturing Technology', 'CAD/CAM'],
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      userId: users[10].id, // Dr. Meera Iyer
      employeeId: 'IGSB-BA-001',
      name: users[10].name,
      email: users[10].email,
      designation: 'Associate Professor',
      specialization: 'Marketing & Consumer Behavior',
      experience: 11,
      qualifications: 'Ph.D. in Business Administration, IIM Ahmedabad',
      researchInterests: ['Consumer Psychology', 'Digital Marketing', 'Brand Management'],
      publications: 22,
      teachingSubjects: ['Marketing Management', 'Consumer Behavior', 'Digital Marketing'],
      achievements: ['Best Research Paper Award 2021', 'Consulted for 10+ companies'],
      departmentId: departments[3].id, // BA
      collegeId: igsbCollegeId,
      subjects: ['Marketing Management', 'Consumer Behavior', 'Digital Marketing'],
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      userId: users[11].id, // Prof. Karan Malhotra
      employeeId: 'IGSB-BA-002',
      name: users[11].name,
      email: users[11].email,
      designation: 'Assistant Professor',
      specialization: 'Finance & Investment Banking',
      experience: 7,
      qualifications: 'MBA Finance, IIM Bangalore',
      researchInterests: ['Investment Banking', 'Financial Markets', 'Risk Management'],
      publications: 8,
      teachingSubjects: ['Corporate Finance', 'Investment Banking', 'Financial Markets'],
      achievements: ['CFA Level 3 Candidate', 'Former Investment Banker'],
      departmentId: departments[3].id, // BA
      collegeId: igsbCollegeId,
      subjects: ['Corporate Finance', 'Investment Banking', 'Financial Markets'],
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      userId: users[12].id, // Dr. Anjali Desai
      employeeId: 'IGSB-FA-001',
      name: users[12].name,
      email: users[12].email,
      designation: 'Associate Professor',
      specialization: 'Fine Arts & Visual Communication',
      experience: 13,
      qualifications: 'MFA in Fine Arts, JJ School of Art',
      researchInterests: ['Visual Communication', 'Digital Art', 'Cultural Studies'],
      publications: 15,
      teachingSubjects: ['Visual Communication', 'Graphic Design', 'Art History'],
      achievements: ['National Art Exhibition Winner', 'Published art critic'],
      departmentId: departments[4].id, // FA
      collegeId: igsbCollegeId,
      subjects: ['Visual Communication', 'Graphic Design', 'Art History'],
      createdAt: new Date().toISOString(),
    },
  ];
  storage.set(STORAGE_KEYS.FACULTY, facultyProfiles);

  // Create comprehensive questions for both colleges
  const questions: Question[] = [
    // ICEM Questions
    { id: crypto.randomUUID(), collegeId: icemCollegeId, category: 'Student Information', text: 'Select Year', responseType: 'select', required: true, order: 1, options: ['1st Year', '2nd Year', '3rd Year', '4th Year'], createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: icemCollegeId, category: 'Student Information', text: 'Select Batch / DIV', responseType: 'select', required: true, order: 2, options: ['A', 'B', 'C', 'D'], createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: icemCollegeId, category: 'Student Information', text: 'Select Instructor Name', responseType: 'select', required: true, order: 3, options: ['Dr. Arjun Mehta', 'Prof. Kavita Joshi', 'Dr. Rohan Gupta', 'Prof. Deepak Sharma'], createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: icemCollegeId, category: 'Teaching Quality', text: 'How well does the teacher explain complex topics?', responseType: 'rating', required: true, order: 4, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: icemCollegeId, category: 'Class Engagement', text: 'How engaged did you feel during the class sessions?', responseType: 'rating', required: true, order: 5, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: icemCollegeId, category: 'Class Environment', text: 'Does the teacher create an open environment for students to share their opinions?', responseType: 'boolean', required: true, order: 6, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: icemCollegeId, category: 'Teaching Aids', text: 'How effectively does the teacher use visual aids (PPT, videos, charts, etc.) during the session?', responseType: 'rating', required: true, order: 7, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: icemCollegeId, category: 'Relevance', text: 'How well does the teacher relate the topics to real-world applications?', responseType: 'rating', required: true, order: 8, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: icemCollegeId, category: 'Query Handling', text: 'How well did the teacher handle student queries?', responseType: 'rating', required: true, order: 9, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: icemCollegeId, category: 'Project Learning', text: 'How valuable do you find the project-based learning activities in terms of skill development and practical knowledge?', responseType: 'rating', required: true, order: 10, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: icemCollegeId, category: 'Assignments', text: 'How effective were the assignments in helping you understand the subject better?', responseType: 'rating', required: true, order: 11, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: icemCollegeId, category: 'Additional Comments', text: 'Any additional feedback or comments you would like to share about the teacher?', responseType: 'text', required: false, order: 12, createdAt: new Date().toISOString() },

    // IGSB Questions
    { id: crypto.randomUUID(), collegeId: igsbCollegeId, category: 'Student Information', text: 'Select Year', responseType: 'select', required: true, order: 1, options: ['1st Year', '2nd Year'], createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: igsbCollegeId, category: 'Student Information', text: 'Select Batch / DIV', responseType: 'select', required: true, order: 2, options: ['A', 'B'], createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: igsbCollegeId, category: 'Student Information', text: 'Select Instructor Name', responseType: 'select', required: true, order: 3, options: ['Dr. Meera Iyer', 'Prof. Karan Malhotra', 'Dr. Anjali Desai'], createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: igsbCollegeId, category: 'Teaching Quality', text: 'How well does the teacher explain complex topics?', responseType: 'rating', required: true, order: 4, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: igsbCollegeId, category: 'Class Engagement', text: 'How engaged did you feel during the class sessions?', responseType: 'rating', required: true, order: 5, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: igsbCollegeId, category: 'Class Environment', text: 'Does the teacher create an open environment for students to share their opinions?', responseType: 'boolean', required: true, order: 6, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: igsbCollegeId, category: 'Teaching Aids', text: 'How effectively does the teacher use visual aids (PPT, videos, charts, etc.) during the session?', responseType: 'rating', required: true, order: 7, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: igsbCollegeId, category: 'Relevance', text: 'How well does the teacher relate the topics to real-world applications?', responseType: 'rating', required: true, order: 8, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: igsbCollegeId, category: 'Query Handling', text: 'How well did the teacher handle student queries?', responseType: 'rating', required: true, order: 9, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: igsbCollegeId, category: 'Project Learning', text: 'How valuable do you find the project-based learning activities in terms of skill development and practical knowledge?', responseType: 'rating', required: true, order: 10, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: igsbCollegeId, category: 'Assignments', text: 'How effective were the assignments in helping you understand the subject better?', responseType: 'rating', required: true, order: 11, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), collegeId: igsbCollegeId, category: 'Additional Comments', text: 'Any additional feedback or comments you would like to share about the teacher?', responseType: 'text', required: false, order: 12, createdAt: new Date().toISOString() },
  ];
  storage.set(STORAGE_KEYS.QUESTIONS, questions);

  // Create feedback cycles (active and completed)
  const feedbackCycles: FeedbackCycle[] = [
    // Active cycles
    {
      id: crypto.randomUUID(),
      name: 'Spring 2024 Mid-Semester Review',
      collegeId: icemCollegeId,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      accessMode: 'anonymous',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Spring 2024 Semester Feedback',
      collegeId: igsbCollegeId,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      accessMode: 'anonymous',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    // Completed cycles
    {
      id: crypto.randomUUID(),
      name: 'Fall 2023 End-Semester Review',
      collegeId: icemCollegeId,
      startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      accessMode: 'anonymous',
      status: 'completed',
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Fall 2023 Semester Feedback',
      collegeId: igsbCollegeId,
      startDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
      accessMode: 'anonymous',
      status: 'completed',
      createdAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  storage.set(STORAGE_KEYS.FEEDBACK_CYCLES, feedbackCycles);

  // Create comprehensive feedback sessions for January 10-15, 2026
  const feedbackSessions: FeedbackSession[] = [];

  // Helper function to create date in 2026
  const createDate2026 = (day: number, hour: number = 9) => {
    return new Date(2026, 0, day, hour, 0, 0, 0).toISOString();
  };

  // ICEM Engineering Sessions (January 10-15, 2026)
  const icemAcademicYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const icemBatches = ['A', 'B', 'C', 'D'];

  // Dr. Arjun Mehta (CSE) - Data Structures, Machine Learning, AI Fundamentals
  const arjunSubjects = ['Data Structures & Algorithms', 'Machine Learning', 'AI Fundamentals'];
  arjunSubjects.forEach((subject, subjectIndex) => {
    icemAcademicYears.forEach((year, yearIndex) => {
      icemBatches.forEach((batch, batchIndex) => {
        const sessionDay = 10 + (subjectIndex * 2) + Math.floor((yearIndex * icemBatches.length + batchIndex) / 8);
        if (sessionDay <= 15) {
          feedbackSessions.push({
            id: crypto.randomUUID(),
            collegeId: icemCollegeId,
            departmentId: departments[0].id,
            facultyId: facultyProfiles[0].id,
            course: 'Engineering',
            academicYear: year,
            subject: subject,
            batch: batch,
            accessMode: 'anonymous',
            uniqueUrl: `ds-ml-ai-${year.toLowerCase().replace(' ', '')}-${batch}-${sessionDay}-2026`,
            isActive: false, // All sessions are completed for demo
            expiresAt: createDate2026(sessionDay + 7),
            createdAt: createDate2026(sessionDay - 1, 8)
          });
        }
      });
    });
  });

  // Prof. Kavita Joshi (CSE) - Software Engineering, System Design, Web Technologies
  const kavitaSubjects = ['Software Engineering', 'System Design', 'Web Technologies'];
  kavitaSubjects.forEach((subject, subjectIndex) => {
    icemAcademicYears.forEach((year, yearIndex) => {
      icemBatches.forEach((batch, batchIndex) => {
        const sessionDay = 10 + (subjectIndex * 2) + Math.floor((yearIndex * icemBatches.length + batchIndex) / 8) + 1;
        if (sessionDay <= 15) {
          feedbackSessions.push({
            id: crypto.randomUUID(),
            collegeId: icemCollegeId,
            departmentId: departments[0].id,
            facultyId: facultyProfiles[1].id,
            course: 'Engineering',
            academicYear: year,
            subject: subject,
            batch: batch,
            accessMode: 'anonymous',
            uniqueUrl: `se-sys-web-${year.toLowerCase().replace(' ', '')}-${batch}-${sessionDay}-2026`,
            isActive: false,
            expiresAt: createDate2026(sessionDay + 7),
            createdAt: createDate2026(sessionDay - 1, 8)
          });
        }
      });
    });
  });

  // Dr. Rohan Gupta (IT) - Network Security, Cryptography, Ethical Hacking
  const rohanSubjects = ['Network Security', 'Cryptography', 'Ethical Hacking'];
  rohanSubjects.forEach((subject, subjectIndex) => {
    icemAcademicYears.forEach((year, yearIndex) => {
      icemBatches.forEach((batch, batchIndex) => {
        const sessionDay = 10 + (subjectIndex * 2) + Math.floor((yearIndex * icemBatches.length + batchIndex) / 8);
        if (sessionDay <= 15) {
          feedbackSessions.push({
            id: crypto.randomUUID(),
            collegeId: icemCollegeId,
            departmentId: departments[1].id,
            facultyId: facultyProfiles[2].id,
            course: 'Engineering',
            academicYear: year,
            subject: subject,
            batch: batch,
            accessMode: 'anonymous',
            uniqueUrl: `net-crypto-eth-${year.toLowerCase().replace(' ', '')}-${batch}-${sessionDay}-2026`,
            isActive: false,
            expiresAt: createDate2026(sessionDay + 7),
            createdAt: createDate2026(sessionDay - 1, 8)
          });
        }
      });
    });
  });

  // Prof. Deepak Sharma (ME) - Machine Design, Manufacturing Technology, CAD/CAM
  const deepakSubjects = ['Machine Design', 'Manufacturing Technology', 'CAD/CAM'];
  deepakSubjects.forEach((subject, subjectIndex) => {
    icemAcademicYears.forEach((year, yearIndex) => {
      icemBatches.forEach((batch, batchIndex) => {
        const sessionDay = 10 + (subjectIndex * 2) + Math.floor((yearIndex * icemBatches.length + batchIndex) / 8) + 1;
        if (sessionDay <= 15) {
          feedbackSessions.push({
            id: crypto.randomUUID(),
            collegeId: icemCollegeId,
            departmentId: departments[2].id,
            facultyId: facultyProfiles[3].id,
            course: 'Engineering',
            academicYear: year,
            subject: subject,
            batch: batch,
            accessMode: 'anonymous',
            uniqueUrl: `design-mfg-cad-${year.toLowerCase().replace(' ', '')}-${batch}-${sessionDay}-2026`,
            isActive: false,
            expiresAt: createDate2026(sessionDay + 7),
            createdAt: createDate2026(sessionDay - 1, 8)
          });
        }
      });
    });
  });

  // IGSB Business Sessions (January 10-15, 2026)
  const igsbAcademicYears = ['1st Year', '2nd Year'];
  const igsbBatches = ['A', 'B'];

  // Dr. Meera Iyer (BA) - Marketing Management, Consumer Behavior, Digital Marketing
  const meeraSubjects = ['Marketing Management', 'Consumer Behavior', 'Digital Marketing'];
  meeraSubjects.forEach((subject, subjectIndex) => {
    igsbAcademicYears.forEach((year, yearIndex) => {
      igsbBatches.forEach((batch, batchIndex) => {
        const sessionDay = 10 + subjectIndex * 2 + yearIndex + batchIndex;
        if (sessionDay <= 15) {
          feedbackSessions.push({
            id: crypto.randomUUID(),
            collegeId: igsbCollegeId,
            departmentId: departments[3].id,
            facultyId: facultyProfiles[4].id,
            course: 'MBA',
            academicYear: year,
            subject: subject,
            batch: batch,
            accessMode: 'anonymous',
            uniqueUrl: `marketing-consumer-digital-${year.toLowerCase().replace(' ', '')}-${batch}-${sessionDay}-2026`,
            isActive: false,
            expiresAt: createDate2026(sessionDay + 7),
            createdAt: createDate2026(sessionDay - 1, 8)
          });
        }
      });
    });
  });

  // Prof. Karan Malhotra (BA) - Corporate Finance, Investment Banking, Financial Markets
  const karanSubjects = ['Corporate Finance', 'Investment Banking', 'Financial Markets'];
  karanSubjects.forEach((subject, subjectIndex) => {
    igsbAcademicYears.forEach((year, yearIndex) => {
      igsbBatches.forEach((batch, batchIndex) => {
        const sessionDay = 10 + subjectIndex * 2 + yearIndex + batchIndex + 1;
        if (sessionDay <= 15) {
          feedbackSessions.push({
            id: crypto.randomUUID(),
            collegeId: igsbCollegeId,
            departmentId: departments[3].id,
            facultyId: facultyProfiles[5].id,
            course: 'MBA',
            academicYear: year,
            subject: subject,
            batch: batch,
            accessMode: 'anonymous',
            uniqueUrl: `finance-investment-markets-${year.toLowerCase().replace(' ', '')}-${batch}-${sessionDay}-2026`,
            isActive: false,
            expiresAt: createDate2026(sessionDay + 7),
            createdAt: createDate2026(sessionDay - 1, 8)
          });
        }
      });
    });
  });

  // Dr. Anjali Desai (FA) - Visual Communication, Graphic Design, Art History
  const anjaliSubjects = ['Visual Communication', 'Graphic Design', 'Art History'];
  anjaliSubjects.forEach((subject, subjectIndex) => {
    igsbAcademicYears.forEach((year, yearIndex) => {
      igsbBatches.forEach((batch, batchIndex) => {
        const sessionDay = 10 + subjectIndex * 2 + yearIndex + batchIndex;
        if (sessionDay <= 15) {
          feedbackSessions.push({
            id: crypto.randomUUID(),
            collegeId: igsbCollegeId,
            departmentId: departments[4].id,
            facultyId: facultyProfiles[6].id,
            course: 'MBA',
            academicYear: year,
            subject: subject,
            batch: batch,
            accessMode: 'anonymous',
            uniqueUrl: `visual-graphic-art-${year.toLowerCase().replace(' ', '')}-${batch}-${sessionDay}-2026`,
            isActive: false,
            expiresAt: createDate2026(sessionDay + 7),
            createdAt: createDate2026(sessionDay - 1, 8)
          });
        }
      });
    });
  });

  storage.set(STORAGE_KEYS.FEEDBACK_SESSIONS, feedbackSessions);

  // Create comprehensive feedback submissions for all sessions
  const feedbackSubmissions: FeedbackSubmission[] = [];

  // Helper function to generate random rating with bias (4.0-4.9 range for presentation)
  const getRandomRating = (baseRating: number, variance: number = 0.3) => {
    const min = Math.max(4.0, baseRating - variance);
    const max = Math.min(4.9, baseRating + variance);
    return Math.round((Math.random() * (max - min) + min) * 10) / 10;
  };

  // Helper function to get random boolean with bias
  const getRandomBoolean = (trueProbability: number = 0.8) => {
    return Math.random() < trueProbability;
  };

  // Helper function to get random comment
  const getRandomComment = (facultyName: string, subject: string, rating: number) => {
    const positiveComments = [
      `Excellent teaching by ${facultyName}. Very clear explanations.`,
      `${facultyName} makes ${subject} very interesting and easy to understand.`,
      `Great professor! Really helped me grasp the concepts in ${subject}.`,
      `${facultyName}'s teaching style is very engaging and practical.`,
      `Outstanding session on ${subject}. ${facultyName} is very knowledgeable.`,
      `Very helpful professor. Always ready to answer questions.`,
      `${facultyName} explains complex topics very well.`,
      `Great use of real-world examples in ${subject} class.`,
      `Very interactive and engaging sessions with ${facultyName}.`,
      `${facultyName} is very approachable and supportive.`
    ];

    const neutralComments = [
      `Good session on ${subject}. Could use more practical examples.`,
      `${facultyName} explains concepts well but pace could be better.`,
      `Decent teaching. ${subject} could be more engaging.`,
      `Average session. ${facultyName} knows the subject well.`,
      `Okay class. More interactive activities would help.`,
      `${facultyName} is knowledgeable but needs to improve presentation.`,
      `Good content but delivery could be better.`,
      `Decent professor. ${subject} sessions are informative.`
    ];

    const negativeComments = [
      `Needs improvement in teaching methodology.`,
      `Class pace is too fast. Hard to keep up.`,
      `More practical examples needed for ${subject}.`,
      `Could be more engaging and interactive.`,
      `Teaching style needs improvement.`,
      `Hard to understand some concepts.`,
      `More clarity needed in explanations.`,
      `Class could be more structured.`
    ];

    // All ratings are now 4.0+ for presentation - only positive comments
    const commentPool = positiveComments;

    return commentPool[Math.floor(Math.random() * commentPool.length)];
  };

  // Generate submissions for each session
  feedbackSessions.forEach((session, sessionIndex) => {
    const faculty = facultyProfiles.find(f => f.id === session.facultyId);
    if (!faculty) return;

    // Determine base rating based on faculty (4.0-4.9 range for realistic presentation)
    let baseRating;
    if (faculty.name === 'Dr. Arjun Mehta' || faculty.name === 'Dr. Meera Iyer') baseRating = 4.8;
    else if (faculty.name === 'Prof. Kavita Joshi' || faculty.name === 'Dr. Rohan Gupta') baseRating = 4.6;
    else if (faculty.name === 'Prof. Deepak Sharma' || faculty.name === 'Prof. Karan Malhotra') baseRating = 4.4;
    else baseRating = 4.2;

    // Generate 8-15 submissions per session
    const numSubmissions = Math.floor(Math.random() * 8) + 8;

    for (let i = 0; i < numSubmissions; i++) {
      const rating1 = getRandomRating(baseRating);
      const rating2 = getRandomRating(baseRating);
      const rating3 = getRandomRating(baseRating);
      const rating4 = getRandomRating(baseRating);
      const rating5 = getRandomRating(baseRating);
      const rating6 = getRandomRating(baseRating);
      const rating7 = getRandomRating(baseRating);

      const avgRating = Math.round((rating1 + rating2 + rating3 + rating4 + rating5 + rating6 + rating7) / 7);

      // Get appropriate questions based on college
      const sessionQuestions = questions.filter(q => q.collegeId === session.collegeId);

      if (sessionQuestions.length !== 12) {
        console.error('Wrong number of questions for college', session.collegeId, sessionQuestions.length);
        return;
      }

      const submission: FeedbackSubmission = {
        id: crypto.randomUUID(),
        sessionId: session.id,
        facultyId: session.facultyId,
        collegeId: session.collegeId,
        responses: [
          { questionId: sessionQuestions[0].id, selectValue: session.academicYear },
          { questionId: sessionQuestions[1].id, selectValue: session.batch },
          { questionId: sessionQuestions[2].id, selectValue: faculty.name },
          { questionId: sessionQuestions[3].id, rating: rating1 },
          { questionId: sessionQuestions[4].id, rating: rating2 },
          { questionId: sessionQuestions[5].id, booleanValue: getRandomBoolean(baseRating >= 4 ? 0.9 : 0.7) },
          { questionId: sessionQuestions[6].id, rating: rating3 },
          { questionId: sessionQuestions[7].id, rating: rating4 },
          { questionId: sessionQuestions[8].id, rating: rating5 },
          { questionId: sessionQuestions[9].id, rating: rating6 },
          { questionId: sessionQuestions[10].id, rating: rating7 },
          { questionId: sessionQuestions[11].id, comment: Math.random() > 0.3 ? getRandomComment(faculty.name, session.subject, avgRating) : undefined }
        ].filter(response => response !== undefined),
        submittedAt: new Date(new Date(session.expiresAt).getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      feedbackSubmissions.push(submission);
    }
  });

  storage.set(STORAGE_KEYS.FEEDBACK_SUBMISSIONS, feedbackSubmissions);
};

export const resetDemoData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => storage.remove(key));
  initializeDemoData();
};
