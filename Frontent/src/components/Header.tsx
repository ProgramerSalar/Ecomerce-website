import {Link} from "react-router-dom"
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"



const user = { _id: "dfsrer", role: "admin"}


const Header = () => {

  return (
    <nav>
        <Link to={"/"}>Home</Link>
        <Link to={"/search"}>
            <FaSearch />
            </Link>
        <Link to={"/cart"}>
            <FaShoppingBag />
            </Link>

            {
                user?._id ? (
                    <>
                    <button>
                        <FaUser />
                    </button>
                    <dialog open={true}>
                        <div>
                            {
                                user.role === "admin" && (
                                    <Link to="/admin/dashboard"> Admin</Link>
                                )
                            }
                            <Link to="/orders">Orders</Link>
                            <button>
                                <FaSignOutAlt />
                            </button>
                        </div>
                    </dialog>
                    </>
                ) :  <Link to={"/login"}>
                <FaSignInAlt />
                </Link>
            }




    </nav>
  )
}

export default Header
