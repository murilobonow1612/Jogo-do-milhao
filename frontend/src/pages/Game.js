import React, { useState, useEffect } from 'react';
import { nodeAPI } from '../api/api';

const Game = () => {
  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    const response = await nodeAPI.get('/question');
    setQuestion(response.data);
  };

  const handleAnswer = async (answer) => {
    const response = await nodeAPI.post('/validate', { id: question.id, answer });
    if (response.data.correct) {
      setScore(score + response.data.points);
      fetchQuestion();
    } else {
      alert('Resposta errada! Fim de jogo.');
    }
  };

  return (
    <div>
      <h2>Pontuação: {score}</h2>
      {question && (
        <div>
          <p>{question.text}</p>
          {question.options.map((opt, index) => (
            <button key={index} onClick={() => handleAnswer(opt)}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Game;
