import React from "react";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

const CreatePollBtn = () => {
  return (
    <Link to="/create-poll" style={{ textDecoration: "none" }}>
      <Button className="create-poll-btn" variant="contained">
        Create Poll
      </Button>
    </Link>
  );
};

export default CreatePollBtn;
