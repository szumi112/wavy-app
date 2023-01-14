import EntryIndicator from "./components/entryIndicator";
import Leaflet from "./components/map";
import Table from "./components/table";
import "./index.css";

function App() {
  return (
    <div className="App">
      <Table />
      <Leaflet />
      <EntryIndicator />
    </div>
  );
}

export default App;
