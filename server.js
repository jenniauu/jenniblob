const express = require('express');
const { put, list, del } = require('@vercel/blob');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.use(express.json()); 

app.post('/api/upload', async (req, res) => {
  const filename = req.headers['x-vercel-filename'];

  if (!filename) {
    return res.status(400).json({ message: 'O nome do arquivo é obrigatório no cabeçalho x-vercel-filename.' });
  }

  try {
    const blob = await put(filename, req, {
      access: 'public',
    });

    res.status(200).json(blob);

  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ message: 'Erro ao fazer upload do arquivo.', error: error.message });
  }
});

app.get('/api/files', async (req, res) => {
  try {
    const { blobs } = await list();
    res.status(200).json(blobs);
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    res.status(500).json({ message: 'Erro ao buscar a lista de arquivos.', error: error.message });
  }
});

app.delete('/api/delete', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'URL da imagem é obrigatória.' });
    }

    await del(url);
    res.status(200).json({ message: 'Imagem deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    res.status(500).json({ message: 'Erro ao deletar a imagem.', error: error.message });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});