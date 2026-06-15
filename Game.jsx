import React, { useState } from "react";
import DifficultySelect from "../components/DifficultySelect";
import LevelMap from "../components/LevelMap";
import QuestionCard from "../components/QuestionCard";
import WinScreen from "../components/WinScreen";

export default function Game() {

  // const handleDifficulty = (level) => {
  //   setDifficulty(level);
  //   localStorage.setItem("difficulty", level); // ✅ save
  // };

  const handleDifficulty = (level) => {
    setDifficulty(level);

    const user = JSON.parse(localStorage.getItem("user"));

    localStorage.setItem(
      `difficulty_${user._id}`,
      level
    );
  };
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  // const [difficulty, setDifficulty] = useState(null);
  // const [difficulty, setDifficulty] = useState(
  //   localStorage.getItem("difficulty") || null
  // );

  const user = JSON.parse(localStorage.getItem("user"));

  const [difficulty, setDifficulty] = useState(
    localStorage.getItem(`difficulty_${user?._id}`) || null
  );
  const [level, setLevel] = useState(1);
  // const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(
    storedUser?.progress?.level || 1
  );

  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const [showResult, setShowResult] = useState(false);
  const [showWin, setShowWin] = useState(false);


  const resetQuiz = () => {
    // alert("❌ Cheating detected! Restarting level.");
    alert("⚠️ You left the quiz window. The quiz will be restarted to maintain fairness.");
    setQuizStarted(false);
    setAnswers({});
    setShowResult(false);
    setQuestions([]);
  };

  React.useEffect(() => {
    if (!quizStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        resetQuiz(); // 🔥 main logic
      }
    };

    const handleBlur = () => {
      resetQuiz(); // 🔥 same here
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [quizStarted, level]);

  const correctSound = new Audio("/sounds/correct.mp3");
  const wrongSound = new Audio("/sounds/wrong.mp3");
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  React.useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser?.progress?.level) {
      setUnlockedLevel(storedUser.progress.level);
    }
  }, []);

  if (loadingQuiz) {
    return (
      <div className="loading-screen">
        <h2>⚡ Generating Quiz...</h2>

        <div className="loading-bar">
          <div className="loading-fill"></div>
        </div>

        <br /><br /> <p>Please wait...</p>
      </div>
    );
  }

  const fetchQuiz = async (lvl) => {
    setLoadingQuiz(true); // 🔥 START LOADING

    const res = await fetch("http://localhost:5000/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level: lvl }),
    });

    const data = await res.json();


    if (!data.questions || data.questions.length === 0) {
      console.log("Retrying quiz...");
      return fetchQuiz(lvl); // auto retry
    }
    console.log("API DATA:", data);

    setLoadingQuiz(false); // 🔥 STOP LOADING

    return data.questions;
  };
  const startLevel = async (lvl) => {
    if (lvl > unlockedLevel) return;
    const quiz = await fetchQuiz(lvl);

    setQuestions(quiz);
    setAnswers({});
    setLevel(lvl);

    setQuizStarted(true);
    setShowResult(false);
    setShowWin(false);
  };

  const updateProgress = async (level) => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/update-progress/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ level }),
        }
      );

      const data = await res.json();
      console.log("Progress updated:", data);

      // update localStorage also
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          progress: data.progress,
        })
      );

    } catch (err) {
      console.log("Progress error:", err);
    }
  };

  const clean = (text) =>
    text?.replace(/^[A-D]\.\s*/, "").trim();

  const handleAnswer = (qIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: option,
    }));

    const question = questions[qIndex];

    // ✅ correct option text nikalo
    const correctOption =
      question.options[question.answer.charCodeAt(0) - 65];

    const cleanSelected = clean(option);
    const cleanCorrect = clean(correctOption);

    // 🎵 SOUND FIX
    if (cleanSelected === cleanCorrect) {
      correctSound.currentTime = 0;
      correctSound.play();
    } else {
      wrongSound.currentTime = 0;
      wrongSound.play();
    }
  };

  // const handleSubmit = () => {

  //   setShowResult(true);

  //   const clean = (text) =>
  //     text?.replace(/^[A-D]\.\s*/, "").trim();

  //   const correctCount = questions.filter((q, i) => {
  //     const selected = answers[i];
  //     if (!selected) return false;

  //     const correctOption =
  //       q.options[q.answer.charCodeAt(0) - 65];

  //     return clean(selected) === clean(correctOption);
  //   }).length;

  //   // 🟢 PASS CONDITION
  //   if (correctCount >= 8) {
  //     const nextLevel = level + 1;

  //     // 🔥 SAVE PROGRESS TO DB HERE (STEP 3)
  //     updateProgress(level);

  //     setTimeout(() => {
  //       setShowWin(true);
  //     }, 800);
  //   }
  // };

  const handleSubmit = async () => {
    setShowResult(true);

    const clean = (text) =>
      text?.replace(/^[A-D]\.\s*/, "").trim();

    const correctCount = questions.filter((q, i) => {
      const selected = answers[i];
      if (!selected) return false;

      const correctOption =
        q.options[q.answer.charCodeAt(0) - 65];

      return clean(selected) === clean(correctOption);
    }).length;

    // ✅ SAVE SCORE AFTER CALCULATION
    const user = JSON.parse(localStorage.getItem("user"));

    await fetch("http://localhost:5000/api/scores/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        score: correctCount * level * 10,
        level: level
      }),
    });

    // 🟢 PASS CONDITION
    if (correctCount >= 8) {
      updateProgress(level);

      setTimeout(() => {
        setShowWin(true);
      }, 800);
    }
  };
  const handleWinFinish = () => {
    setShowWin(false);
    setUnlockedLevel((prev) => Math.max(prev, level + 1));
    setQuizStarted(false);
    setShowResult(false);
    setAnswers({});
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResult(false);
  };

  const handlePlayAgain = async () => {
    const quiz = await fetchQuiz(level);

    setQuestions(quiz);
    setAnswers({});
    setShowResult(false);
  };

  // if (!difficulty) {
  //   return <DifficultySelect onSelect={setDifficulty} />;
  // }
  if (!difficulty) {
    return <DifficultySelect onSelect={handleDifficulty} />;
  }

  if (!quizStarted) {
    return (
      <LevelMap
        unlockedLevel={unlockedLevel}
        onLevelClick={startLevel}
      />
    );
  }

  if (showWin) {
    return <WinScreen onFinish={handleWinFinish} />;
  }



  return (
    <div className="quiz-container">

      {/* 🔙 BACK BUTTON */}
      <button
        className="back-btn"
        onClick={() => setShowExitConfirm(true)}
      >
        ⬅ Back
      </button>

      <h2>Level {level}</h2>

      {questions && questions.length > 0 && questions.map((q, i) => (
        <QuestionCard
          key={i}
          data={q}
          index={i}
          selected={answers[i]}
          showResult={showResult}
          onSelect={handleAnswer}
        />
      ))}

      {!showResult && (
        <button className="submit-btn" onClick={handleSubmit}>
          Submit 🚀
        </button>
      )}

      {showResult && (
        <div className="result-buttons">
          <button className="game-btn retry-btn" onClick={handleRetry}>
            Retry 🔁
          </button>

          <button className="game-btn play-btn" onClick={handlePlayAgain}>
            Play Again 🎮
          </button>
        </div>
      )}

      {/* ✅ EXIT MODAL */}
      {showExitConfirm && (
        <div className="exit-modal">
          <div className="exit-box">
            <h3>Leave Quiz?</h3>
            <p>Your progress will be lost 😢</p>

            <div className="exit-actions">
              <button
                className="game-btn retry-btn"
                onClick={() => setShowExitConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="game-btn play-btn"
                onClick={() => {
                  setShowExitConfirm(false);
                  setQuizStarted(false);
                  setAnswers({});
                  setShowResult(false);
                }}
              >
                Yes, Leave
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

