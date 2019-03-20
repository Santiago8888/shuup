from shuup.core import models as shuup_models
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render
from django.core import serializers
from . import models
import requests
import threading

url = 'https://nominatim.openstreetmap.org/search?q=' 
url_end = '&format=json&polygon=1&addressdetails=1'

def geocode():
    Orders = shuup_models.Order.objects.all()
    for order in Orders:
        data_order, created = models.DataOrder.objects.get_or_create(order = order)
        if created:
            address = str(order.shipping_address.street) + '+' + str(order.shipping_address.city) + '+' + str(order.shipping_address.country)
            r = requests.get(url + address + url_end)
            data = r.json()[0]
            data_order.latitude = data['lat']
            data_order.longitude = data['lon']
            data_order.save()

def index(request):
    data = []
    component = 'shuup_data/js/dist/index.js'
    template = 'classic_gray/shuup/front/data.jinja'
    data_orders = models.DataOrder.objects.all()
    for order in data_orders:
        data.append({'COORDINATES':[order.longitude, order.latitude]})
    threading.Thread(target=geocode).start()
    props = { 'data': data }
    context = {
        'component': component,
        'props': props,
    }
    return render(request, template, context)
