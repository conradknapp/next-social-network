import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import PostList from "./PostList";
import NewPost from "./NewPost";
import { listNewsFeed } from "../../lib/auth";

class NewsFeed extends React.Component {
  state = {
    posts: []
  };

  componentDidMount() {
    this.loadPosts();
  }

  loadPosts = () => {
    const { auth } = this.props;
    listNewsFeed(auth.user._id).then(posts => {
      this.setState({ posts });
    });
  };

  addPost = post => {
    const updatedPosts = [post, ...this.state.posts];
    this.setState({ posts: updatedPosts });
  };

  removePost = post => {
    const updatedPosts = [...this.state.posts];
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    this.setState({ posts: updatedPosts });
  };

  render() {
    const { classes, auth } = this.props;
    const { posts } = this.state;

    return (
      <Card className={classes.card}>
        <Typography type="title" className={classes.title}>
          News Feed
        </Typography>
        <Divider />
        <NewPost auth={auth} addUpdate={this.addPost} />
        <Divider />
        <PostList auth={auth} removeUpdate={this.removePost} posts={posts} />
      </Card>
    );
  }
}

const styles = theme => ({
  card: {
    margin: "auto",
    paddingTop: 0,
    paddingBottom: theme.spacing.unit * 3
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme
      .spacing.unit * 2}px`,
    color: theme.palette.openTitle,
    fontSize: "1em"
  },
  media: {
    minHeight: 330
  }
});

export default withStyles(styles)(NewsFeed);
