import React, { Component } from "react";

import { Button, Segment } from "semantic-ui-react";

class Draw extends Component {

  componentDidMount() {
    this.canvas = this.refs.canvas;
    this.props.state.mandelbrot.start(this.canvas, this.props.state);
  }

  componentDidUpdate() {
    this.props.state.mandelbrot.update(this.props.state);
  }

  resetCanvas = () => {
    this.props.state.mandelbrot.reset(this.canvas);
  };

  changeZoom = ({ clientX, clientY }) => {
    this.props.changeZoomConst();
    this.props.state.mandelbrot.zoom({ clientX, clientY });
  };

  changePalette = () => {
    const palette = ['#faa916','#bd312d','#31393c','#2176ff','#06a77d'];
    this.props.changePalette(palette);
    this.props.state.mandelbrot.recolor(palette);
  }

  resize = () => {
    this.props.resize(1200);
    this.props.state.mandelbrot.resize(1200, 800);
  }

  render() {
    return (
      <Segment className="grid-card">
        <div className="Grid">
          <canvas
            onClick={this.changeZoom}
            ref="canvas"
            width="600"
            height="400"
          />
        </div>
        <div className="interaction">
          <div className="buttons">
            <Button basic color="purple" onClick={this.resetCanvas}>
              Reset
            </Button>
            <Button
              basic
              color="orange"
              onClick={this.resize}
            >
              Resize
            </Button>
            <Button basic color="blue" onClick={this.props.state.mandelbrot.save}>
              Save
            </Button>
            <Button basic color="red" onClick={this.changePalette}>
              Palette
            </Button>
          </div>
          <div>Zoom: {this.props.state.zoomConst}</div>
          <div className="sliders">
            <input
              type="range"
              id="iterations"
              value={this.props.state.iterations}
              name="iterations"
              min="100"
              max="10000"
              onChange={this.props.changeIterations}
            />
            <label htmlFor="iterations">
              Iterations: {this.props.state.iterations}
            </label>
          </div>
          <div className="sliders">
            <input
              type="range"
              id="zoomFactor"
              value={this.props.state.zoomFactor}
              name="zoomFactor"
              min="2"
              max="100"
              onChange={this.props.changeZoomFactor}
            />
            <label htmlFor="zoomFactor">
              Zoom Factor: {this.props.state.zoomFactor}
            </label>
          </div>
        </div>
      </Segment>
    );
  }
}

export default Draw;
