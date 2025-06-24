const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const dataPath = path.join(__dirname, 'data', 'contas.json');

app.use(express.static('public'));       
app.use(express.json());                 

app.get('/api/contas', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler contas:', err);
      return res.status(500).send('Erro ao ler contas');
    }
    res.json(JSON.parse(data || '[]'));
  });
});

app.post('/api/contas', (req, res) => {
  fs.writeFile(dataPath, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      console.error('Erro ao salvar contas:', err);
      return res.status(500).send('Erro ao salvar');
    }
    res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
});
