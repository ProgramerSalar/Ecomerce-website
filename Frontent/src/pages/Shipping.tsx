import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { CartReducerInitialState } from "../types/reducer-types";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducers/cartReducer";

const Shipping = () => {

  const { cartItems, total } =
  useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const chanageHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value}));
  };


  const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()  // page not refress
    dispatch(saveShippingInfo(shippingInfo))
    try{
      const {data} = await axios.post(`${server}/api/v1/payment/create`, {
        amount:total,
      },{
        headers:{
          "Content-Type":"application/json",
        }
      })
      navigate("/pay", {
        state:data.clientSecret,
      })

    }catch(err){
      console.log(err)
      toast.error("Something went wrong");

    }

  }

  useEffect(() => {
    if(cartItems.length <= 0) return navigate("/cart")

  },[])



  return (
    <div className="shipping">
      <button onClick={() => navigate('/cart')} className="back-btn">
        <BiArrowBack />
      </button>

      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>
        <input
          placeholder="Address"
          type="text"
          value={shippingInfo.address}
          onChange={chanageHandler}
          name="address"
          required
        />
        <input
          placeholder="City"
          type="text"
          value={shippingInfo.city}
          onChange={chanageHandler}
          name="city"
          required
        />
        <input
          placeholder="state"
          type="text"
          value={shippingInfo.state}
          onChange={chanageHandler}
          name="state"
          required
        />
        <select 
        name="country"
        required
        value={shippingInfo.country}
        onChange={chanageHandler}
        >
            <option>Choose Country</option>
            <option value="india">India</option>
          

        </select>


        <input
          placeholder="pinCode"
          type="text"
          value={shippingInfo.pinCode}
          onChange={chanageHandler}
          name="pinCode"
          required
        />


        <button type="submit">Pay now</button>
        
      </form>
    </div>
  );
};

export default Shipping;
