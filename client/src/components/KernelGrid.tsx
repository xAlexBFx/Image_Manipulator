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
  
  const [grid, setGrid] = useState<(number | string)[][]>(() => 
    Array(normalizedSize).fill(0).map(() => Array(normalizedSize).fill(''))
  );

  // Update grid when size changes or values change
  useEffect(() => {
    const newSize = Math.min(Math.max(size, 0), 10);
    let newGrid = [...grid];
    
    // If we have values and they match the size, use them
    if (values && values.length === newSize && values[0].length === newSize) {
      newGrid = values.map(row => 
        row.map(cell => cell === 0 ? '' : cell.toString())
      );
    } else {
      // Otherwise resize the grid
      // Add rows if needed
      while (newGrid.length < newSize) {
        newGrid.push(Array(newSize).fill(''));
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
          newRow.push('');
        }
        // Remove columns if needed
        if (newRow.length > newSize) {
          return newRow.slice(0, newSize);
        }
        return newRow;
      });
    }
    
    setGrid(newGrid);
    // Convert to numbers for the parent component, treating empty string as 0
    const numericGrid = newGrid.map(row => 
      row.map(cell => cell === '' ? 0 : Number(cell))
    );
    onChange(numericGrid);
  }, [size, onChange, values]);

  const handleInputChange = (rowIndex: number, colIndex: number, value: string) => {
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex] = value;
    setGrid(newGrid);
    
    // Convert to numbers for the parent component, treating empty string as 0
    const numericGrid = newGrid.map(row => 
      row.map(cell => cell === '' ? 0 : Number(cell))
    );
    onChange(numericGrid);
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
              value={grid[rowIndex]?.[colIndex] ?? ''}
              onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
              onFocus={(e) => e.target.select()}
              className="w-14 h-14 text-center p-0 text-sm font-medium border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="n"
              min="-100"
              max="100"
            />
          ))
        ))}
      </div>
    </div>
  );
}
