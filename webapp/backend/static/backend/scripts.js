

// Function that receives a p tag and changes its value by the quantity indicated in the
// parameter (positive or negative)
function updateStates(p, quantity) {
    let statesValue = parseInt(p.innerHTML);
    statesValue += quantity;
    states.innerHTML = statesValue;
}

// Function that receives either a 1 or a -1.
// If 1, it adds a new div with a state name, a checkbox and a radio button
// to the states-div div.
// If -1, it removes the last div from the states-div div.
// Also add a p tag that says "Inicial" and a p tag that says "Aceptación" to the newDiv div,
// which are shown only when the checkbox or radio button is checked, respectively.
function changeStates(statesDiv, quantity) {
    let statesValue = parseInt(states.innerHTML);
    // let stateName = document.getElementById("state-name");
    // let stateCheckbox = document.getElementById("state-checkbox");
    // let stateRadio = document.getElementById("state-radio");

    if (quantity === 1) {
        let newDiv = document.createElement("div");
        newDiv.className = "state-div";


        // Add classes to newDiv
        newDiv.classList.add("flex", "flex-row", "items-center", "justify-center", "space-x-6");
        let newP = document.createElement("p");
        // Add the state name to the p tag using the value of statesValue to select
        // a letter from the alphabet using ascii code
        newP.innerHTML = String.fromCharCode(64 + statesValue);

        let newPInicial = document.createElement("p");
        newPInicial.innerHTML = "Inicial";
        newPInicial.classList.add("invisible", "inicial");

        let newCheckbox = document.createElement("input");
        newCheckbox.type = "checkbox";
        newCheckbox.name = "accept-states";

        let newPAceptacion = document.createElement("p");
        newPAceptacion.innerHTML = "Aceptación";
        newPAceptacion.classList.add("invisible", "aceptacion");

        let newRadio = document.createElement("input");
        newRadio.type = "radio";
        newRadio.name = "start-state";

        newCheckbox.addEventListener("click", function() {
            if (newCheckbox.checked) {
                newPAceptacion.classList.remove("invisible");
            } else {
                newPAceptacion.classList.add("invisible");
            }
        });

        newRadio.addEventListener("change", function() {
            // Iterate over every radio button and update the p tag that says "Inicial"
            // according to the radio button that is checked
            let radioButtons = document.getElementsByName("start-state");
            for (let i = 0; i < radioButtons.length; i++) {
                let radio = radioButtons[i];
                let p = radio.previousSibling;
                if (radio.checked) {
                    p.classList.remove("invisible");
                } else {
                    p.classList.add("invisible");
                }
            }
        });


        newDiv.appendChild(newPInicial);
        newDiv.appendChild(newRadio);
        newDiv.appendChild(newP);
        newDiv.appendChild(newCheckbox);
        newDiv.appendChild(newPAceptacion);
        statesDiv.appendChild(newDiv);
    } else if (quantity === -1) {
        let lastDiv = statesDiv.lastChild;
        statesDiv.removeChild(lastDiv);
    }
}


// On page load, call anonymous function that calls changeStates
window.onload = function() {
    let states = document.getElementById("states");
    let minus = document.getElementById("minus");
    let plus = document.getElementById("plus");
    let statesDiv = document.getElementById("states-div");


    minus.addEventListener("click", function() {
        let statesValue = parseInt(states.innerHTML);
        if (statesValue > 0) {
            updateStates(states, -1);
            changeStates(statesDiv, -1);
        }
    });

    plus.addEventListener("click", function() {
        let statesValue = parseInt(states.innerHTML);
        if (statesValue < 26) {
            updateStates(states, 1);
            changeStates(statesDiv, 1);
        }
    });
}
