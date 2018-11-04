import Badge from "@material-ui/core/Badge";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Comment from "@material-ui/icons/Comment";
import DeleteTwoTone from "@material-ui/icons/DeleteTwoTone";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import withStyles from "@material-ui/core/styles/withStyles";
import Link from "next/link";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

import Comments from "./Comments";

class Post extends React.PureComponent {
  state = {
    isLiked: false,
    numLikes: 0,
    comments: []
  };

  componentDidMount() {
    this.setState({
      isLiked: this.checkLiked(this.props.post.likes),
      numLikes: this.props.post.likes.length,
      comments: this.props.post.comments
    });
  }


  componentDidUpdate(prevProps) {
    /* Note: show the difference when using a regular Component versus a PureComponent */

    // console.log({ prevProps }, { props: this.props });
    if (prevProps.post.likes.length !== this.props.post.likes.length) {
      this.setState({
        isLiked: this.checkLiked(this.props.post.likes),
        numLikes: this.props.post.likes.length
      });
    }

    if (prevProps.post.comments.length !== this.props.post.comments.length) {
      this.setState({
        comments: this.props.post.comments
      });
    }
  }

  checkLiked = likes => likes.includes(this.props.auth.user._id);

  formatTimeCreated = time =>
    distanceInWordsToNow(time, {
      includeSeconds: true,
      addSuffix: true
    });

  render() {
    const {
      classes,
      post,
      auth,
      isDeletingPost,
      handleToggleLike,
      handleRemovePost,
      handleAddComment,
      handleRemoveComment,
      hideComments
    } = this.props;
    const { comments, numLikes, isLiked } = this.state;
    const isPostCreator = post.postedBy._id === auth.user._id;

    return (
      <Card className={classes.card}>
        {/* Post Header */}
        <CardHeader
          avatar={<Avatar src={post.postedBy.avatar} />}
          action={
            isPostCreator && (
              <IconButton
                disabled={isDeletingPost}
                onClick={() => handleRemovePost(post)}
              >
                <DeleteTwoTone color="secondary" />
              </IconButton>
            )
          }
          title={
            <Link href={`/profile/${post.postedBy._id}`}>
              <a>{post.postedBy.name}</a>
            </Link>
          }
          subheader={this.formatTimeCreated(post.createdAt)}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <Typography variant="body1" className={classes.text}>
            {post.text}
          </Typography>

          {/* Post Image */}
          {post.image && (
            <div className={classes.imageContainer}>
              <img className={classes.image} src={post.image} />
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
        {!hideComments && (
          <Comments
            key={post._id}
            auth={auth}
            postId={post._id}
            comments={comments}
            handleAddComment={handleAddComment}
            handleRemoveComment={handleRemoveComment}
          />
        )}
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
