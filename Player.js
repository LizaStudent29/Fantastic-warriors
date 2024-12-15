// Базовый класс Player
class Player {
    constructor(position, name) {
        this.life = 100;
        this.magic = 20;
        this.speed = 1;
        this.attack = 10;
        this.agility = 5;
        this.luck = 10;
        this.description = "Игрок";
        this.weapon = new Arm();
        this.position = position;
        this.name = name;
    }

    // Метод для получения коэффициента удачи
    getLuck() {
        const randomNumber = Math.random() * 100;
        return (randomNumber + this.luck) / 100;
    }

    // Метод для расчёта силы удара
    getDamage(distance) {
        if (distance > this.weapon.range) return 0; // Если враг за пределами досягаемости
        const weaponDamage = this.weapon.getDamage();
        return (this.attack + weaponDamage) * this.getLuck() / distance;
    }

    // Метод для получения урона
    takeDamage(damage) {
        this.life = Math.max(0, this.life - damage);
    }

    // Проверка, жив ли игрок
    isDead() {
        return this.life === 0;
    }

        // Перемещение влево
    moveLeft(distance) {
        this.position = Math.max(0, this.position - Math.min(distance, this.speed));
    }

    // Перемещение вправо
    moveRight(distance) {
        this.position += Math.min(distance, this.speed);
    }

    // Перемещение (в зависимости от направления)
    move(distance) {
        if (distance < 0) {
            this.moveLeft(Math.abs(distance));
        } else {
            this.moveRight(distance);
        }
    }

    // Проверка блока удара
    isAttackBlocked() {
        return this.getLuck() > (100 - this.luck) / 100;
    }

    // Проверка уклонения
    dodged() {
        return this.getLuck() > (100 - this.agility - this.speed * 3) / 100;
    }

    // Получение атаки
    takeAttack(damage) {
        if (this.isAttackBlocked()) {
            this.weapon.takeDamage(damage); // Урон идёт на оружие
        } else if (!this.dodged()) {
            this.takeDamage(damage); // Урон идёт на здоровье
        }
    }

    // Атака противника
    tryAttack(enemy) {
        const distance = Math.abs(this.position - enemy.position);

        if (distance > this.weapon.range) return; // Враг вне досягаемости

        const weaponDamage = this.weapon.getDamage();
        const damage = this.getDamage(distance);
        this.weapon.takeDamage(10 * this.getLuck()); // Износ оружия

        if (this.position === enemy.position) {
            enemy.moveRight(1); // Отбрасываем врага
            enemy.takeDamage(damage * 2); // Урон удвоен
        } else {
            enemy.takeAttack(damage);
        }
    }

    // Проверка износа оружия
    checkWeapon() {
        if (this.weapon.isBroken()) {
            // Заменяем оружие на классом ниже
            if (this.weapon instanceof Axe || this.weapon instanceof LongBow || this.weapon instanceof StormStaff) {
                this.weapon = new Knife();
            } else if (this.weapon instanceof Knife) {
                this.weapon = new Arm();
            }
        }
    }

    // Выбор противника с минимальным уровнем здоровья
    chooseEnemy(players) {
        return players
            .filter(player => player !== this && !player.isDead()) // Исключаем себя и мёртвых
            .reduce((weakest, player) => (player.life < weakest.life ? player : weakest), players[0]);
    }

    // Движение к врагу
    moveToEnemy(enemy) {
        const distance = this.position - enemy.position;
        if (distance < 0) {
            this.moveRight(Math.abs(distance));
        } else {
            this.moveLeft(distance);
        }
    }

    // Выполнение хода
    turn(players) {
        const enemy = this.chooseEnemy(players); // Выбор врага
        if (!enemy) return; // Если врагов нет

        this.moveToEnemy(enemy); // Движение к врагу
        this.tryAttack(enemy); // Атака
    }
}

// Тесты для Player
// let player = new Player(10, "Бэтмен");
// console.log(player.getLuck()); // Рандомное значение от 0 до 1.1
// console.log(player.getDamage(1)); // Расчёт урона
// player.takeDamage(30);
// console.log(player.life); // 70
// player.takeDamage(90);
// console.log(player.isDead()); // true

// Воины, Лучники и Маги
export class Warrior extends Player {
    constructor(position, name) {
        super(position, name);
        this.life = 120;
        this.speed = 2;
        this.description = "Воин";
        this.weapon = new Sword();
    }

    // Особенность: урон снимается из маны при условиях
    takeDamage(damage) {
        const isUsingMagic = this.life <= this.life / 2 && this.getLuck() > 0.8 && this.magic > 0;
        if (isUsingMagic) {
            this.magic -= damage;
        } else {
            super.takeDamage(damage);
        }
    }
}

export class Archer extends Player {
    constructor(position, name) {
        super(position, name);
        this.life = 80;
        this.magic = 35;
        this.attack = 5;
        this.agility = 10;
        this.description = "Лучник";
        this.weapon = new Bow();
    }

    // Особенность: урон рассчитывается с учётом расстояния
    getDamage(distance) {
        const weaponDamage = this.weapon.getDamage();
        return distance <= this.weapon.range
            ? (this.attack + weaponDamage) * this.getLuck() * distance / this.weapon.range
            : 0;
    }
}

export class Mage extends Player {
    constructor(position, name) {
        super(position, name);
        this.life = 70;
        this.magic = 100;
        this.attack = 5;
        this.agility = 8;
        this.description = "Маг";
        this.weapon = new Staff();
    }

    // Особенность: уменьшение урона при высокой магии
    takeDamage(damage) {
        if (this.magic > 50) {
            this.magic -= 12;
            damage = damage / 2;
        }
        super.takeDamage(damage);
    }
}

// Тесты классов-наследников
// let warrior = new Warrior(0, "Алёша Попович");
// console.log(warrior.life, warrior.magic); // 120 20
// warrior.takeDamage(50);
// console.log(warrior.life, warrior.magic); // 70 20
// warrior.takeDamage(5);
// console.log(warrior.life, warrior.magic); // 70 15

// let archer = new Archer(5, "Леголас");
// console.log(archer.getDamage(2)); // Рассчёт урона с учётом расстояния

// let mage = new Mage(10, "Гендальф");
// console.log(mage.life, mage.magic); // 70 100
// mage.takeDamage(50);
// console.log(mage.life, mage.magic); // 45 88


// Улучшенные классы игроков
export class Dwarf extends Warrior {
    constructor(position, name) {
        super(position, name);
        this.life = 130;
        this.attack = 15;
        this.luck = 20;
        this.description = "Гном";
        this.weapon = new Axe();
    }

    // Особенность: каждый шестой удар наносит в 2 раза меньше урона при высокой удаче
    takeDamage(damage) {
        const isReducedDamage = Math.random() * 6 < 1 && this.getLuck() > 0.5;
        if (isReducedDamage) {
            damage = damage / 2;
        }
        super.takeDamage(damage);
    }
}

export class Crossbowman extends Archer {
    constructor(position, name) {
        super(position, name);
        this.life = 85;
        this.attack = 8;
        this.agility = 20;
        this.luck = 15;
        this.description = "Арбалетчик";
        this.weapon = new LongBow();
    }
}

export class Demiurge extends Mage {
    constructor(position, name) {
        super(position, name);
        this.life = 80;
        this.magic = 120;
        this.attack = 6;
        this.luck = 12;
        this.description = "Демиург";
        this.weapon = new StormStaff();
    }

    // Особенность: урон увеличивается на 50% при высокой удаче и наличии маны
    getDamage(distance) {
        if (this.magic > 0 && this.getLuck() > 0.6) {
            return super.getDamage(distance) * 1.5;
        }
        return super.getDamage(distance);
    }
}

// export default { Warrior, Archer };

// Тесты для улучшенных классов
// let dwarf = new Dwarf(3, "Торин");
// console.log(dwarf.life, dwarf.magic); // 130 20
// dwarf.takeDamage(20);
// console.log(dwarf.life); // 110 (или меньше, если сработает особенность)

// let crossbowman = new Crossbowman(5, "Леголас 2.0");
// console.log(crossbowman.getDamage(3)); // Урон с учётом улучшенного оружия

// let demiurge = new Demiurge(7, "Создатель");
// console.log(demiurge.getDamage(2)); // Урон, увеличенный на 50% при удачных условиях
