import React, { useState, useEffect } from "react";
import { Form, Button, Container, ListGroup, Card } from "react-bootstrap";
import axios from "axios";

function CardResumo() {

  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    fetchLastOrder();
  }, []);


  const fetchLastOrder = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getLastSavedOrder");
      if (response.data.length > 0) {
        setLastOrder(response.data[0]);
      } else {
        setLastOrder(null);
      }
    } catch (error) {
      console.error("Erro ao buscar a última ordem:", error);
    }
  };

  useEffect(() => {
    fetchLastOrder();

    const intervalo = setInterval(() => {
      fetchLastOrder();
    }, 4000);

    return () => clearInterval(intervalo);
  }, []);


  return (
    <Container className="card-resumo">
      <h3 className="my-4 ">Ultima Ordem de Produção Cadastrada</h3>
      {lastOrder ? (
        <ListGroup>
          <ListGroup.Item className="list-group-card"><strong>Quantidade de Produção:</strong> {lastOrder.production_quantity}</ListGroup.Item>
          <ListGroup.Item className="list-group-card"> <strong>Comprimento Consumo:</strong> {lastOrder.length_consumo}mm </ListGroup.Item>
        </ListGroup>
      ) : (
        <p> Nenhuma ordem encontrada </p>
      )}
    </Container>
  )
}


export default CardResumo;