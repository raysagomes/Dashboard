import React, { useState, useEffect } from 'react';
import { Container, Table, Pagination, Button } from 'react-bootstrap';
import { IoReload } from "react-icons/io5";
import { format } from 'date-fns';
import logger from '../logger';

function ListaTabela() {
  const [storedData, setStoredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);


  const buscarDados = () => {
    fetch('http://localhost:5000/api/production-data')
      .then((response) => response.json())
      .then((data) => {
        setStoredData(data);
      })
      .catch((error) => {
        console.error('Erro ao buscar os dados:', error);
        logger.error('Erro ao buscar os dados da tabela de cadastrados:', error);
      });
  }
  useEffect(() => {
    buscarDados();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = storedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(storedData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const generatePageItems = () => {
    const pageNumbers = [];
    const maxPages = totalPages;

    if (maxPages <= 10) {
      for (let i = 1; i <= maxPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 4) {
        pageNumbers.push('...');
      }
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i > 1 && i < maxPages) {
          pageNumbers.push(i);
        }
      }
      if (currentPage < maxPages - 3) {
        pageNumbers.push('...');
      }
      pageNumbers.push(maxPages);
    }

    return pageNumbers;
  };

  return (
    <Container className='tabela-ordens'>
      <h2 className='h3-titulo'>Ordens Cadastradas      <Button onClick={buscarDados} variant='none'> <IoReload style={{ width: '50px', height: '50px' }} className="icon-refresh" /> </Button>  </h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Ordem ID</th>
            <th>Quantidade de Peças Produzidas</th>
            <th>Comprimento em mm</th>
            <th>Data de Cadastro</th>

          </tr>
        </thead>
        <tbody>
          {currentItems.map((data, index) => (
            <tr key={index}>
              <td>{data.id}</td>
              <td>{data.production_quantity}</td>
              <td>{data.length_consumo}</td>
              <td>{format(new Date(data.data_registro), 'dd/MM/yyyy HH:mm:ss ')} </td>

            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className='paginacao'>
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {generatePageItems().map((page, index) => {
          if (page === '...') {
            return <Pagination.Ellipsis key={index} />;
          } else {
            return (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Pagination.Item>
            );
          }
        })}

        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </Container>
  );
}

export default ListaTabela;
