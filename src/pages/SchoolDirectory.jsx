import { useMemo, useState } from "react";
import SchoolList from "../components/schools/SchoolList";
import SchoolSearch from "../components/schools/SchoolSearch";
import SchoolFilter from "../components/schools/SchoolFilter";

function SchoolDirectory({ schools = [], onViewDetails }) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [type, setType] = useState("All");

  const locations = useMemo(
    () => [...new Set(schools.map((school) => school.location).filter(Boolean))].sort(),
    [schools]
  );

  const filteredSchools = schools.filter((school) => {
    const searchable = `${school.name} ${school.location} ${school.description || ""}`.toLowerCase();
    return searchable.includes(search.toLowerCase())
      && (location === "All" || school.location === location)
      && (type === "All" || school.type === type);
  });

  return (
    <div className="page">
      <section className="page-intro">
        <span className="eyebrow">AKLAN · HIGHER EDUCATION</span>
        <h1>Find a college in Aklan.</h1>
        <p>Explore college profiles, academic programs, curricula, and admission information in one place.</p>
      </section>

      <section className="directory-tools">
        <SchoolSearch value={search} onChange={setSearch} />
        <SchoolFilter locations={locations} location={location} onLocationChange={setLocation} type={type} onTypeChange={setType} />
      </section>

      <div className="section-heading">
        <div>
          <h2>College directory</h2>
          <p className="muted">{filteredSchools.length} college profile(s)</p>
        </div>
        <span className="scope-label">Aklan only</span>
      </div>

      <SchoolList schools={filteredSchools} onViewDetails={onViewDetails} />
      <p className="data-note">College information should be checked against official institutional sources before publication.</p>
    </div>
  );
}

export default SchoolDirectory;
