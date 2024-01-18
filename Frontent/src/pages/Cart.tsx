import axios from "axios";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../components/cart-item";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/reducers/cartReducer";
import { server } from "../redux/store";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";

const Cart = () => {
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );

  const [couponCode, setCouponCode] = useState<String>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`)
        .then((res) => {
          // console.log(res.data)
          dispatch(discountApplied(res.data.discount));
          setIsValidCouponCode(true);
        })
        .catch(() => {
          // console.log(e.response.data.message)
          dispatch(discountApplied(0));

          setIsValidCouponCode(false);
        });
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, idx) => (
            <CartItemCard
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
              key={idx}
              cartItem={i}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
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

        {cartItems.length > 0 && <Link to="/shipping">Chekout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
