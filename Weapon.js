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
class Arm extends Weapon {
    constructor() {
        super("Рука", 1, Infinity, 1);
    }
}

class Bow extends Weapon {
    constructor() {
        super("Лук", 10, 200, 3);
    }
}

class Sword extends Weapon {
    constructor() {
        super("Меч", 25, 500, 1);
    }
}

class Knife extends Weapon {
    constructor() {
        super("Нож", 5, 300, 1);
    }
}

class Staff extends Weapon {
    constructor() {
        super("Посох", 8, 300, 2);
    }
}

// Примеры улучшенного оружия
class LongBow extends Bow {
    constructor() {
        super();
        this.name = "Длинный лук";
        this.attack = 15;
        this.range = 4;
    }
}

class Axe extends Sword {
    constructor() {
        super();
        this.name = "Секира";
        this.attack = 27;
        this.durability = 800;
    }
}

class StormStaff extends Staff {
    constructor() {
        super();
        this.name = "Посох Бури";
        this.attack = 10;
        this.range = 3;
    }
}

export { Weapon, Arm, Bow, Sword, Knife, Staff, LongBow, Axe, StormStaff };

