import {Link} from "react-router-dom"
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { useState } from "react"
import { User } from "../types/types"




interface PropsType{
    user:User | null;
}

const Header = ({user}:PropsType) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const logoutHandler = () => {
        setIsOpen(false)
    }

  return (
    <nav className="header">
        <Link to={"/"} onClick={() => setIsOpen(false)}>Home</Link>
        <Link to={"/search"} onClick={() => setIsOpen(false)}>
            <FaSearch />
            </Link>
        <Link to={"/cart"}>
            <FaShoppingBag />
            </Link>

            {user?._id ? (
        <>
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <FaUser />
          </button>
          <dialog open={isOpen}>
            <div>
              {user.role === "admin" && (
                <Link onClick={() => setIsOpen(false)} to="/admin/dashboard">
                  Admin
                </Link>
              )}

              <Link onClick={() => setIsOpen(false)} to="/orders">
                Orders
              </Link>
              <button onClick={logoutHandler}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={"/login"}>
          <FaSignInAlt />
        </Link>
      )}




    </nav>
  )
}

export default Header
