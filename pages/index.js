import React from "react";

export default class Index extends React.Component {
  state = {
    greeting: 'hello'
  }

  render() {
    return <p>{this.state.greeting} from next</p>;
  }
}
