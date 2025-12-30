// src/components/pdf/MatrizPriorizacionImagen.jsx
// Renderiza la matriz como imagen para evitar problemas de alineación en PDF

import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { MatrizPriorizacion } from './PlanAccionComponents';

/**
 * Wrapper que renderiza MatrizPriorizacion como imagen
 */
export function MatrizPriorizacionImagen({ recomendaciones }) {
  const ref = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const renderImage = async () => {
      setIsRendering(true);

      try {
        // Esperar que se renderice completamente
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const canvas = await html2canvas(ref.current, {
          scale: 3,  // Alta calidad
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false
        });
        
        const url = canvas.toDataURL('image/png');
        setImageUrl(url);
      } catch (err) {
        console.error('Error rendering matriz as image:', err);
      } finally {
        setIsRendering(false);
      }
    };

    renderImage();
  }, [recomendaciones]);

  return (
    <>
      {imageUrl ? (
        // Mostrar la imagen
        <img 
          src={imageUrl} 
          alt="Matriz de Priorización" 
          style={{ 
            width: '100%', 
            display: 'block',
            maxWidth: '100%'
          }}
        />
      ) : (
        // Renderizar el componente original (se convertirá a imagen)
        <div ref={ref} style={{ width: '100%' }}>
          <MatrizPriorizacion recomendaciones={recomendaciones} />
        </div>
      )}
      {isRendering && (
        <div style={{ 
          textAlign: 'center', 
          fontSize: '10px', 
          color: '#64748b', 
          padding: '8px' 
        }}>
          Generando gráfico...
        </div>
      )}
    </>
  );
}