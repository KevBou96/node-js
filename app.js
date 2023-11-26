const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
});

const fileFilterr = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage, fileFilter: fileFilterr}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
    name: 'SID',
    secret: 'my secret', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))
app.use(flash())

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.get('/500', errorController.get500);
app.use(errorController.get404);
app.use((error, req, res, next) => {
    console.log(error);
    if (error.httpStatusCode == 500) {
        res.redirect('/500');
    }
    if (error.httpStatusCode == 404) {
        res.redirect('/404')
    }
    return
})

app.listen(3000);