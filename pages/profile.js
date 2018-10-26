import React from "react";
// prettier-ignore
import { Paper, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Avatar, IconButton, Typography, CircularProgress, Divider, withStyles } from '@material-ui/core';
import { Edit } from "@material-ui/icons";
import Link from "next/link";
import { format } from "date-fns";

import ProfileTabs from "../components/profile/ProfileTabs";
import RemoveUser from "../components/profile/RemoveUser";
import FollowUser from "../components/profile/FollowUser";
import {
  getUser,
  authInitialProps,
  removePost,
  getPostsByUser,
  likePost,
  unlikePost
} from "../lib/auth";

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
    getUser(userId).then(async user => {
      const isFollowing = this.checkFollow(auth, user);
      const isAuth = this.checkIfAuth(auth.user._id, userId);
      // const posts = this.getUserPosts(userId);
      const posts = await getPostsByUser(userId);
      this.setState({ user, posts, isFollowing, isAuth, loading: false });
    });
  }

  checkFollow = (auth, user) => {
    return (
      user.followers.findIndex(follower => follower._id === auth.user._id) > -1
    );
  };

  checkIfAuth = (authUserId, userId) => {
    return authUserId === userId;
  };

  // getUserPosts = userId => {
  //   let userPosts;
  //   getPostsByUser(userId).then(posts => {
  //     console.log(posts);
  //     userPosts = posts;
  //   }).catch(err => {
  //     console.error(err);
  //     userPosts = [];
  //   });
  //   return userPosts;
  // };

  toggleFollow = sendRequest => {
    const { auth, userId } = this.props;
    const { isFollowing } = this.state;
    // const toggleFollowPayload = {
    //   authUserId: auth.user._id,
    //   followId: userId
    // };
    sendRequest(auth.user._id, userId).then(() => {
      this.setState({ isFollowing: !isFollowing });
    });
  };

  // removePost = post => {
  //   const updatedPosts = [...this.state.posts];
  //   const index = updatedPosts.indexOf(post);
  //   updatedPosts.splice(index, 1);
  //   this.setState({ posts: updatedPosts });
  // };

  handleRemovePost = removedPost => {
    // this.setState({ isRemovingPost: true });
    removePost(removedPost._id)
      .then(postData => {
        const postIndex = this.state.posts.findIndex(
          post => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({ posts: updatedPosts });
      })
      .catch(err => {
        console.error(err);
        // this.setState({ isRemovingPost: false });
      });
  };

  handleToggleLike = post => {
    const { auth } = this.props;
    const isPostLiked = post.likes.includes(auth.user._id);
    const sendRequest = isPostLiked ? unlikePost : likePost;
    sendRequest({
      userId: auth.user._id,
      postId: post._id
    })
      .then(postData => {
        const postIndex = this.state.posts.findIndex(
          post => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          postData,
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({ posts: updatedPosts });
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    const { classes, auth } = this.props;
    const { isAuth, user, isFollowing, loading, posts } = this.state;
    console.log(posts);

    return (
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h5" component="h1" className={classes.title}>
          Profile
        </Typography>
        {loading ? (
          <CircularProgress className={classes.progress} size={50} />
        ) : (
          <List dense>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  src={`/api/users/image/${user._id}`}
                  className={classes.bigAvatar}
                />
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
                  <RemoveUser auth={auth} />
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
            <ProfileTabs
              user={user}
              auth={auth}
              posts={posts}
              handleToggleLike={this.handleToggleLike}
              handleRemovePost={this.handleRemovePost}
            />
          </List>
        )}
      </Paper>
    );
  }
}

// Profile is a protected route
Profile.getInitialProps = authInitialProps(true);

const styles = theme => ({
  root: {
    maxWidth: 600,
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5,
    margin: "auto"
  },
  title: {
    color: theme.palette.openTitle
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
