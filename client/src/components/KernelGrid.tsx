import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface KernelGridProps {
  size: number;
  onChange: (grid: number[][]) => void;
  onKernelModified: (modified: boolean) => void;
  values?: number[][];
}

export function KernelGrid({ size, onChange, onKernelModified, values }: KernelGridProps) {
  // Limit size between 3 and 10
  const normalizedSize = Math.min(Math.max(size, 0), 10);
  
  const [grid, setGrid] = useState<number[][]>(() => 
    Array(normalizedSize).fill(0).map(() => Array(normalizedSize).fill(0))
  );

  // Update grid when size changes or values change
  useEffect(() => {
    const newSize = Math.min(Math.max(size, 0), 10);
    let newGrid = [...grid];
    
    // If we have values and they match the size, use them
    if (values && values.length === newSize && values[0].length === newSize) {
      newGrid = values;
    } else {
      // Otherwise resize the grid
      // Add rows if needed
      while (newGrid.length < newSize) {
        newGrid.push(Array(newSize).fill(0));
      }
      // Remove rows if needed
      if (newGrid.length > newSize) {
        newGrid = newGrid.slice(0, newSize);
      }
      
      // Resize columns in each row
      newGrid = newGrid.map(row => {
        const newRow = [...row];
        // Add columns if needed
        while (newRow.length < newSize) {
          newRow.push(0);
        }
        // Remove columns if needed
        if (newRow.length > newSize) {
          return newRow.slice(0, newSize);
        }
        return newRow;
      });
    }
    
    setGrid(newGrid);
    onChange(newGrid);
  }, [size, onChange, values]);

  const handleInputChange = (rowIndex: number, colIndex: number, value: string) => {
    const newValue = value === '' ? 0 : Number(value);
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex] = newValue;
    setGrid(newGrid);
    onChange(newGrid);
    onKernelModified?.(true);
  };

  return (
    <div className="grid gap-2">
      <div 
        className="grid gap-1" 
        style={{ 
          gridTemplateColumns: `repeat(${normalizedSize}, minmax(0, 1fr))`,
          width: 'fit-content'
        }}
      >
        {Array(normalizedSize).fill(0).map((_, rowIndex) => (
          Array(normalizedSize).fill(0).map((_, colIndex) => (
            <Input
              key={`${rowIndex}-${colIndex}`}
              type="number"
              value={grid[rowIndex]?.[colIndex] ?? 0}
              onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
              className="w-12 h-12 text-center p-0"
              min="-100"
              max="100"
            />
          ))
        ))}
      </div>
    </div>
  );
}
