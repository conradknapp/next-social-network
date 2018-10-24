import { Component } from "react";
// prettier-ignore
import { withStyles, CircularProgress, Card, Drawer, CardHeader, CardActions, Button, CardContent, Typography, Grid } from '@material-ui/core';
import Router from "next/router";

import FindPeople from "../components/index/FindPeople";
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
          <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} thickness={7} />
          </div>
        ) : defaultPage ? (
          <div className={classes.layout}>
            {/* Hero */}
            <div className={classes.heroContent}>
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Next Social
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
            </div>

            {/* Call to Action Card */}
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid align="center" item xs={12} sm={8} md={6}>
                <Card>
                  <CardHeader
                    title="Pro"
                    subheader="Most popular"
                    className={classes.cardHeader}
                  />
                  <CardContent>
                    <div className={classes.cardPricing}>
                      <Typography
                        component="h2"
                        variant="h3"
                        color="textPrimary"
                      >
                        $15
                      </Typography>
                      <Typography variant="h6" color="textSecondary">
                        /mo
                      </Typography>
                    </div>
                    <Typography variant="subtitle1" align="center">
                      20 users included, 10 GB of storage, Help center access,
                      Priority email support
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <Button
                      onClick={() => Router.push("/signup")}
                      fullWidth
                      variant="contained"
                      color="primary"
                    >
                      Get Started
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </div>
        ) : (
          // Auth User Page
          <Grid container>
            <Grid item xs={8} sm={7}>
              <PostFeed auth={auth} />
            </Grid>
            <Grid item>
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
      </main>
    );
  }
}

Index.getInitialProps = authInitialProps();

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 10,
    paddingLeft: theme.spacing.unit * 5
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "80vh"
  },
  progress: {
    margin: theme.spacing.unit * 2,
    color: "pink"
  },
  drawer: {
    width: 400
  },
  drawerPaper: {
    marginTop: 50,
    width: 400
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  heroContent: {
    maxWidth: 600,
    margin: "0 auto",
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200]
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(Index);
