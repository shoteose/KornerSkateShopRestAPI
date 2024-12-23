const sql = require("./db.js");

// Construtor
const Peca = function (peca) {
  this.nome = peca.nome;
  this.descricao = peca.descricao;
  this.id_cor = peca.id_cor;
  this.id_marca = peca.id_marca;
  this.id_categoria = peca.id_categoria;
  this.id_genero = peca.id_genero;
  this.preco = peca.preco;
  this.taxa_iva = peca.taxa_iva;
  this.taxa_desconto = peca.taxa_desconto;
  this.imagemTextura = peca.imagemTextura;
};

Peca.getAllPecas = (nome, result) => {
  let query = "SELECT * FROM peca";

  if (nome) {
    query += ` WHERE nome LIKE '%${nome}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("pecas: ", res);
    result(null, res);
  });
};

Peca.getAllPecasCategoriaUnity = (categoria, result) => {
  console.log("teste tes");
  console.log("Model foi chamado.");
  console.log("Categoria recebida no model:", categoria);

  let query = `SELECT 
    p.id AS id,
    p.nome AS nome,
    p.descricao AS descricao,
    p.tridimensional,
    c.descricao AS cor,
    m.nome AS marca,
    cat.descricao AS categoria,
    g.descricao AS genero,
    p.preco,
    p.taxa_iva,
    p.taxa_desconto
    FROM 
    peca p
    LEFT JOIN cor c ON p.id_cor = c.id
    LEFT JOIN marca m ON p.id_marca = m.id
    LEFT JOIN categoria cat ON p.id_categoria = cat.id
    LEFT JOIN genero g ON p.id_genero = g.id
    WHERE 
    p.id_categoria IN (
        SELECT id 
        FROM categoria 
        WHERE descricao LIKE ?
    );
  `;

  // Passando o parâmetro corretamente
  const params = [`%${categoria}%`];

  console.log("Query a ser executada:", query);
  console.log("Parâmetros:", params);

  sql.query(query, params, (err, res) => {
    if (err) {
      console.log("Erro ao executar query: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
};

Peca.getById = (id, result) => {
  let query;
  query = "SELECT * FROM peca WHERE id = ?";

  sql.query(query, id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Peca: ", res);
    result(null, res);
  });
};

Peca.getAllPecasNomeCategoria = (categoria, result) => {
  let query = `SELECT 
    p.id AS id,
    p.nome AS nome,
    p.descricao AS descricao,
    c.descricao AS cor,
    m.nome AS marca,
    cat.descricao AS categoria,
    g.descricao AS genero,
    p.taxa_iva,
    p.taxa_desconto
    FROM 
    peca p
    LEFT JOIN cor c ON p.id_cor = c.id
    LEFT JOIN marca m ON p.id_marca = m.id
    LEFT JOIN categoria cat ON p.id_categoria = cat.id
    LEFT JOIN genero g ON p.id_genero = g.id
    WHERE 
    p.id_categoria IN (
        SELECT id 
        FROM categoria 
        WHERE descricao LIKE ?
    );
`;

  sql.query(query, [`%${categoria}%`], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
};

Peca.insert = (newPeca, result) => {
  sql.query('INSERT INTO peca SET ?', newPeca, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    console.log("Peca inserido: ", { id: res.insertId, ...newPeca });
    result(null, { id: res.insertId, ...newPeca });
  });
};

Peca.delete = (id, result) => {
  sql.query('DELETE FROM peca WHERE id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Peca with the id
      result({ Peca: "not_found" }, null);
      return;
    }

    console.log("Peca eliminada com o id: ", id);
    result(null, res);
  });
};

Peca.updateById = (id, Peca, result) => {
  sql.query(
    'UPDATE peca SET ? WHERE id = ?',
    [Peca, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Peca
        result({ Peca: "not_found" }, null);
        return;
      }

      console.log('Peca atualizada: ', { id: id, ...Peca });
      result(null, { id: id, ...Peca });
    }
  );
};

module.exports = Peca;
