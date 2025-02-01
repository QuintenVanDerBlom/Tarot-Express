import express from 'express';
import mongoose from "mongoose";
import tarotRouter from './routers/tarotRouter.js';
import router from "./routers/tarotRouter.js";

const app = express();

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next();
});
app.options('/tarots', (req, res) => {
    res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.status(204).end();
});
app.options('/tarots/:id', (req, res) => {
    res.header('Allow', 'GET, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, PATCH, OPTIONS');
    res.status(204).end();
});
app.use('/tarots', tarotRouter);

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});