import { doc, getDoc, setDoc, Timestamp, collection } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { ikigaiDataT, questionStepT, ikigaiType } from "@/types/interface";
import { STEPPER_QUESTIONS_JSON } from "@/constants/questions";
import { PromptDataType } from "@/components/GenerateIkigaiImage";

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

export const fetchIkigaiData = async (uid: string): Promise<ikigaiType> => {
  const docRef = doc(db, `ikigaiUsers/${uid}/ikigai/main`);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data() as ikigaiType;
    return {
      ...defaultIkigai,
      ...data,
      id: docRef.id,
    };
  }
  
  throw new Error("Ikigai not found");
};

export const updateIkigaiData = async (
  uid: string, 
  currentData: ikigaiType, 
  updateData: Partial<ikigaiType>
): Promise<ikigaiType> => {
  // Merge the new answers with the existing ones
  const updatedAnswers = currentData.answers.map((answer) => {
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
    ...currentData,
    ...updateData,
    answers: updatedAnswers,
    updatedAt: Timestamp.now(),
  };

  const ikigaiRef = doc(db, `ikigaiUsers/${uid}/ikigai/main`);
  await setDoc(ikigaiRef, updatedIkigaiData, { merge: true });
  
  return updatedIkigaiData;
};

export const saveGeneratedImageHistory = async (
  uid: string,
  promptData: PromptDataType,
  prompt: string,
  downloadUrl: string
): Promise<PromptDataType> => {
  const coll = collection(db, "ikigaiProfiles", uid, "covers");
  const docRef = doc(coll);
  
  const historyData: PromptDataType = {
    ...promptData,
    downloadUrl: downloadUrl,
    prompt: prompt,
    id: docRef.id,
    timestamp: Timestamp.now(),
  };

  await setDoc(docRef, historyData);
  return historyData;
};
