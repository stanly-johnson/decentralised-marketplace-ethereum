import React, { Component } from 'react';
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Market from './contracts/Market.json'
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class ListItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
          account: '0x0',
          loading: true,
          seller_balance : 0,
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
      }
    
      componentDidMount() {
        // when the component is loaded; get data from contract
        this.web3.eth.getCoinbase((err, account) => {
          // set the account from metamask as the base account
          this.setState({ account })
          this.market.deployed().then(async (marketInstance) => {
            this.marketInstance = marketInstance
            //fetch the sellers balance
            this.marketInstance.seller_balance(this.state.account).then((res) => {
              const seller_balance = res.toNumber();
              this.setState({ seller_balance })
            })
          }).then(this.setState({ loading: false }))
        })
      }
        
      captureFile = (event) => {
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
          this.setState({ buffer: Buffer(reader.result) })
          console.log('buffer', this.state.buffer)
        }
      }
    
    
      onSubmit = (event) => {
        event.preventDefault()
        console.log("Submitting file to ipfs...")
        ipfs.add(this.state.buffer, (error, result) => {
          console.log('Ipfs result', result)
          if(error) {
            console.error(error)
            return
          }
          console.log(result[0].hash)
          this.marketInstance.createItem(this.state.fileName, this.state.filePrice, String(result[0].hash), {from : this.state.account})
          .then((result) =>
          {
            console.log(result);
          }
        )
    
        })
      }
    
      // function to purchase a new item
      withdrawBalance() {
        this.marketInstance.withdrawBalance({ from: this.state.account}).then((result) =>
          {
            console.log(result);
            alert("Request Succesful!")
          }
        ).catch(err => {alert("Request Failed!"); console.log(err)})
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
              <a class="btn btn-primary btn-lg" href="/" role="button">Go to Store</a>
            </div>
            <div class='row'>
              <div class='col-lg-12 text-center' >
      
                { this.state && this.state.loading && (<p class='text-center'>Loading...</p>)}
                

                { this.state && !this.state.loading && (
                  <div className="col-md-6">
                  <p>Available balance : {this.state.seller_balance} : <button class="btn btn-info btn-sm" onClick={() => this.withdrawBalance()}>Withdraw Balance</button>
                  </p>
                  <br />
                  <h3>List new item</h3>
                  <hr />
                  <form onSubmit={this.onSubmit} >
                        <div class="form-group">
                            <label htmlFor="name">Name:</label>
                            <input type='text' class="form-control" onChange={e => this.setState({ fileName: e.target.value })} />
                        </div>

                        <div class="form-group">
                            <label htmlFor="price">Price:</label>
                            <input type='text' class="form-control" onChange={e => this.setState({ filePrice: e.target.value })} />
                        </div>

                        <div class="form-group">
                            <label htmlFor="upload">Upload:</label>
                            <input type='file' class="form-control" onChange={this.captureFile} /> <br />
                            <input type='submit' class="btn btn-primary" />
                        </div>
                  </form>
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
            </React.Fragment>);
    }
}
 
export default ListItem;