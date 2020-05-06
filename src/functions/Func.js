require('dotenv').config();
const fs      = require("fs");
const Ftp     = require("../../../lib/sftp-ftp/src/Ftp.js");
const Sftp    = require("../../../lib/sftp-ftp/src/Sftp.js");

class Funcs {

  async envio(arquivo) {

    const arrDados = Array();

    arrDados["protocolo"] = process.env.PROTOCOLO;
    arrDados["host"] = process.env.FTP_HOST;
    arrDados["user"] = process.env.FTP_USER;
    arrDados["pass"] = process.env.FTP_PASS;
    arrDados["port"] = process.env.FTP_PORT;
    arrDados["dir_remoto"]  = process.env.FTP_DIR;
    arrDados["nomeArq"] = arquivo;
    arrDados["dir_local"] = process.env.DIRETORIO_LOCAL;

    var msgErro = "";
    if (arrDados["host"] == '')  msgErro = "host invalido";    else 
    if (arrDados["user"] == '')  msgErro = "Usuário inválido"; else
    if (!Number.isInteger(arrDados["port"])) msgErro = "Porta inválido";   else
    if (arrDados["pass"] == '')  msgErro = "Senha inválido";   else

    if (msgErro != "")
      throw new Error("Parametro com inconsistencia. "+ msgErro);
    await this.enviaArquivoFtp(arrDados);
  }

  async enviaArquivoFtp(arrDados) {
    var ftp = "";
    const nomeArq = arrDados["nomeArq"];
    const host = arrDados["host"];
    const user = arrDados["user"];
    const port = arrDados["port"];
    const pass = arrDados["pass"];
    const protocolo = arrDados["protocolo"];
    const dir_remoto = arrDados["dir_remoto"];
    const dir_local = arrDados["dir_local"];

    protocolo == "FTP" ? ftp = new Ftp(): ftp = new Sftp();
    await ftp.connection(host, user, port, pass);

    const verificaDir = await ftp.existFileOrDir(dir_remoto);
    if (!verificaDir) console.log(`O diretorio ${dir_remoto} não foi localizado.`);

    await ftp.upload(`${dir_local}/${nomeArq}`, dir_remoto, `temp_${nomeArq}`);
    const mandouArq = await ftp.existFileOrDir(dir_remoto, `temp_${nomeArq}`);

    if (!mandouArq) {
      console.log("nao achou arquivo no ftp");
    } else {

      var renameArq =  await ftp.rename(`${dir_remoto}/temp_${nomeArq}`, `${dir_remoto}/${nomeArq}`);
      if (!renameArq) {
        console.log(`Arquivo nao foi renomeado. Pois existe outro arquivo com o mesmo nome no diretorio. [Nome do arquivo -> ${nomeArq}]`);
        await ftp.delete(dir_remoto, `temp_${nomeArq}`);
      }
    }

    if (protocolo == "SFTP") ftp.end();
  }

  listDir(dirLocal) {
    return new Promise ((resolve, reject) => {
      fs.readdir(dirLocal, (err, data) => {
       if (err) { return reject(err); }
       resolve(data);
      });
    })
  }

}

module.exports = Funcs;
