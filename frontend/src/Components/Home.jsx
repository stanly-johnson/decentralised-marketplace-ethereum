import React, { Component } from 'react';   
import { Button } from 'react-bootstrap';
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Market from './contracts/Market.json'
import ItemTable from './ItemTable'
import 'bootstrap/dist/css/bootstrap.css'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      items: [],
      loading: true,
      isOwner : false,
      fileName : "",
      filePrice : ""
    }
    
    // check the window instance for metamask plugin
    window.addEventListener('load', function () {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try { 
           window.ethereum.enable().then(function() {
               // User has allowed account access to DApp...
               //alert('You can now use the DApp !');
           });
        } catch(e) {
           // User has denied account access to DApp...
           alert('You have denied access to DApp !');
        }
     }
     // Legacy DApp Browsers
     else if (window.web3) {
         const web3 = new Web3(window.web3.currentProvider);
     }
     // Non-DApp Browsers
     else {
         alert('You have to install MetaMask !');
    }  
    });

    this.web3 = new Web3(window.web3.currentProvider)
    this.market = TruffleContract(Market)
    this.market.setProvider(window.web3.currentProvider)

    //this.watchPurchaseEvents = this.watchPurchaseEvents.bind(this)
    this.purchaseItem = this.purchaseItem.bind(this)

  }

  componentDidMount() {
    // when the component is loaded; get data from contract
    this.web3.eth.getCoinbase((err, account) => {
      // set the account from metamask as the base account
      this.setState({ account })
      this.market.deployed().then(marketInstance => {
        this.marketInstance = marketInstance
        // loop through mapping and get the list of items
        this.marketInstance.itemCount().then((itemCount) => {
          for (var i = 1; i <= itemCount; i++) {
            this.marketInstance.items(i).then((item) => {
              const items = [...this.state.items]
              console.log(items)
              items.push({
                id: item[0].toNumber(),
                name: item[1],
                price: item[2].toNumber()
              });
              this.setState({ items: items })
            });
          }
        })
      }).then(this.setState({ loading: false }))
    })
  }

  // function to purchase a new item
  purchaseItem(itemId, price) {
    this.marketInstance.purchaseItem(itemId, { from: this.state.account, value : price }).then((result) =>
      {
        console.log(result);
        // read the receipt for the details of the event emitted
        for (var i = 0; i < result.logs.length; i++) {
          var log = result.logs[i];
          if (log.event === "Purchase") {
            // We found the event!
            console.log(log.args._link)
            console.log("https://ipfs.infura.io/ipfs/"+log.args._link)
            window.open("https://ipfs.infura.io/ipfs/"+log.args._link)
            break;
          }
        }
      }
    ).catch(err => {alert("Transaction Failed!"); console.log(err)})
  }

  render() {
    return (
    <React.Fragment>
      <main role="main" class="container">
      <div class="jumbotron">
        <h1 class="display-4">Ethereum Marketplace</h1>
        <p class="lead">Buy and Sell digital goods without third party fees!</p>
        <hr class="my-4" />
        <p>List your product and reach customers. Get paid in ETH</p>
        <a class="btn btn-primary btn-lg" href="/list" role="button">List Item for Sale</a>
      </div>
      <div class='row'>
        <div class='col-lg-12 text-center' >

          { this.state && this.state.loading && (<p class='text-center'>Loading...</p>)}
          
          { this.state && !this.state.loading && !this.state.isOwner && (
            <div className="col-md-12">
            <br />
              <div class="list-group">
              {this.state.items.map(item => (
                  <ul key={item.id}>
                  <ItemTable item={item} purchaseItem={this.purchaseItem}/>
                  </ul>
              ))}
              </div>
            </div>
          )}

        </div>
      </div>
      </main>

      <footer class="footer fixed-bottom">
      <div class="container">
        <span class="text-muted">Decentralised store to buy and sell electronic arts.</span>
        <p>Ethereum MarketPlace</p>
      </div>
      </footer>
      </React.Fragment>
    )
  }
}
 
export default Home;