import React from "react";

export default function ResultModal({
  correct,
  total,
  passed,
  onRetry,
  onPlayAgain,
  onNext,
  questions
}) {
  return (
    <div className="result-modal">

      <h2>Result</h2>
      <p>{correct} / {total}</p>

      {passed ? (
        <h3>🎉 You Passed!</h3>
      ) : (
        <h3>❌ Try Again</h3>
      )}

      {!passed && (
        <button className="game-btn retry-btn" onClick={onRetry}>
          Retry
        </button>
      )}

      <button className="game-btn play-btn" onClick={onPlayAgain}>
        Play Again
      </button>

      {passed && (
        <button className="game-btn solution-btn" onClick={onNext}>
          Next Level
        </button>
      )}

      <h4>Solutions</h4>

      {questions.map((q, i) => (
        <div key={i}>
          <p>{q.question}</p>
          <p>✔ {q.answer}</p>
          <p>{q.solution}</p>
        </div>
      ))}
    </div>
  );
}