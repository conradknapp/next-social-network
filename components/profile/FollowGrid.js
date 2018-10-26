import React from "react";
import {
  withStyles,
  Avatar,
  Typography,
  GridList,
  GridListTile
} from "@material-ui/core";
import Link from "next/link";

class FollowGrid extends React.Component {
  render() {
    const { classes, users } = this.props;

    return (
      <div className={classes.root}>
        <GridList cellHeight={160} className={classes.gridList} cols={4}>
          {users.map(user => (
            <GridListTile style={{ height: 120 }} key={user._id}>
              <Link href={`/profile/${user._id}`}>
                <a>
                <Avatar
                  src={`/api/users/image/${user._id}`}
                  className={classes.bigAvatar}
                />
                <Typography className={classes.tileText}>
                  {user.name}
                </Typography>
                </a>
              </Link>
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 2,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto"
  },
  gridList: {
    width: 500,
    height: 220
  },
  tileText: {
    textAlign: "center",
    marginTop: 10
  }
});

export default withStyles(styles)(FollowGrid);
