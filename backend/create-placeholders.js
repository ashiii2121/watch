const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create placeholder images
const placeholders = [
    { name: 'richard.jpg', text: 'Richard Mille' },
    { name: 'pat.jpg', text: 'Patek Philippe' },
    { name: 'rolex.jpg', text: 'Rolex' },
    { name: 'richard.png', text: 'Richard Mille' },
    { name: 'patek.png', text: 'Patek Philippe' },
    { name: 'rolex.png', text: 'Rolex' },
    { name: 'richard1.png', text: 'Richard Mille' },
    { name: 'richard2.png', text: 'Richard Mille' },
    { name: 'patek1.png', text: 'Patek Philippe' },
    { name: 'rolex1.png', text: 'Rolex' }
];

// Create the images directory if it doesn't exist
const imgDir = path.join(__dirname, 'img');
if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir);
}

// Create placeholder images
placeholders.forEach(placeholder => {
    // Create a canvas
    const canvas = createCanvas(300, 200);
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 300, 200);

    // Draw border
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 300, 200);

    // Draw text
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(placeholder.text, 150, 90);

    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.fillText('Placeholder Image', 150, 120);

    // Save to file
    const filePath = path.join(imgDir, placeholder.name);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, buffer);

    console.log(`Created placeholder: ${filePath}`);
});

console.log('All placeholders created successfully!');