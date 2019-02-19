import React from "react";
import { Link } from "react-router-dom";
import reactCSS from "reactcss";

import { Grid, Segment } from "semantic-ui-react";

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context("./images", false, /\.(png|jpe?g|svg)$/)
);

const styles = reactCSS({
  default: {
    image: {
      width: "275px"
    }
  }
});

const getPath = image => {
  const removedTail = image.substring(0, image.lastIndexOf("."));
  return `/home${removedTail
    .substring(0, removedTail.lastIndexOf("."))
    .replace("/static/media/mandelbrot", "")
    .replace(/_/g, "/")}`;
};

const mandelbrotPaths = images.map(image => {
  return {
    path: getPath(image),
    imageSrc: image
  };
});

const Gallery = () => (
  <div className="app-600">
    <Grid columns={3} padded>
      {mandelbrotPaths.map(image => (
        <Grid.Column key={image.imageSrc}>
          <Segment>
            <Link to={image.path}>
              <img
                style={styles.image}
                src={image.imageSrc}
                alt={image.imageSrc}
              />
            </Link>
          </Segment>
        </Grid.Column>
      ))}
    </Grid>
  </div>
);

export default Gallery;
