const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const stripe = new Stripe('sk_test_51MleNfGu5HqbuovWGfToAzfhkD2dqg5NRig1Rp3EqESA9PWij7Eue8XV9cAZRrQQE1HrEWbKMgcsvdd25xcW8A8m009LXL9GGt');

app.use(cors());
app.use(express.json());

app.post("/create-payment-intent", async (req, res) => {
    const { amount } = req.body;


    try {
        const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
    });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

console.log("Starting the server...");
app.listen(5001, () => console.log("Server running on port 5001"));
