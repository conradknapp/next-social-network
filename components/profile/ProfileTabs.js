import React from "react";
import { AppBar, Typography, Tabs, Tab } from "@material-ui/core";

import FollowGrid from "./FollowGrid";
// import PostList from './../post/PostList'

class ProfileTabs extends React.Component {
  state = {
    tab: 0,
    posts: []
  };

  componentWillReceiveProps = () => {
    this.setState({ tab: 0 });
  };

  handleTabChange = (event, value) => {
    this.setState({ tab: value });
  };

  render() {
    const { tab } = this.state;
    const { removePostUpdate, posts, user } = this.props;

    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.tab}
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
            <PostList removeUpdate={removePostUpdate} posts={posts} />
          </TabContainer>
        )}
        {tab === 1 && (
          <TabContainer>
            <FollowGrid people={user.following} />
          </TabContainer>
        )}
        {tab === 2 && (
          <TabContainer>
            <FollowGrid people={user.followers} />
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
