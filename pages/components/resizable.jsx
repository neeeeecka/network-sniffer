import React, { Component } from "react";
import StaticHelpers from "./staticHelpers";

let listenerExists = false;

class Resizable extends Component {
    state = {
        holding: false,
        // width: "auto"
        width: "150px"
    }
    clientX = 0;

    minWidth = 20;
    maxWidth = 400;

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }
    componentDidMount = () => {
        document.body.addEventListener("mouseup", this.mouseUp);
        document.body.addEventListener("mousemove", this.mouseMove);

        this.minWidth = this.ref.clientWidth;
        this.setState({ width: this.minWidth });
        if (this.props.setTdWidth) {
            this.props.setTdWidth(this.props.i, this.minWidth);
        }
    }
    componentWillUnmount = () => {
        document.removeEventListener("mouseup", this.mouseUp);
        document.removeEventListener("mousemove", this.mouseMove);
    }
    mouseUp = (e) => {
        this.setState({ holding: false });
    }
    mouseMove = (e) => {
        if (this.state.holding && this.props.setTdWidth) {
            let deltaX = e.clientX - this.clientX;

            let newWidth = StaticHelpers.clamp(this.state.width + deltaX, this.minWidth, this.maxWidth);
            this.setState({ width: newWidth });

            this.props.setTdWidth(this.props.i, newWidth);

            this.clientX = e.clientX;
        }
    }
    render = () => {
        return <span
            className="td inline-block "
            index={this.props.i}
            style={this.props.width ? { width: this.props.width } : { width: this.state.width }}
            onMouseDown={(e) => {
                this.clientX = e.clientX;
                this.setState({ holding: true });
            }}
            ref={(el) => {
                this.ref = el;
            }}
        >{this.props.children}</span>;
    }
}

export default Resizable;