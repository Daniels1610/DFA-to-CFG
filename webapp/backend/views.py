from django.shortcuts import render

def index(request):
    return render(request, 'backend/index.html')

def convertView(request):
    if request.method == 'POST':
        data = request.json()  # Get the JSON data from the request body
        # Process the data as needed
        response_data = {
            'message': 'Data received successfully',
            'data': data,
        }
        return JsonResponse(response_data)
