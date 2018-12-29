import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { Drizzle, generateStore } from "drizzle";
import Profiles from "./contracts/Profiles.json";

// let drizzle know what contracts we want
const options = { contracts: [Profiles] };

// setup the drizzle store and drizzle
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(<App />, document.getElementById("root"));

// pass in the drizzle instance
ReactDOM.render(<App drizzle={drizzle} />, document.getElementById("root"));
registerServiceWorker();
