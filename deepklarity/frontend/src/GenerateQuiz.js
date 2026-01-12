import { useState } from "react";

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "15px",
  margin: "15px 0",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  backgroundColor: "#fff"
};

function GenerateQuiz() {
  const [url, setUrl] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});

  const generateQuiz = async () => {
    setLoading(true);
    setQuiz(null);

    const response = await fetch(
      `http://localhost:8000/generate?url=${url}`,
      { method: "POST" }
    );

    const data = await response.json();
    setQuiz(data);
    setLoading(false);
  };

  const handleAnswer = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  return (
    <div>
      <h2>Generate Quiz</h2>

      <input
        placeholder="Enter Wikipedia URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ width: "60%" }}
      />

      <button onClick={generateQuiz} style={{ marginLeft: "10px" }}>
        Generate
      </button>

      {loading && <p>⏳ Generating quiz...</p>}

      {quiz && quiz.quiz.map((q, i) => (
        <div key={i} style={cardStyle}>
          <span style={{ fontSize: "12px", color: "#666" }}>
            {q.difficulty.toUpperCase()}
          </span>

          <h4>{q.question}</h4>

          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(i, opt)}
              style={{ display: "block", margin: "5px 0" }}
            >
              {opt}
            </button>
          ))}

          {answers[i] && (
            <p style={{ color: answers[i] === q.answer ? "green" : "red" }}>
              {answers[i] === q.answer
                ? "✅ Correct!"
                : `❌ Wrong. Correct: ${q.answer}`}
              <br />
              <i>{q.explanation}</i>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default GenerateQuiz;
