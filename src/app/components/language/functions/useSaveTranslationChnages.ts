import { fileSave } from "browser-fs-access";
import {
  LanguageText,
  LanguageUpdateValues,
} from "@/components/language/types";

type Props = {
  newTranslation: LanguageText;
  updatedValues: LanguageUpdateValues;
  allIdsSet: Set<string>;
};

export default async function saveTranslationChanges({
  newTranslation,
  updatedValues,
  allIdsSet,
}: Props) {
  const fileName = `${newTranslation.lang
    ?.trim()
    ?.toLowerCase()
    ?.replace(" ", "_")}.json`;

  const all = Array.from(allIdsSet).every((key) => newTranslation[key])
    ? "yes"
    : "no";

  const recordNewTranslation = { ...newTranslation };

  const savedChanges: { [key: string]: string } = {};

  for (const key in recordNewTranslation) {
    recordNewTranslation[key] = recordNewTranslation[key].trim();
    if (updatedValues[key]) {
      savedChanges[key] = recordNewTranslation[key];
    }
  }
  recordNewTranslation[
    "0"
  ] = `{ 'lang': '${recordNewTranslation.lang}', 'complete': '${all}' }`;
  delete recordNewTranslation.lang;
  const jsonString = JSON.stringify(recordNewTranslation, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });

  try {
    await fileSave(blob, {
      fileName: fileName ?? "undefined.json",
      extensions: [".json"],
    });
  } catch {}

  return savedChanges;
}
