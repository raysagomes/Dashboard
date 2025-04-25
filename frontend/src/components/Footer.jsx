import React from "react"
import { Link } from "react-router-dom";


function Footer() {

  return (
    <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-5 border-top footer-">
      <div className="col mb-3">
        <p >© 2025</p>
      </div>
      <div className="col mb-3"></div>
      <div className="col mb-3">
        <h5>Section</h5>
        <ul className="nav flex-column">

          <li className="nav-item-footer mb-2"> <Link to="/" className="link">Inicio </Link></li>
          <li className="nav-item-footer mb-2"> <Link to="/cadastrarOrdem" className="link" >Cadastrar Ordem </Link></li>
          <li className="nav-item-footer mb-2"> <Link to="/enviarOrdem" className="link">Enviar Ordem </Link></li>
          <li className="nav-item-footer mb-2"> <Link to="/ordens" className="link">Ordens Salvas</Link></li>
          <li className="nav-item-footer mb-2"> <Link to="/reports" className="link">Reports</Link></li>

        </ul>
      </div>


    </footer>

  );
}

export default Footer;