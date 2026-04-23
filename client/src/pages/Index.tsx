import { useEffect, useRef, useState } from 'react';
import { imageProcessor } from '@/lib/imageUtils';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageUpload } from '@/components/ImageUpload';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Download, Eye, Brain, Lightbulb, Sparkles, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { KernelGrid } from '@/components/KernelGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  // Progress is kept in state for potential future UI updates
  const [progress, setProgress] = useState(0);
  const [uploadKey, setUploadKey] = useState(0);
  const [gridSize, setGridSize] = useState(3);
  const [kernelValues, setKernelValues] = useState<number[][]>([]);
  const [kernelPipeline, setKernelPipeline] = useState<{ name: string; gridSize: number; kernelValues: number[][] }[]>([]);
  const [kernelModified, setKernelModified] = useState(false);
  const [error, setError] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [exampleSlider, setExampleSlider] = useState(55);
  const exampleContainerRef = useRef<HTMLDivElement | null>(null);
  const exampleDraggingRef = useRef(false);
  const [exampleSlider2, setExampleSlider2] = useState(45);
  const exampleContainerRef2 = useRef<HTMLDivElement | null>(null);
  const exampleDraggingRef2 = useRef(false);
  const [resultSlider, setResultSlider] = useState(50);
  const resultContainerRef = useRef<HTMLDivElement | null>(null);
  const resultDraggingRef = useRef(false);
  const explainContainerRef = useRef<HTMLDivElement | null>(null);
  const [explainParallax, setExplainParallax] = useState({ x: 0, y: 0, s: 0 });
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
    },
    {
      name: 'Identity (No-op)',
      gridSize: 3,
      kernelValues: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ]
    },
    {
      name: 'Outline (Strong)',
      gridSize: 3,
      kernelValues: [
        [-1, -1, -1],
        [-1, 8, -1],
        [-1, -1, -1]
      ]
    },
    {
      name: 'Ridge Detection',
      gridSize: 3,
      kernelValues: [
        [-1, -1, -1],
        [-1, 9, -1],
        [-1, -1, -1]
      ]
    },
    {
      name: 'High-Boost Sharpen',
      gridSize: 3,
      kernelValues: [
        [-1, -1, -1],
        [-1, 9, -1],
        [-1, -1, -1]
      ]
    },
    {
      name: 'Scharr X (Sharper edges)',
      gridSize: 3,
      kernelValues: [
        [3, 0, -3],
        [10, 0, -10],
        [3, 0, -3]
      ]
    },
    {
      name: 'Scharr Y (Sharper edges)',
      gridSize: 3,
      kernelValues: [
        [3, 10, 3],
        [0, 0, 0],
        [-3, -10, -3]
      ]
    },
    {
      name: 'Unsharp Mask (Classic)',
      gridSize: 5,
      kernelValues: [
        [0, 0, -1, 0, 0],
        [0, -1, -2, -1, 0],
        [-1, -2, 17, -2, -1],
        [0, -1, -2, -1, 0],
        [0, 0, -1, 0, 0]
      ]
    },
    {
      name: 'Motion Blur (Diagonal)',
      gridSize: 7,
      kernelValues: [
        [1, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 1]
      ]
    },
    {
      name: 'Pixel Glitch (Experimental)',
      gridSize: 5,
      kernelValues: [
        [0, 2, -1, 0, 1],
        [-2, 0, 3, -1, 0],
        [1, -3, 0, 2, -1],
        [0, 1, -2, 0, 3],
        [-1, 0, 1, -3, 0]
      ]
    }
  ]);

  const handleImageSelect = (file: File) => {
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
    }
    setSelectedFile(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setProcessingStatus('idle');
    setProgress(0);
    setProcessedImage(null);
  };

  const processImage = async (imageData: ImageData): Promise<ImageData> => {
    let result = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    );

    // Apply kernel if modified
    if (kernelModified) {
      if (kernelPipeline.length > 0) {
        for (const step of kernelPipeline) {
          if (step.kernelValues.length > 0) {
            result = imageProcessor.applyKernel(result, step.kernelValues);
          }
        }
      } else if (kernelValues.length > 0) {
        result = imageProcessor.applyKernel(result, kernelValues);
      }
    }

    return result;
  };

  const startProcessing = async () => {
    if (!selectedFile || !kernelModified) return;

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
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
    }
    setSelectedFile(null);
    setOriginalImageUrl(null);
    setProcessingStatus('idle');
    setProgress(0);
    setProcessedImage(null);
    setUploadKey((k) => k + 1);
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

  const addKernelStep = () => {
    if (!kernelValues || kernelValues.length === 0) return;
    const stepName = selectedPreset
      ? selectedPreset
      : `Custom ${kernelValues.length}x${kernelValues.length}`;

    setKernelPipeline(prev => [
      ...prev,
      {
        name: stepName,
        gridSize,
        kernelValues: kernelValues.map(row => [...row])
      }
    ]);
    setKernelModified(true);
  };

  const moveKernelStep = (index: number, direction: -1 | 1) => {
    setKernelPipeline(prev => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[index];
      next[index] = next[target];
      next[target] = tmp;
      return next;
    });
    setKernelModified(true);
  };

  const removeKernelStep = (index: number) => {
    setKernelPipeline(prev => prev.filter((_, i) => i !== index));
    setKernelModified(true);
  };

  const clearKernelPipeline = () => {
    setKernelPipeline([]);
    setKernelModified(true);
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

  useEffect(() => {
    const handlePointerUp = () => {
      exampleDraggingRef.current = false;
      exampleDraggingRef2.current = false;
      resultDraggingRef.current = false;
    };

    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  const updateExampleSliderFromClientX = (clientX: number) => {
    const el = exampleContainerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;

    const x = clientX - rect.left;
    const next = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setExampleSlider(next);
  };

  const updateExampleSlider2FromClientX = (clientX: number) => {
    const el = exampleContainerRef2.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;

    const x = clientX - rect.left;
    const next = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setExampleSlider2(next);
  };

  const updateResultSliderFromClientX = (clientX: number) => {
    const el = resultContainerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;

    const x = clientX - rect.left;
    const next = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setResultSlider(next);
  };

  useEffect(() => {
    return () => {
      if (originalImageUrl) {
        URL.revokeObjectURL(originalImageUrl);
      }
    };
  }, [originalImageUrl]);

  useEffect(() => {
    const el = explainContainerRef.current;
    if (!el) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setExplainParallax((prev) => ({ ...prev, x: nx, y: ny }));
    };

    const handlePointerLeave = () => {
      setExplainParallax((prev) => ({ ...prev, x: 0, y: 0 }));
    };

    const handleScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const t = 1 - Math.max(0, Math.min(1, r.top / vh));
      setExplainParallax((prev) => ({ ...prev, s: t }));
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900 dark:from-zinc-100 dark:via-zinc-400 dark:to-zinc-100 bg-clip-text text-transparent">
            Image Black Box
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Purpose: To show and teach users what a Deep Learning Model sees (Black box) while being trained with images (Computer Vision).
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Interactive intuition</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>No setup required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Kernel-based "model vision" demos</span>
            </div>
          </div>
        </div>

        {/* Before/After Example (Extra) */}
        <div className="text-center mb-12 animate-fade-in">
          <Card className="p-5 md:p-6 mb-10 max-w-4xl mx-auto text-left">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">Cat Example (Advanced Filter Chain)</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Filters: Gaussian Blur (advanced) â Sharpen â XY Edge Detection. Drag to compare.
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-2 font-medium">
                  Were the cat's whiskers clearer before?
                </p>
              </div>
            </div>

            <div>
              <div
                ref={exampleContainerRef2}
                className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border bg-muted/20 select-none touch-none"
                onPointerDown={(e) => {
                  exampleDraggingRef2.current = true;
                  updateExampleSlider2FromClientX(e.clientX);
                }}
                onPointerMove={(e) => {
                  if (!exampleDraggingRef2.current) return;
                  updateExampleSlider2FromClientX(e.clientX);
                }}
                role="application"
                aria-label="Cat image before and after advanced filter chain"
              >
                <img
                  src="/processed-cat.png"
                  alt="After (Gaussian Blur + Sharpen + XY Edge Detection)"
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />

              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - exampleSlider2}% 0 0)` }}
                aria-hidden="true"
              >
                <img
                  src="/cat.jpg"
                  alt="Before (original cat)"
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
              </div>

              <div
                className="absolute inset-y-0"
                style={{ left: `${exampleSlider2}%` }}
                aria-hidden="true"
              >
                <div className="absolute inset-y-0 -translate-x-1/2 w-[2px] bg-white/80 dark:bg-white/70 shadow" />
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-background/90 border shadow flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-4 rounded bg-muted-foreground/70" />
                    <div className="w-1.5 h-4 rounded bg-muted-foreground/70" />
                  </div>
                </div>
              </div>

                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-background/80 border text-xs font-medium hidden sm:block">
                  Before (Original Cat)
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-background/80 border text-xs font-medium hidden sm:block">
                  After (Gaussian Blur + Sharpen + XY Edge Detection)
                </div>
              </div>
              <div className="sm:hidden flex items-start justify-between gap-2 mt-2">
                <div className="px-2 py-1 rounded bg-background/80 border text-xs font-medium">
                  Before (Original Cat)
                </div>
                <div className="px-2 py-1 rounded bg-background/80 border text-xs font-medium text-right">
                  After (Gaussian Blur + Sharpen + XY Edge Detection)
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Before/After Example */}
        <div className="text-center mb-12 animate-fade-in">
          <Card className="p-5 md:p-6 mb-10 max-w-4xl mx-auto text-left">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">Before / After Example</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag horizontally to compare two views of the same scene—useful for building intuition about what feature extractors emphasize.
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">
                  There were more stars than expected, right?
                </p>
              </div>
            </div>

            <div>
              <div
                ref={exampleContainerRef}
                className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border bg-muted/20 select-none touch-none"
                onPointerDown={(e) => {
                  exampleDraggingRef.current = true;
                  updateExampleSliderFromClientX(e.clientX);
                }}
                onPointerMove={(e) => {
                  if (!exampleDraggingRef.current) return;
                  updateExampleSliderFromClientX(e.clientX);
                }}
                role="application"
                aria-label="Before and after image comparison"
              >
                <img
                  src="/processed-image.png"
                  alt="After (Sharpen + XY Edge Detection)"
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />

              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - exampleSlider}% 0 0)` }}
                aria-hidden="true"
              >
                <img
                  src="/original.png"
                  alt="Before (original)"
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
              </div>

              <div
                className="absolute inset-y-0"
                style={{ left: `${exampleSlider}%` }}
                aria-hidden="true"
              >
                <div className="absolute inset-y-0 -translate-x-1/2 w-[2px] bg-white/80 dark:bg-white/70 shadow" />
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-background/90 border shadow flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-4 rounded bg-muted-foreground/70" />
                    <div className="w-1.5 h-4 rounded bg-muted-foreground/70" />
                  </div>
                </div>
              </div>

                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-background/80 border text-xs font-medium hidden sm:block">
                  Before (Original)
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-background/80 border text-xs font-medium hidden sm:block">
                  After (Sharpen + XY Edge Detection)
                </div>
              </div>
              <div className="sm:hidden flex items-start justify-between gap-2 mt-2">
                <div className="px-2 py-1 rounded bg-background/80 border text-xs font-medium">
                  Before (Original)
                </div>
                <div className="px-2 py-1 rounded bg-background/80 border text-xs font-medium text-right">
                  After (Sharpen + XY Edge Detection)
                </div>
              </div>
            </div>
          </Card>
        </div>

        <section className="max-w-5xl mx-auto mt-6 mb-10">
          <div
            ref={explainContainerRef}
            className="relative overflow-hidden rounded-2xl border border-white/15 bg-background/30 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
          >
            <div
              className="pointer-events-none absolute -inset-24 opacity-60"
              style={{
                transform: `translate3d(${explainParallax.x * 18}px, ${explainParallax.y * 18}px, 0)`
              }}
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.35),transparent_55%),radial-gradient(circle_at_70%_40%,rgba(16,185,129,0.30),transparent_50%),radial-gradient(circle_at_55%_75%,rgba(236,72,153,0.22),transparent_55%)]" />
            </div>

            <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-2">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  Inside the model
                </div>
                <h3 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight">What a “black box” means</h3>
                <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                  A black box is a system where you can see the input and output, but the internal reasoning is hard to interpret.
                  In vision models, the “inside” often looks like layers of feature maps: 2D arrays produced by sliding kernels
                  across the image and responding to edges, textures, or shapes.
                </p>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    How models learn from one image
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    During training, a deep learning model can see the same image in many different forms: rotated, cropped,
                    blurred, color-shifted, noised, and more. Each version produces different intermediate 2D arrays (feature maps),
                    helping the model discover patterns that can be subtle or invisible to human eyes.
                  </p>
                </div>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-medium">Seen</div>
                    <div className="mt-1 text-sm text-muted-foreground">Your image → the final processed output</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-medium">Unseen (made visible here)</div>
                    <div className="mt-1 text-sm text-muted-foreground">Intermediate 2D arrays (feature maps) created by kernels</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div
                  className="absolute -top-6 -right-6 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/30 to-pink-500/20 blur-2xl"
                  style={{ transform: `translate3d(${explainParallax.x * 10}px, ${explainParallax.y * 10}px, 0)` }}
                  aria-hidden="true"
                />

                <div className="grid gap-4">
                  <div
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"
                    style={{
                      transform: `translate3d(${explainParallax.x * 6}px, ${explainParallax.y * 6}px, 0)`
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium">Kernels “scan” 2D arrays</div>
                      <div className="text-xs text-muted-foreground">Parallax lesson</div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
                      <div className="rounded-xl border border-white/10 bg-background/40 p-3">
                        <div className="text-xs text-muted-foreground mb-2">Image (2D array)</div>
                        <svg viewBox="0 0 240 140" className="w-full h-auto">
                          <defs>
                            <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                              <stop offset="0" stopColor="rgba(99,102,241,0.55)" />
                              <stop offset="1" stopColor="rgba(16,185,129,0.45)" />
                            </linearGradient>
                          </defs>
                          <rect x="8" y="8" width="224" height="124" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
                          {Array.from({ length: 6 }).map((_, r) =>
                            Array.from({ length: 10 }).map((__, c) => {
                              const x = 20 + c * 20;
                              const y = 22 + r * 18;
                              const a = 0.10 + ((r + c) % 6) * 0.06;
                              return (
                                <rect key={`${r}-${c}`} x={x} y={y} width="14" height="14" rx="3" fill={`rgba(99,102,241,${a})`} />
                              );
                            })
                          )}
                          <rect
                            x={52 + explainParallax.s * 90}
                            y={36 + explainParallax.s * 22}
                            width="58"
                            height="58"
                            rx="10"
                            fill="url(#g1)"
                            opacity="0.55"
                          />
                          <rect
                            x={52 + explainParallax.s * 90}
                            y={36 + explainParallax.s * 22}
                            width="58"
                            height="58"
                            rx="10"
                            fill="transparent"
                            stroke="rgba(255,255,255,0.35)"
                          />
                        </svg>
                      </div>

                      <div className="hidden md:flex flex-col items-center gap-2 px-1">
                        <div className="text-xs text-muted-foreground">convolution</div>
                        <div className="h-10 w-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center">
                          <Plus className="h-4 w-4 opacity-70" />
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-background/40 p-3">
                        <div className="text-xs text-muted-foreground mb-2">Feature map (unseen)</div>
                        <svg viewBox="0 0 240 140" className="w-full h-auto">
                          <defs>
                            <linearGradient id="g2" x1="0" x2="1" y1="1" y2="0">
                              <stop offset="0" stopColor="rgba(236,72,153,0.55)" />
                              <stop offset="1" stopColor="rgba(99,102,241,0.50)" />
                            </linearGradient>
                          </defs>
                          <rect x="8" y="8" width="224" height="124" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
                          {Array.from({ length: 7 }).map((_, r) =>
                            Array.from({ length: 9 }).map((__, c) => {
                              const x = 22 + c * 22;
                              const y = 22 + r * 16;
                              const t = (Math.sin((r + 1) * (c + 2)) + 1) / 2;
                              const a = 0.08 + t * 0.22;
                              return (
                                <rect key={`${r}-${c}`} x={x} y={y} width="16" height="12" rx="3" fill={`rgba(236,72,153,${a})`} />
                              );
                            })
                          )}
                          <path d="M26 110 C 70 75, 110 125, 150 90 S 210 95, 222 70" stroke="url(#g2)" strokeWidth="4" fill="none" opacity="0.65" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"
                    style={{
                      transform: `translate3d(${explainParallax.x * -4}px, ${explainParallax.y * -4}px, 0)`
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium">A tiny CNN-style pipeline</div>
                      <div className="text-xs text-muted-foreground">Input → kernels → features</div>
                    </div>

                    <svg viewBox="0 0 540 160" className="mt-4 w-full h-auto">
                      <defs>
                        <linearGradient id="pipe" x1="0" x2="1" y1="0" y2="1">
                          <stop offset="0" stopColor="rgba(99,102,241,0.55)" />
                          <stop offset="0.5" stopColor="rgba(16,185,129,0.45)" />
                          <stop offset="1" stopColor="rgba(236,72,153,0.40)" />
                        </linearGradient>
                      </defs>

                      <rect x="16" y="24" width="120" height="112" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
                      <text x="76" y="50" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.65)">Input</text>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <rect key={i} x={36 + i * 22} y={70} width="16" height="16" rx="4" fill={`rgba(99,102,241,${0.12 + i * 0.08})`} />
                      ))}

                      <rect x="210" y="24" width="120" height="112" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
                      <text x="270" y="50" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.65)">Kernels</text>
                      <rect x="238" y="70" width="26" height="26" rx="6" fill="rgba(16,185,129,0.22)" stroke="rgba(255,255,255,0.18)" />
                      <rect x="276" y="70" width="26" height="26" rx="6" fill="rgba(16,185,129,0.16)" stroke="rgba(255,255,255,0.18)" />
                      <rect x="238" y="104" width="26" height="26" rx="6" fill="rgba(16,185,129,0.16)" stroke="rgba(255,255,255,0.18)" />
                      <rect x="276" y="104" width="26" height="26" rx="6" fill="rgba(16,185,129,0.22)" stroke="rgba(255,255,255,0.18)" />

                      <rect x="404" y="24" width="120" height="112" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
                      <text x="464" y="50" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.65)">Features</text>
                      <rect x="430" y="70" width="22" height="58" rx="8" fill="rgba(236,72,153,0.14)" />
                      <rect x="458" y="62" width="22" height="66" rx="8" fill="rgba(236,72,153,0.22)" />
                      <rect x="486" y="78" width="22" height="50" rx="8" fill="rgba(236,72,153,0.16)" />

                      <path
                        d="M136 80 C 160 80, 182 80, 206 80"
                        stroke="url(#pipe)"
                        strokeWidth="4"
                        fill="none"
                        opacity="0.75"
                      />
                      <path
                        d="M330 80 C 354 80, 378 80, 402 80"
                        stroke="url(#pipe)"
                        strokeWidth="4"
                        fill="none"
                        opacity="0.75"
                      />
                      <circle cx={170 + explainParallax.s * 36} cy="80" r="6" fill="rgba(255,255,255,0.65)" opacity="0.6" />
                      <circle cx={366 + explainParallax.s * 22} cy="80" r="6" fill="rgba(255,255,255,0.65)" opacity="0.6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto mt-16">
            <div className="grid gap-8">
            {/* Upload Section */}
            <div className="animate-fade-in">
              <ImageUpload key={uploadKey} onImageSelect={handleImageSelect} />
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
                    <Label className="mb-2 block">Manipulate Kernel Values:</Label>
                    <KernelGrid 
                      size={gridSize} 
                      onChange={setKernelValues}
                      onKernelModified={() => setKernelModified(true)}
                      values={kernelValues}
                    />
                    <div className="mt-4 flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addKernelStep}
                          disabled={kernelValues.length === 0}
                          className="flex-1"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Kernel Step
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={clearKernelPipeline}
                          disabled={kernelPipeline.length === 0}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear Steps
                        </Button>
                      </div>

                      {kernelPipeline.length > 0 && (
                        <div className="rounded-lg border bg-muted/10 p-3">
                          <div className="text-sm font-medium mb-2">Kernel order (applied top → bottom)</div>
                          <div className="space-y-2">
                            {kernelPipeline.map((step, idx) => (
                              <div
                                key={`${step.name}-${idx}`}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-md border bg-background/60 px-3 py-2"
                              >
                                <div className="min-w-0 text-left">
                                  <div className="truncate text-sm font-medium">{idx + 1}. {step.name}</div>
                                  <div className="text-xs text-muted-foreground">{step.gridSize}x{step.gridSize}</div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => moveKernelStep(idx, -1)}
                                    disabled={idx === 0}
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => moveKernelStep(idx, 1)}
                                    disabled={idx === kernelPipeline.length - 1}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeKernelStep(idx)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
                  className="bg-gradient-to-r from-zinc-900 to-zinc-700 hover:from-zinc-950 hover:to-zinc-800 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 dark:from-zinc-100 dark:to-zinc-300 dark:hover:from-zinc-50 dark:hover:to-zinc-200 dark:text-zinc-900"
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
                  
                  <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900/40 dark:to-zinc-800/30 rounded-lg p-8 border border-white/10">
                    <p className="text-lg mb-4">
                      Your image has been successfully processed with our special algorithm.
                    </p>
                    {processedImage && originalImageUrl && (
                      <div>
                        <div
                          ref={resultContainerRef}
                          className="relative w-full max-w-3xl mx-auto aspect-[16/9] rounded-lg overflow-hidden border bg-muted/20 select-none touch-none shadow-lg mt-6"
                          onPointerDown={(e) => {
                            resultDraggingRef.current = true;
                            updateResultSliderFromClientX(e.clientX);
                          }}
                          onPointerMove={(e) => {
                            if (!resultDraggingRef.current) return;
                            updateResultSliderFromClientX(e.clientX);
                          }}
                          role="application"
                          aria-label="Original and processed image comparison"
                        >
                          <img
                            src={processedImage}
                            alt="After (processed)"
                            className="absolute inset-0 w-full h-full object-contain bg-black/5 dark:bg-black/20"
                            draggable={false}
                          />

                        <div
                          className="absolute inset-0"
                          style={{ clipPath: `inset(0 ${100 - resultSlider}% 0 0)` }}
                          aria-hidden="true"
                        >
                          <img
                            src={originalImageUrl}
                            alt="Before (original)"
                            className="absolute inset-0 w-full h-full object-contain bg-black/5 dark:bg-black/20"
                            draggable={false}
                          />
                        </div>

                        <div
                          className="absolute inset-y-0"
                          style={{ left: `${resultSlider}%` }}
                          aria-hidden="true"
                        >
                          <div className="absolute inset-y-0 -translate-x-1/2 w-[2px] bg-white/80 dark:bg-white/70 shadow" />
                          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-background/90 border shadow flex items-center justify-center">
                            <div className="flex gap-1">
                              <div className="w-1.5 h-4 rounded bg-muted-foreground/70" />
                              <div className="w-1.5 h-4 rounded bg-muted-foreground/70" />
                            </div>
                          </div>
                        </div>

                          <div className="absolute top-3 left-3 px-2 py-1 rounded bg-background/80 border text-xs font-medium hidden sm:block">
                            Before (Original)
                          </div>
                          <div className="absolute top-3 right-3 px-2 py-1 rounded bg-background/80 border text-xs font-medium hidden sm:block">
                            After (Processed)
                          </div>
                        </div>
                        <div className="sm:hidden flex items-start justify-between gap-2 mt-2 max-w-3xl mx-auto">
                          <div className="px-2 py-1 rounded bg-background/80 border text-xs font-medium">
                            Before (Original)
                          </div>
                          <div className="px-2 py-1 rounded bg-background/80 border text-xs font-medium text-right">
                            After (Processed)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-zinc-900 to-zinc-700 hover:from-zinc-950 hover:to-zinc-800 text-white dark:from-zinc-100 dark:to-zinc-300 dark:hover:from-zinc-50 dark:hover:to-zinc-200 dark:text-zinc-900"
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
          <h2 className="text-3xl font-bold text-center mb-12">Why This Exists</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="group p-6 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50/10 hover:to-blue-100/5 dark:hover:from-blue-900/10 dark:hover:to-blue-800/5 border border-transparent hover:border-blue-200/50 dark:hover:border-blue-700/50">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 p-6 w-20 h-20 mx-auto flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-500 group-hover:scale-110">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full animate-pulse"></div>
                  <Eye className="h-10 w-10 text-blue-600 dark:text-blue-300 relative z-10" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">See Feature Emphasis</h3>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                Use kernels (blur, sharpen, edge detection) as a proxy for what early vision layers can amplify or suppress.
              </p>
            </Card>

            <Card className="group p-6 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-gradient-to-br hover:from-green-50/10 hover:to-green-100/5 dark:hover:from-green-900/10 dark:hover:to-green-800/5 border border-transparent hover:border-green-200/50 dark:hover:border-green-700/50">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 p-6 w-20 h-20 mx-auto flex items-center justify-center shadow-lg group-hover:shadow-green-500/25 transition-all duration-500 group-hover:scale-110">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full animate-pulse"></div>
                  <Brain className="h-10 w-10 text-green-600 dark:text-green-300 relative z-10" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">Hands-on Learning</h3>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                Adjust kernels and color channels and immediately observe how the output changes—learn by experimentation.
              </p>
            </Card>

            <Card className="group p-6 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-gradient-to-br hover:from-purple-50/10 hover:to-purple-100/5 dark:hover:from-purple-900/10 dark:hover:to-purple-800/5 border border-transparent hover:border-purple-200/50 dark:hover:border-purple-700/50">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 p-6 w-20 h-20 mx-auto flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-500 group-hover:scale-110">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-pulse"></div>
                  <Lightbulb className="h-10 w-10 text-purple-600 dark:text-purple-300 relative z-10" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Black Box – Glass Box</h3>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                The goal is conceptual clarity: turning "the model sees something" into concrete, visual intuition.
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
