const character = {
	name: "Snortleblat",
	class: "Swamp Beast Diplomat",
	level: 3,
	health: 100,
	image: "https://andejuli.github.io/wdd131/character_card/snortleblat.webp",

	attacked() {
		this.health = Math.max(0, this.health - 20);
		renderCharacter();

		if (this.health === 0) {
			statusMessage.textContent = `${this.name} has died.`;
			attackButton.disabled = true;
			levelUpButton.disabled = true;
			alert(`${this.name} has died.`);
		} else {
			statusMessage.textContent = `${this.name} took damage.`;
		}
	},

	levelUp() {
		this.level += 1;
		renderCharacter();
		statusMessage.textContent = `${this.name} leveled up!`;
	}
};

const characterImage = document.querySelector("#character-image");
const characterName = document.querySelector("#character-name");
const characterClass = document.querySelector("#character-class");
const characterLevel = document.querySelector("#character-level");
const characterHealth = document.querySelector("#character-health");
const statusMessage = document.querySelector("#status-message");
const attackButton = document.querySelector("#attack-button");
const levelUpButton = document.querySelector("#levelup-button");

function renderCharacter() {
	characterImage.src = character.image;
	characterImage.alt = `${character.name}, ${character.class}`;
	characterName.textContent = character.name;
	characterClass.textContent = character.class;
	characterLevel.textContent = character.level;
	characterHealth.textContent = character.health;
}

attackButton.addEventListener("click", () => character.attacked());
levelUpButton.addEventListener("click", () => character.levelUp());

renderCharacter();
