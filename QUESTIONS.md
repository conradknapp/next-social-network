How do we use Material UI styles with SSR?

We need to inject our CSS into the HTML otherwise the page will render with just the HTML then wait for the CSS to be injected by the client, causing it to flicker. To inject the style down to the client, we need to:

1. Create a fresh, new sheetsRegistry and theme instance on every request.
2. Render the React tree with the server-side API and the instance.
3. Pull the CSS out of the sheetsRegistry.
4. Pass the CSS along to the client.

What does SheetRegistry do?

- When rendering on the server, you will need to get all rendered styles as a CSS string. The SheetsRegistry class allows you to manually aggregate and stringify them

What is JSS?

- Material-UI's styling solution uses JSS at its core. It's a high performance JS to CSS compiler which works at runtime and server-side

What does the url encoded method of bodyParser do?

- Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST) and exposes the resulting object (containing the keys and values) on req.body. [See more](https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express)
