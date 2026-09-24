import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { STEPPER_QUESTIONS_JSON } from "@/constants/questions";
import { IkigaiUpdateError } from "@/lib/errors";
import type { Ikigai, QuestionStep, ImagePromptData } from "@/types";

const ikigaiDocPath = (uid: string) => `ikigaiUsers/${uid}/ikigai/main`;

export const defaultIkigai: Ikigai = {
  id: "",
  answers: STEPPER_QUESTIONS_JSON.map((step) => ({
    ...step,
    questions: step.questions.map((q) => ({ ...q, answer: [] })),
  })),
  ikigaiOptions: [],
  ikigaiSelected: null,
  ikigaiShortlist: [],
  ikigaiGuidance: "",
  ikigaiImage: "",
  ikigaiCoverImage: "",
  ikigaiReport: null,
};

/**
 * The question structure (titles, labels, validation) always comes from code;
 * only answers are taken from storage, so copy edits apply to existing users.
 */
export function withStoredAnswers(stored?: QuestionStep[]): QuestionStep[] {
  const answerById = new Map<string, string[]>();
  stored?.forEach((step) =>
    step.questions?.forEach((q) => {
      if (Array.isArray(q.answer)) answerById.set(String(q.id), q.answer);
    })
  );
  return defaultIkigai.answers.map((step) => ({
    ...step,
    questions: step.questions.map((q) => ({
      ...q,
      answer: answerById.get(String(q.id)) ?? [],
    })),
  }));
}

export async function fetchIkigaiData(uid: string): Promise<Ikigai> {
  if (!uid) throw new Error("User ID is required to fetch ikigai data");

  const snap = await getDoc(doc(db, ikigaiDocPath(uid)));
  if (!snap.exists()) return { ...defaultIkigai, id: "main" };

  const data = snap.data() as Partial<Ikigai>;
  return {
    ...defaultIkigai,
    ...data,
    id: snap.id,
    ikigaiOptions: data.ikigaiOptions ?? [],
    ikigaiShortlist: data.ikigaiShortlist ?? [],
    answers: withStoredAnswers(data.answers),
  };
}

export async function updateIkigaiData(
  uid: string,
  currentData: Ikigai,
  updateData: Partial<Ikigai>
): Promise<Ikigai> {
  if (!uid) throw new Error("User ID is required to update ikigai data");

  const updated: Ikigai = {
    ...currentData,
    ...updateData,
    answers: updateData.answers ? withStoredAnswers(updateData.answers) : currentData.answers,
    updatedAt: Timestamp.now(),
  };

  // Sharing is owned by the server (/api/ikigai/sharing); never write back a stale copy.
  const { ikigaiSharableUrl: _sharable, ...toWrite } = updated;
  void _sharable;

  try {
    await setDoc(doc(db, ikigaiDocPath(uid)), structuredClone(toWrite), { merge: true });
    return updated;
  } catch (error) {
    throw new IkigaiUpdateError("Failed to update ikigai data", error);
  }
}

export async function saveGeneratedImageHistory(
  uid: string,
  promptData: ImagePromptData,
  prompt: string,
  downloadUrl: string
): Promise<ImagePromptData> {
  if (!uid) throw new Error("User ID is required to save image history");

  const docRef = doc(collection(db, "ikigaiProfiles", uid, "covers"));
  const historyData: ImagePromptData = {
    ...promptData,
    downloadUrl,
    prompt,
    id: docRef.id,
    timestamp: Timestamp.now(),
  };
  await setDoc(docRef, historyData);
  return historyData;
}

/** Live list of the user's most recent generated cover images, newest first. */
export function subscribeToCoverHistory(
  uid: string,
  onChange: (urls: string[]) => void,
  max = 12
): () => void {
  const q = query(
    collection(db, "ikigaiProfiles", uid, "covers"),
    orderBy("timestamp", "desc"),
    limit(max)
  );
  return onSnapshot(
    q,
    (snapshot) =>
      onChange(
        snapshot.docs
          .map((d) => d.data().downloadUrl as string | undefined)
          .filter((url): url is string => Boolean(url))
      ),
    () => onChange([])
  );
}
