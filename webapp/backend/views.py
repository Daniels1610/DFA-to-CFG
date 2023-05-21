from django.shortcuts import render
from django.http import JsonResponse
from .models import DFA

import json

def index(request):
    return render(request, 'backend/index.html')

def convertView(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            states = []
            transitions = {}
            for item in data['transitionFunction']:
                states.append(item['state'])
                transitions[item['state']] = item['transitions']

            dfa = DFA(
                states = states,
                alphabet = data['alphabet'],
                startState = data['initialState'],
                acceptStates = data['acceptStates'],
                transitionStates = transitions
            )

            result = dfa.conversionToCFG()
            diagram = dfa.drawDFA()

            # Return result as JSON
            return JsonResponse({'status': 'success', 'result': result, 'diagram': diagram})
        except Exception as e:
            print(e)
            return JsonResponse({'status': 'failed'})

