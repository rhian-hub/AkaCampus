import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/schools', label: 'School directory' },
];

export default function SideNav({ open, onClose }) {
  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
        <NavLink to="/" className="sidebar-brand" onClick={onClose}>
          School Finder
        </NavLink>
        <nav>
          <ul className="nav flex-column gap-1">
            {links.map(({ to, label, end }) => (
              <li className="nav-item" key={to}>
                <NavLink to={to} end={end} className="nav-link" onClick={onClose}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}