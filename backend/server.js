const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// imports
const authRouter  = require('./routes/authRoute');
const postRouter  = require('./routes/postRoute');
const uploadRouter = require('./routes/uploadRoute');
const commentRouter = require('./routes/commentRoute');
const replyRouter = require('./routes/replyRoute');
const connectDB  = require('./config/db');
const notFound = require('./middlewares/notFound');
const errorHandler  = require('./middlewares/errorMiddleware');

// initializer
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;



// mongodb connection 
connectDB();

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// routes
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/upload', uploadRouter);
app.use('/comment', commentRouter);
app.use('/reply', replyRouter);

// serve frontend
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*',(req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    })
} else {
        app.get('/', (req, res) => res.send('Application is on development mode.'));
}

app.use(errorHandler);
app.use(notFound);

// listener
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})
