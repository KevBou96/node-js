const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./util/database');
const pgsession = require('connect-pg-simple')(session);

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret', 
    resave: false,
    saveUninitialized: false,
    store: new pgsession({
        pool: db
    })
}))

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.use(errorController.get404);

app.listen(3000);
