from django import forms
from django.contrib.auth.forms import AuthenticationForm, UsernameField

from retman_api.models import Customer, Visitation, Membership, Cost


class LoginForm(AuthenticationForm):
    username = UsernameField(max_length=64,
                             widget=forms.TextInput(attrs={'autofocus': True, 'class': 'form-control', 'placeholder': "Введите имя пользователя"}))
    password = forms.CharField(
        label='Пароль',
        strip=False,
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': "Введите пароль"})
    )


class VisitationCreateForm(forms.ModelForm):
    class Meta:
        model = Visitation
        exclude = ('customer', 'came_at', 'left_at')
        widgets = {
            'type': forms.RadioSelect(),
            'note': forms.Textarea(),
        }


class CustomerCreateForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = '__all__'


class MembershipCreateForm(forms.ModelForm):
    class Meta:
        model = Membership
        exclude = ('customer', 'expiration_date')


class CostCreateForm(forms.ModelForm):
    class Meta:
        model = Cost
        fields = '__all__'


class NotesForm(forms.Form):
    notes = forms.CharField(widget=forms.Textarea, required=False)


class FreezeForm(forms.Form):
    days = forms.IntegerField()