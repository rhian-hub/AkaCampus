import SchoolListing from '../components/SchoolListing';
import { schools } from '../data/schools';

export default function Directories() {
  return (
    <section>
      <h1 className="h2 mb-4">School directories</h1>
      <div className="row g-3">
        {schools.map((school) => (
          <div className="col-12 col-md-6 col-xl-4" key={school.id}>
            <SchoolListing school={school} />
          </div>
        ))}
      </div>
    </section>
  );
}
