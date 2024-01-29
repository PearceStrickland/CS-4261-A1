const express = require('express');
require('dotenv').config();
require('./models/db');
const userRouter = require('./routes/user')

const User = require('./models/user')

const email = 'check@gmail.com'

const app = express()

/** 
app.use((req, res, next) => {
    req.on('data', chunk => {
      const data = JSON.parse(chunk);
      req.body = data;
      next();
    });
    
  });

  */

  app.use(express.json());
  app.use(userRouter);
  
  app.get('/test', (req, res) => {
    res.send('Hello world');
  });



app.get('/', (req, res) => {
    res.send('hellow world');
});

app.listen(8000, () => {
    console.log('port is listenting')
})

//pearcestrickland88:<password>@budgetbeam1.imowwxm.mongodb.net/?retryWrites=true&w=majority