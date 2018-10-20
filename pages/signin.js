import React from "react";
// prettier-ignore
import { Typography, Card, CardContent, CardActions, TextField, Icon, Button, withStyles } from '@material-ui/core';
import Router from "next/router";

import { signinUser, authInitialProps } from "../lib/auth";

class Signin extends React.Component {
  state = {
    email: "",
    password: "",
    error: ""
  };

  handleSubmit = () => {
    const user = {
      email: this.state.email,
      password: this.state.password
    };
    this.setState({ error: "" });
    signinUser(user)
      .then(() => Router.push("/"))
      .catch(this.setError);
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  setError = err => {
    const errorMessage = (err.response && err.response.data) || err.message;
    this.setState({ error: errorMessage.error });
  };

  render() {
    const { classes } = this.props;
    const { email, password, error } = this.state;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" variant="h4" className={classes.title}>
            Sign In
          </Typography>
          <TextField
            id="email"
            type="email"
            label="Email"
            name="email"
            className={classes.textField}
            value={email}
            onChange={this.handleChange}
            margin="normal"
          />
          <br />
          <TextField
            id="password"
            type="password"
            label="Password"
            name="password"
            className={classes.textField}
            value={password}
            onChange={this.handleChange}
            margin="normal"
          />
          <br />{" "}
          {error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleSubmit}
            className={classes.submit}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
    );
  }
}

Signin.getInitialProps = authInitialProps(true);

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2
  },
  error: {
    verticalAlign: "middle"
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(Signin);
