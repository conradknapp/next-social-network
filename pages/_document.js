import React from "react";
import Document, { Head, Main, NextScript } from "next/document";
// styled-jsx included in Next.js by default
import flush from "styled-jsx/server";

import { getServerSideToken, getUserScript } from "../lib/auth";

class MyDocument extends Document {
  render() {
    const { pageContext, user = {} } = this.props;

    return (
      <html lang="en" dir="ltr">
        <Head>
          {/* You can use the head tag, just not for setting <title> as it leads to unexpected behavior */}
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={pageContext.theme.palette.primary.main}
          />
        </Head>
        <body>
          <Main />
          <script dangerouslySetInnerHTML={{ __html: getUserScript(user) }} />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = ctx => {
  // const documentProps = await Document.getInitialProps(ctx);
  const user = getServerSideToken(ctx.req);

  // Render app and page and get the context of the page with collected side effects.
  let pageContext;
  const page = ctx.renderPage(Component => {
    const WrappedComponent = props => {
      pageContext = props.pageContext;
      return <Component {...props} />;
    };
    return WrappedComponent;
  });

  return {
    // ...documentProps,
    user,
    ...page,
    pageContext,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: (
      <React.Fragment>
        <style
          id="jss-server-side"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: pageContext.sheetsRegistry.toString()
          }}
        />
        {flush() || null}
      </React.Fragment>
    )
  };
};

export default MyDocument;
