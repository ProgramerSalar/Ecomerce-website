import { useState } from "react";
import ProductCard from "../components/product-cart";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import { Skeleton } from "../components/Loader";

const Search = () => {
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const {isLoading:productLoading, data:searchedData, isError:productIsError, error:productError} = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,

    
  });
  console.log(searchedData)

  const addToCartHandler = () => {};
  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  if (isError) {
    toast.error((error as CustomError).data.message);
  }
  if(productIsError){
    const err = productError as CustomError;
    toast.error(err.data.message)
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filter</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="des">None (Hight to Low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>None</option>
            {!loadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option value={i} key={i}>
                  {i.toLocaleUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name....."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {
          productLoading ? <Skeleton length={20} /> : <div className="search-product-list">
          
          {
            searchedData?.products.map((i) => (
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
          }
        </div>
        }

        {
          searchedData && searchedData.totalPage > 1 &&(
            <article>
          <button
            disabled={!isPrevPage}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>
            {page} of {searchedData.totalPage}
          </span>
          <button
            disabled={!isNextPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </article>
          )
        }
      </main>
    </div>
  );
};

export default Search;
