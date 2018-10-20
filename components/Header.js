import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from "@material-ui/core";
import { Home } from "@material-ui/icons";

import ActiveLink from "./ActiveLink";
import { signoutUser } from "../lib/auth";

const Header = ({ pageProps: { auth } }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h5">
        <ActiveLink href="/">Next Social</ActiveLink>
      </Typography>
      <IconButton aria-label="Home">
        <ActiveLink href="/">
          <Home />
        </ActiveLink>
      </IconButton>
      {auth && auth.user && auth.user._id ? (
        <div>
          <Button>
            <ActiveLink href={`/profile/${auth.user._id}`}>
              My Profile
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

export default Header;
