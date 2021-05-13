import { Card, createStyles, FormControl, InputLabel, MenuItem, Select, Slider, Switch, Typography, withStyles } from "@material-ui/core";
import React from "react";
import { getStates, getDistricts } from '../../store/client';
import Finder from "../finder/Finder";
import './RegionSelector.css';

const StyledFormControl = withStyles((theme) =>
    createStyles({
        formControl: {
            minWidth: "15rem",
        }
    }),
)(FormControl);

class RegionSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateName: 0,
            stateList: [],
            district: 0,
            districtList: [],
            refreshTimer: 1,
            senior: false
        }

    }

    componentDidMount() {
        this.findStates();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.stateName !== this.state.stateName) {
            this.findDistricts(this.state.stateName)
        }
    }

    async findStates() {
        let response = {};
        try {
            response = await getStates();
        } catch (error) {
            console.log(error);
        }
        this.setState(
            {
                stateList: response.states
            }
        )
    }

    async findDistricts(state_id) {
        let response = {};
        let districts = [];
        try {
            response = await getDistricts(state_id);
            if (response.districts) {
                districts = response.districts
            } else {
                districts = []
            }
        } catch (error) {
            console.log(error);
        }
        this.setState(
            {
                districtList: districts
            }
        )
    }

    handleRefreshTime = (event, newValue) => {
        console.log(newValue)
        this.setState({ refreshTimer: newValue })
    }

    render() {
        return (
            <React.Fragment>
                <Card>
                    <div className="region-selectors">
                        <StyledFormControl variant="outlined">
                            <InputLabel>State</InputLabel>
                            <Select
                                label="State"
                                value={this.state.stateName}
                                onChange={(event) => this.setState({ stateName: event.target.value })}>
                                {this.state.stateList.map((row) => (
                                    <MenuItem key={row.state_id} value={row.state_id}>{row.state_name}</MenuItem>
                                ))}
                            </Select>
                        </StyledFormControl>
                        <StyledFormControl variant="outlined">
                            <InputLabel>District</InputLabel>
                            <Select
                                label="District"
                                value={this.state.district}
                                onChange={(event) => {
                                    this.setState({ district: event.target.value })
                                }}>
                                {this.state.districtList.map((row) => (
                                    <MenuItem key={row.district_id} value={row.district_id}>{row.district_name}</MenuItem>
                                ))}
                            </Select>
                        </StyledFormControl>
                        <div>
                            <Typography gutterBottom>
                                Refresh Timer (mins)
                            </Typography>
                            <Slider
                                className="timer-selector"
                                defaultValue={1}
                                onChange={this.handleRefreshTime}
                                step={1}
                                marks
                                min={1}
                                max={5}
                                valueLabelDisplay="auto"
                            />
                        </div>
                        <div>
                            <Typography gutterBottom>
                                Show 45+
                            </Typography>
                            <Switch
                                checked={this.state.senior}
                                onChange={(event) => this.setState({ senior: event.target.checked })}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                        </div>
                    </div>
                </Card>
                <Finder
                    district={this.state.district}
                    refreshTimer={this.state.refreshTimer}
                    age_limit={this.state.senior ? 45 : 18}
                />
            </React.Fragment >
        )
    }
}

export default RegionSelector;