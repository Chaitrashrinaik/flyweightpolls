import React, { createContext, useState } from 'react';

export const TagsContext = createContext();

export const TagsProvider = ({ children }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState(['football', 'sports', 'cricket', 'chess', 'carrom']); // Default tags

  console.log('All Tags:', allTags);
  console.log('Selected Tags:', selectedTags);

  return (
    <TagsContext.Provider value={{ selectedTags, setSelectedTags, allTags, setAllTags }}>
      {children}
    </TagsContext.Provider>
  );
};
