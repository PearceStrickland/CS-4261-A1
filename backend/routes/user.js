
const express = require('express');
const router = express.Router();

const { createUser, userSignIn } = require('../controllers/user');
const { getAccessToken, fetchTransactions, retrieveTransactions} = require('../controllers/plaid'); // Import the Plaid controller

const { validateUserSignUp, userValidation, validateUserSignIn } = require('../middleware/validation/user');
const { isAuth } = require('../middleware/auth');


//User creation and sign in routes

router.post('/create-user', validateUserSignUp, userValidation, createUser);
router.post('/sign-in', validateUserSignIn, userValidation, userSignIn);







router.post('/get-access-token', isAuth, getAccessToken); // Plaid access token route
router.post('/store-transactions', isAuth, fetchTransactions);
router.get('/retrieve-transactions', isAuth, retrieveTransactions);

router.post('/create-post', isAuth, (req, res) => {
  res.send('welcome you are in secret route');
});

module.exports = router;
