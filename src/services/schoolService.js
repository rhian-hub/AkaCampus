const schools = [
  {
    id: 1,
    name: "Kalibo College",
    location: "Kalibo",
    province: "Aklan",
    type: "Private",
    description: "A higher education institution serving students in Kalibo, Aklan.",
    about: "Kalibo College offers academic programs designed to prepare students for careers and professional growth.",
    address: "Kalibo, Aklan",
    email: "",
    phone: "",
    website: "",
    courses: [
      {
        id: 101,
        name: "Bachelor of Science in Information Technology",
        abbreviation: "BSIT",
        degree: "Bachelor's Degree",
        description: "A Bachelor of Science program focused on computing, software development, and information systems.",
        curriculum: [
          { yearLevel: 1, semesters: [
            { name: "First Semester", subjects: ["Introduction to Computing", "Computer Programming 1", "Mathematics in the Modern World"] },
            { name: "Second Semester", subjects: ["Computer Programming 2", "Discrete Mathematics", "Purposive Communication"] }
          ]},
          { yearLevel: 2, semesters: [
            { name: "First Semester", subjects: ["Data Structures and Algorithms", "Object-Oriented Programming"] },
            { name: "Second Semester", subjects: ["Database Management Systems", "Networking 1"] }
          ]},
          { yearLevel: 3, semesters: [
            { name: "First Semester", subjects: ["Systems Analysis and Design", "Web Development"] },
            { name: "Second Semester", subjects: ["Information Assurance and Security", "Applications Development"] }
          ]},
          { yearLevel: 4, semesters: [
            { name: "First Semester", subjects: ["Capstone Project 1", "Practicum Preparation"] },
            { name: "Second Semester", subjects: ["Capstone Project 2", "Practicum / Internship"] }
          ]}
        ]
      },
      {
        id: 102,
        name: "Bachelor of Science in Business Administration",
        abbreviation: "BSBA",
        degree: "Bachelor's Degree",
        description: "A Bachelor of Science program covering management, finance, marketing, and business operations.",
        curriculum: []
      }
    ],
    requirements: [
      { category: "Freshman Applicants", items: ["Completed application form", "Report card or school records", "Birth certificate", "Recent identification photographs"] },
      { category: "Transferee Applicants", items: ["Transcript of Records or certificate of grades", "Honorable dismissal", "Completed application form"] }
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
  return schools;
}

export async function getSchoolById(id) {
  const schools = await getSchools();
  return schools.find((school) => String(school.id) === String(id)) || null;
}

