const express = require('express');
const mongoose = require('mongoose');
const expressValidator = require('express-validator')
const cookieParser = require('cookie-parser')
const cors = require('cors')


//Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart')
const fileStorageRoutes = require('./routes/filesStorage');
const braintreeRoutes = require('./routes/braintree');
const orderRoutes = require('./routes/order');
const statisticsRoutes = require('./routes/statistics')
const ip = require('request-ip');

//Config App
require('dotenv').config();
const app = express();

//Db mongoDB
mongoose.connect(process.env.DATABASE)
.then(() => console.log('db connected'))
.catch(() => console.log('not nonnect to the database !'))

//Middleware
app.use(express.json({limit: '50mb'}))
app.use(expressValidator())
app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({limit: '50mb',extended: 'true'}));
app.use(ip.mw());

//Routes Middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/braintree', braintreeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/file-storage',fileStorageRoutes);
app.use('/api/statistics', statisticsRoutes)

app.get('/api/sse', (req, res) => {
    res.setHeader('Content-Type','text/event-stream');
    res.setHeader('Cache-Control','no-cache');
    res.setHeader('Connection','keep-alive');

    const listener = (event) => {
        const data = JSON.stringify({message: 'you have a new order'});
        res.write(`data: ${data}\n\n`);
    }

    app.on('new-order', listener)

    req.on('close', () => {
        app.off('new-order', listener)
    })
})

const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`app is running on port ${port}`));