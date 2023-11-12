import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';


type ContentWarningData = {
  id: string;
  name: string;
  children?: ContentWarningData[];
}

type ContentWarningSelection = {
  [key:string]?: boolean
}

export const useContentWarnings = (initialData?:ContentWarningSelection) => {
  // We always render the same selection of content warning options to toggle.
  const [contentWarnings, setContentWarnings] = useState<ContentWarningData>({});
  // What the user has selected determines how a given content warning looks.
  const [userSelection, setUserSelection] = useState<ContentWarningSelection>(initialData || {});
  const [contentWarningsError, setContentWarningsError] = useState<boolean>(false);

  useEffect(() => {
    axios.get('/api/content')
    .then((response) => {
      setContentWarnings(response.data)
    })
    .catch((error) => {
      if (error instanceof Error) {
        setContentWarningsError(true)
      }
    });
  },
  []);

  // Components using this hook will use a useEffect with userSelection in the dependency array
  const onContentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const content = {...userSelection};
    const contentMarker = e.target.name;
    if(e.target.value === "none") {
      delete content[contentMarker];
    }
    else value = e.target.value;
    const newContent = {...content, [contentMarker]: value};
    setUserSelection({ ...formValues, content: newContent });
  }, [userSelection])

  return {userSelection, contentWarnings, onContentChange, contentWarningsError}
}