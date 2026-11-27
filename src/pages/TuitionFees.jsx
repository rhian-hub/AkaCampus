import { useState } from "react";

/* =====================================================================
   TUITION DATA
   ---------------------------------------------------------------------
   Program lists follow the "Courses & Tuition Fees" reference notes.
   Every program has a `group` (Bachelor's, TESDA diploma, NC course, ...)
   so the dropdown can show them in separate, labelled sections.

   source: "official"  -> copied from the school's own published fee page.
   source: "estimate"  -> NOT a published rate. A made-up, realistic placeholder
                          so the page has something to show. Replace each one with
                          the real figure when you get it (change source to "official").
   ===================================================================== */

const cents = (n) => Math.round(n * 100) / 100;

// Small deterministic pseudo-random generator so the made-up numbers stay the same
// on every render (no flicker) but still vary by program, year level and semester.
const hash = (s) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
};
const rand = (seed) => {
  let t = (seed + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Tuition tends to be heaviest in the middle years, lighter in the last year.
const YEAR_WEIGHT = [1.0, 0.96, 1.03, 0.86];

// Section labels used to group the program dropdown.
const BACHELOR = "Bachelor's Degree Programs";
const DIPLOMA = "TESDA 3-Year Diploma Programs";
const NC = "TESDA National Certificate (NC) Courses";

// Build made-up per-year [generalFee, tuitionFee] pairs with decimals for both
// semesters, shaped exactly like the official Garcia data.
// `count` is the number of year levels (4 for bachelor's, 3 for 3-year diplomas).
const estimatedYears = (name, total, tuitionShare = 0.75, free = false, count = 4) => {
  const years = {};
  ["First Semester", "Second Semester"].forEach((sem, s) => {
    years[sem] = YEAR_WEIGHT.slice(0, count).map((w, y) => {
      const seed = hash(`${name}|${sem}|${y}`);
      const jitterG = 1 + (rand(seed) - 0.5) * 0.3;
      const jitterT = 1 + (rand(seed + 7) - 0.5) * 0.14;
      const semAdj = s === 0 ? 1.02 : 0.99;
      const general = cents(total * (1 - tuitionShare) * jitterG);
      const tuition = free ? 0 : cents(total * tuitionShare * w * jitterT * semAdj);
      return [general, tuition];
    });
  });
  return years;
};

// Bachelor's degree: estimated, per year level, first and second semester.
const degree = (name, total, group = BACHELOR) => ({
  name,
  group,
  source: "estimate",
  years: estimatedYears(name, total),
});

// TESDA 3-year diploma: estimated, three year levels.
const diploma = (name, total, group = DIPLOMA, note) => ({
  name,
  group,
  source: "estimate",
  years: estimatedYears(name, total, 0.75, false, 3),
  ...(note ? { note } : {}),
});

// Local college: tuition free for qualified students, small misc fees only.
const localDegree = (name, misc = 2000) => ({
  name,
  group: BACHELOR,
  source: "estimate",
  years: estimatedYears(name, misc, 0, true),
  note: "Tuition is normally free for qualified students in CHED-recognized local colleges (RA 10931). Only misc. fees apply.",
});

// TESDA / short course: estimated fees for the first and second semester,
// each as [generalFee, tuitionFee] (there is no year-level split).
const course = (name, fee, group = NC) => {
  const semesters = {};
  ["First Semester", "Second Semester"].forEach((sem, s) => {
    const seed = hash(`${name}|${group}|${sem}`);
    const general = cents(fee * 0.2 * (1 + (rand(seed) - 0.5) * 0.3));
    const tuition = cents(fee * 0.8 * (1 + (rand(seed + 7) - 0.5) * 0.14) * (s === 0 ? 1.02 : 0.99));
    semesters[sem] = [general, tuition];
  });
  return { name, group, source: "estimate", semesters };
};

// ---- Garcia College of Technology: official fees (per semester, per year level) ----
// Each year is [generalFee, tuitionFee] in pesos.
const garciaProgram = (name, first, second, note) => ({
  name,
  group: BACHELOR,
  source: "official",
  years: { "First Semester": first, "Second Semester": second },
  ...(note ? { note } : {}),
});

// Garcia publishes one Business Administration rate, shared by its four BA majors.
const BA_FIRST = [[2456.42, 4537.5], [1512.62, 5579.34], [1512.62, 5484.36], [1512.62, 3917.4]];
const BA_SECOND = [[2420.12, 6957.5], [1512.62, 4851.6], [1512.62, 5484.36], [3377.04, 1566.96]];
const BA_NOTE =
  "The published rate is for Business Administration and is shown for every BA major. Confirm with the registrar if your major is assessed differently.";

// Garcia publishes this rate under "Hotel Management".
const HM_FIRST = [[2456.42, 7260.0], [6231.62, 8766.68], [6231.62, 9337.44], [4658.62, 5835.9]];
const HM_SECOND = [[5566.12, 6957.5], [4658.62, 8766.68], [4658.62, 8170.26], [4658.62, 2334.36]];
const HM_NOTE = "The published rate for this program is listed under Hotel Management.";

const garcia = [
  garciaProgram("Bachelor of Science in Business Administration Major in Hotel and Restaurant Management", BA_FIRST, BA_SECOND, BA_NOTE),
  garciaProgram("Bachelor of Science in Business Administration Major in Financial Management", BA_FIRST, BA_SECOND, BA_NOTE),
  garciaProgram("Bachelor of Science in Business Administration Major in Marketing Management", BA_FIRST, BA_SECOND, BA_NOTE),
  garciaProgram("Bachelor of Science in Business Administration Major in Operations Management", BA_FIRST, BA_SECOND, BA_NOTE),
  garciaProgram(
    "Bachelor of Science in Information Technology",
    [[4392.42, 6952.92], [3448.62, 9747.53], [5384.62, 8413.44], [3448.62, 3582.6]],
    [[4356.12, 6650.42], [4416.62, 9747.53], [4416.62, 8413.44], [2480.62, 3542.07]]
  ),
  garciaProgram(
    "Bachelor of Science in Computer Science",
    [[4392.42, 6952.92], [3448.62, 9747.53], [5384.62, 8413.44], [3448.62, 3582.6]],
    [[4356.12, 7858.13], [3448.62, 9747.53], [4416.62, 8413.44], [2480.62, 2374.89]]
  ),
  garciaProgram("Bachelor of Science in Hospitality Management", HM_FIRST, HM_SECOND, HM_NOTE),
  garciaProgram(
    "Bachelor of Science in Accountancy",
    [[2456.42, 8167.5], [2480.62, 7029.63], [1512.62, 7051.32], [1512.62, 2350.44]],
    [[2420.12, 7865.0], [2480.62, 7029.63], [2480.62, 6692.07], [1512.62, 5484.36]]
  ),
  garciaProgram(
    "Bachelor of Science in Civil Engineering",
    [[3388.63, 8167.5], [3412.83, 5899.32], [4309.25, 6267.84], [3377.04, 5484.36]],
    [[4284.54, 7562.5], [3448.62, 5976.72], [4309.25, 5223.2], [3377.04, 5745.52]]
  ),
  garciaProgram(
    "Bachelor of Science in Electrical Engineering",
    [[4356.63, 7965.07], [2444.83, 5821.92], [2480.62, 6430.91], [5241.46, 6006.68]],
    [[4320.33, 6755.07], [3377.04, 5336.76], [4309.25, 6006.68], [6173.67, 5745.52]]
  ),
  garciaProgram(
    "Bachelor of Science in Mechanical Engineering",
    [[4320.84, 8167.5], [3377.04, 5094.18], [4345.04, 5364.61], [5241.46, 7051.32]],
    [[4320.33, 7662.57], [4345.04, 5254.17], [3377.04, 5484.36], [7105.88, 6790.16]]
  ),
  garciaProgram(
    "Bachelor of Science in Office Administration",
    [[2456.42, 6352.5], [2480.62, 5331.57], [2480.62, 5908.59], [4345.04, 4341.63]],
    [[2420.12, 6050.0], [1512.62, 4851.6], [3412.83, 5908.59], [3377.04, 1566.96]]
  ),
];

// ids match the `schools` list (1-17).
const tuitionBySchool = [
  { id: 1, name: "Garcia College of Technology", programs: garcia },

  {
    id: 2,
    name: "Aklan Catholic College",
    programs: [
      degree("Bachelor of Science in Accountancy", 14500),
      degree("Bachelor of Science in Accounting Information System", 14000),
      degree("Bachelor of Science in Real Estate Management", 13500),
      degree("Bachelor of Science in Business Administration", 13000),
      degree("Bachelor of Science in Hospitality Management (including Culinary Arts)", 15000),
      degree("Bachelor of Science in Tourism Management", 14000),
      degree("Bachelor of Science in Nursing", 22000),
      degree("Bachelor of Science in Criminology", 13500),
      degree("Bachelor of Elementary Education", 12500),
      degree("Bachelor of Secondary Education", 12500),
      degree("Bachelor of Arts in English Language", 12500),
      degree("Bachelor of Arts in Political Science", 12500),
      degree("Bachelor of Science in Computer Science", 15000),
      degree("Bachelor of Science in Information Technology", 15000),
      degree("Bachelor of Science in Computer Technology", 12000),
    ],
  },

  {
    id: 3,
    name: "Aklan Polytechnic College",
    programs: [
      degree("Bachelor of Science in Marine Transportation (BSMT)", 20000),
      degree("Bachelor of Science in Marine Engineering (BSMarE)", 20000),
      degree("Bachelor of Science in Nursing (BSN)", 20000),
      degree("Bachelor of Science in Customs Administration (BSCA)", 14000),
      degree("Bachelor of Science in Tourism Management (BSTM)", 14000),
    ],
  },

  {
    id: 4,
    name: "Northwestern Visayan Colleges",
    programs: [
      degree("Bachelor of Science in Criminology", 12500),
      degree("Bachelor of Science in Forensic Science", 13000),
      degree("Bachelor of Elementary Education (BEEd)", 11500),
      degree("Bachelor of Secondary Education (BSEd) Major in English", 11500),
      degree("Bachelor of Secondary Education (BSEd) Major in Mathematics", 11500),
      degree("Bachelor of Secondary Education (BSEd) Major in Filipino", 11500),
      degree("Bachelor of Secondary Education (BSEd) Major in Social Studies", 11500),
      degree("Bachelor of Physical Education (BPEd)", 11500),
      degree("Bachelor of Culture and Arts Education (BCAEd)", 11500),
      degree("Bachelor of Science in Hospitality Management (BSHM)", 13500),
      degree("Bachelor of Science in Tourism Management (BSTM)", 12500),
      degree("Bachelor of Science in Business Administration (BSBA) with Management Majors", 12000),
      degree("Bachelor of Science in Computer Science (BSCS)", 14000),
      degree("Bachelor of Arts in Communication", 12000),
      degree("Bachelor of Arts in English Language Studies", 12000),
      diploma("Diploma in Hospitality", 9000),
      diploma("Diploma in Business Marketing", 9000),
      diploma("Diploma in Computer Application", 9000),
      diploma("Diploma in Communication & Media Services", 9000),
      course("Bookkeeping", 3500),
      course("Computer Systems Servicing", 3500),
      course("Customer Service", 3500),
      course("Driving", 3500),
      course("Events Management", 3500),
      course("Food & Beverage Services", 3500),
      course("Housekeeping", 3500),
      course("Real Estate Services", 3500),
      course("Tourism Promotion", 3500),
      course("Visual Graphic Design", 3500),
    ],
  },

  {
    id: 5,
    name: "STI College of Kalibo",
    programs: [
      degree("Bachelor of Science in Information Technology (BSIT)", 28000),
      degree("Bachelor of Science in Computer Engineering (BSCpE)", 32000),
      degree("Bachelor of Science in Hospitality Management (BSHM)", 27000),
      degree("Bachelor of Science in Tourism Management (BSTM)", 26000),
    ],
  },

  {
    id: 6,
    name: "Panay Technological College",
    programs: [
      course("Computer Hardware Servicing NC II", 6500, "TESDA TVET: Information & Electronics Technology"),
      course("Consumer Electronics Servicing NC II", 6500, "TESDA TVET: Information & Electronics Technology"),
      course("Food and Beverage Services NC II", 5500, "TESDA TVET: Hospitality & Food Service"),
      course("Bartending NC II", 5500, "TESDA TVET: Hospitality & Food Service"),
      course("Housekeeping NC II", 5000, "TESDA TVET: Hospitality & Food Service"),
      course("Automotive Servicing NC II", 9500, "TESDA TVET: Automotive & Industrial Skills"),
    ],
  },

  {
    id: 7,
    name: "Saint Gabriel College",
    programs: [
      degree("Bachelor of Science in Nursing (BSN)", 19000),
      degree("Bachelor of Science in Medical Technology (BSMT)", 18500),
      degree("Bachelor of Science in Pharmacy (BS Pharmacy)", 18500),
      degree("Bachelor of Science in Radiologic Technology (BSRT)", 18000),
      diploma("Diploma in Health Services Technology", 12000, "TESDA-Registered 3-Year Diploma Tracks", "Many diploma tracks are eligible for UAQTEA scholarships."),
      diploma("Diploma in Medical Laboratory Technology", 12000, "TESDA-Registered 3-Year Diploma Tracks", "Many diploma tracks are eligible for UAQTEA scholarships."),
      diploma("Diploma in Pharmacy Technology", 12000, "TESDA-Registered 3-Year Diploma Tracks", "Many diploma tracks are eligible for UAQTEA scholarships."),
      diploma("Diploma in Radiologic Laboratory Technology", 12000, "TESDA-Registered 3-Year Diploma Tracks", "Many diploma tracks are eligible for UAQTEA scholarships."),
    ],
  },

  {
    id: 8,
    name: "Verde Grande College",
    programs: [
      diploma("Diploma in Culinary Arts Technology (DCAT)", 15000),
      diploma("Diploma in Cruise Ship Hospitality Services Technology (DCSHST)", 15000),
      diploma("Diploma in Hospitality Technology & Restaurant Operation Technology", 15000),
      course("Cruise Ship & Culinary Bundles", 25000, "1-Year & 2-Year Bundled Programs"),
      course("Bread & Pastry Production NC II", 6000, "1-Year & 2-Year Bundled Programs"),
      course("Food & Beverage Services NC II", 5500, "1-Year & 2-Year Bundled Programs"),
      course("Housekeeping NC II", 5000, "1-Year & 2-Year Bundled Programs"),
      course("Cookery NC II", 6000, "Short-Term TESDA Qualifications (NC I & NC II)"),
      course("Bread & Pastry Production NC II", 6000, "Short-Term TESDA Qualifications (NC I & NC II)"),
      course("Food & Beverage Services NC II", 5500, "Short-Term TESDA Qualifications (NC I & NC II)"),
      course("Housekeeping NC II", 5000, "Short-Term TESDA Qualifications (NC I & NC II)"),
      course("Bartending NC II", 5500, "Short-Term TESDA Qualifications (NC I & NC II)"),
      course("Food Processing NC II", 5500, "Short-Term TESDA Qualifications (NC I & NC II)"),
      course("Ships Catering Services NC II", 7500, "Short-Term TESDA Qualifications (NC I & NC II)"),
    ],
  },

  {
    id: 9,
    name: "Aklan Polytechnic College - Maritime Training Center",
    programs: [
      course("STCW Short & Practical Courses", 8000, "Maritime Training Courses"),
      course("Simulator & Laboratory Training", 6000, "Maritime Training Courses"),
    ],
  },

  {
    id: 10,
    name: "Balete Community College",
    programs: [
      localDegree("Bachelor of Science in Hospitality Management (BSHM)"),
      localDegree("Bachelor of Elementary Education (BEEd)"),
      localDegree("Bachelor of Secondary Education (BSEd) Major in Mathematics"),
      localDegree("Bachelor of Technical-Vocational Teacher Education (BTVTEd) Major in Garments and Fashion Design Technology (GFD)"),
    ],
  },

  {
    id: 11,
    name: "Altavas College",
    programs: [
      localDegree("Bachelor of Elementary Education (BEEd)"),
      localDegree("Bachelor of Secondary Education (BSEd) Major in Mathematics"),
      localDegree("Bachelor of Secondary Education (BSEd) Major in English"),
      localDegree("Bachelor of Science in Criminology (BSCrim)"),
      localDegree("Bachelor of Science in Hospitality Management (BSHM)"),
      localDegree("Bachelor of Science in Office Administration (BSOA)"),
    ],
  },

  {
    id: 12,
    name: "Malay College",
    programs: [
      localDegree("Bachelor of Science in Tourism Management (BSTM)"),
      localDegree("Bachelor of Science in Hospitality Management (BSHM)"),
      localDegree("Bachelor of Science in Entrepreneurship (BSE)"),
      course("Tourism Promotion Services NC II", 2500, "TESDA Courses"),
    ],
  },

  {
    id: 13,
    name: "Lezo Technical College",
    note: "Scholarship slots are available under TWSP and PESFA.",
    programs: [
      course("Food and Beverage Services NC II", 3000, "TESDA Courses"),
      course("Housekeeping NC II", 3000, "TESDA Courses"),
      course("Household Services NC II", 3000, "TESDA Courses"),
    ],
  },

  {
    id: 14,
    name: "Libacao College of Science and Technology",
    programs: [
      localDegree("Bachelor of Science in Hospitality Management (BSHM)"),
      localDegree("Bachelor of Special Needs Education (BSNEd)"),
      localDegree("Bachelor of Industrial Technology (BIndTech) with specialization in Automotive Technology"),
      localDegree("Bachelor of Industrial Technology (BIndTech) with specialization in Food and Service Management"),
      localDegree("Bachelor of Industrial Technology (BIndTech) with specialization in Garments and Design"),
    ],
  },

  {
    id: 15,
    name: "Batan Integrated College of Technology",
    programs: [
      localDegree("Bachelor of Secondary Education (BSEd) Major in Filipino"),
      localDegree("Bachelor of Science in Office Administration (BSOA) Major in Management"),
      localDegree("Bachelor of Science in Hospitality Management (BSHM)"),
    ],
  },

  {
    id: 16,
    name: "Joselito Alba Vocational and Technical School, Inc. - JAVTES",
    programs: [
      course("Bartending NC II", 5500),
      course("Bread and Pastry Production NC II", 6000),
      course("Commercial Cooking NC III", 7000),
      course("Cookery NC II", 6000),
      course("Food and Beverage Services NC II", 5500),
      course("Food and Beverage Services NC III", 7000),
      course("Food Processing NC II", 5500),
      course("Housekeeping NC II", 5000),
      course("Housekeeping NC III", 6500),
    ],
  },

  {
    id: 17,
    name: "Central Panay College of Science and Technology",
    programs: [course("Food and Beverage Services NC II", 5500)],
  },
];

/* =====================================================================
   COMPONENT
   ===================================================================== */

const YEAR_LABELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const SEMESTERS = ["First Semester", "Second Semester"];

const peso = (n) =>
  "₱" +
  n.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Split a school's programs into labelled sections, keeping each program's index.
const groupPrograms = (programs) => {
  const groups = [];
  programs.forEach((p, index) => {
    let g = groups.find((x) => x.label === p.group);
    if (!g) {
      g = { label: p.group, items: [] };
      groups.push(g);
    }
    g.items.push({ program: p, index });
  });
  return groups;
};

function SourceBadge({ source }) {
  return source === "official" ? (
    <span className="badge official">Official school rate</span>
  ) : (
    <span className="badge estimate">Estimate, not an official school rate</span>
  );
}

function TuitionFees() {
  const [schoolId, setSchoolId] = useState(tuitionBySchool[0].id);
  const [programIndex, setProgramIndex] = useState(0);
  const [semester, setSemester] = useState(SEMESTERS[0]);

  const school = tuitionBySchool.find((s) => s.id === schoolId);
  const program = school.programs[programIndex] ?? school.programs[0];
  const groups = groupPrograms(school.programs);

  const handleSchool = (e) => {
    setSchoolId(Number(e.target.value));
    setProgramIndex(0);
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
          <select
            value={program ? programIndex : ""}
            onChange={(e) => setProgramIndex(Number(e.target.value))}
            disabled={!program}
          >
            {!program && <option value="">No programs listed yet</option>}
            {groups.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.items.map(({ program: p, index }) => (
                  <option key={index} value={index}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
      </div>

      {!program && (
        <p className="note">
          Programs and fees for this school are not listed yet. Contact the school's
          registrar for the actual fees.
        </p>
      )}

      {program && (
        <>
          <div className="badges">
            <SourceBadge source={program.source} />
            <span className="badge group">{program.group}</span>
          </div>

          {/* Bachelor's / diploma: per year level, with semester tabs */}
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

          {school.note && <p className="note highlight">{school.note}</p>}
          {program.note && <p className="note">{program.note}</p>}
          <p className="note">
            {program.source === "official"
              ? "Estimates from the college's published fee page. Actual assessment depends on your enrolled subjects and may change."
              : "Placeholder figure. Contact the school's registrar for the actual fee."}
          </p>
        </>
      )}

      <style>{`
        .tuition-fees { max-width: 760px; margin: 0 auto; padding: 16px; font-family: system-ui, sans-serif; }
        .tuition-fees h1 { margin: 0; font-size: 1.5rem; }
        .tuition-fees .subtitle { margin: 4px 0 16px; color: #555; }
        .tuition-fees .controls { display: grid; gap: 12px; grid-template-columns: 1fr 1fr; margin-bottom: 12px; }
        .tuition-fees label { display: flex; flex-direction: column; gap: 4px; font-size: 0.85rem; color: #333; }
        .tuition-fees select { padding: 8px; font-size: 1rem; min-width: 0; }
        .tuition-fees .badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
        .tuition-fees .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 0.8rem; }
        .tuition-fees .badge.official { background: #dcfce7; color: #166534; }
        .tuition-fees .badge.estimate { background: #fef3c7; color: #92400e; }
        .tuition-fees .badge.group { background: #e0e7ff; color: #1e3a8a; }
        .tuition-fees .tabs { display: flex; gap: 6px; margin-bottom: 12px; }
        .tuition-fees .tab { padding: 6px 12px; border: 1px solid #99a; background: #fff; border-radius: 6px; cursor: pointer; }
        .tuition-fees .tab.active { background: #1f3a8a; color: #fff; border-color: #1f3a8a; }
        .tuition-fees table { width: 100%; border-collapse: collapse; }
        .tuition-fees th { background: #a9b4cf; text-align: left; }
        .tuition-fees th, .tuition-fees td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
        .tuition-fees td.total { font-weight: 700; color: #c00; }
        .tuition-fees .note { font-size: 0.85rem; color: #666; margin-top: 12px; }
        .tuition-fees .note.highlight { color: #1e3a8a; background: #eef2ff; padding: 8px 12px; border-radius: 8px; }
        @media (max-width: 560px) {
          .tuition-fees .controls { grid-template-columns: 1fr; }
          .tuition-fees th, .tuition-fees td { padding: 6px 4px; font-size: 0.85rem; }
        }
      `}</style>
    </section>
  );
}

export default TuitionFees;