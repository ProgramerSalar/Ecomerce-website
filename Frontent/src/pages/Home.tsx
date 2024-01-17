import { Link } from "react-router-dom";
import ProductCard from "../components/product-cart";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import  { Skeleton } from "../components/Loader";
import toast from "react-hot-toast";

const Home = () => {
  const {data, isLoading, isError} = useLatestProductsQuery("")
  const addToCartHandler = () => {};

  if(isError){
    toast.error("Connect Fetch the Products")
  }
 
  return (
    <div className="home">
      <section></section>



<h1>Latest Product</h1>
      <Link to="/search" className="findmore">
        More
      </Link>

    
     

      <main>
        { isLoading ? (<Skeleton />) : (
          data ?.products.map((i) => (
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
        )
          
        }
       
      </main>
    </div>
  );
};

export default Home;
