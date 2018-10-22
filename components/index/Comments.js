import React from "react";
// prettier-ignore
import { CardHeader, TextField, Avatar, withStyles } from '@material-ui/core';
import { Delete } from "@material-ui/icons";
import Link from "next/link";
import { distanceInWordsToNow } from "date-fns";

class Comments extends React.Component {
  state = {
    text: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleAddComment = event => {
    const { addComment, postId } = this.props;
    const { text } = this.state;
    if (event.keyCode === 13 && !!text) {
      addComment(postId, text);
      this.setState({ text: "" });
    }
  };

  renderCommentBody = comment => {
    const { postId, removeComment, auth, classes } = this.props;
    return (
      <p className={classes.commentText}>
        <Link passHref href={`/user/${comment.postedBy._id}`}>
          <a>{comment.postedBy.name}</a>
        </Link>
        <br />
        {comment.text}
        <span className={classes.commentDate}>
          {distanceInWordsToNow(comment.created, {
            includeSeconds: true,
            addSuffix: true
          })}
          {auth.user._id === comment.postedBy._id && (
            <Delete
              onClick={() => removeComment(comment, postId)}
              className={classes.commentDelete}
              color="secondary"
            />
          )}
        </span>
      </p>
    );
  };

  render() {
    const { classes, comments, auth } = this.props;
    const { text } = this.state;

    return (
      <div>
        <CardHeader
          avatar={
            <Avatar
              className={classes.smallAvatar}
              src={`/api/users/photo/${auth.user._id}`}
            />
          }
          title={
            <TextField
              onKeyDown={this.handleAddComment}
              multiline
              name="text"
              value={text}
              onChange={this.handleChange}
              placeholder="Reply to this post"
              className={classes.commentField}
              margin="normal"
            />
          }
          className={classes.cardHeader}
        />
        {comments.map((comment, i) => {
          return (
            <CardHeader
              avatar={
                <Avatar
                  className={classes.smallAvatar}
                  src={`/api/users/photo/${comment.postedBy._id}`}
                />
              }
              title={this.renderCommentBody(comment)}
              className={classes.cardHeader}
              key={i}
            />
          );
        })}
      </div>
    );
  }
}

const styles = theme => ({
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  smallAvatar: {
    width: 25,
    height: 25
  },
  commentField: {
    width: "96%"
  },
  commentText: {
    backgroundColor: "white",
    padding: theme.spacing.unit,
    margin: `2px ${theme.spacing.unit * 2}px 2px 2px`
  },
  commentDate: {
    display: "block",
    color: "gray",
    fontSize: "0.8em"
  },
  commentDelete: {
    fontSize: "1.6em",
    verticalAlign: "middle",
    cursor: "pointer"
  }
});

export default withStyles(styles)(Comments);
