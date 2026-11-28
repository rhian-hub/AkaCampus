function AdmissionSteps({ steps }) {
  if (!steps?.length) {
    return <p className="muted">Application steps have not been provided yet.</p>;
  }

  return (
    <ol className="steps-list">
      {steps.map((step, index) => <li key={`${step}-${index}`}><span>{step}</span></li>)}
    </ol>
  );
}

export default AdmissionSteps;
