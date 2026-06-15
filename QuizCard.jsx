export default function QuestionCard({
  data,
  index,
  selected,
  showResult,
  onSelect,
}) {
  const handleClick = (opt) => {
    if (showResult) return;
    onSelect(index, opt);
  };

  const getClass = (opt) => {
    if (!showResult) {
      return selected === opt ? "selected" : "";
    }

    // AFTER SUBMIT ONLY
    if (opt === data.answer) return "correct";
    if (selected === opt && opt !== data.answer) return "wrong";

    return "";
  };

  return (
    <div className="question-card">
      <h4>{index + 1}. {data.question}</h4>

      <div className="options">
        {data.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleClick(opt)}
            className={`option-btn ${getClass(opt)}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}