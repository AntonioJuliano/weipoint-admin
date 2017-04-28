import React from 'react';
import {Card, CardText, CardTitle} from 'material-ui/Card';
import ReviewableItem from './ReviewableItem'
import isEqual from 'lodash.isequal';

class Reviewable extends React.Component {
  constructor(props) {
    super(props);

    this.getItemElements = this.getItemElements.bind(this);
    this.approveItem = this.approveItem.bind(this);
    this.denyItem = this.denyItem.bind(this);

    this.state = {
      items: this.getItemsFromProps(this.props)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      this.setState({ items: this.getItemsFromProps(nextProps) });
    }
  }

  getItemsFromProps(props) {
    let items = [];
    let i = 0;
    Object.keys(props.data.unapprovedData).forEach( k => {
      props.data[k].forEach( v => {
        items.push({
          type: k,
          value: v,
          id: i++
        });
      });
    });

    return items;
  }

  async approveItem(id) {
    console.log('approve ' + id);
  }

  async denyItem(id) {
    console.log('deny ' + id);
  }

  getItemElements() {
    return this.state.items.map( item => {
      return <ReviewableItem
        type={item.type}
        value={item.value}
        id={item.id}
        approve={this.approveItem}
        deny={this.denyItem}
      />
    })
  }

  render() {
    const domain = process.env.NODE_ENV === 'production' ? 'https://www.weipoint.com/' : 'http://localhost:3000/';
    const link = domain + this.props.reviewableType + '/' + this.props.address;

    return (
      <div>
        <Card>
          <CardTitle
            title={<a href={link} target='_blank'>{this.props.data.address}</a>}
            subtitle={this.props.data.type}
          />
          <CardText>
            {this.getItemElements()}
          </CardText>
        </Card>
      </div>
    );
  }
}

Reviewable.propTypes = {
  data: React.PropTypes.object.isRequired,
  completed: React.PropTypes.func.isRequired,
};

export default Reviewable;
