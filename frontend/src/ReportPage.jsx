import { useEffect, useState } from "react";
import { getProductsREST, getCategoriesREST } from "./services/restService";
import {
  getProductsGraphQL,
  getCategoriesGraphQL,
} from "./services/graphqlService";

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

    {/* FOOTER ALWAYS BOTTOM */}
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

      // 🔥 FIX ALIGNMENT ISSUE
      textAlign: "left",
      display: "block",
      unicodeBidi: "plaintext",
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
  const [restCategories, setRestCategories] = useState(null);
  const [gqlCategories, setGqlCategories] = useState(null);

  useEffect(() => {
    const load = async () => {
      const rc = await getCategoriesREST();
      const gc = await getCategoriesGraphQL();

      setRestCategories(rc.data);
      setGqlCategories(gc.data);
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
      <h1>REST vs GraphQL – Pipeline Comparison</h1>

      {/* =========================================================
          1. FRONTEND LAYER
      ========================================================= */}
      <h2>1. Frontend → Backend Request</h2>

      <div style={{ display: "flex", gap: "-20px" }}>
        {/* REST */}
        <Panel
          title="REST Frontend Call (Axios)"
          footer={
            <Code>{`useEffect(() => {
  getCategoriesREST().then(res => {
    console.log(res.data);
  });
}, []);`}</Code>
          }
        >
          <Code>{`export const getCategoriesREST = () => {
  return axios.get("/api/categories");
};`}</Code>
        </Panel>

        {/* GRAPHQL */}
        <Panel
          title="GraphQL Frontend Call"
          footer={
            <Code>{`useEffect(() => {
  getCategoriesGraphQL().then(res => {
    console.log(res.categories);
  });
}, []);`}</Code>
          }
        >
          <Code>{`export const getCategoriesGraphQL = () => {
  return request("/graphql", gql\`
    query {
      categories {
        id
        name
        products { name }
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

      <div style={{ display: "flex", gap: "-20px" }}>
        <Panel title="REST Controller">
          <Code>{`[HttpGet]
public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
{
    var categories = await context.Categories
        .Include(c => c.Products)
        .Select(c => new CategoryDto {
            Id = c.Id,
            Name = c.Name,
            Products = c.Products.Select(p => new ProductDto {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price
            }).ToList()
        })
        .ToListAsync();

    return Ok(categories);
}`}</Code>
        </Panel>

        <Panel title="GraphQL Resolver">
          <Code>{`public async Task<List<CategoryDto>> GetCategories(
    [Service] IDbContextFactory<ApiDbContext> factory)
{
    var categories = await context.Categories
        .Include(c => c.Products)
        .Select(c => new CategoryDto {
            Id = c.Id,
            Name = c.Name,
            Products = c.Products.Select(p => new ProductDto {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price
            }).ToList()
        })
        .ToListAsync();

    return categories;
}`}</Code>
        </Panel>
      </div>

      {/* =========================================================
          3. RESPONSE STRUCTURE
      ========================================================= */}
      <h2 style={{ marginTop: "40px" }}>3. Response Structure (Categories)</h2>

      <div style={{ display: "flex", gap: "-20px" }}>
        <Panel title="REST Response">
          <Json data={restCategories?.[0] || {}} />
        </Panel>

        <Panel title="GraphQL Response">
          <Json data={gqlCategories?.[0] || {}} />
        </Panel>
      </div>
    </div>
  );
}
