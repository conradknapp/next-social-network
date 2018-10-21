import React from "react";
// prettier-ignore
import { Typography, Card, CardContent, CardActions, TextField, Icon, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles, Slide } from '@material-ui/core';
import { Face } from "@material-ui/icons";

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
    error: "",
    createdUser: ""
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
    signupUser(user)
      .then(createdUser => {
        console.log(createdUser);
        this.setState({ error: "", open: true, createdUser });
      })
      .catch(err => {
        this.setError(err);
      });
  };

  setError = err => {
    const errorMessage = (err.response && err.response.data) || err.message;
    console.log(errorMessage);
    this.setState({ error: errorMessage.error });
  };

  render() {
    const { classes } = this.props;
    const { createdUser, name, email, password, open, error } = this.state;

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
        <Dialog
          open={open}
          disableBackdropClick={true}
          TransitionComponent={Transition}
        >
          <DialogTitle>
            <Face className={classes.icon} />
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
  icon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle"
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
