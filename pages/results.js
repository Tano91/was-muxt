import React from "react";
import {
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  TableFooter,
  TablePagination,
  Button,
} from "@mui/material";
import Fade from "@mui/material/Fade";
import Head from "next/head";
import PropTypes from "prop-types";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import Avatar from "@mui/material/Avatar";
import { blue } from "@mui/material/colors";
import ToggleRushBtn from "../comps/ToggleRushBtn";
import ToggleIssueBtn from "../comps/ToggleIssueBtn";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DOMPurify from "dompurify";

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function Results() {
  // Getting Filtered Results Logic:
  const router = useRouter();
  const { matchString, filteredOrders, users, statuses } = router.query;

  let parsedUsers = [];
  let parsedStatuses = [];
  let parsedFilteredOrders = [];

  if (users) {
    parsedUsers = JSON.parse(decodeURIComponent(users));
  }

  if (statuses) {
    parsedStatuses = JSON.parse(decodeURIComponent(statuses));
  }

  if (filteredOrders) {
    parsedFilteredOrders = JSON.parse(decodeURIComponent(filteredOrders));
  }

  // Logic for Preparing Render:

  const rows = parsedFilteredOrders.sort((a, b) => (a.id < b.id ? -1 : 1));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Find statuses and generate colors from database
  const [statusesObj, setStatusesObj] = useState(parsedStatuses);

  useEffect(() => {}, [statusesObj]);

  const updateStatusesObj = (updatedStatuses) => {
    setStatusesObj(updatedStatuses);
  };

  const findStatus = (currStatus) => {
    const statusObj = statusesObj.find((obj) => obj.name === currStatus);
    return statusObj;
  };

  // Find User Images based on assignment from database
  const userImageSearch = (row) => {
    let user = parsedUsers.find((x) => x.name === row.assignedTo);
    return user ? user.image : null;
  };

  return (
    <Container>
      {/* Header section */}
      <Head>
        <link rel="logo icon" href="/was_logo_red.png" />
        <title>Search Results: {matchString} - W.A.S.</title>
        <meta name="home" content="home" />
      </Head>

      {/* Title Info */}

      <Fade in timeout={500}>
        <Container>
          <Container
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                my: 2,
                color: "black",
                fontFamily: "Public Sans",
                fontWeight: 800,
              }}
            >
              "{matchString}" - Search Results
            </Typography>
          </Container>
          {/* Table Results Section */}
          <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
            <Table
              sx={{
                border: 7,
                borderColor: "white",
                minWidth: 500,
                "table, caption, tbody, tfoot, thead, tr, th, td": {
                  border: 0,
                },
              }}
              aria-label="custom pagination table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">Assigned</TableCell>
                  <TableCell align="center">Bride & Groom</TableCell>
                  <TableCell align="center">Location</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Due</TableCell>
                  <TableCell align="center">Rush | Issues</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rows
                ).map((row) => {
                  const sanitizedId = DOMPurify.sanitize(row.id);

                  return (
                    <TableRow
                      sx={{
                        cursor: "pointer",

                        ":hover": {
                          borderLeft: 7,
                          borderColor: "primary.main",
                        },
                      }}
                      key={sanitizedId}
                      onClick={() => {
                        router.push("/orders/" + sanitizedId);
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          src={userImageSearch(row)}
                          sx={{
                            mb: { xs: 1, md: 0 },
                            mr: { xs: 0, md: 2 },
                            bgcolor: blue[700],
                          }}
                        />

                        <Typography variant="none">{row.assignedTo}</Typography>
                      </TableCell>

                      <TableCell component="th" scope="row" align="center">
                        <Typography variant="none">
                          {row.guest.groomFirstName} &{" "}
                          {row.guest.brideFirstName}
                        </Typography>
                      </TableCell>

                      <TableCell component="th" scope="row" align="center">
                        <Typography variant="none">
                          {row.location.region}
                        </Typography>
                      </TableCell>

                      <TableCell component="th" scope="row" align="center">
                        <Button
                          color={findStatus(row.status).color}
                          disabled={findStatus(row.status).disabled}
                          size="small"
                          disableRipple
                          //  <Button
                          sx={{
                            ":hover": { bgcolor: "white" },
                            border: 1,
                            fontSize: 11,
                          }}
                        >
                          {row.status}
                        </Button>
                      </TableCell>

                      <TableCell component="th" scope="row" align="center">
                        <Typography variant="none">
                          {row.package.due}
                        </Typography>
                      </TableCell>

                      <TableCell component="th" scope="row" align="center">
                        <ToggleRushBtn rushVal={row.rush} />
                        <ToggleIssueBtn issueVal={row.issues} />
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              <TableFooter
                sx={{
                  "table, caption, tbody, tfoot, thead, tr, th, td": {
                    border: 0,
                  },
                }}
              >
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={3}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Container>
      </Fade>
    </Container>
  );
}
