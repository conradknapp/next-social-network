import { Component } from "react";
// prettier-ignore
import { withStyles, CircularProgress, Card, Drawer, CardHeader, CardActions, Button, CardContent, Typography, Grid } from '@material-ui/core';
import Router from "next/router";

import FindUsers from "../components/index/FindUsers";
import PostFeed from "../components/index/PostFeed";
import { authInitialProps } from "../lib/auth";

class Index extends Component {
  state = {
    defaultPage: true,
    loading: true
  };

  componentDidMount() {
    this.checkIfAuth();
  }

  checkIfAuth = () => {
    const { auth } = this.props;
    if (auth && auth.user && auth.user._id) {
      this.setState({
        defaultPage: false,
        loading: false
      });
    } else {
      this.setState({
        defaultPage: true,
        loading: false
      });
    }
  };

  render() {
    const { classes, auth } = this.props;
    const { defaultPage, loading } = this.state;

    return (
      <main className={classes.root}>
        {/* Loading Spinner  */}
        {loading ? (
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.progressContainer}
          >
            <CircularProgress
              className={classes.progress}
              thickness={7}
              size={50}
            />
          </Grid>
        ) : defaultPage ? (
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.heroContent}
          >
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              A Better Social Network
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="textSecondary"
              component="p"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Typography>
            <Button
              className={classes.fabButton}
              onClick={() => Router.push("/signup")}
              variant="extendedFab"
              color="primary"
            >
              Get Started
            </Button>
          </Grid>
        ) : (
          // Auth User Page
          <Grid container>
            <Grid item xs={12} sm={12} md={7}>
              <PostFeed auth={auth} />
            </Grid>
            <Grid item className={classes.drawerContainer}>
              <Drawer
                className={classes.drawer}
                variant="permanent"
                anchor="right"
                classes={{
                  paper: classes.drawerPaper
                }}
              >
                <FindUsers auth={auth} />
              </Drawer>
            </Grid>
          </Grid>
        )}
      </main>
    );
  }
}

Index.getInitialProps = authInitialProps();

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 10,
    paddingLeft: theme.spacing.unit * 5,
    [theme.breakpoints.down("sm")]: {
      paddingRight: theme.spacing.unit * 5
    }
  },
  progressContainer: {
    height: "80vh"
  },
  progress: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.primary.light
  },
  drawerContainer: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  drawer: {
    width: 350
  },
  drawerPaper: {
    marginTop: 70,
    width: 350
  },
  fabButton: {
    margin: theme.spacing.unit * 3
  },
  heroContent: {
    maxWidth: 600,
    paddingTop: theme.spacing.unit * 8,
    paddingBottom: theme.spacing.unit * 6,
    margin: "0 auto"
  }
});

export default withStyles(styles)(Index);
