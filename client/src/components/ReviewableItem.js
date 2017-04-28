import React from 'react';
import {Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import DoneIcon from 'react-material-icons/icons/action/done';
import ClearIcon from 'react-material-icons/icons/content/clear';

class ReviewableItem extends React.Component {
  render() {
    return (
      <Paper zDepth={1} >
        <Row style={{ marginTop: 5, marginBottom: 5, minHeight: 32 }}>
          <Col xs={2} xsOffset={1} style={{ marginTop: 'auto', marginBottom: 'auto', fontStyle: 'italic' }}>
            {this.props.type}
          </Col>
          <Col xs={6} md={7} style={{ marginTop: 'auto', marginBottom: 'auto', overflow: 'auto' }}>
            {this.props.value}
          </Col>
          <Col xs={3} md={2} style={{ display: 'flex', marginTop: 'auto', marginBottom: 'auto' }}>
            <IconButton
              onTouchTap={ () => this.props.review(this.props.id, true) }
              style={{ marginRight: 5 }}
            >
              <DoneIcon />
            </IconButton>
            <IconButton
              onTouchTap={ () => this.props.review(this.props.id, false) }
              style={{ marginLeft: 5 }}
            >
              <ClearIcon />
            </IconButton>
          </Col>
        </Row>
      </Paper>
    );
  }
}

ReviewableItem.propTypes = {
  type: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  id: React.PropTypes.number.isRequired,
  review: React.PropTypes.func.isRequired,
};

export default ReviewableItem;
