import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

const BuyTickets = ({ onClose, onProceedToCheckout }) => {
  const { concertId } = useParams();
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/concerts/zones')
      .then(response => response.json())
      .then(data => setZones(data))
      .catch(error => console.error('Error fetching zones:', error));
  }, []);

  const handleZoneChange = (event) => {
    setSelectedZone(event.target.value);
    setSelectedColor('');
    setPrice('');
  };

  const handleColorChange = (event) => {
    const selectedColor = event.target.value;
    setSelectedColor(selectedColor);

    const matchingZone = zones.find(zone => zone.zone_name === selectedZone && zone.color === selectedColor);
    if (matchingZone) {
      setPrice(matchingZone.price);
    }
  };

  const handleProceedToCheckout = () => {
    const ticketDetails = {
      concertId,
      zone_name: selectedZone,
      color: selectedColor,
      price,
      quantity: 1 // หรือสามารถเพิ่มตัวเลือกจำนวนที่นั่งได้ในอนาคต
    };
    sessionStorage.setItem('ticketDetails', JSON.stringify(ticketDetails));
    onProceedToCheckout();
  };

  return (
    <Container maxWidth="sm" sx={{ paddingTop: 4 }}>
      {/* Add a close button */}
      <Box sx={{ textAlign: 'right' }}>
        <Button onClick={onClose}>&times; Close</Button>
      </Box>
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          เลือกที่นั่งสำหรับคอนเสิร์ต
        </Typography>
        <Typography variant="body1" color="textSecondary">
          โปรดเลือกโซนและสีที่ต้องการสำหรับที่นั่งของคุณ
        </Typography>

        {/* รูปภาพที่แสดงใต้ข้อความ */}
        <Box sx={{ marginY: 4 }}>
          <img 
            src="https://f.ptcdn.info/320/059/000/pdtkjfz8tmYx0Sa3vp7-o.gif" 
            alt="Concert Seating Layout" 
            style={{ width: '100%', borderRadius: '8px' }} 
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="select-zone-label">Zone</InputLabel>
            <Select
              labelId="select-zone-label"
              id="select-zone"
              value={selectedZone}
              label="Zone"
              onChange={handleZoneChange}
            >
              {[...new Set(zones.map(zone => zone.zone_name))].map((zoneName, index) => (
                <MenuItem key={index} value={zoneName}>
                  {zoneName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {selectedZone && (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="select-color-label">Color</InputLabel>
              <Select
                labelId="select-color-label"
                id="select-color"
                value={selectedColor}
                label="Color"
                onChange={handleColorChange}
              >
                {zones
                  .filter(zone => zone.zone_name === selectedZone)
                  .map((zone, index) => (
                    <MenuItem key={index} value={zone.color}>
                      {zone.color}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {selectedColor && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', marginTop: 3 }}>
              <Typography variant="h6">
                ราคา: {price ? `${price} บาท` : 'ไม่สามารถคำนวณราคาได้'}
              </Typography>
            </Box>
          </Grid>
        )}

        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              disabled={!selectedColor}
              onClick={handleProceedToCheckout}
            >
              ดำเนินการต่อ
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BuyTickets;