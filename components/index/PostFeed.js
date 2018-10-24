import { Component } from "react";
// prettier-ignore
import { Typography, withStyles } from '@material-ui/core';

import Post from "./Post";
import NewPost from "./NewPost";
import {
  listPostFeed,
  addPost,
  unlikePost,
  likePost,
  removeComment,
  removePost,
  addComment
} from "../../lib/auth";

class PostFeed extends Component {
  state = {
    posts: [],
    text: "",
    photo: "",
    loading: false
  };

  componentDidMount() {
    this.getPosts();
    this.postData = new FormData();
  }

  getPosts = () => {
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
    addPost(auth.user._id, this.postData)
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
    this.setState({ loading: true });
    removePost(removedPost._id)
      .then(postData => {
        const postIndex = this.state.posts.findIndex(
          post => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({ posts: updatedPosts, loading: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false });
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

  handleAddComment = (postId, text) => {
    const { auth } = this.props;
    const commentPayload = {
      postId,
      comment: {
        text,
        postedBy: auth.user._id
      }
    };
    addComment(commentPayload).then(postData => {
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

  handleRemoveComment = (comment, postId) => {
    const uncommentPayload = {
      postId,
      comment
    };
    removeComment(uncommentPayload).then(postData => {
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
      <main className={classes.root}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          color="primary"
          className={classes.title}
        >
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
            loading={loading}
            removePost={this.removePost}
            handleAddComment={this.handleAddComment}
            handleRemoveComment={this.handleRemoveComment}
            handleToggleLike={this.handleToggleLike}
          />
        ))}
      </main>
    );
  }
}

const styles = theme => ({
  root: {
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    padding: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(PostFeed);
