import React, { Component } from 'react';   
import { Button } from 'react-bootstrap';
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Market from './contracts/Market.json'
import ItemTable from './ItemTable'
import 'bootstrap/dist/css/bootstrap.css'
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


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
      this.market.deployed().then(async (marketInstance) => {
        this.marketInstance = marketInstance
        // loop through mapping and get the list of items
        await this.marketInstance.itemCount().then((itemCount) => {
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
        // set the voted value if the current address has already voted
        this.marketInstance.store_owner().then((address) => {
          let isOwner =  false;
          if (address === this.state.account){
            isOwner = true;
          }
          console.log(this.state.items)
          console.log(isOwner)
          this.setState({  isOwner , loading: false })
        })
      })
    })
  }

  // watch for the voted event emmited to change the state from voting to normal
  // watchPurchaseEvents() {
  //   this.marketInstance.Purchase({}, {
  //     fromBlock: 0,
  //     toBlock: 'latest'
  //   }).watch((error, event) => {
  //     console.log(event)
  //     this.setState({ voting: false })
  //   })
  // }

  // function to init smart contract voting function
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
    )
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
      this.marketInstance.createItem(this.state.fileName, this.state.filePrice, String(result[0].hash), {from : this.state.account}).then((result) =>
      {
        console.log(result);
      }
    )

    })
  }

  render() {
    return (
      <div class='row'>
        <div class='col-lg-12 text-center' >
          <br /><br /><br />
          <h1>Ethereum Digital Store</h1>
          <br/>
          { this.state && this.state.loading && (<p class='text-center'>Loading...</p>)}
          
          { this.state && !this.state.loading && !this.state.isOwner && (
            <div className="col-md-12">
            <br />
            {this.state.items.map(item => (
                <ul key={item.id}>
                <ItemTable item={item} purchaseItem={this.purchaseItem}/>
                </ul>
            ))}
            </div>
          )}

          { this.state && !this.state.loading && this.state.isOwner && (
            <div className="col-md-10">
            <br />
            <h3>Store Owner Dashboard</h3>
            <hr />
            <form onSubmit={this.onSubmit} >
                  <label htmlFor="name">Name:</label>
                  <input type='text' onChange={e => this.setState({ fileName: e.target.value })} /> <br />

                  <label htmlFor="name">Price:</label>
                  <input type='text' onChange={e => this.setState({ filePrice: e.target.value })} /> <br />

                  <label htmlFor="name">Upload:</label>
                  <input type='file' onChange={this.captureFile} /> <br />
                  <input type='submit' />
            </form>
            </div>
          )}

        </div>
      </div>
    )
  }
}
 
export default Home;