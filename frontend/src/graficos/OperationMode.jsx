import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Container } from "react-bootstrap";

const OperationEstado = () => {
    const [productionState, setProductionState] = useState(0);
    const [labels, setLabels] = useState([]);
    const [dataPoints, setDataPoints] = useState([]);
    const [lastOperationMode, setLastOperationMode] = useState(null);

    useEffect(() => {
        async function carregarDados() {
            try {
                const response = await axios.get("http://localhost:5000/api/dadosOperacao");
                const dados = response.data;

                // console.log("Dados retornados da API:", dados);

                if (Array.isArray(dados)) {
                    setLabels([]);
                    setDataPoints([]);

                    dados.forEach(dado => {
                        const currentTime = new Date(dado.horario_inicio).toLocaleTimeString();
                        setLabels(prevLabels => [...prevLabels, currentTime]);
                        setDataPoints(prevData => [...prevData, dado.modo_operacao]);
                    });

                    setProductionState(dados[dados.length - 1]?.modo_operacao);
                } else {
                    console.error("Os dados retornados não são um array:", dados);
                }

            } catch (error) {
                console.error("Erro ao carregar os dados: ", error);
            }
        }

        carregarDados();
        const intervalo = setInterval(carregarDados, 30000);

        return () => clearInterval(intervalo);
    }, []);

    const colorMap = {
        0: 'red',
        1: 'green',
        2: 'blue',
        3: 'yellow'
    };

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Estado da Operação',
                data: dataPoints,
                backgroundColor: dataPoints.map(mode => colorMap[mode]),
            },
        ],
    };

    const getModeDescription = (mode) => {
        switch (mode) {
            case 0:
                return 'Parado';
            case 1:
                return 'Automático';
            case 2:
                return 'Manual';
            case 3:
                return 'Setup';
            default:
                return 'Desconhecido';
        }
    };

    return (
        <Container className="graficoParadas">
            <h2 className="h3-titulo"> Modos de Operação do Dia</h2>
            <Bar
                data={data}
                options={{
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                generateLabels: (chart) => {
                                    const labels = Object.keys(colorMap).map(key => ({
                                        text: `Modo ${key}: ${getModeDescription(Number(key))}`,
                                        fillStyle: colorMap[key],
                                        hidden: false,
                                        index: key
                                    }));
                                    return labels;
                                }
                            }
                        }
                    }
                }}
            />
        </Container>
    );
};

export default OperationEstado;