const express = require('express');
require('dotenv').config();
require('./models/db');
const userRouter = require('./routes/user')

const User = require('./models/user')



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

  const test = async (email, password) => {
    const user = await User.findOne({ email: email });
    const result = await user.comparePassword(password);
    console.log(result);
};

test('hype7@gmail.com', '123456');
  
  app.get('/test', (req, res) => {
    res.send('Hello world');
  });



app.get('/', (req, res) => {
    res.send('hellow world');
});

const PORT = process.env.PORT || 8000; // Fallback to 8000 if process.env.PORT is not defined
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//pearcestrickland88:<password>@budgetbeam1.imowwxm.mongodb.net/?retryWrites=true&w=majority