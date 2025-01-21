import express from 'express';
import mongoose from "mongoose";
import tarotRouter from './routers/tarotRouter.js';

const app = express();

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/tarots', tarotRouter);

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});