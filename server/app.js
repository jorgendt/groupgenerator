require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const connectEnsureLogin = require('connect-ensure-login');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Setting up express app
const app = express();
const port = 8000;

app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(cors({
  //origin: 'http://localhost:3000',
  credentials: true
}));

app.use('/ggs', express.static('public'));

// Connect to database and set up user with passportLocalMongoose
mongoose.connect('mongodb://localhost:27017/gg-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Schema and model for rosters
const rosterSchema = new mongoose.Schema({
  name: String,
  owner: String,
  students: [{
    name: String
  }]
});

const Roster = new mongoose.model("Roster", rosterSchema);

// Middleware to make login case insensitive
const usernameToLowerCase = (req, res, next) => {
  req.body.username = req.body.username.toLowerCase();
  next();
};

// Login routes
app.post('/ggs/login', usernameToLowerCase, passport.authenticate('local', {
  successRedirect: '/gg',
  failureRedirect: '/ggs/login'
}));

app.get('/ggs/login', (req, res) => {
  res.render('login');
});

app.get('/ggs/login/ensure', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send(req.user);
  } else {
    res.status(401).send('User is not logged in.');
  }
});

app.get('/ggs/logout', (req, res) => {
  req.logout();
  res.redirect('/gg');
});

app.get('/ggs/signup', (req, res) => {
  res.render('signup', { display: 'none', message: '' });
});

app.post('/ggs/signup', usernameToLowerCase, (req, res) => {
  if (req.body.password === req.body.repeatPassword) {
      User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
          console.log(err);
        }
        if (user) {
          res.render('signup', { display: '', message: `Brukernavnet ${req.body.username} er allerede i bruk!` });
        } else {
          User.register({ username: req.body.username }, req.body.password, (err, user) => {
            if (err) {
              console.log(err);
              res.render('signup', { display: '', message: 'Noe gikk galt, prøv igjen.' });
            } else {
              res.render('login');
            }
          });
        }
      });
  } else {
    res.render('signup', { display: '', message: 'Gjentatt passord var ikke korrekt.' });
  }
});

// API routes
app.route('/ggs/rosters/ownedby/:owner')
.get((req, res) => {
  Roster.find({ owner: req.params.owner }, (err, rosters) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rosters);
    }
  });
})
.post((req, res) => {
  const roster = new Roster({
    name: req.body.name,
    owner: req.params.owner
  });

  roster.save().then(() => {
    res.status(201).send(roster);
  });
});

app.route('/ggs/rosters/:rosterId')
.get((req, res) => {
  Roster.findById(req.params.rosterId, (err, roster) => {
    if (err) {
      console.log(err);
    } else {
      res.send(roster);
    }
  });
})
.patch()
.delete((req, res) => {
  Roster.findByIdAndDelete(req.params.rosterId, (err, roster) => {
    if (err) {
      console.log(err);
    } else {
      res.send(roster);
    }
  });
});

app.route('/ggs/rosters/:rosterId/students')
.post((req, res) => {
  Roster.findByIdAndUpdate(req.params.rosterId, {
    $push: { students: { name: req.body.name } }
  }, (err, roster) => {
    if (err) {
      console.log(err);
    } else {
      res.send(roster);
    }
  });
});

app.route('/ggs/rosters/:rosterId/students/:studentId')
.delete((req, res) => {
  Roster.findByIdAndUpdate(req.params.rosterId, {
    $pull: {students: { _id: req.params.studentId } }
  }, (err, student) => {
    if (err) {
      console.log(err);
    } else {
      res.send(student);
    }
  });
});

// Starting server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
