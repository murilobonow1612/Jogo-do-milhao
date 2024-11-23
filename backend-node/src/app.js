const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const questionRoutes = require('./routes/questionRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/question', questionRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor Node.js rodando na porta ${PORT}`));