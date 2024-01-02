import { ChangeEvent, useState } from "react";
import { BiArrowBack, BiBadge } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Shipping = () => {

  const navigate = useNavigate()
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

  return (
    <div className="shipping">
      <button onClick={() => navigate('/cart')} className="back-btn">
        <BiArrowBack />
      </button>

      <form>
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
