from models.DFA import DFA

def getInputDFA():
    file = open('assets/input.txt', 'r')
    definitionDFA = []
    for line in file.readlines():
        definitionDFA.append(list(line.strip().split(',')))
    return definitionDFA

if __name__ == "__main__":
    inputDFA = getInputDFA()
    myDFA = DFA(
        states=inputDFA[0],
        alphabet=inputDFA[1],
        transitionStates=inputDFA[4:],
        startState=inputDFA[2],
        acceptState=inputDFA[3]
    )
    
    # print(myDFA.getDefinitionDFA())
    result = myDFA.conversionToCFG(myDFA.transitionStates) 
    for key in result.keys():
        transitions = []
        for i in range(0, len(myDFA.alphabet)):
            transitions.append(result[key][i])
        print(f"{key} -> {' | '.join(transitions)}")
        