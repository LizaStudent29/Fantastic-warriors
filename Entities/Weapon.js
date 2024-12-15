// Базовый класс Weapon
class Weapon {
    constructor(name, attack, durability, range) {
        this.name = name;
        this.attack = attack;
        this.durability = durability;
        this.initDurability = durability; // Изначальная прочность
        this.range = range;
    }

    // Метод для нанесения повреждения оружию
    takeDamage(damage) {
        this.durability = Math.max(0, this.durability - damage);
    }

    // Метод для получения урона оружием
    getDamage() {
        if (this.durability <= 0) return 0;
        return this.durability >= this.initDurability * 0.3 ? this.attack : this.attack / 2;
    }

    // Метод для проверки, сломано ли оружие
    isBroken() {
        return this.durability === 0;
    }
}

// Примеры стандартного оружия
export class Arm extends Weapon {
    constructor() {
        super("Рука", 1, Infinity, 1);
    }
}

export class Bow extends Weapon {
    constructor() {
        super("Лук", 10, 200, 3);
    }
}

export class Sword extends Weapon {
    constructor() {
        super("Меч", 25, 500, 1);
    }
}

export class Knife extends Weapon {
    constructor() {
        super("Нож", 5, 300, 1);
    }
}

export class Staff extends Weapon {
    constructor() {
        super("Посох", 8, 300, 2);
    }
}

// Примеры улучшенного оружия
export class LongBow extends Bow {
    constructor() {
        super();
        this.name = "Длинный лук";
        this.attack = 15;
        this.range = 4;
    }
}

export class Axe extends Sword {
    constructor() {
        super();
        this.name = "Секира";
        this.attack = 27;
        this.durability = 800;
    }
}

export class StormStaff extends Staff {
    constructor() {
        super();
        this.name = "Посох Бури";
        this.attack = 10;
        this.range = 3;
    }
}

// Тестовые примеры
// let bow = new Bow();
// console.log(bow.getDamage(), bow.durability); // 10 200
// bow.takeDamage(100);
// console.log(bow.getDamage(), bow.durability); // 10 100
// bow.takeDamage(50);
// console.log(bow.getDamage(), bow.durability); // 5 50
// bow.takeDamage(150);
// console.log(bow.getDamage(), bow.durability); // 0 0
