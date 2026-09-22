// A palavra "class" define que estamos criando um molde.
// A palavra "export" permite que esse arquivo seja usado por outros arquivos (como o app.ts).
export class Player {
    public name: string;
    public health: number;
    public level: number;

    // Construtores ( o construtir é um método especial que executado automaticamente quando a classe é instanciada uma única vez)
    constructor(name: string, health: number = 100, level: number = 1,) {
        // A palavra "this" faz referência a própria classe, ou seja: "Pegue o atributo 'name' da classe Player e atribua o valor do parâmetro 'name' a ele"
        this.name = name;
        this.health = health;
        this.level = level;
    }

    //Métodos (Comportamento de Classe) métodos são as "funçôes" que a classe pode executar, ou seja, são os comportamentos de classe, o método "attack" é um método que retorna uma string.
    public attack(): string {
        const damage = this.level * 10; //Calcula o dano baseado ao nivel do jogador
        return `${this.name} atacou e causou ${damage} de dano`;
    }
    // o método "takeDamege" é um método que recebe um número como parâmetro
    public takeDamage(damage: number): string {
        this.health -= damage;// Reduz a saude do jogador pelo valor do parâmetro

        //Regra para garantir que a saude não fique negativa
        if (this.health < 0) {
            this.health = 0;//Garante que a vida não fique negativa
            return `${this.name} foi derrotado!`;
        }

        return `${this.name} recebeu ${damage} de dano e agora tem ${this.health} de saúde. `;
    }



    public takeHealth(health: number): string {
        this.health += health;
        const maxHealth = 100;
        if (this.health > maxHealth) {
            this.health = maxHealth;
        }
        return `${this.name} recuperou ${health} de vida e agora está com ${this.health} de saúde.`;

    }
    //------------------------------------------------
    public upLevel(level: number): string {
        this.level += level;
        this.health = level * 20;
        return `${this.name} subiu de nivel!!! Subiu para o nivel ${level} e agora está com ${this.health} de saúde.`;
    }
    //------------------------------------------------
}
