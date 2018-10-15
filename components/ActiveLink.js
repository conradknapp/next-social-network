import { withRouter } from "next/router";

const ActiveLink = ({ children, router, href }) => {
  const style = {
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
