import CardHeader from "@material-ui/core/CardHeader";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Avatar from "@material-ui/core/Avatar";
import withStyles from "@material-ui/core/styles/withStyles";
import Delete from "@material-ui/icons/Delete";
import Link from "next/link";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

class Comments extends React.Component {
  state = {
    text: ""
  };

  handleChange = event => {
    this.setState({ text: event.target.value });
  };

  handleSubmit = event => {
    const { text } = this.state;
    const { handleAddComment, postId } = this.props;

    event.preventDefault();
    handleAddComment(postId, text);
    this.setState({ text: "" });
  };

  showComment = comment => {
    const { postId, handleRemoveComment, auth, classes } = this.props;
    const isPoster = auth.user._id === comment.postedBy._id;

    return (
      <div>
        <Link href={`/profile/${comment.postedBy._id}`}>
          <a>{comment.postedBy.name}</a>
        </Link>
        <br />
        {comment.text}
        <span className={classes.commentDate}>
          {distanceInWordsToNow(comment.createdAt, {
            includeSeconds: true,
            addSuffix: true
          })}
          {isPoster && (
            <Delete
              onClick={() => handleRemoveComment(postId, comment)}
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
            <Avatar className={classes.smallAvatar} src={auth.user.avatar} />
          }
          title={
            <form onSubmit={this.handleSubmit}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="text">Add comment</InputLabel>
                <Input
                  id="text"
                  name="text"
                  value={text}
                  onChange={this.handleChange}
                  placeholder="Reply to this post"
                  className={classes.commentField}
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
                // src={`/api/users/image/${comment.postedBy._id}`}
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
