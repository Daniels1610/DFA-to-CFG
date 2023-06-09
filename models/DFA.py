class DFA:
    states = []
    alphabet = []
    transitionStates = []
    startState = ""
    acceptState = []
    
    def __init__(self, states:list, alphabet:list, transitionStates:list, startState:str, acceptState:list):
        self.states = states
        self.alphabet = alphabet
        self.transitionStates = transitionStates
        self.startState = startState
        self.acceptState = acceptState

    def getDefinitionDFA(self):
        return {
            "states" : self.states,
            "alphabet" : self.alphabet,
            "transitionStates" : self.transitionStates,
            "startState" : self.startState,
            "acceptState" : self.acceptState
        }

    def conversionToCFG(self, transitionStates:list):
        rules = {}
        for transition in transitionStates:
            rules[transition[0]] = []

        for transition in transitionStates:
            rules[transition[0]].append(f"{transition[1]}{transition[2]}") 

        return rules
    
    def displayCFG(self):
        result = self.conversionToCFG(self.transitionStates) 
        for key in result.keys():
            transitions = []
            for i in range(0, len(self.alphabet)):
                transitions.append(result[key][i])
            print(f"{key} -> {' | '.join(transitions)}")
    
                