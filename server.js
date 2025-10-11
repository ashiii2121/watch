const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));

const configPath = path.join(__dirname, 'config.json');
if (!fs.existsSync(configPath)) {
  fs.writeJsonSync(configPath, { /* your initial config here */ });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const section = req.body.section;
    if (section === 'hero' && file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else if (section !== 'hero' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

app.get('/api/config', (req, res) => {
  const config = fs.readJsonSync(configPath);
  res.json(config);
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  const { section, subpage, index } = req.body;
  const newPath = `uploads/${req.file.filename}`;
  const config = fs.readJsonSync(configPath);

  if (section === 'hero') {
    config.hero[parseInt(index)] = newPath;
  } else if (section === 'featured') {
    config.featured[subpage] = newPath;
  } else if (section === 'subpages') {
    config.subpages[subpage][parseInt(index)] = newPath;
  }

  fs.writeJsonSync(configPath, config);
  res.json({ success: true, message: 'File uploaded!' });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});