require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/routes.js');

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASS}@urlcluster.bvhwg.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`);


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/', routes);

app.listen(process.env.PORT);