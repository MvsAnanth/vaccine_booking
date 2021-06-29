import { makeStyles, Paper } from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import RegionSelector from "./components/region/RegionSelector";
import { classic } from "./themes/themes";
import GlobalStyles from "./themes/global";
import { useGlobalContext } from "./store/store";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
    height: "100vh",
    width: "100%",
  },
});

const App = () => {
  const classes = useStyles();
  const { state } = useGlobalContext();
  classic.palette.type = state.darkTheme ? "dark" : "light";
  const theme = createMuiTheme(classic);
  return (
    <MuiThemeProvider theme={theme}>
      <GlobalStyles />
      <Paper id="App" className={classes.root}>
        <RegionSelector />
      </Paper>
    </MuiThemeProvider>
  );
};

export default App;
