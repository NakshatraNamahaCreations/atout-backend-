const axios = require('axios');
const qs = require('qs');
const Payment = require('../models/Payment');
require('dotenv').config();

const phonePeAuth = async () => {
  const data = qs.stringify({
    client_id: process.env.PHONEPE_CLIENT_ID,
    client_secret: process.env.PHONEPE_CLIENT_SECRET,
    client_version: '1',
    grant_type: 'client_credentials',
  });

  const response = await axios.post(
    `${process.env.PHONEPE_API_BASE_URL}/apis/identity-manager/v1/oauth/token`,
    data,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );

  return response.data.access_token;
};

exports.initiatePayment = async (req, res) => {
    const { merchantOrderId, amount, redirectUrl } = req.body;
  
    try {
      const accessToken = await phonePeAuth();
  
      const payload = {
        merchantOrderId,
        amount,
        expireAfter: 1200,
        paymentFlow: {
          type: "PG_CHECKOUT",
          message: "Complete your payment",
          merchantUrls: { redirectUrl: "http://localhost:3001/payment-success" || "https://yourdomain.com/payment-success" },
        },
      };
      
  
      const payment = await Payment.create({ merchantOrderId, amount });
  
      const response = await axios.post(
        `${process.env.PHONEPE_API_BASE_URL}/apis/pg/checkout/v2/pay`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${accessToken}`
          }
        }
      );
  
      // Log full response to check the structure
      console.log("PhonePe API Response: ", response.data);
  
      // Check if transactionId and redirect URL are present
      if (response.data?.data?.instrumentResponse?.redirectInfo?.url) {
        payment.transactionId = response.data.data.transactionId;
        await payment.save();
  
        // Return the response with the redirect URL
        res.json(response.data);
      } else {
        // If missing redirect URL
        console.error('Redirect URL missing in the response from PhonePe');
        res.status(400).json({ error: 'Redirect URL missing in PhonePe response' });
      }
  
    } catch (error) {
      console.error('Payment initiation error:', error.response?.data || error.message);
      res.status(500).json({ 
        error: error.response?.data || error.message 
      });
    }
  };
  
  
  
