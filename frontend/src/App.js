import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
import backgroundImage from './assets/A.png';
import backgroundMusic from './assets/music.mp3'; // Importe o arquivo de música

// Tela inicial
const StartScreen = ({ onStart }) => (
  <div className="start-screen" style={{ backgroundImage: `url(${backgroundImage})` }}>
    <h1 style={{ color: "gold", textStroke: "2px black" }}>SHOW DO MILHÃO</h1>
    <button onClick={onStart}>Iniciar Jogo</button>
  </div>
);

// Tela de jogo
const GameScreen = ({ question, onAnswer, score, difficulty }) => (
  <div className="game-screen">
    <h2>{question.pergunta}</h2>
    <p>Dificuldade: {difficulty}</p> {/* Exibe a dificuldade */}
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
    <h2>Parabéns! Você acaba de ganhar 1 milhão de reais!</h2>
    <h2>Pontuação Final: {score}</h2>
    <button onClick={onRestart}>Reiniciar Jogo</button>
  </div>
);

const App = () => {
  const [screen, setScreen] = useState("start");
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(null);
  const [usedQuestions, setUsedQuestions] = useState({ easy: [], medium: [], hard: [] }); // Perguntas usadas por dificuldade
  const [difficulty, setDifficulty] = useState(""); // Estado para armazenar a dificuldade da pergunta
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.createRef();

  // Iniciar o jogo
  const startGame = () => {
    setScreen("game");
    setScore(0);
    setUsedQuestions({ easy: [], medium: [], hard: [] }); // Limpar as perguntas usadas ao reiniciar
    fetchQuestion(); // Buscar a primeira pergunta
    audioRef.current.play(); // Começa a música quando o jogo inicia
    setIsPlaying(true); // Atualiza o estado da música
  };

  // Função para definir a pontuação conforme o nível de dificuldade
  const getPointsForDifficulty = (difficulty) => {
    switch (difficulty) {
      case "facil":
        return 10; // Fácil: 10 pontos
      case "medio":
        return 20; // Médio: 20 pontos
      case "dificil":
        return 30; // Difícil: 30 pontos
      default:
        return 0; // Se não for nenhum dos casos
    }
  };

  // Buscar uma pergunta da API
  const fetchQuestion = async () => {
    try {
      console.log("Buscando pergunta...");
      const response = await axios.get("http://localhost:3001/api/questions");

      // Dividir as perguntas por nível de dificuldade
      const easyQuestions = response.data.filter(q => q.nivel === 'facil' && !usedQuestions.easy.includes(q.id));
      const mediumQuestions = response.data.filter(q => q.nivel === 'medio' && !usedQuestions.medium.includes(q.id));
      const hardQuestions = response.data.filter(q => q.nivel === 'dificil' && !usedQuestions.hard.includes(q.id));

      console.log("Perguntas fáceis disponíveis:", easyQuestions);
      console.log("Perguntas médias disponíveis:", mediumQuestions);
      console.log("Perguntas difíceis disponíveis:", hardQuestions);

      // Verificar se temos perguntas para o próximo nível
      if (easyQuestions.length === 0 && mediumQuestions.length === 0 && hardQuestions.length === 0) {
        setScreen("end"); // Se não houverem mais perguntas, o jogo acaba
        return;
      }

      let selectedQuestion;

      // Priorizar perguntas fáceis, depois médias e difíceis
      if (easyQuestions.length > 0) {
        selectedQuestion = easyQuestions[Math.floor(Math.random() * easyQuestions.length)];
        setUsedQuestions(prev => ({ ...prev, easy: [...prev.easy, selectedQuestion.id] }));
      } else if (mediumQuestions.length > 0) {
        selectedQuestion = mediumQuestions[Math.floor(Math.random() * mediumQuestions.length)];
        setUsedQuestions(prev => ({ ...prev, medium: [...prev.medium, selectedQuestion.id] }));
      } else if (hardQuestions.length > 0) {
        selectedQuestion = hardQuestions[Math.floor(Math.random() * hardQuestions.length)];
        setUsedQuestions(prev => ({ ...prev, hard: [...prev.hard, selectedQuestion.id] }));
      }

      console.log("Pergunta escolhida:", selectedQuestion);

      // Formatar a pergunta
      const formattedQuestion = {
        pergunta: selectedQuestion.pergunta,
        alternativas: [
          { label: "A", texto: selectedQuestion.alternativa_a },
          { label: "B", texto: selectedQuestion.alternativa_b },
          { label: "C", texto: selectedQuestion.alternativa_c },
          { label: "D", texto: selectedQuestion.alternativa_d }
        ],
        correta: selectedQuestion.alternativa_correta,
        id: selectedQuestion.id,
        nivel: selectedQuestion.nivel,
        pontos: getPointsForDifficulty(selectedQuestion.nivel) // Atribui os pontos baseados no nível de dificuldade
      };

      setDifficulty(selectedQuestion.nivel); // Atualiza a dificuldade
      setQuestion(formattedQuestion); // Atualiza a pergunta
    } catch (error) {
      console.error("Erro ao buscar pergunta:", error);
    }
  };

  // Lidar com a resposta
  const handleAnswer = async (answer) => {
    try {
      console.log("Validando resposta...");
      const isCorrect = answer === question.correta; // Compara o rótulo selecionado com a correta

      if (isCorrect) {
        setScore(score + question.pontos); // Adiciona os pontos da pergunta
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
    setUsedQuestions({ easy: [], medium: [], hard: [] }); // Limpar as perguntas usadas
    setQuestion(null);
    audioRef.current.pause(); // Pausa a música quando o jogo for reiniciado
    audioRef.current.currentTime = 0; // Reseta o tempo da música para o início
    setIsPlaying(false); // Atualiza o estado da música
  };

  // Função para alternar a música
  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="app">
      {/* Audio player */}
      <audio ref={audioRef} loop>
        <source src={backgroundMusic} type="audio/mp3" />
        Seu navegador não suporta a tag de áudio.
      </audio>
      {/* Botão para alternar a música */}
      <button onClick={toggleMusic}>
        {isPlaying ? "Parar Música" : "Tocar Música"}
      </button>

      {screen === "start" && <StartScreen onStart={startGame} />}
      {screen === "game" && (
        <>
          {question ? (
            <GameScreen question={question} onAnswer={handleAnswer} score={score} difficulty={difficulty} />
          ) : (
            <p>Carregando pergunta...</p>
          )}
        </>
      )}
      {screen === "end" && <EndScreen score={score} onRestart={restartGame} />}
    </div>
  );
};

export default App;
