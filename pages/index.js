import React from "react";
import Head from "next/head";
import io from "socket.io-client";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { counter: "", echo: "" };
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on("now", data => {
      this.setState({ counter: data.message });
    });
    this.socket.on("echo", data => {
      this.setState({ echo: data.message });
    });
    document.getElementById("send").addEventListener("click", () => {
      this.socket.emit("echo", {
        message: document.getElementById("message").value
      });
    });
  }

  render() {
    return (
      <div>
        <Head>
          <title>Test page</title>
        </Head>
        <h1>Counter: {this.state.counter}</h1>
        <table>
          <tr>
            <td>Message:</td>
            <td>
              <input type="text" id="message" defaultValue="echo test" />
            </td>
            <td>
              <button id="send">SEND</button>
            </td>
          </tr>
          <tr>
            <td colSpan="3">{this.state.echo}</td>
          </tr>
        </table>
      </div>
    );
  }
}

export default Index;
