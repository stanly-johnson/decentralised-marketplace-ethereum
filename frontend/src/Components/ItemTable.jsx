import React, { Component } from 'react';

class ItemTable extends Component {
  
  state = {};

  render() {
    const { item, purchaseItem } = this.props;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-6">
            Name : <strong>{item.name}</strong>
            <br />
            Price : {parseFloat(item.price)/1000000000000000000}
          </div>
          <div className="col-md-6">
          <button type="button" class="btn btn-danger" onClick={() => purchaseItem(item.id, item.price)}>
            Buy
          </button>
          </div>
        
          <br /><br />
          <hr />
          
        </div>
        
      </React.Fragment>
    );
  }
}

export default ItemTable;
