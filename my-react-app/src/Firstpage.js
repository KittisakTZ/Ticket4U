import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ResponsiveAppBar from './ResponsiveAppBar';
import MediaCard from './MediaCard';

const Firstpage = ({ onOpenBuyTickets }) => {
  const navigate = useNavigate();
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    } else {
      fetch('http://localhost:5000/concerts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch concerts');
          }
          return response.json();
        })
        .then(data => {
          setConcerts(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching concerts:', error);
          setError('เกิดข้อผิดพลาดในการดึงข้อมูลคอนเสิร์ต');
          setLoading(false);
        });
    }
  }, [navigate]);

  if (loading) {
    return (
      <Container
        maxWidth="xl"
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ textAlign: 'center', padding: '2rem' }}>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <ResponsiveAppBar />
      <Container maxWidth="xl" sx={{ bgcolor: '#cfe8fc', minHeight: '100vh', padding: 2 }}>
        {concerts.length === 0 ? (
          <Typography variant="h6" align="center" color="textSecondary">
            ไม่พบข้อมูลคอนเสิร์ตในขณะนี้
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 2,
              padding: 2
            }}
          >
            {concerts.map((concert) => (
              <MediaCard
                key={concert.id}
                title={concert.name}
                description={`Date: ${new Date(concert.date).toLocaleDateString()} Venue: ${concert.venue} Artist: ${concert.artist} Ticket Price: $${concert.ticket_price}`}
                image={concert.image_url}
                onBuyTickets={onOpenBuyTickets}
              />
            ))}
          </Box>
        )}
      </Container>
    </React.Fragment>
  );
};

export default Firstpage;