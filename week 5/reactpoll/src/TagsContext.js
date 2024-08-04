import React, { createContext, useState } from 'react';

export const TagsContext = createContext();

export const TagsProvider = ({ children }) => {
  const [selectedTags, setSelectedTags] = useState([]); // Ensure default value is an array

  return (
    <TagsContext.Provider value={{ selectedTags, setSelectedTags }}>
      {children}
    </TagsContext.Provider>
  );
};