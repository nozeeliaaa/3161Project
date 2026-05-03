export const demoStats = {
  student: [
    { label: "Active Courses", value: "5", trend: "+2 this term" },
    { label: "Upcoming Deadlines", value: "8", trend: "3 due this week" },
    { label: "Grade Average", value: "86%", trend: "+4% from last month" }
  ],
  lecturer: [
    { label: "Courses Teaching", value: "4", trend: "142 students" },
    { label: "Ungraded Submissions", value: "26", trend: "12 due today" },
    { label: "Forum Activity", value: "318", trend: "posts this week" }
  ],
  admin: [
    { label: "Courses", value: "28", trend: "6 departments" },
    { label: "Students", value: "1,284", trend: "+9% enrollment" },
    { label: "Lecturers", value: "74", trend: "12 active today" }
  ]
};

export const sampleCourses = [
  {
    course_id: 101,
    course_code: "COMP3161",
    course_name: "Database Management Systems",
    description: "Relational design, SQL, indexing, transactions, and practical application development.",
    first_name: "Maya",
    last_name: "Chen",
    student_count: 48
  },
  {
    course_id: 102,
    course_code: "INFO3430",
    course_name: "Human Computer Interaction",
    description: "Design research, interaction patterns, evaluation methods, and interface prototyping.",
    first_name: "Andre",
    last_name: "Williams",
    student_count: 36
  },
  {
    course_id: 103,
    course_code: "COMP3901",
    course_name: "Capstone Project",
    description: "Team-based software delivery with stakeholder reviews and production-quality artifacts.",
    first_name: "Leah",
    last_name: "Morgan",
    student_count: 24
  }
];

export const sampleSections = [
  {
    section_id: 1,
    section_title: "Week 1 - Orientation and Architecture",
    section_order: 1,
    items: [
      { item_id: 1, item_title: "Course outline", item_type: "file", item_url: "#" },
      { item_id: 2, item_title: "LMS walkthrough slides", item_type: "slide", item_url: "#" },
      { item_id: 3, item_title: "Database primer", item_type: "link", item_url: "#" }
    ]
  },
  {
    section_id: 2,
    section_title: "Week 2 - Schema Design",
    section_order: 2,
    items: [
      { item_id: 4, item_title: "Entity relationship modelling", item_type: "slide", item_url: "#" },
      { item_id: 5, item_title: "Normalization worksheet", item_type: "file", item_url: "#" }
    ]
  }
];

export const sampleForums = [
  { forum_id: 1, forum_title: "General Q&A", created_at: "2026-04-14 09:00:00" },
  { forum_id: 2, forum_title: "Assignment Help", created_at: "2026-04-18 11:30:00" }
];

export const sampleThreads = [
  {
    thread_id: 1,
    thread_title: "How should we model recursive replies?",
    starting_post: "I understand parent IDs conceptually, but I am not sure how to render them cleanly.",
    first_name: "Talia",
    last_name: "Brown",
    created_at: "2026-04-20 10:14:00"
  },
  {
    thread_id: 2,
    thread_title: "Indexing strategy for forum queries",
    starting_post: "Which columns matter most when ordering threads and replies?",
    first_name: "Noah",
    last_name: "Singh",
    created_at: "2026-04-21 13:40:00"
  }
];

export const sampleReplies = [
  {
    reply_id: 1,
    parent_reply_id: null,
    reply_text: "Start by grouping replies by parent_reply_id, then recursively render each branch.",
    first_name: "Maya",
    last_name: "Chen",
    created_at: "2026-04-20 10:45:00"
  },
  {
    reply_id: 2,
    parent_reply_id: 1,
    reply_text: "That clicked. I used a Map for the lookup and it feels much cleaner.",
    first_name: "Talia",
    last_name: "Brown",
    created_at: "2026-04-20 11:08:00"
  }
];

export const sampleAssignments = [
  {
    assignment_id: 1,
    assignment_title: "ERD and Normalization Brief",
    description: "Submit an ERD, relational schema, and notes on normalization decisions.",
    due_date: "2026-05-03",
    max_grade: 100,
    first_name: "Maya",
    last_name: "Chen"
  },
  {
    assignment_id: 2,
    assignment_title: "SQL Query Portfolio",
    description: "Provide ten analytical queries with screenshots and explanations.",
    due_date: "2026-05-17",
    max_grade: 100,
    first_name: "Maya",
    last_name: "Chen"
  }
];

export const sampleEvents = [
  {
    event_id: 1,
    event_title: "Project checkpoint",
    event_description: "Sprint review and schema feedback.",
    event_date: "2026-05-01",
    start_time: "10:00:00",
    end_time: "11:30:00",
    course_code: "COMP3161"
  },
  {
    event_id: 2,
    event_title: "Assignment 1 due",
    event_description: "Upload through the assignments tab.",
    event_date: "2026-05-03",
    start_time: "23:59:00",
    end_time: null,
    course_code: "COMP3161"
  }
];
