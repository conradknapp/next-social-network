import React from "react";
// prettier-ignore
import { Card, Typography, Divider, withStyles } from '@material-ui/core';

import PostList from "./PostList";
import NewPost from "./NewPost";
import {
  listNewsFeed,
  create,
  unlikeUserPost,
  likeUserPost,
  uncommentPost,
  commentPost
} from "../../lib/auth";

class NewsFeed extends React.Component {
  state = {
    posts: [],
    text: "",
    photo: ""
  };

  componentDidMount() {
    this.loadPosts();
    this.postData = new FormData();
  }

  loadPosts = () => {
    const { auth } = this.props;
    listNewsFeed(auth.user._id).then(posts => {
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
    create(auth.user._id, this.postData)
      .then(post => {
        console.log(post);
        const updatedPosts = [post, ...this.state.posts];
        this.setState({
          posts: updatedPosts,
          text: "",
          photo: ""
        });
        this.postData.delete("photo");
      })
      .catch(err => {
        console.error(err);
      });
  };

  removePost = removedPost => {
    const postIndex = this.state.posts.findIndex(
      post => post._id === removedPost._id
    );
    const updatedPosts = [
      ...this.state.posts.slice(0, postIndex),
      ...this.state.posts.slice(postIndex + 1)
    ];
    this.setState({ posts: updatedPosts });
  };

  handleLike = post => {
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
        this.setState({
          posts: updatedPosts
        });
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
        console.log(postData);
        const postIndex = this.state.posts.findIndex(
          post => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          postData,
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({
          posts: updatedPosts
        });
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
      this.setState({
        posts: updatedPosts
      });
    });
  };

  render() {
    const { classes, auth } = this.props;
    const { posts, text, photo } = this.state;

    return (
      <Card className={classes.card}>
        <Typography variant="h1" className={classes.title}>
          Post Feed
        </Typography>
        <Divider />
        <NewPost
          auth={auth}
          handleChange={this.handleChange}
          addPost={this.addPost}
          text={text}
          photo={photo}
        />
        <Divider />
        <PostList
          auth={auth}
          removePost={this.removePost}
          handleLike={this.handleLike}
          addComment={this.addComment}
          removeComment={this.removeComment}
          posts={posts}
        />
      </Card>
    );
  }
}

const styles = theme => ({
  card: {
    margin: "auto",
    paddingTop: 0,
    paddingBottom: theme.spacing.unit * 3
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme
      .spacing.unit * 2}px`,
    color: theme.palette.openTitle,
    fontSize: "1em"
  },
  media: {
    minHeight: 330
  }
});

export default withStyles(styles)(NewsFeed);
