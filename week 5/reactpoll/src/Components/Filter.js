import React, { useState, useEffect, useContext } from "react";
import { TagsContext } from "../TagsContext";
import Button from "@mui/material/Button";

const Filter = () => {
  const [tags, setTags] = useState([]);
  const { selectedTags, setSelectedTags } = useContext(TagsContext);
  const [localSelectedTags, setLocalSelectedTags] = useState([]);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/polls/tags/");
      const data = await response.json();
      if (data.success) {
        setTags(data.data);
      } else {
        console.error("Error fetching tags:", data.error);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleCheckboxChange = (event) => {
    const tag = event.target.name;
    if (event.target.checked) {
      setLocalSelectedTags((prevTags) => [...prevTags, tag]);
    } else {
      setLocalSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
    }
  };

  const handleFilter = () => {
    setSelectedTags(localSelectedTags);
  };

  // Helper function to capitalize the first letter of each word
  const capitalizeTag = (tag) => {
    return tag
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="filter-options">
      {tags.map((tag) => (
        <div key={tag} className="filter-tag">
          <label>
            <input
              type="checkbox"
              name={tag}
              onChange={handleCheckboxChange}
              checked={localSelectedTags.includes(tag)}
            />
            {capitalizeTag(tag)}
          </label>
        </div>
      ))}
      <Button
        variant="outlined"
        color="primary"
        onClick={handleFilter}
        className="filter-btn"
      >
        Filter by tags
      </Button>
    </div>
  );
};

export default Filter;
