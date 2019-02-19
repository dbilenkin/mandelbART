import React from "react";

import { Grid } from "semantic-ui-react";

const About = () => (
  <div className="app-600">
    <Grid columns={5} padded>
      This is where there will be info about what I did here. In the meantime
      here is a link to the
      <a
        rel="noopener noreferrer"
        target="_blank"
        href="https://en.wikipedia.org/wiki/Mandelbrot_set"
      >
        Mandelbrot wikipedia page
      </a>
    </Grid>
  </div>
);

export default About;
