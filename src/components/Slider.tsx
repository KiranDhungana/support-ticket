import '@mantine/carousel/styles.css';
import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';

const carouselStyles = {
  carousel: {
    '& .mantine-Carousel-indicators': {
      bottom: 20,
    },
    '& .mantine-Carousel-indicator': {
      width: 12,
      height: 12,
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      border: '2px solid rgba(255, 255, 255, 0.8)',
      transition: 'all 0.3s ease',
      '&[data-active]': {
        backgroundColor: '#ffffff',
        transform: 'scale(1.2)',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
      },
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        transform: 'scale(1.1)',
      },
    },
    '& .mantine-Carousel-control': {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      width: 50,
      height: 50,
      color: '#ffffff',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        border: '2px solid rgba(255, 255, 255, 0.8)',
        transform: 'scale(1.1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    },
  },
};

const images = [
  '/Slider1.png',
  '/Slider2.png',
  '/Slider3.png',
  '/Slider4.png',
  '/Slider5.png',
];

const Slider = () => {
  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <Image src={url} />
    </Carousel.Slide>
  ));

  return (
    <Carousel 
      withIndicators 
      height={700}
      withControls
    >
      {slides}
    </Carousel>
  );
};

export default Slider;