import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import CommentIcon from "@material-ui/icons/Comment";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import { deleteUserPost, likeUserPost, unlikeUserPost } from "../../lib/auth";
import Link from "next/link";
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
      like: this.checkLike(post.likes),
      likes: post.likes.length,
      comments: post.comments
    });
  }

  // componentWillReceiveProps = props => {
  //   this.setState({
  //     like: this.checkLike(props.post.likes),
  //     likes: props.post.likes.length,
  //     comments: props.post.comments
  //   });
  // };

  checkLike = likes => {
    const { auth } = this.props;
    const isLiked = likes.indexOf(auth.user._id) !== -1;
    return isLiked;
  };

  likePost = () => {
    const { auth, post } = this.props;
    const { like } = this.state;
    const sendRequest = like ? unlikeUserPost : likeUserPost;
    sendRequest({
      userId: auth.user._id,
      post
    }).then(postData => {
      console.log(postData);
      this.setState({ like: !like, likes: postData.likes.length });
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
    const { comments, likes, like } = this.state;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar src={`/api/users/photo/${post.postedBy._id}`} />}
          action={
            post.postedBy._id === auth.user._id && (
              <IconButton onClick={this.deletePost}>
                <DeleteIcon />
              </IconButton>
            )
          }
          title={
            <Link href={`/user/${post.postedBy._id}`}>
              {post.postedBy.name}
            </Link>
          }
          subheader={new Date(post.created).toDateString()}
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
              className={classes.button}
              aria-label="Like"
              color="secondary"
            >
              <FavoriteIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={this.likePost}
              className={classes.button}
              aria-label="Unlike"
              color="secondary"
            >
              <FavoriteBorderIcon />
            </IconButton>
          )}{" "}
          <span>{likes}</span>
          <IconButton
            className={classes.button}
            aria-label="Comment"
            color="secondary"
          >
            <CommentIcon />
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
