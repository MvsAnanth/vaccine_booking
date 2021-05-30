import { makeStyles } from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import RegionSelector from "./components/region/RegionSelector";
import { classic } from "./themes/themes";
import GlobalStyles from "./themes/global";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
  }
});

const App = () => {
  const classes = useStyles();
  console.log(classic)
  const theme = createMuiTheme(classic);
  return (
    <MuiThemeProvider theme={theme}>
      <GlobalStyles />
      <div id="App" className={classes.root}>
        <RegionSelector />
      </div>
    </MuiThemeProvider>
  );
};

export default App;
