import { Component } from "react";
// prettier-ignore
import { CardHeader, FormControl, InputLabel, Input, Avatar, withStyles } from '@material-ui/core';
import { Delete } from "@material-ui/icons";
import Link from "next/link";
import { distanceInWordsToNow } from "date-fns";

class Comments extends Component {
  state = {
    text: ""
  };

  handleChange = event => {
    this.setState({ text: event.target.value });
  };

  handleSubmit = event => {
    const { text } = this.state;
    const { addComment, postId } = this.props;

    event.preventDefault();
    addComment(postId, text);
    this.setState({ text: "" });
  };

  showComment = comment => {
    const { postId, removeComment, auth, classes } = this.props;
    const isPoster = auth.user._id === comment.postedBy._id;
    return (
      <div>
        <Link href={`/user/${comment.postedBy._id}`}>
          <a>{comment.postedBy.name}</a>
        </Link>
        <br />
        {comment.text}
        <span className={classes.commentDate}>
          {distanceInWordsToNow(comment.created, {
            includeSeconds: true,
            addSuffix: true
          })}
          {isPoster && (
            <Delete
              onClick={() => removeComment(comment, postId)}
              className={classes.commentDelete}
              color="secondary"
            />
          )}
        </span>
      </div>
    );
  };

  render() {
    const { classes, comments, auth } = this.props;
    const { text } = this.state;

    return (
      <div className={classes.comments}>
        {/* Comment Input */}
        <CardHeader
          avatar={
            <Avatar
              className={classes.smallAvatar}
              src={`/api/users/photo/${auth.user._id}`}
            />
          }
          title={
            <form onSubmit={this.handleSubmit}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="text">Add comment</InputLabel>
                <Input
                  name="text"
                  value={text}
                  onChange={this.handleChange}
                  placeholder="Reply to this post"
                  className={classes.commentField}
                  margin="normal"
                />
              </FormControl>
            </form>
          }
          className={classes.cardHeader}
        />

        {/* Comments */}
        {comments.map(comment => (
          <CardHeader
            avatar={
              <Avatar
                className={classes.smallAvatar}
                src={`/api/users/photo/${comment.postedBy._id}`}
              />
            }
            title={this.showComment(comment)}
            className={classes.cardHeader}
            key={comment._id}
          />
        ))}
      </div>
    );
  }
}

const styles = theme => ({
  comments: {
    backgroundColor: "rgba(11, 61, 130, 0.06)"
  },
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  smallAvatar: {
    margin: 10
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
