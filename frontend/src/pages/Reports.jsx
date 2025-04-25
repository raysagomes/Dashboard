import React from 'react';
import Dashboard from '../components/dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListaDeParadas from '../components/ListaDeParadas';
import Sidebar from '../components/SideBar';
import { Navbar, Container, Row, Col } from "react-bootstrap";
import '../styles/Graficos.css'
import Footer from '../components/Footer';
import {Helmet} from "react-helmet";
import UltimoMes from '../graficos/UltimoMes';
import OperationEstado from '../graficos/OperationMode';

function Reports() {
    return (
        <div className='main'>
            <Helmet>
                <title>Reports</title>
            </Helmet>

            <Row className='row'>
                <Col xs={2} id="sidebar-wrapper">      
                    <Sidebar />
                </Col>
                <Col className='header-width'>
                    <Navbar className="Header">
                        <Container>
                            <h1 className='h1-titulo'> Reports </h1> 
                        </Container>
                    </Navbar>
                    <Row>
                        <Col className="Col-graficos"> 
                            <UltimoMes />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="Col-graficos"> 
                            <OperationEstado />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="Col-graficos"> 
                        <ListaDeParadas/> 
                        </Col>
                    </Row>

                   
                </Col>
            </Row>
            <Footer />

        </div>
    );
}

export default Reports;