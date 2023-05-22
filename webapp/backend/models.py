
import os
import tempfile
import graphviz as gv

from graphviz import Source
from django.http import HttpResponse

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

        image_data = dfa.pipe()

        # Send the image data as an HTTP response
        response = HttpResponse(content_type='image/png')
        response.write(image_data)
        return response

    def transitions_str(self):
        """
        Convert the CFG to a string.
        """

        string = ""
        string += self.startState + " -> "
        for production in self.rules[self.startState]:
            string += "".join(production) + " | "
            # If startState is a final state, add the empty string
        if self.startState in self.acceptStates:
            string += "eps | "

        # Remove the last bar
        string = string[:-3]
        # Add a newline
        string += "\n"

        for state in self.rules:
            if state == self.startState:
                continue
            # Print in one line per state, separated by bars
            string += state + " -> "
            for production in self.rules[state]:
                string += "".join(production) + " | "
            if state in self.acceptStates:
                string += "eps | "
            # Remove the last bar
            string = string[:-3]
            # Add a newline
            string += "\n"

        # Return the string
        return string

    def displayCFG(self):
        result = self.conversionToCFG()
        s = ""
        #
        for key in result.keys():
            transitions = []
            for i in range(0, len(self.alphabet)):
                transitions.append(result[key][i])
            s += f"{key} -> {' | '.join(transitions)}\n"
        return s
