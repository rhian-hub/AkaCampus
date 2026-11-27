import React, { useState } from "react";


const BANNER = "/posters/aklan-banner.jpg";

const SCHOLARSHIPS = [
  {
    id: 1,
    poster: "/posters/pgcsp.jpg",
    title: "Provincial Government College Scholarship Program (PGCSP)",
    provider: "Provincial Government of Aklan",
    category: "Provincial",
    status: "Watch for schedule",
    deadline: "Next exam schedule: not yet confirmed",
    summary: "College scholarship for Aklanon students at partner schools in the province.",
    eligibility: [
      "Bona fide Aklanon and indigent",
      "Good moral character",
      "College or incoming college student at a partner school in Aklan",
      "Not a beneficiary of another scholarship or educational assistance",
      "No full sibling as a beneficiary in the same academic year",
      "Not a bachelor's degree holder",
    ],
    requirements: [
      "Barangay Certificate of Indigency",
      "Validated school ID or valid government ID (photocopy)",
      "Accomplished application form",
    ],
    note: "Based on the 2023 call for applications. Rules may have changed. Ask the Provincial Scholarship Office, 2nd Floor, Left Wing, Provincial Capitol Building, Kalibo.",
    link: "https://www.facebook.com/AklanScholarshipServices/",
  },
  {
    id: 2,
    poster: "/posters/tcsp-aip.jpg",
    title: "Tertiary Scholarship for Aklan Indigenous People (TCSP-AIP)",
    provider: "Provincial Government of Aklan",
    category: "Provincial",
    status: "Inquire",
    deadline: "No current schedule found",
    summary: "College scholarship for Aklan's Indigenous People, first implemented in 2023.",
    eligibility: ["Ask the provider for the current qualifications"],
    requirements: ["Ask the provider for the current list"],
    note: "Check with the Provincial Scholarship Office if the program is accepting applicants.",
    link: "https://www.boracayislandnews.com/governors-report-2024/",
  },
  {
    id: 3,
    poster: "/posters/tesda-sgc.jpg",
    title: "TESDA Scholarship: Pharmacy Services NC III / Barangay Health Services NC II",
    provider: "Saint Gabriel College Inc., Kalibo (with TESDA)",
    category: "Tech-Voc",
    status: "Inquire",
    deadline: "Limited slots, subject to TESDA availability",
    summary: "Free training, free competency assessment and a daily training allowance.",
    eligibility: ["Ask the school for the current qualifications"],
    requirements: ["Ask the school for the current list"],
    note: "Posted around June 2026, so slots may be full. Tel. (036) 272-1246, sgc.techvoc2006@gmail.com",
    link: "https://www.tesdaonline.info/2026/06/tesda-scholarship-2026-free-pharmacy.html",
  },
  {
    id: 4,
    poster: "/posters/owwa.jpg",
    title: "OWWA Scholarships (EDSP, CMWSP, ODSP)",
    provider: "Overseas Workers Welfare Administration",
    category: "National",
    status: "Watch for schedule",
    deadline: "Verify dates on the official OWWA portal",
    summary: "National programs open to qualified Aklanons from OFW families.",
    eligibility: [
      "For qualified OFWs or their dependents or relatives",
      "Rules on membership, age and grades differ per program",
    ],
    requirements: ["OFW passport information page", "Applicant's ID", "Birth certificate", "School grades"],
    note: "Requirements differ per program.",
    link: "https://scholarship.owwa.gov.ph/",
  },
  {
    id: 5,
    poster: "/posters/dost.jpg",
    title: "DOST-SEI Undergraduate Scholarship 2027",
    provider: "Department of Science and Technology",
    category: "National",
    status: "Closed",
    deadline: "Applications closed Sept 17, 2026",
    summary: "National science and technology scholarship. The exam was set for Nov 14–15, 2026.",
    eligibility: [
      "Natural-born Filipino of good moral character",
      "Graduating Grade 12, or a graduate not yet enrolled in college",
      "STEM students, or non-STEM students in the top 5% of their class",
    ],
    requirements: ["PSA birth certificate", "Good moral and good health certificates", "Principal's certification", "Proof of income"],
    note: "Wait for the next application cycle.",
    link: "https://careersfilipino.com/dost-scholarship/",
  },
  {
    id: 6,
    poster: "/posters/ched.jpg",
    title: "CHED Merit Scholarship Program (AY 2026–2027)",
    provider: "Commission on Higher Education",
    category: "National",
    status: "Closed",
    deadline: "Applications closed July 31, 2026",
    summary: "National merit scholarship for college students in priority programs.",
    eligibility: ["Check CHED's official guidelines"],
    requirements: ["Proof of identity and citizenship", "Grade 12 report card", "Proof of income"],
    note: "Wait for the next application cycle.",
    link: "https://www.chedscholar.org/",
  },
];

const CATEGORIES = ["All", "Provincial", "Tech-Voc", "National", "Community", "Saved"];

const STATUS_CLASS = {
  Open: "open",
  "Watch for schedule": "watch",
  Inquire: "inquire",
  Closed: "closed",
  "User post": "inquire",
};

// Shows the poster image, or a plain placeholder if the file is missing.
function Poster({ src, title }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <div className="sch-poster empty">🖼️ Official poster not yet added</div>;
  }
  return (
    <img className="sch-poster" src={src} alt={`Announcement poster: ${title}`} onError={() => setFailed(true)} />
  );
}

// Shows the banner image, or a placeholder if the file is missing.
function Banner() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <div className="sch-banner empty">Insert your Aklan banner here</div>;
  }
  return <img className="sch-banner" src={BANNER} alt="Aklan banner" onError={() => setFailed(true)} />;
}

const EMPTY_FORM = { title: "", provider: "", deadline: "", summary: "" };

export default function Scholarships() {
  const [posts, setPosts] = useState(SCHOLARSHIPS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [saved, setSaved] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [poster, setPoster] = useState("");

  const term = query.trim().toLowerCase();
  const visible = posts.filter((s) => {
    const inCategory =
      category === "All" ||
      (category === "Saved" ? saved.includes(s.id) : s.category === category);
    const text = `${s.title} ${s.provider} ${s.summary}`.toLowerCase();
    return inCategory && text.includes(term);
  });

  const toggleSave = (id) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePoster = (e) => {
    const file = e.target.files[0];
    setPoster(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v.trim())) return;
    setPosts((prev) => [
      {
        ...form,
        poster,
        id: Date.now(),
        category: "Community",
        status: "User post",
        eligibility: ["Contact the provider"],
        requirements: ["Contact the provider"],
        note: "Unverified post. Confirm with the provider.",
      },
      ...prev,
    ]);
    setForm(EMPTY_FORM);
    setPoster("");
    setCategory("All");
    setQuery("");
    setShowForm(false);
  };

  return (
    <div className="sch">
      <style>{CSS}</style>

      <section className="sch-hero">
        <Banner />
        <div>
          <p className="sch-eyebrow">Aklan Scholarships</p>
          <h1>Find your scholarship in Aklan</h1>
          <p>Local and national opportunities for Aklanon students, in one place.</p>
        </div>
        <button className="sch-btn" onClick={() => setShowForm(true)}>
          + Post announcement
        </button>
      </section>

      <div className="sch-stats">
        <div><strong>{posts.length}</strong><span>Listings</span></div>
        <div><strong>{posts.filter((s) => s.category === "Provincial").length}</strong><span>Provincial</span></div>
        <div><strong>{saved.length}</strong><span>Saved</span></div>
      </div>

      <div className="sch-notice">
        📢 <b>Reminder:</b> Schedules and requirements can change. Always confirm with the provider before applying.
      </div>

      <div className="sch-toolbar">
        <input
          type="search"
          aria-label="Search scholarships"
          placeholder="🔍 Search scholarships or providers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="sch-chips">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={category === c ? "chip active" : "chip"}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="sch-empty">No scholarships found. Try another search or filter.</p>
      ) : (
        <div className="sch-grid">
          {visible.map((s) => (
            <article key={s.id} className="sch-card">
              <div className="sch-row">
                <span className={`badge ${STATUS_CLASS[s.status]}`}>{s.status}</span>
                <button
                  className="sch-save"
                  onClick={() => toggleSave(s.id)}
                  aria-label={saved.includes(s.id) ? "Remove from saved" : "Save scholarship"}
                >
                  {saved.includes(s.id) ? "★" : "☆"}
                </button>
              </div>
              <Poster key={s.poster} src={s.poster} title={s.title} />
              <h2>{s.title}</h2>
              <p className="sch-provider">{s.provider}</p>
              <p>{s.summary}</p>
              <p className="sch-deadline">📅 {s.deadline}</p>
              <button className="sch-btn" onClick={() => setSelected(s)}>View details</button>
            </article>
          ))}
        </div>
      )}

      {selected && (
        <div className="sch-overlay" onClick={() => setSelected(null)}>
          <div className="sch-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <span className={`badge ${STATUS_CLASS[selected.status]}`}>{selected.status}</span>
            <h2>{selected.title}</h2>
            <Poster key={selected.id} src={selected.poster} title={selected.title} />
            <p className="sch-provider">{selected.provider}</p>
            <p>📅 {selected.deadline}</p>
            <h3>Eligibility</h3>
            <ul>{selected.eligibility.map((x) => <li key={x}>{x}</li>)}</ul>
            <h3>Requirements</h3>
            <ul>{selected.requirements.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="sch-note">{selected.note}</p>
            <div className="sch-actions">
              {selected.link && (
                <a className="sch-btn" href={selected.link} target="_blank" rel="noopener noreferrer">
                  More information
                </a>
              )}
              <button className="sch-btn" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="sch-overlay">
          <form className="sch-modal" onSubmit={handleSubmit}>
            <h2>Post an announcement</h2>
            <label>Scholarship name<input name="title" value={form.title} onChange={handleChange} required /></label>
            <label>Provider<input name="provider" value={form.provider} onChange={handleChange} required /></label>
            <label>Deadline<input name="deadline" value={form.deadline} onChange={handleChange} required /></label>
            <label>Description<textarea name="summary" rows="3" value={form.summary} onChange={handleChange} required /></label>
            <label>Poster image (optional)<input type="file" accept="image/*" onChange={handlePoster} /></label>
            <div className="sch-actions">
              <button type="submit" className="sch-btn">Post</button>
              <button type="button" className="sch-btn" onClick={() => { setPoster(""); setShowForm(false); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const CSS = `
.sch { max-width: 1100px; margin: 0 auto; padding: 20px 16px 40px; font-family: system-ui, sans-serif; color: #2e1405; background: #fffdf0; text-align: left; }
.sch * { box-sizing: border-box; }
.sch-hero { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; padding: 24px; border-radius: 20px; color: #2e1405; background: #fff9c4; border: 4px solid #fff200; box-shadow: inset 0 0 0 2px #6e1f0a; }
.sch-banner { display: block; flex-basis: 100%; width: 100%; height: auto; border-radius: 12px; }
.sch-banner.empty { display: flex; align-items: center; justify-content: center; min-height: 160px; border: 2px dashed #6e1f0a; background: #fff; color: #6e1f0a; font-weight: 600; }
.sch-hero h1 { margin: 4px 0; font-size: clamp(1.6rem, 4vw, 2.4rem); color: #6e1f0a; }
.sch-hero p { margin: 0; }
.sch-eyebrow { font-size: .8rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #6e1f0a; }
.sch-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0; }
.sch-stats div { display: flex; flex-direction: column; align-items: center; padding: 14px; background: #fff; border-radius: 14px; box-shadow: 0 2px 8px #6e1f0a14; }
.sch-stats strong { font-size: 1.6rem; color: #6e1f0a; }
.sch-stats span { font-size: .85rem; color: #6b5a47; }
.sch-notice { padding: 12px 16px; border-left: 4px solid #00753a; border-radius: 8px; background: #eaf6ee; }
.sch-toolbar { margin: 20px 0; }
.sch-toolbar input { width: 100%; padding: 12px 16px; border: 1px solid #e3d28a; border-radius: 12px; font-size: 1rem; background: #fff; color: #2e1405; }
.sch-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.sch .chip { padding: 8px 16px; border: 1px solid #6e1f0a; border-radius: 999px; background: #fff200; color: #2e1405; cursor: pointer; }
.sch .chip.active { background: #fff200; border-color: #6e1f0a; box-shadow: 0 0 0 2px #6e1f0a; font-weight: 700; }
.sch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 16px; }
.sch-card { display: flex; flex-direction: column; padding: 20px; background: #fff; border-top: 5px solid #fff200; border-radius: 16px; box-shadow: 0 4px 14px #6e1f0a1f; transition: transform .2s; }
.sch-card:hover { transform: translateY(-4px); }
.sch-card h2 { margin: 12px 0 4px; font-size: 1.1rem; color: #2e1405; }
.sch-card .sch-btn { margin-top: auto; }
.sch-poster { display: block; width: 100%; height: auto; margin-top: 12px; border-radius: 10px; }
.sch-modal .sch-poster { flex-shrink: 0; }
.sch-poster.empty { display: flex; align-items: center; justify-content: center; height: 220px; background: #fff9d6; border: 2px dashed #e3d28a; color: #6b5a47; font-size: .9rem; }
.sch-modal .sch-poster.empty { height: 120px; }
.sch-row { display: flex; justify-content: space-between; align-items: center; }
.sch .sch-save { border: 0; background: none; font-size: 1.5rem; color: #c58f00; cursor: pointer; }
.sch-provider { margin: 0; font-size: .9rem; color: #8a2a0c; font-weight: 600; }
.sch-deadline { font-size: .9rem; color: #6b5a47; }
.sch .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: .75rem; font-weight: 700; }
.badge.open { background: #e3f6e8; color: #1b7a36; }
.badge.watch { background: #fff1d6; color: #8a5a00; }
.badge.inquire { background: #fff6a8; color: #6e1f0a; }
.badge.closed { background: #fde8e8; color: #a52323; }
.sch .sch-btn { display: inline-block; padding: 10px 18px; border: 1px solid #6e1f0a; border-radius: 10px; background: #fff200; color: #2e1405; font-weight: 700; text-align: center; text-decoration: none; cursor: pointer; }
.sch .sch-btn:hover, .sch .chip:hover { background: #ffe500; }
.sch-empty { padding: 40px; text-align: center; color: #6b5a47; }
.sch-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; background: #0008; }
.sch-modal { width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; padding: 24px; background: #fff; border-radius: 16px; }
.sch-modal h2 { color: #2e1405; }
.sch-modal label { display: block; margin-bottom: 12px; font-weight: 600; }
.sch-modal input, .sch-modal textarea { display: block; width: 100%; margin-top: 4px; padding: 10px; border: 1px solid #e3d28a; border-radius: 8px; font: inherit; background: #fff; color: #2e1405; }
.sch-note { padding: 10px 12px; border-radius: 8px; background: #fffdf0; font-size: .9rem; }
.sch-actions { display: flex; gap: 10px; flex-wrap: wrap; }
`;