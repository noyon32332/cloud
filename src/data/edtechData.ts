export interface Question {
  id: string
  questionText: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  points: number
  explanation: string
  chapterId?: string
}

export interface Exam {
  id: string
  title: string
  subject: string
  courseId: string
  chapterId: string
  durationMinutes: number
  totalMarks: number
  passingMarks: number
  status: 'Published' | 'Draft' | 'Archived' | 'Assigned' | 'Completed'
  dueDate?: string
  questions: Question[]
  attemptsCount?: number
  averageScore?: number
  userScore?: number
  userStatus?: 'Pending' | 'In Progress' | 'Completed'
  submittedAt?: string
}

export interface Chapter {
  id: string
  courseId: string
  chapterNumber: number
  title: string
  subject: string
  readTime: string
  summary: string
  keyConcepts: {
    title: string
    description: string
    formulaOrSnippet?: string
  }[]
  contentParagraphs: string[]
  sampleQuestionsCount: number
}

export interface Course {
  id: string
  title: string
  code: string
  subject: string
  instructor: string
  enrolledStudents: number
  progress: number
  totalChapters: number
  totalExams: number
  color: string
  description: string
}

export interface StudentRank {
  rank: number
  id: string
  name: string
  avatar?: string
  email: string
  examsTaken: number
  averageScore: number
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C'
}

export interface StudentExamSubmission {
  examId: string
  examTitle: string
  subject: string
  score: number
  totalMarks: number
  percentage: number
  passed: boolean
  submittedAt: string
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>
  timeSpentSeconds: number
}

// Initial Mock Data
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Advanced Thermodynamics & Energy Systems',
    code: 'PHY-301',
    subject: 'Physics',
    instructor: 'Dr. Arthur Mitchell',
    enrolledStudents: 142,
    progress: 75,
    totalChapters: 8,
    totalExams: 4,
    color: 'from-blue-600 to-indigo-600',
    description: 'Deep dive into thermodynamic laws, entropy, heat engines, and phase transitions with applied problems.',
  },
  {
    id: 'course-2',
    title: 'Calculus III: Multivariable & Vector Calculus',
    code: 'MATH-202',
    subject: 'Mathematics',
    instructor: 'Prof. Evelyn Reed',
    enrolledStudents: 188,
    progress: 60,
    totalChapters: 10,
    totalExams: 5,
    color: 'from-sky-500 to-blue-600',
    description: 'Partial derivatives, multiple integrals, vector calculus, Stokes theorem, and divergence applications.',
  },
  {
    id: 'course-3',
    title: 'Data Structures & Algorithmic Optimization',
    code: 'CS-204',
    subject: 'Computer Science',
    instructor: 'Dr. Kevin Zhang',
    enrolledStudents: 230,
    progress: 90,
    totalChapters: 12,
    totalExams: 6,
    color: 'from-emerald-500 to-teal-600',
    description: 'Trees, graphs, dynamic programming, algorithmic complexities, and scalable problem solving.',
  },
  {
    id: 'course-4',
    title: 'Organic Chemistry & Reaction Mechanisms',
    code: 'CHEM-205',
    subject: 'Chemistry',
    instructor: 'Dr. Sarah Al-Mansoor',
    enrolledStudents: 115,
    progress: 40,
    totalChapters: 6,
    totalExams: 3,
    color: 'from-amber-500 to-orange-600',
    description: 'Stereochemistry, reaction kinetics, electrophilic additions, and molecular synthesis fundamentals.',
  },
]

export const mockChapters: Chapter[] = [
  {
    id: 'chap-1',
    courseId: 'course-1',
    chapterNumber: 1,
    title: 'Laws of Thermodynamics & Enthalpy',
    subject: 'Physics',
    readTime: '20 min read',
    summary: 'Explores the conservation of energy, internal energy formulations, and state function properties.',
    keyConcepts: [
      {
        title: 'First Law of Thermodynamics',
        description: 'Energy cannot be created or destroyed, only transferred or transformed. The change in internal energy equals heat added minus work done by system.',
        formulaOrSnippet: 'ΔU = Q - W',
      },
      {
        title: 'Enthalpy Definition',
        description: 'A thermodynamic quantity equivalent to the total heat content of a system, equal to internal energy plus product of pressure and volume.',
        formulaOrSnippet: 'H = U + PV',
      },
      {
        title: 'Isobaric vs Isometric Processes',
        description: 'Under constant pressure, heat transfer equals change in enthalpy. Under constant volume, work is zero.',
      },
    ],
    contentParagraphs: [
      'Thermodynamics is the branch of physics that deals with heat, work, and temperature, and their relation to energy, radiation, and physical properties of matter.',
      'The first law of thermodynamics states that the change in internal energy ΔU of a closed system is equal to the amount of heat Q supplied to the system, minus the amount of work W done by the system on its surroundings.',
      'Enthalpy (H) is defined as the sum of the internal energy (U) and the product of pressure (P) and volume (V). In constant-pressure processes, enthalpy changes directly correspond to the heat absorbed or released.',
    ],
    sampleQuestionsCount: 8,
  },
  {
    id: 'chap-2',
    courseId: 'course-1',
    chapterNumber: 2,
    title: 'Entropy, Heat Engines & Carnot Cycle',
    subject: 'Physics',
    readTime: '25 min read',
    summary: 'The Second Law, macroscopic entropy, Carnot efficiency limit, and reversible processes.',
    keyConcepts: [
      {
        title: 'Second Law of Thermodynamics',
        description: 'The total entropy of an isolated system always increases over time, approaching a maximum value at thermodynamic equilibrium.',
        formulaOrSnippet: 'ΔS_total >= 0',
      },
      {
        title: 'Carnot Cycle Efficiency',
        description: 'Maximum theoretical efficiency of any heat engine operating between two temperatures T_hot and T_cold.',
        formulaOrSnippet: 'η = 1 - (T_cold / T_hot)',
      },
    ],
    contentParagraphs: [
      'The Second Law explains why natural processes are irreversible. Heat flows spontaneously from hotter bodies to colder bodies and never in reverse without external work.',
      'The Carnot engine is a theoretical thermodynamic cycle proposed by Nicolas Léonard Sadi Carnot. It provides an upper limit on the efficiency that any classical thermodynamic engine can achieve during the conversion of heat into work.',
    ],
    sampleQuestionsCount: 10,
  },
  {
    id: 'chap-3',
    courseId: 'course-2',
    chapterNumber: 1,
    title: 'Partial Derivatives & Gradient Vectors',
    subject: 'Mathematics',
    readTime: '15 min read',
    summary: 'Rate of change in multivariable scalar fields, gradient direction of steepest ascent.',
    keyConcepts: [
      {
        title: 'Gradient Vector',
        description: 'Vector consisting of all first-order partial derivatives of a scalar-valued function. Points in the direction of greatest rate of increase.',
        formulaOrSnippet: '∇f = [∂f/∂x, ∂f/∂y, ∂f/∂z]',
      },
      {
        title: 'Directional Derivative',
        description: 'Rate at which the function changes at a point in the direction of a unit vector u.',
        formulaOrSnippet: 'D_u f = ∇f · u',
      },
    ],
    contentParagraphs: [
      'In multivariable calculus, the partial derivative of a function of several variables is its derivative with respect to one of those variables, with the others held constant.',
      'The gradient vector ∇f of a differentiable function f is perpendicular to the level curves/surfaces and points in the direction of the greatest rate of increase of the function.',
    ],
    sampleQuestionsCount: 6,
  },
  {
    id: 'chap-4',
    courseId: 'course-3',
    chapterNumber: 1,
    title: 'Balanced Binary Search Trees & AVL Rotations',
    subject: 'Computer Science',
    readTime: '30 min read',
    summary: 'Self-balancing binary search trees ensuring logarithmic search, insertion, and deletion complexity.',
    keyConcepts: [
      {
        title: 'Balance Factor in AVL Trees',
        description: 'Height of left subtree minus height of right subtree. Allowed values are -1, 0, or +1.',
        formulaOrSnippet: 'BF = height(Left) - height(Right)',
      },
      {
        title: 'Rotations',
        description: 'Single LL/RR rotations and double LR/RL rotations restore balance in O(1) time after insertions or deletions.',
      },
    ],
    contentParagraphs: [
      'An AVL tree is a self-balancing binary search tree where the difference between heights of left and right subtrees for any node cannot be more than one.',
      'Search, insertion, and deletion all take O(log n) time in both the average and worst cases, making AVL trees ideal for lookup-heavy datasets.',
    ],
    sampleQuestionsCount: 12,
  },
]

export const mockQuestions: Question[] = [
  {
    id: 'q-101',
    chapterId: 'chap-1',
    questionText: 'According to the First Law of Thermodynamics, which expression correctly represents the change in internal energy (ΔU)?',
    difficulty: 'Easy',
    options: {
      A: 'ΔU = Q - W',
      B: 'ΔU = Q + PV',
      C: 'ΔU = W - Q',
      D: 'ΔU = H - TS',
    },
    correctAnswer: 'A',
    points: 2,
    explanation: 'The first law states that the change in internal energy is the heat supplied to the system minus the work done by the system: ΔU = Q - W.',
  },
  {
    id: 'q-102',
    chapterId: 'chap-1',
    questionText: 'During an isobaric expansion of an ideal gas, which of the following statements is always true?',
    difficulty: 'Medium',
    options: {
      A: 'The work done by the gas is zero',
      B: 'Heat added to the system is equal to the change in enthalpy (Q = ΔH)',
      C: 'The temperature of the gas must decrease',
      D: 'Internal energy change ΔU is equal to heat added Q',
    },
    correctAnswer: 'B',
    points: 3,
    explanation: 'At constant pressure (isobaric), dH = dU + d(PV) = dU + P dV = dQ. Thus ΔH = Q_p.',
  },
  {
    id: 'q-103',
    chapterId: 'chap-2',
    questionText: 'A Carnot heat engine operates between a heat source at 600 K and a sink at 300 K. What is its maximum theoretical efficiency?',
    difficulty: 'Easy',
    options: {
      A: '25%',
      B: '33.3%',
      C: '50%',
      D: '75%',
    },
    correctAnswer: 'C',
    points: 2,
    explanation: 'Efficiency η = 1 - (T_cold / T_hot) = 1 - (300 / 600) = 1 - 0.5 = 50%.',
  },
  {
    id: 'q-104',
    chapterId: 'chap-2',
    questionText: 'Which condition defines an isentropic process in an ideal gas system?',
    difficulty: 'Medium',
    options: {
      A: 'Reversible and isothermal',
      B: 'Reversible and adiabatic',
      C: 'Irreversible and isobaric',
      D: 'Isometric and non-adiabatic',
    },
    correctAnswer: 'B',
    points: 3,
    explanation: 'An isentropic process is both reversible (no entropy generation) and adiabatic (no heat transfer), resulting in dS = 0.',
  },
  {
    id: 'q-105',
    chapterId: 'chap-2',
    questionText: 'If 500 J of heat is reversibly transferred to a reservoir at a constant temperature of 250 K, what is the entropy change of the reservoir?',
    difficulty: 'Hard',
    options: {
      A: '+2.0 J/K',
      B: '-2.0 J/K',
      C: '+0.5 J/K',
      D: '+125 kJ/K',
    },
    correctAnswer: 'A',
    points: 5,
    explanation: 'ΔS = Q_rev / T = 500 J / 250 K = +2.0 J/K.',
  },
]

export const mockExams: Exam[] = [
  {
    id: 'exam-1',
    title: 'Midterm Assessment: Thermodynamics & Heat Cycles',
    subject: 'Physics',
    courseId: 'course-1',
    chapterId: 'chap-1',
    durationMinutes: 45,
    totalMarks: 15,
    passingMarks: 9,
    status: 'Published',
    dueDate: 'Tomorrow, 11:59 PM',
    userStatus: 'Pending',
    attemptsCount: 64,
    averageScore: 11.2,
    questions: mockQuestions,
  },
  {
    id: 'exam-2',
    title: 'Quiz 2: Multivariable Gradient & Directional Derivatives',
    subject: 'Mathematics',
    courseId: 'course-2',
    chapterId: 'chap-3',
    durationMinutes: 30,
    totalMarks: 20,
    passingMarks: 12,
    status: 'Assigned',
    dueDate: 'In 3 days',
    userStatus: 'Pending',
    attemptsCount: 82,
    averageScore: 16.4,
    questions: [
      {
        id: 'q-201',
        chapterId: 'chap-3',
        questionText: 'Given f(x, y) = x^2 + 3xy, what is the gradient vector ∇f at the point (1, 2)?',
        difficulty: 'Medium',
        options: {
          A: '[8, 3]',
          B: '[5, 3]',
          C: '[7, 3]',
          D: '[2, 6]',
        },
        correctAnswer: 'A',
        points: 4,
        explanation: '∂f/∂x = 2x + 3y. At (1, 2): 2(1) + 3(2) = 8. ∂f/∂y = 3x. At (1, 2): 3(1) = 3. So ∇f = [8, 3].',
      },
      {
        id: 'q-202',
        chapterId: 'chap-3',
        questionText: 'The directional derivative of f in the direction of the unit vector u is maximized when u is:',
        difficulty: 'Easy',
        options: {
          A: 'Orthogonal to the gradient ∇f',
          B: 'Parallel and in the same direction as ∇f',
          C: 'Opposite to ∇f',
          D: 'At an angle of 45 degrees to ∇f',
        },
        correctAnswer: 'B',
        points: 4,
        explanation: 'D_u f = ∇f · u = |∇f| cos(θ). The dot product is maximized when θ = 0 (cos(0) = 1), i.e., in the direction of ∇f.',
      },
      {
        id: 'q-203',
        chapterId: 'chap-3',
        questionText: 'What is the value of the directional derivative along a level curve f(x, y) = c?',
        difficulty: 'Medium',
        options: {
          A: 'Always 0',
          B: 'Equal to |∇f|',
          C: 'Undefined',
          D: 'Equal to c',
        },
        correctAnswer: 'A',
        points: 4,
        explanation: 'Along a level curve, the function value is constant, so the rate of change is zero.',
      },
    ],
  },
  {
    id: 'exam-3',
    title: 'Diagnostic Test: Tree Balancing & Rotations',
    subject: 'Computer Science',
    courseId: 'course-3',
    chapterId: 'chap-4',
    durationMinutes: 20,
    totalMarks: 10,
    passingMarks: 6,
    status: 'Completed',
    dueDate: 'Completed on Aug 12',
    userStatus: 'Completed',
    userScore: 9,
    attemptsCount: 140,
    averageScore: 8.5,
    questions: [
      {
        id: 'q-301',
        chapterId: 'chap-4',
        questionText: 'What is the maximum allowed balance factor in an AVL tree node?',
        difficulty: 'Easy',
        options: {
          A: '0',
          B: '+1',
          C: '+2',
          D: 'log(n)',
        },
        correctAnswer: 'B',
        points: 5,
        explanation: 'In an AVL tree, the balance factor (left height - right height) must be within {-1, 0, +1}.',
      },
      {
        id: 'q-302',
        chapterId: 'chap-4',
        questionText: 'When a node is inserted into the left subtree of the right child of an unbalanced node, which rotation restores AVL balance?',
        difficulty: 'Hard',
        options: {
          A: 'Single Left Rotation (LL)',
          B: 'Single Right Rotation (RR)',
          C: 'Right-Left Double Rotation (RL)',
          D: 'Left-Right Double Rotation (LR)',
        },
        correctAnswer: 'C',
        points: 5,
        explanation: 'A Right-Left (RL) rotation first rotates the right child to the right, then the node to the left.',
      },
    ],
  },
  {
    id: 'exam-4',
    title: 'Final Practice: Organic Synthesis Pathways',
    subject: 'Chemistry',
    courseId: 'course-4',
    chapterId: 'chap-1',
    durationMinutes: 60,
    totalMarks: 25,
    passingMarks: 15,
    status: 'Published',
    dueDate: 'Next week',
    userStatus: 'Pending',
    attemptsCount: 38,
    averageScore: 18.2,
    questions: mockQuestions,
  },
]

export const mockLeaderboard: StudentRank[] = [
  { rank: 1, id: 's-1', name: 'Sophia Chen', email: 'sophia.c@edusphere.edu', examsTaken: 18, averageScore: 96.4, grade: 'A+' },
  { rank: 2, id: 's-2', name: 'Marcus Sterling', email: 'marcus.s@edusphere.edu', examsTaken: 17, averageScore: 94.8, grade: 'A+' },
  { rank: 3, id: 's-3', name: 'Aaliyah Rahman', email: 'aaliyah.r@edusphere.edu', examsTaken: 16, averageScore: 92.1, grade: 'A' },
  { rank: 4, id: 's-4', name: 'Liam Davies', email: 'liam.d@edusphere.edu', examsTaken: 15, averageScore: 89.5, grade: 'A' },
  { rank: 5, id: 's-5', name: 'Zainab Patel', email: 'zainab.p@edusphere.edu', examsTaken: 14, averageScore: 87.2, grade: 'B+' },
  { rank: 6, id: 's-6', name: 'Ethan Miller', email: 'ethan.m@edusphere.edu', examsTaken: 14, averageScore: 84.6, grade: 'B+' },
  { rank: 7, id: 's-7', name: 'Clara Vance', email: 'clara.v@edusphere.edu', examsTaken: 12, averageScore: 79.8, grade: 'B' },
]

export const teacherStats = {
  totalStudents: 1248,
  totalExams: 36,
  publishedExams: 28,
  averageScore: 78.4,
  passRate: 91.2,
  totalAttempts: 482,
  difficultyBreakdown: {
    easy: { total: 45, correctPercentage: 92.4 },
    medium: { total: 78, correctPercentage: 76.1 },
    hard: { total: 32, correctPercentage: 54.8 },
  },
  questionErrorAnalysis: [
    { question: 'Isentropic vs Reversible Adiabatic condition', subject: 'Physics', failureRate: 46.2, difficulty: 'Hard' },
    { question: 'RL Rotation identification in AVL trees', subject: 'Computer Science', failureRate: 42.8, difficulty: 'Hard' },
    { question: 'Directional derivative along level curves', subject: 'Mathematics', failureRate: 38.5, difficulty: 'Medium' },
    { question: 'Enthalpy in Isobaric conditions', subject: 'Physics', failureRate: 24.1, difficulty: 'Medium' },
  ],
}

export const studentStats = {
  assignedExams: 8,
  completedExams: 14,
  pendingExams: 3,
  averageScore: 84.6,
  scoreHistory: [
    { exam: 'Quiz 1 (Phys)', date: 'Jul 10', score: 85, avg: 76 },
    { exam: 'Midterm (Math)', date: 'Jul 18', score: 92, avg: 81 },
    { exam: 'Trees (CS)', date: 'Jul 26', score: 78, avg: 72 },
    { exam: 'Kinetics (Chem)', date: 'Aug 02', score: 88, avg: 79 },
    { exam: 'Entropy (Phys)', date: 'Aug 08', score: 95, avg: 80 },
    { exam: 'AVL Trees (CS)', date: 'Aug 12', score: 90, avg: 85 },
  ],
  subjectMastery: [
    { subject: 'Mathematics', score: 91, status: 'Strong' },
    { subject: 'Physics', score: 88, status: 'Strong' },
    { subject: 'Computer Science', score: 84, status: 'Moderate' },
    { subject: 'Chemistry', score: 72, status: 'Needs Review' },
  ],
  weakAreas: [
    { topic: 'Reaction Mechanisms (SN1 vs SN2)', subject: 'Chemistry', accuracy: '62%' },
    { topic: 'Graph Shortest Path (Dijkstra)', subject: 'Computer Science', accuracy: '68%' },
  ],
  strongAreas: [
    { topic: 'Multivariable Derivatives', subject: 'Mathematics', accuracy: '95%' },
    { topic: 'Thermodynamics Laws', subject: 'Physics', accuracy: '92%' },
    { topic: 'Binary Search Trees', subject: 'Computer Science', accuracy: '90%' },
  ],
}
