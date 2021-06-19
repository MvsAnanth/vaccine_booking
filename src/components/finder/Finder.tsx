import {
  Card,
  CardContent,
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
  TableRow,
  Theme,
  Tooltip,
  Typography,
  withStyles,
  Chip,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { getSlots, getSlotsWithPincode } from "../../store";

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  emptyCard: {
    height: "30vh",
    width: "100%",
  },
  progress: {
    marginTop: "20vh",
  },
  noData: {
    marginTop: "10vh",
  },
  tablecard: {
    padding: "1rem 2vw",
    height: "100%",
  },
  chip: {
    margin: "1vh",
  },
});

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
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
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);

export default function Finder(props: any) {
  const classes = useStyles();
  const [centers, setCenters] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [maxsessions, setMaxsessions] = useState<any>([]);

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
              {console.log(rowdata)}
            </Link>
            <Chip className={classes.chip} variant="outlined" size="small" label={rowdata.fee_type} />
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
        <Card className={classes.tablecard}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table className={classes.table}>
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
                  {centers.map((center: any) => (
                      <StyledTableRow key={center.name}>
                        <Tooltip title={center.address} placement="bottom">
                          <StyledTableCell>{center.name}</StyledTableCell>
                        </Tooltip>
                        {makeSessions(center)}
                      </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
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
        <Card className={classes.emptyCard}>
          <Typography className={classes.noData}>
            No Hospitals Found...
          </Typography>
        </Card>
      </>
    );
  }
}
