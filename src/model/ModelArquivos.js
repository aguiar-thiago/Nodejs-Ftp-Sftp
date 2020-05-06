const Conexao = require("../../../lib/bd/src/ConexaoSistema");

class Arquivos extends Conexao {
  constructor () {
    super();
    this.idTableArqFtp = "SUA TABELA";
  }

  async Insert (dados) {
    return await super.insert(dados, this.idTableArqFtp);
  }

  async Delete (where) {
    await super.delete(where, this.idTableArqFtp);
  }

  async Update (campos, where) {
    return await super.update(campos, where, this.idTableArqFtp);
  }

  async Filter (where) {
    return await super.select(where, this.idTableArqFtp);
  }
}

module.exports = Arquivos;