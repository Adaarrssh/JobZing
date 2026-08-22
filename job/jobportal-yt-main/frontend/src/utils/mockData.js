// Safe JSON Parsing & Multi-Recruiter / Multi-Portal Mock Engine for JobZing

export const INITIAL_COMPANIES = [
  {
    _id: "comp_1",
    name: "Google Tech Hub",
    description: "Organizing the world's information and building cutting-edge web & AI systems.",
    website: "https://careers.google.com",
    location: "Bangalore, India",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    created_by: "user_recruiter_1",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    _id: "comp_2",
    name: "Microsoft Cloud",
    description: "Empowering every person and organization through cloud computing and Azure AI.",
    website: "https://careers.microsoft.com",
    location: "Hyderabad, India",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    created_by: "user_recruiter_2",
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    _id: "comp_3",
    name: "Amazon Systems",
    description: "Building resilient distributed cloud infrastructure and e-commerce platforms.",
    website: "https://amazon.jobs",
    location: "Bangalore, India",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    created_by: "user_recruiter_3",
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    _id: "comp_4",
    name: "Zomato Tech",
    description: "India's premier restaurant discovery and food logistics platform.",
    website: "https://zomato.com/careers",
    location: "Gurugram, India",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg",
    created_by: "user_recruiter_4",
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    _id: "comp_5",
    name: "Swiggy Delivery",
    description: "On-demand food delivery and quick-commerce logistics network.",
    website: "https://careers.swiggy.com",
    location: "Bangalore, India",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg",
    created_by: "user_recruiter_5",
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
];

export const INITIAL_JOBS = [
  // RECRUITER 1 (Priya Patel @ Google Tech Hub)
  {
    _id: "job_1",
    title: "Senior Full Stack React & Node Developer",
    description: "We are seeking an experienced Full Stack Developer to build scalable, high-performance web applications using React, Node.js, Next.js, and Cloud native infrastructure.",
    requirements: ["React.js", "Node.js", "Express", "MongoDB", "TypeScript", "Tailwind CSS", "REST APIs"],
    salary: "24 - 32",
    location: "Bangalore",
    jobType: "Full-Time",
    experienceLevel: "3-5 Years",
    position: 4,
    company: INITIAL_COMPANIES[0],
    created_by: "user_recruiter_1",
    source: "JobZing Direct",
    sourcePortal: "JobZing",
    externalUrl: "",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    applications: [
      {
        _id: "app_1",
        applicant: {
          _id: "user_seeker_1",
          fullname: "Rahul Sharma",
          email: "seeker@jobzing.com",
          phoneNumber: "+91 98765 43210",
          profile: {
            bio: "Passionate Frontend & Full Stack Developer with 3+ years of experience building React apps.",
            skills: ["React", "JavaScript", "Node.js", "Tailwind CSS", "Redux"],
            resume: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            resumeOriginalName: "Rahul_Sharma_Resume.pdf"
          },
          createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
        },
        status: "accepted",
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ]
  },
  {
    _id: "job_6",
    title: "Frontend UI Specialist (React / Redux)",
    description: "Build delightful customer-facing dashboards and design systems for enterprise scale applications.",
    requirements: ["React.js", "Redux", "Tailwind CSS", "TypeScript", "Responsive Design"],
    salary: "18 - 25",
    location: "Bangalore",
    jobType: "Full-Time",
    experienceLevel: "2-4 Years",
    position: 2,
    company: INITIAL_COMPANIES[0],
    created_by: "user_recruiter_1",
    source: "JobZing Direct",
    sourcePortal: "JobZing",
    externalUrl: "",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    applications: []
  },

  // OTHER RECRUITERS & AGGREGATED JOBS
  {
    _id: "job_2",
    title: "AI / Machine Learning Engineer",
    description: "Join Azure AI team to build, train, and fine-tune large language model (LLM) pipelines and multimodal agents.",
    requirements: ["Python", "PyTorch", "LangChain", "LLMs", "Vector DBs", "FastAPI", "Docker"],
    salary: "28 - 38",
    location: "Hyderabad",
    jobType: "Full-Time",
    experienceLevel: "2-5 Years",
    position: 3,
    company: INITIAL_COMPANIES[1],
    created_by: "user_recruiter_2",
    source: "LinkedIn",
    sourcePortal: "LinkedIn",
    externalUrl: "https://www.linkedin.com/jobs",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    applications: []
  },
  {
    _id: "job_3",
    title: "Quick-Commerce Frontend Engineer",
    description: "Swiggy is hiring a Frontend UI Specialist to craft blazingly fast quick-commerce user interfaces.",
    requirements: ["React.js", "Next.js", "Tailwind CSS", "Framer Motion", "Web Performance"],
    salary: "18 - 26",
    location: "Bangalore",
    jobType: "Full-Time",
    experienceLevel: "2-4 Years",
    position: 2,
    company: INITIAL_COMPANIES[4],
    created_by: "user_recruiter_5",
    source: "Naukri.com",
    sourcePortal: "Naukri",
    externalUrl: "https://www.naukri.com",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    applications: []
  },
  {
    _id: "job_4",
    title: "Backend Cloud Infrastructure Engineer (Go / AWS)",
    description: "Amazon Web Services (AWS) is looking for backend engineers to design mission-critical distributed computing layers.",
    requirements: ["Go", "Java", "AWS", "Kubernetes", "Microservices", "PostgreSQL", "Kafka"],
    salary: "30 - 45",
    location: "Bangalore",
    jobType: "Full-Time",
    experienceLevel: "4-7 Years",
    position: 5,
    company: INITIAL_COMPANIES[2],
    created_by: "user_recruiter_3",
    source: "Indeed",
    sourcePortal: "Indeed",
    externalUrl: "https://www.indeed.com",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    applications: []
  },
  {
    _id: "job_5",
    title: "Product Designer (Figma, Design Systems)",
    description: "Lead end-to-end product design for Zomato delivery apps and merchant dashboards.",
    requirements: ["Figma", "UI/UX Design", "User Research", "Wireframing", "Design Systems"],
    salary: "16 - 22",
    location: "Gurugram",
    jobType: "Full-Time",
    experienceLevel: "1-3 Years",
    position: 2,
    company: INITIAL_COMPANIES[3],
    created_by: "user_recruiter_4",
    source: "Glassdoor",
    sourcePortal: "Glassdoor",
    externalUrl: "https://www.glassdoor.com",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    applications: []
  },
  {
    _id: "job_7",
    title: "Junior React Developer & Frontend Intern",
    description: "Great opportunity for freshers to join a high-growth startup environment and build live client dashboards.",
    requirements: ["React", "JavaScript", "HTML5", "CSS3", "Git", "Tailwind CSS"],
    salary: "6 - 10",
    location: "Pune",
    jobType: "Internship / Full-Time",
    experienceLevel: "Fresher / 0-1 Year",
    position: 6,
    company: {
      _id: "comp_7",
      name: "NovaTech Solutions",
      description: "Digital transformation and SaaS software development studio.",
      website: "https://novatech.io",
      location: "Pune, India",
      logo: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=150&auto=format&fit=crop&q=80",
      created_by: "user_recruiter_6",
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
    },
    created_by: "user_recruiter_6",
    source: "Wellfound (AngelList)",
    sourcePortal: "Wellfound",
    externalUrl: "https://wellfound.com",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    applications: []
  }
];

export const DEMO_USERS = {
  seeker: {
    _id: "user_seeker_1",
    fullname: "Rahul Sharma",
    email: "seeker@jobzing.com",
    phoneNumber: "+91 98765 43210",
    role: "student",
    profile: {
      bio: "Passionate Full Stack & React Developer building next-gen web applications and AI tools.",
      skills: ["React.js", "JavaScript", "TypeScript", "Node.js", "Tailwind CSS", "MongoDB", "Redux"],
      resume: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      resumeOriginalName: "Rahul_Sharma_Resume.pdf",
      profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
    }
  },
  recruiter: {
    _id: "user_recruiter_1",
    fullname: "Priya Patel",
    email: "recruiter@jobzing.com",
    phoneNumber: "+91 91234 56789",
    role: "recruiter",
    profile: {
      bio: "Lead Technical Talent Acquisition Partner at Google Tech Hub.",
      companyName: "Google Tech Hub",
      profilePhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
    }
  }
};

// Storage keys
const STORAGE_KEYS = {
  JOBS: "jobzing_jobs_v4",
  COMPANIES: "jobzing_companies_v4",
  SAVED_JOBS: "jobzing_saved_jobs_v4",
  REGISTERED_USERS: "jobzing_users_v4"
};

// Safe JSON parser helper to prevent any JSON parsing crash
const safeJsonParse = (str, fallback) => {
  if (!str || str === "undefined" || str === "null" || str === "[object Object]") {
    return fallback;
  }
  try {
    const parsed = JSON.parse(str);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn("safeJsonParse: invalid JSON string, falling back to default", err);
    return fallback;
  }
};

export const getStoredJobs = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const data = localStorage.getItem(STORAGE_KEYS.JOBS);
      const parsed = safeJsonParse(data, null);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
    }
  } catch (e) {
    console.error("Storage error in getStoredJobs:", e);
  }
  return INITIAL_JOBS;
};

export const saveStoredJobs = (jobs) => {
  try {
    if (typeof window !== "undefined" && window.localStorage && Array.isArray(jobs)) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    }
  } catch (e) {
    console.error("Storage error in saveStoredJobs:", e);
  }
};

export const getStoredCompanies = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const data = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      const parsed = safeJsonParse(data, null);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(INITIAL_COMPANIES));
    }
  } catch (e) {
    console.error("Storage error in getStoredCompanies:", e);
  }
  return INITIAL_COMPANIES;
};

export const saveStoredCompanies = (companies) => {
  try {
    if (typeof window !== "undefined" && window.localStorage && Array.isArray(companies)) {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
    }
  } catch (e) {
    console.error("Storage error in saveStoredCompanies:", e);
  }
};

export const getStoredSavedJobs = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
      const parsed = safeJsonParse(data, []);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Storage error in getStoredSavedJobs:", e);
  }
  return [];
};

export const saveStoredSavedJobs = (savedIds) => {
  try {
    if (typeof window !== "undefined" && window.localStorage && Array.isArray(savedIds)) {
      localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(savedIds));
    }
  } catch (e) {
    console.error("Storage error in saveStoredSavedJobs:", e);
  }
};

export const getRegisteredUsers = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      const parsed = safeJsonParse(data, null);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Storage error in getRegisteredUsers:", e);
  }
  return [DEMO_USERS.seeker, DEMO_USERS.recruiter];
};

export const saveRegisteredUser = (newUser) => {
  try {
    if (typeof window !== "undefined" && window.localStorage && newUser) {
      const existing = getRegisteredUsers();
      const updated = [...existing.filter((u) => u.email !== newUser.email), newUser];
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(updated));
    }
  } catch (e) {
    console.error("Storage error in saveRegisteredUser:", e);
  }
};
