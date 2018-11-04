import axios from "axios";

axios.defaults.withCredentials = true;

export const getAuthUser = async authUserId => {
  const { data } = await axios.get(`/api/users/${authUserId}`);
  return data;
};

export const getUser = async userId => {
  const { data } = await axios.get(`/api/users/profile/${userId}`);
  return data;
};

export const updateUser = async (authUserId, userData) => {
  const { data } = await axios.put(`/api/users/${authUserId}`, userData);
  return data;
};

export const deleteUser = async authUserId => {
  const { data } = await axios.delete(`/api/users/${authUserId}`);
  return data;
};

export const followUser = async (authUserId, followId) => {
  const { data } = await axios.put("/api/users/follow", {
    authUserId,
    followId
  });
  return data;
};

export const unfollowUser = async (authUserId, followId) => {
  const { data } = await axios.put("/api/users/unfollow", {
    authUserId,
    followId
  });
  return data;
};

export const findUsers = async userId => {
  const { data } = await axios.get(`/api/users/findusers/${userId}`);
  return data;
};

export const deletePost = async postId => {
  const { data } = await axios.delete(`/api/posts/${postId}`);
  return data;
};

export const likePost = async likePostPayload => {
  const { data } = await axios.put("/api/posts/like", likePostPayload);
  return data;
};

export const unlikePost = async unlikePostPayload => {
  const { data } = await axios.put("/api/posts/unlike", unlikePostPayload);
  return data;
};

export const getPostFeed = async authUserId => {
  const { data } = await axios.get(`/api/posts/feed/${authUserId}`);
  return data;
};

export const getPostsByUser = async userId => {
  const { data } = await axios.get(`/api/posts/by/${userId}`);
  return data;
};

export const addPost = async (userId, post) => {
  const { data } = await axios.post(`/api/posts/new/${userId}`, post);
  return data;
};

export const addComment = async (postId, comment) => {
  const { data } = await axios.put("api/posts/comment", { postId, comment });
  return data;
};

export const deleteComment = async (postId, comment) => {
  const { data } = await axios.put("api/posts/uncomment", { postId, comment });
  return data;
};
