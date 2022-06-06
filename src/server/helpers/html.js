// Vendors
import render from "preact-render-to-string";

export default function (metadata, route, component, assets) {
  const scriptMarkup = Object.keys(assets).map(assetKey => `
    <script type="module" src="${assets[assetKey].js}"></script>
  `);

  return `
    <!DOCTYPE html>
    <html class="no-js" lang="en" dir="ltr">
      <head>
        <title>The Lord of The Links</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        ${metadata.metaTags.map(metaTag => `<meta${Object.keys(metaTag).map(metaTagAttribute => ` ${metaTagAttribute}="${metaTag[metaTagAttribute]}"`).join("")}>`).join("")}
        <script>document.documentElement.classList.remove("no-js")</script>
        <link rel="stylesheet" href="${assets.home.css}">
      </head>
      <body>
        <main id="app">${render(component)}</main>
        <script defer src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver%2CIntersectionObserverEntry"></script>
        ${scriptMarkup}
      </body>
    </html>
  `;
}
