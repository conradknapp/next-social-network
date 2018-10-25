import Button from "@material-ui/core/Button";

import { unfollowUser, followUser } from "../../lib/auth";

const FollowUser = ({ isFollowing, toggleFollow }) => {
  const request = isFollowing ? unfollowUser : followUser;

  return (
    <Button
      variant="contained"
      color={isFollowing ? "secondary" : "primary"}
      onClick={() => toggleFollow(request)}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowUser;