import AdmissionCategory from "./AdmissionCategory";

function AdmissionRequirements({ requirements }) {
  if (!requirements?.length) {
    return <div className="empty-state"><p>Admission requirements have not been provided by this college yet.</p></div>;
  }

  return (
    <div className="admission-category-list">
      {requirements.map((category, index) => (
        <AdmissionCategory key={`${category.category}-${index}`} category={category} />
      ))}
    </div>
  );
}

export default AdmissionRequirements;
