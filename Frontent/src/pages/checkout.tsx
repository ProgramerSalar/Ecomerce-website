import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51LyzylSBCIORAoq3XfOgUuXmYRoIBOcGa46q4LhxN2E6sAFfycVBupE34XdDfjgaTP4euUgIop1Pr8mKhuJvC3PR00Ebp2Ts5g"
);

const CheckOutForm =  () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    const order = {};

    const {paymentIntent, error} = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if(error) {
        setIsProcessing(false)
        toast.error(error.message || "Something went wrong")

    } 
    if(paymentIntent.status === "succeeded") {
        console.log("Placing Order")
        navigate("/orders")
    }
    setIsProcessing(false)

  };
  return (
    <div className="chekout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button disabled={isProcessing}>{isProcessing ? "Processing......" : "Pay"}</button>
      </form>
    </div>
  );
};

const Checkout = () => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret:
          "pi_3OZy61SBCIORAoq30QMcHDJF_secret_ml38um3M7HzWWdvRkB4yiO6vN",
      }}
    >
      <CheckOutForm />
    </Elements>
  );
};

export default Checkout;
