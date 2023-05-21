from django.urls import path

from . import views

app_name = 'landing'
urlpatterns = [
    path('', views.index, name='main'),
    path('convertView', views.convertView, name='convertView'),
]
