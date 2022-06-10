// Vendors
import { h, render, Component, hydrate } from "preact";
import { onINP } from "web-vitals";

// App-specific
import Home from "Layouts/Home.jsx";

// Base styles
import "Styles/_vars.css";
import "Styles/_reset.css";

// Hydrate!
hydrate(<Home />, document.getElementById("app"));

// Track INP
function reportINP ({ name, value, entries }) {
  console.log(`INP recorded: ${value}`);
}

if ("requestIdleCallback" in window) {
  requestIdleCallback(() => {
    onINP(reportINP);
  });
} else {
  onINP(reportINP);
}
