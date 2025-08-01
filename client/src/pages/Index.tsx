import { useState } from 'react';
import { imageProcessor } from '@/lib/imageUtils';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageUpload } from '@/components/ImageUpload';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Download } from 'lucide-react';
import { KernelGrid } from '@/components/KernelGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  // Progress is kept in state for potential future UI updates
  const [progress, setProgress] = useState(0);
  const [gridSize, setGridSize] = useState(3);
  const [kernelValues, setKernelValues] = useState<number[][]>([]);
  const [rgbValues, setRgbValues] = useState({
    red: 0,
    green: 0,
    blue: 0
  });
  const [rgbModified, setRgbModified] = useState(false);
  const [kernelModified, setKernelModified] = useState(false);
  const [error, setError] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [presets] = useState([
    {
      name: 'X Edge Detection',
      gridSize: 3,
      kernelValues: [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
      ]
    },
    {
      name: 'Y Edge Detection',
      gridSize: 3,
      kernelValues: [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
      ]
    },
    {
      name: 'XY Edge Detection',
      gridSize: 3,
      kernelValues: [
        [-1, -1, -1],
        [-1, 8, -1],
        [-1, -1, -1]
      ]
    },
    {
      name: 'Blur (Box)',
      gridSize: 3,
      kernelValues: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ]
    },
    {
      name: 'Gaussian Blur',
      gridSize: 5,
      kernelValues: [
        [1,  4,  6,  4, 1],
        [4, 16, 24, 16, 4],
        [6, 24, 36, 24, 6],
        [4, 16, 24, 16, 4],
        [1,  4,  6,  4, 1]
      ]
    },
    {
      name: 'Gaussian Blur (advanced)',
      gridSize: 7,
      kernelValues: [
        [0, 0, 1, 2, 1, 0, 0],
        [0, 3, 13, 22, 13, 3, 0],
        [1, 13, 59, 97, 59, 13, 1],
        [2, 22, 97, 159, 97, 22, 2],
        [1, 13, 59, 97, 59, 13, 1],
        [0, 3, 13, 22, 13, 3, 0],
        [0, 0, 1, 2, 1, 0, 0]
      ]
    },
    {
      name: 'Gaussian LoG',
      gridSize: 5,
      kernelValues: [
        [0,   0,  -1,  0,  0],
        [0,  -1,  -2, -1,  0],
        [-1, -2,  16, -2, -1],
        [0,  -1,  -2, -1,  0],
        [0,   0,  -1,  0,  0]
      ]
    },
    {
      name: 'Gaussian LoG (Advanced)',
      gridSize: 7,
      kernelValues: [
        [0, 0, -1, -1, -1, 0, 0],
        [0, -2, -3, -3, -3, -2, 0],
        [-1, -3, 5, 7, 5, -3, -1],
        [-1, -3, 7, 24, 7, -3, -1],
        [-1, -3, 5, 7, 5, -3, -1],
        [0, -2, -3, -3, -3, -2, 0],
        [0, 0, -1, -1, -1, 0, 0]
      ]
    },
    {
      name: 'Laplacian',
      gridSize: 5,
      kernelValues: [
        [0,  0, -1,  0,  0],
        [0, -1, -2, -1,  0],
        [-1, -2, 16, -2, -1],
        [0, -1, -2, -1,  0],
        [0,  0, -1,  0,  0],
      ]
    },
    {
      name: 'Gabor Filter (Conceptual 0-degrees)',
      gridSize: 7,
      kernelValues: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 4, 6, 4, 1, 0],
        [0, 4, 16, 24, 16, 4, 0],
        [0, 6, 24, 36, 24, 6, 0],
        [0, 4, 16, 24, 16, 4, 0],
        [0, 1, 4, 6, 4, 1, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      name: 'Sharpen',
      gridSize: 3,
      kernelValues: [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
      ]
    },
    {
      name: 'Emboss',
      gridSize: 3,
      kernelValues: [
        [-2, -1, 0],
        [-1, 1, 1],
        [0, 1, 2]
      ]
    },
    {
      name: 'Sobel X',
      gridSize: 3,
      kernelValues: [
        [1, 0, -1],
        [2, 0, -2],
        [1, 0, -1]
      ]
    },
    {
      name: 'Sobel Y',
      gridSize: 3,
      kernelValues: [
        [1, 2, 1],
        [0, 0, 0],
        [-1, -2, -1]
      ]
    },
    {
      name: 'Prewitt X',
      gridSize: 3,
      kernelValues: [
        [-1, 0, 1],
        [-1, 0, 1],
        [-1, 0, 1]
      ]
    },
    {
      name: 'Prewitt Y',
      gridSize: 3,
      kernelValues: [
        [-1, -1, -1],
        [0, 0, 0],
        [1, 1, 1]
      ]
    }
  ]);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setProcessingStatus('idle');
    setProgress(0);
  };

  const processImage = async (imageData: ImageData): Promise<ImageData> => {
    let result = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    );

    // Apply RGB adjustments if modified
    if (rgbModified) {
      if (rgbValues.red > 0) result = imageProcessor.setColor(result, rgbValues.red, 'red');
      if (rgbValues.green > 0) result = imageProcessor.setColor(result, rgbValues.green, 'green');
      if (rgbValues.blue > 0) result = imageProcessor.setColor(result, rgbValues.blue, 'blue');
    }

    // Apply kernel if modified
    if (kernelModified && kernelValues.length > 0) {
      result = imageProcessor.applyKernel(result, kernelValues);
    }

    return result;
  };

  const startProcessing = async () => {
    if (!selectedFile || (!rgbModified && !kernelModified)) return;

    setProcessingStatus('processing');
    setProgress(0);

    try {
      // Create an image element to load the file
      const img = new Image();
      const objectUrl = URL.createObjectURL(selectedFile);
      
      img.onload = async () => {
        try {
          // Create a canvas to process the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Could not get canvas context');
          
          // Set canvas dimensions to match the image
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0);
          
          // Get the image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Process the image
          const processedData = await processImage(imageData);
          
          // Put the processed data back on the canvas
          ctx.putImageData(processedData, 0, 0);
          
          // Convert the canvas to a data URL
          const processedImageUrl = canvas.toDataURL('image/png');
          
          // Update the UI with the processed image
          setProcessingStatus('completed');
          setProgress(100);
          setProcessedImage(processedImageUrl);
          
        } catch (error) {
          setProcessingStatus('error');
          setError(error instanceof Error ? error.message : 'An error occurred');
          console.error('Error processing image:', error);
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      };
      
      img.onerror = () => {
        setProcessingStatus('error');
        setError('Failed to load image');
        URL.revokeObjectURL(objectUrl);
      };
      
      // Start loading the image
      img.src = objectUrl;
      
    } catch (error) {
      setProcessingStatus('error');
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error:', error);
    }
  };

  const resetProcess = () => {
    setSelectedFile(null);
    setProcessingStatus('idle');
    setProgress(0);
  };

  const handleGridSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value);
    if (!isNaN(newSize)) {
      // Make sure the size is odd
      const oddSize = newSize % 2 === 0 ? newSize + 1 : newSize;
      // Enforce min 3 and max 11
      setGridSize(Math.min(Math.max(oddSize, 3), 11));
      setKernelModified(true);
    }
  };

  const handleRgbChange = (color: 'red' | 'green' | 'blue', value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
      setRgbValues(prev => ({
        ...prev,
        [color]: numValue
      }));
      setRgbModified(true);
    }
  };

  const handlePresetSelect = (presetName: string) => {
    const preset = presets.find(p => p.name === presetName);
    if (preset) {
      // First set the grid size
      setGridSize(preset.gridSize);
      
      // Set the values directly
      setKernelValues(preset.kernelValues);
      setKernelModified(true);
      setSelectedPreset(presetName);
    }
  };

  const downloadProcessedImage = () => {
    if (!processedImage) return;
    
    // Extract the base64 data from the image URL
    const base64Data = processedImage.split(',')[1];
    
    // Convert base64 to binary string
    const binaryString = window.atob(base64Data);
    
    // Create an array buffer from the binary string
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Create a blob from the array buffer
    const blob = new Blob([bytes.buffer], { type: 'image/png' });
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Transform Your Images
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Upload your images and experience our special processing magic. 
            Fast, free, and incredibly powerful.
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>100% Free</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>No Registration</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Fast Processing</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {/* Upload Section */}
            <div className="animate-fade-in">
              <ImageUpload onImageSelect={handleImageSelect} />
            </div>

            {/* Kernel Grid Section */}
            <Card className="p-6 animate-fade-in">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Kernel Configuration</h3>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <Label htmlFor="gridSize">Kernel Size:</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newSize = gridSize - 2;
                          if (newSize >= 3) {
                            const oddSize = newSize % 2 === 0 ? newSize + 1 : newSize;
                            setGridSize(oddSize);
                            setKernelModified(true);
                          }
                        }}
                        disabled={gridSize <= 3}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        id="gridSize"
                        type="number" 
                        value={gridSize}
                        onChange={handleGridSizeChange}
                        min={3}
                        max={11}
                        step={2}
                        disabled
                        className="w-20"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newSize = gridSize + 2;
                          if (newSize <= 11) {
                            const oddSize = newSize % 2 === 0 ? newSize + 1 : newSize;
                            setGridSize(oddSize);
                            setKernelModified(true);
                          }
                        }}
                        disabled={gridSize >= 11}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <Label className="mb-2 block">Presets:</Label>
                    <Select value={selectedPreset} onValueChange={handlePresetSelect}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a preset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Kernel Presets</SelectLabel>
                          {presets.map(preset => (
                            <SelectItem key={preset.name} value={preset.name}>
                              {preset.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-8">
                    <Label className="mb-2 block">Kernel Values:</Label>
                    <KernelGrid 
                      size={gridSize} 
                      onChange={setKernelValues}
                      onKernelModified={() => setKernelModified(true)}
                      values={kernelValues}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="red" className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div> Red
                      </Label>
                      <Input 
                        id="red"
                        type="number"
                        value={rgbValues.red}
                        onChange={(e) => handleRgbChange('red', e.target.value)}
                        min={0}
                        max={255}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="green" className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div> Green
                      </Label>
                      <Input 
                        id="green"
                        type="number"
                        value={rgbValues.green}
                        onChange={(e) => handleRgbChange('green', e.target.value)}
                        min={0}
                        max={255}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blue" className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div> Blue
                      </Label>
                      <Input 
                        id="blue"
                        type="number"
                        value={rgbValues.blue}
                        onChange={(e) => handleRgbChange('blue', e.target.value)}
                        min={0}
                        max={255}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Processing Controls */}
            {selectedFile && processingStatus === 'idle' && (
              <Card className="p-6 text-center animate-fade-in">
                <h3 className="text-lg font-semibold mb-4">Ready to Process</h3>
                <p className="text-muted-foreground mb-6">
                  Your image is loaded and ready. Click below to start the special processing.
                </p>
                <Button
                  onClick={startProcessing}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Start Processing
                </Button>
              </Card>
            )}

            {/* Processing Status */}
            <ProcessingStatus 
              status={processingStatus} 
              progress={progress}
              message="Applying special effects and enhancements..."
            />

            {/* Results Section */}
            {processingStatus === 'completed' && (
              <Card className="p-6 animate-fade-in">
                <div className="text-center space-y-6">
                  <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400">
                    Processing Complete!
                  </h3>
                  
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg p-8 border border-green-200 dark:border-green-800">
                    <p className="text-lg mb-4">
                      Your image has been successfully processed with our special algorithm.
                    </p>
                    {processedImage && (
                      <img 
                        src={processedImage}
                        alt="Processed image"
                        className="max-w-full h-auto rounded-lg shadow-lg mt-4"
                      />
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                      onClick={downloadProcessedImage}
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Result
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={resetProcess}
                    >
                      <Minus className="h-5 w-5 mr-2" />
                      Process Another
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Tool?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Faster Than Others</h3>
              <p className="text-muted-foreground">
                Our optimized algorithms process your images in a minute.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Free</h3>
              <p className="text-muted-foreground">
                No hidden costs, no subscriptions. Just upload and process your images for free.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-purple-600"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
              <p className="text-muted-foreground">
                Your images are never stored on our servers.
              </p>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
