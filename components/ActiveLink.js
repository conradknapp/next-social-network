import { Component } from "react";
import { withRouter } from "next/router";

class ActiveLink extends Component {
  componentDidMount() {
    const { router, href } = this.props;
    router.prefetch(href);
    // console.log(`prefetching ${href}`);
  }

  handleClick = event => {
    const { href, router } = this.props;
    event.preventDefault();
    router.push(href);
  };

  render() {
    const { children, href, router } = this.props;
    const isCurrentPath = router.pathname === href || router.asPath === href;
    return (
      <div>
        <a
          href={href}
          onClick={this.handleClick}
          style={{
            textDecoration: "none",
            fontWeight: isCurrentPath ? "bold" : "normal",
            color: isCurrentPath ? "red" : "black"
          }}
        >
          {children}
        </a>
      </div>
    );
  }
}

export default withRouter(ActiveLink);
