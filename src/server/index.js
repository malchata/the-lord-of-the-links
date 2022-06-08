// Built-ins
import { readFile } from "fs";
import { resolve } from "path";

// Vendors
import bodyParser from "body-parser";
import express from "express";
import compression from "compression";
import enforceTLS from "express-sslify";
import { h, Fragment } from "preact";

// App-specific
import data from "Data/index.js";
import html from "Helpers/html.js";
import Home from "Layouts/Home.jsx";

// Init express app
const app = express();

// Specify caching routine
const staticOptions = {
  setHeaders: res => {
    res.set("Cache-Control", "max-age=31557600,public,immutable");
  }
};

// Check if we're on prod
if (process.env.NODE_ENV === "production") {
  // Use compression.
  app.use(compression());

  // Force TLS
  app.use(enforceTLS.HTTPS({
    trustProtoHeader: true
  }));
}

// Static content paths
app.use("/js", express.static(resolve(process.cwd(), "dist", "client", "js"), staticOptions));
app.use("/css", express.static(resolve(process.cwd(), "dist", "client", "css"), staticOptions));

// Parse application/json for POST requests
app.use(bodyParser.json());

// Spin up web server
app.listen(process.env.PORT || 8080, () => {
  const assetManifestPath = resolve(process.cwd(), "dist", "server", "assets.json");

  readFile(assetManifestPath, (error, manifestData) => {
    if (error) {
      throw error;
    }

    app.get("/", (req, res) => {
      res.set("Cache-Control", "max-age=0,s-maxage=0,private,no-store,no-cache");

      const metadata = {
        title: "The Lord of The Links",
        metaTags: [
          {
            name: "description",
            content: "One input responsiveness demo to rule them all."
          }
        ]
      };

      const markup = html(metadata, "/", <Home />, JSON.parse(manifestData.toString()));

      res.set("Content-Type", "text/html");
      res.status(200);
      res.send(markup);
    });

    app.post("/search/", (req, res) => {
      res.set("Cache-Control", "max-age=0,s-maxage=0,private,no-store,no-cache");


      console.dir(req.body);
    });
  });
});
