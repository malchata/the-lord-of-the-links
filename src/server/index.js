// Built-ins
import { readFile } from "fs";
import { resolve } from "path";

// Vendors
import express from "express";
import compression from "compression";
import enforceTLS from "express-sslify";
import { h } from "preact";

// App-specific
import html from "Helpers/html";
import Home from "Components/Home";

// Init express app
const app = express();
let renderCache = {};

// Specify caching routine
const staticOptions = {
  setHeaders: res => {
    res.set("Cache-Control", "max-age=31557600,public,immutable");
  }
};

// Use compression.
app.use(compression());

// Force TLS if in prod and minify HTML
if (process.env.NODE_ENV === "production") {
  app.use(enforceTLS.HTTPS({
    trustProtoHeader: true
  }));
}

// Static content paths
app.use("/js", express.static(resolve(process.cwd(), "dist", "client", "js"), staticOptions));
app.use("/css", express.static(resolve(process.cwd(), "dist", "client", "css"), staticOptions));

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

      const html = html(metadata, "/", <Home />, JSON.parse(manifestData.toString()));

      res.set("Content-Type", "text/html");
      res.status(200);
      res.send(html);
    });

    app.post("/search", (req, res) => {
      res.set("Cache-Control", "max-age=0,s-maxage=0,private,no-store,no-cache");

      // TODO
    });
  });
});
