import SchoolHeader from "../components/schools/SchoolHeader";
import SchoolOverview from "../components/schools/SchoolOverview";
import SchoolContact from "../components/schools/SchoolContact";

function SchoolDetails({ school, onViewCourses, onViewAdmission }) {
  if (!school) {
    return <div className="page"><div className="empty-state"><h2>No college selected</h2><p>Return to the directory and choose a college.</p></div></div>;
  }

  return (
    <div className="page">
      <button className="back-link" onClick={() => window.history.length > 1 && window.history.back()}>← Back</button>
      <SchoolHeader school={school} />
      <div className="details-grid">
        <div className="details-main">
          <SchoolOverview school={school} />
          <section className="content-card">
            <h2>Academic information</h2>
            <p>{school.courses?.length || 0} program(s) currently listed in this profile.</p>
            <div className="program-chips">
              {(school.courses || []).map((course) => <span key={course.id}>{course.abbreviation || course.name}</span>)}
              {!school.courses?.length && <span>No programs encoded yet</span>}
            </div>
            <button className="button button-primary" onClick={onViewCourses}>Explore courses and curriculum</button>
          </section>
        </div>
        <div className="details-side">
          <SchoolContact school={school} />
          <section className="content-card">
            <h2>Admission</h2>
            <p>View applicant categories, requirements, and the application process.</p>
            <button className="button button-outline" onClick={onViewAdmission}>View admission information</button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default SchoolDetails;
