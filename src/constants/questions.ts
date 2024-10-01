import { questionStepT } from "@/types/interface";
import { QuestionType } from "@/types/question";

export const questions: QuestionType[] = [
  {
    name: "lostTrackOfTime",
    headline: "Reflect on Your Interests",
    information:
      "Consider moments where you were deeply engaged in an activity.",
    instructions: "Provide detailed descriptions.",
    questionType: "textarea",
    question:
      "Think about a time when you lost track of time doing something. What were you doing?",
    answer: [],
  },
  {
    name: "morningExcitement",
    headline: "Identify Your Passions",
    information: "Think about what excites you in the morning.",
    instructions: "List all activities or topics.",
    questionType: "textarea",
    question:
      "What activities or topics make you excited to get out of bed in the morning?",
    answer: [],
  },
  {
    name: "naturalSkills",
    headline: "Recognize Your Natural Talents",
    information: "Focus on activities you excel at effortlessly.",
    instructions: "Mention all tasks or activities.",
    questionType: "textarea",
    question: "What tasks or activities do you excel at without much effort?",
    answer: [],
  },
  {
    name: "receivedPraise",
    headline: "Acknowledge Your Strengths",
    information: "Reflect on the praise you've received.",
    instructions: "Detail the context and reasons for praise.",
    questionType: "textarea",
    question:
      "Think about a time when you received praise for your work. What was it for?",
    answer: [],
  },
  {
    name: "worldProblem",
    headline: "Consider Global Impact",
    information: "Imagine solving a significant problem.",
    instructions: "Describe the problem and potential solution.",
    questionType: "textarea",
    question: "If you could solve one problem in the world, what would it be?",
    answer: [],
  },
  {
    name: "inspiredHelp",
    headline: "Identify Your Inspiration",
    information: "Who inspires you to offer help and support?",
    instructions: "List individuals or groups.",
    questionType: "textarea",
    question: "Who do you feel most inspired to help or support?",
    answer: [],
  },
  {
    name: "paidSkills",
    headline: "Monetize Your Talents",
    information: "Think about skills you could get paid for.",
    instructions: "List all skills or talents.",
    questionType: "textarea",
    question:
      "What are some of the skills or talents that you could potentially get paid for?",
    answer: [],
  },
  {
    name: "jobWithoutMoney",
    headline: "Identify Your Dream Job",
    information: "Consider a job you'd do for passion.",
    instructions: "Describe the job and reasons for choosing it.",
    questionType: "textarea",
    question:
      "Think about a job you would do even if you didn’t need the money. What job is that?",
    answer: [],
  },
  {
    name: "fulfilledMoment",
    headline: "Recognize Fulfillment",
    information: "Reflect on fulfilling moments.",
    instructions: "Describe the activity and reasons for fulfillment.",
    questionType: "textarea",
    question:
      "Describe a moment when you felt truly fulfilled. What were you doing, and why did it feel fulfilling?",
    answer: [],
  },
  {
    name: "dedicateLife",
    headline: "Consider Your Life's Work",
    information: "Think about a cause or project for a lifetime.",
    instructions: "Describe the project or cause.",
    questionType: "textarea",
    question:
      "If you had no constraints, what project or cause would you dedicate your life to?",
    answer: [],
  },

  {
    name: "hobbies",
    headline: "Select Your Hobbies",
    information: "Choose the hobbies you enjoy.",
    instructions: "You can select multiple hobbies.",
    questionType: "multiselect",
    question: "What are your favorite hobbies?",
    answer: [],
    options: ["Reading", "Traveling", "Cooking", "Sports", "Music"],
  },
];

export const STEPPER_QUESTIONS_JSON: questionStepT[] = [
  {
    id: "passion",
    title: "What You Love (Passion)",
    description:
      "These questions help you identify your true passions and interests.",
    questions: [
      {
        id: "activities",
        label: "What activities make you feel most alive or joyful?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your activities",
      },
      {
        id: "all_day_activity",
        label: "If you could do anything all day, what would you do?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your all day activity",
      },
      {
        id: "learning_interest",
        label:
          "What do you love learning about, even if there's no external reward?",
        type: "text",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your learning interest",
      },
      {
        id: "hobbies",
        label: "Which hobbies or interests make you lose track of time?",
        type: "select-tags",
        placeholder: "Select your hobbies",
        multiple: true,
        options: ["Reading", "Traveling", "Cooking", "Sports", "Music"],
        validation: {
          required: "This field is required.",
          maxLength: 3,
          message: "You can select up to 3 options.",
        },
      },
    ],
  },
  {
    id: "profession",
    title: "What You Are Good At (Profession)",
    description:
      "These questions help you identify your natural strengths and talents.",
    questions: [
      {
        id: "compliments",
        label: "What skills or activities do others often compliment you on?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your skills or activities",
      },
      {
        id: "easy_tasks",
        label:
          "Which tasks or challenges do you find easy while others struggle?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your easy tasks or challenges",
      },
      {
        id: "help_requests",
        label: "What do people usually ask for your help or advice with?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your help requests",
      },
      {
        id: "quick_learning",
        label:
          "What skills do you learn quickly or feel most comfortable doing?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your quickly learned skills",
      },
    ],
  },
  {
    id: "mission",
    title: "What the World Needs (Mission)",
    description:
      "These questions focus on how you can contribute to the world and make an impact.",
    questions: [
      {
        id: "problems_to_solve",
        label:
          "What problems or issues in the world do you feel passionate about solving?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter the problems you want to solve",
      },
      {
        id: "causes_drawn_to",
        label: "What causes or organizations do you feel drawn to support?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your causes or organizations",
      },
      {
        id: "skills_help_others",
        label:
          "How could your skills or talents help others or improve their lives?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter how your skills can help others",
      },
      {
        id: "change_community",
        label:
          "If you had the power to change something in your community or globally, what would it be?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your ideas for change",
      },
    ],
  },
  {
    id: "vocation",
    title: "What You Can Be Paid For (Vocation)",
    description:
      "These questions will help you discover potential ways to earn a living while doing what you love.",
    button: "Submit",
    questions: [
      {
        id: "marketable_skills",
        label:
          "What skills or knowledge do people seek or pay for in your industry?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your marketable skills",
      },
      {
        id: "in_demand_roles",
        label:
          "What roles or jobs in your field are in demand and aligned with your strengths?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter in-demand roles",
      },
      {
        id: "business_ideas",
        label:
          "If you were to start a business, what service or product could you offer that people would pay for?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your business ideas",
      },
      {
        id: "turn_hobbies_income",
        label:
          "What opportunities exist to turn your hobbies or passions into a sustainable income source?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter opportunities for income",
      },
    ],
  },
];


// i will remove belows json 

export const questionsAns = [
  {
    id: "passion",
    title: "What You Love (Passion)",
    description:
      "These questions help you identify your true passions and interests.",
    questions: [
      {
        id: "activities",
        label: "What activities make you feel most alive or joyful?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your activities",
        answer: [
          "I love to interact with customers those come to my shop.\nalso i'm working as developer, make me joyful when i complete any feature.",
        ],
      },
      {
        id: "all_day_activity",
        label: "If you could do anything all day, what would you do?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your all day activity",
        answer: ["I can be shopkeer, for full day. "],
      },
      {
        id: "learning_interest",
        label:
          "What do you love learning about, even if there's no external reward?",
        type: "text",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your learning interest",
        answer: [
          "I would like to learn meditation, spirituality, enhancing problem solving skills",
        ],
      },
      {
        id: "hobbies",
        label: "Which hobbies or interests make you lose track of time?",
        type: "select-tags",
        placeholder: "Select your hobbies",
        multiple: true,
        options: ["Reading", "Traveling", "Cooking", "Sports", "Music"],
        validation: {
          required: "This field is required.",
          maxLength: 3,
          message: "You can select up to 3 options.",
        },
        answer: ["Reading"],
      },
    ],
  },
  {
    id: "profession",
    title: "What You Are Good At (Profession)",
    description:
      "These questions help you identify your natural strengths and talents.",
    questions: [
      {
        id: "compliments",
        label: "What skills or activities do others often compliment you on?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your skills or activities",
        answer: ["Good at selling and managing"],
      },
      {
        id: "easy_tasks",
        label:
          "Which tasks or challenges do you find easy while others struggle?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your easy tasks or challenges",
        answer: [
          "on my shop i found that i gave easy solutions to manage grocery in stack.",
        ],
      },
      {
        id: "help_requests",
        label: "What do people usually ask for your help or advice with?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your help requests",
        answer: [
          "how he/she should continue on their job, solution for flow management",
        ],
      },
      {
        id: "quick_learning",
        label:
          "What skills do you learn quickly or feel most comfortable doing?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your quickly learned skills",
        answer: ["salesmanship"],
      },
    ],
  },
  {
    id: "mission",
    title: "What the World Needs (Mission)",
    description:
      "These questions focus on how you can contribute to the world and make an impact.",
    questions: [
      {
        id: "problems_to_solve",
        label:
          "What problems or issues in the world do you feel passionate about solving?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter the problems you want to solve",
        answer: ["Agricultural"],
      },
      {
        id: "causes_drawn_to",
        label: "What causes or organizations do you feel drawn to support?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your causes or organizations",
        answer: ["Organizations that help poor people, loves animal"],
      },
      {
        id: "skills_help_others",
        label:
          "How could your skills or talents help others or improve their lives?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter how your skills can help others",
        answer: ["Management of task"],
      },
      {
        id: "change_community",
        label:
          "If you had the power to change something in your community or globally, what would it be?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your ideas for change",
        answer: ["helping poor people, feeding hungry people/animals"],
      },
    ],
  },
  {
    id: "vocation",
    title: "What You Can Be Paid For (Vocation)",
    description:
      "These questions will help you discover potential ways to earn a living while doing what you love.",
    button: "Submit",
    questions: [
      {
        id: "marketable_skills",
        label:
          "What skills or knowledge do people seek or pay for in your industry?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your marketable skills",
        answer: ["Software Development"],
      },
      {
        id: "in_demand_roles",
        label:
          "What roles or jobs in your field are in demand and aligned with your strengths?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter in-demand roles",
        answer: ["Development"],
      },
      {
        id: "business_ideas",
        label:
          "If you were to start a business, what service or product could you offer that people would pay for?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter your business ideas",
        answer: ["Online grocery shop"],
      },
      {
        id: "turn_hobbies_income",
        label:
          "What opportunities exist to turn your hobbies or passions into a sustainable income source?",
        type: "textarea",
        validation: {
          required: "This field is required.",
          message: "",
        },
        placeholder: "Enter opportunities for income",
        answer: ["Online shopping portals"],
      },
    ],
  },
];

export const onlyQuestions = [
  {
    question: "What activities make you feel most alive or joyful?",
    answer:
      "I love to interact with customers those come to my shop.\nalso i'm working as developer, make me joyful when i complete any feature.",
  },
  {
    question: "If you could do anything all day, what would you do?",
    answer: "I can be shopkeer, for full day. ",
  },
  {
    question:
      "What do you love learning about, even if there's no external reward?",
    answer:
      "I would like to learn meditation, spirituality, enhancing problem solving skills",
  },
  {
    question: "Which hobbies or interests make you lose track of time?",
    answer: "Reading",
  },
  {
    question: "What skills or activities do others often compliment you on?",
    answer: "Good at selling and managing",
  },
  {
    question:
      "Which tasks or challenges do you find easy while others struggle?",
    answer:
      "on my shop i found that i gave easy solutions to manage grocery in stack.",
  },
  {
    question: "What do people usually ask for your help or advice with?",
    answer:
      "how he/she should continue on their job, solution for flow management",
  },
  {
    question:
      "What skills do you learn quickly or feel most comfortable doing?",
    answer: "salesmanship",
  },
  {
    question:
      "What problems or issues in the world do you feel passionate about solving?",
    answer: "Agricultural",
  },
  {
    question: "What causes or organizations do you feel drawn to support?",
    answer: "Organizations that help poor people, loves animal",
  },
  {
    question:
      "How could your skills or talents help others or improve their lives?",
    answer: "Management of task",
  },
  {
    question:
      "If you had the power to change something in your community or globally, what would it be?",
    answer: "helping poor people, feeding hungry people/animals",
  },
  {
    question:
      "What skills or knowledge do people seek or pay for in your industry?",
    answer: "Software Development",
  },
  {
    question:
      "What roles or jobs in your field are in demand and aligned with your strengths?",
    answer: "Development",
  },
  {
    question:
      "If you were to start a business, what service or product could you offer that people would pay for?",
    answer: "Online grocery shop",
  },
  {
    question:
      "What opportunities exist to turn your hobbies or passions into a sustainable income source?",
    answer: "Online shopping portals",
  },
];

export const testing = [
  {
      "question": "What activities make you feel most alive or joyful?",
      "answer": [
          "long hour of cycling, dance, learning new tech, teaching"
      ]
  },
  {
      "question": "If you could do anything all day, what would you do?",
      "answer": [
          "Teaching, Coding, Management"
      ]
  },
  {
      "question": "What do you love learning about, even if there's no external reward?",
      "answer": [
          "Current Affairs, Finance, technology, Global crisis"
      ]
  },
  {
      "question": "Which hobbies or interests make you lose track of time?",
      "answer": [
          "Reading",
          "teaching",
          "watching"
      ]
  },
  {
      "question": "What skills or activities do others often compliment you on?",
      "answer": [
          "Communication, Thought process and Compassion"
      ]
  },
  {
      "question": "Which tasks or challenges do you find easy while others struggle?",
      "answer": [
          "Picking up new skill set, Communication"
      ]
  },
  {
      "question": "What do people usually ask for your help or advice with?",
      "answer": [
          "How to analyse a problem"
      ]
  },
  {
      "question": "What skills do you learn quickly or feel most comfortable doing?",
      "answer": [
          "Teaching"
      ]
  },
  {
      "question": "What problems or issues in the world do you feel passionate about solving?",
      "answer": [
          "Child education, poverty and hunger"
      ]
  },
  {
      "question": "What causes or organizations do you feel drawn to support?",
      "answer": [
          "Organisations such as UNICEF, WHO"
      ]
  },
  {
      "question": "How could your skills or talents help others or improve their lives?",
      "answer": [
          "Add value to other lives by understanding other's problems and figuring out a way on how to solve them"
      ]
  },
  {
      "question": "If you had the power to change something in your community or globally, what would it be?",
      "answer": [
          "Child Education, Opportunities for the under priviledged"
      ]
  },
  {
      "question": "What skills or knowledge do people seek or pay for in your industry?",
      "answer": [
          "Problem solving skills"
      ]
  },
  {
      "question": "What roles or jobs in your field are in demand and aligned with your strengths?",
      "answer": [
          "Software Engineer"
      ]
  },
  {
      "question": "If you were to start a business, what service or product could you offer that people would pay for?",
      "answer": [
          "making life simpler with AI tools"
      ]
  },
  {
      "question": "What opportunities exist to turn your hobbies or passions into a sustainable income source?",
      "answer": [
          "Bootstrapping a medical device as a startup"
      ]
  }
]