import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Container } from "react-bootstrap";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UltimoMes = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fazendo a chamada à API...");
        const response = await axios.get("http://localhost:5000/api/getProducoesUltimos30Dias");
        console.log("Resposta da API:", response.data);

        if (Array.isArray(response.data)) {
          const labels = response.data.map(item => {

            const date = new Date(item.data);
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
          });

          const productionTotals = response.data.map(item => item.total_real_produzido || 0);
          const colors = [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 154, 53, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(6, 255, 64, 0.6)',
          ];

          const backgroundColors = productionTotals.map((_, index) => colors[index % colors.length]);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Produção Diária',
                data: productionTotals,
                backgroundColor: backgroundColors,
              },
            ],
          });
        } else {
          throw new Error("Dados retornados não são um array.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError("Erro ao carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!chartData.labels.length || !chartData.datasets.length) {
    return <div>Dados insuficientes para exibir o gráfico.</div>;
  }

  return (
    <Container className="grafico30">
      <h2 className="h3-titulo"> Produção dos Últimos 30 Dias</h2>
      <Bar data={chartData} options={{ responsive: true }} />
    </Container>
  );
};

export default UltimoMes;