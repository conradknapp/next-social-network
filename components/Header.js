import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  withStyles
} from "@material-ui/core";
import { ShareOutlined, Face } from "@material-ui/icons";

import ActiveLink from "./ActiveLink";
import { signoutUser } from "../lib/auth";

const Header = ({ router, pageProps: { auth }, classes }) => (
  <AppBar
    position={router.pathname === "/" ? "fixed" : "static"}
    className={classes.appBar}
  >
    <Toolbar>
      <ActiveLink href="/">
        <ShareOutlined />
      </ActiveLink>
      <Typography variant="h5">
        <ActiveLink href="/">Next Social</ActiveLink>
      </Typography>
      {auth && auth.user && auth.user._id ? (
        <div>
          <Button>
            <ActiveLink href={`/profile/${auth.user._id}`}>
              Profile <Face />
            </ActiveLink>
          </Button>
          <Button color="inherit" onClick={signoutUser}>
            Sign out
          </Button>
        </div>
      ) : (
        <div>
          <Button>
            <ActiveLink href="/signin">Sign In</ActiveLink>
          </Button>
          <Button>
            <ActiveLink href="/signup">Sign up</ActiveLink>
          </Button>
        </div>
      )}
    </Toolbar>
  </AppBar>
);

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  }
});

export default withStyles(styles)(Header);
