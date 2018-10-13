import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";
import Link from "next/link";

const Header = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h5">Next Social</Typography>
      <Link href="/">
        <IconButton aria-label="Home">
          <HomeIcon />
        </IconButton>
      </Link>
      <Link href="/signup">
        <Button>Sign up</Button>
      </Link>
      <Link href="/signin">
        <Button>Sign In</Button>
      </Link>
      <Link href="/about">
        <Button>My Profile</Button>
      </Link>
      <Button color="inherit">Sign out</Button>
    </Toolbar>
  </AppBar>
);

export default Header;
