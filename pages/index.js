import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import defaultImage from "../static/profile-image.jpg";
import Grid from "@material-ui/core/Grid";
import FindPeople from "../components/index/FindPeople";
import NewsFeed from "../components/index/NewsFeed";
import { authInitialProps } from "../lib/auth";

class Index extends React.Component {
  state = {
    defaultPage: true
  };

  isAuth = () => {
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

  componentDidMount() {
    this.isAuth();
  }

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
              <NewsFeed auth={auth} />
            </Grid>
            <Grid item xs={6} sm={5}>
              <FindPeople auth={auth} />
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 30
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

Index.getInitialProps = authInitialProps();

export default withStyles(styles)(Index);
