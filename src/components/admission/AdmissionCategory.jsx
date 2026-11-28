function AdmissionCategory({ category }) {
  return (
    <section className="semester-card">
      <h3 className="admission-category-title">{category.category}</h3>
      <ul className="subject-list">
        {(category.items || []).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
      </ul>
    </section>
  );
}

export default AdmissionCategory;
