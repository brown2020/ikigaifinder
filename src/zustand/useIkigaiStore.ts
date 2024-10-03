import { create } from "zustand";
import { db } from "@/firebase/firebaseClient";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { useAuthStore } from "./useAuthStore";
import { STEPPER_QUESTIONS_JSON } from "@/constants/questions";
import { ikigaiDataT, questionStepT } from "@/types/interface";

export type ikigaiType = {
  id: string;
  answers: questionStepT[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  ikigaiOptions: ikigaiDataT[];
  ikigaiSelected: ikigaiDataT | null;
  ikigaiGuidance: string;
  ikigaiImage: string;
  ikigaiCoverImage: string;
};

export const defaultIkigai: ikigaiType = {
  id: "",
  answers: STEPPER_QUESTIONS_JSON.map((question) => ({
    id: question.id || "",
    title: question.title || "",
    description: question.description || "",
    button: question.button || "",
    questions: question.questions.map((question) => ({
      id: question.id || "",
      label: question.label || "",
      type: question.type || "",
      validation: question.validation || {},
      placeholder: question.placeholder || "",
      answer: question.answer || [],
      options: question.options || [],
    })),
  })),
  ikigaiOptions: [],
  ikigaiSelected: null,
  ikigaiGuidance: "",
  ikigaiImage: "",
  ikigaiCoverImage: ""
};

interface IkigaiStoreState {
  ikigaiData: ikigaiType;
  ikigaiLoading: boolean;
  ikigaiError: Error | null;
  fetchIkigai: () => Promise<void>;
  updateIkigai: (updateData: Partial<ikigaiType>) => Promise<void>;
}

export const useIkigaiStore = create<IkigaiStoreState>((set) => ({
  ikigaiData: defaultIkigai,
  ikigaiLoading: false,
  ikigaiError: null,

  fetchIkigai: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    set({ ikigaiLoading: true });
    try {
      const docRef = doc(db, `ikigaiUsers/${uid}/ikigai/main`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as ikigaiType;
        set({
          ikigaiData: {
            ...defaultIkigai,
            ...data,
            id: docRef.id,
          },
          ikigaiLoading: false,
        });
      } else {
        throw new Error("Ikigai not found");
      }
    } catch (error) {
      set({ ikigaiError: error as Error, ikigaiLoading: false });
    }
  },

  updateIkigai: async (updateData: Partial<ikigaiType>) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;
    set({ ikigaiLoading: true });

    try {
      const currentIkigaiData: ikigaiType =
        useIkigaiStore.getState().ikigaiData;

      // Merge the new answers with the existing ones
      const updatedAnswers = currentIkigaiData.answers.map((answer) => {
        const updatedAnswer = updateData.answers?.find(
          (a) => a.id === answer.id
        );
        return updatedAnswer ? { ...answer, ...updatedAnswer } : answer;
      });

      // Add any new answers that were not in the existing answers
      updateData.answers?.forEach((newAnswer) => {
        if (!updatedAnswers.find((answer) => answer.id === newAnswer.id)) {
          updatedAnswers.push(newAnswer);
        }
      });

      const updatedIkigaiData: ikigaiType = {
        ...currentIkigaiData,
        ...updateData,
        answers: updatedAnswers,
        updatedAt: Timestamp.now(),
      };

      const ikigaiRef = doc(db, `ikigaiUsers/${uid}/ikigai/main`);
      await setDoc(ikigaiRef, updatedIkigaiData, { merge: true });

      set({
        ikigaiData: updatedIkigaiData,
        ikigaiLoading: false,
      });
    } catch (error) {
      set({ ikigaiError: error as Error, ikigaiLoading: false });
    }
  },
}));
