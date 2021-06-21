import { useState } from "react";
import {
  IconButton,
  AppBar,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import { makeStyles } from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import RegionSelector from "./components/region/RegionSelector";
import { classic } from "./themes/themes";
import GlobalStyles from "./themes/global";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
    backgroundColor: "gray",
    // alignItems: 'center',
    "& .MuiPaper-root": {
      color: "#fff",
      // transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      // backgroundColor: '#424242',
    },
  },
  toolbarButtons: {
    marginLeft: "auto",
  },
});

const App = () => {
  const classes = useStyles();
  // console.log(classic);
  const [darkTheme, setTheme] = useState(true);

  const icon = !darkTheme ? <Brightness7Icon /> : <Brightness3Icon />;
  // Icons imported from `@material-ui/icons`
  // && (classic.palette.primary.main = "#nnn")
  darkTheme
    ? (classic.palette.type = "dark")
    : (classic.palette.type = "light");

  const handleThemeChange = (event: any) => {
    setTheme(!darkTheme);
  };

  const theme = createMuiTheme(classic);
  return (
    <MuiThemeProvider theme={theme}>
      <GlobalStyles />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Theme</Typography>
          <div className={classes.toolbarButtons}>
            <Tooltip title="Toggle light theme/dark theme">
              <IconButton
                edge="end"
                color="inherit"
                aria-label="mode"
                onClick={handleThemeChange}
              >
                {icon}
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      <RegionSelector />
    </MuiThemeProvider>
  );
};

export default App;
