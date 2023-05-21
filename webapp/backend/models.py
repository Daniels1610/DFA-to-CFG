class DFA:
    states = []
    alphabet = []
    transitionStates = []
    startState = ""
    acceptState = []
    
    def __init__(self, states:list, alphabet:list, transitionStates:list, startState:str, acceptStates:list):
        self.states = states
        self.alphabet = alphabet
        self.transitionStates = transitionStates
        self.startState = startState
        self.acceptStates = acceptStates

    def getDefinitionDFA(self):
        return {
            "states" : self.states,
            "alphabet" : self.alphabet,
            "transitionStates" : self.transitionStates,
            "startState" : self.startState,
            "acceptStates" : self.acceptStates
        }

    def conversionToCFG(self):
        rules = {}
        for transition in self.transitionStates:
            rules[transition[0]] = []

        for transition in self.transitionStates:
            rules[transition[0]].append(f"{transition[0]}{transition[1]}")

        return rules
