// Central place for school data.
// The records below are DEMO DATA only, not real college information.
// Replace them with verified Aklan college information before presenting the project.

const demoSchools = [
  {
    id: 1,
    name: "Demo College - Kalibo",
    location: "Kalibo",
    province: "Aklan",
    type: "Private",
    description: "This is a demonstration college profile. Replace this text with verified information from the institution.",
    about: "Add the college history, mission, vision, and other official background information here.",
    address: "Add verified campus address",
    email: "Add official email",
    phone: "Add official contact number",
    website: "",
    courses: [
      {
        id: 101,
        name: "Bachelor of Science in Information Technology",
        abbreviation: "BSIT",
        degree: "Bachelor's Degree",
        description: "A sample program entry. Replace it with the actual program description and curriculum supplied by the college.",
        curriculum: [
          { yearLevel: 1, semesters: [
            { name: "First Semester", subjects: ["Introduction to Computing (DEMO)", "Computer Programming 1 (DEMO)", "Mathematics in the Modern World (DEMO)"] },
            { name: "Second Semester", subjects: ["Computer Programming 2 (DEMO)", "Discrete Mathematics (DEMO)", "Purposive Communication (DEMO)"] }
          ]},
          { yearLevel: 2, semesters: [
            { name: "First Semester", subjects: ["Data Structures and Algorithms (DEMO)", "Object-Oriented Programming (DEMO)"] },
            { name: "Second Semester", subjects: ["Database Management Systems (DEMO)", "Networking 1 (DEMO)"] }
          ]},
          { yearLevel: 3, semesters: [
            { name: "First Semester", subjects: ["Systems Analysis and Design (DEMO)", "Web Development (DEMO)"] },
            { name: "Second Semester", subjects: ["Information Assurance and Security (DEMO)", "Applications Development (DEMO)"] }
          ]},
          { yearLevel: 4, semesters: [
            { name: "First Semester", subjects: ["Capstone Project 1 (DEMO)", "Practicum Preparation (DEMO)"] },
            { name: "Second Semester", subjects: ["Capstone Project 2 (DEMO)", "Practicum / Internship (DEMO)"] }
          ]}
        ]
      },
      {
        id: 102,
        name: "Bachelor of Science in Business Administration",
        abbreviation: "BSBA",
        degree: "Bachelor's Degree",
        description: "Sample program entry. Replace with verified information.",
        curriculum: []
      }
    ],
    requirements: [
      { category: "Freshman Applicants", items: ["Completed application form (verify with college)", "Report card or school records (verify with college)", "Birth certificate (verify with college)", "Recent identification photographs (verify with college)"] },
      { category: "Transferee Applicants", items: ["Transcript of Records or certificate of grades (verify with college)", "Honorable dismissal (if required)", "Completed application form (verify with college)"] }
    ],
    admissionSteps: [
      "Contact the college admission office for current application dates.",
      "Obtain and complete the official application form.",
      "Prepare and submit the required documents.",
      "Take the entrance examination or interview if required.",
      "Wait for the official admission result and enrollment instructions."
    ]
  }
];

export async function getSchools() {
  // Replace this demo return with a fetch request to your Node.js API later.
  return demoSchools;
}

export async function getSchoolById(id) {
  const schools = await getSchools();
  return schools.find((school) => String(school.id) === String(id)) || null;
}
