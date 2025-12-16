// src/components/pdf/REPComparisonChart.jsx
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

export default function REPComparisonChart({ productosREP = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || productosREP.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');

    // Destruir gráfico anterior
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Preparar datos
    const labels = productosREP.map(p => p.producto);
    const porcentajes = productosREP.map(p => {
      const generado = p.cantidadGenerada || 0;
      const valorizado = p.cantidadValorizada || 0;
      return generado > 0 ? ((valorizado / generado) * 100) : 0;
    });

    // Colores según porcentaje
    const colores = porcentajes.map(p => {
      if (p >= 80) return 'rgba(16, 185, 129, 0.8)';
      if (p >= 60) return 'rgba(234, 179, 8, 0.8)';
      if (p >= 40) return 'rgba(251, 146, 60, 0.8)';
      return 'rgba(239, 68, 68, 0.8)';
    });

    const coloresBorde = porcentajes.map(p => {
      if (p >= 80) return 'rgb(16, 185, 129)';
      if (p >= 60) return 'rgb(234, 179, 8)';
      if (p >= 40) return 'rgb(251, 146, 60)';
      return 'rgb(239, 68, 68)';
    });

    // Crear gráfico
    chartRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Valorización (%)',
            data: porcentajes,
            backgroundColor: colores,
            borderColor: coloresBorde,
            borderWidth: 2,
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
            beginAtZero: true,
            max: 100,
            ticks: {
              font: {
                size: 10,
                family: 'Inter, sans-serif'
              },
              color: '#64748b',
              callback: function(value) {
                return value + '%';
              }
            },
            grid: {
              color: '#e2e8f0'
            }
          },
          y: {
            ticks: {
              font: {
                size: 11,
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
            display: false
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: {
              size: 11,
              family: 'Inter, sans-serif'
            },
            bodyFont: {
              size: 10,
              family: 'Inter, sans-serif'
            },
            padding: 8,
            cornerRadius: 6,
            callbacks: {
              label: function(context) {
                const idx = context.dataIndex;
                const producto = productosREP[idx];
                const valorizado = producto.cantidadValorizada || 0;
                const generado = producto.cantidadGenerada || 0;
                return [
                  `Valorización: ${context.parsed.x.toFixed(1)}%`,
                  `${valorizado.toLocaleString('es-CL')} / ${generado.toLocaleString('es-CL')} kg`
                ];
              }
            }
          },
          datalabels: {
            color: '#ffffff',
            font: {
              weight: 'bold',
              size: 11,
              family: 'Inter, sans-serif'
            },
            formatter: function(value) {
              return value.toFixed(1) + '%';
            },
            anchor: 'end',
            align: 'end',
            offset: -8
          }
        }
      }
    });

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [productosREP]);

  if (productosREP.length === 0) {
    return (
      <div className="p-4 bg-slate-50 rounded-lg text-center">
        <p className="text-xs text-slate-600">
          No hay productos para comparar
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      height: Math.max(180, productosREP.length * 60) + 'px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <canvas ref={canvasRef} />
    </div>
  );
}