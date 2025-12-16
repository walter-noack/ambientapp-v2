// src/components/pdf/CarbonStackedChart.jsx
import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registrar componentes
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function CarbonStackedChart({ alcance1, alcance2 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    // Destruir gráfico anterior
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const total = alcance1 + alcance2;
    const porcentajeA1 = total > 0 ? ((alcance1 / total) * 100).toFixed(1) : 0;
    const porcentajeA2 = total > 0 ? ((alcance2 / total) * 100).toFixed(1) : 0;

    // Crear gráfico
    chartRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: ['Emisiones de CO₂'],
        datasets: [
          {
            label: 'Alcance 1 (Combustibles)',
            data: [alcance1 || 0],
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: 'Alcance 2 (Electricidad)',
            data: [alcance2 || 0],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        indexAxis: 'y', // Barras horizontales
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              font: {
                size: 11,
                family: 'Inter, sans-serif'
              },
              color: '#64748b',
              callback: function(value) {
                return value + ' kg';
              }
            },
            grid: {
              color: '#e2e8f0'
            }
          },
          y: {
            stacked: true,
            ticks: {
              font: {
                size: 12,
                weight: '600',
                family: 'Inter, sans-serif'
              },
              color: '#334155'
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 11,
                family: 'Inter, sans-serif'
              },
              color: '#334155',
              padding: 12,
              usePointStyle: true,
              pointStyle: 'rect'
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: {
              size: 12,
              family: 'Inter, sans-serif'
            },
            bodyFont: {
              size: 11,
              family: 'Inter, sans-serif'
            },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: function(context) {
                const value = context.parsed.x;
                const percentage = context.datasetIndex === 0 ? porcentajeA1 : porcentajeA2;
                return `${context.dataset.label}: ${value} kg (${percentage}%)`;
              }
            }
          },
          // ⬇️⬇️⬇️ PLUGIN PARA MOSTRAR VALORES ⬇️⬇️⬇️
          datalabels: {
            color: '#ffffff',
            font: {
              weight: 'bold',
              size: 13,
              family: 'Inter, sans-serif'
            },
            formatter: function(value, context) {
              if (value === 0) return '';
              const percentage = context.datasetIndex === 0 ? porcentajeA1 : porcentajeA2;
              return `${value} kg`;
            },
            anchor: 'center',
            align: 'center',
            textAlign: 'center'
          }
          // ⬆️⬆️⬆️ HASTA AQUÍ ⬆️⬆️⬆️
        }
      }
    });

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [alcance1, alcance2]);

  return (
    <div style={{ 
      width: '100%', 
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <canvas ref={canvasRef} />
    </div>
  );
}