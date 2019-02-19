import React, { Component } from "react";
import { Button, Header, Form, Modal } from "semantic-ui-react";

export default class ModalExampleControlled extends Component {
  state = { modalOpen: false, width: 300, height: 200, iterations: 10000 };

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: parseInt(value) });
  };

  handleSave = () => {
    this.props.save(this.state, this.handleClose);
    this.handleClose();
  };

  render() {
    const { width, height, iterations } = this.state;

    return (
      <Modal
        size="tiny"
        trigger={
          <Button onClick={this.handleOpen} icon="save" basic color="blue" />
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>Download Rendered Image</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>Choose Resolution</Header>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Width"
                  placeholder="Width"
                  name="width"
                  value={width}
                  onChange={this.handleChange}
                />
                <Form.Input
                  fluid
                  label="Height"
                  placeholder="Height"
                  name="height"
                  value={height}
                  onChange={this.handleChange}
                />
                <Form.Input
                  fluid
                  label="Iterations"
                  placeholder="Iterations"
                  name="iterations"
                  value={iterations}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={this.handleClose}>
            Cancel
          </Button>
          <Button
            positive
            icon="save"
            labelPosition="right"
            content="Save"
            onClick={this.handleSave}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}
