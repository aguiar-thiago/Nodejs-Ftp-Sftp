const Client = require('ftp');
const fs = require("fs");
const ftp = new Client();

class Ftp {

  async connection (host, user, port, pass) {
     return await ftp.connect({
      host: `${host}`,
      user:`${user}`,
      password: `${pass}`,
      port: `${port}`,
      timeout: 10000,
    })
  }

  async upload (dirLocal, dirRemoto, nomeArq) {
    if ((!dirLocal) || (!dirRemoto) || (!nomeArq)){
      console.log("parametros incorretos");
      await ftp.end();
      return;
    }
    await ftp.put(dirLocal, `${dirRemoto}/${nomeArq}`, (error) => {
      !error ? console.log("Upload Executado com sucesso") : console.log(error);
    })
  }

  async get (dirRemoto) {
    await ftp.get(dirRemoto, (error, file) => {
      if (error) console.log(error);
      file.pipe(fs.createWriteStream('testeArquivoBaixa.txt'));
      console.log("Arquivo baixado com sucesso");
    })
  }

  async existFileOrDir (dirFile, fileName = null) {
    return new Promise ((resolve, reject) => {
      ftp.list(`${dirFile}/*`, (error, list) => {

        if (error) {
          if (error.code == 550) { // CODIGO DE ERRO QUANDO NÃO ENCONTRA O DIRETOIO.
            return resolve(false);
          } else {
            return reject(error);
          }
        }

        if (fileName != null) {
          if (Array.isArray(list)) {

            var arrControle = Array();
            for (registro of list) {
              arrControle.push(registro.name);
            }

            if (arrControle.indexOf(fileName) >= 0) {
              return resolve(true);
            } else {
              console.log(fileName)
              console.log(arrControle)
              return resolve(false);
            }

          } else {
            console.log("retorno do ftp não é um array");
            //return reject(false);// Esse é o certo.
            return resolve(false);
          }
        }
        resolve(true);
      })
    })

  }

  async listDir (dir) {
    const list = await ftp.list(`${dir}/*`);
    return list;
  }

  async rename(oldName, newName) {
    return new Promise((resolve, reject) => {
      ftp.rename(oldName, newName, error =>{
        if (error) {
          if (error.code == 550 || error.code == 553) {  //CODIGOs DE ERRO QUANDO JÁ EXISTE ARQUIVO COM O MESMO NOME NO DIRETORIO.
            return resolve(false);
          } else {
            //return reject(error);
          }
        }
        resolve(true);
      })
    })
  }

  async delete (fileDir, fileName) {
    return new Promise((resolve, reject) => {
      ftp.delete(`${fileDir}/${fileName}`, error => {
        if (error) return reject(error);

        return resolve(true);

      })
    })

  }

  async end() {
    return await new Promise ((resolve, reject) => {
      ftp.logout((error) =>{
        if (error) console.log(error);
        resolve("ok");
      })
    })
  }

}

module.exports = Ftp;
