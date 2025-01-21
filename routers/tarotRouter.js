import express from 'express';
import { faker } from '@faker-js/faker';
import Tarot from '../models/Tarot.js'
import mongoose from "mongoose";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use((req, res, next) => {
    const acceptHeader = req.get('Accept');
    if (acceptHeader && acceptHeader !== 'application/json') {
        return res.status(406).json({
            error: 'Only "application/json" is supported.'
        });
    }
    next();
});

router.use((req, res, next) => {
    res.setHeader('Accept', 'application/json');
    next();
});

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

router.options('/', (req, res) => {
    res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.status(204).end();
});

router.options('/:id', (req, res) => {
    res.header('Allow', 'GET, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, PATCH, OPTIONS');
    res.status(204).end();
});

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        const totalItems = await Tarot.countDocuments();
        let totalPages = 1;

        if (limit) {
            totalPages = Math.ceil(totalItems / limit);
        }

        const tarots = await Tarot.find()
            .skip((page - 1) * (limit || totalItems))
            .limit(limit || totalItems);

        res.status(200).json({
            items: tarots,
            _links: {
                self: {
                    href: `http://145.24.223.42:8001/tarots/`
                }
            },
            pagination: {
                currentPage: page,
                currentItems: tarots.length,
                totalPages: totalPages,
                totalItems: totalItems,
                _links: {
                    first: {
                        page: 1,
                        href: `http://145.24.223.42:8001/tarots?page=1&limit=${limit || totalItems}`
                    },
                    last: {
                        page: totalPages,
                        href: `http://145.24.223.42:8001/tarots?page=${totalPages}&limit=${limit || totalItems}`
                    },
                    previous: page > 1 ? {
                        page: page - 1,
                        href: `http://145.24.223.42:8001/tarots?page=${page - 1}&limit=${limit || totalItems}`
                    } : null,
                    next: page < totalPages ? {
                        page: page + 1,
                        href: `http://145.24.223.42:8001/tarots?page=${page + 1}&limit=${limit || totalItems}`
                    } : null
                }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tarot cards.' });
    }
});




router.post('/seed', async (req, res) => {
    try {
        const amount = parseInt(req.body.amount, 10) || 10;
        const reset = req.body.reset || false;
        if (reset) {
            await Tarot.deleteMany({});
            console.log('Database cleared.');
        }

        const fakeCards = Array.from({ length: amount }, () => {
            const arcana = faker.helpers.arrayElement(['Major', 'Minor']);
            const card = {
                arcana,
                title: '',
                suit: null,
                number: null,
                description: faker.lorem.sentences(2),
                image_url: null,
            };

            // Voor het specifiek maken van de Arcana's, beide Major en Minor.
            if (arcana === 'Major') {
                card.title = faker.helpers.arrayElement([
                    'The Fool', 'The Magician', 'The High Priestess', 'The Empress',
                    'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot',
                    'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice', 'The Hanged Man',
                    'Death', 'Temperance', 'The Devil', 'The Tower', 'The Star',
                    'The Moon', 'The Sun', 'Judgment', 'The World',
                ]);
                card.number = faker.helpers.rangeToNumber({ min: 0, max: 21 });
            } else {
                card.suit = faker.helpers.arrayElement(['Cups', 'Wands', 'Swords', 'Pentacles']);
                card.number = faker.helpers.rangeToNumber({ min: 1, max: 14 });
                card.title = `${card.number} of ${card.suit}`;
            }
            return card;
        });
        await Tarot.insertMany(fakeCards);

        res.status(201).json({ message: `Seeded ${amount} Tarot cards.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to seed Tarot cards.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const tarotId = req.params.id;
        const tarot = await Tarot.findById(tarotId);
        if (!tarot) {
            return res.status(404).json({ error: 'Tarot card not found' });
        }

        res.status(200).json({
            ...tarot.toObject(),
            _links: {
                self: {
                    href: `http://145.24.223.42:8001/tarots/${tarotId}`
                },
                collection: {
                    href: `http://145.24.223.42:8001/tarots`
                }
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch Tarot card' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const tarotId = req.params.id;
        const updatedTarot = req.body;

        const tarot = await Tarot.findById(tarotId);
        if (!tarot) {
            return res.status(404).send();
        }

        const result = await Tarot.findByIdAndUpdate(tarotId, updatedTarot, { new: true , runValidators: true});

        if (!result) {
            return res.status(400).json({ error: 'Failed to update tarot card' });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to update tarot card' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const tarotId = req.params.id;

        const tarot = await Tarot.findById(tarotId);
        if (!tarot) {
            return res.status(404).json({ error: 'Tarot card not found' });
        }

        await Tarot.findByIdAndDelete(tarotId);
        res.status(204).json({ message: 'Tarot deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete Tarot' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, arcana, description } = req.body;

        if (!title || !arcana || !description) {
            return res.status(400).send("");
        }

        const newTarot = new Tarot({ title, arcana, description });
        await newTarot.save();

        const responseTarot = newTarot.toJSON();

        res.status(201).json(responseTarot);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create Tarot card' });
    }
});

export default router;
