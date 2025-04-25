import React, { useState } from "react";

const UpdateOpcua = () => {
    const [values, setValues] = useState({
        production_quantity: 0,
        length_consumo: 0,
        refugo_quantity: 0,
        setup_quantity: 0,
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: parseFloat(e.target.value) });
    };

    const sendDataToOpcUa = async () => {
        try {
            const response = await fetch("http://localhost:5000/sendData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();
            console.log(data);
            alert(data.message);
        } catch (error) {
            console.error("Erro ao enviar dados para OPC UA:", error);
        }
    };

    return (
        <div>
            <h2>Atualizar Valores no OPC UA</h2>

            Quantidade de Produtos
            <input type="number" name="production_quantity" value={values.production_quantity} onChange={handleChange} placeholder="Production Quantity" />
            <br />
            Consumo de MP
            <input type="number" name="length_consumo" value={values.length_consumo} onChange={handleChange} placeholder="Length Consumo" />
            <br />
            Quantidade de Refugo
            <input type="number" name="refugo_quantity" value={values.refugo_quantity} onChange={handleChange} placeholder="Refugo Quantity" />
            <br />
            Quantidade Setup
            <input type="number" name="setup_quantity" value={values.setup_quantity} onChange={handleChange} placeholder="Setup Quantity" />
            <button onClick={sendDataToOpcUa}>Enviar para OPC UA</button>
        </div>
    );
};

export default UpdateOpcua;