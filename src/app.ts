import express from "express";
import type { Express, Request, Response } from "express";
//Importa a classe Player do arquivo Player.ts
import { Player } from "./Models/Player.js";

import fs from "fs";

// Cria uma aplicação Express
// A função express() devolve um objeto que representa o servidor da aplicação
const app: Express = express();

//Midlleware para permitir que o servidor entenda requisiçôes com o corpo em JSON
app.use(express.json())

// Define a porta onde o servidor ficará disponível
// Neste caso, o servidor poderá ser acessado pela porta 8081
const PORT: number = 8081;

//Define o nome do diretório onde os arquivos serão armazenados
const DATA_FILE = "./data/players.json"; 

/*
Função para garantir qe o diretorio de dados exista antes de salvar os arquivos.
Se o diretório não existir, ele será criado 
*/
function ensureDataFolderExists(){
  const dataFolder = "./data";
  if (!fs.existsSync(dataFolder)){
    fs.mkdirSync(dataFolder);
  }
}
//chamar a função para garantir que o diretório de dados exista
//antes de qualquer operação de leitura ou escrita de arquivos 
ensureDataFolderExists();

//Função para salvar os dados do player em um arquivo JSON
function savePlayerState(player: Player){
  //converte o objeto player em uma string JSON
  const data = JSON.stringify(player, null, 2);
  //Salva a String JSON no arquivo definido em DATA_FILE
  fs.writeFileSync(DATA_FILE, data, "utf-8");
}

//Função para carregar os dados do Player em JSON
function loadPlayerState(): Player {
  //verifica se o arquivo de dados existe
  if (fs.existsSync(DATA_FILE)){
    //lê o conteudo do arquivo e cionverte de volta para um objeto player
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const playerData = JSON.parse(data);
    /* ATENÇÂO: JSON.parse() retorna um objeto "puro"
    (sem os métodos da classe player).
    Para que os objetos da classe Player, precisamos criar uma nova istância da classe Player e passar os dados carregados para o construtor.
    */
   return new Player(playerData.name, playerData.health, playerData.level); 
  }
  //Cria um novo Player se não existir como nome "Jogador1, 100 de vid"
  const newPlayer = new Player("Hero", 100, 5);
  savePlayerState(newPlayer);
  return newPlayer;
}

// Inicia o player carregando seu estado de arquivo JSON
let player1: Player = loadPlayerState();
//Instanciação de um jogador utilizando a classe Player
//Criamos (instanciamos) um novo jogador chamado "Hero" com 100 de saude e nivel 5 a partir da classe Player que foi importada do arquivo Player.ts


// Rota GET para obter informação do jogador 
//Quando o jogador acessar a rota "/Player", o servidor respondera com os dados do jogador 
// A função callback recebe dois parametros: requisição e resposta
app.get("/player", (req: Request, res: Response) => {
  res.json({
    message: "informaçoes do Player",
    player: player1
  });
});

app.post("/player/attack", (req: Request, res: Response) => {
  const attackMessage = player1.attack();
  res.json({
    message: attackMessage,

  });
});

//Rota POST para o jogador receber dano
//Quando o usuario acessar a rota "/player/take-damege", o servidor chamará o método takeDamage() do jogador, passando o valor de dano recebido como parâmetro
app.post("/player/damage", (req: Request, res: Response) => {
    const { damage } = req.body; // Obtém a quantidade de dano do corpo da requisição
    const damageMessage = player1.takeDamage(damage);
    //Salvar o estado atual do player em arquivo JSON
    savePlayerState(player1);
    res.json({
        message: damageMessage
    });
});

app.post("/player/take-damage", (req: Request, res: Response) => {
  //extrai o valor do dano da reqsição
  const { damage } = req.body;
  //Chama o método takeDamage() do jogador
  const damageMessage = player1.takeDamage(damage);
  //Retorna uma resposta JSON com a mensagem do dano
  //Para cliente que fez a reqsição
  res.json({
    //Retorna a mensagem do dano recebido
    action: damageMessage,
    //Retorna a saúde atual do jogador
    currentHealth: player1.health,
    //Retorna o nivel atual do jogador
    currentLevel: player1.level
  });
});
app.post("/player/health", (req: Request, res: Response) => {
  const { health } = req.body;
  //Chama o método takeHealth() do jogador
  const healthMessage = player1.takeHealth(health);
  //Retorna uma resposta JSON com a mensagem da vida
  //Para cliente que fez a reqsição
  res.json({
    //Retorna a mensagem do dano recebido
    action: healthMessage,
    //Retorna a saúde atual do jogador
    currentHealth: player1.health,
    //Retorna o nivel atual do jogador
    currentLevel: player1.level
  });
});

//--------------------------------------------------------------------------------
app.post("/player/level", (req: Request, res: Response) => {
  const { level } = req.body;
  //Chama o método takeHealth() do jogador
  const levelMessage = player1.upLevel(level);
  //Retorna uma resposta JSON com a mensagem da vida
  //Para cliente que fez a reqsiçãojj
  res.json({
    //Retorna a mensagem do dano recebido
    action: levelMessage,
    //Retorna a saúde atual do jogador
    currentHealth: player1.health,
    //Retorna o nivel atual do jogador
    currentLevel: player1.level
  });
});
//--------------------------------------------------------------------------------

// Inicializa o servidor utilizando a porta definida
// O método listen() faz o servidor começar a "escutar" requisições HTTP
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Rotas disponiveis:");
  console.log(`GET http://localhost:${PORT}/player - Obter informaçôes do jogador`);
  console.log(`POST http://localhost:${PORT}/player/attack - jogador realiza um ataque`);
  console.log(`POST http://localhost:${PORT}/player/take-damage - Jogador recebe dano`);
  console.log(`POST http://localhost:${PORT}/player/health - Jogador ganha vida`);
  console.log(`POST http://localhost:${PORT}/player/level - Jogador sobe de level`);
});