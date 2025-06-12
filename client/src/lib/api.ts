export const API_URL = import.meta.env.VITE_API_URL || 'https://api.image-manipulator.windsurf.build';

export const processImage = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_URL}/api/process-image`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to process image');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};
