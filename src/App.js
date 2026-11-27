import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import TuitionFees from "./pages/TuitionFees";
import Scholarships from "./pages/Scholarships";
import SchoolComparison from "./pages/SchoolComparison";

function App() {
  return (
    <>
      <nav style={{ display: "flex", gap: 12, padding: 12, background: "#eef" }}>
        <Link to="/">Home</Link>
        <Link to="/tuition-fees">Tuition Fees</Link>
        <Link to="/scholarships">Scholarships</Link>
        <Link to="/compare">Compare</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tuition-fees" element={<TuitionFees />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/compare" element={<SchoolComparison />} />
      </Routes>
    </>
  );
}

export default App;