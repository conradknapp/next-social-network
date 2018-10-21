import React from "react";
// prettier-ignore
import { Card, CardHeader, CardContent, CardActions, Typography, Avatar, IconButton, Divider, withStyles } from '@material-ui/core';
import { Delete, Favorite, FavoriteBorder, Comment } from "@material-ui/icons";
import Link from "next/link";
import { distanceInWordsToNow } from "date-fns";

import Comments from "./Comments";

class Post extends React.Component {
  state = {
    like: false,
    likes: 0,
    comments: []
  };

  componentDidMount() {
    const { post } = this.props;
    this.setState({
      like: this.isLiked(post.likes),
      likes: post.likes.length,
      comments: post.comments
    });
  }

  componentWillReceiveProps = props => {
    this.setState({
      like: this.isLiked(props.post.likes),
      likes: props.post.likes.length,
      comments: props.post.comments
    });
  };

  isLiked = likes => {
    const { auth } = this.props;
    return likes.includes(auth.user._id);
  };

  render() {
    const {
      classes,
      post,
      auth,
      handleLike,
      removePost,
      addComment,
      removeComment
    } = this.props;
    const { comments, likes, like } = this.state;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar src={`/api/users/photo/${post.postedBy._id}`} />}
          action={
            post.postedBy._id === auth.user._id && (
              <IconButton onClick={() => removePost(post)}>
                <Delete className={classes.deleteIcon} />
              </IconButton>
            )
          }
          title={
            <Link href={`/user/${post.postedBy._id}`}>
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
              onClick={() => handleLike(post)}
              className={classes.button}
              aria-label="Like"
              color="secondary"
            >
              <Favorite />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => handleLike(post)}
              className={classes.button}
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
          addComment={addComment}
          removeComment={removeComment}
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
  },
  deleteIcon: {
    color: "#e34234"
  }
});

export default withStyles(styles)(Post);
