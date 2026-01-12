import { useState } from "react";
import GenerateQuiz from "./GenerateQuiz";
import History from "./History";

function App() {
  const [tab, setTab] = useState("generate");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>DeepKlarity – AI Wiki Quiz Generator</h1>

      <button onClick={() => setTab("generate")}>Generate</button>
      <button onClick={() => setTab("history")} style={{ marginLeft: "10px" }}>
        History
      </button>

      <hr />

      {tab === "generate" && <GenerateQuiz />}
      {tab === "history" && <History />}
    </div>
  );
}

export default App;
