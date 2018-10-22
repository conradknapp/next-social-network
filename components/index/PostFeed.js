import React from "react";
// prettier-ignore
import { Paper, Typography, withStyles } from '@material-ui/core';

import Post from "./Post";
import NewPost from "./NewPost";
import {
  listPostFeed,
  create,
  unlikeUserPost,
  likeUserPost,
  uncommentPost,
  removeUserPost,
  commentPost
} from "../../lib/auth";

class PostFeed extends React.Component {
  state = {
    posts: [],
    text: "",
    photo: "",
    loading: false
  };

  componentDidMount() {
    this.loadPosts();
    this.postData = new FormData();
  }

  loadPosts = () => {
    const { auth } = this.props;
    listPostFeed(auth.user._id).then(posts => {
      this.setState({ posts });
    });
  };

  handleChange = event => {
    const inputValue =
      event.target.name === "photo"
        ? event.target.files[0]
        : event.target.value;
    this.postData.set(event.target.name, inputValue);
    this.setState({ [event.target.name]: inputValue });
  };

  addPost = () => {
    const { auth } = this.props;
    this.setState({ loading: true });
    create(auth.user._id, this.postData)
      .then(post => {
        const updatedPosts = [post, ...this.state.posts];
        this.setState({
          posts: updatedPosts,
          text: "",
          photo: ""
        });
        this.postData.delete("photo");
        this.setState({ loading: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false });
      });
  };

  removePost = removedPost => {
    removeUserPost(removedPost._id).then(postData => {
      const postIndex = this.state.posts.findIndex(
        post => post._id === postData._id
      );
      const updatedPosts = [
        ...this.state.posts.slice(0, postIndex),
        ...this.state.posts.slice(postIndex + 1)
      ];
      this.setState({ posts: updatedPosts });
    });
  };

  handleToggleLike = post => {
    const { auth } = this.props;
    const isLiked = post.likes.includes(auth.user._id);
    const sendRequest = isLiked ? unlikeUserPost : likeUserPost;
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

  addComment = (postId, text) => {
    const { auth } = this.props;
    const commentPayload = {
      postId,
      comment: {
        text,
        postedBy: auth.user._id
      }
    };
    commentPost(commentPayload).then(postData => {
      const postIndex = this.state.posts.findIndex(
        post => post._id === postData._id
      );
      const updatedPosts = [
        ...this.state.posts.slice(0, postIndex),
        postData,
        ...this.state.posts.slice(postIndex + 1)
      ];
      this.setState({ posts: updatedPosts });
    });
  };

  removeComment = (comment, postId) => {
    const uncommentPayload = {
      postId,
      comment
    };
    uncommentPost(uncommentPayload).then(postData => {
      const postIndex = this.state.posts.findIndex(
        post => post._id === postData._id
      );
      const updatedPosts = [
        ...this.state.posts.slice(0, postIndex),
        postData,
        ...this.state.posts.slice(postIndex + 1)
      ];
      this.setState({ posts: updatedPosts });
    });
  };

  render() {
    const { classes, auth } = this.props;
    const { posts, text, photo, loading } = this.state;

    return (
      <Paper className={classes.card}>
        <Typography variant="h4" className={classes.title}>
          Post Feed
        </Typography>
        <NewPost
          auth={auth}
          handleChange={this.handleChange}
          addPost={this.addPost}
          loading={loading}
          text={text}
          photo={photo}
        />
        {posts.map(post => (
          <Post
            key={post._id}
            auth={auth}
            post={post}
            removePost={this.removePost}
            addComment={this.addComment}
            removeComment={this.removeComment}
            handleToggleLike={this.handleToggleLike}
          />
        ))}
      </Paper>
    );
  }
}

const styles = theme => ({
  card: {
    backgroundColor: "#fafafa",
    paddingBottom: theme.spacing.unit * 3,
    boxShadow: "none"
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme
      .spacing.unit * 2}px`,
    color: theme.palette.openTitle
  },
  media: {
    minHeight: 330
  }
});

export default withStyles(styles)(PostFeed);
