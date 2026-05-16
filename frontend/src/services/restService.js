import axios from "axios";

const BASE_URL = "https://localhost:7074/api";

const measureRequest = async (requestFn, iterations = 10) => {
  let totalTime = 0;
  let totalSize = 0;
  let latestData = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    const response = await requestFn();
    const end = performance.now();

    latestData = response.data;
    totalTime += end - start;
    totalSize +=
      new TextEncoder().encode(JSON.stringify(response.data)).length / 1024;
  }

  return {
    data: latestData,
    avgTime: totalTime / iterations,
    avgSize: totalSize / iterations,
  };
};

export const getProductsREST = async (multiplier = 1) => {
  return measureRequest(() =>
    axios.get(`${BASE_URL}/products?multiplier=${multiplier}`),
  );
};

export const getCategoriesREST = async (multiplier = 1) => {
  return measureRequest(() =>
    axios.get(`${BASE_URL}/categories?multiplier=${multiplier}`),
  );
};
