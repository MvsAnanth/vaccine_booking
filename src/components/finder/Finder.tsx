import {
  Chip,
  CircularProgress,
  createStyles,
  Link,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Theme,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { getSlots, getSlotsWithPincode } from "../../store";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // width: "100%",
    // maxWidth: "800",
  },
  table: {
    '& thead th': {
      fontWeight: '600',
      color: "white",
      backgroundColor: theme.palette.primary.light
    },
    '& tbody td': {
      fontWeight: '300',
    },
    '& tbody tr:hover': {
      backgroundColor: "#fffbf2",
      cursor: 'pointer'
    }
  },
  emptyCard: {
    // height: "30vh",
    // width: "100%",
  },
  progress: {
    marginTop: "20vh",
  },
  noData: {
    marginTop: "10vh",
  },
  // tablecard: {
  //   padding: "1rem 2vw",
  //   height: "100%",
  // },
  tableContainer: {
    borderRadius: 15,
  },
  chip: {
    margin: "1vh",
  },
  pagination: {
    "& .MuiTablePagination-spacer": {
      display: "flex",
    },
  },
}));

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      // backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        // backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);

export default function Finder(props: any) {
  const classes = useStyles();
  const [centers, setCenters] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [maxsessions, setMaxsessions] = useState<any>([]);

  // Todo: Add Pagination - DONE
  // Todo: put this as global state,
  // Todo: set page 0 when district or state or pincode changes - DONE
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const findSlots = async () => {
      setLoading(true);
      // dates of sessions
      let allSessions = new Set();
      let response: any;
      if (props.pincode && String(props.pincode).length === 6) {
        response = await getSlotsWithPincode(props.pincode);
      } else {
        response = await getSlots(props.district);
      }
      // const response: any = await getSlots(props.district);
      if (response && response.centers) {
        setCenters(
          response.centers.filter((center: any) => {
            return (
              center.sessions.filter((session: any) => {
                allSessions.add(session.date);
                return (
                  session.min_age_limit === props.age_limit
                  // session.min_age_limit === props.age_limit &&
                  // session.available_capacity > 0
                );
              }).length > 0
            );
          })
        );
        setMaxsessions(Array.from(allSessions.values()));
      } else {
        setCenters([]);
      }
      setLoading(false);
    };
    handleChangePage("", 0);
    findSlots();
    let intervalID = setTimeout(() => findSlots(), props.refreshTimer * 1000);
    return () => {
      clearTimeout(intervalID);
    };
  }, [props]);

  // show no. of sessions available per center(rowdata)
  const makeSessions = (rowdata: any) => {
    let row = [];
    for (let i = 0; i < maxsessions.length; i++) {
      if (rowdata.sessions[i]) {
        row.push(
          <StyledTableCell key={rowdata.sessions[i].session_id} align="center">
            <Link onClick={() => {}} color="inherit">
              {rowdata.sessions[i].available_capacity}
              {/* {console.log(rowdata)} */}
            </Link>
            <Chip
              className={classes.chip}
              variant="outlined"
              size="small"
              label={rowdata.fee_type}
            />
          </StyledTableCell>
        );
        // && rowdata.sessions[i].date === maxsessions[i]  -> Not Required
        // check row.date == maxsessions[i].date
      } else {
        row.push(<StyledTableCell key={maxsessions[i]}></StyledTableCell>);
      }
    }
    return row;
  };

  if (centers.length > 0) {
    return (
      <>
        <Paper elevation={0} square className={classes.root}>
        <TableContainer className={classes.tableContainer}>
          <Table
            className={classes.table}
            stickyHeader
            aria-label="sticky table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>Hospital</StyledTableCell>
                {/* max sessions have all dates of available sessions*/}
                {maxsessions.map((session_date: any) => (
                  <StyledTableCell key={session_date} align="center">
                    {session_date}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {centers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((center: any) => (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={center.name}
                  >
                    <Tooltip title={center.address} placement="bottom">
                      <StyledTableCell>{center.name}</StyledTableCell>
                    </Tooltip>
                    {makeSessions(center)}
                  </StyledTableRow>
                ))}
            </TableBody>
            {/* <TableFooter></TableFooter> */}
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={centers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            className={classes.pagination}
          />
        </TableContainer>
        </Paper>
      </>
    );
  } else if (loading) {
    return (
      <>
        <CircularProgress className={classes.progress} />
      </>
    );
  } else {
    return (
      <>
        {/* <Card className={classes.emptyCard}>
        </Card> */}
        <Paper elevation={0} square className={classes.root}>
        <Typography className={classes.noData}>
          No Hospitals Found...
          </Typography>
          </Paper>
      </>
    );
  }
}
