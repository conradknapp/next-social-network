import Button from "@material-ui/core/Button";
import { unfollowUser, followUser } from '../../lib/auth';

const FollowProfile = ({ following, onButtonClick }) => (
  <div>
    {following ? (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => onButtonClick(unfollowUser)}
      >
        Unfollow
      </Button>
    ) : (
      <Button
        variant="contained"
        color="primary"
        onClick={() => onButtonClick(followUser)}
      >
        Follow
      </Button>
    )}
  </div>
);

export default FollowProfile;
