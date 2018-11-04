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
    email: "",
    password: "",
    error: "",
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

  handleSubmit = () => {
    this.setState({ isSaving: true });
    updateUser(this.state._id, this.userData).then(() => {
      Router.push(`/profile/${this.state._id}`);
    });
  };

  handleChange = event => {
    const inputValue =
      event.target.name === "avatar"
        ? event.target.files[0]
        : event.target.value;
    this.userData.set(event.target.name, inputValue);
    this.setState({ [event.target.name]: inputValue });
  };

  render() {
    const { classes } = this.props;
    // prettier-ignore
    const { _id, name, password, email, about, error, avatar, isLoading, isSaving } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <EditSharp />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit Profile
          </Typography>
          <form onSubmit={this.handleSubmit} className={classes.form}>
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
        {/* <Dialog
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
            <Button color="primary" variant="contained">
              <Link href="/signin">
                <a className={classes.signinLink}>Sign In</a>
              </Link>
            </Button>
          </DialogActions>
        </Dialog> */}
      </div>
    );
    // return (
    //   <Card className={classes.card}>
    //     <CardContent>
    //       <Typography variant="h4" className={classes.title}>
    //         Edit Profile
    //       </Typography>
    //       {isLoading ? (
    //         <Avatar className={classes.bigAvatar}>
    //           <FaceTwoTone />
    //         </Avatar>
    //       ) : (
    //         <Avatar
    //           src={avatar}
    //           className={classes.bigAvatar}
    //         />
    //       )}
    //       <input
    //         accept="image/*"
    //         name="avatar"
    //         onChange={this.handleChange}
    //         className={classes.input}
    //         type="file"
    //       />
    //       <Button variant="contained" color="secondary" component="span">
    //         Upload Image <CloudUpload />
    //       </Button>
    //       <span className={classes.filename}>{avatar.name}</span>
    //       <TextField
    //         label="Name"
    //         name="name"
    //         className={classes.textField}
    //         value={name}
    //         onChange={this.handleChange}
    //         margin="normal"
    //       />
    //       <TextField
    //         label="About"
    //         multiline
    //         name="about"
    //         rows="2"
    //         value={about}
    //         onChange={this.handleChange}
    //         className={classes.textField}
    //         margin="normal"
    //       />
    //       <TextField
    //         type="email"
    //         label="Email"
    //         name="email"
    //         className={classes.textField}
    //         value={email}
    //         onChange={this.handleChange}
    //         margin="normal"
    //       />
    //       {/* {error && (
    //         <Typography component="p" color="error">
    //           <Icon color="error" className={classes.error}>
    //             error
    //           </Icon>
    //           {error}
    //         </Typography>
    //       )} */}
    //     </CardContent>
    //     <CardActions className={classes.wrapper}>
    //       <Button
    //         color="primary"
    //         variant="contained"
    //         disabled={isLoading || isSaving}
    //         onClick={this.handleSubmit}
    //         className={classes.submit}
    //       >
    //         {isSaving ? "Saving" : "Save"}
    //       </Button>
    //     </CardActions>
    //   </Card>
    // );
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
  }
});

// const styles = theme => ({
//   card: {
//     maxWidth: 600,
//     margin: "auto",
//     textAlign: "center",
//     marginTop: theme.spacing.unit * 5,
//     paddingBottom: theme.spacing.unit * 2
//   },
//   title: {
//     margin: theme.spacing.unit * 2,
//     color: theme.palette.protectedTitle
//   },
//   error: {
//     verticalAlign: "middle"
//   },
//   textField: {
//     marginLeft: theme.spacing.unit,
//     marginRight: theme.spacing.unit,
//     width: 300
//   },
//   submit: {
//     margin: "auto",
//     marginBottom: theme.spacing.unit * 2
//   },
//   bigAvatar: {
//     width: 60,
//     height: 60,
//     margin: "auto"
//   },
//   input: {
//     display: "none"
//   },
//   filename: {
//     marginLeft: "10px"
//   }
// });

export default withStyles(styles)(EditProfile);
