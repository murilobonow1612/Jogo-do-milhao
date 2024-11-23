const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'jogo_do_milhao',
});

db.connect();

exports.getQuestion = (req, res) => {
  const query = 'SELECT * FROM perguntas ORDER BY RAND() LIMIT 1';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
};

exports.validateAnswer = (req, res) => {
  const { id, answer } = req.body;
  const query = 'SELECT * FROM perguntas WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    const correct = results[0].correta === answer;
    res.json({ correct, points: correct ? results[0].pontos : 0 });
  });
};