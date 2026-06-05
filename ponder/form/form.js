// retrieve the form from the dom
const form = document.querySelector('#fsyForm');

console.log(form);

// if the user selects "one campus"
// but doesnt select ANY campus
// Display message "select a campus"

function getCheckedCampuses(campuses) {
    return Array.from(campuses)
        .filter(campus => campus.checked)
        .map(campus => campus.value);
}

function isDateValid() {
    const date = document.getElementById("availableDate").value;
    const todaysDate = new Date();
    return date > todaysDate;
}

// add an event listener to the form for when it is submitted
form.addEventListener("submit", event => {
    event.preventDefault();
    console.log(event);
    console.log(form.firstName.value);
    console.log(form.lastName.value);
    console.log(form.email.value);

    const numberOfCampuses = form.travelRange.value;
    const campuses = form.campus.value;
    console.log(campuses);
    if(numberOfCampuses === "one" && 
        getCheckedCampuses(campuses).length === 0) {
            document.getElementById("output")
            .textContent = "Please select one campus";
        }
    
    if(!isDateValid()) {
        document.getElementById("output")
        .textContent = "Please select a date in the future";
    }
});