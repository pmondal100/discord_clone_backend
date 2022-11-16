import express from 'express';
import { Application } from 'express';
import * as dotenv from 'dotenv'
import mongoose from 'mongoose';
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
dotenv.config()

const app: Application = express();

app.use(cors());
app.use('/auth', authRoutes);

let mongo_uri: string = process.env.MONGO_URI || '';

mongoose.connect(mongo_uri).then(() => {
    app.listen(process.env.API_PORT, () : void => {
        console.log('Server is running on port: ' + process.env.API_PORT)
    });
}).catch(err => {
    console.error(err);
})
