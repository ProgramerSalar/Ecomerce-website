import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cart-item";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId: "daioeae",
    photo:
      "https://m.media-amazon.com/images/W/MEDIAX_792452-T1/images/I/71jG+e7roXL._AC_UY218_.jpg",
    name: "Macbook",
    price: 12000,
    quantity: 4,
    stock: 10,
  },
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 200;
const total = subtotal + tax + shippingCharges;
const discount = 400;

const Cart = () => {
  const [couponCode, setCouponCode] = useState<String>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (Math.random() > 0.5) setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  return (
    <div className="cart">
      <main>
        {
          cartItems.length > 0 ? cartItems.map((i, idx) => (
            <CartItem key={idx} cartItem={i} />
          )): <h1>No Items Added</h1>


        }
      </main>

      <aside>
        <p>Subtotal: ${subtotal}</p>
        <p>Shipping Charges: ${shippingCharges}</p>
        <p>Tax: ${tax}</p>
        <p>
          Discount: <em className="red"> - ${discount}</em>
        </p>
        <p>
          <b>Total: ${total}</b>
        </p>
        <input
          placeholder="Coupon Code"
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ${discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              {" "}
              Invalid Coupon Code <VscError />{" "}
            </span>
          ))}


          {
            cartItems.length > 0 && <Link to="/shipping">
            Chekout
            </Link>
          }
      </aside>
    </div>
  );
};

export default Cart;
