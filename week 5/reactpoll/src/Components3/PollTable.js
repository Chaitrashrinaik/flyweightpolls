import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import './PollTable.css';

const fetchData = async () => {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
};

const PollTable = () => {
  const [searchParams] = useSearchParams();
  const pollId = searchParams.get("id");
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState({ Question: [] });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/polls/polls/${pollId}/`)
      .then((response) => response.json())
      .then((data) => {
        setPoll(data.data || {});
      })
      .catch((error) => {
        console.error("Error fetching poll data:", error);
      });
  }, [pollId]);

  useEffect(() => {
    fetchData().then(fetchedData => {
      setData(fetchedData);
    }).catch(error => {
      console.error("Error fetching data:", error);
    });
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const getCSRFToken = () => {
    let csrfToken = null;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrftoken') {
        csrfToken = value;
        break;
      }
    }
    return csrfToken;
  };

  const handleVote = () => {
    if (selectedOption) {
      const requestBody = { incrementOption: selectedOption };
      const token = localStorage.getItem('authToken');
      const csrfToken = getCSRFToken();

      fetch(`http://127.0.0.1:8000/polls/${pollId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-CSRFToken": csrfToken
        },
        body: JSON.stringify({ incrementOption: selectedOption }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 403) {
              throw new Error("Permission denied. You may not have the right to vote.");
            }
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            navigate(`/poll-detail?id=${pollId}`);
          } else {
            console.error("Server response error:", data.msg);
            alert(data.msg || "An error occurred while submitting your vote.");
          }
        })
        .catch((error) => {
          console.error("Error submitting vote:", error);
          alert(error.message || "Error submitting vote. Please try again.");
        });
    } else {
      alert("Please select an option to vote.");
    }
  };

  if (!poll) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2 className="poll-question">{poll.Question || "No question available"}</h2>
      <form className="poll-form">
        <div className="options-and-button">
          {poll.OptionVote && Object.keys(poll.OptionVote).map((option) => (
            <div key={option} className="option-container">
              <input
                type="radio"
                id={option}
                name="pollOption"
                value={option}
                onChange={handleOptionChange}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
          <button type="button" className="vote-button" onClick={handleVote}>Vote</button>
        </div>
      </form>
    </>
  );
};

export default PollTable;
