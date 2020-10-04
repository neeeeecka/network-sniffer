import Login from "./login";

import React from "react";
import App from "next/app";
// import "../static/tailwind.scss";
import "../static/main.css";
import "../static/global.scss";

class MainApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}

export default MainApp;
