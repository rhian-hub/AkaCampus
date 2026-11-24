// Tuition data for Aklan colleges.
//
// source: "official"  -> copied from the school's own published fee page.
// source: "estimate"  -> NOT a published rate. A made-up, realistic placeholder so the
//                        page has something to show. Replace each one with the real
//                        figure when you get it (change source to "official").

const cents = (n) => Math.round(n * 100) / 100;

// Small deterministic pseudo-random generator so the made-up numbers stay the same
// on every render (no flicker) but still vary by program, year level and semester.
const hash = (s) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
};
const rand = (seed) => {
  let t = (seed + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Tuition tends to be heaviest in the middle years, lighter in the last year.
const YEAR_WEIGHT = [1.0, 0.96, 1.03, 0.86];

// Build made-up per-year [generalFee, tuitionFee] pairs with decimals for both
// semesters, shaped exactly like the official Garcia data.
const estimatedYears = (name, total, tuitionShare = 0.75, free = false) => {
  const years = {};
  ["First Semester", "Second Semester"].forEach((sem, s) => {
    years[sem] = YEAR_WEIGHT.map((w, y) => {
      const seed = hash(`${name}|${sem}|${y}`);
      const jitterG = 1 + (rand(seed) - 0.5) * 0.3;
      const jitterT = 1 + (rand(seed + 7) - 0.5) * 0.14;
      const semAdj = s === 0 ? 1.02 : 0.99;
      const general = cents(total * (1 - tuitionShare) * jitterG);
      const tuition = free ? 0 : cents(total * tuitionShare * w * jitterT * semAdj);
      return [general, tuition];
    });
  });
  return years;
};

// Degree/diploma program: estimated, per year level, first and second semester.
const degree = (name, total, tuitionShare) => ({
  name,
  kind: "degree",
  source: "estimate",
  years: estimatedYears(name, total, tuitionShare),
});

// Local college: tuition free for qualified students, small misc fees only.
const localDegree = (name, misc = 2000) => ({
  name,
  kind: "degree",
  source: "estimate",
  years: estimatedYears(name, misc, 0, true),
  note: "Tuition is normally free for qualified students in CHED-recognized local colleges (RA 10931). Only misc. fees apply.",
});

// TESDA / short course: estimated fees for the first and second semester,
// each as [generalFee, tuitionFee] (there is no year-level split).
const course = (name, fee) => {
  const semesters = {};
  ["First Semester", "Second Semester"].forEach((sem, s) => {
    const seed = hash(`${name}|${sem}`);
    const general = cents(fee * 0.2 * (1 + (rand(seed) - 0.5) * 0.3));
    const tuition = cents(fee * 0.8 * (1 + (rand(seed + 7) - 0.5) * 0.14) * (s === 0 ? 1.02 : 0.99));
    semesters[sem] = [general, tuition];
  });
  return { name, kind: "course", source: "estimate", semesters };
};

// ---- Garcia College of Technology: official fees (per semester, per year level) ----
// Each year is [generalFee, tuitionFee] in pesos.
const garciaProgram = (name, first, second) => ({
  name,
  kind: "degree",
  source: "official",
  years: { "First Semester": first, "Second Semester": second },
});

const garcia = [
  garciaProgram(
    "BS in Civil Engineering",
    [[3388.63, 8167.5], [3412.83, 5899.32], [4309.25, 6267.84], [3377.04, 5484.36]],
    [[4284.54, 7562.5], [3448.62, 5976.72], [4309.25, 5223.2], [3377.04, 5745.52]]
  ),
  garciaProgram(
    "BS in Mechanical Engineering",
    [[4320.84, 8167.5], [3377.04, 5094.18], [4345.04, 5364.61], [5241.46, 7051.32]],
    [[4320.33, 7662.57], [4345.04, 5254.17], [3377.04, 5484.36], [7105.88, 6790.16]]
  ),
  garciaProgram(
    "BS in Electrical Engineering",
    [[4356.63, 7965.07], [2444.83, 5821.92], [2480.62, 6430.91], [5241.46, 6006.68]],
    [[4320.33, 6755.07], [3377.04, 5336.76], [4309.25, 6006.68], [6173.67, 5745.52]]
  ),
  garciaProgram(
    "BS in Accountancy",
    [[2456.42, 8167.5], [2480.62, 7029.63], [1512.62, 7051.32], [1512.62, 2350.44]],
    [[2420.12, 7865.0], [2480.62, 7029.63], [2480.62, 6692.07], [1512.62, 5484.36]]
  ),
  garciaProgram(
    "BS in Business Administration",
    [[2456.42, 4537.5], [1512.62, 5579.34], [1512.62, 5484.36], [1512.62, 3917.4]],
    [[2420.12, 6957.5], [1512.62, 4851.6], [1512.62, 5484.36], [3377.04, 1566.96]]
  ),
  garciaProgram(
    "BS in Hotel Management",
    [[2456.42, 7260.0], [6231.62, 8766.68], [6231.62, 9337.44], [4658.62, 5835.9]],
    [[5566.12, 6957.5], [4658.62, 8766.68], [4658.62, 8170.26], [4658.62, 2334.36]]
  ),
  garciaProgram(
    "BS in Information Technology",
    [[4392.42, 6952.92], [3448.62, 9747.53], [5384.62, 8413.44], [3448.62, 3582.6]],
    [[4356.12, 6650.42], [4416.62, 9747.53], [4416.62, 8413.44], [2480.62, 3542.07]]
  ),
  garciaProgram(
    "BS in Computer Science",
    [[4392.42, 6952.92], [3448.62, 9747.53], [5384.62, 8413.44], [3448.62, 3582.6]],
    [[4356.12, 7858.13], [3448.62, 9747.53], [4416.62, 8413.44], [2480.62, 2374.89]]
  ),
  garciaProgram(
    "BS in Office Administration",
    [[2456.42, 6352.5], [2480.62, 5331.57], [2480.62, 5908.59], [4345.04, 4341.63]],
    [[2420.12, 6050.0], [1512.62, 4851.6], [3412.83, 5908.59], [3377.04, 1566.96]]
  ),
];

// ids match the `schools` array (1-16).
export const tuitionBySchool = [
  { id: 1, name: "Garcia College of Technology", programs: garcia },

  {
    id: 2,
    name: "Aklan Catholic College",
    programs: [
      degree("Accountancy", 14500),
      degree("Accounting Information System", 14000),
      degree("Real Estate Management", 13500),
      degree("Business Administration", 13000),
      degree("Hospitality Management (incl. Culinary Arts)", 15000),
      degree("Tourism Management", 14000),
      degree("Nursing", 22000),
      degree("Criminology", 13500),
      degree("Elementary/Secondary Education", 12500),
      degree("English Language", 12500),
      degree("Political Science", 12500),
      degree("Computer Science", 15000),
      degree("Information Technology", 15000),
      degree("Computer Technology", 12000),
    ],
  },

  {
    id: 3,
    name: "Aklan Polytechnic College",
    programs: [
      degree("BS in Marine Transportation (BSMT)", 20000),
      degree("BS in Marine Engineering (BSMarE)", 20000),
      degree("BS in Nursing (BSN)", 20000),
      degree("BS in Customs Administration (BSCA)", 14000),
      degree("BS in Tourism Management (BSTM)", 14000),
    ],
  },

  {
    id: 4,
    name: "Northwestern Visayan Colleges",
    programs: [
      degree("Criminology", 12500),
      degree("Forensic Science", 13000),
      degree("BEED", 11500),
      degree("BSED (English, Math, Filipino, Social Studies)", 11500),
      degree("BPED", 11500),
      degree("BCAED", 11500),
      degree("BSHM", 13500),
      degree("BSTM", 12500),
      degree("BSBA (management majors)", 12000),
      degree("BSCS", 14000),
      degree("BA in Communication", 12000),
      degree("BA in English Language Studies", 12000),
      degree("TESDA 3-year diploma (Hospitality, Business Marketing, Computer Application, Communication & Media Services)", 9000),
      course("TESDA NC course (Bookkeeping, Computer Systems Servicing, Customer Service, Driving, etc.)", 3500),
    ],
  },

  {
    id: 5,
    name: "STI College of Kalibo",
    programs: [
      degree("BS in Information Technology (BSIT)", 28000),
      degree("BS in Computer Engineering (BSCpE)", 32000),
      degree("BS in Hospitality Management (BSHM)", 27000),
      degree("BS in Tourism Management (BSTM)", 26000),
    ],
  },

  {
    id: 6,
    name: "Panay Technological College",
    programs: [
      course("Computer Hardware Servicing NC II", 6500),
      course("Consumer Electronics Servicing NC II", 6500),
      course("Food and Beverage Services NC II", 5500),
      course("Bartending NC II", 5500),
      course("Housekeeping NC II", 5000),
      course("Automotive Servicing NC II", 9500),
    ],
  },

  {
    id: 7,
    name: "Saint Gabriel College",
    programs: [
      degree("BS in Nursing (BSN)", 19000),
      degree("BS in Medical Technology (BSMT)", 18500),
      degree("BS in Pharmacy", 18500),
      degree("BS in Radiologic Technology (BSRT)", 18000),
      degree("3-year Diploma: Health Services Technology", 12000),
      degree("3-year Diploma: Medical Laboratory Technology", 12000),
      degree("3-year Diploma: Pharmacy Technology", 12000),
      degree("3-year Diploma: Radiologic Laboratory Technology", 12000),
    ],
  },

  {
    id: 8,
    name: "Verde Grande College",
    programs: [
      degree("Diploma in Culinary Arts Technology (DCAT)", 15000),
      degree("Diploma in Cruise Ship Hospitality Services Technology (DCSHST)", 15000),
      degree("3-year Hospitality Technology & Restaurant Operation Technology", 15000),
      course("1-2 year Cruise Ship & Culinary Bundles", 25000),
      course("Bread & Pastry Production NC II", 6000),
      course("Food & Beverage Services NC II", 5500),
      course("Housekeeping NC II", 5000),
      course("Cookery NC II", 6000),
      course("Bartending NC II", 5500),
      course("Food Processing NC II", 5500),
      course("Ships Catering Services NC II", 7500),
    ],
  },

  {
    id: 9,
    name: "PGA-ASU School of Nursing",
    programs: [degree("BS in Nursing (BSN)", 8000)],
  },

  {
    id: 10,
    name: "Aklan Polytechnic College - Maritime Training Center",
    programs: [
      course("STCW Short & Practical Courses", 8000),
      course("Simulator & Laboratory Training", 6000),
    ],
  },

  {
    id: 11,
    name: "Balete Community College",
    programs: [
      localDegree("BS in Hospitality Management (BSHM)"),
      localDegree("Bachelor of Elementary Education (BEEd)"),
      localDegree("BSEd Major in Mathematics"),
      localDegree("BTVTEd Major in Garments and Fashion Design Technology (GFD)"),
    ],
  },

  {
    id: 12,
    name: "Altavas College",
    programs: [
      localDegree("Bachelor of Elementary Education (BEEd)"),
      localDegree("BSEd (Mathematics, English)"),
      localDegree("BS in Criminology (BSCrim)"),
      localDegree("BS in Hospitality Management (BSHM)"),
      localDegree("BS in Office Administration (BSOA)"),
    ],
  },

  {
    id: 13,
    name: "Malay College",
    programs: [
      localDegree("BS in Tourism Management (BSTM)"),
      localDegree("BS in Hospitality Management (BSHM)"),
      localDegree("BS in Entrepreneurship (BSE)"),
      course("Tourism Promotion Services NC II", 2500),
    ],
  },

  {
    id: 14,
    name: "Lezo Technical College",
    programs: [
      course("Food and Beverage Services NC II", 3000),
      course("Housekeeping NC II", 3000),
      course("Household Services NC II", 3000),
    ],
  },

  {
    id: 15,
    name: "Libacao College of Science and Technology",
    programs: [
      localDegree("BS in Hospitality Management (BSHM)"),
      localDegree("Bachelor of Special Needs Education (BSNEd)"),
      localDegree("Bachelor of Industrial Technology (BIndTech)"),
    ],
  },

  {
    id: 16,
    name: "Batan Integrated College of Technology",
    programs: [
      localDegree("BSEd Major in Filipino"),
      localDegree("BS in Office Administration (BSOA) Major in Management"),
      localDegree("BS in Hospitality Management (BSHM)"),
    ],
  },
];