import React from "react";
// prettier-ignore
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Delete } from "@material-ui/icons";
import Router from "next/router";

import { signoutUser, deleteUser } from "../../lib/auth";

class DeleteProfile extends React.Component {
  state = {
    open: false
  };

  handleDialogOpen = () => this.setState({ open: true });

  handleDialogClose = () => this.setState({ open: false });

  deleteAccount = () => {
    const { userId } = this.props;
    deleteUser(userId);
    signoutUser();
    Router.push("/signup");
  };

  render() {
    const { open } = this.state;
    return (
      <span>
        <IconButton
          aria-label="Delete"
          onClick={this.handleDialogOpen}
          color="secondary"
        >
          <Delete />
        </IconButton>

        <Dialog open={open} onClose={this.handleDialogClose}>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Confirm to delete your account
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.deleteAccount}
              color="secondary"
              autoFocus="autoFocus"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    );
  }
}

export default DeleteProfile;
