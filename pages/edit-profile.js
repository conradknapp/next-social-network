import React from "react";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import CloudUpload from "@material-ui/icons/CloudUpload";
import { withStyles } from "@material-ui/core/styles";
import {
  getUserProfile,
  updateUserProfile,
  authInitialProps
} from "../lib/auth";
import Router from "next/router";

class EditProfile extends React.Component {
  state = {
    _id: "",
    name: "",
    about: "",
    photo: "",
    email: "",
    password: "",
    error: "",
    loading: false
  };

  componentDidMount() {
    const { userId } = this.props;
    this.userData = new FormData();
    getUserProfile(userId).then(user =>
      this.setState({ ...this.state, ...user })
    );
  }

  handleSubmit = () => {
    this.setState({ loading: true });
    updateUserProfile(this.userData, this.state._id).then(data => {
      Router.replace(`/profile/${this.state._id}`);
    });
  };

  handleChange = event => {
    const value =
      event.target.name === "photo"
        ? event.target.files[0]
        : event.target.value;
    this.userData.set(event.target.name, value);
    this.setState({ [event.target.name]: value });
  };

  render() {
    const { classes } = this.props;
    // prettier-ignore
    const { _id, name, password, email, about, error, photo, loading } = this.state;
    const photoUrl = _id
      ? `/api/users/photo/${_id}?${Date.now()}`
      : "/api/users/defaultphoto";
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" className={classes.title}>
            Edit Profile
          </Typography>
          <Avatar src={photoUrl} className={classes.bigAvatar} />
          <br />
          <input
            accept="image/*"
            name="photo"
            onChange={this.handleChange}
            className={classes.input}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="default" component="span">
              Upload <CloudUpload />
            </Button>
          </label>{" "}
          <span className={classes.filename}>{photo ? photo.name : ""}</span>
          <br />
          <TextField
            id="name"
            label="Name"
            name="name"
            className={classes.textField}
            value={name}
            onChange={this.handleChange}
            margin="normal"
          />
          <br />
          <TextField
            id="multiline-flexible"
            label="About"
            multiline
            name="about"
            rows="2"
            value={about}
            onChange={this.handleChange}
            className={classes.textField}
            margin="normal"
          />
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
        <CardActions className={classes.wrapper}>
          <Button
            color="primary"
            variant="contained"
            disabled={loading}
            onClick={this.handleSubmit}
            className={classes.submit}
          >
            Submit
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </CardActions>
      </Card>
    );
  }
}

EditProfile.getInitialProps = authInitialProps(false, true);

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.protectedTitle
  },
  error: {
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
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto"
  },
  input: {
    display: "none"
  },
  filename: {
    marginLeft: "10px"
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: "relative"
  }
});

export default withStyles(styles)(EditProfile);
