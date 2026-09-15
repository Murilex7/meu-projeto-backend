import express from "express";
import type { Express, Request, Response } from "express";
//Importa a classe Player do arquivo Player.ts
import { Player } from "./Models/Player.js";

// Cria uma aplicação Express
// A função express() devolve um objeto que representa o servidor da aplicação
const app: Express = express();

//Midlleware para permitir que o servidor entenda requisiçôes com o corpo em JSON
app.use(express.json())

// Define a porta onde o servidor ficará disponível
// Neste caso, o servidor poderá ser acessado pela porta 8081
const PORT: number = 8081;

//Instanciação de um jogador utilizando a classe Player
//Criamos (instanciamos) um novo jogador chamado "Hero" com 100 de saude e nivel 5 a partir da classe Player que foi importada do arquivo Player.ts
let player1: Player = new Player("Hero", 100, 5);

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

// Inicializa o servidor utilizando a porta definida
// O método listen() faz o servidor começar a "escutar" requisições HTTP
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Rotas disponiveis:");
  console.log(`GET http://localhost:${PORT}/player - Obter informaçôes do jogador`);
  console.log(`POST http://localhost:${PORT}/player/attack - jogador realiza um ataque`);
  console.log(`POST http://localhost:${PORT}/player/take-damage - Jogador recebe dano`);
});