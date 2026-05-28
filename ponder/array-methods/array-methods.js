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