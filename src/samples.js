import { getRandomColor } from "./utils";

const samples = {
  original: {
    rules: "LR",
    speed: 7,
    size: 6
  },
  symmetric: {
    rules: "LLRR",
    speed: 9,
    size: 4
  },
  weirdSquare: {
    rules: "LRRRRRLLR",
    speed: 10,
    size: 2
  },
  weirdHighway: {
    rules: "LLRRRLRLRLLR",
    speed: 8,
    size: 3
  },
  filledTriangle: {
    rules: "RRLLLRLLLRRR",
    speed: 9,
    size: 2
  }
}

export function sampleRules(sample) {
  const sampleRule = {
    running: true
  }

  sampleRule.rules = samples[sample].rules.split("").map((dir, index) => {
    return {
      color: index === 0 ? "#ffffff" : getRandomColor(),
      dir: dir === "L" ? "left" : "right"
    }
  });

  sampleRule.speed = samples[sample].speed;
  sampleRule.size = samples[sample].size;

  return sampleRule;

}
