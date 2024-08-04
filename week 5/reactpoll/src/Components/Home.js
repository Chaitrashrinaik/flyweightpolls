import React from "react";
import Sidebar from "./Sidebar";
import MainContent from "./Maincontent";
import { Box } from "@mui/material";
import "./Home.css";

function Home() {
  return (
    <Box className="app-container">
      <Box className="content-wrapper">
        <Sidebar />
        <Box className="main-content">
          <MainContent />
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
