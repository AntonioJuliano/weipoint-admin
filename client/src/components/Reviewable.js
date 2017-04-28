import React from 'react';
import {Card, CardText, CardTitle} from 'material-ui/Card';
import ReviewableItem from './ReviewableItem'
import isEqual from 'lodash.isequal';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import DoneAllIcon from 'react-material-icons/icons/action/done-all';
import { Row } from 'react-flexbox-grid';

class Reviewable extends React.Component {
  constructor(props) {
    super(props);

    this.getItemElements = this.getItemElements.bind(this);
    this.reviewItem = this.reviewItem.bind(this);
    this.approveAll = this.approveAll.bind(this);
    this.canApproveAll = this.canApproveAll.bind(this);

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
      props.data.unapprovedData[k].forEach( v => {
        items.push({
          type: k,
          value: v,
          id: i++
        });
      });
    });

    return items;
  }

  reviewItem(id, accept) {
    const items = this.state.items;
    const { address, type } = this.props.data;

    let itemsClone = this.state.items.slice(0);
    const idx = itemsClone.indexOf(itemsClone.find( item => item.id === id ));
    itemsClone.splice(idx, 1);

    this.setState({ items: itemsClone });
    if (itemsClone.length === 0) {
      this.props.completed(this.props.data.address);
    }
    this.applyDecision(accept, items, address, type, id);
  }

  approveAll() {
    const items = this.state.items;
    const { address, type } = this.props.data;
    this.props.completed(this.props.data.address);
    this.applyDecision(true, items, address, type);
  }

  async applyDecision(accept, items, address, type, id) {
    const requestPath = '/api/v1/metadata/review';

    let request = {
      address: address,
      reviewableType: type,
      accept: accept
    }

    if (id !== undefined) {
      const { type, value } = items.find( item => item.id === id );
      request.metadataType = type;
      request.value = value;
    }

    try {
      const response = await fetch(requestPath, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });
      if (response.status !== 200) {
        throw new Error("Apply decision Response Status " + response.status);
      }
    } catch (e) {
      console.error(e)
    }
  }

  getItemElements() {
    return this.state.items.map( item => {
      return <ReviewableItem
        type={item.type}
        value={item.value}
        id={item.id}
        review={this.reviewItem}
        key={item.id}
      />
    })
  }

  canApproveAll() {
    const numLinks = this.state.items.filter( item => item.type === 'links').length;
    const numDescriptions = this.state.items.filter( item => item.type === 'descriptions').length;

    return (numLinks <= 1) && (numDescriptions <= 1);
  }

  render() {
    const domain = process.env.NODE_ENV === 'production' ? 'https://www.weipoint.com/' : 'http://localhost:3000/';
    const link = domain + this.props.data.type + '/' + this.props.data.address;

    return (
      <div style={{ textAlign: 'left', marginTop: 10 }}>
        <Card>
          <CardTitle
            title={<a href={link} target='_blank'>{this.props.data.address}</a>}
            subtitle={this.props.data.type}
          />
          <CardText>
            {this.getItemElements()}
            <Row center='xs'>
              <FloatingActionButton
                onTouchTap={this.approveAll}
                style={{ marginTop: 10 }}
                disabled={!this.canApproveAll()}
              >
                <DoneAllIcon />
              </FloatingActionButton>
            </Row>
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
