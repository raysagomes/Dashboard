import React from "react";
import { Container, Nav, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import toggleNobg from '../assets/toggle-nobg.png';
import { LuSend } from "react-icons/lu";
import { IoIosAddCircle } from "react-icons/io";
import { FaSave } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";

const Sidebar = () => {
    return (
        <Container className="navbar">
            <Nav className="sidebar d-none d-md-flex">
                <div className="sidebar-sticky"></div>
                <Nav.Item className="nav-item">
                    <Link to="/" className="nav-link">Inicio <FaHome /> </Link>
                </Nav.Item>
                <Nav.Item className="nav-item">
                    <Link to="/cadastrarOrdem" className="nav-link">Cadastrar Ordem <IoIosAddCircle /></Link>
                </Nav.Item>
                <Nav.Item className="nav-item">
                    <Link to="/enviarOrdem" className="nav-link">Enviar Ordem <LuSend />  </Link>
                </Nav.Item>
                <Nav.Item className="nav-item">
                    <Link to="/ordens" className="nav-link">Ordens Salvas <FaSave /></Link>
                </Nav.Item>
                <Nav.Item className="nav-item">
                    <Link to="/reports" className="nav-link">Reports <HiDocumentReport />                    </Link>
                </Nav.Item>
            </Nav>


            <Dropdown className="d-md-none dropdown-custom">
                <DropdownButton id="dropdown-basic-button" title={<img src={toggleNobg} alt="Menu" style={{ width: '30px', height: '30px' }} />} variant="none">
                    <Dropdown.Item as={Link} to="/" className="dropdown-item">Inicio</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/cadastrarOrdem" className="dropdown-item">Cadastrar Ordem</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/enviarOrdem" className="dropdown-item">Enviar Ordem </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/ordens" className="dropdown-item">Ordens Salvas</Dropdown.Item>
                </DropdownButton>
            </Dropdown>
        </Container>
    );
};

export default Sidebar;