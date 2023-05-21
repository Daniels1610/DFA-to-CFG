import graphviz as gv

class DFA:
    states = []
    alphabet = []
    transitionStates = []
    startState = ""
    acceptState = []
    
    def __init__(self, states:list, alphabet:list, transitionStates:dict, startState:str, acceptStates:list):
        self.states = states
        self.alphabet = alphabet
        self.transitionStates = transitionStates
        self.startState = startState
        self.acceptStates = acceptStates
        self.rules = {}

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
        for var in self.transitionStates:
            rules[var] = []

        for var, transition in self.transitionStates.items():
            rules[var] = transition

        self.rules = rules

        return rules

    def drawDFA(self):
        """
        Draw DFA using graphviz
        """
        dfa = gv.Digraph(format='png')
        dfa.attr(rankdir='LR')
        dfa.attr('node', shape='circle')
        dfa.node('qi', shape='point')
        dfa.node(self.startState)

        # Edge to start state
        dfa.edge('qi', self.startState)

        # Draw states
        for state in self.states:
            if state not in self.acceptStates:
                dfa.node(state)

        # Draw accept states
        for state in self.acceptStates:
            dfa.node(state, shape='doublecircle')

        # Draw transitions
        for state, transitions in self.rules.items():
            for transition in transitions:
                dfa.edge(state, transition[1], label=transition[0])
        dfa.render('webapp/static/dfa.gv', view=False)
        return dfa
