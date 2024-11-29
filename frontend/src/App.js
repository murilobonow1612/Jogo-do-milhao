import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
import backgroundImage from './assets/A.png';

// Tela inicial
const StartScreen = ({ onStart }) => (
  <div
    className="start-screen"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <h1>SHOW DO MILHÃO</h1>
    <button onClick={onStart}>Iniciar Jogo</button>
  </div>
);

// Tela de jogo
const GameScreen = ({ question, onAnswer, score }) => (
  <div className="game-screen">
    <h2>{question.pergunta}</h2>
    <p>Pontuação atual: {score}</p> {/* Exibe a pontuação */}
    <div>
      {question.alternativas ? (
        question.alternativas.map((alt, index) => (
          <button key={index} onClick={() => onAnswer(alt.label)}>
            {alt.label}: {alt.texto}
          </button>
        ))
      ) : (
        <p>Carregando alternativas...</p>
      )}
    </div>
  </div>
);

// Tela final
const EndScreen = ({ score, onRestart }) => (
  <div className="end-screen">
    <h1>Jogo Finalizado</h1>
    <h2>Pontuação Final: {score}</h2>
    <button onClick={onRestart}>Reiniciar Jogo</button>
  </div>
);

const App = () => {
  const [screen, setScreen] = useState("start");
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false); // Novo estado para controlar carregamento

  // Iniciar o jogo
  const startGame = () => {
    setScreen("game");
    fetchQuestion(); // Buscar a primeira pergunta
  };

  // Buscar uma pergunta da API
  const fetchQuestion = async () => {
    try {
        setLoading(true);  // Ativar o estado de carregamento
        console.log("Buscando pergunta...");
        const response = await axios.get("http://localhost:3001/api/questions");
        const randomQuestion = response.data[Math.floor(Math.random() * response.data.length)];

        // Formatando a pergunta para incluir as alternativas como array
        const formattedQuestion = {
            pergunta: randomQuestion.pergunta,
            alternativas: [
                { label: "A", texto: randomQuestion.alternativa_a },
                { label: "B", texto: randomQuestion.alternativa_b },
                { label: "C", texto: randomQuestion.alternativa_c },
                { label: "D", texto: randomQuestion.alternativa_d }
            ],
            correta: randomQuestion.alternativa_correta,
            id: randomQuestion.id,
            pontos: randomQuestion.pontos // Incluindo a pontuação da pergunta
        };

        console.log("Pergunta formatada:", formattedQuestion); // Debug
        setQuestion(formattedQuestion); // Atualiza o estado
        setLoading(false);  // Desativar o estado de carregamento
    } catch (error) {
        console.error("Erro ao buscar pergunta:", error);
        setLoading(false);  // Desativar o carregamento em caso de erro
    }
  };

  console.log("Estado question após fetch:");
  console.log("Pergunta selecionada (question):", question);

  // Lidar com a resposta
  const handleAnswer = async (answer) => {
    try {
        console.log("Validando resposta...");
        const isCorrect = answer === question.correta; // Compara o rótulo selecionado com a correta

        if (isCorrect) {
            setScore(score + question.pontos); // Adiciona a pontuação conforme o nível da pergunta
            fetchQuestion(); // Buscar nova pergunta
        } else {
            setScreen("end"); // Finaliza o jogo se a resposta for errada
        }
    } catch (error) {
        console.error("Erro ao validar resposta:", error);
    }
  };

  // Reiniciar o jogo
  const restartGame = () => {
    setScreen("start");
    setScore(0);
    setQuestion(null);
  };

  return (
    <div className="app">
      {screen === "start" && <StartScreen onStart={startGame} />}
      {screen === "game" && (
        <>
          {loading ? (
            <p>Carregando pergunta...</p>
          ) : question ? (
            <GameScreen question={question} onAnswer={handleAnswer} score={score} />
          ) : (
            <p>Erro ao carregar pergunta. Tente novamente.</p>
          )}
        </>
      )}
      {screen === "end" && <EndScreen score={score} onRestart={restartGame} />}
    </div>
  );
};

export default App;
