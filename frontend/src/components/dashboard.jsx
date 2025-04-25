import React, { useState, useEffect } from "react";
import { Form, Button, Container, ListGroup, Alert } from "react-bootstrap";
import axios from "axios";
import { IoIosCloseCircle } from "react-icons/io";

function Dashboard() {
  const [productionQuantity, setProductionQuantity] = useState(0);
  const [lengthConsumo, setLengthConsumo] = useState(0.0);
  const [productionState, setProductionState] = useState(0);
  const [operationMode, setOperationMode] = useState(0);
  const [storedData, setStoredData] = useState([]);
  const [mpConsumptionData, setMpConsumptionData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/production-data");
      setOrders(response.data);
    } catch (error) {
      console.error("Erro ao buscar ordens:", error);
    }
  };



  const calculateMPConsumption = () => {
    return (productionQuantity * lengthConsumo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const consumo_mp = calculateMPConsumption();

    const data = {
      production_quantity: productionQuantity,
      length_consumo: lengthConsumo,
      production_state: productionState,
      operation_mode: operationMode,
      consumo_mp: consumo_mp,
      refugo_quantity: 0,
      setup_quantity: 0,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/sendData", data);

      if (response.data.success) {
        setMpConsumptionData((prevData) => [
          ...prevData,
          { time: new Date().toLocaleTimeString(), mp_consumption: consumo_mp }
        ]);
        clearForm();
        fetchOrders();
        setMessage("Ordem Cadastrada com Sucesso");
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      setAlertMessage("Erro ao salvar os dados, certifique-se de que nenhum está vazio ou zerado");
      setTimeout(() => setAlertMessage(null), 5000);

    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrderId) {
      alert("Por favor, selecione uma ordem para deletar.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/unload/${selectedOrderId}`);
      if (response.data.success) {
        alert("Ordem deletada com sucesso!");
        fetchOrders();
      }
    } catch (error) {
      console.error("Erro ao deletar a ordem:", error);
    }
  };

  const clearForm = () => {
    setProductionQuantity(0);
    setLengthConsumo(0.0);
    setProductionState(0);
    setOperationMode(0);
  };

  return (
    <div>


      <Container className="forms">
        <h2 className="my-4 h2-titulo">Cadastrar Ordem</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="productionQuantity">
            <Form.Label className="form-label">Quantidade de Produção</Form.Label>
            <Form.Control
              type="number"
              value={productionQuantity}
              onChange={(e) => setProductionQuantity(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="lengthConsumo">
            <Form.Label className="form-label">Comprimento Consumo em mm</Form.Label>
            <Form.Control
              type="number"
              value={lengthConsumo}
              onChange={(e) => setLengthConsumo(e.target.value)}
            />
          </Form.Group>


          <Button variant="none" className="botao" type="submit">
            Cadastrar Ordem
          </Button>
        </Form>
      </Container>

      <div>
        {alertMessage && (
          <div className="alert-card">
            {alertMessage}
            <button onClick={() => setAlertMessage(null)} className='bota-fechar-alerta'><IoIosCloseCircle style={{ width: '40px', height: '40px' }} /></button>
          </div>
        )}
        {message && <Alert className="mt-3">{message}</Alert>}

      </div>


    </div>
  );
}

export default Dashboard;