// src/components/pdf/RadarChart.jsx
import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarChart({ carbonScore, waterScore, wasteScore }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    // Destruir gráfico anterior si existe
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Crear nuevo gráfico
    chartRef.current = new ChartJS(ctx, {
      type: 'radar',
      data: {
        labels: ['Carbono', 'Agua', 'Residuos'],
        datasets: [
          {
            label: 'Puntaje Ambiental',
            data: [carbonScore || 0, waterScore || 0, wasteScore || 0],
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(16, 185, 129)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(16, 185, 129)',
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            max: 100,
            ticks: {
              stepSize: 20,
              font: {
                size: 11,
                family: 'Inter, sans-serif'
              },
              color: '#64748b'
            },
            grid: {
              color: '#e2e8f0'
            },
            pointLabels: {
              font: {
                size: 13,
                weight: '600',
                family: 'Inter, sans-serif'
              },
              color: '#334155'
            }
          }
        },
        plugins: {
          legend: {
            display: false
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
            padding: 8,
            cornerRadius: 6,
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed.r} pts`;
              }
            }
          }
        }
      }
    });

    // Cleanup al desmontar
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [carbonScore, waterScore, wasteScore]);

  return (
    <div style={{ 
      width: '100%', 
      height: '280px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <canvas ref={canvasRef} />
    </div>
  );
}