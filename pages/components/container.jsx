import React, { Component } from "react";

class Container extends Component {
  render() {
    return (
      <div className="m-1 w-1/2 p-2 bg-gray-900 items-center text-indigo-100 rounded-md shadow-inner p-5">
        <div className="bg-indigo-800 p-2 rounded cursor-pointer text-center">
          <div className="flex pl-5 text-indigo-200 capitalize">
            <span className="flex-1">ID</span>
            <span className="flex-1">Mac</span>
            <span className="flex-1">Description</span>
          </div>
          <div className="flex pl-5 text-indigo-100 capitalize">
            <span className="flex-1">5eb1581730e03169f0c3e720</span>
            <span className="flex-1">5f4-123f-323f-32</span>
            <span className="flex-1">windows 10 pc</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Container;
