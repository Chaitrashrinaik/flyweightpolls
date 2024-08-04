import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import './PollDetail.css';

const PollDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const pollId = searchParams.get("id");

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/polls/polls/${pollId}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPoll(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [pollId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleVote = () => {
    navigate(`/Vote?id=${pollId}`, { state: { poll } });
  };

  const columns = [
    { field: "id", headerName: "Number", width: 100 },
    { field: "option", headerName: "Option", flex: 1 },
    { field: "votes", headerName: "Votes", width: 100 },
  ];

  const rows = Object.entries(poll.OptionVote).map(
    ([option, votes], index) => ({
      id: index + 1,
      option,
      votes,
    })
  );

  return (
    <div className="poll-detail-container">
      <h2 className="poll-question">{poll.Question}</h2>
      <Button className="vote-button" variant="outlined" color="secondary" onClick={handleVote}>
        VOTE ON THIS POLL
      </Button>
      <div className="poll-data-grid">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25, 100]}
          autoHeight
          disableExtendRowFullWidth
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              lineHeight: 'normal',
              padding: '4px',
            },
            '& .MuiDataGrid-columnHeader': {
              whiteSpace: 'normal',
              lineHeight: 'normal',
              padding: '4px',
            },
          }}
        />
      </div>
      <p className="poll-tags">Tags: {poll.Tags.join(", ")}</p>
    </div>
  );
};

export default PollDetail;
