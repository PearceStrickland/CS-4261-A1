const axios = require('axios');
const User = require('../models/user'); // Assuming you have a User model where you'd store access tokens

// Initialize Plaid client (move this configuration to an appropriate config file or directly here)

// Exchange public token for access token
exports.getAccessToken = async (req, res) => {
  console.log("check accsess");
  const { publicToken } = req.body;
  const userId = req.user._id; // Assuming you have user info in req.user from your auth middleware
  console.log("Received public token: ", publicToken);
  console.log("Request body: ", req.body);    

  try {
    const plaidExchangeEndpoint = 'https://sandbox.plaid.com/item/public_token/exchange';
    const response = await axios.post(plaidExchangeEndpoint, {
      client_id: '65e23a52dbf9aa001b55b5a0',
      secret: 'aa6c0c28445c17d25b2825d8c1ac55',
      public_token: publicToken,
    });

    if (response.data) {
        console.log("Response Data:", response.data);
        if (response.data.access_token) {
          console.log("Access Token:", response.data.access_token);
        } else {
          console.log("Access token not received in the response.");
        }
      } else {
        console.log("No data received in response.");
      }

    if (response.data && response.data.access_token) {
      const accessToken = response.data.access_token;
      console.log("check2");
      console.log(accessToken);

      // Update user document with the new access token
      await User.findByIdAndUpdate(userId, { plaidAccessToken: accessToken });

      res.json({ success: true, accessToken });
    } else {
      throw new Error('Plaid did not return an access token.');
    }
  } catch (error) {
    console.error('Failed to exchange public token:', error);
    if (error.response) {
      // Logging the detailed response from Plaid if available
      console.error('Plaid error details:', error.response.data);
    }
    res.status(500).json({ success: false, message: 'Failed1 to exchange public token', error: error.message });
  }
};

exports.fetchTransactions = async (req, res) => {
    console.log('fetch test')
    const userId = req.user._id;
    const user = await User.findById(userId);
    console.log('fetch test2')

    if (!user || !user.plaidAccessToken) {
        return res.status(400).json({ success: false, message: "User not found or Plaid access token missing." });
    }

    try {
        const response = await axios.post('https://sandbox.plaid.com/transactions/sync', {
            client_id: '65e23a52dbf9aa001b55b5a0',
            secret: 'aa6c0c28445c17d25b2825d8c1ac55',
            access_token: user.plaidAccessToken
        });

        if(response.data){
            console.log('there is data');
        }


        const combinedTransactions = [...response.data.added, ...response.data.modified];
        combinedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
        
        const transactionsToSave = combinedTransactions.map(transaction => ({
            name: transaction.name,
            date: new Date(transaction.date),
            amount: transaction.amount,
            categories: transaction.category,
            logoUrl: transaction.logo_url || ''
        }));
        // Add transactions to the user document and save it
        
     
        
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { $set: { transactions: transactionsToSave } }, 
            { new: true }
        );

        res.json({ success: true, count: transactionsToSave.length, transactions: updatedUser.transactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: error.message });
    }
};

exports.retrieveTransactions = async (req, res) => {
    const userId = req.user._id; // Assuming you have user info from your auth middleware

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Assuming transactions are stored in the user document
        const transactions = user.transactions;
        res.json({ success: true, count: transactions.length, transactions });
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve transactions', error: error.message });
    }
};