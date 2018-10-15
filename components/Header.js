import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";
import ActiveLink from "./ActiveLink";
import { signoutUser } from "../lib/auth";

const Header = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h5">Next Social</Typography>
      <ActiveLink href="/">
        <IconButton aria-label="Home">
          <HomeIcon />
        </IconButton>
      </ActiveLink>
      <ActiveLink href="/signup">
        <Button>Sign up</Button>
      </ActiveLink>
      <ActiveLink href="/signin">
        <Button>Sign In</Button>
      </ActiveLink>
      <ActiveLink href="/profile">
        <Button>My Profile</Button>
      </ActiveLink>
      <Button color="inherit" onClick={signoutUser}>
        Sign out
      </Button>
    </Toolbar>
  </AppBar>
);

export default Header;
