import React, { Component } from "react";
import "./Home.css";
import ColorPicker from "./ColorPicker";
import "semantic-ui-css/semantic.min.css";
import { Menu, Button, Dropdown, Segment } from "semantic-ui-react";
import Mandelbrot from "../services/Mandelbrot";
import palettes from "../services/palettes";
import { getRandomColor } from "../services/utils";
import SaveModal from "./SaveModal";

class Home extends Component {
  state = {
    mandelbrot: new Mandelbrot(),
    topLeft: {
      a: -2,
      b: -1
    },
    palette: {
      name: "First",
      colors: ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"]
    },
    zoomConst: 1,
    zoomFactor: 10,
    colorSmooth: 8,
    iterations: 12,
    width: 600,
    // countWorkers: navigator.hardwareConcurrency
    countWorkers: 1
  };

  setupState({ zoom, left, top, iterations, colors, colorSmooth }) {
    const state = { ...this.state };
    state.zoomConst = parseInt(zoom || 1);
    state.topLeft = {
      a: parseFloat(left || -2),
      b: parseFloat(top || -1)
    };
    state.iterations = iterations || 12;
    state.palette.colors = colors
      ? colors.split("-").map(color => `#${color}`)
      : ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"];
    state.colorSmooth = colorSmooth || 8;

    return state;
  }

  componentDidMount() {
    this.canvas = this.refs.canvas;
    const state = this.setupState(this.props.match.params);
    this.setState(state);
    this.state.mandelbrot.start(this.canvas, state);

    this.unlisten = this.props.history.listen((location, action) => {
      console.log(`The pathname is ${location.pathname}`);
      console.log(`path array: ${location.pathname.split("/")}`);
      const path = location.pathname.split("/");
      const left = path[2];
      const top = path[3];
      const zoom = path[4];
      const iterations = path[5];
      const colors = path[6];
      const colorSmooth = path[7];

      const newState = this.setupState({
        zoom,
        left,
        top,
        iterations,
        colors,
        colorSmooth
      });

      this.setState(newState);
      this.state.mandelbrot.start(this.canvas, newState);
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  changeZoom = ({ clientX, clientY }) => {
    this.changeZoomConst();
    const topLeft = this.state.mandelbrot.zoom({ clientX, clientY });
    this.props.history.push(
      `/home/${topLeft.a}/${topLeft.b}/${this.state.zoomConst *
        this.state.zoomFactor}/${
        this.state.iterations
      }/${this.state.palette.colors.map(color => color.slice(1)).join("-")}/${
        this.state.colorSmooth
      }`
    );
  };

  changeColor = (index, color) => {
    let palette = { ...this.state.palette };
    palette.colors[index] = color.hex;
    this.setState({ palette });
    this.state.mandelbrot.recolor(palette);
  };

  deleteColor = index => {
    let palette = { ...this.state.palette };
    palette.colors.splice(index, 1);
    this.setState({ palette });
    this.state.mandelbrot.recolor(palette);
  };

  addColor = () => {
    let palette = { ...this.state.palette };
    palette.colors.push(getRandomColor());
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
    const state = { ...this.state };
    state.iterations = event.target.value;
    this.setState(state);
    this.state.mandelbrot.redraw(state);
  };

  changeSmooth = event => {
    this.setState({ colorSmooth: event.target.value });
    this.state.mandelbrot.recolor(this.state.palette, event.target.value);
  };

  changePalette = palette => {
    this.setState({ palette });
    this.state.mandelbrot.recolor(palette);
  };

  resize = () => {
    const width = this.state.width === 600 ? 1200 : 600;
    this.setState({ width });
    this.state.mandelbrot.resize(width, (width * 2) / 3);
  };

  reset = () => {
    this.props.history.push("/home/-2/-1/1");
  };

  save = ({ width, height, iterations }) => {
    this.state.mandelbrot.save(width, height, iterations);
  };

  hexToRGB = hex => {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16),
      a = 1;

    return { r, g, b, a };
  };

  render() {
    return this.state.mandelbrot ? (
      <div className={`app-${this.state.width}`}>
        <Menu text>
          <Dropdown item text={this.state.palette.name}>
            <Dropdown.Menu>
              {palettes
                .filter(palette => palette.name !== this.state.palette.name)
                .map((palette, i) => (
                  <Dropdown.Item
                    key={i}
                    onClick={() => this.changePalette(palette)}
                  >
                    {palette.name}
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item>
            {this.state.palette.colors.map((color, index) => (
              <div key={index}>
                <ColorPicker
                  index={index}
                  changeColor={this.changeColor}
                  deleteColor={this.deleteColor}
                  color={this.hexToRGB(color)}
                />
              </div>
            ))}
            {this.state.palette.colors.length <= 8 && (
              <Button icon="plus" basic onClick={this.addColor} />
            )}
          </Menu.Item>
          <Menu.Item>
            <div className="sliders">
              <input
                type="range"
                id="colorSmooth"
                value={this.state.colorSmooth}
                name="colorSmooth"
                min="0"
                max="12"
                onChange={this.changeSmooth}
              />
              <label htmlFor="colorSmooth">
                Palette Size: {Math.pow(2, this.state.colorSmooth)}
              </label>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div className="sliders">
              <input
                type="range"
                id="iterations"
                value={this.state.iterations}
                name="iterations"
                min="7"
                max="17"
                onChange={this.changeIterations}
              />
              <label htmlFor="iterations">
                Iterations: {Math.pow(2, this.state.iterations)}
              </label>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div className="sliders">
              <input
                type="range"
                id="zoomFactor"
                value={this.state.zoomFactor}
                name="zoomFactor"
                min="2"
                max="100"
                onChange={this.changeZoomFactor}
              />
              <label htmlFor="zoomFactor">
                Zoom Factor: {this.state.zoomFactor}
              </label>
            </div>
          </Menu.Item>
          <Menu.Item>
            <Button
              icon={this.state.width === 600 ? "expand" : "compress"}
              basic
              color="orange"
              onClick={this.resize}
            />
          </Menu.Item>
          <Menu.Item>
            <Button icon="redo" basic color="purple" onClick={this.reset} />
          </Menu.Item>
          <Menu.Item>
            <SaveModal save={this.save} />
          </Menu.Item>
          <Menu.Item>
            <div>Zoom: {this.state.zoomConst.toExponential(1)}</div>
          </Menu.Item>
        </Menu>
        <Segment className="grid-card">
          <div id="rendering">
            <i className="spinner big loading icon" />
            <div id="renderPercentage" />
          </div>

          <div id="canvas-container" className="Grid">
            <canvas
              onClick={this.changeZoom}
              ref="canvas"
              width="600"
              height="400"
            />
          </div>
        </Segment>
      </div>
    ) : (
      <div>hey</div>
    );
  }
}

export default Home;
