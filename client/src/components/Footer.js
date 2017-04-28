import React from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'react-flexbox-grid';
import Divider from 'material-ui/Divider';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      hovered: null
    }
  }

  render() {
    let linkStyles = [{
      textDecoration: 'none',
      color: '#4c4c4c'
    }, {
      textDecoration: 'none',
      color: '#4c4c4c'
    }, {
      textDecoration: 'none',
      color: '#4c4c4c'
    }];

    if (this.state.hovered !== null) {
      linkStyles[this.state.hovered].color = '#000000';
    }

    return (
      <footer
        style={{
          paddingBottom: 16,
          textAlign: 'center',
          fontSize: 14,
          paddingTop: 16,
        }}>
        <Col xs={10} style={{ marginLeft: 'auto', marginRight: 'auto', minWidth: 360 }}>
          <Divider style={{ margin: 'auto', width: '100%' }} />
          <div style={{ width: '100%', display: 'flex', marginTop: 16, marginRight: 0, justifyContent: 'flex-end' }}>
            <div style={{ width: 'auto', margin: 'auto', marginRight: 10, marginLeft: 'auto' }}>
              <Link
                to='/'
                style={linkStyles[0]}
                onMouseEnter={ () => this.setState({ hovered: 0 })}
                onMouseLeave={ () => this.setState({ hovered: null })}
              >
                {'Review Metadata'}
              </Link>
            </div>
          </div>
        </Col>
      </footer>
    );
  }
}

export default Footer;
