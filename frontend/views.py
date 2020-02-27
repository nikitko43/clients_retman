from django.shortcuts import render

from retman_api.models import Customer


def dashboard(request):
    return render(request, 'frontend/dashboard.html')


def customer(request, pk):
    data = {'name': Customer.objects.get(pk=pk).full_name}
    return render(request, 'frontend/customer.html', data)