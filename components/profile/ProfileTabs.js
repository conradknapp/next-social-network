import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import FollowTab from "./FollowTab";
import Post from "../index/Post";

class ProfileTabs extends React.Component {
  state = {
    tab: 0,
    disablePost: true
  };

  handleTabChange = (event, value) => {
    this.setState({ tab: value });
  };

  render() {
    const { tab, disablePost } = this.state;
    const {
      handleRemovePost,
      posts,
      user,
      auth
    } = this.props;

    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={tab}
            onChange={this.handleTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            fullWidth
          >
            <Tab label="Posts" />
            <Tab label="Following" />
            <Tab label="Followers" />
          </Tabs>
        </AppBar>
        {tab === 0 && (
          <TabContainer>
            {posts.map(post => (
              <Post
                key={post._id}
                post={post}
                auth={auth}
                disablePost={disablePost}
                handleRemovePost={handleRemovePost}
              />
            ))}
          </TabContainer>
        )}
        {tab === 1 && (
          <TabContainer>
            <FollowTab users={user.following} />
          </TabContainer>
        )}
        {tab === 2 && (
          <TabContainer>
            <FollowTab users={user.followers} />
          </TabContainer>
        )}
      </div>
    );
  }
}

const TabContainer = ({ children }) => (
  <Typography component="div" style={{ padding: "1em" }}>
    {children}
  </Typography>
);

export default ProfileTabs;
