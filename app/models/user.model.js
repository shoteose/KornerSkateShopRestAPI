const sql = require("./db.js");

// construtor
const User = function (user) {
  this.email = user.email;
  this.pass = user.pass;
  this.id_tipoUser = 2;
};

User.getAll = (result) => {
  let query;
  query = "SELECT * FROM user";

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Users: ", res);
    result(null, res);
  });
};

User.getById = (id, result) => {
  let query;
  query = "SELECT * FROM user WHERE id = ?";

  sql.query(query, id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("User: ", res);
    result(null, res);
  });
};

User.insert = (newUser, result) => {
  sql.query('INSERT INTO user SET ?', newUser, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    console.log("User inserido: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
}

User.updateById = (id, User, result) => {
  sql.query(
    'UPDATE user SET email = ? , pass = ? WHERE id = ?',
    [User.email, User.pass, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User
        result({ User: "not_found" }, null);
        return;
      }

      console.log('User atualizada: ', { id: id, ...User });
      result(null, { id: id, ...User });
    }
  );
};

User.delete = (id, result) => {
  sql.query('DELETE FROM user WHERE id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ User: "not_found" }, null);
      return;
    }

    console.log("User eliminada com o id: ", id);
    result(null, res);
  });
};

User.login = (User, result) => {
  const sqlQuery = 'SELECT id, id_tipoUser FROM user WHERE email = ? AND pass = ?';

  sql.query(sqlQuery, [User.email, User.pass], (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length > 0) {
      // Retorna o primeiro resultado encontrado 
      result(null, res[0]);
    } else {
      // Nenhum resultado encontrado, credenciais inválidas
      result(null, null);
    }
  });
};


module.exports = User;
