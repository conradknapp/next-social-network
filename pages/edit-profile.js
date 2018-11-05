import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Snackbar from "@material-ui/core/Snackbar";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CloudUpload from "@material-ui/icons/CloudUpload";
import FaceTwoTone from "@material-ui/icons/FaceTwoTone";
import EditSharp from "@material-ui/icons/EditSharp";
import Router from "next/router";

import { authInitialProps } from "../lib/auth";
import { updateUser, getAuthUser } from "../lib/api";

class EditProfile extends React.Component {
  state = {
    _id: "",
    name: "",
    about: "",
    avatar: "",
    avatarPreview: "",
    email: "",
    error: "",
    updatedUser: null,
    openSuccess: false,
    openError: false,
    isLoading: true,
    isSaving: false
  };

  componentDidMount() {
    const { auth } = this.props;

    this.userData = new FormData();
    getAuthUser(auth.user._id)
      .then(user => {
        this.setState({ ...user, isLoading: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ isLoading: false });
      });
  }

  createPreviewImage = file => URL.createObjectURL(file);

  handleChange = event => {
    let inputValue;

    if (event.target.name === "avatar") {
      inputValue = event.target.files[0];
      this.setState({ avatarPreview: this.createPreviewImage(inputValue) });
    } else {
      inputValue = event.target.value;
    }
    this.userData.set(event.target.name, inputValue);
    this.setState({ [event.target.name]: inputValue });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ isSaving: true });
    updateUser(this.state._id, this.userData)
      .then(updatedUser => {
        this.setState({ updatedUser, openSuccess: true });
        setTimeout(() => Router.push(`/profile/${this.state._id}`), 6000);
      })
      .catch(this.showError);
  };

  showError = err => {
    const error = (err.response && err.response.data) || err.message;
    this.setState({ error, openError: true, isSaving: false });
  };

  handleClose = () => this.setState({ openError: false });

  render() {
    const { classes } = this.props;
    // prettier-ignore
    const { name, email, about, error, avatar, avatarPreview, isLoading, isSaving, updatedUser, openSuccess, openError } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <EditSharp />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit Profile
          </Typography>

          {/* Edit Profile Form */}
          <form onSubmit={this.handleSubmit} className={classes.form}>
            {isLoading ? (
              <Avatar className={classes.bigAvatar}>
                <FaceTwoTone />
              </Avatar>
            ) : (
              <Avatar
                src={avatarPreview || avatar}
                className={classes.bigAvatar}
              />
            )}
            <input
              id="avatar"
              accept="image/*"
              name="avatar"
              onChange={this.handleChange}
              className={classes.input}
              type="file"
            />
            <label htmlFor="avatar" className={classes.uploadButton}>
              <Button variant="contained" color="secondary" component="span">
                Upload Image <CloudUpload />
              </Button>
            </label>
            <span className={classes.filename}>{avatar && avatar.name}</span>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                name="name"
                type="text"
                value={name}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel htmlFor="about">About</InputLabel>
              <Input
                name="about"
                type="text"
                name={about}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                onChange={this.handleChange}
                name="email"
                value={email}
                type="email"
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              disabled={isSaving || isLoading}
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </form>

          {/* Error Snackbar */}
          {error && (
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              open={openError}
              onClose={this.handleClose}
              autoHideDuration={6000}
              message={<span className={classes.snack}>{error}</span>}
            />
          )}
        </Paper>

        {/* Success Dialog */}
        <Dialog open={openSuccess} disableBackdropClick={true}>
          <DialogTitle>
            <VerifiedUserTwoTone className={classes.icon} />
            Profile Updated
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              User {updatedUser && updatedUser.name} was successfully updated!
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

// EditProfile is a protected route
EditProfile.getInitialProps = authInitialProps(true);

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
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto"
  },
  uploadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0.25em"
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2
  },
  signinLink: {
    textDecoration: "none",
    color: "white"
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
  },
  input: {
    display: "none"
  }
});

export default withStyles(styles)(EditProfile);
