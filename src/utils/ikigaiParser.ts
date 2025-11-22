import { ikigaiDataT } from "@/types/interface";

export const extractIkigaiData = (text: string): ikigaiDataT[] => {
  const ikigaiArray: ikigaiDataT[] = [];
  // Regex to match the structured output from the AI prompt
  const regex =
    /(\d+)\.\s*(.*?)\n\s*-\s*Passion & Profession:\s*(\d+(?:\.\d+)?)%\s*-\s*Profession & Vocation:\s*(\d+(?:\.\d+)?)%\s*-\s*Vocation & Mission:\s*(\d+(?:\.\d+)?)%\s*-\s*Passion & Mission:\s*(\d+(?:\.\d+)?)%\s*-\s*Overall Compatibility:\s*(\d+(?:\.\d+)?)%/g;

  let match;
  while ((match = regex.exec(text)) !== null) {
    ikigaiArray.push({
      ikigai: match[2].trim(),
      Passion: parseFloat(match[3]),
      Profession: parseFloat(match[4]),
      Vocation: parseFloat(match[5]),
      Mission: parseFloat(match[6]),
      OverallCompatibility: parseFloat(match[7]),
    });
  }

  return ikigaiArray;
};

export const mergeIkigaiLists = (
  currentList: ikigaiDataT[],
  newList: ikigaiDataT[]
): ikigaiDataT[] => {
  return [...currentList, ...newList].filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.ikigai === item.ikigai)
  );
};


