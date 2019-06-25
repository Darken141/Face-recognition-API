const express = require('express');
const bodyParser = require('body-parser');
const bCrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signIn = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'D63479614',
      database : 'smart-brain'
    }   
})


const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => signIn.handleSignIn(req, res, db, bCrypt))

app.post('/register', (req, res) => register.handleRegister(req, res, db, bCrypt));

app.get('/profile/:id', (req, res) => profile.hangleProfileGet(req, res, db))

app.put('/image', (req, res) => image.handlePutImage(req, res, db))

app.listen(3000, () => {
    console.log('app is listening on port 3000');
})