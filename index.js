const express = require('express');
const mongoose = require('mongoose');
const expressValidator = require('express-validator')
const cookieParser = require('cookie-parser')
const cors = require('cors')


//Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products')
const fileStorageRoutes = require('./routes/filesStorage')

//Config App
require('dotenv').config();
const app = express();

//Db mongoDB
mongoose.connect(process.env.DATABASE)
.then(() => console.log('db connected'))
.catch(() => console.log('not nonnect to the database !'))

//Middlewares
app.use(express.json({limit: '50mb'}))
app.use(expressValidator())
app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({limit: '50mb',extended: 'true'}))

//Routes Middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/file-storage',fileStorageRoutes)


const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`app is running on port ${port}`));