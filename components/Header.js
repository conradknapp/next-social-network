import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";
import ActiveLink from "./ActiveLink";
import { signoutUser } from "../lib/auth";

const Header = ({ pageProps: { auth } }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h5">Next Social</Typography>
      <IconButton aria-label="Home">
        <ActiveLink href="/">
          <HomeIcon />
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
            <ActiveLink href="/signup">Sign up</ActiveLink>
          </Button>
          <Button>
            <ActiveLink href="/signin">Sign In</ActiveLink>
          </Button>
        </div>
      )}
    </Toolbar>
  </AppBar>
);

export default Header;
