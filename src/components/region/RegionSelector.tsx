import {
  AppBar,
  createStyles,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  makeStyles,
  MenuItem,
  Select,
  Slider,
  Switch,
  Theme,
  Toolbar,
  Typography,
  Input,
  InputAdornment,
} from "@material-ui/core";
import { FilterList, Search } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { District, getDistricts, getStates, IndiaState } from "../../store";
import Finder from "../finder/Finder";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      width: "20vw",
    },
    title: {
      flexGrow: 1,
      textAlign: "left",
    },
    filterButton: {
      color: "inherit",
    },
  })
);

export default function RegionSelector() {
  const classes = useStyles();
  const [stateId, setStateId] = useState<number>(0);
  const [stateList, setStateList] = useState<IndiaState[]>([
    { state_id: 0, state_name: "" },
  ]);
  const [districtId, setDistrictId] = useState<number>(0);
  const [districtList, setDistrictList] = useState<District[]>([
    { district_id: 0, district_name: "" },
  ]);
  const [refreshTimer, setRefreshTimer] = useState<number>(30);
  const [senior, setSenior] = useState(false);
  const [openfilters, setOpenfilters] = useState(false);
  const [pincode, setPincode] = useState<number>(0);
  const [searchPinCode, setSearchPinCode] = useState(false);

  useEffect(() => {
    const findStates = async () => {
      const response: any = await getStates();
      if (response && response.states) {
        setStateList(response.states);
        // setStateId(response.states[0].state_id);
      } else {
        setStateList([{ state_id: 0, state_name: "" }]);
        setStateId(0);
      }
    };
    findStates();
  }, []);

  useEffect(() => {
    const findDistricts = async () => {
      if (stateId !== 0) {
        const response: any = await getDistricts(stateId);
        if (response && response.districts) {
          setDistrictList(response.districts);
          // setDistrictId(response.districts[0].district_id);
        } else {
          setDistrictList([{ district_id: 0, district_name: "" }]);
          setDistrictId(0);
        }
      }
    };
    findDistricts();
  }, [stateId]);

  const handleStateSelect = (event: any) => {
    setStateId(event.target.value as number);
    setDistrictId(0);
    setPincode(0);
    setSearchPinCode(false);
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

  const toggleFilters = () => {
    setOpenfilters(!openfilters);
  };

  const handlePincodeChange = (event: any) => {
    let val = event.target.value;
    if (val) {
      console.log("changing Pincode as " + val);
      setPincode(val as number);
      setDistrictId(0);
      setStateId(0);
    } else {
      setPincode(0);
      setSearchPinCode(false);
    }
  };

  const handleSearchClick = (event: any) => {
    setSearchPinCode(true);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Vaccine Slots
          </Typography>
          <IconButton
            edge="end"
            aria-label="filter"
            className={classes.filterButton}
            onClick={toggleFilters}
          >
            <FilterList />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={openfilters} onClose={toggleFilters}>
        <List>
          <ListItem>
            <Typography variant="h6">Filters</Typography>
          </ListItem>
          <Divider />
          <ListItem>
            <FormControl className={classes.formControl}>
              <InputLabel>Enter Pincode</InputLabel>
              <Input
                name="pincode"
                type="text"
                id="pincode"
                value={pincode === 0 ? "" : pincode}
                onChange={handlePincodeChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearchClick}>
                      {" "}
                      <Search />{" "}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </ListItem>
          <div>
            <h4>Or</h4>
          </div>
          <ListItem>
            <FormControl className={classes.formControl}>
              <InputLabel>State</InputLabel>
              <Select
                label="State"
                value={stateId}
                onChange={handleStateSelect}
              >
                <MenuItem value={"0"}>Select State</MenuItem>
                {stateList &&
                  stateList.map((row: IndiaState) => (
                    <MenuItem key={row.state_id} value={row.state_id}>
                      {row.state_name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl className={classes.formControl}>
              <InputLabel>District</InputLabel>
              <Select
                label="District"
                value={districtId}
                onChange={handleDistrictChange}
              >
                <MenuItem value={"0"}>Select District</MenuItem>
                {districtList &&
                  districtList.map((row: District) => (
                    <MenuItem key={row.district_id} value={row.district_id}>
                      {row.district_name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
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
          </ListItem>
          <ListItem>
            <div>
              <Typography gutterBottom>Show 45+</Typography>
              <Switch
                checked={senior}
                onChange={handleShowSenior}
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            </div>
          </ListItem>
        </List>
      </Drawer>
      <Finder
        district={districtId}
        refreshTimer={refreshTimer}
        age_limit={senior ? 45 : 18}
        pincode={searchPinCode ? pincode : 0}
      />
    </>
  );
}
