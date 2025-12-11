import { doc, getDoc, setDoc, Timestamp, collection } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { STEPPER_QUESTIONS_JSON } from "@/constants/questions";
import { IkigaiUpdateError } from "@/lib/errors";
import type { Ikigai, QuestionStep, ImagePromptData } from "@/types";

// ============================================================================
// Default Values
// ============================================================================

/**
 * Default ikigai structure with empty answers
 */
export const defaultIkigai: Ikigai = {
  id: "",
  answers: STEPPER_QUESTIONS_JSON.map((question) => ({
    id: question.id ?? "",
    title: question.title ?? "",
    description: question.description ?? "",
    button: question.button ?? "",
    questions: question.questions.map((q) => ({
      id: q.id ?? "",
      label: q.label ?? "",
      type: q.type ?? "text",
      validation: q.validation ?? { required: false, message: "" },
      placeholder: q.placeholder ?? "",
      answer: q.answer ?? [],
      options: q.options ?? [],
    })),
  })) as QuestionStep[],
  ikigaiOptions: [],
  ikigaiSelected: null,
  ikigaiGuidance: "",
  ikigaiImage: "",
  ikigaiCoverImage: "",
};

// ============================================================================
// Service Functions
// ============================================================================

/**
 * Fetch ikigai data from Firestore
 *
 * @param uid - User ID
 * @returns Ikigai data merged with defaults
 * @throws IkigaiNotFoundError if no data exists
 */
export async function fetchIkigaiData(uid: string): Promise<Ikigai> {
  if (!uid) {
    throw new Error("User ID is required to fetch ikigai data");
  }

  const docRef = doc(db, `ikigaiUsers/${uid}/ikigai/main`);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    // Return default instead of throwing for new users
    return { ...defaultIkigai, id: "main" };
  }

  const data = docSnap.data() as Partial<Ikigai>;

  // Merge with defaults to ensure all fields exist
  return {
    ...defaultIkigai,
    ...data,
    id: docRef.id,
    // Ensure answers are properly merged with defaults
    answers: mergeAnswersWithDefaults(data.answers),
  };
}

/**
 * Merge user answers with default question structure
 */
function mergeAnswersWithDefaults(
  userAnswers?: QuestionStep[]
): QuestionStep[] {
  if (!userAnswers?.length) {
    return defaultIkigai.answers;
  }

  return defaultIkigai.answers.map((defaultStep) => {
    const userStep = userAnswers.find((a) => a.id === defaultStep.id);

    if (!userStep) {
      return defaultStep;
    }

    return {
      ...defaultStep,
      ...userStep,
      questions: defaultStep.questions.map((defaultQ) => {
        const userQ = userStep.questions?.find((q) => q.id === defaultQ.id);
        return userQ ? { ...defaultQ, ...userQ } : defaultQ;
      }),
    };
  });
}

/**
 * Update ikigai data in Firestore
 *
 * @param uid - User ID
 * @param currentData - Current ikigai data
 * @param updateData - Partial data to update
 * @returns Updated ikigai data
 */
export async function updateIkigaiData(
  uid: string,
  currentData: Ikigai,
  updateData: Partial<Ikigai>
): Promise<Ikigai> {
  if (!uid) {
    throw new Error("User ID is required to update ikigai data");
  }

  try {
    // Merge answers if provided
    const updatedAnswers = updateData.answers
      ? mergeAnswers(currentData.answers, updateData.answers)
      : currentData.answers;

    const updatedIkigaiData: Ikigai = {
      ...currentData,
      ...updateData,
      answers: updatedAnswers,
      updatedAt: Timestamp.now(),
    };

    // Remove undefined values before saving
    const cleanData = removeUndefinedValues(updatedIkigaiData);

    const ikigaiRef = doc(db, `ikigaiUsers/${uid}/ikigai/main`);
    await setDoc(ikigaiRef, cleanData, { merge: true });

    return updatedIkigaiData;
  } catch (error) {
    throw new IkigaiUpdateError("Failed to update ikigai data", error);
  }
}

/**
 * Merge new answers with existing answers
 */
function mergeAnswers(
  currentAnswers: QuestionStep[],
  newAnswers: QuestionStep[]
): QuestionStep[] {
  const merged = currentAnswers.map((answer) => {
    const updatedAnswer = newAnswers.find((a) => a.id === answer.id);
    return updatedAnswer ? { ...answer, ...updatedAnswer } : answer;
  });

  // Add any new answers that weren't in the existing set
  newAnswers.forEach((newAnswer) => {
    if (!merged.find((answer) => answer.id === newAnswer.id)) {
      merged.push(newAnswer);
    }
  });

  return merged;
}

/**
 * Remove undefined values from an object (Firestore doesn't accept undefined)
 */
function removeUndefinedValues<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * Save generated image to history collection
 *
 * @param uid - User ID
 * @param promptData - Image generation prompt data
 * @param prompt - The actual prompt used
 * @param downloadUrl - URL of the generated image
 * @returns Updated prompt data with id and timestamp
 */
export async function saveGeneratedImageHistory(
  uid: string,
  promptData: ImagePromptData,
  prompt: string,
  downloadUrl: string
): Promise<ImagePromptData> {
  if (!uid) {
    throw new Error("User ID is required to save image history");
  }

  try {
    const coversCollection = collection(db, "ikigaiProfiles", uid, "covers");
    const docRef = doc(coversCollection);

    const historyData: ImagePromptData = {
      ...promptData,
      downloadUrl,
      prompt,
      id: docRef.id,
      timestamp: Timestamp.now(),
    };

    await setDoc(docRef, historyData);
    return historyData;
  } catch (error) {
    console.error("Failed to save image history:", error);
    throw new Error("Failed to save generated image to history");
  }
}

/**
 * Get all generated images for a user
 *
 * @param uid - User ID
 * @returns Array of image prompt data
 */
export async function getGeneratedImageHistory(
  uid: string
): Promise<ImagePromptData[]> {
  if (!uid) {
    throw new Error("User ID is required to fetch image history");
  }

  // TODO: Implement when needed
  return [];
}
