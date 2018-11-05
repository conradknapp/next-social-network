import { withRouter } from "next/router";

const ActiveLink = ({ router, href, children }) => {
  (function prefetchPages() {
    if (typeof window !== "undefined") {
      // want to avoid prefetching any dynamic routes (will be an error in production)
      router.prefetch(router.pathname);
      // console.log(`prefetching ${router.pathname}`);
    }
  })();

  const handleClick = event => {
    event.preventDefault();
    router.push(href);
  };

  const isCurrentPath = router.pathname === href || router.asPath === href;

  return (
    <div>
      <a
        href={href}
        onClick={handleClick}
        style={{
          textDecoration: "none",
          margin: 0,
          padding: 0,
          fontWeight: isCurrentPath ? "bold" : "normal",
          color: isCurrentPath ? "#c62828" : "#fff"
        }}
      >
        {children}
      </a>
    </div>
  );
};

// You can add prefetch prop to any <Link> and Next.js will prefetch those pages in the background.
// The router instance should be only used inside the client side of your app though. In order to prevent any error regarding this subject, when rendering the Router on the server side, use the imperatively prefetch method in the componentDidMount() lifecycle method.

export default withRouter(ActiveLink);
