import express from 'express';
import { faker } from '@faker-js/faker';
import Tarot from '../models/Tarot.js'

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

const cardImageUrls = {
    "The Fool": "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
    "The Magician": "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
    "The High Priestess": "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_02_High_Priestess.jpg",
    "The Empress": "https://upload.wikimedia.org/wikipedia/commons/6/6d/RWS_Tarot_03_Empress.jpg",
    "The Emperor": "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_04_Emperor.jpg",
    "The Hierophant": "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
    "The Lovers": "https://upload.wikimedia.org/wikipedia/commons/3/3a/RWS_Tarot_06_Lovers.jpg",
    "The Chariot": "https://upload.wikimedia.org/wikipedia/commons/3/3a/RWS_Tarot_07_Chariot.jpg",
    "Strength": "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg",
    "The Hermit": "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg",
    "Wheel of Fortune": "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
    "Justice": "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg",
    "The Hanged Man": "https://upload.wikimedia.org/wikipedia/commons/2/2f/RWS_Tarot_12_Hanged_Man.jpg",
    "Death": "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg",
    "Temperance": "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg",
    "The Devil": "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg",
    "The Tower": "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg",
    "The Star": "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg",
    "The Moon": "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg",
    "The Sun": "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg",
    "Judgment": "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg",
    "The World": "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg",

    "Ace of Cups": "https://upload.wikimedia.org/wikipedia/commons/3/36/Cups01.jpg",
    "2 of Cups": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Cups02.jpg",
    "3 of Cups": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cups03.jpg",
    "4 of Cups": "https://upload.wikimedia.org/wikipedia/commons/3/35/Cups04.jpg",
    "5 of Cups": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Cups05.jpg",
    "6 of Cups": "https://upload.wikimedia.org/wikipedia/commons/1/17/Cups06.jpg",
    "7 of Cups": "https://upload.wikimedia.org/wikipedia/commons/8/8d/Cups07.jpg",
    "8 of Cups": "https://upload.wikimedia.org/wikipedia/commons/8/84/Cups08.jpg",
    "9 of Cups": "https://upload.wikimedia.org/wikipedia/commons/3/3f/Cups09.jpg",
    "10 of Cups": "https://upload.wikimedia.org/wikipedia/commons/8/84/Cups10.jpg",
    "Page of Cups": "https://upload.wikimedia.org/wikipedia/commons/6/60/Cups11.jpg",
    "Knight of Cups": "https://upload.wikimedia.org/wikipedia/commons/4/42/Cups12.jpg",
    "Queen of Cups": "https://upload.wikimedia.org/wikipedia/commons/4/42/Cups13.jpg",
    "King of Cups": "https://upload.wikimedia.org/wikipedia/commons/c/c3/Cups14.jpg",

    "Ace of Wands": "https://upload.wikimedia.org/wikipedia/commons/1/11/Wands01.jpg",
    "2 of Wands": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Wands02.jpg",
    "3 of Wands": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Wands03.jpg",
    "4 of Wands": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Wands04.jpg",
    "5 of Wands": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Wands05.jpg",
    "6 of Wands": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Wands06.jpg",
    "7 of Wands": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Wands07.jpg",
    "8 of Wands": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Wands08.jpg",
    "9 of Wands": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Wands09.jpg",
    "10 of Wands": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Wands10.jpg",

    "Ace of Swords": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Swords01.jpg",
    "2 of Swords": "https://upload.wikimedia.org/wikipedia/commons/9/9e/Swords02.jpg",
    "3 of Swords": "https://upload.wikimedia.org/wikipedia/commons/0/02/Swords03.jpg",
    "4 of Swords": "https://upload.wikimedia.org/wikipedia/commons/b/bf/Swords04.jpg",
    "5 of Swords": "https://upload.wikimedia.org/wikipedia/commons/2/29/Swords05.jpg",
    "6 of Swords": "https://upload.wikimedia.org/wikipedia/commons/2/22/Swords06.jpg",
    "7 of Swords": "https://upload.wikimedia.org/wikipedia/commons/3/34/Swords07.jpg",
    "8 of Swords": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Swords08.jpg",
    "9 of Swords": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Swords09.jpg",
    "10 of Swords": "https://upload.wikimedia.org/wikipedia/commons/3/30/Swords10.jpg",

    "Ace of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Pentacles01.jpg",
    "2 of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Pentacles02.jpg",
    "3 of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Pentacles03.jpg"
};
const tarotDescriptions = {
    // Major Arcana
    'The Fool': 'A card of new beginnings, optimism, and taking a leap of faith.',
    'The Magician': 'Represents manifestation, resourcefulness, and power.',
    'The High Priestess': 'Symbolizes intuition, mystery, and inner wisdom.',
    'The Empress': 'Associated with fertility, nurturing, and abundance.',
    'The Emperor': 'Represents structure, authority, and stability.',
    'The Hierophant': 'Symbolizes tradition, spiritual guidance, and wisdom.',
    'The Lovers': 'Represents relationships, choices, and harmony.',
    'The Chariot': 'A sign of determination, willpower, and victory.',
    'Strength': 'Represents courage, inner strength, and resilience.',
    'The Hermit': 'Symbolizes introspection, solitude, and inner guidance.',
    'Wheel of Fortune': 'Represents cycles, luck, and fate.',
    'Justice': 'A card of fairness, truth, and law.',
    'The Hanged Man': 'Symbolizes surrender, new perspectives, and patience.',
    'Death': 'Represents transformation, endings, and new beginnings.',
    'Temperance': 'A sign of balance, moderation, and patience.',
    'The Devil': 'Symbolizes addiction, materialism, and temptation.',
    'The Tower': 'A card of sudden upheaval and revelation.',
    'The Star': 'Represents hope, inspiration, and serenity.',
    'The Moon': 'Symbolizes illusions, intuition, and the subconscious.',
    'The Sun': 'Represents joy, success, and vitality.',
    'Judgment': 'A card of rebirth, reflection, and awakening.',
    'The World': 'Symbolizes completion, fulfillment, and wholeness.',

    // Minor Arcana: Cups
    'Ace of Cups': 'A symbol of love, new relationships, and emotional renewal.',
    '2 of Cups': 'Represents connection, unity, and mutual love.',
    '3 of Cups': 'A sign of celebration, friendship, and joy.',
    '4 of Cups': 'Indicates contemplation, dissatisfaction, and re-evaluation.',
    '5 of Cups': 'Symbolizes grief, loss, and emotional setbacks.',
    '6 of Cups': 'A reminder of nostalgia, childhood, and past influences.',
    '7 of Cups': 'Represents choices, illusions, and wishful thinking.',
    '8 of Cups': 'A sign of walking away, searching for deeper meaning.',
    '9 of Cups': 'Symbolizes emotional fulfillment and wishes coming true.',
    '10 of Cups': 'Represents happiness, family, and emotional completion.',
    'Page of Cups': 'A message of creativity, intuition, and emotional discovery.',
    'Knight of Cups': 'Symbolizes romance, charm, and following the heart.',
    'Queen of Cups': 'Represents compassion, intuition, and emotional depth.',
    'King of Cups': 'Symbolizes emotional balance, control, and generosity.',

    // Minor Arcana: Wands
    'Ace of Wands': 'A card of inspiration, creativity, and new opportunities.',
    '2 of Wands': 'Represents planning, future goals, and personal power.',
    '3 of Wands': 'A sign of expansion, foresight, and progress.',
    '4 of Wands': 'Symbolizes celebration, homecoming, and harmony.',
    '5 of Wands': 'Represents conflict, competition, and disagreements.',
    '6 of Wands': 'A card of success, recognition, and public acclaim.',
    '7 of Wands': 'Symbolizes defense, perseverance, and standing ground.',
    '8 of Wands': 'A sign of rapid movement, progress, and travel.',
    '9 of Wands': 'Represents resilience, courage, and persistence.',
    '10 of Wands': 'A card of burden, stress, and responsibility.',
    'Page of Wands': 'Symbolizes enthusiasm, discovery, and new ventures.',
    'Knight of Wands': 'Represents passion, adventure, and impulsiveness.',
    'Queen of Wands': 'A sign of confidence, independence, and charisma.',
    'King of Wands': 'Symbolizes leadership, vision, and determination.',

    // Minor Arcana: Swords
    'Ace of Swords': 'A symbol of clarity, truth, and breakthroughs.',
    '2 of Swords': 'Represents difficult choices and indecision.',
    '3 of Swords': 'A sign of heartbreak, sorrow, and emotional pain.',
    '4 of Swords': 'Symbolizes rest, recovery, and contemplation.',
    '5 of Swords': 'Represents conflict, defeat, and discord.',
    '6 of Swords': 'A card of transition, moving forward, and healing.',
    '7 of Swords': 'Symbolizes deception, strategy, and cunning.',
    '8 of Swords': 'A sign of restriction, fear, and self-doubt.',
    '9 of Swords': 'Represents anxiety, nightmares, and mental distress.',
    '10 of Swords': 'A card of endings, betrayal, and suffering.',
    'Page of Swords': 'Symbolizes curiosity, new ideas, and vigilance.',
    'Knight of Swords': 'Represents ambition, drive, and swift action.',
    'Queen of Swords': 'A sign of intelligence, independence, and sharp wit.',
    'King of Swords': 'Symbolizes authority, logic, and clear thinking.',

    // Minor Arcana: Pentacles
    'Ace of Pentacles': 'A card of prosperity, opportunities, and material success.',
    '2 of Pentacles': 'Represents balance, multitasking, and adaptability.',
    '3 of Pentacles': 'A sign of teamwork, collaboration, and skill.',
    '4 of Pentacles': 'Symbolizes stability, control, and security.',
    '5 of Pentacles': 'Represents financial hardship and insecurity.',
    '6 of Pentacles': 'A card of generosity, charity, and giving.',
    '7 of Pentacles': 'Symbolizes patience, investment, and long-term growth.',
    '8 of Pentacles': 'A sign of craftsmanship, mastery, and dedication.',
    '9 of Pentacles': 'Represents luxury, self-sufficiency, and success.',
    '10 of Pentacles': 'A card of wealth, family, and long-term security.',
    'Page of Pentacles': 'Symbolizes ambition, learning, and opportunity.',
    'Knight of Pentacles': 'Represents diligence, hard work, and responsibility.',
    'Queen of Pentacles': 'A sign of abundance, nurturing, and financial security.',
    'King of Pentacles': 'Symbolizes leadership, success, and stability.'
};
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
                description: '',
                image_url: null,
            };
            card.title = faker.helpers.arrayElement(Object.keys(tarotDescriptions));
            card.description = tarotDescriptions[card.title];
            card.image_url = cardImageUrls[card.title] || 'https://example.com/images/default.jpg';
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
        res.status(404).json({ error: 'Failed to fetch Tarot card' });
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
        const { title, arcana, description, suit, number, image_url } = req.body;
        if (!title || !arcana || !description) {
            return res.status(400).json({ error: "Title, Arcana, and Description are required." });
        }
        const newTarot = new Tarot({
            title,
            arcana,
            description,
            suit: suit || null,
            number: number !== "" ? number : null,
            image_url: image_url || null
        });
        await newTarot.save();
        res.status(201).json(newTarot.toJSON());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create Tarot card' });
    }
});


export default router;
