const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require("bcryptjs");
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public/inicio.html' ));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname,'public/login.html' ));
});

app.post('/registro', (req, res) => {
  const {nome, email, senha} = req.body;
  // Aqui começa a validação dos campos do formulário
  let erro = "";
  if(nome.length < 1 || email.length < 1 || senha.length < 1 ){
      erro += 'Por favor, preencha todos os campos corretamente!<br>';
  }
  if(erro){
      res.status(200).json({
          status: 'failed',
          message: erro,
      });
  }
  else{
      // aqui começa o código para inserir o registro no banco de dados
      let db = new sqlite3.Database('./banco/banquin.db', (err) => {
          if (err) {
              return console.error(err.message);
          }
              console.log('Conectou no banco de dados!');
      });

      db.get('SELECT email FROM aquatica WHERE email = ?', [email], async (error, result) => {
          if(error){
              console.log(error)
          }
          else if(result) {
              db.close((err) => {
                  if (err) {
                  return console.error(err.message);
                  }
                  console.log('Fechou a conexão com o banco de dados.');
              });
              return res.status(200).json({
                  status: 'failed',
                  message: 'Este e-mail já está em uso!',
              });
          } else{
              let senha_criptografada = await bcrypt.hash(senha, 8)

              db.run('INSERT INTO aquatica(nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha_criptografada], (error2) => {
                  if(error2) {
                      console.log(error2)
                  } else {
                      db.close((err) => {
                          if (err) {
                          return console.error(err.message);
                          }
                          console.log('Fechou a conexão com o banco de dados.');
                      });
                      return res.status(200).json({
                          status: 'success',
                          message: 'Registro feito com sucesso!',
                          campos: req.body
                      });
                  }
              });
          }
      });
  }
});

app.post('/edita-usuario', (req, res) => {
  const {nome, email, id} = req.body;
  // Aqui começa a validação dos campos do formulário
  let erro = "";
  if(nome.length < 1 || email.length < 1){
      erro += 'Por favor, preencha todos os campos corretamente!<br>';
  }
  if(erro){
      res.status(200).json({
          status: 'failed',
          message: erro,
      });
  }
  else{
      // aqui começa o código para inserir o registro no banco de dados
      let db = new sqlite3.Database('./banco/banquin.db', (err) => {
          if (err) {
              return console.error(err.message);
          }
              console.log('Conectou no banco de dados!');
      });

      db.get('SELECT * FROM aquatica WHERE email = ?', [email], async (error, result) => {
        if(error){
              console.log(error)
          }
          else if(result && result.id != id) {
              db.close((err) => {
                  if (err) {
                  return console.error(err.message);
                  }
                  console.log('Fechou a conexão com o banco de dados.');
              });
              return res.status(200).json({
                  status: 'failed',
                  message: 'Este e-mail já está em uso!',
              });
          } else{
              db.run('UPDATE aquatica SET nome = ?, email = ? WHERE id = ?', [nome, email, id], (error2) => {
                  if(error2) {
                      console.log(error2)
                  } else {
                      db.close((err) => {
                          if (err) {
                          return console.error(err.message);
                          }
                          console.log('Fechou a conexão com o banco de dados.');
                      });
                      return res.status(200).json({
                          status: 'success',
                          message: 'Atualização feita com sucesso!',
                          campos: req.body
                      });
                  }
              });
          }
      });
  }
});
    
app.get('/ver_usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','consulta_usuarios.html' ));
});

app.post('/buscar-usuarios', (req, res) => {
  let db = new sqlite3.Database('./banco/banquin.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conectou com o banco de dados!');
  });

  db.all(`SELECT * FROM aquatica`, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }

    return res.status(200).json({
      status: 'success',
      message: 'Dados buscados com sucesso!',
      usuarios: rows
    });
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Fechou a conexão com o banco de dados!');
  });
});

app.post('/procurar', (req, res) => {
  const {nome} = req.body;
  let db = new sqlite3.Database('./banco/banquin.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conectou com o banco de dados!');
  });

  db.all(`SELECT * FROM aquatica WHERE nome = ?`, [nome], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }

    return res.status(200).json({
      status: 'success',
      message: 'Dado buscado com sucesso!',
      usuarios: rows
    });
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Fechou a conexão com o banco de dados!');
  });
});

app.post('/procurarId', (req, res) => {
  const {id} = req.body;
  let db = new sqlite3.Database('./banco/banquin.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conectou com o banco de dados!');
  });

  db.get(`SELECT * FROM aquatica WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Dados buscados com sucesso!',
      nome: row.nome,
      email: row.email
    });
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Fechou a conexão com o banco de dados!');
  });
});

// Criando Excluir

app.post('/excluir', (req, res) => {
  const {id} = req.body;
  let db = new sqlite3.Database('./banco/banquin.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conectou com o banco de dados!');
  });

  db.all(`DELETE FROM aquatica WHERE id = ?`, [id], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }

    return res.status(200).json({
      status: 'success',
      message: 'Dados excluídos com sucesso!',
      usuarios: rows
    });
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Fechou a conexão com o banco de dados!');
  });
});

//Abrindo/Iniciando o Servidor

app.listen(8080, () => {
  console.log('Servidor iniciado na porta 8080');
});