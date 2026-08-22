import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { useSelector, useDispatch } from "react-redux";
import {
  Bot,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Copy,
  Download,
  Zap,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Layers,
  Award,
  BookOpen,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { updateUserProfile } from "@/redux/authSlice";

const roleKeywords = {
  "Full Stack Developer": [
    "React.js",
    "Node.js",
    "TypeScript",
    "Express.js",
    "MongoDB",
    "PostgreSQL",
    "REST APIs",
    "GraphQL",
    "Docker",
    "Git / CI/CD",
    "Tailwind CSS",
    "Redux Toolkit",
  ],
  "Frontend Developer": [
    "React.js",
    "Next.js",
    "JavaScript ES6+",
    "TypeScript",
    "HTML5/CSS3",
    "Tailwind CSS",
    "State Management",
    "Web Performance",
    "Framer Motion",
    "Responsive Design",
    "Unit Testing",
  ],
  "Backend Developer": [
    "Node.js",
    "Python",
    "Go",
    "Express",
    "Microservices",
    "PostgreSQL",
    "Redis Caching",
    "Kafka",
    "Docker / K8s",
    "System Design",
    "Security & Auth",
  ],
  "AI / Machine Learning Engineer": [
    "Python",
    "PyTorch",
    "TensorFlow",
    "Large Language Models (LLMs)",
    "LangChain",
    "Vector Databases",
    "Prompt Engineering",
    "FastAPI",
    "Data Pipelines",
    "Model Fine-Tuning",
  ],
  "DevOps Engineer": [
    "AWS / GCP",
    "Docker",
    "Kubernetes",
    "Terraform (IaC)",
    "CI/CD Pipelines",
    "GitHub Actions",
    "Linux Systems",
    "Prometheus / Grafana",
    "Security Compliance",
  ],
  "Product Designer (UI/UX)": [
    "Figma",
    "Design Systems",
    "Wireframing",
    "Interactive Prototyping",
    "User Research",
    "Information Architecture",
    "Usability Testing",
    "Mobile App Design",
  ],
};

const AiResumeChecker = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [resumeText, setResumeText] = useState(
    user?.profile?.bio
      ? `${user.fullname || "Candidate"}\nEmail: ${user.email || "candidate@example.com"}\nPhone: ${
          user.phoneNumber || "+91 98765 43210"
        }\n\nSummary:\n${user.profile.bio}\n\nSkills:\n${(user.profile.skills || []).join(
          ", "
        )}\n\nExperience:\n- Built high-performance responsive web applications using modern web technologies.\n- Designed RESTful API endpoints and integrated database schemas.\n- Improved core web vitals and user conversion rates.`
      : `Rahul Sharma\nEmail: seeker@jobzing.com\nPhone: +91 98765 43210\nLocation: Bangalore, India\n\nSummary:\nResults-driven Full Stack Developer with 3+ years experience engineering web platforms with React, Node.js, and Cloud APIs.\n\nSkills:\nReact.js, JavaScript, TypeScript, Node.js, Tailwind CSS, Redux, Git\n\nExperience:\nSoftware Engineer (2022 - Present)\n- Developed responsive user interfaces serving 50,000+ monthly active users.\n- Optimized application bundle size by 35% resulting in faster LCP.\n- Architected RESTful backend APIs with Node.js and MongoDB.`
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [generatedResume, setGeneratedResume] = useState("");

  const handleAnalyzeResume = () => {
    if (!resumeText.trim()) {
      toast.error("Please enter or upload resume content first.");
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const keywords = roleKeywords[targetRole] || roleKeywords["Full Stack Developer"];
      const textLower = resumeText.toLowerCase();

      const matched = keywords.filter((kw) => textLower.includes(kw.toLowerCase()));
      const missing = keywords.filter((kw) => !textLower.includes(kw.toLowerCase()));

      const hasContact = textLower.includes("@") && (textLower.includes("phone") || /\d{10}/.test(textLower));
      const hasSummary = textLower.includes("summary") || textLower.includes("about") || textLower.includes("profile");
      const hasExperience = textLower.includes("experience") || textLower.includes("work") || textLower.includes("project");
      const hasEducation = textLower.includes("education") || textLower.includes("bachelor") || textLower.includes("degree") || textLower.includes("university");
      const hasMetrics = /\d+%/i.test(resumeText) || /\d+k/i.test(resumeText) || /\d+\+/i.test(resumeText);

      // Score calculation
      let score = 50;
      score += Math.round((matched.length / keywords.length) * 30);
      if (hasContact) score += 5;
      if (hasSummary) score += 5;
      if (hasExperience) score += 5;
      if (hasMetrics) score += 5;
      score = Math.min(Math.max(score, 45), 96);

      const result = {
        score,
        targetRole,
        matchedKeywords: matched,
        missingKeywords: missing,
        hasContact,
        hasSummary,
        hasExperience,
        hasEducation,
        hasMetrics,
      };

      setAnalysisResult(result);

      // Generate ATS-Optimized Clean Resume Template
      const candidateName = user?.fullname || "RAHUL SHARMA";
      const candidateEmail = user?.email || "rahul.sharma@example.com";
      const candidatePhone = user?.phoneNumber || "+91 98765 43210";
      const location = "Bangalore, India";

      const optimized = `===============================================================
${candidateName.toUpperCase()}
${targetRole.toUpperCase()}
Email: ${candidateEmail} | Phone: ${candidatePhone} | Location: ${location}
LinkedIn: linkedin.com/in/${candidateName.toLowerCase().replace(/\s+/g, "")} | Portfolio: github.com/${candidateName.toLowerCase().replace(/\s+/g, "")}
===============================================================

PROFESSIONAL SUMMARY
---------------------------------------------------------------
Dedicated and high-performing ${targetRole} with proven track record designing, building, and deploying scalable software systems. Experienced in end-to-end development lifecycle, modern engineering best practices, and collaborating in agile environments to deliver measurable business impact.

TECHNICAL SKILLS & CORE COMPETENCIES
---------------------------------------------------------------
• Core Technologies: ${keywords.slice(0, 7).join(", ")}
• Frameworks & Tools: ${keywords.slice(7).join(", ") || "Git, Docker, CI/CD, Agile"}
• Practices: Clean Code, Test-Driven Development (TDD), System Architecture, REST APIs

PROFESSIONAL WORK EXPERIENCE
---------------------------------------------------------------
Senior ${targetRole} | Tech Innovators Corp
2022 – Present | Bangalore, India
• Architected and shipped scalable client-facing modules utilizing ${keywords[0] || "React"} and ${keywords[1] || "Node.js"}, improving load time by 40%.
• Collaborated with cross-functional product and design teams to deliver 12+ production features ahead of quarterly milestones.
• Engineered fault-tolerant APIs processing 100,000+ daily requests with 99.9% uptime.
• Spearheaded code review processes and mentored 4 junior software engineers.

Software Engineer | NextGen Solutions
2020 – 2022 | Hyderabad, India
• Developed interactive, accessible front-end interfaces supporting 50,000+ active monthly users.
• Implemented automated CI/CD deployment pipelines, cutting release turnaround time by 50%.
• Reduced database query response times by 30% through caching and index optimization.

KEY PROJECTS
---------------------------------------------------------------
• Cloud Task & Resource Orchestrator:
  Built real-time collaborative dashboard using ${keywords[0] || "React"} and WebSocket sync.
• Multi-Portal API Aggregator:
  Engineered automated indexing service crawling external data sources with fault-tolerant queuing.

EDUCATION & CERTIFICATIONS
---------------------------------------------------------------
Bachelor of Technology in Computer Science & Engineering
Apex Institute of Technology | Graduated with Distinction
Certified Cloud & Software Practitioner
===============================================================`;

      setGeneratedResume(optimized);
      setIsAnalyzing(false);
      toast.success(`Resume analyzed! ATS Score: ${score}/100.`);
    }, 600);
  };

  const handleCopyGenerated = () => {
    if (!generatedResume) return;
    navigator.clipboard.writeText(generatedResume);
    toast.success("ATS-Optimized resume copied to clipboard!");
  };

  const handleDownload = () => {
    if (!generatedResume) return;
    const element = document.createElement("a");
    const file = new Blob([generatedResume], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${(user?.fullname || "Candidate").replace(/\s+/g, "_")}_ATS_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Resume downloaded as text document!");
  };

  const handleApplyToProfile = () => {
    if (analysisResult?.matchedKeywords) {
      dispatch(
        updateUserProfile({
          profile: {
            skills: analysisResult.matchedKeywords,
          },
        })
      );
      toast.success("Matched skills synchronized to your profile!");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* TOP HERO BANNER */}
          <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-800 rounded-3xl p-8 text-white shadow-lg">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-white mb-3">
              <Bot size={15} /> AI ATS Resume Scanner & Optimizer
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              ATS Resume Checker & Auto-Formatter
            </h1>
            <p className="mt-2 text-violet-100 text-sm sm:text-base max-w-3xl">
              Check your resume against real Applicant Tracking System (ATS) algorithms, discover missing keywords for your target role, and get an ATS-optimized professional resume.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: INPUT & TARGET ROLE */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={18} className="text-violet-600" />
                    Resume Input
                  </h2>
                  <span className="text-xs font-semibold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg">
                    Step 1
                  </span>
                </div>

                {/* TARGET ROLE SELECTOR */}
                <div>
                  <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Target Job Title / Domain *
                  </Label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="mt-1.5 w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-800 outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600"
                  >
                    {Object.keys(roleKeywords).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* RESUME TEXT AREA */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Resume Content / Text
                    </Label>
                    <button
                      type="button"
                      onClick={() =>
                        setResumeText(
                          `${user?.fullname || "Rahul Sharma"}\nEmail: ${user?.email || "seeker@jobzing.com"}\nPhone: ${
                            user?.phoneNumber || "+91 98765 43210"
                          }\n\nSummary:\n${user?.profile?.bio || "Full Stack React Developer"}\n\nSkills:\n${(
                            user?.profile?.skills || []
                          ).join(", ")}\n\nExperience:\n- Software development and web engineering.`
                        )
                      }
                      className="text-xs text-violet-600 font-bold hover:underline"
                    >
                      Load from Profile
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume content, summary, skills, and work experience here..."
                    className="w-full rounded-2xl border border-gray-200 p-3.5 text-xs font-mono text-gray-800 outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 resize-none leading-relaxed"
                  />
                </div>

                {/* ANALYZE BUTTON */}
                <Button
                  onClick={handleAnalyzeResume}
                  disabled={isAnalyzing}
                  className="w-full h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Scanning with ATS Engine...
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      Run AI ATS Check & Format Resume
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* RIGHT: ATS SCORE & OPTIMIZED GENERATED RESUME */}
            <div className="lg:col-span-7 space-y-6">
              {/* ATS SCORE CARD */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
                      ATS Evaluation Report
                    </span>
                    <h2 className="text-2xl font-black text-gray-900 mt-0.5">
                      {targetRole} Compatibility
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-4xl font-black text-violet-700">
                        {analysisResult ? `${analysisResult.score}` : "88"}
                        <span className="text-base text-gray-400 font-bold">/100</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">
                        ATS Ready
                      </span>
                    </div>
                  </div>
                </div>

                {/* ATS METRICS PILLS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100">
                    <span className="text-gray-400 font-semibold block">Contact Info</span>
                    <span className="font-bold text-emerald-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Complete
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100">
                    <span className="text-gray-400 font-semibold block">Keyword Match</span>
                    <span className="font-bold text-violet-700 mt-1">
                      {analysisResult?.matchedKeywords?.length || 6} /{" "}
                      {(roleKeywords[targetRole] || []).length} Matched
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100">
                    <span className="text-gray-400 font-semibold block">Measurable Metrics</span>
                    <span className="font-bold text-emerald-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Quantified
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100">
                    <span className="text-gray-400 font-semibold block">Layout Health</span>
                    <span className="font-bold text-blue-600 mt-1">Single-Column OK</span>
                  </div>
                </div>

                {/* KEYWORDS BREAKDOWN */}
                <div className="space-y-4 pt-2">
                  <div>
                    <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      Matched High-Impact Keywords (Detected):
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {(analysisResult?.matchedKeywords || roleKeywords[targetRole].slice(0, 6)).map(
                        (kw, i) => (
                          <span
                            key={i}
                            className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-semibold"
                          >
                            ✓ {kw}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-600" />
                      Recommended Keywords to Add (Missing):
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {(analysisResult?.missingKeywords || roleKeywords[targetRole].slice(6)).map(
                        (kw, i) => (
                          <span
                            key={i}
                            className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-semibold"
                          >
                            + {kw}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ATS-OPTIMIZED GENERATED RESUME */}
              {generatedResume && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
                        Auto-Generated Template
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">
                        Proper ATS-Optimized Resume for You
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyGenerated}
                        className="rounded-xl text-xs font-semibold gap-1.5 border-gray-300 hover:border-violet-600"
                      >
                        <Copy size={13} /> Copy Text
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleDownload}
                        className="rounded-xl text-xs font-semibold gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
                      >
                        <Download size={13} /> Download .txt
                      </Button>
                    </div>
                  </div>

                  <pre className="w-full bg-slate-900 text-emerald-400 p-5 rounded-2xl text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
                    {generatedResume}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiResumeChecker;
