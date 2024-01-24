const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const Image = require('../models/imageModel');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), (req, res) => {
    if(!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // OCR: Process the file using Tesseract.js
    Tesseract.recognize(
        `./uploads/${req.file.filename}`,
        'eng',
        { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        const boldWords = [];

        const imagePath = path.join(__dirname, '../uploads', req.file.filename);
        const base64Image = fs.readFileSync(imagePath, 'base64');

        text = extracted_text.replace(/^o\n\n/, '');
        text = text.replace(/\r\n|\n|\r/g, " "); // Replace all newlines and carriage returns with spaces
        text = text.replace(/\s+/g, " ");        // Replace multiple spaces with a single space

        const newImage = new Image({
            originalName: req.file.originalname,
            filename: req.file.filename,
            extractedText: text,
            boldWords: boldWords,
            base64: base64Image
        });
        
        newImage.save()
            .then((savedImage) => {
                res.status(200).json({
                    message: 'File uploaded and processed successfully.',
                    imageData: savedImage
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Error saving image data to database' });
            });

    }).catch(err => {
        res.status(500).json({ message: 'Error processing image with OCR', err });
    });
});

// Retrieve all images
router.get('/images', async (req, res) => {
    try {
        const images = await Image.find({});
        res.status(200).json(images);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving images' });
    }
});

// Retrieve a specific image by ID
router.get('/images/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).send({ message: 'Image not found' });
        }
        res.status(200).json(image);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving image' });
    }
});

module.exports = router;
