const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const urlModel = require('../schemas/urlSchema.js');

router.post('/create-short-url',
    body('longUrl').isURL({ require_protocol: true }),
    async (req, res) => {
        const errors = validationResult(req);
        try {
            if (!(errors.isEmpty())) {
                throw new Error('Invalid URL');
            }

            const newUrl = new urlModel({ originalUrl: req.body.longUrl });
            //await urlModel.create({ originalUrl: req.body.longUrl });
            await newUrl.save();
            res.status(200);
            res.json({ message: 'Short Url Created Succesfully', shortUrl: newUrl.shortUrl },);
        }
        catch (e) {
            res.status(400);
            res.json({ error: e.message });
        }
    });



router.delete('/:shortUrl', async (req, res) => {
    const shortUrlParam = req.params.shortUrl;

    try {
        const url = await urlModel.findOne({ shortUrl: shortUrlParam });

        if (!(url)) {
            throw new Error('Url not found');
        }
        await urlModel.deleteOne({ shortUrl: shortUrlParam });
        res.json({ message: 'Link Deleted Succesfully' });
    }
    catch (e) {
        res.status(400);
        res.json({ error: e.message });
    }
})

router.patch('/:shortUrl',
    body('newLongUrl').isURL({ require_protocol: true }),
    async (req, res) => {
        const errors = validationResult(req);
        const shortUrlParam = req.params.shortUrl;
        try {
            if (!(errors.isEmpty())) {
                throw new Error('Invalid URL');
            }

            const collection = await urlModel.findOne({ shortUrl: shortUrlParam });

            if (!(collection)) {
                throw new Error('Url not found');
            }

            collection.originalUrl = req.body.newLongUrl;

            await collection.save();

            res.status(200);
            res.json({ message: 'Url updated succesfully' });
        }
        catch (e) {
            res.status(400);
            res.json({ error: e.message });
        }
    });

router.get('/all-urls', async (req, res) => {
    try {
        let allUrls = await urlModel.find();

        if (!(allUrls)) {
            throw new Error('No URLs Found')
        }

        res.status(200);
        res.json(allUrls);
    }
    catch (e) {
        res.status(400);
        res.json({ error: e.message });
    }
});

router.get('/:shortUrl', async (req, res) => {
    const shortUrlParam = req.params.shortUrl;
    try {
        const collection = await urlModel.findOne({ shortUrl: shortUrlParam });
        if (!(collection)) {
            throw new Error('Url not found (S)');
        }
        collection.totalClicks++;
        collection.save();
        res.redirect(collection.originalUrl);
    }
    catch (e) {
        res.status(400);
        res.json({ error: e.message });
    }
});




module.exports = router;