// src/utils/renderToImage.js
import html2canvas from 'html2canvas';

/**
 * Convierte un elemento DOM a imagen base64
 * @param {HTMLElement} element - Elemento a convertir
 * @param {Object} options - Opciones de html2canvas
 * @returns {Promise<string>} - URL base64 de la imagen
 */
export async function renderToImage(element, options = {}) {
  if (!element) {
    throw new Error('Element is required');
  }

  const defaultOptions = {
    scale: 2, // Mejor calidad
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    ...options
  };

  try {
    const canvas = await html2canvas(element, defaultOptions);
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error rendering to image:', error);
    throw error;
  }
}

/**
 * Hook para renderizar un componente como imagen cuando está listo
 * Uso en componente:
 * 
 * const { ref, imageUrl, isRendering } = useRenderAsImage();
 * 
 * return (
 *   <>
 *     {imageUrl ? (
 *       <img src={imageUrl} alt="Rendered component" />
 *     ) : (
 *       <div ref={ref}>Componente a renderizar</div>
 *     )}
 *   </>
 * );
 */
import { useRef, useState, useEffect } from 'react';

export function useRenderAsImage(options = {}) {
  const ref = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ref.current) return;

    const renderImage = async () => {
      setIsRendering(true);
      setError(null);

      try {
        // Esperar un tick para que el DOM esté completamente renderizado
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const url = await renderToImage(ref.current, options);
        setImageUrl(url);
      } catch (err) {
        console.error('Error rendering component as image:', err);
        setError(err);
      } finally {
        setIsRendering(false);
      }
    };

    renderImage();
  }, [options]);

  return { ref, imageUrl, isRendering, error };
}