import AdmissionRequirements from "../components/admission/AdmissionRequirements";
import AdmissionSteps from "../components/admission/AdmissionSteps";

function AdmissionPage({ school, requirements = [], steps = [] }) {
  if (!school) {
    return <div className="page"><div className="empty-state"><h2>Select a college first</h2></div></div>;
  }

  return (
    <div className="page">
      <section className="page-intro compact">
        <span className="eyebrow">{school.name}</span>
        <h1>Admission information</h1>
        <p>Review the available applicant requirements and application process.</p>
      </section>

      <div className="admission-layout">
        <section>
          <div className="section-heading"><div><h2>Admission requirements</h2><p className="muted">Requirements are grouped by applicant category.</p></div></div>
          <AdmissionRequirements requirements={requirements} />
        </section>
        <aside className="content-card admission-process">
          <span className="eyebrow">HOW TO APPLY</span>
          <h2>Application process</h2>
          <AdmissionSteps steps={steps} />
        </aside>
      </div>

      <div className="notice">
        <strong>Important:</strong> Admission requirements, deadlines, fees, and procedures may change. Confirm the latest details directly with {school.name}'s official admission office.
      </div>
    </div>
  );
}

export default AdmissionPage;
