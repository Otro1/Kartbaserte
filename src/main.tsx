import React from "react";
import ReactDOM from "react-dom/client";
import App from "./modules/application/App";

const root = ReactDOM.createRoot(document.getElementById("root")!); // ! -> To tell TS that the root element is there.

root.render(<App />);
