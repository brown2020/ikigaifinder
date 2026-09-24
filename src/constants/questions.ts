import type { QuestionStep, QuestionStepper } from "@/types";

const required = { required: "Please add an answer.", message: "" };

function textQuestion(id: string, label: string, placeholder: string, hints: string[]): QuestionStepper {
  return { id, label, type: "textarea", placeholder, validation: required, hints };
}

/** Section ids and question ids are persisted in Firestore; don't rename them. */
export const STEPPER_QUESTIONS_JSON: QuestionStep[] = [
  {
    id: "passion",
    title: "What you love",
    description: "Start with what lights you up. Don't filter for usefulness yet.",
    questions: [
      textQuestion("activities", "What activities make you feel most alive?", "Hosting dinners, long bike rides, fixing old radios…", [
        "Think of a recent day when time flew. What were you doing?",
        "What would you do on a free Saturday with no obligations?",
        "When do friends say you seem most like yourself?",
      ]),
      textQuestion("all_day_activity", "If money didn't matter, how would you spend your days?", "Be specific about the what, where, and with whom.", [
        "Picture a year off with your bills paid. What fills your weeks?",
        "Who would you spend those days with, and where?",
        "What did you love doing as a kid before anyone graded it?",
      ]),
      textQuestion("learning_interest", "What do you love learning about, even with no reward?", "Behavioral economics, bird migration, typography…", [
        "Which topics do you read, watch, or listen to without being asked?",
        "What rabbit holes have you gone down online lately?",
        "If you could take any course for free, which would it be?",
      ]),
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
      textQuestion("compliments", "What do people often compliment you on?", "Explaining complex ideas simply, staying calm in a crisis…", [
        "Think of the last thank-you note or kind message you received.",
        "What would a close friend say is your superpower?",
        "What do colleagues come to you for, even outside your role?",
      ]),
      textQuestion("easy_tasks", "What feels easy to you but hard for others?", "Organizing chaos, spotting patterns in data…", [
        "What do you do quickly that others put off?",
        "Which tasks leave you thinking “that was fun”?",
        "Where do you notice mistakes others miss?",
      ]),
      textQuestion("help_requests", "What do people ask you for help or advice with?", "Career decisions, spreadsheets, relationship advice…", [
        "Scroll your recent messages: what do people ask you about?",
        "What have you taught someone recently, formally or not?",
        "Which problems do friends bring to you first?",
      ]),
      textQuestion("quick_learning", "Which skills do you pick up quickly?", "Languages, new software, physical skills…", [
        "Which new tool, hobby, or skill clicked faster than you expected?",
        "Where have you gone from beginner to useful in a few months?",
        "What kind of learning feels like play to you?",
      ]),
    ],
  },
  {
    id: "mission",
    title: "What the world needs",
    description: "Look outward. Which problems pull at you, near or far?",
    questions: [
      textQuestion("problems_to_solve", "Which problems in the world do you care most about solving?", "Loneliness in older adults, food waste, access to education…", [
        "What news story makes you want to do something about it?",
        "What frustrates you when you see it done badly?",
        "Which problem have you lived through that others still face?",
      ]),
      textQuestion("causes_drawn_to", "Which causes or organizations are you drawn to support?", "Local libraries, climate groups, mentoring programs…", [
        "Where do you donate, volunteer, or wish you had time to?",
        "Which organizations do you follow or share online?",
        "What would you fight for if nobody paid you?",
      ]),
      textQuestion("skills_help_others", "How could your skills improve other people's lives?", "Teaching, building tools, making things clearer…", [
        "Pick one skill from earlier. Who would benefit most from it?",
        "Think of a time your help clearly changed someone's day.",
        "What do people struggle with that you find straightforward?",
      ]),
      textQuestion("change_community", "If you could change one thing in your community or the world, what would it be?", "One change, as concrete as you can make it.", [
        "Picture your neighborhood or workplace. What's missing?",
        "What would have made life easier for you ten years ago?",
        "If you had a small budget and a year, what would you fix first?",
      ]),
    ],
  },
  {
    id: "vocation",
    title: "What you can be paid for",
    description: "Finally, where does value meet demand? Include ideas you haven't tried.",
    button: "Find my ikigai",
    questions: [
      textQuestion("marketable_skills", "Which of your skills or knowledge do people pay for?", "Project management, copywriting, clinical expertise…", [
        "What have people paid you for, including side gigs?",
        "Which parts of your job would you keep if you could drop the rest?",
        "What do job postings ask for that you already have?",
      ]),
      textQuestion("in_demand_roles", "Which in-demand roles fit your strengths?", "Product manager, nurse educator, data analyst…", [
        "Which job titles make you curious when you see them?",
        "Who has a career you quietly envy?",
        "Which growing fields overlap with what you already know?",
      ]),
      textQuestion("business_ideas", "If you started a business, what would you offer?", "A service, product, course, or community.", [
        "What product or service do you wish existed?",
        "What do people already ask you to do for them for free?",
        "Could you teach, make, or advise on something you love?",
      ]),
      textQuestion("turn_hobbies_income", "How could one of your passions become income?", "Workshops, commissions, consulting, content…", [
        "Could you teach it, make things with it, or write about it?",
        "Who spends money on your hobby, and on what?",
        "What's the smallest paid experiment you could try this month?",
      ]),
    ],
  },
];

/**
 * One question per circle for the quick path. These alone are enough to
 * generate ideas; the rest of the questionnaire sharpens them.
 */
export const QUICK_QUESTION_IDS: Record<string, string> = {
  passion: "activities",
  profession: "easy_tasks",
  mission: "problems_to_solve",
  vocation: "marketable_skills",
};

/** One-tap steers for the next batch of ideas. */
export const REFINE_PRESETS = [
  { label: "More creative", guidance: "Be more imaginative and unconventional, while staying true to my answers." },
  { label: "More practical", guidance: "Make them more practical and realistic to start within a year." },
  { label: "Smaller scale", guidance: "Focus on a smaller scale: a local community, one team, or a handful of people." },
  { label: "Bigger impact", guidance: "Aim for bigger, more ambitious impact at a national or global scale." },
  { label: "Less corporate", guidance: "Avoid corporate jobs and language; favor independent, creative, or community paths." },
  { label: "More hands-on", guidance: "Favor hands-on, in-person work over desk and screen work." },
] as const;

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
