import React from "react";
// prettier-ignore
import { Paper, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Avatar, IconButton, Typography, CircularProgress, Divider, withStyles } from '@material-ui/core';
import { Edit } from "@material-ui/icons";
import Link from "next/link";
import { format } from "date-fns";

import DeleteProfile from "../components/profile/DeleteProfile";
import FollowUser from "../components/profile/FollowUser";
import { getUser, authInitialProps } from "../lib/auth";

class Profile extends React.Component {
  state = {
    user: {},
    isFollowing: false,
    posts: [],
    loading: true,
    isAuth: false
  };

  componentDidMount() {
    const { userId, auth } = this.props;
    getUser(userId).then(user => {
      const isFollowing = this.checkFollow(auth, user);
      const isAuth = this.checkIfAuth(auth.user._id, userId);
      this.setState({ user, isFollowing, isAuth, loading: false });
    });
  }

  checkFollow = (auth, user) => {
    return user.followers.find(follower => follower._id === auth.user._id);
  };

  checkIfAuth = (authUserId, userId) => {
    return authUserId === userId;
  };

  toggleFollow = sendRequest => {
    const { auth, userId } = this.props;
    const { isFollowing } = this.state;
    const toggleFollowPayload = {
      userId: auth.user._id,
      followId: userId
    };
    sendRequest(toggleFollowPayload).then(() => {
      this.setState({ isFollowing: !isFollowing });
    });
  };

  // removePost = post => {
  //   const updatedPosts = [...this.state.posts];
  //   const index = updatedPosts.indexOf(post);
  //   updatedPosts.splice(index, 1);
  //   this.setState({ posts: updatedPosts });
  // };

  render() {
    const { classes } = this.props;
    const { isAuth, user, isFollowing, loading, posts } = this.state;
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
                  <Link href="/edit-profile">
                    <a>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                    </a>
                  </Link>
                  <DeleteProfile userId={user._id} />
                </ListItemSecondaryAction>
              ) : (
                <FollowUser
                  isFollowing={isFollowing}
                  toggleFollow={this.toggleFollow}
                />
              )}
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={user.about}
                secondary={`Joined: ${format(
                  user.createdAt,
                  "dddd, MMMM Do, YYYY"
                )}`}
              />
            </ListItem>
          </List>
        )}
      </Paper>
    );
  }
}

// Profile is a protected route
Profile.getInitialProps = authInitialProps(true);

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
