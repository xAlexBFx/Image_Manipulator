
import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleImageSelect(file);
      }
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        handleImageSelect(file);
      }
    }
  }, []);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    onImageSelect(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <Card className="relative overflow-hidden border-2 border-dashed border-border/50 bg-gradient-to-br from-background via-background to-muted/20 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
      {!selectedImage ? (
        <div
          className={`relative p-12 text-center transition-all duration-300 ${
            dragActive ? 'bg-primary/10 border-primary scale-105' : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className={`rounded-full p-6 transition-all duration-300 ${
              dragActive ? 'bg-primary/20 animate-pulse-glow' : 'bg-muted'
            }`}>
              <Upload className={`h-12 w-12 transition-colors ${
                dragActive ? 'text-primary' : 'text-muted-foreground'
              }`} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight">
                Drop your image here
              </h3>
              <p className="text-muted-foreground">
                or click to browse from your device
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <ImageIcon className="h-5 w-5 mr-2" />
                Choose Image
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Supports: JPG, PNG, GIF, WebP
            </div>
          </div>

          <input
            id="fileInput"
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleChange}
            accept="image/*"
          />
        </div>
      ) : (
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full p-2 bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold">Image Ready</h3>
                <p className="text-sm text-muted-foreground">{selectedImage.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearImage}
              className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {imagePreview && (
            <div className="relative rounded-lg overflow-hidden bg-muted">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
