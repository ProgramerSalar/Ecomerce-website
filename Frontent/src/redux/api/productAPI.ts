import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse } from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:5000/api/v1/product/`,
  }), // base url
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "latest",
    }),
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
    })
  }),
});

export const { useLatestProductsQuery, useAllProductsQuery } = productAPI;
