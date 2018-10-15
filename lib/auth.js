import Router from "next/router";
import axios from "axios";

axios.defaults.withCredentials = true;

const WINDOW_USER_SCRIPT_VARIABLE = `__USER__`;

const decode = ({ token }) => {
  if (!token) {
    return {};
  }
  const { email, type } = token || {};
  return { user: { email, type } };
};

export const getUserScript = user => {
  const json = JSON.stringify(user);
  return `${WINDOW_USER_SCRIPT_VARIABLE} = ${json};`;
};

export const getServerSideToken = req => {
  const { signedCookies } = req;

  if (!signedCookies) {
    return {};
  }
  try {
    return decode(signedCookies);
  } catch (parseError) {
    return {};
  }
};

export const getClientSideToken = () => {
  if (typeof window !== "undefined") {
    const user = window[WINDOW_USER_SCRIPT_VARIABLE] || {};
    return { user };
  }
  return { user: {} };
};

const getRedirectPath = userType => {
  switch (userType) {
    case "authenticated":
      return "/profile";
    default:
      return "/signin";
  }
};

const redirect = (res, path) => {
  if (res) {
    res.redirect(302, path);
    res.finished = true;
    return {};
  }
  Router.replace(path);
  return {};
};

export const authInitialProps = (redirectIfAuth, secured) => async ({
  req,
  res
}) => {
  const auth = req ? getServerSideToken(req) : getClientSideToken();
  const current = req ? req.url : window.location.pathname;
  const user = auth.user;
  const isAnonymous = !user || user.type !== "authenticated";
  if (secured && isAnonymous && current !== "/signin") {
    return redirect(res, "/signin");
  }
  if (!isAnonymous && redirectIfAuth) {
    const path = getRedirectPath(user.type);
    if (current !== path) {
      return redirect(res, path);
    }
  }
  return { auth };
};

export const getUserProfile = async () => {
  const { data } = await axios.get("/api/users/profile");
  return data;
};

export const updateUserProfile = async payload => {
  const { data } = await axios.put(`/api/users/${payload._id}`, payload);
  console.log(data);
  return data;
};

export const deleteUser = async userId => {
  const { data } = await axios.delete(`/api/users/${userId}`);
  console.log(data);
  return data;
};

export const signupUser = async payload => {
  const { data } = await axios.post("/api/auth/signin", payload);
  console.log(data);
  return data;
};

export const signinUser = async payload => {
  const { data } = await axios.post("/api/auth/signin", payload);
  console.log(data);
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = data || {};
  }
};

export const signoutUser = async () => {
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = {};
  }
  await axios.get("/api/auth/signout");
  Router.push("/signin");
};
