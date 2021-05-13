import { Card, CardContent, CircularProgress, createStyles, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, withStyles } from '@material-ui/core';
import React from 'react';
import { getSlots } from '../../store/client';

const StyledTableCell = withStyles((theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }),
)(TableCell);

const StyledTableRow = withStyles((theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow);

class Finder extends React.Component {

    intervalID;

    constructor(props) {
        super(props);
        this.state = {
            centers: [],
            maxsessions: [],
            loading: true
        }
    }
    componentDidMount() {
        this.findSlots();
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps !== this.props) {
            this.findSlots()
        }
    }

    componentWillUnmount() {
        clearTimeout(this.intervalID);
    }

    async findSlots() {
        let response = {};
        let centers = [];
        let maxsessions = [];
        try {
            response = await getSlots(this.props.district);
            for (let center of response.centers.values()) {
                let sessions = center.sessions.filter(session => {
                    return session.min_age_limit === this.props.age_limit && session.available_capacity > 0;
                });
                if (sessions.length > 0) {
                    center.sessions = sessions;
                    centers.push(center)
                    maxsessions = ((sessions.length > maxsessions.length) ? sessions : maxsessions)
                }
            }
        } catch (error) {
            console.log(error);
        }
        this.intervalID = setTimeout(this.findSlots.bind(this), this.props.refreshTimer*60000);
        console.log(this.props.refreshTimer*60000)
        this.setState(
            {
                centers: centers,
                maxsessions: maxsessions,
                loading: false
            }
        )
    }

    makeSessions = (rowdata) => {
        let row = [];
        for (let i = 0; i < this.state.maxsessions.length; i++) {
            if (rowdata.sessions[i]) {
                row.push(
                    <StyledTableCell key={rowdata.sessions[i].session_id} align="center">
                        <Link onClick={() => {

                        }}>
                            {rowdata.sessions[i].available_capacity}
                        </Link>
                    </StyledTableCell>)
            } else {
                row.push(<StyledTableCell></StyledTableCell>)
            }
        }
        return row;
    }

    render() {
        let slots = this.state.centers;
        const headers = [];
        const maxsessions = this.state.maxsessions;
        const loading = this.state.loading;
        for (let i = 0; i < maxsessions.length; i++) {
            headers.push(
                <StyledTableCell key={this.state.maxsessions[i].date} align="center">
                    {this.state.maxsessions[i].date}
                </StyledTableCell>
            )
        }
        if (slots.length > 0) {
            window.alert("Slots Available");
            window.open("https://selfregistration.cowin.gov.in/");
            return (
                <Card>
                    <CardContent>
                        <TableContainer component={Paper}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Hospital</StyledTableCell>
                                        {headers}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {slots.map((row) => (
                                        <StyledTableRow key={row.name}>
                                            <Tooltip title={row.address} placement="bottom">
                                                <StyledTableCell>
                                                    {row.name}
                                                </StyledTableCell>
                                            </Tooltip>
                                            {this.makeSessions(row)}
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )
        } else if (loading) {
            return (
                <CircularProgress />
            )
        } else {
            return (
                <Card>
                </Card>
            )
        }
    }
}

export default Finder;