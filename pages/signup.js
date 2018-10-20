import React from "react";
// prettier-ignore
import { Typography, Card, CardContent, CardActions, TextField, Icon, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles} from '@material-ui/core';

import Link from "next/link";
import { signupUser } from "../lib/auth";

class Signup extends React.Component {
  state = {
    name: "",
    password: "",
    email: "",
    open: false,
    error: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = () => {
    const user = {
      name: this.state.name,
      password: this.state.password,
      email: this.state.email
    };
    signupUser(user).then(() => {
      this.setState({ error: "", open: true });
    });
  };

  render() {
    const { classes } = this.props;
    const { name, email, password, open, error } = this.state;

    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h4" className={classes.title}>
              Sign Up
            </Typography>
            <TextField
              id="name"
              label="Name"
              name="name"
              className={classes.textField}
              value={name}
              onChange={this.handleChange}
              margin="normal"
            />{" "}
            <br />
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
            <br />
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

        {/* Signup Dialog */}
        <Dialog open={open} disableBackdropClick={true}>
          <DialogTitle>New Account</DialogTitle>
          <DialogContent>
            <DialogContentText>
              New account successfully created!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Link href="/signin">
              <Button color="primary" autoFocus="autoFocus" variant="contained">
                Sign In
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

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

export default withStyles(styles)(Signup);
