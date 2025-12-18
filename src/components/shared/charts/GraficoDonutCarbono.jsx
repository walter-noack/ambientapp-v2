import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export function GraficoDonutCarbono({ alcance1, alcance2 }) {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destruir gráfico previo si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Alcance 1 (Combustibles)', 'Alcance 2 (Electricidad)'],
        datasets: [
          {
            data: [alcance1, alcance2],
            backgroundColor: ['#10b981', '#3b82f6'],
            borderWidth: 0,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 15,
              padding: 15,
              font: {
                size: 13,
              },
              color: '#334155', // Color del texto de la leyenda
            },
          },
          datalabels: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1e293b', // Fondo oscuro
            titleColor: '#ffffff', // Título en blanco
            bodyColor: '#ffffff', // Cuerpo en blanco
            borderColor: '#475569',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = alcance1 + alcance2;
                const percentage = ((value / total) * 100).toFixed(1);

                // Formatear el valor con 2 decimales y coma como separador
                const valorFormateado = value.toLocaleString('es-CL', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });

                return `${label}: ${valorFormateado} tCO₂e (${percentage}%)`;
              }
            }
          }
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [alcance1, alcance2]);

  return <canvas ref={canvasRef} />;
}