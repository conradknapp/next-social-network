import React from "react";
// prettier-ignore
import { Typography, Avatar, FormControl, Paper, Input, InputLabel, Button, Snackbar, withStyles } from '@material-ui/core';
import { Lock } from "@material-ui/icons";
import Router from "next/router";

import { signinUser, authInitialProps } from "../lib/auth";

class Signin extends React.Component {
  state = {
    email: "",
    password: "",
    error: "",
    open: false,
    loading: false
  };

  handleSubmit = () => {
    this.setState({ error: "", loading: true });
    const userPayload = {
      email: this.state.email,
      password: this.state.password
    };
    signinUser(userPayload)
      .then(() => {
        Router.push("/");
      })
      .catch(err => {
        this.showError(err);
      });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  showError = err => {
    const error = (err.response && err.response.data) || err.message;
    this.setState({ error, open: true, loading: false });
  };

  closeDialog = () => this.setState({ open: false });

  render() {
    const { classes } = this.props;
    const { error, open, loading } = this.state;

    return (
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Lock />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
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
              onClick={this.handleSubmit}
              disabled={loading}
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign in
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
              onClose={this.closeDialog}
              autoHideDuration={6000}
              message={<span className={classes.snack}>{error}</span>}
            />
          )}
        </Paper>
      </div>
    );
  }
}

Signin.getInitialProps = authInitialProps();

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
  }
});

export default withStyles(styles)(Signin);
