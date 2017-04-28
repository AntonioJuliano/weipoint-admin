import React from 'react';
import {Row, Col} from 'react-flexbox-grid';

class ReviewableItem extends React.Component {
  render() {
    return (
      <Row style={{ marginTop: 5, marginBottom: 5 }}>
        <Col xs={2}>
          {this.props.type}
        </Col>
        <Col xs={7}>
          {this.props.value}
        </Col>
      </Row>
    );
  }
}

ReviewableItem.propTypes = {
  type: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  id: React.PropTypes.number.isRequired,
  approve: React.PropTypes.func.isRequired,
  deny: React.PropTypes.func.isRequired,
};

export default ReviewableItem;
