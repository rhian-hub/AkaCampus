// import { Routes, Route, Link } from "react-router-dom";
// import TuitionFees from "./pages/TuitionFees";
// import Scholarships from "./pages/Scholarships";
// import SchoolComparison from "./pages/SchoolComparison";

// function App() {
//   return (
//     <>
//       <nav>
//         <Link to="/tuition">Tuition & Fees</Link>{" | "}
//         <Link to="/scholarships">Scholarships</Link>{" | "}
//         <Link to="/compare">Compare Schools</Link>
//       </nav>

//       <Routes>
//         <Route path="/tuition-fees" element={<TuitionFees />} />
//         <Route path="/scholarships" element={<Scholarships />} />
//         <Route path="/compare" element={<SchoolComparison />} />
//       </Routes>
//     </>
//   );
// }

// export default App;
import TuitionFees from "./pages/TuitionFees";

function App() {
  return <TuitionFees />;
}

export default App;