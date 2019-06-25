const handleSignIn = (req, res, db, bCrypt) => {
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
    .catch(err => res.status(400).json('wrong credentials' + err));
}

module.exports = {
    handleSignIn: handleSignIn
}