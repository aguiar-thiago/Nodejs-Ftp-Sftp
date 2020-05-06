const Funcs   = require("../functions/Func");
require('dotenv').config();

const main = async () => {
  const funcs   = new Funcs();
  const arquivos = await funcs.listDir(process.env.DIRETORIO_LOCAL);

  for (arquivo of arquivos) {
    await funcs.envio(arquivo);
  }

  process.exit(0);
}

main();