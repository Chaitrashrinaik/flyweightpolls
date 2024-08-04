import React, { useState, useEffect } from 'react';
import './Polltable.css';
import { DataGrid } from '@mui/x-data-grid';

const Polltable = () => {
  const [pollData, setPollData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPollData();
  }, []);

  const fetchPollData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/poll-details'); // Adjust the URL to match your backend endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch poll data');
      }
      const data = await response.json();
      setPollData(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleVote = () => {
    // Redirect to the VotePage or handle voting logic
    window.location.href = '/poll-detail?id=1'; // Adjust the URL and logic as needed
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Define columns for the DataGrid
  const columns = [
    { field: 'id', headerName: 'Number', width: 100 },
    { field: 'option', headerName: 'Options', width: 300 },
    { field: 'votes', headerName: 'Votes', width: 150 },
  ];

  // Format pollData for the DataGrid
  const rows = pollData.map((poll) => ({
    id: poll.id,
    option: poll.option,
    votes: poll.votes,
  }));

  return (
    <div className="poll-table" style={{ height: 500, width: '90%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} />
      <button onClick={handleVote} style={{ marginTop: '20px' }}>Vote on this poll</button>
      <p>{pollData[0]?.tags.join(', ')}</p>
    </div>
  );
};

export default Polltable;
