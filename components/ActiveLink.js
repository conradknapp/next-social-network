import { withRouter } from "next/router";

const ActiveLink = ({ children, router, href }) => {
  const style = {
    fontWeight: router.pathname === href ? "bold" : "normal",
    textDecoration: "none",
    color: router.pathname === href ? "red" : "black"
  };

  const handleClick = event => {
    event.preventDefault();
    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  );
};

export default withRouter(ActiveLink);
