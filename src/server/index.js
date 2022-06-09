// Built-ins
import { readFile } from "fs";
import { resolve } from "path";

// Vendors
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
app.use(express.json());

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

    app.post("/search/", ({ body }, res) => {
      res.set("Content-Type", "application/json");
      res.set("Cache-Control", "max-age=0,s-maxage=0,private,no-store,no-cache");

      const query = body.query.toLowerCase();
      const rawData = Object.entries(data).filter(([ title ]) => {
        const lowerCaseTitle = title.toLowerCase();
        const normalizedTitle = lowerCaseTitle.normalize("NFKD").replace(/[^\w\s]/g, "");

        return lowerCaseTitle.startsWith(query);
      }).slice(0, 10);
      let results = {};

      rawData.forEach(([title, link]) => {
        results[title] = link;
      });

      res.status(200);
      res.send(JSON.stringify(results));
    });
  });
});
