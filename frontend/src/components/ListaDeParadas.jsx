import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { MdOutlineNavigateBefore, MdNavigateNext } from "react-icons/md";
import { IoReload } from "react-icons/io5";

const ListaDeParadas = () => {
    const [paradas, setParadas] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;

    const buscarDados = () => {
        fetch("http://localhost:5000/api/getDadosDeParada")
            .then(response => response.json())
            .then(data => setParadas(data))
            .catch(error => console.error("Erro ao buscar ordens enviadas:", error));
    };

    useEffect(() => {
        buscarDados();
    }, []);

    const handlePageChange = (direction) => {
        if (direction === 'next' && (currentPage + 1) * itemsPerPage < paradas.length) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Não disponível';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    const displayedOrdens = paradas.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <Container className='dados-enviados'>
            <h3 className="card-titlee">
                Paradas
                <Button onClick={buscarDados} variant='none'>
                    <IoReload style={{ width: '50px', height: '50px' }} className="icon-refresh" />
                </Button>
            </h3>
            <Table className='table-no-border' hover>
                <thead>
                    <tr>
                        <th>ID da parada</th>
                        <th>Horário de Início</th>
                        <th>Horário de Fim</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedOrdens.map((parada) => (
                        <div className='linha-tabela'>
                            <tr key={parada.id}>
                                <td>{parada.id}</td>
                                <td>{formatDate(parada.horario_inicio)}</td>
                                <td>{formatDate(parada.horario_fim)}</td>
                            </tr>
                        </div>
                    ))}
                </tbody>
            </Table>
            <div className="pagination-controls">
                <button onClick={() => handlePageChange('prev')} disabled={currentPage === 0} className='botao-anterior'>
                    <MdOutlineNavigateBefore style={{ width: '50px', height: '50px' }} className="icon-white" />
                </button>
                <button onClick={() => handlePageChange('next')} disabled={(currentPage + 1) * itemsPerPage >= paradas.length} className='botao-proximo'>
                    <MdNavigateNext style={{ width: '50px', height: '50px' }} className="icon-white" />
                </button>
            </div>
        </Container>
    );
}

export default ListaDeParadas;