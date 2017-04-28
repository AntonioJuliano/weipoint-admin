import React from 'react';
import isEqual from 'lodash.isequal';
import { Row, Col } from 'react-flexbox-grid';
import Reviewable from './Reviewable';

class MetadataReview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewables: [],
      completed: false
    }

    this.fetchData = this.fetchData.bind(this);
    this.reviewableCompleted = this.reviewableCompleted.bind(this);
    this.getReviewableElements = this.getReviewableElements.bind(this);

    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      this.setState({ reviewables: [], completed: false });
      this.fetchData();
    }
  }

  async fetchData() {
    const requestPath = '/api/v1/metadata/unapproved';

    try {
      const response = await fetch(requestPath, { method: 'get' });
      if (response.status !== 200) {
        throw new Error("Response Status " + response.status);
      }
      const json = await response.json();

      if (json.data.length === 0) {
        this.setState({ completed: true });
      } else {
        this.setState({ reviewables: json.data });
      }
    } catch (e) {
      console.error(e)
    }
  }

  reviewableCompleted(address) {
    const newReviewables = this.state.reviewables.filter( r => r.address !== address);

    if (newReviewables.length === 0) {
      this.setState({ reviewables: [], completed: true });
    } else {
      this.setState({ reviewables: newReviewables });
    }
  }

  getReviewableElements() {
    return this.state.reviewables.map(
      d => {
        return <Reviewable
          data={d}
          completed={this.reviewableCompleted}
          key={d.address}
        />
      });
  }

  render() {
    return (
      <Row center='xs' style={{ marginTop: 20}}>
        <Col xs={11} sm={10} md={9} lg={8}>
          {this.getReviewableElements()}
        </Col>
      </Row>
    );
  }
}

MetadataReview.propTypes = {
};

export default MetadataReview;
