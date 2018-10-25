import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  withStyles
} from "@material-ui/core";
import {
  ShareOutlined,
  Face,
  Gavel,
  Lock,
  ExitToApp
} from "@material-ui/icons";

import ActiveLink from "./ActiveLink";
import { signoutUser } from "../lib/auth";

const Navbar = ({ router, pageProps: { auth }, classes }) => (
  <AppBar
    position={router.pathname === "/" ? "fixed" : "static"}
    className={classes.appBar}
  >
    <Toolbar>
      {/* Main Title / Home Button */}
      <ActiveLink href="/">
        <ShareOutlined className={classes.icon} />
      </ActiveLink>
      <Typography variant="h5" component="h1" className={classes.toolbarTitle}>
        <ActiveLink href="/">NextConnect</ActiveLink>
      </Typography>

      {auth && auth.user && auth.user._id ? (
        <div>
          <Button>
            <ActiveLink href={`/profile/${auth.user._id}`}>Profile</ActiveLink>
          </Button>
          <Button variant="outlined" onClick={signoutUser}>
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
    // z-index 1 higher than the fixed drawer in home page to clip it under the navigation
    zIndex: theme.zIndex.drawer + 1
  },
  toolbarTitle: {
    flex: 1
  },
  icon: {
    marginRight: theme.spacing.unit
  }
});

export default withStyles(styles)(Navbar);
