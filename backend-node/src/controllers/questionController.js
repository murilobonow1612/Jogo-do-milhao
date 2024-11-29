import mysql from 'mysql2';

// Criação da conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234', // Certifique-se de que a senha está correta
  database: 'jogo_do_milhao',
});

// Estabelecendo a conexão
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

// Rota para pegar uma pergunta aleatória
exports.getQuestion = (req, res) => {
  const query = `
    SELECT * FROM perguntas 
    ORDER BY FIELD(nivel, 'facil', 'medio', 'dificil'), pontos DESC 
    LIMIT 1`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);  // Retorna a pergunta aleatória
  });
};

// Rota para validar a resposta do jogador
exports.validateAnswer = (req, res) => {
  const { id, answer } = req.body;
  const query = 'SELECT * FROM perguntas WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    const correct = results[0].correta === answer;  // Verifica se a resposta está correta
    res.json({ correct, points: correct ? results[0].pontos : 0 });  // Retorna se a resposta está certa e os pontos
  });
};
