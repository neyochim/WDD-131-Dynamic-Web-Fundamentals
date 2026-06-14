const diceImages = document.querySelectorAll("#gameboard img");
// When button is pressed, change dcie to gif animation.

document.getElementById("rollButton").addEventListener("click", (event) => {
    
    // get image DOM element

    diceImages.forEach((image) => {
        if (isDieUnlocked(image)) {
            image.src = "assets/die_rolling.gif";
        }
    });

    setTimeout(() => {
        // Set all die images to a random number
        diceImages.forEach((image) => {
            if (isDieUnlocked(image)) {
                image.src = "assets/white_dice_" + (Math.floor(Math.random() * 6) + 1) + ".gif";
            }
        });
    }, 500);
});

function isDieUnlocked(dieImage) {
    const checkboxes = document.querySelectorAll("#gameboard input");
    const unchecked = Array.from(checkboxes)
                            .filter((checkbox) => !checkbox.checked);
    return unchecked.find(checkbox => checkbox.className === dieImage.className);
}