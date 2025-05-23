import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageUpload } from '@/components/ImageUpload';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Download, RotateCcw } from 'lucide-react';
import { KernelGrid } from '@/components/KernelGrid';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [gridSize, setGridSize] = useState(3);
  const [kernelValues, setKernelValues] = useState<number[][]>([]);
  const [rgbValues, setRgbValues] = useState({
    red: 128,
    green: 128,
    blue: 128
  });

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setProcessingStatus('idle');
    setProgress(0);
  };

  const startProcessing = () => {
    if (!selectedFile) return;

    setProcessingStatus('processing');
    setProgress(0);

    // Simulate processing progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessingStatus('completed');
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
  };

  const resetProcess = () => {
    setSelectedFile(null);
    setProcessingStatus('idle');
    setProgress(0);
  };

  const handleGridSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value);
    if (!isNaN(newSize)) {
      // Enforce min 3 and max 10
      setGridSize(Math.min(Math.max(newSize, 3), 10));
    }
  };

  const handleRgbChange = (color: 'red' | 'green' | 'blue', value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
      setRgbValues(prev => ({
        ...prev,
        [color]: numValue
      }));
    }
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
              <span>Instant Processing</span>
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
                    <Label htmlFor="gridSize">Grid Size:</Label>
                    <Input 
                      id="gridSize"
                      type="number" 
                      value={gridSize}
                      onChange={handleGridSizeChange}
                      min={3}
                      max={10}
                      className="w-20"
                    />
                  </div>
                  
                  <div className="mb-8">
                    <Label className="mb-2 block">Kernel Values:</Label>
                    <KernelGrid size={gridSize} onChange={setKernelValues} />
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
                  <Zap className="h-5 w-5 mr-2" />
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
                    <p className="text-muted-foreground">
                      This is where the processed result would be displayed.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Result
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={resetProcess}
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
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
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Our optimized algorithms process your images in seconds, not minutes.
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
                Your images are processed locally and never stored on our servers.
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
