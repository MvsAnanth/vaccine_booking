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
  withStyles,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { getSlots } from "../../store";

const useStyles = makeStyles({
  table: {
    minWidth: 700,
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
      let allSessions = new Set();
      const response: any = await getSlots(props.district);
      if (response && response.centers) {
        setCenters(
          response.centers.filter((center: any) => {
            return (
              center.sessions.filter((session: any) => {
                allSessions.add(session.date);
                return (
                  session.min_age_limit === props.age_limit &&
                  session.available_capacity > 0
                );
              }).length > 0
            );
          })
        );
        setMaxsessions(Array.from(allSessions.values()));
        setLoading(false);
      } else {
        setCenters([]);
      }
    };
    findSlots();
    let intervalID = setTimeout(() => findSlots(), props.refreshTimer * 1000);
    return () => {
      clearTimeout(intervalID);
    };
  }, [props]);
  const makeSessions = (rowdata: any) => {
    let row = [];
    for (let i = 0; i < maxsessions.length; i++) {
      if (rowdata.sessions[i]) {
        row.push(
          <StyledTableCell key={rowdata.sessions[i].session_id} align="center">
            <Link onClick={() => {}}>
              {rowdata.sessions[i].available_capacity}
            </Link>
          </StyledTableCell>
        );
      } else {
        row.push(<StyledTableCell></StyledTableCell>);
      }
    }
    return row;
  };
  if (centers.length > 0) {
    return (
      <>
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table
                className={classes.table}
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Hospital</StyledTableCell>
                    {maxsessions.map((column: any) => (
                      <StyledTableCell key={column} align="center">
                        {column}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {centers.map((row: any) => (
                    <StyledTableRow key={row.name}>
                      <Tooltip title={row.address} placement="bottom">
                        <StyledTableCell>{row.name}</StyledTableCell>
                      </Tooltip>
                      {makeSessions(row)}
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
        <CircularProgress />
      </>
    );
  } else {
    return (
      <>
        <Card></Card>
      </>
    );
  }
}
