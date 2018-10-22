import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { ShareOutlined, Face } from "@material-ui/icons";

import ActiveLink from "./ActiveLink";
import { signoutUser } from "../lib/auth";

const Header = ({ pageProps: { auth } }) => (
  <AppBar position="static">
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
              My Profile <Face />
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
