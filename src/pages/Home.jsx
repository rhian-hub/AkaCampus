import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section>
      <h1 className="display-5">Find the right school for you.</h1>
      <p className="lead text-secondary" style={{ maxWidth: '60ch' }}>
        Browse schools, compare them, and open each school's page for details.
      </p>
      <Link to="/schools" className="btn btn-lg" style={{ background: 'var(--bus)', color: 'var(--ink)', fontWeight: 700 }}>
        Browse schools
      </Link>
    </section>
  );
}
