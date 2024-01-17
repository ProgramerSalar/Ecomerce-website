import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllProductsResponse,
  CategoriesResponse,
  MessageResponse,
  NewProductRequest,
  SearchProductRequest,
  SearchProductResponse,
} from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:5000/api/v1/product/`,
  }), // base url
  tagTypes:["product"],   // pass out the tag of invalidate 
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "latest",
      providesTags:["product"],
    }),
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags:["product"],

    }),
    categories: builder.query<CategoriesResponse, string>({
      query: () => `getAllCategories`,
      providesTags:["product"],

    }),
    searchProducts: builder.query<
    SearchProductResponse,
    SearchProductRequest
    >({
      query: ({ price, search, sort, category, page }) => {
        let base = `all?search=${search}&page=${page}`;

        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;

        return base;
      },
      
    }),
    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({formData, id}) => ({
        url:`new?id=${id}`,
        method:"POST",
        body:formData,
      }),
      invalidatesTags:["product"],
    })
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
} = productAPI;
