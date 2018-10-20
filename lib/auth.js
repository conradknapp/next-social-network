import Router from "next/router";
import axios from "axios";

axios.defaults.withCredentials = true;

const WINDOW_USER_SCRIPT_VARIABLE = `__USER__`;

const decode = ({ token }) => {
  if (!token) {
    return {};
  }
  console.log(token);
};

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
    res.finished = true;
    return {};
  }
  Router.replace(path);
  return {};
};

export const authInitialProps = (redirectIfAuth, secured) => ({
  req,
  res,
  query: { userId }
}) => {
  const auth = req ? getServerSideToken(req) : getClientSideToken();
  const currentPath = req ? req.url : window.location.pathname;
  const user = auth.user;
  const isAnonymous = !user;
  if (secured && isAnonymous && currentPath !== "/signin") {
    return redirect(res, "/signin");
  }
  // if (!isAnonymous && redirectIfAuth) {
  //   const path = getRedirectPath(user.type);
  //   if (current !== path) {
  //     return redirect(res, path);
  //   }
  return { auth, userId };
};

export const getUserProfile = async userId => {
  const { data } = await axios.get(`/api/users/profile/${userId}`);
  return data;
};

export const updateUserProfile = async (payload, userId) => {
  const { data } = await axios.put(`/api/users/${userId}`, payload);
  return data;
};

export const deleteUser = async userId => {
  const { data } = await axios.delete(`/api/users/${userId}`);
  return data;
};

export const signupUser = async payload => {
  const { data } = await axios.post("/api/auth/signup", payload);
  return data;
};

export const signinUser = async payload => {
  const { data } = await axios.post("/api/auth/signin", payload);
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = data || {};
  }
};

export const signoutUser = async () => {
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = {};
  }
  const { data } = await axios.get("/api/auth/signout");
  console.log(data);
  Router.push("/signin");
};

export const followUser = async (userId, followId) => {
  const { data } = await axios.put("/api/users/follow", { userId, followId });
  return data;
};

export const unfollowUser = async (userId, unfollowId) => {
  const { data } = await axios.put("/api/users/unfollow", {
    userId,
    unfollowId
  });
  return data;
};

export const findPeople = async userId => {
  const { data } = await axios.get(`/api/users/findpeople/${userId}`);
  return data;
};

export const deleteUserPost = async postId => {
  const { data } = await axios.delete(`/api/posts/${postId}`);
  return data;
};

export const likeUserPost = async payload => {
  const { data } = await axios.put("/api/posts/like", payload);
  return data;
};

export const unlikeUserPost = async payload => {
  const { data } = await axios.put("/api/posts/unlike", payload);
  return data;
};

export const listNewsFeed = async userId => {
  const { data } = await axios.get(`/api/posts/feed/${userId}`);
  return data;
};

export const listByUser = async userId => {
  const { data } = await axios.get(`/api/posts/by/${userId}`);
  return data;
};

export const create = async (userId, post) => {
  const { data } = await axios.post(`/api/posts/new/${userId}`, post);
  return data;
};

export const commentPost = async payload => {
  const { data } = await axios.put("api/posts/comment", payload);
  return data;
};

export const uncommentPost = async payload => {
  const { data } = await axios.put("api/posts/uncomment", payload);
  return data;
};
