import { useEffect, useState } from "react";
import { getProductsREST } from "./services/restService";
import { getProductsGraphQL } from "./services/graphqlService";

const Panel = ({ title, children, footer }) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      border: "1px solid #ddd",
      padding: "14px",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>{title}</h3>

    {/* MAIN CONTENT */}
    <div style={{ flex: 1 }}>{children}</div>

    {/* FOOTER */}
    {footer && (
      <div style={{ marginTop: "12px" }}>
        <div style={{ fontSize: "12px", marginBottom: "6px", opacity: 0.7 }}>
          Example usage
        </div>
        {footer}
      </div>
    )}
  </div>
);

const Code = ({ children }) => (
  <pre
    style={{
      background: "#f5f5f5",
      padding: "12px",
      borderRadius: "8px",
      fontSize: "11px",
      overflowX: "auto",
      whiteSpace: "pre",
      lineHeight: "1.4",
      textAlign: "left",
      display: "block",
      unicodeBidi: "plaintext",
      margin: 0,
    }}
  >
    {children}
  </pre>
);

const Json = ({ data }) => (
  <pre
    style={{
      background: "#ffffff",
      padding: "14px",
      borderRadius: "8px",
      fontSize: "12px",
      overflowX: "auto",
      whiteSpace: "pre",
      textAlign: "left",
      lineHeight: "1.4",
      margin: 0,
    }}
  >
    {JSON.stringify(data, null, 2)}
  </pre>
);

export default function ReportPage() {
  const [restProducts, setRestProducts] = useState([]);
  const [gqlProducts, setGqlProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const rp = await getProductsREST();
        const gp = await getProductsGraphQL();

        console.log("REST RESPONSE", rp);
        console.log("GRAPHQL RESPONSE", gp);

        // REST
        setRestProducts(rp.data || []);

        // GRAPHQL
        // {
        //   avgSize,
        //   avgTime,
        //   data: [...]
        // }
        setGqlProducts(gp.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <div
      style={{
        width: "96%",
        margin: "20px auto",
        fontFamily: "Arial",
        color: "black",
      }}
    >
      <h2 style={{ marginTop: "40px" }}>0. Mätlogik (Performance Layer)</h2>

      <div style={{ display: "flex" }}>
        <Panel title="REST Measurement Function">
          <Code>{`const measureRequest = async (requestFn, iterations = 10) => {
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
};`}</Code>
        </Panel>

        <Panel title="GraphQL Measurement Function">
          <Code>{`const measureGraphQL = async (query, key, variables, iterations = 10) => {
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
};`}</Code>
        </Panel>
      </div>

      <h1>REST vs GraphQL – Pipeline Comparison</h1>

      {/* =========================================================
          1. FRONTEND LAYER
      ========================================================= */}
      <h2>1. Frontend → Backend Request</h2>

      <div style={{ display: "flex" }}>
        {/* REST */}
        <Panel
          title="REST Frontend Call (Axios)"
          footer={
            <Code>{`useEffect(() => {
  getProductsREST().then(res => {
    console.log(res.data);
  });
}, []);`}</Code>
          }
        >
          <Code>{`export const getProductsREST = () => {
  return axios.get("/api/products");
};`}</Code>
        </Panel>

        {/* GRAPHQL */}
        <Panel
          title="GraphQL Frontend Call"
          footer={
            <Code>{`useEffect(() => {
  getProductsGraphQL().then(res => {
    console.log(res.data);
  });
}, []);`}</Code>
          }
        >
          <Code>{`export const getProductsGraphQL = () => {
  return request("/graphql", gql\`
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
  \`);
};`}</Code>
        </Panel>
      </div>

      {/* =========================================================
          2. BACKEND
      ========================================================= */}
      <h2 style={{ marginTop: "40px" }}>2. Backend Implementation</h2>

      <div style={{ display: "flex" }}>
        {/* REST */}
        <Panel title="REST Controller">
          <Code>{`[HttpGet]
public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
{
    var products = await context.Products
        .Include(p => p.Category)
        .Select(p => new ProductDto {
            Id = p.Id,
            Name = p.Name,
            Price = p.Price,
            Category = new CategoryDto {
                Id = p.Category.Id,
                Name = p.Category.Name
            }
        })
        .ToListAsync();

    return Ok(products);
}`}</Code>
        </Panel>

        {/* GRAPHQL */}
        <Panel title="GraphQL Resolver">
          <Code>{`public async Task<List<ProductDto>> GetProducts(
    [Service] IDbContextFactory<ApiDbContext> factory)
{
    var products = await context.Products
        .Include(p => p.Category)
        .Select(p => new ProductDto {
            Id = p.Id,
            Name = p.Name,
            Price = p.Price,
            Category = new CategoryDto {
                Id = p.Category.Id,
                Name = p.Category.Name
            }
        })
        .ToListAsync();

    return products;
}`}</Code>
        </Panel>
      </div>

      {/* =========================================================
          3. RESPONSE STRUCTURE
      ========================================================= */}
      <h2 style={{ marginTop: "40px" }}>3. Response Structure (Products)</h2>

      <div style={{ display: "flex" }}>
        {/* REST */}
        <Panel title="REST Response">
          <Json data={restProducts[0] || {}} />
        </Panel>

        {/* GRAPHQL */}
        <Panel title="GraphQL Response">
          <Json data={gqlProducts[0] || {}} />
        </Panel>
      </div>
    </div>
  );
}
