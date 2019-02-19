import React from "react";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";

class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    this.props.changeColor(this.props.index, color);
  };

  handleDelete = () => {
    this.props.deleteColor(this.props.index);
  };

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: "20px",
          height: "14px",
          borderRadius: "2px",
          background: `rgba(${this.props.color.r}, ${this.props.color.g}, ${
            this.props.color.b
          }, ${this.props.color.a})`
        },
        swatch: {
          padding: "2px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
          textAlign: "center",
          margin: "2px"
        },
        x: {
          color: "red",
          paddingBottom: "2px"
        },
        popover: {
          position: "absolute",
          zIndex: "2"
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px"
        }
      }
    });

    return (
      <div style={styles.swatch}>
        <div style={styles.x} onClick={this.handleDelete}>
          x
        </div>
        <div onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SketchPicker
              color={this.props.color}
              onChange={this.handleChange}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default ColorPicker;
