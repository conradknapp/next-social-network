import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { withStyles } from "@material-ui/core/styles";
import { create, authInitialProps } from "../../lib/auth";

class NewPost extends React.Component {
  state = {
    text: "",
    photo: "",
    error: "",
    user: {}
  };

  componentDidMount() {
    const { auth } = this.props;
    this.postData = new FormData();
    this.setState({ user: auth.user });
  }

  clickPost = () => {
    const { auth, addUpdate } = this.props;

    create(auth.user._id, this.postData).then(data => {
      this.setState({ text: "", photo: "" });
      addUpdate(data);
    });
  };

  handleChange = event => {
    const value =
      event.target.name === "photo"
        ? event.target.files[0]
        : event.target.value;
    this.postData.set(event.target.name, value);
    this.setState({ [event.target.name]: value });
  };

  render() {
    const { classes } = this.props;
    const { user, text, photo, error } = this.state;

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardHeader
            avatar={<Avatar src={`/api/users/photo/${user._id}`} />}
            title={user.name}
            className={classes.cardHeader}
          />
          <CardContent className={classes.cardContent}>
            <TextField
              placeholder="Share your thoughts ..."
              multiline
              rows="3"
              value={text}
              name="text"
              onChange={this.handleChange}
              className={classes.textField}
              margin="normal"
            />
            <input
              accept="image/*"
              name="photo"
              onChange={this.handleChange}
              className={classes.input}
              id="icon-button-file"
              type="file"
            />
            <label htmlFor="icon-button-file">
              <IconButton
                color="secondary"
                className={classes.photoButton}
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>{" "}
            <span className={classes.filename}>{photo ? photo.name : ""}</span>
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
              disabled={!text}
              onClick={this.clickPost}
              className={classes.submit}
            >
              POST
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    backgroundColor: "#efefef",
    padding: `${theme.spacing.unit * 3}px 0px 1px`
  },
  card: {
    maxWidth: 600,
    margin: "auto",
    marginBottom: theme.spacing.unit * 3,
    backgroundColor: "rgba(65, 150, 136, 0.09)",
    boxShadow: "none"
  },
  cardContent: {
    backgroundColor: "white",
    paddingTop: 0,
    paddingBottom: 0
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8
  },
  photoButton: {
    height: 30,
    marginBottom: 5
  },
  input: {
    display: "none"
  },
  textField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    width: "90%"
  },
  submit: {
    margin: theme.spacing.unit * 2
  },
  filename: {
    verticalAlign: "super"
  }
});

export default withStyles(styles)(NewPost);
