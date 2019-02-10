import React from "react";
import ColorPicker from "./ColorPicker";
import "./Rules.css";
import { Card, Button, Segment, Icon } from "semantic-ui-react";

const Rules = props => {
  const hexToRGB = hex => {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16),
      a = 1;

    return { r, g, b, a };
  };

  return (
    <Segment className="rules">
      <Card.Content>
        {props.rules.map((rule, index) => (
          <div className="rule-down" key={index}>
            <div className="rule">
              <Button
                basic
                disabled={index === 0}
                color="red"
                size="mini"
                icon
                onClick={() => props.deleteRule(index)}
              >
                <Icon name="trash" />
              </Button>
              {index === 0 ? (
                <div className="white-box" />
              ) : (
                <ColorPicker
                  index={index}
                  changeColor={props.changeColor}
                  color={hexToRGB(rule.color)}
                />
              )}
              <Button
                basic
                color="blue"
                size="mini"
                icon
                onClick={() => props.toggle(index)}
              >
                {rule.dir === "left" ? (
                  <Icon name="arrow left" />
                ) : (
                  <Icon name="arrow right" />
                )}
              </Button>
            </div>
            {index < props.rules.length-1 && <Icon key={`down${index}`} name="arrow down" className="arrow-down" />}
          </div>
        ))}
      </Card.Content>
      <Card.Content className="add-button-container">
        <Button basic color="blue" id="add-rule" onClick={props.addRule}>
          Add Rule
        </Button>
      </Card.Content>
    </Segment>
  );
};

export default Rules;
