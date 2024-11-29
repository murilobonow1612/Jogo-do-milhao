import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'


const app = express()
app.use(express.json())
app.use(cors())

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ajuste conforme suas credenciais
  password: '1234', // Ajuste conforme sua senha
  database: 'jogo_do_milhao',
});

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err)
    return;
  }
  console.log('Conectado ao MySQL')
});

// Endpoint para retornar perguntas
app.get('/api/questions', (req, res) => {
  const query = 'SELECT * FROM perguntas'
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar perguntas:', err);
      res.status(500).json({ error: 'Erro ao buscar perguntas' })
      return;
    }
    res.status(200).json(results)
  })
})

app.listen(3001, () => {
  console.log(`Servidor rodando na porta 3001`)
})
