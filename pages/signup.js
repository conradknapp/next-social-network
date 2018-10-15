import React from "react";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import Link from "next/link";

// import { sendRequest } from "../lib/index";

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

  handleSubmit = async () => {
    const user = {
      name: this.state.name,
      password: this.state.password,
      email: this.state.email
    };
    const newUser = await sendRequest("/api/auth/signup", user);
    if (newUser) {
      this.setState({
        error: "",
        open: true
      });
    }
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
