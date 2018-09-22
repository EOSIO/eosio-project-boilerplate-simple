import React, { Component } from 'react';
import './App.css';
import Eos from 'eosjs'; // https://github.com/EOSIO/eosjs
import Login from '../Login/Login';
import RequestChat from '../RequestChat/RequestChat';
import Chat from '../Chat/Chat'; 

// NEVER store private keys in any source code in your real life development
// This is for demo purposes only!
// const accounts = [
//   {"name":"useraaaaaaaa", "privateKey":"5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5", "publicKey":"EOS6kYgMTCh1iqpq9XGNQbEi8Q6k5GujefN9DSs55dcjVyFAq7B6b"},
//   {"name":"useraaaaaaab", "privateKey":"5KLqT1UFxVnKRWkjvhFur4sECrPhciuUqsYRihc1p9rxhXQMZBg", "publicKey":"EOS78RuuHNgtmDv9jwAzhxZ9LmC6F295snyQ9eUDQ5YtVHJ1udE6p"},
//   {"name":"useraaaaaaac", "privateKey":"5K2jun7wohStgiCDSDYjk3eteRH1KaxUQsZTEmTGPH4GS9vVFb7", "publicKey":"EOS5yd9aufDv7MqMquGcQdD6Bfmv6umqSuh9ru3kheDBqbi6vtJ58"},
//   {"name":"useraaaaaaad", "privateKey":"5KNm1BgaopP9n5NqJDo9rbr49zJFWJTMJheLoLM5b7gjdhqAwCx", "publicKey":"EOS8LoJJUU3dhiFyJ5HmsMiAuNLGc6HMkxF4Etx6pxLRG7FU89x6X"},
//   {"name":"useraaaaaaae", "privateKey":"5KE2UNPCZX5QepKcLpLXVCLdAw7dBfJFJnuCHhXUf61hPRMtUZg", "publicKey":"EOS7XPiPuL3jbgpfS3FFmjtXK62Th9n2WZdvJb6XLygAghfx1W7Nb"},
//   {"name":"useraaaaaaaf", "privateKey":"5KaqYiQzKsXXXxVvrG8Q3ECZdQAj2hNcvCgGEubRvvq7CU3LySK", "publicKey":"EOS5btzHW33f9zbhkwjJTYsoyRzXUNstx1Da9X2nTzk8BQztxoP3H"},
//   {"name":"useraaaaaaag", "privateKey":"5KFyaxQW8L6uXFB6wSgC44EsAbzC7ideyhhQ68tiYfdKQp69xKo", "publicKey":"EOS8Du668rSVDE3KkmhwKkmAyxdBd73B51FKE7SjkKe5YERBULMrw"}
// ];


const account1 = {"name":"useraaaaaaaa", "privateKey":"5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5", "publicKey":"EOS6kYgMTCh1iqpq9XGNQbEi8Q6k5GujefN9DSs55dcjVyFAq7B6b"}
const account2 = {"name":"useraaaaaaab", "privateKey":"5KLqT1UFxVnKRWkjvhFur4sECrPhciuUqsYRihc1p9rxhXQMZBg", "publicKey":"EOS78RuuHNgtmDv9jwAzhxZ9LmC6F295snyQ9eUDQ5YtVHJ1udE6p"}




class App extends Component {

  state = {
    sender: {},
    recipient : {},
    funnelStatus : '', //HandshakePending HandshakeEstablished
    messages: {},
    page: 'login'
  };

  componentDidMount () {
    const { account } = this.props.match.params
    switch (account) {
      case 'account1':
        this.setState({ 
          sender: { privateKey : account1.privateKey, account : account1.name},
          recipient : { publicKey : account2.publicKey },
        });
        console.log('Sender set to account1');
        console.log('Recipient set to account2');
        break;
      case 'account2':
      this.setState({ 
        sender: { privateKey : account2.privateKey, account : account2.name},
        recipient : { publicKey : account1.publicKey },
      });
      console.log('Sender set to account2');
      console.log('Recipient set to account1');
        break;
      default:
      this.setState({ 
        sender: { privateKey : account1.privateKey, account : account1.name},
        recipient : { publicKey : account2.publicKey },
      });
      console.log('Sender set to account1');
      console.log('Recipient set to account2');
    }
  }

  constructor(props) {
    super(props)
  }

  setLogin = () =>  {
    this.setState({ page: 'requestChat' });
  }
  
  setChatRequest = (proposedRecipient) => {
    const recipient = {publicKey : proposedRecipient};
    this.setState({ 
      recipient : recipient,
      page : "chat"
     });
    
  }

  sendMessage = (messageContent) => {
    console.log(messageContent);
  }

  getMessages = () => {
    console.log('messagesReceived');
  }



  render() {
    return (
      <div className="App">
        {this.state.page === "login" && 
          <Login setLogin={this.setLogin} sender={this.state.sender} />
        }
        {this.state.page === "requestChat" && 
          <RequestChat setChatRequest={this.setChatRequest} proposedRecipient={this.state.recipient} />
        }
        {this.state.page === "chat" && 
          <Chat 
            sender={this.state.sender} 
            recipient={this.state.recipient} 
            sendMessage={this.sendMessage}
            messages={this.state.messages}
            funnelStatus={this.state.funnelStatus} />
        }
      </div>
    );
  }
}

export default App;
