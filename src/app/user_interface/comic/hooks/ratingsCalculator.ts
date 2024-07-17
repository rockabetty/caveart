import { ContentWarningUserSelection, } from "../types";

const ratingLevels = {
  "Ages 10+": new Set([
    "someViolence",
    "someSuggestiveContent"
  ]),
  "Teen (13+)": new Set([
    "frequentSuggestiveContent",
    "someBlood",
    "someRealisticInjuries",
    "frequentViolence",
    "someThreats",
    "someSwearing",
    "someSlurs",
    "someSexualLanguage",
    "someReferencesToSubstances",
    "someAlcoholUse",
    "someCommonDrugUse",
    "someAbusiveLanguage",
    "someDeathAndSuicide",
    "someNudity"
  ]),
  "Mature (17+)": new Set([
    "frequentBlood",
    "frequentDeathAndSuicide",
    "frequentAbusiveLanguage",
    "someGore",
    "someFullNudity",
    "someSexScenes",
    "frequentThreats",
    "frequentSwearing",
    "frequentSlurs",
    "frequentSexualLanguage",
    "frequentReferencesToSubstances",
    "frequentAlcoholUse",
    "someHardDrugUse",
  ]),
  "Adults Only (18+)": new Set([
    "frequentGore",
    "frequentNudity",
    "frequentSexScenes",
    "someSexualViolence",
    "frequentSexualViolence",
    "frequentHardDrugUse"
  ])
};

// isDisjointFrom is brand new so here's one that typescript won't sneer at
const isDisjointFrom = (setA: Set<string>, setB: Set<string>): boolean => {
   // @ts-ignore: 2802
  for (let elem of setA) {
    if (setB.has(elem)) {
      return false;
    }
  }
  return true;
};

export const determineComicRating = function(selection: Readonly<ContentWarningUserSelection>) {

  const warningsChosen: string[] = [];
  Object.keys(selection).forEach((warning) => {
    warningsChosen.push(selection[warning]['name']);
  })

  const content = new Set(warningsChosen);

  if (!isDisjointFrom(content, ratingLevels["Adults Only (18+)"])) {
    return "Adults Only (18+)";
  }
  if (!isDisjointFrom(content, ratingLevels["Mature (17+)"])) {
    return "Mature (17+)";
  }
  if (!isDisjointFrom(content, ratingLevels["Teen (13+)"])) {
    return "Teen (13+)";
  }
  if (!isDisjointFrom(content, ratingLevels["Ages 10+"])) {
    return "Ages 10+";
  }
  return 'All Ages';
}

