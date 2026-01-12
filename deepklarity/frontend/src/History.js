import { useEffect, useState } from "react";

function History() {
  const [history, setHistory] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/history")
      .then(res => res.json())
      .then(data => setHistory(data));
  }, []);

  return (
    <div>
      <h2>Generated History</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {history.map((q, i) => (
            <tr key={i}>
              <td>{q.title}</td>
              <td>
                <button onClick={() => setSelectedQuiz(q)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedQuiz && (
        <div style={{ marginTop: "20px", border: "1px solid #000", padding: "15px" }}>
          <button onClick={() => setSelectedQuiz(null)}>Close</button>
          <h3>{selectedQuiz.title}</h3>

          {selectedQuiz.quiz.map((q, i) => (
            <div key={i}>
              <p><b>{q.question}</b></p>
              <p>Answer: {q.answer}</p>
              <p><i>{q.explanation}</i></p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
