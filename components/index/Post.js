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
    numLikes: 0,
    comments: []
  };

  componentDidMount() {
    const { post } = this.props;
    this.setState({
      isLiked: this.checkIfLiked(post.likes),
      numLikes: post.likes.length,
      comments: post.comments
    });
  }

  /* When props change, reset state to display new data in Post component */
  // componentWillReceiveProps = props => {
  //   this.setState({
  //     isLiked: this.checkIfLiked(props.post.likes),
  //     numLikes: props.post.likes.length,
  //     comments: props.post.comments
  //   });
  // };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.numLikes !== nextProps.post.likes.length) {
      return {
        numLikes: nextProps.post.likes.length
      };
    }

    if (prevState.comments.length !== nextProps.post.comments.length) {
      return {
        comments: nextProps.post.comments
      };
    }
    // Return null to indicate no change to state.
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.numLikes !== prevState.numLikes) {
      this.setState({
        isLiked: this.checkIfLiked(this.props.post.likes)
      });
    }
  }

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
      removeComment,
      loading
    } = this.props;
    const { comments, numLikes, isLiked } = this.state;
    const isPoster = post.postedBy._id === auth.user._id;

    return (
      <Card className={classes.card}>
        {/* Post Header */}
        <CardHeader
          avatar={<Avatar src={`/api/users/photo/${post.postedBy._id}`} />}
          action={
            isPoster && (
              <IconButton disabled={loading} onClick={() => removePost(post)}>
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
          <Typography variant="body1" className={classes.text}>
            {post.text}
          </Typography>

          {/* Post Image */}
          {post.photo && (
            <div className={classes.imageContainer}>
              <img
                className={classes.image}
                src={`/api/posts/photo/${post._id}`}
              />
            </div>
          )}
        </CardContent>

        {/* Post Buttons */}
        <CardActions>
          <IconButton
            onClick={() => handleToggleLike(post)}
            className={classes.button}
          >
            <Badge badgeContent={numLikes} color="secondary">
              {isLiked ? (
                <Favorite className={classes.favoriteIcon} />
              ) : (
                <FavoriteBorder className={classes.favoriteIcon} />
              )}
            </Badge>
          </IconButton>
          <IconButton className={classes.button}>
            <Badge badgeContent={comments.length} color="primary">
              <Comment className={classes.commentIcon} />
            </Badge>
          </IconButton>
        </CardActions>
        <Divider />

        {/* Comments Area */}
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
    marginBottom: theme.spacing.unit * 3
  },
  cardContent: {
    backgroundColor: "white"
  },
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    backgroundColor: "rgba(11, 61, 130, 0.06)"
  },
  imageContainer: {
    textAlign: "center",
    // backgroundColor: "#f2f5f4",
    padding: theme.spacing.unit
  },
  image: {
    height: 200
  },
  favoriteIcon: {
    color: theme.palette.favoriteIcon
  },
  commentIcon: {
    color: theme.palette.commentIcon
  }
});

export default withStyles(styles)(Post);
