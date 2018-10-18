// import fetch from "isomorphic-unfetch";

// const dev = process.env.NODE_ENV !== "production";
// const port = process.env.PORT || 3000;
// const ROOT_URL = dev ? `http://localhost:${port}` : "<production-url>";

// export const sendRequest = async (path, payload) => {
//   const headers = {
//     // Making a request w/ type JSON, accepting a response w/ JSON
//     "Content-type": "application/json",
//     accept: "application/json"
//   };

//   const response = await fetch(`${ROOT_URL}${path}`, {
//     method: "POST",
//     credentials: "include",
//     headers,
//     body: JSON.stringify(payload)
//   });

//   const data = await response.json();

//   if (data.error) {
//     throw new Error(data.error);
//   }

//   return data;
// };
