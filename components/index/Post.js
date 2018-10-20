import React from "react";
// prettier-ignore
import { Card, CardHeader, CardContent, CardActions, Typography, Avatar, IconButton, Divider, withStyles } from '@material-ui/core';
import { Delete, Favorite, FavoriteBorder, Comment } from "@material-ui/icons";
import Link from "next/link";
import { distanceInWordsToNow } from "date-fns";

import { deleteUserPost, likeUserPost, unlikeUserPost } from "../../lib/auth";
import Comments from "./Comments";

class Post extends React.Component {
  state = {
    like: false,
    likes: 0,
    comments: [],
    loading: false
  };

  componentDidMount() {
    const { post } = this.props;

    this.setState({
      like: this.checkLike(post.likes),
      likes: post.likes.length,
      comments: post.comments
    });
  }

  checkLike = likes => {
    const { auth } = this.props;
    const isLiked = likes.indexOf(auth.user._id) !== -1;
    return isLiked;
  };

  likePost = () => {
    this.setState({ loading: true });
    const { auth, post } = this.props;
    const { like } = this.state;
    const sendRequest = like ? unlikeUserPost : likeUserPost;
    sendRequest({
      userId: auth.user._id,
      post
    }).then(postData => {
      console.log(postData);
      this.setState({
        like: !like,
        likes: postData.likes.length,
        loading: false
      });
    });
  };

  deletePost = () => {
    const { post, onRemove } = this.props;
    deleteUserPost(post._id).then(() => {
      onRemove(post);
    });
  };

  render() {
    const { classes, post, auth } = this.props;
    const { comments, likes, like, loading } = this.state;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar src={`/api/users/photo/${post.postedBy._id}`} />}
          action={
            post.postedBy._id === auth.user._id && (
              <IconButton onClick={this.deletePost}>
                <Delete />
              </IconButton>
            )
          }
          title={
            <Link passHref href={`/user/${post.postedBy._id}`}>
              <a>{post.postedBy.name}</a>
            </Link>
          }
          subheader={distanceInWordsToNow(post.created, {
            includeSeconds: true,
            addSuffix: true
          })}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <Typography component="p" className={classes.text}>
            {post.text}
          </Typography>
          {post.photo && (
            <div className={classes.photo}>
              <img
                className={classes.media}
                src={`/api/posts/photo/${post._id}`}
              />
            </div>
          )}
        </CardContent>
        <CardActions>
          {like ? (
            <IconButton
              onClick={this.likePost}
              disabled={loading}
              className={classes.button}
              aria-label="Like"
              color="secondary"
            >
              <Favorite />
            </IconButton>
          ) : (
            <IconButton
              onClick={this.likePost}
              className={classes.button}
              disabled={loading}
              aria-label="Unlike"
              color="secondary"
            >
              <FavoriteBorder />
            </IconButton>
          )}{" "}
          <span>{likes}</span>
          <IconButton
            className={classes.button}
            aria-label="Comment"
            color="secondary"
          >
            <Comment />
          </IconButton>{" "}
          <span>{comments.length}</span>
        </CardActions>
        <Divider />
        <Comments
          auth={auth}
          postId={post._id}
          comments={comments}
          updateComments={comments => this.setState({ comments })}
        />
      </Card>
    );
  }
}

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    marginBottom: theme.spacing.unit * 3,
    backgroundColor: "rgba(0, 0, 0, 0.06)"
  },
  cardContent: {
    backgroundColor: "white",
    padding: `${theme.spacing.unit * 2}px 0px`
  },
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  text: {
    margin: theme.spacing.unit * 2
  },
  photo: {
    textAlign: "center",
    backgroundColor: "#f2f5f4",
    padding: theme.spacing.unit
  },
  media: {
    height: 200
  },
  button: {
    margin: theme.spacing.unit
  }
});

export default withStyles(styles)(Post);
