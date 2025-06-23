import '@mantine/carousel/styles.css'; // Add this line
import { Carousel } from '@mantine/carousel';
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Image } from '@mantine/core'
const images = [
  '/Slider1.png',
  '/Slider2.png',
  '/Slider3.png',
  '/Slider4.png',
  '/Slider5.png',
];
const Slider = () => {
    const autoplay = useRef(Autoplay({ delay: 5000 }));
  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <Image src={url} />
    </Carousel.Slide>
  ));
  return (
     <Carousel withIndicators height={700}
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={() => autoplay.current.play()}>
      {slides}
    </Carousel>
  )
}

export default Slider