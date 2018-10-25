import React from "react";
// prettier-ignore
import { Card, Button, CardActions, CardContent, TextField, Typography, Avatar, withStyles } from '@material-ui/core';
import { CloudUpload, FaceTwoTone } from "@material-ui/icons";
import Router from "next/router";

import { getAuthUser, updateUser, authInitialProps } from "../lib/auth";

class EditProfile extends React.Component {
  state = {
    _id: "",
    name: "",
    about: "",
    photo: "",
    email: "",
    password: "",
    error: "",
    loading: true,
    isSaving: false
  };

  componentDidMount() {
    const { auth } = this.props;
    this.userData = new FormData();
    getAuthUser(auth.user._id)
      .then(user => {
        console.log(user);
        this.setState({ ...user, loading: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false });
      });
  }

  handleSubmit = () => {
    this.setState({ isSaving: true });
    // const updateUserPayload = {
    //   userData: this.userData,
    //   userId: this.state._id
    // };
    updateUser(this.state._id, this.userData).then(() => {
      Router.replace(`/profile/${this.state._id}`);
    });
  };

  handleChange = event => {
    const inputValue =
      event.target.name === "photo"
        ? event.target.files[0]
        : event.target.value;
    this.userData.set(event.target.name, inputValue);
    this.setState({ [event.target.name]: inputValue });
  };

  render() {
    const { classes } = this.props;
    // prettier-ignore
    const { _id, name, password, email, about, error, photo, loading, isSaving } = this.state;
    const photoUrl = _id
      ? `/api/users/image/${_id}?${Date.now()}`
      : "/api/users/defaultimage";
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" className={classes.title}>
            Edit Profile
          </Typography>
          {loading ? (
            <Avatar className={classes.bigAvatar}>
              <FaceTwoTone />
            </Avatar>
          ) : (
            <Avatar src={photoUrl} className={classes.bigAvatar} />
          )}
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
            <Button variant="contained" color="secondary" component="span">
              Upload Image <CloudUpload />
            </Button>
          </label>{" "}
          <span className={classes.filename}>{photo && photo.name}</span>
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
          {/* {error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {error}
            </Typography>
          )} */}
        </CardContent>
        <CardActions className={classes.wrapper}>
          <Button
            color="primary"
            variant="contained"
            disabled={loading || isSaving}
            onClick={this.handleSubmit}
            className={classes.submit}
          >
            {isSaving ? "Saving" : "Save"}
          </Button>
        </CardActions>
      </Card>
    );
  }
}

EditProfile.getInitialProps = authInitialProps(true);

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
  }
});

export default withStyles(styles)(EditProfile);
