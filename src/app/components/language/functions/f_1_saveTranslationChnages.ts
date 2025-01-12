import { fileSave } from 'browser-fs-access';
import { LanguageText, LanguageUpdateValues } from '@/components/language/types';

/**
 * Saves the updated translation changes to a JSON file using `browser-fs-access`.
 *
 * The function constructs a file name using the `lang` attribute from `newTranslation`, processes
 * the translation data, and checks whether all required translation keys are present. It trims each
 * translation value and records changes made based on `updatedValues`. The resulting translation
 * data is saved in a JSON file with the name formatted from the language name.
 *
 * @param newTranslation - The new translation text to save.
 * @param updatedValues - Values indicating which translations have been updated.
 * @param allIdsSet - A set of all translation keys to verify completeness.
 * @returns Promise with an object containing the saved changes.
 * @throws Will catch and ignore any errors during the file save operation.
 */

export default async function f_1_saveTranslationChanges({
  newTranslation,
  updatedValues,
  allIdsSet,
}: Props): Promise<{ f_1_savedChanges: { [key: string]: string } }> {
  const fileName = `${newTranslation.lang?.trim()?.toLowerCase()?.replace(' ', '_')}.json`;

  const all = Array.from(allIdsSet).every((key) => newTranslation[key]) ? 'yes' : 'no';

  const recordNewTranslation = { ...newTranslation };

  const savedChanges: { [key: string]: string } = {};

  for (const key in recordNewTranslation) {
    recordNewTranslation[key] = recordNewTranslation[key].trim();
    if (updatedValues[key]) {
      savedChanges[key] = recordNewTranslation[key];
    }
  }
  recordNewTranslation['0'] = `{ 'lang': '${recordNewTranslation.lang}', 'complete': '${all}' }`;
  delete recordNewTranslation.lang;
  const jsonString = JSON.stringify(recordNewTranslation, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });

  try {
    await fileSave(blob, {
      fileName: fileName ?? 'undefined.json',
      extensions: ['.json'],
    });
  } catch {
    // ignore error and return an enpty object below indicating that nothing was saved
  }

  return { f_1_savedChanges: savedChanges };
}

type Props = {
  newTranslation: LanguageText;
  updatedValues: LanguageUpdateValues;
  allIdsSet: Set<string>;
};
