import './App.css';
import RegionSelector from './components/region/RegionSelector';

function App() {
  sessionStorage.setItem("district_id",1)
  return (
    <div className="App">
      <RegionSelector></RegionSelector>
    </div>
  );
}

export default App;
