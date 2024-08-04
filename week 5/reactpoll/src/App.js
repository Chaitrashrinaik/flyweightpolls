import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import Home from "./Components/Home";
import { TagsProvider } from "./TagsContext";
import Heading from "./Heading";
import "./App.css";

// Lazy load components
const PollDetail = lazy(() => import("./Components2/PollDetail"));
const Vote = lazy(() => import("./Components3/Vote"));
const CreatePoll = lazy(() => import("./Components4/CreatePoll"));
// const ResultsPage = lazy(() => import("./ResultsPage"));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Router>
      <TagsProvider>
        <div className="app-container">
          <Heading />
          <div className="content-container">
            <main className="main-content">
              <Suspense fallback={<LinearProgress />}>
                <Routes>
                  <Route path="/poll-detail" element={<PollDetail />} />
                  <Route path="/vote" element={<Vote />} />
                  <Route path="/create-poll" element={<CreatePoll />} />
                  <Route path="/" element={<Home />} />
                  {/* <Route path="/results" element={<ResultsPage />} /> */}
                </Routes>
              </Suspense>
            </main>
          </div>
        </div>
      </TagsProvider>
    </Router>
  );
}

export default App;
