const mySql =require('mysql');
// require('dotenv/config')
require('dotenv').config();

class Conexao {

  count;
  status = false;
  error;

  constructor() {
    this.conexao = mySql.createConnection({
      host : process.env.DB_HOST,
      user :  process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_DATABASE,
      port : process.env.DB_PORT,
      insecureAuth : process.env.DB_INSECUREAUTH
    });
    this.conexao.connect((err) => {
      if (err) {
        console.log('Erro ao conectar o BD...', err);
        return;
      }
      console.log('Conectado!');
    })
  }

  async end  (callback) {
    await this.conexao.end(callback);
  }

  async insert (dados, tabela) {
    const format = await this.conexao.format(`INSERT INTO ${tabela} SET ?`, dados);
    const retorno = await this.execQuery(format);
    return retorno;
  }

  async delete (where, tabela) {
    const format = await this.conexao.format(`DELETE FROM ${tabela} WHERE ?`, where);
    const retorno = await this.execQuery(format);
    return retorno;
  }

  async update (campos, where, tabela) {
    const format = this.conexao.format(`UPDATE ${tabela} SET ? WHERE ${where}`, campos);
    const retorno = await this.execQuery(format);
    return retorno;
  }

  async select (where, tabela) {
    const format =  await this.conexao.format(`SELECT * FROM ${tabela} WHERE ${where}`);
    const retorno = await this.execQuery(format);
    return retorno;
  }

  async execQuery(query) {
    return new Promise ((resolve, reject) => {
      this.conexao.query(query, (error, campos) => {
        if (error) return reject(JSON.stringify(error, null, ' ' ));

        resolve(campos);
      })
    }).catch((err) => {
      throw new Error(err)
    })
  }

}

module.exports = Conexao;