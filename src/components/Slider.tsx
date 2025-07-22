import '@mantine/carousel/styles.css';
import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';



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