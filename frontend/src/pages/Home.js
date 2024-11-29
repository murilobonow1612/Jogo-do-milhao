import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bem-vindo ao Jogo do Milhão!</h1>
      <Link to="/game">
        <button>Iniciar Jogo</button>
      </Link>
    </div>
  );
};

export default Home;