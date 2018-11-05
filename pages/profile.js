import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import withStyles from "@material-ui/core/styles/withStyles";
import Edit from "@material-ui/icons/Edit";
import Link from "next/link";
import format from "date-fns/format";

import ProfileTabs from "../components/profile/ProfileTabs";
import DeleteUser from "../components/profile/DeleteUser";
import FollowUser from "../components/profile/FollowUser";
import {
  getUser,
  deletePost,
  getPostsByUser,
  likePost,
  unlikePost
} from "../lib/api";
import { authInitialProps } from "../lib/auth";

class Profile extends React.Component {
  state = {
    user: {},
    posts: [],
    isFollowing: false,
    isAuth: false,
    isLoading: true
  };

  componentDidMount() {
    const { auth, userId } = this.props;

    getUser(userId).then(async user => {
      const isAuth = auth.user._id === userId;
      const isFollowing = this.checkFollow(auth, user);
      const posts = await getPostsByUser(userId);
      this.setState({
        user,
        posts,
        isFollowing,
        isAuth,
        isLoading: false
      });
    });
  }

  checkFollow = (auth, user) => {
    return (
      user.followers.findIndex(follower => follower._id === auth.user._id) > -1
    );
  };

  toggleFollow = sendRequest => {
    const { auth, userId } = this.props;
    const { isFollowing } = this.state;

    sendRequest(auth.user._id, userId).then(() => {
      this.setState({ isFollowing: !isFollowing });
    });
  };

  handleRemovePost = deletedPost => {
    deletePost(deletedPost._id)
      .then(postData => {
        const postIndex = this.state.posts.findIndex(
          post => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({ posts: updatedPosts });
      })
      .catch(err => console.error(err));
  };

  handleToggleLike = post => {
    const { auth } = this.props;

    const isPostLiked = post.likes.includes(auth.user._id);
    const sendRequest = isPostLiked ? unlikePost : likePost;
    sendRequest({
      userId: auth.user._id,
      postId: post._id
    })
      .then(postData => {
        const postIndex = this.state.posts.findIndex(
          post => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          postData,
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({ posts: updatedPosts });
      })
      .catch(err => console.error(err));
  };

  formatDate = date => format(date, "dddd, MMMM Do, YYYY");

  render() {
    const { classes, auth } = this.props;
    const { isAuth, user, isFollowing, isLoading, posts } = this.state;

    return (
      <Paper className={classes.root} elevation={4}>
        <Typography
          component="h1"
          variant="h4"
          align="center"
          className={classes.title}
          gutterBottom
        >
          Profile
        </Typography>
        {isLoading ? (
          <CircularProgress
            className={classes.progress}
            size={55}
            thickness={5}
          />
        ) : (
          <List dense>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={user.avatar} className={classes.bigAvatar} />
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.email} />{" "}
              {/* Auth - Edit Buttons / UnAuth - Follow Button */}
              {isAuth ? (
                <ListItemSecondaryAction>
                  <Link href="/edit-profile">
                    <a>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                    </a>
                  </Link>
                  <DeleteUser auth={auth} />
                </ListItemSecondaryAction>
              ) : (
                <FollowUser
                  isFollowing={isFollowing}
                  toggleFollow={this.toggleFollow}
                />
              )}
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={user.about}
                secondary={`Joined: ${this.formatDate(user.createdAt)}`}
              />
            </ListItem>

            {/* Display User's Posts, their Following, Followers */}
            <ProfileTabs
              user={user}
              auth={auth}
              posts={posts}
              handleToggleLike={this.handleToggleLike}
              handleRemovePost={this.handleRemovePost}
            />
          </List>
        )}
      </Paper>
    );
  }
}

// Profile is a protected route
Profile.getInitialProps = authInitialProps(true);

const styles = theme => ({
  root: {
    maxWidth: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5,
    margin: "auto"
  },
  title: {
    color: theme.palette.openTitle
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  }
});

export default withStyles(styles)(Profile);
