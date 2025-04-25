const axios = require('axios');
const { OPCUAClient, AttributeIds, DataType, StatusCodes } = require("node-opcua");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const opcua = require("node-opcua");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());


app.get("/opcua/dados", async (req, res) => {

  const response = await axios.get("http://localhost:1880/opcua/dados"); 
  const { production_quantity, length_consumo, refugo_quantity, setup_quantity, operation_mode_state, production_state } = response.data;

        console.log("Dados recebidos:", {
            production_quantity,
            length_consumo,
            refugo_quantity,
            setup_quantity,
            operation_mode_state, 
            production_state 
        });


  if (production_quantity === 0 || length_consumo === 0) {
      return res.json({
          message: "production_quantity ou length_consumo são 0.",
          production_quantity,
          length_consumo, 
          refugo_quantity,
          setup_quantity,
          operation_mode_state, 
          production_state 
      });
  }
  
});
  

app.get("/producao/porcentagem/:id", (req, res) => {
  const { id } = req.params;

  const query = `SELECT production_quantity FROM ordens_enviadas WHERE id = ?`;
  db.query(query, [id], (err, result) => {
      if (err || result.length === 0) {
          return res.status(500).json({ error: "Erro ao buscar produção planejada" });
      }

      const producaoPlanejada = result[0].production_quantity;

      const queryAtual = `SELECT SUM(production_quantity) as totalProducao FROM consumo_materia_prima WHERE id_ordem = ?`;
      db.query(queryAtual, [id], (err, resultAtual) => {
          if (err || resultAtual.length === 0) {
              return res.status(500).json({ error: "Erro ao buscar produção atual" });
          }

          const producaoFeita = resultAtual[0].totalProducao;
          const porcentagem = ((producaoFeita / producaoPlanejada) * 100).toFixed(2);

          res.json({ producaoFeita, porcentagem });
      });
  });
});

app.post("/api/sendData", (req, res) => {
  const { production_quantity, length_consumo, consumo_mp } = req.body;

  if (production_quantity <= 0 || length_consumo <= 0) {
      return res.status(400).json({
          success: false,
          message: "Quantidade de produção e comprimento de consumo devem ser maiores que zero."
      });
  }

  const query = `INSERT INTO production_data (production_quantity, length_consumo, consumo_mp)
                 VALUES (?, ?, ?`;

  db.query(query, [production_quantity, length_consumo, consumo_mp], (err, result) => {
      if (err) {
          console.error("Erro ao salvar dados:", err);
          return res.status(500).json({ success: false, message: "Erro ao salvar dados no banco" });
      }
      res.status(200).json({ success: true, message: "Dados salvos com sucesso!" });
  });
});



async function buscarModosDeOperacao() {
  
}
app.post("/api/modosDeOperacao", (req, res) => {
  const query = 'SELECT * FROM modos_operacao ORDER BY ID DESC LIMIT 1';
  
  db.query(query, (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao buscar dados da ordem' });
      }

      const lastMode = result[0];
      const currentTime = new Date().toISOString(); 

      if (lastMode && operationMode === lastMode.modo_operacao) {
          return res.status(400).json({
              success: false,
              message: "O último modo de operação é igual, não precisa adicionar"
          });
      }

      const insertQuery = `INSERT INTO modos_operacao (modo_operacao, horario_inicio, horario_fim)
                           VALUES (?, ?, ?)`;

      const horario_inicio = lastMode ? currentTime : null; 
      const horario_fim = lastMode ? lastMode.horario_inicio : null;

      db.query(insertQuery, [operationMode, horario_inicio, horario_fim], (err, result) => {
          if (err) {
              console.error("Erro ao salvar dados:", err);
              return res.status(500).json({ success: false, message: "Erro ao salvar dados no banco" });
          }
          res.status(200).json({ success: true, message: "Dados salvos com sucesso!" });
      });
  });
});


app.post('/nodered/PR400/sendData', async (req, res) => {
  const { id } = req.body; 

  const query = 'SELECT * FROM production_data WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao buscar dados da ordem' });
      }
      
      if (result.length === 0) {
          return res.status(404).json({ error: 'Ordem não encontrada' });
      }

      const ordem = result[0];


      const dadosParaEnvio = {
          po_code: ordem.id, 
          po_quantity: ordem.production_quantity,
          pc_length: ordem.length_consumo
      };


      fetch('http://172.40.10.124:1885/nodered/PR400/sendData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosParaEnvio)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na resposta da rede');
      }
      return response.json(); 
  
    })
      
      .then(data => {
          console.log("Resposta do Servidor:", data);

        //   if (!data.po_code) {
        //     throw new Error('A resposta do servidor não contém po_code');
        // }
          

        const insertQuery = `INSERT INTO ordens_enviadas (ordem_id, production_quantity, length_consumo, consumo_mp) 
        VALUES (?, ?, ?, ?)`;
          
          db.query(insertQuery, [ordem.id, ordem.production_quantity, ordem.length_consumo, ordem.consumo_mp], (err, result) => {
              if (err) {
                  console.error("Erro ao salvar na tabela ordens_enviadas:", err);
                  return res.status(500).json({ error: 'Erro ao registrar ordem enviada' });
              }
              res.json({ success: true, message: "Ordem enviada e registrada com sucesso!" });
          });
      })
      .catch(error => {
          console.error("Erro ao enviar ordem para o Node-RED:", error);
          res.status(500).json({ error: 'Erro ao enviar ordem' });
      });
  });
});



app.get('/api/ordens-enviadas', (req, res) => {
  const query = 'SELECT * FROM ordens_enviadas ORDER BY id DESC';  
  db.query(query, (err, result) => {
      if (err) {
          console.error("Erro ao buscar ordens enviadas:", err);
          return res.status(500).json({ error: 'Erro ao buscar ordens enviadas' });
      }
      res.json(result);
  });
});


app.get('/api/production-data', (req, res) => {
    const query = 'SELECT * FROM production_data';  
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao consultar os dados');
      } else {
        res.json(result); 
      }
    });
  });
 
  app.get('/api/getOrdensEnviada', (req, res) => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; 

    const query = 'SELECT * FROM ordens_enviadas WHERE DATE(data_envio) = ?'; 
    db.query(query, [todayString], (err, result) => {
        if (err) {
            console.error("Erro ao consultar os dados:", err);
            return res.status(500).json({ success: false, message: "Erro ao consultar os dados" });
        }
        res.json(result);
    });
});

const fetchTotalAcumulado = () => {
  return new Promise((resolve, reject) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const query = "SELECT SUM(real_length) AS total_acumulado FROM ordens_enviadas WHERE data_envio BETWEEN ? AND ?";

    db.query(query, [startOfDay, endOfDay], (error, results) => {
      if (error) {
        console.error("Erro ao buscar total acumulado:", error);
        return reject(error); 
      }
      const totalAcumulado = results[0].total_acumulado || 0;
      // console.log("Total acumulado do dia:", totalAcumulado);
      resolve(totalAcumulado); 
    });
  });
};

app.get("/api/getTotalAcumulado", async (req, res) => {
  try {
    const totalAcumulado = await fetchTotalAcumulado(); 
    res.json({ total_acumulado: totalAcumulado }); 
  } catch (error) {
    console.error("Erro ao buscar total acumulado:", error);
    res.status(500).json({ message: "Erro ao buscar total acumulado." });
  }
});

app.get('/api/getProducoesUltimos30Dias', async (req, res) => {
  try {
    const query = ' SELECT data, total_real_produzido FROM totalizador_producao WHERE data >= CURDATE() - INTERVAL 30 DAY ORDER BY DATE(data);'; 
    db.query(query, (err, result) => {
        if (err) {
            console.error("Erro ao consultar os dados:", err);
            return res.status(500).json({ success: false, message: "Erro ao consultar os dados" });
        }
        res.json(result);
    });

    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao buscar dados de produção');
  }
});


app.post('/api/updateOrdensEnviada', (req, res) => {
  const {  production_quantity, length_consumo,  setupQuantity, refugoQuantity } = req.body;

  console.log('Recebendo dados para atualização:',  production_quantity, length_consumo, setupQuantity, refugoQuantity);

  const queryGetLastOrder = `
      SELECT id FROM ordens_enviadas 
      ORDER BY id DESC 
      LIMIT 1;
  `;

  db.query(queryGetLastOrder, (err, result) => {
      if (err) {
          console.error('Erro ao buscar a última ordem enviada:', err);
          return res.status(500).json({ success: false, message: 'Erro ao buscar a última ordem' });
      }

      if (result.length === 0) {
          return res.status(404).json({ success: false, message: 'Nenhuma ordem encontrada' });
      }

      const id = result[0].id;

      const queryUpdateOrder = `
          UPDATE ordens_enviadas 
          SET real_produzido = ?, real_length = ?, setup_quantity = ?, refugo_quantity = ?
          WHERE id = ?;
      `;

      db.query(queryUpdateOrder, [ production_quantity, length_consumo,  setupQuantity, refugoQuantity,  id], (err, result) => {
          if (err) {
              console.error('Erro ao atualizar ordens enviadas:', err);
              return res.status(500).json({ success: false, message: 'Erro ao atualizar os dados' });
          }
          res.json({ success: true, message: 'Ordem atualizada com sucesso!' });
      });
  });
});

  
  app.get("/api/stopOrder", async (req, res) => {
    try {
      const response = await axios.get("http://172.40.10.124:1885/nodered/PR400/unload");
      console.log(response.data)

      res.json({        
        success: true, message: "Ordem parada com sucesso!", data: response.data 
      });
    } catch (error) {
      console.error("Erro ao parar a ordem:", error);
      res.status(500).json({ success: false, message: "Erro ao parar a ordem." });
    }
  });




  app.get('/api/getLastOrder', (req, res) => {
    const query = 'SELECT * FROM  ordens_enviadas ORDER BY id DESC LIMIT 1;';  
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao consultar os dados');
      } else {
        res.json(result); 
      }
    });
  });
  
  app.get('/api/getLastSavedOrder', (req, res) => {
    const query = 'SELECT * FROM  production_data ORDER BY id DESC LIMIT 1;';  
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao consultar os dados');
      } else {
        res.json(result); 
      }
    });
  });

  app.post("/api/finalizar-ordem", async (req, res) => {
    try {
      console.log("Corpo da Requisição (req.body):", req.body);

            const sql = 'SELECT * FROM ordens_enviadas ORDER BY id DESC LIMIT 1;';
      db.query(sql, async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Erro ao consultar os dados');
        }
  
        let ordemId;
        if (results && Array.isArray(results) && results.length > 0) {
          ordemId = results[0].id;
  
          const { production_quantity, length_consumo, setup_quantity, refugo_quantity } = req.body;
          console.log(production_quantity, length_consumo, setup_quantity, refugo_quantity );

          const updateQuery = `
            UPDATE ordens_enviadas
            SET real_produzido = ?, real_length = ?, setup_quantity = ?, refugo_quantity = ?
            WHERE id = ?
          `;

          console.log("ID da Ordem:", ordemId);

          // const totalizadorResponse = await salvarTotalizador(ordemId);

          try {
            await db.execute(updateQuery, [production_quantity, length_consumo, setup_quantity, refugo_quantity, ordemId]);
            res.json({ message: "Ordem finalizada e atualizada com sucesso!" });
          } catch (updateErr) {
            console.error("Erro ao atualizar ordem:", updateErr);
            res.status(500).json({ message: "Erro ao atualizar ordem." });
          }
        } else {
          console.log("Nenhuma ordem encontrada para obter o ID.");
          return res.status(404).json({ message: "Nenhuma ordem encontrada." });
        }
      });
  
    } catch (err) {
      console.error("Erro ao finalizar ordem:", err);
     
    }
  });

  const buscarEAtualizarModo = async () => {
    try {
        const [ultimaLinha] = await db.promise().query('SELECT * FROM modos_operacao ORDER BY id DESC LIMIT 1');
        const idUltimaLinha = ultimaLinha[0].id;  
        const modoAntigo = ultimaLinha[0].modo_operacao;


        const response = await axios.get('http://localhost:1880/opcua/dados');
        const novoModo = response.data.operation_mode_state.value;

        
        if (novoModo !== modoAntigo) {
            await db.promise().query('UPDATE modos_operacao SET horario_fim = NOW() WHERE id = ?', [idUltimaLinha]);

            await db.promise().query('INSERT INTO modos_operacao (modo_operacao, horario_inicio) VALUES (?, NOW())', [novoModo]);
            console.log('Modo atualizado para:', novoModo);
        } else {
            console.log('Nenhuma atualização necessária. Modo atual:', modoAntigo);
        }
    } catch (error) {
        console.error('Erro ao buscar e atualizar modo:', error);
    }
};

setInterval(buscarEAtualizarModo, 30000);

app.get('/api/dadosOperacao', async (req, res) => {
  try {
      const [rows] = await db.promise().query(`
          SELECT * 
          FROM modos_operacao 
          WHERE DATE(horario_inicio) = CURDATE() 
          ORDER BY id 
          LIMIT 30
      `);
      res.json(rows);
  } catch (error) {
      console.error('Erro ao buscar dados:', error);
      res.status(500).send('Erro ao buscar dados');
  }
});

app.get('/api/getDadosDeParada', async (req, res) => {
  try {
      const [rows] = await db.promise().query('SELECT * FROM modos_operacao WHERE modo_operacao = 0 ORDER BY id DESC');
      res.json(rows);
  } catch (error) {
      console.error('Erro ao buscar dados:', error);
      res.status(500).send('Erro ao buscar dados');
  }
});



app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});


