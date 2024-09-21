import React from 'react';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';

const MediaCard = ({ image, title, description, onBuyTickets, onMoreInfo }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {/* เพิ่มปุ่มสำหรับการซื้อบัตร */}
        <Button size="small" color="primary" onClick={onBuyTickets}>
          Buy
        </Button>
        {/* เพิ่มปุ่มสำหรับข้อมูลเพิ่มเติม */}
        <Button size="small" color="secondary" onClick={onMoreInfo}>
          More Info
        </Button>
      </CardActions>
    </Card>
  );
};

export default MediaCard;