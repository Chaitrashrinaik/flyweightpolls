import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, lightBlue } from "@mui/material/colors";
import "./CreatePollForm.css";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: blue[500],
      },
      secondary: {
        main: lightBlue[500],
      },
    },
    components: {
      MuiButton: {
        variants: [
          {
            props: { variant: "contained", color: "secondary" },
            style: {
              borderColor: lightBlue[500],
              color: lightBlue[500],
            },
          },
        ],
      },
    },
  });

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!question.trim()) {
      newErrors.question = "Question is required";
    }
    options.forEach((option, index) => {
      if (!option.trim()) {
        newErrors[`option_${index}`] = "Option is required";
      }
    });
    if (!tags.trim()) {
      newErrors.tags = "Tags are required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAlert(false);

    if (!validateForm()) {
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);

    const optionsDict = {};
    options
      .filter((option) => option.trim())
      .forEach((option) => {
        optionsDict[option.trim()] = "0";
      });

    const pollData = {
      Question: question,
      OptionVote: optionsDict,
      Tags: tags.split(",").map((tag) => tag.trim()),
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/polls/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pollData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error creating poll: " + (errorData.msg || response.statusText));
        console.error("Error creating poll:", errorData);
      } else {
        await response.json();
        alert("Poll created successfully!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Error creating poll. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="create-poll-container">
        {showAlert && (
          <Alert severity="error" style={{ marginBottom: "16px" }}>
            Please fill out all required fields.
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your poll question here"
              fullWidth
              required
              error={!!errors.question}
              helperText={errors.question}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
          <label className="answer-options-label">Answer Options</label>
            {options.map((option, index) => (
              <FormControl key={index} fullWidth margin="dense">
                <TextField
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  fullWidth
                  required
                  error={!!errors[`option_${index}`]}
                  helperText={errors[`option_${index}`]}
                  InputProps={{
                    style: { textAlign: "left" } // Ensure text aligns left
                  }}
                />
              </FormControl>
            ))}
          </FormControl>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleAddOption}
            className="add-option-btn"
            style={{ marginBottom: "16px" }}
          >
            Add Option
          </Button>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Comma separated tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tag1, Tag2, Tag3"
              fullWidth
              required
              error={!!errors.tags}
              helperText={errors.tags}
              className="tags-input"
            />
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="create-poll-btn"
            disabled={isSubmitting}
            fullWidth
          >
            Create Poll
          </Button>
        </form>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isSubmitting}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </ThemeProvider>
  );
};

export default CreatePoll;
