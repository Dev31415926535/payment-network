// pages/transactions.js
import { useState, useEffect } from 'react';

export default function Transactions() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [status, setStatus] = useState('');

  // Connect to Aptos wallet when the component loads
  useEffect(() => {
    if (window.aptos) {
      window.aptos.connect().then((account) => {
        setAccount(account);
        console.log('Connected account address:', account.address);
      }).catch((err) => {
        console.error("Connection error", err);
      });
    } else {
      alert('Welldone Wallet is not installed. Please install it.');
    }
  }, []);

  // Function to send payment using Aptos blockchain and Welldone Wallet
  const sendPayment = async () => {
    if (!account) {
      alert('No account connected.');
      return;
    }

    if (!recipient || !amount) {
      alert('Please provide both recipient address and amount.');
      return;
    }

    // Convert amount to Octas (1 APT = 100,000,000 Octas)
    const amountInOctas = parseInt(amount * 100000000);

    const payload = {
      type: 'entry_function_payload',
      function: '0x1::coin::transfer', // Adjust to your contract function
      arguments: [
        recipient,    // Recipient's address
        amountInOctas // Amount in Octas
      ],
    };

    try {
      // Request the user to sign and submit the transaction
      const response = await window.aptos.signAndSubmitTransaction(payload);
      console.log('Transaction response:', response);
      setStatus('Transaction submitted!');
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setStatus('Failed to submit the transaction.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Lend APT</h1>

      <div id="accountInfo">
        <p>
          Connected Account: <span style={styles.connectedAccount}>{account ? account.address : 'Not connected'}</span>
        </p>
        <p>
          Balance: <span style={styles.balance}>{balance} APT</span>
        </p>
      </div>

      <input
        type="text"
        placeholder="Amount to lend"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        style={styles.input}
      />
      <button onClick={sendPayment} style={styles.button}>Lend APT</button>

      {status && <div style={status === 'Transaction submitted!' ? styles.success : styles.error}>{status}</div>}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: '#f9fafb',
    color: '#333',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    backgroundColor: '#fff',
  },
  title: {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '28px',
  },
  input: {
    display: 'block',
    width: 'calc(100% - 20px)',
    margin: '0 auto 15px',
    padding: '12px 15px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#fafafa',
    transition: 'border-color 0.3s ease',
  },
  button: {
    display: 'block',
    width: 'calc(100% - 20px)',
    margin: '0 auto',
    padding: '12px 15px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#3498db',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  success: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#2ecc71',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '5px',
  },
  error: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '5px',
  },
  connectedAccount: {
    fontWeight: 'bold',
    color: '#3498db',
  },
  balance: {
    fontWeight: 'bold',
    color: '#27ae60',
  },
};