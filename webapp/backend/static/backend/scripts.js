

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
        newP.className = "state-name";
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

function clearTransitions() {
    let transitions = document.getElementById("transitions");
    transitions.innerHTML = "";
}

// Function that triggers when the button with id "process" is clicked.
// It creates a div for every state (which are the divs with class "state-name")
// and adds them to the div with id "transitions". Each of these divs have an input
// for every terminal symbol, which are read from the input with id "terminals".
function processInput() {
    clearTransitions();
    // Get all states
    let states = document.getElementsByClassName("state-name");
    let terminals = document.getElementById("terminals").value;
    let transitions = document.getElementById("transitions");

    // Delete blank spaces from terminals
    terminals = terminals.replace(/\s/g, "");
    // Split terminals into an array
    terminals = terminals.split(",");

    // Iterate over every state
    // For every state, create a div with class "transition-div" and add it to the
    // transitions div
    for (let i = 0; i < states.length; i++) {
        let state = states[i];
        let transitionDiv = document.createElement("div");
        transitionDiv.className = "transition-div";
        transitionDiv.classList.add("flex", "flex-col", "items-center", "justify-center", "space-y-2");

        // Add a header with the state name to the transition div
        let header = document.createElement("h2");
        header.innerHTML = state.innerHTML;
        transitionDiv.appendChild(header);

        // For each terminal symbol, create div with class "transition-input-div"
        // and add it to the transition div.
        // This div contains a label with the terminal symbol and a select with
        // the states as options.
        // The select has a name that is the state name + the terminal symbol.
        // The label has a for attribute that is the same as the select name.
        // The select has an id that is the same as the select name.
        for (let j = 0; j < terminals.length; j++) {
            let terminal = terminals[j];
            let transitionInputDiv = document.createElement("div");
            transitionInputDiv.className = "transition-input-div";
            transitionInputDiv.classList.add("flex", "flex-row", "items-center", "justify-center", "space-x-2");

            let label = document.createElement("label");
            label.innerHTML = terminal;
            label.htmlFor = state.innerHTML + terminal;

            let select = document.createElement("select");
            select.name = state.innerHTML + terminal;
            select.id = state.innerHTML + terminal;

            // Add an option for every state
            for (let k = 0; k < states.length; k++) {
                let option = document.createElement("option");
                option.value = states[k].innerHTML;
                option.innerHTML = states[k].innerHTML;
                select.appendChild(option);
            }

            transitionInputDiv.appendChild(label);
            transitionInputDiv.appendChild(select);
            transitionDiv.appendChild(transitionInputDiv);
        }
        transitions.appendChild(transitionDiv);

        // Add a divider between every transition div
        if (i < states.length - 1) {
            let divider = document.createElement("hr");
            divider.className = "transition-divider";
            transitions.appendChild(divider);
        }
    }
}


// On page load, call anonymous function that calls changeStates
window.onload = function() {
    let states = document.getElementById("states");
    let minus = document.getElementById("minus");
    let plus = document.getElementById("plus");
    let statesDiv = document.getElementById("states-div");
    let process = document.getElementById("process");


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

    process.addEventListener("click", processInput);
}
