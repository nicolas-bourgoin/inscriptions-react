import { useState } from "react"
import "./App.css"
import InscriptionsTable from "./components/InscriptionsTable"

function App() {
  
   const csvFile = window?.appData?.csvFile || null;

  return (
    <div className="App">
      <InscriptionsTable csvFile={csvFile} />
    </div>
  );
}

export default App;
