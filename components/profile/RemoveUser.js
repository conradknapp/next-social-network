import { Component } from "react";
// prettier-ignore
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Delete } from "@material-ui/icons";
import Router from "next/router";

import { signoutUser, removeUser } from "../../lib/auth";

class RemoveUser extends Component {
  state = {
    open: false,
    isRemovingUser: false
  };

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  handleRemoveUser = () => {
    const { auth } = this.props;

    this.setState({ isRemovingUser: true });
    removeUser(auth.user._id)
      .then(() => {
        signoutUser();
        Router.push("/signup");
      })
      .catch(err => {
        console.error(err);
        this.setState({ isRemovingUser: false });
      });
  };

  render() {
    const { open, isRemovingUser } = this.state;

    return (
      <div>
        {/* Delete Button */}
        <IconButton onClick={this.handleOpen} color="secondary">
          <Delete />
        </IconButton>

        {/* Delete User Dialog */}
        <Dialog open={open} onClose={this.handleClose}>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Confirm to delete your account
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.handleRemoveUser}
              color="secondary"
              autoFocus="autoFocus"
            >
              {isRemovingUser ? "Confirm" : "Deleting"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default RemoveUser;
