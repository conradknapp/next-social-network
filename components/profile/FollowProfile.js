import Button from "@material-ui/core/Button";
// import {unfollow, follow} from './api-user.js'

const FollowProfile = ({ following, onButtonClick }) => (
  <div>
    {following ? (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => onButtonClick(unfollow)}
      >
        Unfollow
      </Button>
    ) : (
      <Button
        variant="contained"
        color="primary"
        onClick={() => onButtonClick(follow)}
      >
        Follow
      </Button>
    )}
  </div>
);

export default FollowProfile;
