import React, { useState, useEffect } from 'react';
import { Container, Table, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { MdOutlineNavigateBefore, MdNavigateNext } from "react-icons/md";
import { IoReload } from "react-icons/io5";
import { format } from 'date-fns';
import logger from '../logger';

const ListaOrdensEnviadas = () => {
    const [ordensEnviadas, setOrdensEnviadas] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;


    const buscarDados = () => {
        fetch("http://localhost:5000/api/ordens-enviadas")
            .then(response => response.json())
            .then(data => setOrdensEnviadas(data))
            .catch(error => {
                console.error("Erro ao buscar ordens enviadas:", error);
                logger.error("Erro ao buscar ordens enviadas:", error);
            });

    };

    useEffect(() => {

        buscarDados();
    }, []);

    const handlePageChange = (direction) => {
        if (direction === 'next' && (currentPage + 1) * itemsPerPage < ordensEnviadas.length) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const displayedOrdens = ordensEnviadas.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <Container className='dados-enviados'>
            <h3 className="card-titlee">Ordens Enviadas  <Button onClick={buscarDados} variant='none'> <IoReload style={{ width: '50px', height: '50px' }} className="icon-refresh" /> </Button> </h3>
            <table className='tablee-no-border' >
                <thead>
                    <tr>
                        <th>Ordem Enviada</th>
                        <th>ID da Ordem Enviada</th>
                        <th>Quantidade</th>
                        <th>Comprimento</th>
                        <th>Data de Envio</th>

                    </tr>
                </thead>
                <tbody>
                    {displayedOrdens.length > 0 ? (
                        displayedOrdens.map((ordem, index) => (
                            <OverlayTrigger
                                key={index}
                                placement="right"
                                overlay={
                                    <Tooltip id={`tooltip-${ordem.id}`}>
                                        <p><strong>Setup Quantity:</strong> {ordem.setup_quantity}</p>
                                        <p><strong>Refugo Quantity:</strong> {ordem.refugo_quantity}</p>
                                        <p><strong>Quantidade Produzido:</strong> {ordem.real_produzido}</p>
                                        <p><strong>Real Produzido:</strong> {ordem.real_length}</p>
                                        <p><strong>Diferença entre esperado e produzido:</strong> {ordem.diferenca_producao}</p>

                                    </Tooltip>
                                }
                            >
                                <tr className='linha-tabela'>
                                    <td >{ordem.id}</td>
                                    <td >{ordem.ordem_id}</td>

                                    <td >{ordem.production_quantity} peças</td>
                                    <td >{ordem.length_consumo} mm</td>
                                    <td>{format(new Date(ordem.data_envio), 'HH:mm:ss dd/MM/yyyy')} </td>
                                </tr>
                            </OverlayTrigger>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">Nenhuma ordem enviada ainda.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="pagination-controls">
                <button onClick={() => handlePageChange('prev')} disabled={currentPage === 0} className='botao-anterior'>
                    <MdOutlineNavigateBefore style={{ width: '50px', height: '50px' }} className="icon-white" />
                </button>
                <button onClick={() => handlePageChange('next')} disabled={(currentPage + 1) * itemsPerPage >= ordensEnviadas.length} className='botao-proximo'>
                    <MdNavigateNext style={{ width: '50px', height: '50px' }} className="icon-white" />
                </button>
            </div>
        </Container>
    );
}

export default ListaOrdensEnviadas;