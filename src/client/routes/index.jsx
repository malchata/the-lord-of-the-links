// Vendors
import { h, render, Component, hydrate } from "preact";

// App-specific
import Home from "Layouts/Home.jsx";

// Base styles
import "Styles/_vars.css";
import "Styles/_reset.css";

// Hydrate!
hydrate(<Home />, document.getElementById("app"));
