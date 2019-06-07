const express = require('express');
const bodyParser = require('body-parser');
const bCrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'Project6347',
      database : 'smart-brain'
    }   
})


const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bCrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                console.log(user);
                res.json(user[0]);
            })
            .catch(err => {
                res.status(400).json('unable to get user');
            })
        }
    })
    .catch(err => res.status(400).json('wrong credentials'));
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bCrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginemail => {
            trx('users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginemail[0],
                    entries: 0,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
                .then(trx.commit)
                .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register...'));
    })
    .catch(err => res.status(400).json('unable to register...'));
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    db.select('*').from('users')
        .where({
        id: id
    })
        .then( user => {
            if(user.length){
                res.json(user[0]);
            } else {
                res.status(400).json('not found')
            }
        })
        .catch(err => res.status(400).json('cant get profile...'))

})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json("unable to get entries"));
})

app.listen(3000, () => {
    console.log('app is listening on port 3000');
})