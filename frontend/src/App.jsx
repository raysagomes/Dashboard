import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Ordens from './pages/Ordens';
import Home from './Home'
import CadastrarOrdem from './pages/CadastrarOrdem';
import EnviarOrdem from './pages/EnviarOrdem';
import Reports from './pages/Reports';

function App() {
    return (
        <Router>
<Routes>
<Route path="/" element={<Home />} />
 <Route path="/ordens" element={<Ordens />} />
 <Route path="/cadastrarOrdem" element={<CadastrarOrdem />} />
 <Route path="/enviarOrdem" element={<EnviarOrdem />} />
 <Route path="/reports" element={<Reports />} />

</Routes>

</Router>
    );

}

export default App;