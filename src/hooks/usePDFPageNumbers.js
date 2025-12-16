import { useEffect } from 'react';

/**
 * Hook para agregar numeración automática de páginas al PDF
 * Solo se ejecuta cuando el componente está siendo capturado para PDF
 */
export function usePdfPageNumbers({ empresa, fecha }) {
  useEffect(() => {
    // Este hook agrega automáticamente los números de página
    // cuando el componente se renderiza para PDF
    
    const addPageNumbers = () => {
      const pages = document.querySelectorAll('.pdf-page');
      
      pages.forEach((page, index) => {
        const pageNumber = index + 1;
        const totalPages = pages.length;
        
        // Buscar o crear footer en cada página
        let footer = page.querySelector('.pdf-page-footer');
        
        if (!footer) {
          footer = document.createElement('div');
          footer.className = 'pdf-page-footer';
          footer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #64748b;
          `;
          page.appendChild(footer);
        }
        
        // Actualizar contenido del footer
        footer.innerHTML = `
          <div style="display: flex; justify-content: space-between; padding: 0 72px;">
            <span>Informe creado para ${empresa}</span>
            <span>${fecha}</span>
            <span>Página ${pageNumber}</span>
          </div>
        `;
      });
    };

    // Ejecutar después de que el DOM esté listo
    const timer = setTimeout(addPageNumbers, 100);
    
    return () => clearTimeout(timer);
  }, [empresa, fecha]);
}