const express = require('express');
const bodyParser = require('body-parser');
const cassandraClient = require('./cassandra-config');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Listar todas as profissionais
app.get('/professionals', async (req, res) => {
  try {
    const result = await cassandraClient.execute('SELECT * FROM professionals_woman');
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Adicionar uma nova profissional
app.post('/professionals', async (req, res) => {
  const { name, birth, country, area, contribution } = req.body;

  if (!name || !birth || !country || !area || !contribution) {
    return res.status(400).send('Todos os campos são obrigatórios');
  }

  const id = uuidv4(); 

  try {
    await cassandraClient.execute(
      'INSERT INTO professionals_woman (id, name, birth, country, area, contribution) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, birth, country, area, contribution],
      { prepare: true }
    );
    res.status(201).send(`Profissional ${name} adicionada com ID ${id}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Atualizar uma profissional por ID
app.put('/professionals/:id', async (req, res) => {
  const { id } = req.params;
  const { name, birth, country, area, contribution } = req.body;

  if (!name || !birth || !country || !area || !contribution) {
    return res.status(400).send('Todos os campos são obrigatórios');
  }

  try {
    await cassandraClient.execute(
      'UPDATE professionals_woman SET name = ?, birth = ?, country = ?, area = ?, contribution = ? WHERE id = ?',
      [name, birth, country, area, contribution, id],
      { prepare: true }
    );
    res.status(200).send(`Profissional ${id} atualizada com sucesso`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Excluir uma profissional por ID
app.delete('/professionals/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await cassandraClient.execute(
      'DELETE FROM professionals_woman WHERE id = ?',
      [id],
      { prepare: true }
    );
    res.status(200).send(`Profissional ${id} deletada com sucesso`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
