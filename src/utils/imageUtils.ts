// Image utility functions for production builds
export const getImagePath = (path: string): string => {
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  return path;
};

export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const img = event.currentTarget;
  console.error('Image failed to load:', img.src);
  
  // Hide the failed image
  img.style.display = 'none';
  
  // Create fallback element
  const fallback = document.createElement('div');
  fallback.className = 'bg-blue-700 text-white rounded flex items-center justify-center text-xs font-bold';
  fallback.textContent = 'WCPSB';
  
  // Set dimensions based on original image
  const computedStyle = window.getComputedStyle(img);
  fallback.style.width = computedStyle.width;
  fallback.style.height = computedStyle.height;
  
  // Insert fallback before the failed image
  img.parentNode?.insertBefore(fallback, img);
};

// Common image paths
export const IMAGE_PATHS = {
  LOGO: '/logo.png',
  SLIDER_1: '/Slider1.png',
  SLIDER_2: '/Slider2.png',
  SLIDER_3: '/Slider3.png',
  SLIDER_4: '/Slider4.png',
  SLIDER_5: '/Slider5.png',
  SLIDER_6: '/Slider6.png',
  SLIDER_7: '/Slider7.png',
  SLIDER_8: '/Slider8.png',
  BACKGROUND: '/Backg.png',
} as const;
