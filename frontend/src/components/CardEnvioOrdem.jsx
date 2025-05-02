import React, { useState, useEffect } from 'react';
import { Button, Alert, Container, Card } from 'react-bootstrap';
import axios from "axios";
import { IoIosCloseCircle } from "react-icons/io";
import ListaOrdensEnviadas from './ListaOrdensEnviadas';
import ProgressBar from 'react-bootstrap/ProgressBar';
import logger from '../logger';

const CardEnvioOrdem = () => {
    const [ordens, setOrdens] = useState([]);
    const [ordemSelecionada, setOrdemSelecionada] = useState(null);
    const [message, setMessage] = useState("");
    const [ordemAtual, setOrdemAtual] = useState(null);
    const [ordensEnviadas, setOrdensEnviadas] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null);
    const [dadosOrdem, setDadosOrdem] = useState(null);
    const [dadosOPCUA, setDadosOPCUA] = useState({});
    const [porcentagem, setPorcentagem] = useState(0);
    const [consumoReal, setConsumoReal] = useState(0);
    const [produzido, setProduzido] = useState(0);
    const [operationMode, setOperationMode] = useState(0);
    const [productionState, setProductionState] = useState(0);

    useEffect(() => {
        async function carregarDados() {
            try {
                const getProductionStateString = (state) => {
                    const ProductionStates = {
                        Idle: 0,
                        Production: 1,
                        Setup: 5
                    };
                    const stateMapping = Object.entries(ProductionStates).reduce((acc, [key, value]) => {
                        acc[value] = key;
                        return acc;
                    }, {});
                    return stateMapping[state] || 'Unknown State';
                };

                const getOperationModeString = (mode) => {
                    const OperationModeStates = {
                        Off: 0,
                        Automatic: 1,
                        Manual: 2,
                        Setup: 3
                    };
                    const modeMapping = Object.entries(OperationModeStates).reduce((acc, [key, value]) => {
                        acc[value] = key;
                        return acc;
                    }, {});
                    return modeMapping[mode] || 'Unknown Mode';
                };

                const ordemRes = await fetch("http://localhost:5000/api/getLastOrder");
                const ordemData = await ordemRes.json();

                const opcuaRes = await axios.get("http://localhost:1880/opcua/dados");
                const opcuaData = opcuaRes.data;

                let ultimaOrdem = null;
                if (ordemData && ordemData.length > 0) {
                    ultimaOrdem = {
                        po_code: ordemData[0].id,
                        po_quantity: ordemData[0].production_quantity,
                        pc_length: ordemData[0].length_consumo
                    };
                }
                setOrdemAtual(ultimaOrdem);

                const consumoReal = opcuaData?.length_consumo.value;
                setConsumoReal(consumoReal);

                const produzido = opcuaData?.production_quantity.value;
                setProduzido(produzido);

                const total = ultimaOrdem?.po_quantity;

                if (total > 0) {
                    setPorcentagem(((produzido / total) * 100).toFixed(2));
                } else {
                    setPorcentagem(0);
                }
                const operationMode = opcuaData?.operation_mode_state.value;
                setOperationMode(operationMode);
                const productionState = opcuaData?.production_state.value;
                setProductionState(productionState);

                const productionStateString = getProductionStateString(productionState);
                const operationModeString = getOperationModeString(operationMode);

                setDadosOPCUA(prevState => ({
                    ...prevState,
                    productionStateString,
                    operationModeString
                }));
            } catch (error) {
                console.error("Erro ao carregar os dados: ", error);
                logger.error("Erro ao carregar os dados de modo de operação: ", error);

            }
        }

        carregarDados();
        const intervalo = setInterval(carregarDados, 3000);

        return () => clearInterval(intervalo);
    }, []);



    useEffect(() => {
        const buscarDados = () => {
            fetch("http://localhost:5000/api/production-data")
                .then(response => response.json())
                .then(data => setOrdens(data))
                .catch(error => {
                    console.error("Erro ao buscar ordens:", error);
                    logger.error(`Erro ao buscar ordens cadastradas: ${error.message}`);
                });

            fetch("http://localhost:5000/api/getLastOrder")
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        setOrdemAtual({
                            po_code: data[0].id,
                            po_quantity: data[0].production_quantity,
                            pc_length: data[0].length_consumo
                        });
                    } else {
                        setOrdemAtual(null);
                    }
                })
                .catch(error => {
                    console.error("Erro ao buscar a ultima ordem enviada:", error);
                    logger.error(`Erro ao buscar a ultima ordem enviada: ${error.message}`);
                });

            fetch("http://localhost:5000/api/ordens-enviadas")
                .then(response => response.json())
                .then(data => setOrdensEnviadas(data))
                .catch(error => {
                    console.error("Erro ao buscar a ultima ordem enviada:", error);
                    logger.error(`Erro ao buscar a ultima ordem enviada: ${error.message}`);
                });
        };
        buscarDados();
        const intervalo = setInterval(buscarDados, 5000);

        return () => clearInterval(intervalo);
    }, []);

    const enviarOrdem = () => {

        if (!ordemSelecionada) {
            setAlertMessage("Selecione uma ordem antes de enviar.");
            setTimeout(() => setAlertMessage(null), 5000);
            return;
        }

        const ordem = ordens.find(o => o.id === Number(ordemSelecionada));
        if (!ordem) {
            setAlertMessage("Ordem não encontrada.");
            return;
        }

        const dadosParaEnviar = {
            id: ordem.id
        };

        fetch("http://localhost:5000/nodered/PR400/sendData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosParaEnviar)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 0) {
                    setAlertMessage("Já tem uma ordem em produção atualmente");
                    setTimeout(() => setAlertMessage(null), 5000);
                } else if (data.success) {
                    setOrdensEnviadas(prev => [...prev, {
                        ordem_id: ordem.id,
                        production_quantity: ordem.production_quantity,
                        length_consumo: ordem.length_consumo,
                        consumo_mp: ordem.consumo_mp
                    }]);
                    setOrdemAtual({
                        po_code: ordem.id,
                        ordem_id: ordem.ordem_id,
                        po_quantity: ordem.production_quantity,
                        pc_length: ordem.length_consumo
                    });
                    setMessage("Ordem enviada com sucesso!");
                    logger.info
                }
                else if (data.status === 0) {
                    setAlertMessage("Já tem uma ordem em produção atualmente");
                    setTimeout(() => setAlertMessage(null), 5000);
                } else {
                    setAlertMessage(data.message);
                    setAlertMessage("Já tem uma ordem em produção atualmente");
                    setTimeout(() => setAlertMessage(null), 5000);
                }


            })
            .catch(error => {
                console.error("Erro ao enviar ordem:", error);
                setAlertMessage("Erro ao enviar ordem.");
                setTimeout(() => setAlertMessage(null), 5000);
            });
    };


    const handleOrdemChange = (e) => {
        const id = e.target.value;
        setOrdemSelecionada(id);
        console.log("Ordem selecionada:", id);
        logger.log("Ordem selecionada:", id);
    };


    const handleStopOrder = async () => {
        try {
            const responseOPCUA = await fetch("http://localhost:1880/opcua/dados");
            const dados = await responseOPCUA.json();

            const production_quantity = dados.production_quantity?.value;
            const length_consumo = dados.length_consumo?.value;
            const setup_quantity = dados.setup_quantity?.value;
            const refugo_quantity = dados.refugo_quantity?.value;
            const operation_mode_state = dados.operation_mode_state?.value;
            const production_state = dados.production_state?.value;

            const response = await axios.get("http://localhost:5000/api/stopOrder");
            setMessage(response.data.message);
            setTimeout(() => setMessage(null), 5000);
            setOrdemAtual(null);
            localStorage.removeItem('ordemAtual');

            const body = JSON.stringify({
                production_quantity,
                length_consumo,
                setup_quantity,
                refugo_quantity
            });
            console.log("Corpo da requisição:", body);
            logger.log("Corpo da requisição:", body);

            const respostaFinalizar = await fetch("http://localhost:5000/api/finalizar-ordem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body,
            });


            if (!respostaFinalizar.ok) {
                const errorResponse = await respostaFinalizar.json();
                console.error("Erro ao finalizar a ordem:", errorResponse);
                logger.error("Erro ao finalizar a ordem:", errorResponse);

                setMessage("Erro ao finalizar a ordem.");
                return;
            }

            const resultado = await respostaFinalizar.json();
            console.log("Resultado da finalização:", resultado);
            logger.log("Resultado da finalização:", resultado);
            setMessage(resultado.message);
        } catch (error) {
            console.error("Erro ao parar a ordem:", error);
            logger.error("Erro ao parar a ordem:", error);
            setMessage("Erro ao parar a ordem.");
        }
    };


    return (
        <Container>
            <Container className='card-envio-ordem'>
                <h2 className='h2-select'>Selecione uma Ordem de Produção para Enviar para O Servidor</h2>
                <select onChange={handleOrdemChange} defaultValue="" className='select-envio-ordem '>
                    <option value="" disabled>Escolha uma ordem</option>
                    {ordens.map(ordem => (
                        <option key={ordem.id} value={ordem.id} className='option-select'>
                            Ordem {ordem.id} - {ordem.production_quantity} peças, {ordem.length_consumo} mm
                        </option>
                    ))}
                </select>
                <button onClick={enviarOrdem} className='botao-enviar'>Enviar Ordem</button>
            </Container>

            <div>
                {alertMessage && (
                    <div className="alert-card">
                        {alertMessage}
                        <button onClick={() => setAlertMessage(null)} className='bota-fechar-alerta'><IoIosCloseCircle style={{ width: '40px', height: '40px' }} /></button>
                    </div>
                )}
            </div>

            <div className='parar-ordem'>
                <button className='botao-parar' onClick={handleStopOrder}><h3> Parar Ordem Atual</h3></button>
                {message && <Alert className="mt-3">{message}</Alert>}
            </div>


            <Container className='operacao-atual'>
                <Card className='card-operacao'>
                    <Card.Body>
                        <Card.Title><h3>Operação Atual</h3></Card.Title>
                        <Card.Text>
                            Production State: {dadosOPCUA.productionStateString} <br />
                            Operation Mode: {dadosOPCUA.operationModeString}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>

            <Container className='dados-enviados'>
                <h3 className='card-titlee'>Ordem Atual</h3>
                {ordemAtual && dadosOPCUA.operationModeString !== "Off" ? (
                    <Card className='mb-2'>
                        <Card.Body>
                            <Card.Title>Ordem {ordemAtual.po_code}</Card.Title>
                            <Card.Text>
                                Ordem {ordemAtual.ordem_id}
                                Quantidade: {ordemAtual.po_quantity} peças<br />
                                Comprimento: {ordemAtual.pc_length} mm<br />
                                <br />
                                <strong>Status de produção:</strong><br />
                                Produzido: {produzido} <br />
                                Total esperado: {ordemAtual?.po_quantity || 0}<br />
                                Consumo real de mp: {consumoReal}<br /> <br />
                                Porcentagem Produzida: {porcentagem} %

                                <ProgressBar animated now={porcentagem} className='progress-baar' />
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ) : (
                    <Card className='mb-2'>
                        <Card.Body>
                            <Card.Title>Nenhuma Ordem Sendo Produzida Atualmente</Card.Title>
                        </Card.Body>
                    </Card>
                )}
            </Container>

            <ListaOrdensEnviadas />


        </Container>
    );
};

export default CardEnvioOrdem;