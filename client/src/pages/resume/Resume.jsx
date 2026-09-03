import ResumeUpload from "../../components/resume/ResumeUpload";
import ResumeAnalysis from "../../components/resume/ResumeAnalysis";
import SkillGap from "../../components/resume/SkillGap";

const Resume = () => {
  return (
    <main className="page-container">
      <section className="resume-page">
        <div className="section-header">
          <div>
            <h1>My Resume</h1>
            <p>Upload your resume and analyze your career profile.</p>
          </div>
        </div>

        <div className="resume-sections">
          <ResumeUpload />
          <ResumeAnalysis />
          <SkillGap />
        </div>
      </section>
    </main>
  );
};

export default Resume;
