import { useEffect, useState } from "react";
import { getProductsREST, getCategoriesREST } from "./services/restService";
import {
  getProductsGraphQL,
  getCategoriesGraphQL,
} from "./services/graphqlService";
import { PerformanceChart } from "./components/PerformanceChart";

function App() {
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const restProducts = await getProductsREST();
      const restCategories = await getCategoriesREST();
      const gqlProducts = await getProductsGraphQL();
      const gqlCategories = await getCategoriesGraphQL();

      setPerformanceData([
        {
          label: "REST Products",
          time: restProducts.time,
          size: restProducts.size,
        },
        {
          label: "REST Categories",
          time: restCategories.time,
          size: restCategories.size,
        },
        {
          label: "GraphQL Products",
          time: gqlProducts.time,
          size: gqlProducts.size,
        },
        {
          label: "GraphQL Categories",
          time: gqlCategories.time,
          size: gqlCategories.size,
        },
      ]);
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "80%", margin: "50px auto" }}>
      <h1>API Performance Visualization</h1>
      <PerformanceChart data={performanceData} />
    </div>
  );
}

export default App;
