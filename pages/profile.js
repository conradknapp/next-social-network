import React from "react";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Edit from "@material-ui/icons/Edit";
import DeleteProfile from "../components/profile/DeleteProfile";
import FollowProfile from "../components/profile/FollowProfile";
import { withStyles } from "@material-ui/core/styles";
import Link from "next/link";
import { getUserProfile, authInitialProps, followUser } from "../lib/auth";

class Profile extends React.Component {
  state = {
    user: {
      following: [],
      followers: []
    },
    following: false,
    posts: [],
    loading: true
  };

  init = userId => {
    // const jwt = auth.isAuthenticated();
    // read(
    //   {
    //     userId: userId
    //   },
    //   { t: jwt.token }
    // ).then(data => {
    //   if (data.error) {
    //     this.setState({ redirectToSignin: true });
    //   } else {
    //     let following = this.checkFollow(data);
    //     this.setState({ user: data, following: following });
    //     this.loadPosts(data._id);
    //   }
    // });
  };

  componentDidMount() {
    const { userId } = this.props;
    getUserProfile(userId).then(user =>
      this.setState({ user, loading: false })
    );
  }

  checkFollow = user => {
    // const jwt = auth.isAuthenticated();
    // const match = user.followers.find(follower => {
    //   return follower._id == jwt.user._id;
    // });
    // return match;
  };

  clickFollowButton = () => {
    // callApi(
    //   {
    //     userId: jwt.user._id
    //   },
    //   {
    //     t: jwt.token
    //   },
    //   this.state.user._id
    // ).then(data => {
    //   if (data.error) {
    //     this.setState({ error: data.error });
    //   } else {
    //     this.setState({ user: data, following: !this.state.following });
    //   }
    // });
  };

  loadPosts = user => {
    // const jwt = auth.isAuthenticated();
    // listByUser(
    //   {
    //     userId: user
    //   },
    //   {
    //     t: jwt.token
    //   }
    // ).then(data => {
    //   if (data.error) {
    //     console.log(data.error);
    //   } else {
    //     this.setState({ posts: data });
    //   }
    // });
  };

  removePost = post => {
    const updatedPosts = [...this.state.posts];
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    this.setState({ posts: updatedPosts });
  };

  render() {
    const { classes } = this.props;
    const { user, following, loading, posts } = this.state;
    const photoUrl = user._id
      ? `/api/users/photo/${user._id}?${Date.now()}`
      : "/api/users/defaultphoto";
    return (
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h4" className={classes.title}>
          Profile
        </Typography>
        {loading ? (
          <CircularProgress className={classes.progress} size={50} />
        ) : (
          <List dense>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={photoUrl} className={classes.bigAvatar} />
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.email} />{" "}
              {true ? (
                <ListItemSecondaryAction>
                  <Link href={`/edit-profile/${user._id}`}>
                    <IconButton aria-label="Edit" color="primary">
                      <Edit />
                    </IconButton>
                  </Link>
                  <DeleteProfile userId={user._id} />
                </ListItemSecondaryAction>
              ) : (
                <FollowProfile
                  following={following}
                  onButtonClick={this.clickFollowButton}
                />
              )}
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={user.about}
                secondary={`Joined: ${new Date(user.created).toDateString()}`}
              />
            </ListItem>
          </List>
        )}
      </Paper>
    );
  }
}

Profile.getInitialProps = authInitialProps(false, true);

const styles = theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5
  }),
  title: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px 0`,
    color: theme.palette.title,
    fontSize: "1em"
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  }
});

export default withStyles(styles)(Profile);
