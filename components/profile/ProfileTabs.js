import React from "react";
import { AppBar, Typography, Tabs, Tab } from "@material-ui/core";

import FollowGrid from "./FollowGrid";
import Post from "../index/Post";
// import PostList from './../post/PostList'

class ProfileTabs extends React.Component {
  state = {
    tab: 0,
    hideComments: true
  };

  componentWillReceiveProps = () => {
    this.setState({ tab: 0 });
  };

  handleTabChange = (event, value) => {
    this.setState({ tab: value });
  };

  render() {
    const { tab, hideComments } = this.state;
    const { handleRemovePost, handleToggleLike, posts, user, auth } = this.props;

    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={tab}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
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
                hideComments={hideComments}
                handleToggleLike={handleToggleLike}
                handleRemovePost={handleRemovePost}
              />
            ))}
          </TabContainer>
        )}
        {tab === 1 && (
          <TabContainer>
            <FollowGrid users={user.following} />
          </TabContainer>
        )}
        {tab === 2 && (
          <TabContainer>
            <FollowGrid users={user.followers} />
          </TabContainer>
        )}
      </div>
    );
  }
}

const TabContainer = ({ children }) => {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {children}
    </Typography>
  );
};

export default ProfileTabs;
