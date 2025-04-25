import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/SideBar';
import { Navbar, Container, Row, Col } from "react-bootstrap";
import CardEnvioOrdem from '../components/CardEnvioOrdem';
import '../styles/EnviarOrdem.css'
import Footer from '../components/Footer';
import { Helmet } from "react-helmet";

function EnviarOrdem() {
    return (
        <div className='main'>
            <Helmet>
                <title>Enviar Ordem</title>
            </Helmet>
            <Row className='row'>
                <Col xs={2} id="sidebar-wrapper">
                    <Sidebar />
                </Col>
                <Col className='header-width'>
                    <Navbar className="Header">
                        <Container>
                            <h1 className='h1-titulo'> Enviar Ordens </h1>
                        </Container>
                    </Navbar>
                    <Row>
                        <Col className="col-ordens">
                            <CardEnvioOrdem />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Footer />

        </div>
    );
}

export default EnviarOrdem;