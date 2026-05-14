import { request, gql } from "graphql-request";

const GRAPHQL_URL = "https://localhost:7074/graphql";

export const getProductsGraphQL = async () => {
  const query = gql`
    query {
      products {
        id
        name
        price
        category {
          name
        }
      }
    }
  `;
  const start = performance.now();
  const data = await request(GRAPHQL_URL, query);
  const end = performance.now();
  return {
    data: data.products,
    time: end - start,
    size: new TextEncoder().encode(JSON.stringify(data.products)).length / 1024,
  };
};

export const getCategoriesGraphQL = async () => {
  const query = gql`
    query {
      categories {
        id
        name
        products {
          name
        }
      }
    }
  `;
  const start = performance.now();
  const data = await request(GRAPHQL_URL, query);
  const end = performance.now();
  return {
    data: data.categories,
    time: end - start,
    size:
      new TextEncoder().encode(JSON.stringify(data.categories)).length / 1024,
  };
};
