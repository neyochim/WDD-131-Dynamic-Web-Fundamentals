let names = ["Nark", "Mathen", "Markthaniel"];
console.log(names);

console.log(names[2]);

names[4] = "Narkthaniel";
console.log(names[4]);

let grades = [100, 90, 80, 70];
console.log(grades);

let studentName = "Nathan Yochim";
let studentClasses = ["WDD-131", "WDD-132", "WDD-133"];
let studentGrades = [100, 90, 80];

let student = {
    name: "Nathan Yochim",
    classes: ["WDD-131", "WDD-132", "WDD-133"],
    grades: [100, 90, 80]
}

console.log(student.name);

names.forEach((name) => {
    console.log(name);
});

let newNames = names.map((name) => {
    return name + " Hatchley";
});

console.log(newNames);

let filteredNames = names.filter((name) => {
    return name[0] === "M";
});

const numbers = [125, 20, 5];

document.getElementById("output").innerHTML = numbers.reduce(myFunc);

function myFunc(total, num) {
  return total - num;
}

const fruits = ["Banana", "Orange", "Apple", "Mango"];
let index = fruits.indexOf("Apple");

const movieSummary = `
  <div class="movie-summary">
    <h2>${movie.title}</h2>
    <p>${movie.genre} - ${stars}</p>
  </div>
`;

document.getElementById("movie-list").innerHTML += movieSummary;

const car = {type:"Fiat", model:"500", color:"white"};