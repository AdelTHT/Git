const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Sert dist/ si présent (build), sinon src/ en dev
const distDir = path.join(__dirname, 'dist');
const srcDir  = path.join(__dirname, 'src');
const staticDir = fs.existsSync(distDir) ? distDir : srcDir;

app.use(express.static(staticDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), version: '1.0.0' });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port} (static: ${staticDir})`);
});
