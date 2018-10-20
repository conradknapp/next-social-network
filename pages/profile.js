import React from "react";
// prettier-ignore
import { Paper, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Avatar, IconButton, Typography, CircularProgress, Divider } from '@material-ui/core';
import { Edit } from "@material-ui/icons";

import DeleteProfile from "../components/profile/DeleteProfile";
import FollowProfile from "../components/profile/FollowProfile";
import { withStyles } from "@material-ui/core/styles";
import Link from "next/link";
import { getUserProfile, authInitialProps } from "../lib/auth";

class Profile extends React.Component {
  state = {
    user: {
      following: [],
      followers: []
    },
    following: false,
    posts: [],
    loading: true,
    isAuth: false
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
    const { userId, auth } = this.props;
    getUserProfile(userId).then(user => {
      const isFollowing = this.checkFollow(user);
      this.setState({ user, loading: false, following: isFollowing });
    });
    this.isAuthUser(auth.user._id, userId);
  }

  isAuthUser = (authId, userId) => {
    const isAuth = authId === userId;
    this.setState({ isAuth });
  };

  checkFollow = user => {
    const { auth } = this.props;
    const isFollowing = user.followers.find(follower => {
      return follower._id === auth.user._id;
    });
    return isFollowing;
  };

  clickFollowButton = sendRequest => {
    const { auth, userId } = this.props;
    sendRequest(auth.user._id, userId).then(() => {
      this.setState({ following: !this.state.following });
    });
    // ...
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
    const { isAuth, user, following, loading, posts } = this.state;
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
              {isAuth ? (
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
                secondary={`Joined: ${new Date(user.createdAt).toDateString()}`}
              />
            </ListItem>
          </List>
        )}
      </Paper>
    );
  }
}

// Profile is a protected route
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
