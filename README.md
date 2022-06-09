# The Lord of The Links

One input responsiveness demo to rule them all.

## What is this?

The [Interaction to Next Paint (INP) metric](https://web.dev/inp/) metric is an experimental responsiveness metric that records the total interaction latency of all click, tap, and keyboard events on a page. This input responsiveness demo is a companion toy app for the [Optimize INP guide on web.dev](https://web.dev/optimize-inp/) designed to help you profile and understand which phase of an interaction inputs are spending the most time.

## How do I run it?

Do the following:

1. `git clone git@github.com:malchata/the-lord-of-the-links.git` in a directory of your choosing.
2. `npm install`.
3. `npm run preview`.
4. Open your browser to `http://localhost:8080/` (assuming port 8080 is available).

## What next?

You'll see a simple page with a title graphic and a text input. The text input searches all pages available on the [Tolkien Gateway](http://www.tolkiengateway.net/wiki/Main_Page) by title. For example, type "numenor" or "elrond" and watch the results filter in as the information is requested from a back end API. As you interact with the demo, follow the instructions in the [Optimize INP](https://web.dev/optimize-inp/) guide.

## Debugger mode

To open the app's debugger, type "debug" into the search field to toggle it open. You'll see options for input throttling, generating synthetic main thread work, and toggling useful console logs.
