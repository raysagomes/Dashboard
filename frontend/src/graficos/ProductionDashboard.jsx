import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import { Container } from "react-bootstrap";

const ProductionDashboard = () => {
  const [graphData, setGraphData] = useState([]);
  const [totalAcumulado, setTotalAcumulado] = useState(0);

  const fetchTotalAcumulado = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getTotalAcumulado");
      // console.log("Resposta da API:", response.data); 
      setTotalAcumulado(response.data.total_acumulado);
      // console.log("Total acumulado definido:", response.data.total_acumulado); 
    } catch (error) {
      console.error("Erro ao buscar total acumulado:", error);
    }
  };

  useEffect(() => {
    fetchTotalAcumulado();
    const interval = setInterval(fetchTotalAcumulado, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // console.log("Total acumulado atualizado: ", totalAcumulado);
  }, [totalAcumulado]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getOrdensEnviada");

        let acumulado = 0;
        const data = response.data.map(item => {
          const realLength = Number(item.real_length) || 0;
          acumulado += realLength;
          const dateObject = new Date(item.data_envio);

          const hora = dateObject.toTimeString().split(' ')[0];


          return {
            time: hora,
            consumo: acumulado
          };
        });

        // console.log("Dados processados:", data); 
        setGraphData(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Container className="grafico-mp">
        <h3 className="h3-titulo">Consumo de Matéria-Prima ao Longo do Dia</h3>
        <ResponsiveContainer width="80%" height={400} className="grafico">
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="consumo" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
        <h4>Total Acumulado do Dia: {totalAcumulado}</h4>
      </Container>
    </div>
  );
};

export default ProductionDashboard;