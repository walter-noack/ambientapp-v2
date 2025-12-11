import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export function GraficoBarrasResiduos({ generados, valorizados }) {
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
      type: 'bar',
      data: {
        labels: ['Residuos'],
        datasets: [
          {
            label: 'Generados (kg)',
            data: [generados],
            backgroundColor: '#ef4444',
            borderRadius: 8,
          },
          {
            label: 'Valorizados (kg)',
            data: [valorizados],
            backgroundColor: '#10b981',
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString() + ' kg';
              }
            }
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 15,
              padding: 15,
              font: {
                size: 13,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y || 0;
                return `${label}: ${value.toLocaleString()} kg`;
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
  }, [generados, valorizados]);

  return <canvas ref={canvasRef} />;
}