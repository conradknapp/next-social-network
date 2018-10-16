import React from "react";
import { authInitialProps } from "../lib/auth";

export default class Index extends React.Component {
  // static async getInitialProps() {
  //   const data = {
  //     name: "John Doe"
  //   };
  //   const user = await sendRequest("/api/users", {
  //     body: JSON.stringify(data)
  //   });
  //   return { user };
  // }
  render() {
    return <p>hi from next.js</p>;
  }
}

Index.getInitialProps = authInitialProps();
