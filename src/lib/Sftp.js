const Client = require('ssh2-sftp-client');
const fs = require("fs");
const sftp = new Client();

class Sftp {

  async connection (host, user, port, pass) {
     return await sftp.connect({
      host: `${host}`,
      user:`${user}`,
      password: `${pass}`,
      port: `${port}`,
      timeout: 20000,
    })
  }

  async upload (dirLocalComArquivo, dirRemoto, nomeArq) {
    if ((!dirLocalComArquivo) || (!dirRemoto) || (!nomeArq)){
      console.log("parametros incorretos");
      return;
    }
    try {
      const retorno = await sftp.put(dirLocalComArquivo, `${dirRemoto}/${nomeArq}`);
      return retorno;
    } catch (e){
      throw new Error(e);
    }
  }

  async get (dirRemoto, fileName) {
    try{
      await sftp.get(dirRemoto, "D:/Documents/ArquivosFtp/"+ fileName);
      console.log("Download executado com sucesso")

    } catch(e) {
      throw new Error(e);
    }
  }

  async existFileOrDir (dir, fileName = null) {
    try{
      var status = await sftp.list(dir);

      if (Array.isArray(status)) {
        if (fileName != null) {
          var arrControle = Array();
          for (registro of status) {
            await arrControle.push(registro.name);
          }

          if (arrControle.indexOf(fileName) >= 0){
            console.log("Achou arquivo");
            return true;
          } else {
            console.log("Arquivo nao encontrado");
            console.log(arrControle);
            return false;
          }
        } else {
          return true;
        }
      } else {
        throw new Error("Retorno do SFTP não esperado => "+ status);
      }

    } catch(e){
      if (e.code == "ENOTDIR"){  //este codigo de erro é quando não existe um diretorio.
        return false;
      } else {
        throw new Error(e);
      }
    }
  }

  async listDir (dir) {
    try {
      const list = await sftp.list(dir);
      return list;

    } catch(e){
      if (e.code == "ENOTDIR"){ //este codigo de erro é quando não existe um diretorio.
        return false;
      } else {
        throw new Error(e);
      }
    }
  }

  async rename(oldName, newName) {
    try {
      const status = await sftp.rename(oldName, newName);
      return true;
    } catch(e) {

      if (e.code == "EACCES") {  //CODIGO DE ERRO QUANDO JÁ EXISTE ARQUIVO COM O MESMO NOME NO DIRETORIO.
        return false;
      } else {
        throw new Error(e);
      }
    }
  }

  async delete (fileDir, fileName) {
    try {
    var teste = await sftp.delete(`${fileDir}/${fileName}`);
    console.log(teste);

    return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  async end() {
    try {
      const status = sftp.end();
      return status;
    } catch(e){
      throw new Error(e);
    }
  }
}


module.exports = Sftp;

