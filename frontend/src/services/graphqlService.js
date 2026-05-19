import { request, gql } from "graphql-request";

const GRAPHQL_URL = "https://localhost:7074/graphql";

const measureGraphQL = async (query, key, variables, iterations = 10) => {
  let totalTime = 0;
  let totalSize = 0;
  let latestData = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    const data = await request(GRAPHQL_URL, query, variables);
    const end = performance.now();

    latestData = data[key];
    totalTime += end - start;
    totalSize +=
      new TextEncoder().encode(JSON.stringify(data[key])).length / 1024;
  }

  return {
    data: latestData,
    avgTime: totalTime / iterations,
    avgSize: totalSize / iterations,
  };
};

export const getProductsGraphQL = async (multiplier = 1) => {
  const query = gql`
    query ($multiplier: Int!) {
      products(multiplier: $multiplier) {
        id
        name
        price
        category {
          name
        }
      }
    }
  `;

  return measureGraphQL(query, "products", { multiplier });
};

export const getCategoriesGraphQL = async (multiplier = 1) => {
  const query = gql`
    query ($multiplier: Int!) {
      categories(multiplier: $multiplier) {
        id
        name
        products {
          name
        }
      }
    }
  `;

  return measureGraphQL(query, "categories", { multiplier });
};

export const getProductByNameGraphQL = async (name, multiplier = 1) => {
  const query = gql`
    query ($name: String!, $multiplier: Int!) {
      products(multiplier: $multiplier, where: { name: { eq: $name } }) {
        id
        name
        price
        category {
          name
        }
      }
    }
  `;

  return measureGraphQL(query, "products", { name, multiplier });
};

// Unified function for flexible GraphQL queries, very un-readable but demonstrates advanced GraphQL features.
export const getItemsGraphQL = async ({
  type,
  filters = "",
  fields,
  variables = {},
  iterations = 10,
}) => {
  const query = gql`
    query(${Object.keys(variables)
      .map((k) => `$${k}: ${variables[k].type}`)
      .join(", ")}) {
      ${type}(${filters}) {
        ${fields}
      }
    }
  `;

  const gqlVariables = Object.fromEntries(
    Object.entries(variables).map(([k, v]) => [k, v.value]),
  );

  return measureGraphQL(query, type, gqlVariables, iterations);
};
