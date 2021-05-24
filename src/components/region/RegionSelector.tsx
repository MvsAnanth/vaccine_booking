import {
  Card,
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Slider,
  Switch,
  Theme,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { District, getDistricts, getStates, IndiaState } from "../../store";
import Finder from "../finder/Finder";
import "./RegionSelector.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      minWidth: "max-content",
    },
  })
);

export default function RegionSelector() {
  const classes = useStyles();
  const [stateId, setStateId] = useState<number>(0);
  const [stateList, setStateList] = useState<IndiaState[]>([
    { state_id: 0, state_name: "Loading..." },
  ]);
  const [districtId, setDistrictId] = useState<number>(0);
  const [districtList, setDistrictList] = useState<District[]>([
    { district_id: 0, district_name: "Loading..." },
  ]);
  const [refreshTimer, setRefreshTimer] = useState<number>(30);
  const [senior, setSenior] = useState(false);

  useEffect(() => {
    const findStates = async () => {
      const response: any = await getStates();
      if (response && response.states) {
        setStateList(response.states);
        setStateId(response.states[0].state_id);
      } else {
        setStateList([{ state_id: 0, state_name: "Loading..." }]);
        setStateId(0);
      }
    };
    findStates();
  }, []);

  useEffect(() => {
    const findDistricts = async () => {
      const response: any = await getDistricts(stateId);
      if (response && response.districts) {
        setDistrictList(response.districts);
        setDistrictId(response.districts[0].district_id);
      } else {
        setDistrictList([{ district_id: 0, district_name: "Loading..." }]);
        setDistrictId(0);
      }
    };
    findDistricts();
  }, [stateId]);

  const handleStateSelect = (event: any) => {
    setStateId(event.target.value as number);
  };

  const handleDistrictChange = (event: any) => {
    setDistrictId(event.target.value as number);
  };

  const handleRefreshTimerChange = (
    event: any,
    newValue: number | number[]
  ) => {
    setRefreshTimer(newValue as number);
  };

  const handleShowSenior = (event: any) => {
    setSenior(event.target.checked);
  };

  return (
    <>
      <Card>
        <div className="region-selectors">
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel>State</InputLabel>
            <Select label="State" value={stateId} onChange={handleStateSelect}>
              {stateList.map((row: IndiaState) => (
                <MenuItem key={row.state_id} value={row.state_id}>
                  {row.state_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel>District</InputLabel>
            <Select
              label="District"
              value={districtId}
              onChange={handleDistrictChange}
            >
              {districtList.map((row: District) => (
                <MenuItem key={row.district_id} value={row.district_id}>
                  {row.district_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            <Typography gutterBottom>
              Refresh Timer ({refreshTimer} seconds)
            </Typography>
            <Slider
              className="timer-selector"
              defaultValue={30}
              onChange={handleRefreshTimerChange}
              step={30}
              marks
              min={30}
              max={300}
              valueLabelDisplay="auto"
            />
          </div>
          <div>
            <Typography gutterBottom>Show 45+</Typography>
            <Switch
              checked={senior}
              onChange={handleShowSenior}
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
          </div>
        </div>
      </Card>
      <Finder
        district={districtId}
        refreshTimer={refreshTimer}
        age_limit={senior ? 45 : 18}
      />
    </>
  );
}