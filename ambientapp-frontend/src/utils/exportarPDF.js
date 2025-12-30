/**
 * Utilidad para exportar componentes React a PDF usando html2pdf.js
 * VERSIÓN OPTIMIZADA PARA CÍRCULOS CENTRADOS
 */
import html2pdf from 'html2pdf.js';

/**
 * Exporta un componente HTML a PDF
 * @param {string} elementId - ID del elemento HTML a exportar
 * @param {string} filename - Nombre del archivo PDF a generar
 * @param {Object} options - Opciones personalizadas de html2pdf
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function exportarComponenteAPDF(elementId, filename, options = {}) {
  try {


    const element = document.getElementById(elementId);

    if (!element) {
      const error = `❌ No se encontró elemento con id="${elementId}"`;
      console.error(error);
      return { success: false, error };
    }



    // CONFIGURACIÓN OPTIMIZADA PARA CÍRCULOS Y ALINEACIÓN
    const defaultOptions = {
      margin: 0,
      filename: filename || 'documento.pdf',
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 3,              // ⬆️ AUMENTADO de 2 a 3 para mejor calidad
        useCORS: true,
        logging: false,
        windowWidth: 800,
        windowHeight: 1120,    // ⬆️ AGREGADO: altura específica
        letterRendering: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        scrollX: 0,            // ⬆️ AGREGADO: evitar scroll
        scrollY: 0,
        // ⬆️ AGREGADO: callback antes de renderizar
        onclone: (clonedDoc) => {
          // Forzar estilos inline en círculos clonados
          const circulos = clonedDoc.querySelectorAll('[class*="rounded-full"]');
          circulos.forEach(circulo => {
            if (circulo.textContent.trim().match(/^[0-9]+$/)) {
              circulo.style.display = 'grid';
              circulo.style.placeItems = 'center';
              circulo.style.lineHeight = '1';
              circulo.style.textAlign = 'center';
            }
          });
        }
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      },
      pagebreak: {
        mode: 'avoid-all',
        avoid: ['.avoid-break', '.pdf-page']
      }
    };

    const finalOptions = { ...defaultOptions, ...options };



    await html2pdf()
      .from(element)
      .set(finalOptions)
      .save()
      .then(() => {

      })
      .catch((pdfError) => {
        console.error('❌ Error en html2pdf:', pdfError);
        throw pdfError;
      });


    return { success: true };

  } catch (error) {
    console.error('❌ Error en exportarComponenteAPDF:', error);
    return {
      success: false,
      error: error.message || 'Error desconocido al generar PDF'
    };
  }
}

/**
 * Genera un PDF en segundo plano sin mostrarlo al usuario
 */
export async function generarPDFOculto(ComponentToRender, filename, options = {}) {
  try {


    const container = document.createElement('div');
    container.id = 'pdf-temp-container';
    container.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: 800px;
      z-index: -1;
    `;

    document.body.appendChild(container);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = await exportarComponenteAPDF('pdf-root', filename, options);

    document.body.removeChild(container);


    return result;

  } catch (error) {
    console.error('❌ Error en generarPDFOculto:', error);
    return {
      success: false,
      error: error.message
    };
  }
}