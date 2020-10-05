import React, { Component } from "react";

const quarterSize = 4;

class HexDump extends Component {
    render = () => {
        const dom = [];
        const splitLines = this.props.hexDump.split(/\r?\n/);

        for (let i = 0; i < Math.max(splitLines.length - quarterSize, 1); i += quarterSize) {
            dom.push(
                <HexQuarter key={i} uid={this.props.uid} hexDumpLines={splitLines.slice(i, Math.min(splitLines.length, i + quarterSize))} />
            );
        }
        return <table className="block hexdump"><tbody>{dom}</tbody></table>;
    }
}

class HexQuarter extends Component {
    state = {
        highlights: 0
    }
    setHighlightAt = (index) => {
        this.setState({ highlights: index });
    }

    clearHighLight = () => {
        this.setState({ highlights: "-null" });
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return (nextState.highlights != this.state.highlights) || (nextProps.uid != this.props.uid);
    }

    render = () => {
        const dom = [];

        for (let lineIndex = 0; lineIndex < this.props.hexDumpLines.length; lineIndex++) {
            const line = this.props.hexDumpLines[lineIndex];

            const colon = line.indexOf(":");
            const lineStart = line.substring(0, colon);
            const lineHex = line.substring(colon + 2, colon + 1 + 4 * 8 + 8);
            const lineAscii = line.substring(colon + 3 + 4 * 8 + 8, line.length);

            const lineHexDom = [];
            const lineAsciiDom = [];

            let lineHexSplit = lineHex.split(" ");

            let c = 0;
            for (let i = 1; i <= 16; i++) {
                let cSave = c;
                const hoverState = ((cSave + "-" + lineIndex) == this.state.highlights ? " bg-blue-400" : "");
                const hoverPos = cSave + "-" + lineIndex;
                if (i % 2 == 0) {
                    const lineHexChar = lineHexSplit[cSave];
                    if (lineHexChar != "") {
                        lineHexDom.push(
                            <span key={c++} onMouseLeave={this.clearHighLight} onMouseOver={() => this.setHighlightAt(hoverPos)} className={hoverState + " py-1 px-2 "}>{lineHexChar}</span>
                        );
                    }
                }
                const lineAsciiChar = lineAscii[i - 1];
                if (lineAsciiChar) {
                    lineAsciiDom.push(
                        <span key={i} onMouseLeave={this.clearHighLight} onMouseOver={() => this.setHighlightAt(hoverPos)} className={hoverState + " py-1"}>{lineAsciiChar}</span>
                    );
                }
            }

            dom.push(<tr key={lineIndex}>
                <td>{lineStart}</td>
                <td>{lineHexDom}</td>
                <td>{lineAsciiDom}</td>
            </tr>);
        }

        return <React.Fragment>
            {dom}
        </React.Fragment>;
    }
}

export default HexDump;