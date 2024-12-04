import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import './App.css'

// Load Stripe.js with your publishable key
const stripePromise = loadStripe("pk_test_51MleNfGu5HqbuovWch7BhkuNBuuQrvcgUPg9rCIwfTDeOcEidFaUgRCGLOlf97sYqbZxd6M14QsCTlBE6KAjJbCv00cJVHgV8c");

const App = () => {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        // Fetch client secret from backend
        fetch("http://localhost:5001/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 2000 }), // $20 in cents
        })
            .then((response) => response.json())
            .then((data) => setClientSecret(data.clientSecret))
            .catch((error) => console.error("Error fetching client secret:", error));
    }, []);

    const appearance = {
        theme: "flat", // Customize Stripe Payment Element UI
    };

    return (
        <div className="App">
            {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                    <CheckoutForm />
                </Elements>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default App;
