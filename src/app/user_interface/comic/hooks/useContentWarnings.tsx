import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

type ContentWarning = {
  id: string;
  name: string;
  children: ContentWarning[];
};

type contentWarningsForDisplayelection = {
  [ContentWarningName: string]: string | undefined;
};

const ratingResults = {
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

export const useContentWarnings = () => {
  const [contentWarningsForDisplay, setContentWarningsForDisplay] = useState<ContentWarning[]>([]);
  const [contentWarningOptionList, setContentWarningOptionList] = useState<{[key:number]: string}>();
  const [contentWarningKeys, setContentWarningKeys] = useState<Set<string>>(new Set());
  const [ratingString, setRatingString] = useState<string>("All Ages");
  const [ratings, setRatings] = useState<{[key:string] : number}>({});
  const [contentWarningUserSelection, setContentWarningUserSelection] = useState<contentWarningsForDisplayelection>({});

  useEffect(() => {
    axios.get('/api/content').then(response => {
      setContentWarningsForDisplay(response.data);
    });

    axios.get('/api/content?format=flat').then(response => {
      setContentWarningOptionList(response.data);
    });

    axios.get('/api/ratings').then(response => {
      const allAges = response.data['All Ages'];
      setRatings(response.data);
    });
  }, []);

  const onContentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let content = { ...contentWarningUserSelection };
    let contentWarningKeysUpdate = new Set(contentWarningKeys);
    let value = undefined;
    let contentWarningName = "";
    const contentWarningCategory = e.target.name;

    if (e.target.value === "none") {
      delete content[contentWarningCategory];
      const contentLabel = contentWarningCategory.charAt(0).toUpperCase() + contentWarningCategory.slice(1);
      contentWarningKeysUpdate.delete(`some${contentLabel}`);
      contentWarningKeysUpdate.delete(`frequent${contentLabel}`);
    } else {
      value = e.target.value;
      contentWarningName = contentWarningOptionList[value];
      contentWarningKeysUpdate.add(contentWarningName);
      content = { ...content, [contentWarningCategory]: value };
    }

    setContentWarningKeys(contentWarningKeysUpdate);
    const audienceRatings = new Set();
    for (let key of contentWarningKeysUpdate) {
      const rating = ratingResults[key];
      audienceRatings.add(rating);
    }

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
    setContentWarningUserSelection(content);
    console.log(contentWarningUserSelection)
  }, [contentWarningUserSelection, contentWarningOptionList, contentWarningKeys, ratings]);

  return {
    contentWarningsForDisplay,
    ratingString,
    contentWarningUserSelection,
    onContentChange
  };
};
