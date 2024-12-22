
import { Player, Dwarf, Crossbowman, Demiurge, Mage, Archer, Warrior } from './Player.js';

function play(players) {
    while (players.filter(player => !player.isDead()).length > 1) {
        for (let player of players) {
            if (!player.isDead()) {
                player.turn(players);
            }
        }

        // Вывод состояния игроков для наблюдения
        players.forEach(player => {
            console.log(`${player.name}: life = ${player.life}, position = ${player.position}`);
        });
    }

    // Определение победителя
    const winner = players.find(player => !player.isDead());
    console.log(`Победитель: ${winner ? winner.name : "никто"}`);
}

// Инициализация игроков
let warrior = new Warrior(0, "Алёша Попович");
let archer = new Archer(5, "Леголас");
let mage = new Mage(10, "Гендальф");
let dwarf = new Dwarf(8, "Торин");

let players = [warrior, archer, mage, dwarf];

// Запуск игры
play(players);
