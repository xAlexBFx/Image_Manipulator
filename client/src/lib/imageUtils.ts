type RGBColor = [number, number, number];
type PixelData = Uint8ClampedArray;
type ImageData2D = RGBColor[][];

export interface ImageProcessor {
  // Adjust color channels
  setColor: (imageData: ImageData, colorAmount: number, channel: 'red' | 'green' | 'blue') => ImageData;
  
  // Image manipulation
  rotate: (imageData: ImageData, steps: number) => ImageData;
  insertImage: (baseImage: ImageData, overlayImage: ImageData, position: [number, number]) => ImageData;
  applyKernel: (imageData: ImageData, kernel: number[][]) => ImageData;
  
  // Utility functions
  getPixel: (data: Uint8ClampedArray, index: number) => RGBColor;
  setPixel: (data: Uint8ClampedArray, index: number, [r, g, b]: RGBColor) => void;
}

// Helper function to get RGBA values from ImageData
const getPixel = (data: Uint8ClampedArray, index: number): RGBColor => {
  const i = index * 4;
  return [data[i], data[i + 1], data[i + 2]]; // Ignore alpha channel for now
};

// Helper function to set RGBA values in ImageData
const setPixel = (data: Uint8ClampedArray, index: number, [r, g, b]: RGBColor): void => {
  const i = index * 4;
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
  // Preserve alpha channel (data[i + 3])
};

// Convert 1D pixel array to 2D array
const make2D = (data: Uint8ClampedArray, width: number): ImageData2D => {
  const height = data.length / (4 * width);
  const result: ImageData2D = [];
  
  for (let y = 0; y < height; y++) {
    const row: RGBColor[] = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      row.push([data[i], data[i + 1], data[i + 2]]);
    }
    result.push(row);
  }
  
  return result;
};

// Convert 2D array back to 1D pixel array
const flatten = (twoDArray: ImageData2D): Uint8ClampedArray => {
  const height = twoDArray.length;
  const width = twoDArray[0].length;
  const result = new Uint8ClampedArray(width * height * 4);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const [r, g, b] = twoDArray[y][x];
      result[i] = r;
      result[i + 1] = g;
      result[i + 2] = b;
      result[i + 3] = 255; // Full opacity
    }
  }
  
  return result;
};

// Set color channel to specific value
const setColor = (imageData: ImageData, colorAmount: number, channel: 'red' | 'green' | 'blue'): ImageData => {
  const { data, width, height } = imageData;
  const channelIndex = { red: 0, green: 1, blue: 2 }[channel];
  
  for (let i = 0; i < data.length; i += 4) {
    data[i + channelIndex] = colorAmount;
  }
  
  return new ImageData(data, width, height);
};

// Rotate image 90 degrees clockwise (1-3 steps)
const rotate = (imageData: ImageData, steps: number): ImageData => {
  const { width, height } = imageData;
  const pixels = make2D(imageData.data, width);
  
  let rotated = pixels;
  for (let i = 0; i < steps; i++) {
    rotated = rotated[0].map((_, i) => rotated.map(row => row[i]).reverse());
  }
  
  const rotatedData = flatten(rotated);
  return new ImageData(rotatedData, steps % 2 === 0 ? width : height, steps % 2 === 0 ? height : width);
};

// Insert one image into another at specified position
const insertImage = (baseImage: ImageData, overlayImage: ImageData, [x, y]: [number, number]): ImageData => {
  const { width: baseWidth, height: baseHeight } = baseImage;
  const { width: overlayWidth, height: overlayHeight } = overlayImage;
  
  const result = new Uint8ClampedArray(baseImage.data);
  
  for (let oy = 0; oy < overlayHeight; oy++) {
    for (let ox = 0; ox < overlayWidth; ox++) {
      const baseX = x + ox;
      const baseY = y + oy;
      
      if (baseX >= 0 && baseX < baseWidth && baseY >= 0 && baseY < baseHeight) {
        const overlayIndex = (oy * overlayWidth + ox) * 4;
        const baseIndex = (baseY * baseWidth + baseX) * 4;
        
        // Simple alpha blending (replace with more sophisticated blending if needed)
        result[baseIndex] = overlayImage.data[overlayIndex];
        result[baseIndex + 1] = overlayImage.data[overlayIndex + 1];
        result[baseIndex + 2] = overlayImage.data[overlayIndex + 2];
      }
    }
  }
  
  return new ImageData(result, baseWidth, baseHeight);
};

// Apply convolution kernel to image
const applyKernel = (imageData: ImageData, kernel: number[][]): ImageData => {
  const { width, height, data } = imageData;
  const result = new Uint8ClampedArray(data.length);
  const kernelHeight = kernel.length;
  const kernelWidth = kernel[0].length;
  const kernelHalfHeight = Math.floor(kernelHeight / 2);
  const kernelHalfWidth = Math.floor(kernelWidth / 2);
  
  // Copy original alpha channel
  for (let i = 3; i < data.length; i += 4) {
    result[i] = data[i];
  }
  
  // Apply kernel to each pixel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0;
      let weightSum = 0;
      
      // Apply kernel
      for (let ky = 0; ky < kernelHeight; ky++) {
        for (let kx = 0; kx < kernelWidth; kx++) {
          const pixelX = x + kx - kernelHalfWidth;
          const pixelY = y + ky - kernelHalfHeight;
          
          // Skip if out of bounds
          if (pixelX < 0 || pixelX >= width || pixelY < 0 || pixelY >= height) {
            continue;
          }
          
          const weight = kernel[ky][kx];
          const pixelIndex = (pixelY * width + pixelX) * 4;
          
          r += data[pixelIndex] * weight;
          g += data[pixelIndex + 1] * weight;
          b += data[pixelIndex + 2] * weight;
          weightSum += weight;
        }
      }
      
      // Normalize and clamp values
      const resultIndex = (y * width + x) * 4;
      result[resultIndex] = Math.max(0, Math.min(255, weightSum !== 0 ? r / weightSum : r));
      result[resultIndex + 1] = Math.max(0, Math.min(255, weightSum !== 0 ? g / weightSum : g));
      result[resultIndex + 2] = Math.max(0, Math.min(255, weightSum !== 0 ? b / weightSum : b));
    }
  }
  
  return new ImageData(result, width, height);
};

export const imageProcessor: ImageProcessor = {
  setColor,
  rotate,
  insertImage,
  applyKernel,
  getPixel,
  setPixel
};

export default imageProcessor;
