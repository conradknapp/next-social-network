import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { signoutUser, deleteUser } from "../../lib/auth";
import Router from "next/router";

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
    Router.push("/");
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
          <DeleteIcon />
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
