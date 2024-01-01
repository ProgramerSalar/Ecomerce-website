import { Link } from "react-router-dom";
import ProductCard from "../components/product-cart";

const Home = () => {
  const addToCartHandler = () => {};
  return (
    <div className="home">
      <section></section>



<h1>Latest Product</h1>
      <Link to="/search" className="findmore">
        More
      </Link>

    
     

      <main>
        <ProductCard
          productId="daoiere"
          name="macbook"
          price={23}
          stock={23}
          handler={addToCartHandler}
          photo="https://m.media-amazon.com/images/W/MEDIAX_792452-T1/images/I/71jG+e7roXL._AC_UY218_.jpg"
        />
      </main>
    </div>
  );
};

export default Home;
