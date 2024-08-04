import React from "react";
import Filter from "./Filter";
import CreatePollBtn from "./CreatePollBtn";
import "./Sidebar.css";
const Sidebar = () => {
  return (
    <div className="sidebar">
      <CreatePollBtn />
      <Filter />
    </div>
  );
};

export default Sidebar;
