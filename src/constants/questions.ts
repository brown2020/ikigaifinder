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
