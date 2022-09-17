const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// imports
const authRouter  = require('./routes/authRoute');
const postRouter  = require('./routes/postRoute');
const uploadRouter = require('./routes/uploadRoute');
const connectDB  = require('./config/db');
const notFound = require('./middlewares/notFound');
const errorHandler  = require('./middlewares/errorMiddleware');

// initializer
dotenv.config();
const app = express();
const port = process.env.PORT || 8801;

// const corsUrl = process.env.ALLOWED_URLS || '';


// mongodb connection 
connectDB();

// cors configuration
// const whitelist = corsUrl.split(',').map(item => item.trim())
// const corsOptions = {
//     origin: (origin:any, callback:any) => {
//         if(whitelist.includes(origin) || origin === undefined) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     }
// }

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// routes
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/upload', uploadRouter);

app.use(errorHandler);
app.use(notFound);

// listener
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})