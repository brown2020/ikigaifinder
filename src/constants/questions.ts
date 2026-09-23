import type { QuestionStep, QuestionStepper } from "@/types";

const required = { required: "Please add an answer.", message: "" };

function textQuestion(id: string, label: string, placeholder: string): QuestionStepper {
  return { id, label, type: "textarea", placeholder, validation: required };
}

/** Section ids and question ids are persisted in Firestore; don't rename them. */
export const STEPPER_QUESTIONS_JSON: QuestionStep[] = [
  {
    id: "passion",
    title: "What you love",
    description: "Start with what lights you up. Don't filter for usefulness yet.",
    questions: [
      textQuestion("activities", "What activities make you feel most alive?", "Hosting dinners, long bike rides, fixing old radios…"),
      textQuestion("all_day_activity", "If money didn't matter, how would you spend your days?", "Be specific about the what, where, and with whom."),
      textQuestion("learning_interest", "What do you love learning about, even with no reward?", "Behavioral economics, bird migration, typography…"),
      {
        id: "hobbies",
        label: "Which interests make you lose track of time?",
        type: "select-tags",
        placeholder: "Add your own and press Enter",
        options: ["Reading", "Writing", "Music", "Cooking", "Sports", "Travel", "Design", "Gaming", "Gardening", "Photography"],
        validation: { required: "Pick at least one.", maxLength: 3, message: "Choose up to 3." },
      },
    ],
  },
  {
    id: "profession",
    title: "What you're good at",
    description: "Think about what comes easily to you and what others rely on you for.",
    questions: [
      textQuestion("compliments", "What do people often compliment you on?", "Explaining complex ideas simply, staying calm in a crisis…"),
      textQuestion("easy_tasks", "What feels easy to you but hard for others?", "Organizing chaos, spotting patterns in data…"),
      textQuestion("help_requests", "What do people ask you for help or advice with?", "Career decisions, spreadsheets, relationship advice…"),
      textQuestion("quick_learning", "Which skills do you pick up quickly?", "Languages, new software, physical skills…"),
    ],
  },
  {
    id: "mission",
    title: "What the world needs",
    description: "Look outward. Which problems pull at you, near or far?",
    questions: [
      textQuestion("problems_to_solve", "Which problems in the world do you care most about solving?", "Loneliness in older adults, food waste, access to education…"),
      textQuestion("causes_drawn_to", "Which causes or organizations are you drawn to support?", "Local libraries, climate groups, mentoring programs…"),
      textQuestion("skills_help_others", "How could your skills improve other people's lives?", "Teaching, building tools, making things clearer…"),
      textQuestion("change_community", "If you could change one thing in your community or the world, what would it be?", "One change, as concrete as you can make it."),
    ],
  },
  {
    id: "vocation",
    title: "What you can be paid for",
    description: "Finally, where does value meet demand? Include ideas you haven't tried.",
    button: "Find my ikigai",
    questions: [
      textQuestion("marketable_skills", "Which of your skills or knowledge do people pay for?", "Project management, copywriting, clinical expertise…"),
      textQuestion("in_demand_roles", "Which in-demand roles fit your strengths?", "Product manager, nurse educator, data analyst…"),
      textQuestion("business_ideas", "If you started a business, what would you offer?", "A service, product, course, or community."),
      textQuestion("turn_hobbies_income", "How could one of your passions become income?", "Workshops, commissions, consulting, content…"),
    ],
  },
];

export const CARD_STYLES = [
  "Watercolor",
  "Ukiyo-e",
  "Impressionism",
  "Minimalism",
  "Art Nouveau",
  "Traditional Chinese Painting",
  "Cinematic Photography",
  "Paper Cut",
  "Surrealism",
  "Abstract Expressionism",
] as const;
