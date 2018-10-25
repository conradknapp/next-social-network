import { Component } from "react";
// prettier-ignore
import { Typography, withStyles } from '@material-ui/core';

import Post from "./Post";
import NewPost from "./NewPost";
import {
  getPostFeed,
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
    loading: false,
    isAddingPost: false,
    isRemovingPost: false
  };

  componentDidMount() {
    this.getPosts();
    this.postData = new FormData();
  }

  getPosts = () => {
    const { auth } = this.props;

    getPostFeed(auth.user._id).then(posts => {
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

  handleAddPost = () => {
    const { auth } = this.props;

    this.setState({ isAddingPost: true });
    addPost(auth.user._id, this.postData)
      .then(post => {
        const updatedPosts = [post, ...this.state.posts];
        this.setState({
          posts: updatedPosts,
          text: "",
          photo: ""
        });
        this.postData.delete("photo");
        this.setState({ isAddingPost: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ isAddingPost: false });
      });
  };

  handleRemovePost = removedPost => {
    this.setState({ isRemovingPost: true });
    removePost(removedPost._id)
      .then(postData => {
        const postIndex = this.state.posts.findIndex(
          post => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({ posts: updatedPosts, isRemovingPost: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ isRemovingPost: false });
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
    const addCommentPayload = {
      postId,
      comment: {
        text,
        postedBy: auth.user._id
      }
    };
    addComment(addCommentPayload).then(postData => {
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
    const removeCommentPayload = {
      postId,
      comment
    };
    removeComment(removeCommentPayload).then(postData => {
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
    const { posts, text, photo, isAddingPost, isRemovingPost } = this.state;

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
          handleAddPost={this.handleAddPost}
          isAddingPost={isAddingPost}
          text={text}
          photo={photo}
        />
        {posts.map(post => (
          <Post
            key={post._id}
            auth={auth}
            post={post}
            isRemovingPost={isRemovingPost}
            handleRemovePost={this.handleRemovePost}
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
