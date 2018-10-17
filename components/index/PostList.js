import Post from "./Post";

const PostList = ({ posts, removeUpdate, auth }) => (
  <div style={{ marginTop: "24px" }}>
    {posts.map((item, i) => (
      <Post auth={auth} post={item} key={i} onRemove={removeUpdate} />
    ))}
  </div>
);

export default PostList;
