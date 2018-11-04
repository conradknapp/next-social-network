import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Router from "next/router";

import UserFeed from "../components/index/UserFeed";
import PostFeed from "../components/index/PostFeed";
import { authInitialProps } from "../lib/auth";

class Index extends React.Component {
  state = {
    splashPage: true,
    isLoading: true
  };

  componentDidMount() {
    this.checkAuth();
  }

  checkAuth = () => {
    const { auth } = this.props;
    const { user = {} } = auth || {};

    if (user._id) {
      this.setState({
        splashPage: false,
        isLoading: false
      });
    } else {
      this.setState({
        splashPage: true,
        isLoading: false
      });
    }
  };

  render() {
    const { classes, auth } = this.props;
    const { splashPage, isLoading } = this.state;

    return (
      <main className={classes.root}>
        {/* Loading Spinner  */}
        {isLoading ? (
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.progressContainer}
          >
            <CircularProgress
              className={classes.progress}
              thickness={5}
              size={70}
            />
          </Grid>
        ) : splashPage ? (
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
                <UserFeed auth={auth} />
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
    color: theme.palette.secondary.light
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
