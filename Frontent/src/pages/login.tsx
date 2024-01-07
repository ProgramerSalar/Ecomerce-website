import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";


const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const {user} = await signInWithPopup(auth, provider)
      
      



    } catch (error) {
      toast.error("signIn Fail")
    }
  };
  return (
    <div className="login">
      <main>
        <h1 className="heading">login</h1>
        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label>Date of Birth</label>
          <input
            placeholder="Date of Birth"
            type="date"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <p>Already Signed In Once</p>
          <button onClick={loginHandler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
