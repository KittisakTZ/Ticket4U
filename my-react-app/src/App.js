import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register'; 
import Login from './Login'; 
import Firstpage from './Firstpage'; 
import BuyTickets from './BuyTickets'; 
import Checkout from './Checkout'; 

function App() {
  const [showBuyTickets, setShowBuyTickets] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleOpenBuyTickets = () => setShowBuyTickets(true);
  const handleCloseBuyTickets = () => setShowBuyTickets(false);

  const handleOpenCheckout = () => setShowCheckout(true);
  const handleCloseCheckout = () => setShowCheckout(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/firstpage" element={<Firstpage onOpenBuyTickets={handleOpenBuyTickets} />} />
      </Routes>

      {/* Popup for BuyTickets */}
      {showBuyTickets && (
        <div style={popupOverlayStyle}>
          <div style={popupContentStyle}>
            <BuyTickets onClose={handleCloseBuyTickets} onProceedToCheckout={handleOpenCheckout} />
          </div>
        </div>
      )}

      {/* Popup for Checkout */}
      {showCheckout && (
        <div style={popupOverlayStyle}>
          <div style={popupContentStyle}>
            <Checkout onClose={handleCloseCheckout} />
          </div>
        </div>
      )}
    </Router>
  );
}

const popupOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const popupContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  width: '80%',
  maxWidth: '600px',
};

export default App;
