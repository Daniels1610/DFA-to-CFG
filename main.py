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
    
    print(myDFA.getDefinitionDFA())
    print(myDFA.conversionToCFG(myDFA.transitionStates))
    


    
