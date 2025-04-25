import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Row, Col } from "react-bootstrap";
import ProductionDashboard from './graficos/ProductionDashboard';
import { Link } from "react-router-dom";
import AddIcon from './assets/icons-add.png';
import SendIcon from './assets/icon-send.png';
import OrderIcon from './assets/icon-order.png';
import ReportsIcon from './assets/icon-reports.png';
import Footer from './components/Footer';
import { Helmet } from "react-helmet";

function App() {
    return (
        <div className='main'>
            <Helmet>
                <title>Inicio</title>
            </Helmet>
            <Row className='row'>
                <Col>
                    <Row>
                        <Navbar className="Header">
                            <Container className='link-header'>
                                <Link to="/" className="link">
                                    <h1 className='h1-titulo'> Dashboard </h1>
                                </Link>
                            </Container>
                        </Navbar>
                        <Col xs={12} md={2} className="d-none d-md-block">
                        </Col>
                    </Row>
                    <Row className='justify-content-center align-items-center'>

                        <Col xs={12} md={2} className="text-center container-link">
                            <Link to="/cadastrarOrdem" className="inicio-link">

                                <h4 className='h4-links'>  <img src={AddIcon} alt="Menu" className='img-icon' style={{ width: '30px', height: '30px' }} />Cadastrar Ordem </h4>
                            </Link>
                        </Col>
                        <Col xs={12} md={2} className="text-center container-link">
                            <Link to="/enviarOrdem" className="inicio-link">
                                <h4 className='h4-links'> <img src={SendIcon} alt="Menu" className='img-icon' style={{ width: '30px', height: '30px' }} /> Enviar Ordem </h4>
                            </Link>
                        </Col>
                        <Col xs={12} md={2} className="text-center container-link" >
                            <Link to="/ordens" className="inicio-link">
                                <h4 className='h4-links'><img src={OrderIcon} alt="Menu" className='img-icon' style={{ width: '30px', height: '30px' }} /> Ordens Salvas </h4>
                            </Link>
                        </Col>
                        <Col xs={12} md={2} className="text-center container-link" >
                            <Link to="/reports" className="inicio-link">
                                <h4 className='h4-links'><img src={ReportsIcon} alt="Menu" className='img-icon' style={{ width: '30px', height: '30px' }} /> Reports</h4>
                            </Link>
                        </Col>
                    </Row>
                    <Row className='justify-content-center align-items-center'>
                        <Col xs={12} md={10} className="text-center">
                            <ProductionDashboard className="grafico-mp" />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Footer />
        </div>

    );

}

export default App;