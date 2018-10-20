import React from "react";
// prettier-ignore
import { Paper, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Avatar, Button, IconButton, Typography, Snackbar, withStyles } from '@material-ui/core';
import { Visibility } from "@material-ui/icons";
import Link from "next/link";

import { findPeople, followUser } from "../../lib/auth";

class FindPeople extends React.Component {
  state = {
    users: [],
    open: false
  };

  componentDidMount() {
    const { auth } = this.props;
    findPeople(auth.user._id).then(users => {
      this.setState({ users });
    });
  }

  clickFollow = (user, index) => {
    const { auth } = this.props;
    followUser(auth.user._id, user._id).then(() => {
      const updatedUsers = [...this.state.users];
      updatedUsers.splice(index, 1);
      this.setState({
        users: updatedUsers,
        open: true,
        followMessage: `Following ${user.name}!`
      });
    });
  };

  handleDialogClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const { open, followMessage, users } = this.state;

    return (
      <div>
        <Paper className={classes.root} elevation={4}>
          <Typography type="title" className={classes.title}>
            People to Follow
          </Typography>
          <List>
            {users.map((user, i) => {
              return (
                <span key={user._id}>
                  <ListItem>
                    <ListItemAvatar className={classes.avatar}>
                      <Avatar src={`/api/users/photo/${user._id}`} />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                    <ListItemSecondaryAction className={classes.follow}>
                      <Link href={`/user/${user._id}`}>
                        <IconButton
                          variant="contained"
                          color="secondary"
                          className={classes.viewButton}
                        >
                          <Visibility />
                        </IconButton>
                      </Link>
                      <Button
                        aria-label="Follow"
                        variant="contained"
                        color="primary"
                        onClick={() => this.clickFollow(user, i)}
                      >
                        Follow
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </span>
              );
            })}
          </List>
        </Paper>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={open}
          onClose={this.handleDialogClose}
          autoHideDuration={6000}
          message={<span className={classes.snack}>{followMessage}</span>}
        />
      </div>
    );
  }
}

const styles = theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing.unit,
    margin: 0
  }),
  title: {
    margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit}px ${theme.spacing
      .unit * 2}px`,
    color: theme.palette.openTitle,
    fontSize: "1em"
  },
  avatar: {
    marginRight: theme.spacing.unit * 1
  },
  follow: {
    right: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.protectedTitle
  },
  viewButton: {
    verticalAlign: "middle"
  }
});

export default withStyles(styles)(FindPeople);
