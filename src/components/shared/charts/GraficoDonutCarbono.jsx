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
            },
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = alcance1 + alcance2;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value.toFixed(2)} tCO₂e (${percentage}%)`;
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