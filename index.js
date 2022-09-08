const express = require('express');
const mongoose = require('mongoose');
const expressValidator = require('express-validator')
const cookieParser = require('cookie-parser')


//Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products')

//Config App
require('dotenv').config();
const app = express();

//Db mongoDB
mongoose.connect(process.env.DATABASE)
.then(() => console.log('db connected'))
.catch(() => console.log('not nonnect to the database !'))

//Middlewares
app.use(express.json())
app.use(expressValidator())
app.use(cookieParser())

//Routes Middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);


const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`app is running on port ${port}`));