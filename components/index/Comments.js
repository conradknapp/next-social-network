import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core//TextField";
import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core/styles";
import { commentPost, uncommentPost } from "../../lib/auth";
import Link from "next/link";

class Comments extends React.Component {
  state = {
    text: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  addComment = event => {
    const { postId, auth } = this.props;
    const { text } = this.state;
    if (event.keyCode == 13 && event.target.value) {
      const commentPayload = {
        postId,
        comment: {
          text,
          postedBy: auth.user._id
        }
      };
      commentPost(commentPayload).then(data => {
        console.log(data);
        this.props.updateComments(data.comments);
        this.setState({ text: "" });
      });
    }
  };

  deleteComment = comment => {
    const { updateComments, postId } = this.props;
    const uncommentPayload = {
      // userId: auth.user._id,
      postId,
      comment
    };
    uncommentPost(uncommentPayload).then(post => {
      updateComments(post.comments);
    });
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
              onKeyDown={this.addComment}
              multiline
              name="text"
              value={text}
              onChange={this.handleChange}
              placeholder="Write something..."
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
              title={commentBody(classes, item, auth, this.deleteComment)}
              className={classes.cardHeader}
              key={i}
            />
          );
        })}
      </div>
    );
  }
}

const commentBody = (classes, item, auth, deleteComment) => (
  <p className={classes.commentText}>
    <Link href={`/user/${item.postedBy._id}`}>{item.postedBy.name}</Link>
    <br />
    {item.text}
    <span className={classes.commentDate}>
      {new Date(item.created).toDateString()}
      {auth.user._id === item.postedBy._id && (
        <DeleteIcon
          onClick={() => deleteComment(item)}
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
