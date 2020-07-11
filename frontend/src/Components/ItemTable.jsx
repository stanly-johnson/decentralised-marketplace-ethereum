import React, { Component } from 'react';

class ItemTable extends Component {
  
  state = {};

  render() {
    const { item, purchaseItem } = this.props;
    return (
      <React.Fragment>
        <div class="card">
        <div class="card-body">
          <h5 class="card-title">{item.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Price : {parseFloat(item.price)/1000000000000000000}</h6>
          <button type="button" class="btn btn-info" onClick={() => purchaseItem(item.id, item.price)}>
            Buy
          </button>
        </div>
      </div>
        
      </React.Fragment>
    );
  }
}

export default ItemTable;
