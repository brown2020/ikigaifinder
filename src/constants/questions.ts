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

export const artStyles = [
  {
    id: 1,
    value: "Prehistoric Art",
    label: "Prehistoric Art",
  },
  {
    id: 2,
    value: "Ancient Egyptian Art",
    label: "Ancient Egyptian Art",
  },
  {
    id: 3,
    value: "Ancient Greek Art",
    label: "Ancient Greek Art",
  },
  {
    id: 4,
    value: "Renaissance Art",
    label: "Renaissance Art",
  },
  {
    id: 5,
    value: "Haida Art",
    label: "Haida Art",
  },
  {
    id: 6,
    value: "Ukiyo-e Art",
    label: "Ukiyo-e Art",
  },
  {
    id: 7,
    value: "Impressionism",
    label: "Impressionism",
  },
  {
    id: 8,
    value: "Cubism",
    label: "Cubism",
  },
  {
    id: 9,
    value: "Surrealism",
    label: "Surrealism",
  },
  {
    id: 10,
    value: "Abstract Expressionism",
    label: "Abstract Expressionism",
  },
  {
    id: 11,
    value: "Minimalism",
    label: "Minimalism",
  },
  {
    id: 12,
    value: "Street Art",
    label: "Street Art",
  },
  {
    id: 13,
    value: "Contemporary Art",
    label: "Contemporary Art",
  },
  {
    id: 14,
    value: "Documentary Photography",
    label: "Documentary Photography",
  },
  {
    id: 15,
    value: "Art Nouveau",
    label: "Art Nouveau",
  },
  {
    id: 16,
    value: "Neo-Pop Art",
    label: "Neo-Pop Art",
  },
  {
    id: 17,
    value: "Contemporary Architecture",
    label: "Contemporary Architecture",
  },
  {
    id: 18,
    value: "Installation Art",
    label: "Installation Art",
  },
  {
    id: 19,
    value: "Aboriginal Australian Art",
    label: "Aboriginal Australian Art",
  },
  {
    id: 20,
    value: "Traditional Chinese Painting",
    label: "Traditional Chinese Painting",
  },
];