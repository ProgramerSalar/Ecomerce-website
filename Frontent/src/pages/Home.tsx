import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import ProductCard from "../components/product-cart";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducers/cartReducer";
import { CartItem } from "../types/types";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");
  const dispatch = useDispatch();
  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("add To Cart");
  };

  if (isError) {
    toast.error("Connect Fetch the Products");
  }

  return (
    <div className="home">
      <section></section>

      <h1>Latest Product</h1>
      <Link to="/search" className="findmore">
        More
      </Link>

      <main>
        {isLoading ? (
          <Skeleton length={10} />
        ) : (
          data?.products.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
              photo={i.photo}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
