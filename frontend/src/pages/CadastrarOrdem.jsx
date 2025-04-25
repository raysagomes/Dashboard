import React from 'react';
import Dashboard from '../components/dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/SideBar';
import { Navbar, Container, Row, Col } from "react-bootstrap";
import CardResumo from '../components/CardResumo';
import '../styles/CadastrarOrdem.css'
import Footer from '../components/Footer';
import {Helmet} from "react-helmet";

function CadastrarOrdem() {
    return (
        <div className='main'>
            <Helmet>
                <title>Cadastrar</title>
            </Helmet>
            <Row className='row'>
            <Col xs={2} id="sidebar-wrapper">      
                    <Sidebar />
                </Col>
                <Col className='header-width'>
                    <Navbar className="Header">
                        <Container>
                            <h1 className='h1-titulo'> Cadastrar Ordens </h1> 
                        </Container>
                    </Navbar>
                    <Row>
                        <Col> 
                            <Dashboard />
                            <CardResumo />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Footer />

        </div>
    );
}

export default CadastrarOrdem;