const express = require("express");
const fsp = require("fs/promises");
const path = require("path");

const servidor = express();

servidor.use(express.json());


servidor.get("/dados", async (_req, res) => {
  try {
    const caminhoDiretorio = path.join(__dirname, "textos");

    const arquivos = await fsp.readdir(caminhoDiretorio);

    const arquivosTxt = arquivos.filter((arquivo) => arquivo.endsWith(".txt"));

    res.status(200).json({ arquivos: arquivosTxt });
  } catch (erro) {
    if (erro.code === "ENOENT") {
      // Arquivo não encontrado
      res.status(404).json({ erro: "Arquivo não encontrado" });
    } else if (erro.code === "EACCES") {
      // Permissão negada
      res
        .status(403)
        .json({ erro: "Permissão negada ao tentar acessar o arquivo" });
    } else {
      // Outros erros
      console.error("Erro ao ler o arquivo:", erro.message);
      res
        .status(500)
        .json({ erro: "Erro ao ler o arquivo", detalhes: erro.message });
    }
  }
});

servidor.get("/dado", async (req, res) => {
  try {
    const nomeDoArquivo = req.query.nomeDoArquivo;

    if (nomeDoArquivo) {
      const nomeArquivo = path.basename(nomeDoArquivo); // Garantia
      const caminhoArquivo = path.join(
        __dirname,
        "textos",
        nomeArquivo + ".txt"
      );

      let dados = await fsp.readFile(caminhoArquivo, "utf8");

      dados = dados
        .split("\r")
        .join("")
        .split("\n")
        .filter((linha) => linha.trim() !== "");

      res.status(200).json({ arquivo: dados });
    }
  } catch (erro) {
    if (erro.code === "ENOENT") {
      // Arquivo não encontrado
      res.status(404).json({ erro: "Arquivo não encontrado" });
    } else if (erro.code === "EACCES") {
      // Permissão negada
      res
        .status(403)
        .json({ erro: "Permissão negada ao tentar acessar o arquivo" });
    } else {
      // Outros erros
      console.error("Erro ao ler o arquivo:", erro.message);
      res
        .status(500)
        .json({ erro: "Erro ao ler o arquivo", detalhes: erro.message });
    }
  }
});

servidor.put("/dados/:nomeDoArquivo", async (req, res) => {
  try {
    let { conteudo } = req.body;
    const { nomeDoArquivo } = req.params;

    if (!nomeDoArquivo) {
      return res
        .status(404)
        .json({ message: "É necessário informar o nomeDoArquivo" });
    }

    if (!conteudo || typeof conteudo !== "string" || conteudo.trim() === "") {
      return res
        .status(400)
        .json({ erro: "Conteúdo inválido: deve ser uma string não vazia." });
      }

    const nomeArquivo = path.basename(nomeDoArquivo);
    const caminhoArquivo = path.join(__dirname, "textos", nomeArquivo + ".txt");

    const dadosExistentes = await fsp.readFile(caminhoArquivo, "utf8");

    // Adiciona o novo conteúdo ao final do arquivo
    await fsp.writeFile(caminhoArquivo, `${dadosExistentes}\n${conteudo}`);

    res.json({ mensagem: "Conteúdo adicionado com sucesso." });
  } catch (erro) {
    if (erro.code === "EACCES") {
      // Permissão negada
      res
        .status(403)
        .json({ erro: "Permissão negada ao tentar escrever no arquivo" });
    } else {
      console.error("Erro ao escrever no arquivo:", erro.message);
      res
        .status(500)
        .json({ erro: "Erro ao processar o arquivo", detalhes: erro.message });
    }
  }
});

servidor.post("/dados", async (req, res) => {
  // Usar o "nome" como o nome do arquivo a ser criado
try{
  let { conteudo } = req.body;
  const { nomeDoArquivo } = req.params;
  const nomeArquivo = path.basename(nomeDoArquivo);
  const caminhoArquivo = path.join(__dirname, "textos", nomeArquivo + ".txt");
}
  // Usar "conteudo" como o conteudo do arquivo

  // Receber esse dois dados no req.body
});

servidor.listen(3000, () => console.log("Servidor está rodando... 🔥"));
