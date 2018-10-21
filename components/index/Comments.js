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

  handleComment = event => {
    const { addComment, postId } = this.props;
    const { text } = this.state;
    if (event.keyCode == 13 && !!text) {
      addComment(postId, text);
      this.setState({ text: "" });
    }
  };

  render() {
    const { classes, comments, auth, postId, removeComment } = this.props;
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
              onKeyDown={this.handleComment}
              multiline
              name="text"
              value={text}
              onChange={this.handleChange}
              placeholder="Add a comment..."
              className={classes.commentField}
              margin="normal"
            />
          }
          className={classes.cardHeader}
        />
        {comments.map((item, i) => {
          return (
            <CardHeader
              avatar={
                <Avatar
                  className={classes.smallAvatar}
                  src={`/api/users/photo/${item.postedBy._id}`}
                />
              }
              title={commentBody(classes, item, auth, removeComment, postId)}
              className={classes.cardHeader}
              key={i}
            />
          );
        })}
      </div>
    );
  }
}

const commentBody = (classes, item, auth, removeComment, postId) => (
  <p className={classes.commentText}>
    <Link passHref href={`/user/${item.postedBy._id}`}>
      <a>{item.postedBy.name}</a>
    </Link>
    <br />
    {item.text}
    <span className={classes.commentDate}>
      {distanceInWordsToNow(item.created, {
        includeSeconds: true,
        addSuffix: true
      })}
      {auth.user._id === item.postedBy._id && (
        <Delete
          onClick={() => removeComment(item, postId)}
          className={classes.commentDelete}
        />
      )}
    </span>
  </p>
);

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
