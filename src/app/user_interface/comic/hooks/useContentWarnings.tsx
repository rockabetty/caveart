/* On top of being used to define a comic profile, users are going to be
able to set content warning preferences to filter out what they don't 
want to read and content warnings and ratings will be used as search 
filters as well, so, a hook seems reasonable. */

import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export type ContentWarning = {
  id: string;
  name: string;
  children: ContentWarning[];
};

export type ContentWarningUserSelection = {
  [contentWarningName: string]: string | number;
};

export type RatingName = {
  [contentLabel: string]: "Everyone" | "Ages 10+" | "Teen (13+)" | "Mature (17+)" | "Adults Only (18+)";
}

type RatingLevelRules = {
  [key: RatingName]: string[]
}

const ratingLevels: RatingLevelRules = {
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
    "somePartialNudity",
  ]),
  "Mature (17+)": new Set([
    "frequentRealisticInjuries",
    "frequentBlood",
    "someGore",
    "frequentPartialNudity",
    "someFullNudity",
    "someSexScenes",
    "frequentThreats",
    "frequentSwearing",
    "frequentSlurs",
    "frequentRealisticInjuries",
    "frequentSexualLanguage",
    "frequentReferencesToSubstances",
    "frequentAlcoholUse",
    "someHardDrugUse",
  ]),
  "Adults Only (18+)": new Set([
    "frequentGore",
    "frequentFullNudity",
    "frequentSexScenes",
    "someSexualViolence",
    "frequentSexualViolence",
    "frequentHardDrugUse"
  ])
};

const determineComicRating = function(content): RatingName {
  if (!content.isDisjointFrom(ratingLevels["Adults Only (18+)"])) {
    return "Adults Only (18+)";
  }
  if (!content.isDisjointFrom(ratingLevels["Mature (17+)"])) {
    return "Mature (17+)";
  }
  if (!content.isDisjointFrom(ratingLevels["Teen (13+)"])) {
    return "Teen (13+)";
  }
  if (!content.isDisjointFrom(ratingLevels["Ages 10+"])) {
    return "Ages 10+";
  }
  return 'All Ages';
}

export const useContentWarnings = (initialSelection = {}) => {
  console.log(initialSelection)
  const [contentWarningsForDisplay, setContentWarningsForDisplay] = useState<ContentWarning[]>([]);
  const [contentWarningOptionList, setContentWarningOptionList] = useState<{[key:number]: string}>();
  const [contentWarningKeysForRating, setContentWarningKeysForRating] = useState<Set<string>>(new Set());
  const [comicRating, setComicRating] = useState<RatingName>('All Ages');
  const [ratings, setRatings] = useState<{[key:RatingName] : number}>({});
  const [contentWarningUserSelection, setContentWarningUserSelection] = useState<ContentWarningUserSelection>(initialSelection);
  
  useEffect(() => {
    axios.get('/api/content').then(response => {
      setContentWarningsForDisplay(response.data);
    });

    axios.get('/api/content/flat').then(response => {
      setContentWarningOptionList(response.data);
    });

    axios.get('/api/ratings?key=name').then(response => {
      setRatings(response.data);
    });
  }, []);

  const onContentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (contentWarningOptionList) {
      let content = { ...contentWarningUserSelection };
      let contentWarningKeysUpdate = new Set(contentWarningKeysForRating);
      let value: number | undefined = undefined;
      let contentWarningName = "";
      const contentWarningCategory = e.target.name;
      if (e.target.value === "none") {
        delete content[contentWarningCategory];
        const contentLabel = contentWarningCategory.charAt(0).toUpperCase() + contentWarningCategory.slice(1);
        contentWarningKeysUpdate.delete(`some${contentLabel}`);
        contentWarningKeysUpdate.delete(`frequent${contentLabel}`);
      } else {
        value = parseInt(e.target.value);
        contentWarningName = contentWarningOptionList[value];
        contentWarningKeysUpdate.add(contentWarningName);
        content = { ...content, [contentWarningCategory]: value };
      }

      setContentWarningKeysForRating(contentWarningKeysUpdate);
      setContentWarningUserSelection(content);
      setComicRating(determineComicRating(contentWarningKeysUpdate));
    }
  }, [
      contentWarningUserSelection,
      contentWarningOptionList,
      contentWarningKeysForRating
  ]);

  return {
    contentWarningsForDisplay,
    contentWarningUserSelection,
    onContentChange,
    comicRating
  };
};
