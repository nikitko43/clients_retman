from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views import View

from retman_api.models import Customer
from retman_crm.forms import LoginForm, CustomerCreateForm, VisitationCreateForm, MembershipCreateForm, \
    FreezeForm, NotesForm


class RetmanLoginView(LoginView):
    template_name = 'login.html'
    form_class = LoginForm
    redirect_authenticated_user = True

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['form_action'] = reverse('retman_crm:login')
        return data

    def get_success_url(self):
        return reverse('retman_crm:dashboard')


class DashboardView(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'dashboard'

    def get(self, request):
        data = {}
        data.update({'customer_form': CustomerCreateForm()})
        data.update({'visitation_form': VisitationCreateForm()})
        return render(request, 'dashboard.html', data)


class CustomerView(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'dashboard'

    def get(self, request, customer_id):
        data = {}
        visitation_form = VisitationCreateForm()
        data.update({'visitation_form': visitation_form})
        membership_form = MembershipCreateForm()
        data.update({'membership_form': membership_form})
        freeze_form = FreezeForm()
        data.update({'freeze_form': freeze_form})
        notes_form = NotesForm()
        data.update({'notes_form': notes_form})
        data.update({'name': Customer.objects.get(pk=customer_id).full_name})
        return render(request, 'customer.html', data)


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


class StatsView(LoginRequiredMixin, View):
    login_url = '/login/'

    def get(self, request):
        return render(request, 'stats.html')


class ActivityView(LoginRequiredMixin, View):
    login_url = '/login/'

    def get(self, request):
        return render(request, 'activity.html')

