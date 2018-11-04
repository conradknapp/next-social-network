import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import withStyles from "@material-ui/core/styles/withStyles";
import Lock from "@material-ui/icons/Lock";
import Router from "next/router";

import { signinUser } from "../lib/auth";

class Signin extends React.Component {
  state = {
    email: "reed@gmail.com",
    password: "reeder",
    error: "",
    open: false,
    isLoading: false
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ error: "", isLoading: true });
    const user = {
      email: this.state.email,
      password: this.state.password
    };
    signinUser(user)
      .then(() => {
        Router.push("/");
      })
      .catch(this.showError);
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  showError = err => {
    const error = (err.response && err.response.data) || err.message;
    this.setState({ error, open: true, isLoading: false });
  };

  handleClose = () => this.setState({ open: false });

  render() {
    const { classes } = this.props;
    const { error, open, isLoading, email, password } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Lock />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={this.handleSubmit} className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                onChange={this.handleChange}
                name="password"
                type="password"
                id="password"
                value={password}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              onClick={this.handleSubmit}
              disabled={isLoading}
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Error Snackbar */}
          {error && (
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              open={open}
              onClose={this.handleClose}
              autoHideDuration={6000}
              message={<span className={classes.snack}>{error}</span>}
            />
          )}
        </Paper>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.protectedTitle
  }
});

export default withStyles(styles)(Signin);
