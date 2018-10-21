import Post from "./Post";

const PostList = ({ posts, removePost, auth, handleLike, addComment, removeComment }) => (
  <div>
    {posts.map((item, i) => (
      <Post key={i} auth={auth} post={item} removePost={removePost}
      addComment={addComment}
      removeComment={removeComment}
      handleLike={handleLike} />
    ))}
  </div>
);

export default PostList;
