import { Component } from "react";
// prettier-ignore
import { Divider, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Avatar, Button, IconButton, Typography, Snackbar, withStyles } from '@material-ui/core';
import { AccountBox } from "@material-ui/icons";
import Link from "next/link";

import { findUsers, followUser } from "../../lib/auth";

class FindUsers extends Component {
  state = {
    users: [],
    open: false
  };

  componentDidMount() {
    const { auth } = this.props;
    findUsers(auth.user._id).then(users => {
      this.setState({ users });
    });
  }

  handleFollow = (user, userIndex) => {
    const { auth } = this.props;
    // const followUserPayload = {
    //   userId: auth.user._id,
    //   followId: user._id
    // };
    followUser(auth.user._id, user._id).then(() => {
      const updatedUsers = [
        ...this.state.users.slice(0, userIndex),
        ...this.state.users.slice(userIndex + 1)
      ];
      this.setState({
        users: updatedUsers,
        open: true,
        followMessage: `Following ${user.name}!`
      });
    });
  };

  handleClose = () => this.setState({ open: false });

  render() {
    const { classes } = this.props;
    const { open, followMessage, users } = this.state;

    return (
      <div>
        <Typography type="title" align="center" className={classes.title}>
          Users to Follow
        </Typography>
        <Divider />
        <List>
          {users.map((user, i) => {
            return (
              <span key={user._id}>
                <ListItem>
                  <ListItemAvatar className={classes.avatar}>
                    <Avatar src={`/api/users/image/${user._id}`} />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                  <ListItemSecondaryAction className={classes.follow}>
                    <Link href={`/profile/${user._id}`}>
                      <IconButton
                        variant="contained"
                        color="secondary"
                        className={classes.viewButton}
                      >
                        <AccountBox />
                      </IconButton>
                    </Link>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => this.handleFollow(user, i)}
                    >
                      Follow
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </span>
            );
          })}
        </List>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={open}
          onClose={this.handleClose}
          autoHideDuration={6000}
          message={<span className={classes.snack}>{followMessage}</span>}
        />
      </div>
    );
  }
}

const styles = theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing.unit
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

export default withStyles(styles)(FindUsers);
