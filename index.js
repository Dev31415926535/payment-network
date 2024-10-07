// pages/index.js (for the homepage)
import { useState, useEffect } from 'react';
import styles from '../styles/global.css'
import Image from 'next/image';


export default function Home() {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    // Fetch items from API on component load
    populateItems();
  }, []);

  async function populateItems() {
    const response = await fetch("/api/getitems");
    const data = await response.json();
    setItems(data);
  }

  const handleItems = async (event) => {
    event.preventDefault();

    const name = event.target.itemName.value;
    const description = event.target.itemDescription.value;
    const username = event.target.userName.value;
    const contact = event.target.userEmail.value;

    // Send item to backend (e.g., API route in Next.js)
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, username, contact }),
    });

    if (response.ok) {
      alert('Item added successfully!');
      populateItems(); // Refresh items list after adding
    } else {
      alert('Failed to add item');
    }
  };

  const deleteItem = async (id) => {
    const response = await fetch(`/api/deleteitem/${id}`, { method: 'DELETE' });
    if (response.ok) {
      alert('Item deleted successfully');
      populateItems(); // Refresh the items after deletion
    } else {
      alert('Failed to delete item');
    }
  };

  return (
    <div>
      <header>
        <div className={styles.logo}>
          <Image src="/logo.png" alt="Educhain Nexus Logo" width={50} height={50} className= {styles.logoImg}></Image>
          Educhain Nexus
        </div>
      </header>
      <main>
        <h1>Welcome to EduChain Nexus</h1>
        <p className="to-be-added">
          Unlock the power of lending and borrowing with EduChain! Join our community today and explore our platform.
        </p>

        {/* Borrowing Form */}
        <div className="Borrowing-form">
          <h2>Borrow an Item</h2>
          <form onSubmit={handleItems}>
            <input type="text" id="itemName" name="itemName" placeholder="Item Name" required />
            <input type="text" id="itemDescription" name="itemDescription" placeholder="Item Description" required />
            <input type="text" id="userName" name="userName" placeholder="Your Name" required />
            <input type="email" id="userEmail" name="userEmail" placeholder="Your Email" required />
            <button type="submit">Add Item for Borrowing</button>
          </form>
        </div>

        {/* Items List */}
        <div className="items-container">
          {items.map((item) => (
            <div key={item._id} className="item">
              <h3 className="item-name">{item.itemName}</h3>
              <p className="item-description">{item.itemDescription}</p>
              <p className="item-username">Owner: {item.ownerName}</p>
              <p className="item-username">Contact: {item.ownerEmail}</p>
              <button className="item-action" onClick={() => deleteItem(item._id)}>Lend</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
