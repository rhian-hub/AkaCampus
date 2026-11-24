import { useState } from "react";
import { tuitionBySchool } from "./tuitionData";

const YEAR_LABELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const SEMESTERS = ["First Semester", "Second Semester"];

const peso = (n) =>
  "₱" +
  n.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function SourceBadge({ source }) {
  return source === "official" ? (
    <span className="badge official">Official school rate</span>
  ) : (
    <span className="badge estimate">Estimate, not an official school rate</span>
  );
}

function TuitionFees() {
  const [schoolId, setSchoolId] = useState(tuitionBySchool[0].id);
  const [programName, setProgramName] = useState(tuitionBySchool[0].programs[0].name);
  const [semester, setSemester] = useState(SEMESTERS[0]);

  const school = tuitionBySchool.find((s) => s.id === schoolId);
  const program =
    school.programs.find((p) => p.name === programName) ?? school.programs[0];

  const handleSchool = (e) => {
    const next = tuitionBySchool.find((s) => s.id === Number(e.target.value));
    setSchoolId(next.id);
    setProgramName(next.programs[0].name);
  };

  return (
    <section className="tuition-fees">
      <h1>Tuition Fees</h1>
      <p className="subtitle">Colleges in Aklan: per-semester fees</p>

      <div className="controls">
        <label>
          School
          <select value={schoolId} onChange={handleSchool}>
            {tuitionBySchool.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Program / Course
          <select value={program.name} onChange={(e) => setProgramName(e.target.value)}>
            {school.programs.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <SourceBadge source={program.source} />

      {/* Official: per year level, with semester tabs */}
      {program.years && (
        <>
          <div className="tabs" role="tablist">
            {SEMESTERS.map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={semester === s}
                className={semester === s ? "tab active" : "tab"}
                onClick={() => setSemester(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <table>
            <thead>
              <tr>
                <th>Year level</th>
                <th>General Fee</th>
                <th>Tuition Fee</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {program.years[semester].map(([general, tuition], i) => (
                <tr key={YEAR_LABELS[i]}>
                  <td>{YEAR_LABELS[i]}</td>
                  <td>{peso(general)}</td>
                  <td>{tuition === 0 ? "Free" : peso(tuition)}</td>
                  <td className="total">{peso(general + tuition)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* TESDA / short course: first and second semester fees */}
      {program.semesters && (
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>General Fee</th>
              <th>Tuition Fee</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {SEMESTERS.map((s) => {
              const [general, tuition] = program.semesters[s];
              return (
                <tr key={s}>
                  <td>{s}</td>
                  <td>{peso(general)}</td>
                  <td>{tuition === 0 ? "Free" : peso(tuition)}</td>
                  <td className="total">{peso(general + tuition)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {program.note && <p className="note">{program.note}</p>}
      <p className="note">
        {program.source === "official"
          ? "Estimates from the college's published fee page. Actual assessment depends on your enrolled subjects and may change."
          : "Placeholder figure. Contact the school's registrar for the actual fee."}
      </p>

      <style>{`
        .tuition-fees { max-width: 760px; margin: 0 auto; padding: 16px; font-family: system-ui, sans-serif; }
        .tuition-fees h1 { margin: 0; font-size: 1.5rem; }
        .tuition-fees .subtitle { margin: 4px 0 16px; color: #555; }
        .tuition-fees .controls { display: grid; gap: 12px; grid-template-columns: 1fr 1fr; margin-bottom: 12px; }
        .tuition-fees label { display: flex; flex-direction: column; gap: 4px; font-size: 0.85rem; color: #333; }
        .tuition-fees select { padding: 8px; font-size: 1rem; }
        .tuition-fees .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 0.8rem; margin-bottom: 12px; }
        .tuition-fees .badge.official { background: #dcfce7; color: #166534; }
        .tuition-fees .badge.estimate { background: #fef3c7; color: #92400e; }
        .tuition-fees .tabs { display: flex; gap: 6px; margin-bottom: 12px; }
        .tuition-fees .tab { padding: 6px 12px; border: 1px solid #99a; background: #fff; border-radius: 6px; cursor: pointer; }
        .tuition-fees .tab.active { background: #1f3a8a; color: #fff; border-color: #1f3a8a; }
        .tuition-fees table { width: 100%; border-collapse: collapse; }
        .tuition-fees th { background: #a9b4cf; text-align: left; }
        .tuition-fees th, .tuition-fees td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
        .tuition-fees td.total { font-weight: 700; color: #c00; }
        .tuition-fees .note { font-size: 0.85rem; color: #666; margin-top: 12px; }
        @media (max-width: 560px) {
          .tuition-fees .controls { grid-template-columns: 1fr; }
          .tuition-fees th, .tuition-fees td { padding: 6px 4px; font-size: 0.85rem; }
        }
      `}</style>
    </section>
  );
}

export default TuitionFees;