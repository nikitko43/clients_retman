from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views import View

from retman_api.models import Customer
from retman_api.forms import LoginForm


class RetmanLoginView(LoginView):
    template_name = 'login.html'
    form_class = LoginForm
    redirect_authenticated_user = True

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['form_action'] = reverse('frontend:login')
        return data

    def get_success_url(self):
        return reverse('frontend:dashboard')


class RetmanLogoutView(LogoutView):
    next_page = '/login/'


class DashboardView(LoginRequiredMixin, View):
    login_url = '/login/'

    def get(self, request):
        return render(request, 'frontend/dashboard.html')


class CustomerView(LoginRequiredMixin, View):
    login_url = '/login/'

    def get(self, request, pk):
        data = {'name': Customer.objects.get(pk=pk).full_name}
        return render(request, 'frontend/customer.html', data)


class ActivityView(LoginRequiredMixin, View):
    login_url = '/login/'

    def get(self, request):
        return render(request, 'frontend/activity.html')


class RedirectToCustomerView(View):
    def post(self, request):
        try:
            customer = Customer.objects.get(card_id=request.POST['card_id'])
            return redirect('/customer/' + str(customer.id))
        except:
            customer = Customer.objects.filter(full_name__istartswith=str(request.POST['card_id']))
            if len(customer) == 1:
                return redirect('/customer/' + str(customer[0].id))
            return redirect('/dashboard/')


class TrainersView(LoginRequiredMixin, View):
    login_url = '/login/'

    def get(self, request):
        return render(request, 'frontend/trainers.html')


class StatsView(LoginRequiredMixin, View):
    login_url = '/login/'

    def get(self, request):
        context = {}
        if request.user.has_perm('retman_api.can_see_stats'):
            context['can_see_stats'] = True
        return render(request, 'frontend/stats.html', context)
