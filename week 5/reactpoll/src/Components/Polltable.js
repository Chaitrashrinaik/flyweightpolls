import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TagsContext } from "../TagsContext";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
  Box,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Typography
} from "@mui/material";
import { styled } from "@mui/system";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: "1px solid #ddd",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  border: "1px solid #ddd",
}));

// New styled component for the table header
const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  border: "1px solid #ddd",
  backgroundColor: "#f0f0f0", // Light grey color
  color: "#353", // Darker text color for contrast
  fontWeight: "bold",
}));

const PollTable = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const { selectedTags } = useContext(TagsContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchPolls();
  }, [selectedTags]);

  const fetchPolls = async () => {
    try {
      let url = "http://127.0.0.1:8000/polls/";
      if (selectedTags.length > 0) {
        url += `?tags=${selectedTags.join(",")}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPolls(data.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleQuestionClick = (id) => {
    navigate(`/poll-detail?id=${id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableHeaderCell component="th" scope="col">Number</StyledTableHeaderCell>
                <StyledTableHeaderCell component="th" scope="col">Poll Question</StyledTableHeaderCell>
                <StyledTableHeaderCell component="th" scope="col">Total Votes</StyledTableHeaderCell>
                <StyledTableHeaderCell component="th" scope="col">Tags</StyledTableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {polls
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((poll) => (
                  <StyledTableRow key={poll.QuestionID}>
                    <StyledTableCell>{poll.QuestionID}</StyledTableCell>
                    <StyledTableCell>
                      <span
                        onClick={() => handleQuestionClick(poll.QuestionID)}
                        style={{ color: "black", cursor: "pointer" }}
                      >
                        {poll.Question}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell>
                      {Object.values(poll.OptionVote).reduce(
                        (a, b) => a + b,
                        0
                      )}
                    </StyledTableCell>
                    <StyledTableCell>{poll.Tags.join(", ")}</StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={polls.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default PollTable;
