import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ReportPage from "./ReportPage.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <ReportPage />
  </>,
);

/**      
react-dom_client.js?v=59491f47:14338 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
App.jsx:54 1x (2) [{…}, {…}]0: gqlSize: 0.2744140625gqlTime: 9.640000000223518group: "Products"restSize: 0.3564453125restTime: 13[[Prototype]]: Object1: gqlSize: 0.1923828125gqlTime: 7.379999999701977group: "Categories"restSize: 0.330078125restTime: 7.149999999627471[[Prototype]]: Objectlength: 2[[Prototype]]: Array(0)
App.jsx:55 100x (2) [{…}, {…}]0: gqlSize: 27.3447265625gqlTime: 8.969999999552964group: "Products"restSize: 35.5478515625restTime: 8.090000000596046[[Prototype]]: Object1: gqlSize: 19.1416015625gqlTime: 9.319999999925495group: "Categories"restSize: 32.9111328125restTime: 11.910000000149012[[Prototype]]: Objectlength: 2[[Prototype]]: Array(0)
App.jsx:56 1000x (2) [{…}, {…}]0: gqlSize: 273.4384765625gqlTime: 19.03999999947846group: "Products"restSize: 355.4697265625restTime: 26.13999999985099[[Prototype]]: Object1: gqlSize: 191.4072265625gqlTime: 20.66000000014901group: "Categories"restSize: 329.1025390625restTime: 18.770000000298023[[Prototype]]: Objectlength: 2[[Prototype]]: Array(0)
App.jsx:57 10000x (2) [{…}, {…}]0: gqlSize: 2734.3759765625gqlTime: 161.57999999970198group: "Products"restSize: 3554.6884765625restTime: 223.30000000074506[[Prototype]]: Object1: gqlSize: 1914.0634765625gqlTime: 105.13000000044704group: "Categories"restSize: 3291.0166015625restTime: 161.7600000012666[[Prototype]]: Objectlength: 2[[Prototype]]: Array(0)
*/
