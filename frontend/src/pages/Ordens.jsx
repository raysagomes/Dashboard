import React from 'react';
import Dashboard from '../components/dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListaTabela from '../components/ListaTabela';
import Sidebar from '../components/SideBar';
import { Navbar, Container, Row, Col } from "react-bootstrap";
import '../styles/OrdensSalvas.css'
import Footer from '../components/Footer';
import {Helmet} from "react-helmet";

function Ordens() {
    return (
        <div className='main'>
            <Helmet>
                <title>Ordens Salvas</title>
            </Helmet>

            <Row className='row'>
                <Col xs={2} id="sidebar-wrapper">      
                    <Sidebar />
                </Col>
                <Col className='header-width'>
                    <Navbar className="Header">
                        <Container>
                            <h1 className='h1-titulo'> Ordens Salvas </h1> 
                        </Container>
                    </Navbar>
                    <Row>
                        <Col className="col-ordens"> 
                            <ListaTabela /> 
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Footer />

        </div>
    );
}

export default Ordens;