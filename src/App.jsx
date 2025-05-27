import "./App.css";
import InscriptionsTable from "./components/InscriptionsTable";

const isDev = import.meta.env.MODE === "development";

function App() {
    // csv local in development mode. configuration wordpress plugin in production mode
    const csvFile = isDev ? "8km.csv" : window?.appData?.csvFile || null;

    return (
        <div className="App">
            <InscriptionsTable csvFile={csvFile} />
        </div>
    );
}

export default App;
