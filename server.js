import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import fs from 'fs';
import qr from 'qr-image';

// Simulate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to parse URL-encoded and JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to generate QR code
app.post('/generate-qr', (req, res) => {
  const { url, imageName } = req.body;

  if (!url || !imageName) {
    return res.status(400).json({ error: 'URL and image name are required.' });
  }

  // Generate the QR code
  const qr_svg = qr.image(url, { type: 'png' });
  
  // Define the output file path
  const outputFilePath = path.join(__dirname, 'public', 'qr_images', `${imageName}.png`);

  // Ensure the directory exists
  fs.mkdirSync(path.join(__dirname, 'public', 'qr_images'), { recursive: true });

  // Save the QR code image
  qr_svg.pipe(fs.createWriteStream(outputFilePath));

  // Respond with the path to the generated QR code image
  qr_svg.on('end', () => {
    res.json({ success: true, filePath: `/qr_images/${imageName}.png` });
  });
});

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
