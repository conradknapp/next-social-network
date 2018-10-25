import Router from "next/router";
import axios from "axios";

axios.defaults.withCredentials = true;

const WINDOW_USER_SCRIPT_VARIABLE = `__USER__`;

export const getUserScript = user => {
  const json = JSON.stringify(user);
  return `${WINDOW_USER_SCRIPT_VARIABLE} = ${json};`;
};

export const getServerSideToken = req => {
  if (req.user) {
    return { user: req.user };
  }
  return {};
};

export const getClientSideToken = () => {
  if (typeof window !== "undefined") {
    const user = window[WINDOW_USER_SCRIPT_VARIABLE] || {};
    return { user };
  }
  return { user: {} };
};

const redirect = (res, path) => {
  if (res) {
    // can specify it as a 302 (temporary instead of a 301 redirect)
    res.redirect(302, path);
    // res.finished is a next.js construct only, that tells next.js you have handled the entire request/response lifecycle in getInitialProps, so that it knows not to continue writing to the response.
    res.finished = true;
    return {};
  }
  // if no response, redirect on the client with Next's router
  Router.replace(path);
  return {};
};

export const authInitialProps = isProtectedRoute => ({
  req,
  res,
  query: { userId }
}) => {
  const auth = req ? getServerSideToken(req) : getClientSideToken();
  const currentPath = req ? req.url : window.location.pathname;
  const user = auth.user;
  const isAnonymous = !user;
  if (isProtectedRoute && isAnonymous && currentPath !== "/signin") {
    return redirect(res, "/signin");
  }
  return { auth, userId };
};

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

export const removeUser = async authUserId => {
  const { data } = await axios.delete(`/api/users/${authUserId}`);
  return data;
};

export const signupUser = async newUser => {
  const { data } = await axios.post("/api/auth/signup", newUser);
  return data;
};

export const signinUser = async user => {
  const { data } = await axios.post("/api/auth/signin", user);
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = data || {};
  }
};

export const signoutUser = async () => {
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = {};
  }
  const { data } = await axios.get("/api/auth/signout");
  Router.push("/signin");
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

export const removePost = async postId => {
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

export const addComment = async payload => {
  const { data } = await axios.put("api/posts/comment", payload);
  return data;
};

export const removeComment = async payload => {
  const { data } = await axios.put("api/posts/uncomment", payload);
  return data;
};
