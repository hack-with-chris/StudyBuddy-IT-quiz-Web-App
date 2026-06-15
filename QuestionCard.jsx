export default function QuestionCard({
  data,
  index,
  selected,
  showResult, // ✅ ADD THIS
  onSelect
}) {

  const handleClick = (opt) => {
    if (selected !== undefined) return;
    onSelect(index, opt);
  };

  // 🔥 CLEAN ANSWER (remove A. B. C. etc)
  const clean = (text) =>
    text?.replace(/^[A-D]\.\s*/, "").trim();

  const correctAnswer = clean(
    data.options[
    data.answer.charCodeAt(0) - 65
    ]
  );

  const getClass = (opt) => {
    if (selected === undefined) return "";

    const cleanOpt = clean(opt);
    const cleanSelected = clean(selected);
    const isSelected = cleanOpt === cleanSelected;
    const isCorrect = cleanOpt === correctAnswer;

    // 🎯 ONLY USER SELECTED OPTION COLOR
    if (isSelected && isCorrect) return "correct";
    if (isSelected && !isCorrect) return "wrong";

    return ""; // ❌ no correct answer reveal
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