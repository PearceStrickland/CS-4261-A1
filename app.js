const express = require('express');
require('dotenv').config();
require('./models/db');

const User = require('./models/user')


const app = express()

app.post('/create-user', async (req, res) => {
    const isNewUser = await User.isThisEmailInUse('checj@gmail.com')
    if(!isNewUser) return res.json
     const user = await User({fullname: 'John', email: 'checj@gmail.com', password: '1234'})
     await user.save();
     res.json(user)
});

app.get('/', (req, res) => {
    res.send('hellow world');
});

app.listen(8000, () => {
    console.log('port is listenting')
})

//pearcestrickland88:<password>@budgetbeam1.imowwxm.mongodb.net/?retryWrites=true&w=majority