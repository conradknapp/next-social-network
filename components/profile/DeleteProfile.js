import { Component } from "react";
// prettier-ignore
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Delete } from "@material-ui/icons";
import Router from "next/router";

import { signoutUser, removeUser } from "../../lib/auth";

class DeleteProfile extends Component {
  state = {
    open: false
  };

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  deleteAccount = () => {
    const { userId } = this.props;
    removeUser(userId);
    signoutUser();
    Router.push("/signup");
  };

  render() {
    const { open } = this.state;
    return (
      <span>
        <IconButton onClick={this.handleOpen} color="secondary">
          <Delete />
        </IconButton>

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
