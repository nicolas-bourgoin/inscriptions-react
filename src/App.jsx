import "./App.css";
import InscriptionsTable from "./components/InscriptionsTable";

const isDev = import.meta.env.MODE === "development";

function App() {
    const csvFile = isDev ? "8km.csv" : window?.appData?.csvFile || null;

    return (
        <div className="App">
            <InscriptionsTable csvFile={csvFile} />
        </div>
    );
}

export default App;
