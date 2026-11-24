import { Link } from 'react-router-dom';

export default function SchoolListing({ school }) {
  return (
    <div className="school-card card card-body p-3 position-relative">
      <h2 className="card-title h5">
        <Link to={`/schools/${school.id}`}>{school.name}</Link>
      </h2>
      <p className="mb-1 text-secondary">{school.level} · {school.city}</p>
      <Link to={`/schools/${school.id}`} className="stretched-link small">View details</Link>
    </div>
  );
}