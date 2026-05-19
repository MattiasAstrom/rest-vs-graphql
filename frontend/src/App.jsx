import { useEffect, useState } from "react";
import { getProductsREST, getCategoriesREST } from "./services/restService";
import {
  getProductsGraphQL,
  getCategoriesGraphQL,
  getProductByNameGraphQL,
  getItemsGraphQL,
} from "./services/graphqlService";

import { PerformanceChart } from "./components/PerformanceChart";

function App() {
  const [data1x, setData1x] = useState([]);
  const [data100x, setData100x] = useState([]);
  const [data1000x, setData1000x] = useState([]);
  const [data10000x, setData10000x] = useState([]);

  useEffect(() => {
    const build = async (size) => {
      const restProducts = await getProductsREST(size);
      const gqlProducts = await getProductsGraphQL(size);

      const restCategories = await getCategoriesREST(size);
      const gqlCategories = await getCategoriesGraphQL(size);

      // Specific query to test filtering and more complex GraphQL features.
      const laptopProduct = await getProductByNameGraphQL("Laptop", 1);

      // Unified data functions for easier charting.
      const itemsProducts = await getItemsGraphQL({
        type: "products",
        fields: `
    id
    name
    price
  `,
      });

      const itemsFiltered = await getItemsGraphQL({
        type: "products",
        filters: `where: { name: { eq: $name } }`,
        variables: {
          name: {
            type: "String!",
            value: "Laptop",
          },
        },
        fields: `
    id
    name
    price
  `,
      });

      const itemsCategories = await getItemsGraphQL({
        type: "categories",
        fields: `
    id
    name
  `,
      });

      return [
        {
          group: "Products",
          restTime: restProducts.avgTime,
          gqlTime: gqlProducts.avgTime,
          restSize: restProducts.avgSize,
          gqlSize: gqlProducts.avgSize,
        },
        {
          group: "Categories",
          restTime: restCategories.avgTime,
          gqlTime: gqlCategories.avgTime,
          restSize: restCategories.avgSize,
          gqlSize: gqlCategories.avgSize,
        },
      ];
    };

    const run = async () => {
      const r1 = await build(1);
      const r100 = await build(100);
      const r1000 = await build(1000);
      const r10000 = await build(10000);

      setData1x(r1);
      setData100x(r100);
      setData1000x(r1000);
      setData10000x(r10000);

      // LOG CORRECTLY (AFTER DATA IS READY)
      console.log("1x", r1);
      console.log("100x", r100);
      console.log("1000x", r1000);
      console.log("10000x", r10000);
    };

    run();
  }, []);

  return (
    <div
      style={{
        width: "90%",
        margin: "40px auto",
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        color: "black",
        fontFamily: "Arial",
      }}
    >
      <h1>REST vs GraphQL Comparison</h1>

      <h2>Dataset: 1x</h2>
      <PerformanceChart data={data1x} />

      <h2>Dataset: 100x</h2>
      <PerformanceChart data={data100x} />

      <h2>Dataset: 1000x</h2>
      <PerformanceChart data={data1000x} />

      <h2>Dataset: 10000x</h2>
      <PerformanceChart data={data10000x} />
    </div>
  );
}

export default App;
