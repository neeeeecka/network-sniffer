import React, { Component } from "react";

const quarterSize = 4;

class HexDump extends Component {
    render = () => {
        const dom = [];
        const splitLines = this.props.hexDump.split(/\r?\n/);

        for (let i = 0; i <= splitLines.length - quarterSize; i += quarterSize) {
            dom.push(
                <HexQuarter hexDumpLines={splitLines.slice(i, i + quarterSize)} />
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
        return nextState.highlights != this.state.highlights;
    }

    render = () => {
        const dom = [];

        for (let lineIndex = 0; lineIndex < quarterSize; lineIndex++) {
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
                const hoverState = ((cSave + "-" + lineIndex) == this.state.highlights ? "bg-blue-400" : "");
                const hoverPos = cSave + "-" + lineIndex;
                if (i % 2 == 0) {
                    lineHexDom.push(
                        <span key={c++} onMouseLeave={this.clearHighLight} onMouseOver={() => this.setHighlightAt(hoverPos)} className={hoverState + " px-2 py-1"}>{lineHexSplit[cSave]}</span>
                    );
                }
                lineAsciiDom.push(
                    <span key={i} onMouseLeave={this.clearHighLight} onMouseOver={() => this.setHighlightAt(hoverPos)} className={hoverState + " py-1"}>{lineAscii[i]}</span>
                );
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