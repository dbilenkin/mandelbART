import React, { Component } from "react";
import "./App.css";
import Draw from "./components/Draw";
import ColorPicker from "./components/ColorPicker";
import "semantic-ui-css/semantic.min.css";
import { Menu } from "semantic-ui-react";
import { getRandomColor, getLeftOrRight } from "./utils";
import { sampleRules } from "./samples";
import queryString from "query-string";
import Mandelbrot from "./Mandelbrot";

class App extends Component {
  state = {
    mandelbrot: new Mandelbrot(),
    topLeft: {
      a: -2,
      b: -1
    },
    palette: ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"],
    zoomConst: 1,
    zoomFactor: 10,
    colorSmooth: 500,
    iterations: 10000,
    width: 600
  };

  NUM_RULES = Math.floor(Math.random() * 10) + 1;

  changeSteps = steps => {
    this.setState({ steps });
  };

  componentDidMount() {
    const { zoom, left, top } = queryString.parse(window.location.search);
    if (zoom && left && top) {
      this.setState({
        zoomConst: zoom,
        topLeft: {
          a: left,
          b: top
        }
      });
    }
  }


  changeColor = (index, color) => {
    let palette = [...this.state.palette];
    palette[index] = color.hex;
    this.setState({ palette });
    this.state.mandelbrot.recolor(palette);
  };

  changeSpeed = event => {
    this.setState({ speed: event.target.value });
  };

  changeSize = event => {
    this.setState({ size: event.target.value });
  };

  changeZoomConst = () => {
    this.setState({ zoomConst: this.state.zoomConst * this.state.zoomFactor });
  };

  changeZoomFactor = event => {
    this.setState({ zoomFactor: event.target.value });
  };

  changeIterations = event => {
    this.setState({ iterations: event.target.value });
  };

  toggleRunning = () => {
    this.setState({ running: !this.state.running });
  };

  handleItemClick = (e, { name }) => {
    this.setState(sampleRules(name));
  };

  changePalette = palette => {
    this.setState({ palette });
  };

  resize = width => {
    this.setState({ width });
  };

  hexToRGB = hex => {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16),
      a = 1;

    return { r, g, b, a };
  };

  render() {
    return (
      this.state.mandelbrot ?
      <div className={`app-${this.state.width}`}>
        <Menu text>
          <Menu.Item header>MandelbART</Menu.Item>
          <Menu.Item name="something" onClick={this.handleItemClick} />
          <Menu.Item name="anotherThing" onClick={this.handleItemClick} />
          {this.state.palette.map((color, index) => (
            <ColorPicker
              index={index}
              changeColor={this.changeColor}
              color={this.hexToRGB(color)}
            />
          ))}
        </Menu>
        <Draw
          state={this.state}
          changeSize={this.changeSize}
          changeSpeed={this.changeSpeed}
          changeZoomConst={this.changeZoomConst}
          changeZoomFactor={this.changeZoomFactor}
          changeIterations={this.changeIterations}
          changePalette={this.changePalette}
          resize={this.resize}
          toggleRunning={this.toggleRunning}
        />
      </div> :<div>hey</div>
    );
  }
}

export default App;
