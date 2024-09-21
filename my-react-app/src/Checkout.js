import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const Checkout = ({ onClose }) => {
  const { concertId } = useParams();
  const [ticketDetails, setTicketDetails] = useState({});
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  useEffect(() => {
    const details = JSON.parse(sessionStorage.getItem('ticketDetails'));
    setTicketDetails(details);
  }, []);

  const handlePayment = () => {
    setIsPaymentProcessing(true);
    setTimeout(() => {
      alert('Payment Successful!');
      setIsPaymentProcessing(false);
      onClose(); // ปิด popup เมื่อการชำระเงินสำเร็จ
    }, 2000);
  };

  if (!ticketDetails) {
    return <Typography>Loading ticket details...</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ paddingTop: 4 }}>
      {/* Add a close button */}
      <Box sx={{ textAlign: 'right' }}>
        <Button onClick={onClose}>&times; Close</Button>
      </Box>
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          การชำระเงิน
        </Typography>
        <Typography variant="body1" color="textSecondary">
          ตรวจสอบข้อมูลการซื้อของคุณก่อนชำระเงิน
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">
            คอนเสิร์ต: {ticketDetails.concertName || 'Concert Name'}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            โซน: {ticketDetails.zone_name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            สี: {ticketDetails.color}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            ราคา: {ticketDetails.price} บาท
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            จำนวนที่นั่ง: {ticketDetails.quantity || 1}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={isPaymentProcessing}
              onClick={handlePayment}
            >
              {isPaymentProcessing ? 'Processing...' : 'ชำระเงิน'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;