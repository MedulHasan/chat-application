const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path')
const cookieParser = require('cookie-parser')

//import error handler
const {
    notFoundHandler,
    errorHandler
} = require('./middlewares/common/errorHandler')

//import router
const loginRouter = require('./router/loginRouter')
const usersRouter = require('./router/usersRouter')
const inboxRouter = require('./router/inboxRouter')

const app = express();
dotenv.config();

//database connection
const DB_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wa1q4.mongodb.net/chat-application?retryWrites=true&w=majority`;
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database Connected');
    })
    .catch(e => {
        console.log(e);
    });


//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//set view engine
app.set('view engine', 'ejs')

//declear public folder
app.use(express.static(path.join(__dirname, 'public')))

app.use(cookieParser(process.env.COOKIE_SECRET));


//router
app.use('/', loginRouter)
app.use('/users', usersRouter)
app.use('/inbox', inboxRouter)

//404 not found
app.use(notFoundHandler)

//common error handler
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server is Running on port 3000`);
});