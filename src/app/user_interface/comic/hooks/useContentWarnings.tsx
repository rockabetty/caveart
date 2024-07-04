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

type RatingResults = {
  [contentLabel: string]: "Ages 10+" | "Teen (13+)" | "Mature (17+)" | "Adults Only (18+)";
}

const ratingResults: RatingResults = {
  "someViolence": "Ages 10+",
  "someSuggestiveContent": "Ages 10+",
  "frequentViolence": "Teen (13+)",
  "someRealisticInjuries": "Teen (13+)",
  "frequentSuggestiveContent": "Teen (13+)",
  "someBlood": "Teen (13+)",
  "someThreats": "Teen (13+)",
  "someSwearing": "Teen (13+)",
  "someSlurs": "Teen (13+)",
  "someSexualLanguage": "Teen (13+)",
  "someReferencesToSubstances": "Teen (13+)",
  "someAlcoholUse": "Teen (13+)",
  "someCommonDrugUse": "Teen (13+)",
  "frequentRealisticInjuries": "Mature (17+)",
  "frequentBlood": "Mature (17+)",
  "someGore": "Mature (17+)",
  "somePartialNudity": "Teen (13+)",
  "frequentPartialNudity": "Mature (17+)",
  "someFullNudity": "Mature (17+)",
  "someSexScenes": "Mature (17+)",
  "frequentThreats": "Mature (17+)",
  "frequentSwearing": "Mature (17+)",
  "frequentSlurs": "Mature (17+)",
  "frequentSexualLanguage": "Mature (17+)",
  "frequentReferencesToSubstances": "Mature (17+)",
  "frequentAlcoholUse": "Mature (17+)",
  "someHardDrugUse": "Mature (17+)",
  "frequentGore": "Adults Only (18+)",
  "frequentFullNudity": "Adults Only (18+)",
  "frequentSexScenes": "Adults Only (18+)",
  "someSexualViolence": "Adults Only (18+)",
  "frequentSexualViolence": "Adults Only (18+)",
  "frequentHardDrugUse": "Adults Only (18+)"
};

export const useContentWarnings = (initialSelection = {}) => {
  const [contentWarningsForDisplay, setContentWarningsForDisplay] = useState<ContentWarning[]>([]);
  const [contentWarningOptionList, setContentWarningOptionList] = useState<{[key:number]: string}>();
  const [contentWarningKeys, setContentWarningKeys] = useState<Set<string>>(new Set());
  const [ratingString, setRatingString] = useState<string>("All Ages");
  const [ratingId, setRatingId] = useState<number>(1);
  const [ratings, setRatings] = useState<{[key:string] : number}>({});
  const [contentWarningUserSelection, setContentWarningUserSelection] = useState<ContentWarningUserSelection>(initialSelection);

  useEffect(() => {
    axios.get('/api/content').then(response => {
      setContentWarningsForDisplay(response.data);
    });

    axios.get('/api/content/flat').then(response => {
      setContentWarningOptionList(response.data);
    });

    axios.get('/api/ratings').then(response => {
      setRatings(response.data);
    });
  }, []);

  const onContentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (contentWarningOptionList) {
      let content = { ...contentWarningUserSelection };
      let contentWarningKeysUpdate = new Set(contentWarningKeys);
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

      setContentWarningKeys(contentWarningKeysUpdate);
      const audienceRatings = new Set();

      Array.from(contentWarningKeysUpdate).forEach(key => {
        const rating: string = ratingResults[key];
        audienceRatings.add(rating);
      });

      let ratingUpdate = 'All Ages';
      if (audienceRatings.has('Adults Only (18+)')) {
        ratingUpdate = "Adults Only (18+)";
      } else if (audienceRatings.has('Mature (17+)')) {
        ratingUpdate = "Mature (17+)";
      } else if (audienceRatings.has('Teen (13+)')) {
        ratingUpdate = "Teen (13+)";
      } else if (audienceRatings.has('Ages 10+')) {
        ratingUpdate = "Ages 10+";
      }

      setRatingString(ratingUpdate);
      setRatingId(ratings[ratingUpdate]);
      setContentWarningUserSelection(content);

    }
  }, [contentWarningUserSelection, contentWarningOptionList, contentWarningKeys, ratings]);

  return {
    contentWarningsForDisplay,
    ratingString,
    ratingId,
    contentWarningUserSelection,
    onContentChange
  };
};
