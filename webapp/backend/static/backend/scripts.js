

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

function processAlphabet(alphabet) {
    // Remove spaces from the alphabet
    alphabet = alphabet.replace(/ /g, "");
    // Split the alphabet into an array
    alphabet = alphabet.split(",");

    return alphabet;
}

// Function to get:
// + The states
// + The alphabet
// + The initial state
// + The accept states
// + The transitions
// and store them in a JSON object that is sent to the server to be processed
function generateJSON() {
    let states = document.getElementsByClassName("state-name");
    let alphabet = document.getElementById("terminals").value;
    // Check if there is a radio button checked.
    // If there is, get the state name of the radio button that is checked.
    // If there isn't, alert the user that there is no initial state and return.
    if (document.querySelector('input[name="start-state"]:checked') === null) {
        alert("No hay estado inicial");
        return;
    }
    let initialState = document.querySelector('input[name="start-state"]:checked').nextElementSibling.innerHTML;
    let acceptStates = document.getElementsByName("accept-states");
    let transitions = document.getElementsByClassName("transition-div");

    // Process the alphabet to remove spaces and split it into an array
    alphabet = processAlphabet(alphabet);

    let acceptStatesArray = [];
    for (let i = 0; i < acceptStates.length; i++) {
        if (acceptStates[i].checked) {
            acceptStatesArray.push(acceptStates[i].previousSibling.innerHTML);
        }
    }

    let transitionsArray = [];
    for (let i = 0; i < transitions.length; i++) {
        let transition = transitions[i];
        let transitionObject = {};
        let transitionState = transition.firstChild.innerHTML;

        // Each state has its transitions as select tags with ids "StateTerminal", where State is the state name
        // and Terminal is the terminal that is being transitioned.
        // Get the values of all the select tags that are children of the transition div and store them in an array.
        let currentTransitions = transition.querySelectorAll("select");

        // transitionState is in the form "Desde X:". Get only the X part.
        transitionState = transitionState.substring(6, transitionState.length - 1);
        transitionObject.state = transitionState;
        transitionObject.transitions = [];

        for (let j = 0; j < currentTransitions.length; j++) {
            transitionObject.transitions.push(currentTransitions[j].id[0] + currentTransitions[j].value);
        }

        transitionsArray.push(transitionObject);
    }

    let json = {};
    json.states = states.length;
    json.alphabet = alphabet;
    json.initialState = initialState;
    json.acceptStates = acceptStatesArray;
    json.transitionFunction = transitionsArray;

    console.log(json);

    return json;
}

// Function to retrieve the CSRF token from the cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

async function sendDFA() {
    let json = generateJSON();
    // convertView is declared on index.html to use Django's url template tag
    console.log(convertView);
    const csrfToken = getCookie('csrftoken');
    console.log(csrfTokenn);
    let response = await fetch(convertView, {
        method: "POST",
        // Django needs the csrf token to accept the request

        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfTokenn
        },
        body: JSON.stringify(json)
    });

    let data = await response.json();

    // Show diagram
    const imageBase64 = data.diagram;
    const imgElement = document.getElementById("diagram");
    imgElement.src = "data:image/png;base64," + imageBase64;

    let resultsDiv = document.getElementById("result-div");
    resultsDiv.classList.remove("hidden");

    // Show result
    let result = document.getElementById("result-table");
    let transitionsDiv = document.getElementById("transitions-cfg");

    let vars = data.vars;
    let terminals = data.terminals;
    let startState = data.start;
    let acceptStates = data.accept;
    var transitions = data.transitions;


    // Split transitions into an array
    // Each transition is separated by a newline
    let examples = transitions.split("\n");

    // Replace newlines with <br> tags
    transitions = transitions.replace(/\n/g, "<br>");

    console.log(data);

    let vid = document.getElementById("vars");
    let sid = document.getElementById("start-state");
    let aid = document.getElementById("accept-states");
    let tid = document.getElementById("sigma");

    vid.innerHTML = vars;
    sid.innerHTML = startState;
    aid.innerHTML = acceptStates;
    tid.innerHTML = terminals;

    let spanVars = document.getElementById("vars-span");
    let spanStart = document.getElementById("start-var");
    let listTransitions = document.getElementById("ejemplos-transiciones");

    spanVars.textContent = vars;
    spanStart.textContent = startState;


    // For each transition, create a list item and add it to the list
    // with id "ejemplo-transiciones"
    // Maximum of 4 transitions
    console.log(examples);
    let n = examples.length > 4 ? 4 : examples.length;
    for (let i = 0; i < n; i++) {
        if (examples[i] === "") {
            continue;
        }
        let li = document.createElement("li");
        li.innerHTML = examples[i];
        listTransitions.appendChild(li);
    }

    transitionsDiv.innerHTML = transitions;

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
    let generate = document.getElementById("generate");

    // Delete blank spaces from terminals and split it into an array
    terminals = processAlphabet(terminals);

    // If terminals is empty, add an error message to the transitions div
    // and return
    if (terminals.length === 1) {
        let errorMessage = document.createElement("p");
        errorMessage.className = "error-message";
        errorMessage.classList.add("text-red-500", "text-center", "text-xl");
        errorMessage.innerHTML = "No se ha ingresado un alfabeto";
        transitions.appendChild(errorMessage);
        generate.classList.add("invisible");
        return;
    }

    // If states is empty, add an error message to the transitions div
    // and return
    if (states.length === 0) {
        let errorMessage = document.createElement("p");
        errorMessage.className = "error-message";
        errorMessage.classList.add("text-red-500", "text-center", "text-xl");
        errorMessage.innerHTML = "No se ha ingresado ningún estado";
        transitions.appendChild(errorMessage);
        generate.classList.add("invisible");
        return;
    }

    // If terminals contains an empty string, add an error message to the transitions div
    // and return
    for (let i = 0; i < terminals.length; i++) {
        if (terminals[i] === "") {
            let errorMessage = document.createElement("p");
            errorMessage.className = "error-message";
            errorMessage.classList.add("text-red-500", "text-center", "text-xl");
            errorMessage.innerHTML = "El alfabeto contiene un símbolo vacío";
            transitions.appendChild(errorMessage);
        generate.classList.add("invisible");
            return;
        }
    }


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
        header.innerHTML = "Desde " + state.innerHTML + ":";
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
            select.id = terminal + state.innerHTML;

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

    generate.classList.remove("invisible");
}


// On page load, call anonymous function that calls changeStates
window.onload = function() {
    let states = document.getElementById("states");
    let minus = document.getElementById("minus");
    let plus = document.getElementById("plus");
    let statesDiv = document.getElementById("states-div");
    let process = document.getElementById("process");
    let generate = document.getElementById("generate");

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
    generate.addEventListener("click", sendDFA);
}
