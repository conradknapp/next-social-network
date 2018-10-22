import React from "react";
// prettier-ignore
import { Badge, Card, CardHeader, CardContent, CardActions, Typography, Avatar, IconButton, Divider, withStyles } from '@material-ui/core';
import {
  DeleteTwoTone,
  Favorite,
  FavoriteBorder,
  Comment
} from "@material-ui/icons";
import Link from "next/link";
import { distanceInWordsToNow } from "date-fns";

import Comments from "./Comments";

class Post extends React.Component {
  state = {
    isLiked: false,
    likes: 0,
    comments: []
  };

  componentDidMount() {
    const { post } = this.props;
    this.setState({
      isLiked: this.checkIfLiked(post.likes),
      likes: post.likes.length,
      comments: post.comments
    });
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.log(nextProps, prevState);
  // }

  componentWillReceiveProps = props => {
    this.setState({
      isLiked: this.checkIfLiked(props.post.likes),
      likes: props.post.likes.length,
      comments: props.post.comments
    });
  };

  checkIfLiked = likes => {
    const { auth } = this.props;
    return likes.includes(auth.user._id);
  };

  render() {
    const {
      classes,
      post,
      auth,
      handleToggleLike,
      removePost,
      addComment,
      removeComment
    } = this.props;
    const { comments, likes, isLiked } = this.state;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar src={`/api/users/photo/${post.postedBy._id}`} />}
          action={
            post.postedBy._id === auth.user._id && (
              <IconButton onClick={() => removePost(post)}>
                <DeleteTwoTone color="secondary" />
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
          <IconButton
            onClick={() => handleToggleLike(post)}
            className={classes.button}
            aria-label="Unlike"
            color="secondary"
          >
            <Badge badgeContent={likes} color="secondary">
              {isLiked ? <Favorite /> : <FavoriteBorder />}
            </Badge>
          </IconButton>
          <IconButton
            className={classes.button}
            aria-label="Comment"
            color="secondary"
          >
            <Badge badgeContent={comments.length} color="primary">
              <Comment />
            </Badge>
          </IconButton>
        </CardActions>
        <Divider />
        <Comments
          auth={auth}
          postId={post._id}
          comments={comments}
          addComment={addComment}
          removeComment={removeComment}
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
