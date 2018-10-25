import { Component } from "react";
// prettier-ignore
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Delete } from "@material-ui/icons";
import Router from "next/router";

import { signoutUser, removeUser } from "../../lib/auth";

class RemoveUser extends Component {
  state = {
    open: false
  };

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  handleRemoveUser = () => {
    const { auth } = this.props;
    removeUser(auth.user._id);
    signoutUser();
    Router.push("/signup");
  };

  render() {
    const { open } = this.state;

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
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default RemoveUser;
