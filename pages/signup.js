import React from "react";
// prettier-ignore
import { Typography, Avatar, FormControl, Paper, Input, InputLabel, Button, Snackbar, withStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
import { Gavel, VerifiedUserTwoTone } from "@material-ui/icons";

import Link from "next/link";
import { signupUser } from "../lib/auth";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Signup extends React.Component {
  state = {
    name: "",
    password: "",
    email: "",
    open: false,
    openSuccess: false,
    loading: false,
    error: "",
    createdUser: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ error: "", loading: false });
    const user = {
      name: this.state.name,
      password: this.state.password,
      email: this.state.email
    };
    signupUser(user)
      .then(createdUser => {
        console.log(createdUser);
        this.setState({
          error: "",
          openSuccess: true,
          createdUser,
          loading: false
        });
      })
      .catch(err => {
        this.showError(err);
      });
  };

  showError = err => {
    const error = (err.response && err.response.data) || err.message;
    console.log(error);
    this.setState({ error, open: true, loading: false });
  };

  handleClose = () => this.setState({ open: false });

  render() {
    const { classes } = this.props;
    const { createdUser, open, error, loading, openSuccess } = this.state;

    return (
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Gavel />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form onSubmit={this.handleSubmit} className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                id="name"
                name="name"
                // autoComplete="name"
                onChange={this.handleChange}
                // autoFocus
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                name="email"
                // autoComplete="name"
                onChange={this.handleChange}
                // autoFocus
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                onChange={this.handleChange}
                name="password"
                type="password"
                id="password"
                // autoComplete="current-password"
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {loading ? "Signing up..." : "Sign up"}
            </Button>
          </form>

          {/* Error Snackbar */}
          {error.length > 0 && (
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              open={open}
              onClose={this.handleClose}
              autoHideDuration={6000}
              message={
                <span className={classes.snack}>
                  {error.map(err => (
                    <li>{err}</li>
                  ))}
                </span>
              }
            />
          )}
        </Paper>

        {/* Success Dialog */}
        <Dialog
          open={openSuccess}
          disableBackdropClick={true}
          TransitionComponent={Transition}
        >
          <DialogTitle>
            <VerifiedUserTwoTone className={classes.icon} />
            New Account
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              User {createdUser} successfully created!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" autoFocus="autoFocus" variant="contained">
              <Link href="/signin">
                <a>Sign In</a>
              </Link>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const styles = theme => ({
  layout: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
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
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
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
  },
  icon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle"
  }
});

export default withStyles(styles)(Signup);
