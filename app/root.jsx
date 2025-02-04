import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta
          name="shopify-api-key"
          content="09585d83a6e6bdfb212dc6265530bf64"
        />
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
        {/* <script src="https://cdn.shopify.com/shopifycloud/app-bridge/v1.0.0/app-bridge.js"></script> */}

        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
