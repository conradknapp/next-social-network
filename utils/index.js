import fetch from "isomorphic-unfetch";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const ROOT_URL = dev ? `http://localhost:${port}` : "<production-url>";

export const sendRequest = async (path, options = {}) => {
  const headers = {
    "Content-type": "application/json"
  };

  const response = await fetch(
    `${ROOT_URL}${path}`,
    Object.assign(
      {
        method: "POST",
        credentials: "include"
      },
      { headers },
      options
    )
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};
