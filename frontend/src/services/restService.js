import axios from "axios";

const BASE_URL = "https://localhost:7074/api";

export const getProductsREST = async () => {
  const start = performance.now();
  const response = await axios.get(`${BASE_URL}/products`);
  const end = performance.now();
  return {
    data: response.data,
    time: end - start, // in ms
    size: new TextEncoder().encode(JSON.stringify(response.data)).length / 1024, // in KB
  };
};

export const getCategoriesREST = async () => {
  const start = performance.now();
  const response = await axios.get(`${BASE_URL}/categories`);
  const end = performance.now();
  return {
    data: response.data,
    time: end - start,
    size: new TextEncoder().encode(JSON.stringify(response.data)).length / 1024,
  };
};
