import React, { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Fetch the client secret from the backend when the component loads
        fetch("http://localhost:5001/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: 2000 }), // $20 in cents
        })
            .then((response) => response.json())
            .then((data) => setClientSecret(data.clientSecret))
            .catch((error) => console.error("Error fetching client secret:", error));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        try {
            // Confirm the payment using PaymentElement
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Optional: Define the URL to redirect after successful payment
                    return_url: "http://localhost:3000/payment-success",
                },
            });

            if (error) {
                console.error("Payment error:", error.message);
            } else {
                console.log("Payment successful!");
            }
        } catch (error) {
            console.error("Server error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {clientSecret && <PaymentElement />}
            <button type="submit" disabled={!stripe || !clientSecret || isProcessing}>
                {isProcessing ? "Processing..." : "Pay"}
            </button>
        </form>
    );
};

export default CheckoutForm;
