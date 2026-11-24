import { useEffect, useState } from "react";
import CourseCard from "../components/courses/CourseCard";
import YearLevelTabs from "../components/courses/YearLevelTabs";
import Curriculum from "../components/courses/Curriculum";

function CoursesPage({ school, courses = [] }) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id ?? "");
  const [selectedYear, setSelectedYear] = useState(1);

  useEffect(() => {
    setSelectedCourse(courses[0]?.id ?? "");
    setSelectedYear(1);
  }, [school?.id, courses]);

  const activeCourse = courses.find((course) => String(course.id) === String(selectedCourse));
  const activeYear = activeCourse?.curriculum?.find((year) => Number(year.yearLevel) === selectedYear);

  if (!school) {
    return <div className="page"><div className="empty-state"><h2>Select a college first</h2></div></div>;
  }

  return (
    <div className="page">
      <section className="page-intro compact">
        <span className="eyebrow">{school.name}</span>
        <h1>Courses & curriculum</h1>
        <p>Explore the programs and subject lists provided for this college.</p>
      </section>

      <h2 className="subsection-title">Available programs</h2>
      {courses.length ? (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} selected={String(selectedCourse) === String(course.id)} onSelect={setSelectedCourse} />
          ))}
        </div>
      ) : (
        <div className="empty-state"><p>No programs have been encoded for this college yet.</p></div>
      )}

      {activeCourse && (
        <section className="curriculum-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PROGRAM CURRICULUM</span>
              <h2>{activeCourse.name}</h2>
              <p className="muted">{activeCourse.description || "No program description provided."}</p>
            </div>
            <span className="scope-label">{activeCourse.abbreviation || "Program"}</span>
          </div>
          <YearLevelTabs selectedYear={selectedYear} onChange={setSelectedYear} />
          <Curriculum year={activeYear} />
          <p className="data-note">Subject lists are institution-specific. Confirm each curriculum with the college before publishing.</p>
        </section>
      )}
    </div>
  );
}

export default CoursesPage;
