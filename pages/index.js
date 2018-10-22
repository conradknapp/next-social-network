import React from "react";
// prettier-ignore
import { withStyles, Card, Drawer, CardContent, CardMedia, Divider, Typography, Grid } from '@material-ui/core';

import defaultImage from "../static/profile-image.jpg";
import FindPeople from "../components/index/FindPeople";
import PostFeed from "../components/index/PostFeed";
import { authInitialProps } from "../lib/auth";

class Index extends React.Component {
  state = {
    defaultPage: true
  };

  componentDidMount() {
    this.checkIfAuth();
  }

  checkIfAuth = () => {
    const { auth } = this.props;
    if (auth && auth.user && auth.user._id) {
      this.setState({
        defaultPage: false
      });
    } else {
      this.setState({
        defaultPage: true
      });
    }
  };

  render() {
    const { classes, auth } = this.props;
    const { defaultPage } = this.state;

    return (
      <div className={classes.root}>
        {defaultPage ? (
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Card className={classes.card}>
                <Typography
                  type="headline"
                  component="h2"
                  className={classes.title}
                >
                  Home Page
                </Typography>
                <CardMedia
                  className={classes.media}
                  image={defaultImage}
                  title="Home page"
                />
                <CardContent>
                  <Typography variant="h3">Welcome to Next Social</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={24}>
            <Grid item xs={8} sm={7}>
              <PostFeed auth={auth} />
            </Grid>
            <Grid item xs={6} sm={5}>
              <Drawer
                className={classes.drawer}
                variant="permanent"
                anchor="right"
                classes={{
                  paper: classes.drawerPaper
                }}
              >
                <FindPeople auth={auth} />
              </Drawer>
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

Index.getInitialProps = authInitialProps();

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 10,
    paddingLeft: theme.spacing.unit * 2,
    flexGrow: 1
  },
  drawer: {
    width: 400,
    flexShrink: 0
  },
  drawerPaper: {
    marginTop: 50,
    width: 400
  },
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing.unit * 5
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme
      .spacing.unit * 2}px`,
    color: theme.palette.text.secondary
  },
  media: {
    minHeight: 330
  }
});

export default withStyles(styles)(Index);
