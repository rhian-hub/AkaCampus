import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideNav from './components/SideNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Directory from './pages/Directories';
import SchoolDetails from './pages/SchoolDetails';


export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <BrowserRouter>
      <SideNav open={open} onClose={() => setOpen(false)} />
      <div className="app-main">
        <header className="topbar">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
          >
            Menu
          </button>
          <strong>School Finder</strong>
        </header>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schools" element={<Directories />} />
            <Route path="/schools/:id" element={<SchoolDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}