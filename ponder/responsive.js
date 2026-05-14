let menuBtn = document.getElementsByClassName('menu-btn')[0];
console.log(menuBtn);

menuBtn.addEventListener('click', handleMenuBthClick);

//write a function
function handleMenuBthClick(event) {
    // grabthe nav tag
    let nav = document.querySelector('nav');
    // toggle .hide on the nav tag
    nav.classList.toggle('hide');
    // profit
    menuBtn.classList.toggle('change');
}