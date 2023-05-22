
import io
import base64
from PIL import Image
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
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
            diagram_img = dfa.drawDFA().content

            img_stream = io.BytesIO(diagram_img)
            img_base64 = base64.b64encode(img_stream.getvalue()).decode('utf-8')

            # Return result as JSON
            # with image "diagram" as base64
            data = {
                'status': 'success',
                'result': result,
                'diagram': img_base64,
                'vars': ', '.join(dfa.states),
                'terminals': ', '.join(dfa.alphabet),
                'start': dfa.startState,
                'accept': ', '.join(dfa.acceptStates),
                'transitions': dfa.transitions_str()
            }

            response = HttpResponse(json.dumps(data), content_type='application/json')

            return response
        except Exception as e:
            print(e)
            return JsonResponse({'status': 'failed'})

