// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { io } from "socket.io-client";

// export default function Scores() {
//   const [scores, setScores] = useState([]);
//   const [myRank, setMyRank] = useState(null);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const [prevRank, setPrevRank] = useState(null);

//   // 🔄 Fetch leaderboard
//   const fetchScores = () => {
//     fetch("http://localhost:5000/api/scores")
//       .then((res) => res.json())
//       .then((data) => {
//         setScores(data);

//         // 🧠 Find my rank
//         const index = data.findIndex(
//           (item) => item.userId._id === user._id
//         );

//         if (index !== -1) {
//           const newRank = index + 1;

//           if (prevRank && newRank < prevRank) {
//             // 🔥 rank improved
//             alert("🚀 Rank Improved! Keep going!");
//           }

//           setPrevRank(newRank);
//           setMyRank(newRank);
//         }
//       })
//       .catch((err) => console.log(err));
//   };

//   useEffect(() => {
//     fetchScores();

//     // ⚡ Live updates
//     const socket = io("http://localhost:5000");

//     socket.on("leaderboardUpdate", () => {
//       fetchScores();
//     });

//     return () => socket.disconnect();
//   }, []);

//   return (
//     <div className="scoreboard">
//       <h1>🏆 Leaderboard</h1>

//       {/* 🏅 TOP 10 LIST */}
//       {scores.map((item, index) => {
//         const isMe = item.userId._id === user._id;

//         return (
//           <motion.div
//             key={index}
//             className={`score-card ${isMe ? "me" : ""}`}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{
//               opacity: 1,
//               y: 0,
//               scale: isMe ? 1.05 : 1 // 🔥 highlight YOU
//             }}
//             transition={{ delay: index * 0.1 }}
//           >
//             {/* 🏅 Rank */}
//             <span className="rank">
//               {index === 0 ? "👑" : `#${index + 1}`}
//             </span>

//             {/* 👤 Profile */}
//             <img
//               src={item.userId.profilePic || "/profile.jpg"}
//               className="avatar"
//               alt=""
//             />

//             {/* Username + YOU badge */}
//             <span className="username">
//               {item.userId.username}
//               {isMe && <span className="you-badge">YOU</span>}
//             </span>

//             {/* 🎯 Level */}
//             <span className="level">Lv. {item.level}</span>

//             {/* ⭐ Score */}
//             <span className="points">{item.score} pts</span>
//           </motion.div>
//         );
//       })}

//       {/* 📊 YOUR RANK */}
//       <div className="my-rank">
//         {myRank === "Not Ranked"
//           ? "You are not in Top 10 yet 😢"
//           : `Your Rank: #${myRank}`}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

export default function Scores() {
  const [scores, setScores] = useState([]);
  const [myRank, setMyRank] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const [prevRank, setPrevRank] = useState(null);

  const fetchScores = () => {
    fetch("http://localhost:5000/api/scores")
      .then((res) => res.json())
      .then((data) => {
        setScores(data);

        // const index = data.findIndex(
        //   (item) => item.userId._id === user?._id
        // );

        const index = data.findIndex(
          (item) =>
            item.userId &&
            item.userId._id === user?._id
        );

        if (index !== -1) {
          const newRank = index + 1;

          if (prevRank && newRank < prevRank) {
            alert("🚀 Rank Improved!");
          }

          setPrevRank(newRank);
          setMyRank(newRank);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchScores();

    const socket = io("http://localhost:5000");

    socket.on("leaderboardUpdate", () => {
      fetchScores();
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="scoreboard">

      <motion.h1
        className="leaderboard-title"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🏆 Leaderboard
      </motion.h1>

      {/* {scores.map((item, index) => {
        const isMe = item.userId._id === user?._id; */}
      {scores.map((item, index) => {

        // 🛡️ prevent crash
        if (!item.userId) return null;

        const isMe = item.userId._id === user?._id;
        return (
          <motion.div
            key={index}
            className={`score-card 
              ${isMe ? "me" : ""} 
              ${index === 0 ? "gold" : ""}
              ${index === 1 ? "silver" : ""}
              ${index === 2 ? "bronze" : ""}
            `}
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 120
            }}
            whileHover={{
              scale: 1.04,
              rotate: index === 0 ? 1 : 0
            }}
          >

            {/* Rank */}
            {/* <motion.div
              className="rank"
              animate={{
                y: [0, -5, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5
              }}
            >
              {index === 0
                ? "👑"
                : index === 1
                  ? "🥈"
                  : index === 2
                    ? "🥉"
                    : `#${index + 1}`}
            </motion.div> */}

            <motion.div
              className="rank"
              animate={{
                y: [0, -5, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5
              }}
            >
              {index === 0
                ? "👑 1"
                : index === 1
                  ? "🥈 2"
                  : index === 2
                    ? "🥉 3"
                    : `${index + 1}`}
            </motion.div>

            <img
              src={
                item.userId.profilePic?.startsWith("blob:")
                  || item.userId.profilePic?.startsWith("data:")
                  ? item.userId.profilePic
                  : item.userId.profilePic
                    ? `http://localhost:5000/${item.userId.profilePic}`
                    : "/profile.jpg"
              }
              className="avatar"
              alt=""
              onError={(e) => {
                e.target.src = "/profile.jpg";
              }}
            />

            {/* Username */}
            <div className="user-info">
              <span className="username">
                {item.userId.username}

                {isMe && (
                  <motion.span
                    className="you-badge"
                    animate={{
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1
                    }}
                  >
                    YOU
                  </motion.span>
                )}
              </span>

              <span className="level">
                Level {item.level}
              </span>
            </div>

            {/* Score */}
            <motion.span
              className="points"
              whileHover={{ scale: 1.2 }}
            >
              ⭐ {item.score}
            </motion.span>

          </motion.div>
        );
      })}

      <motion.div
        className="my-rank"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {myRank
          ? `🔥 Your Rank: ${myRank}`
          : "😢 You are not ranked yet"}
      </motion.div>
    </div>
  );
}