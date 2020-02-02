from django.contrib import admin

# Register your models here.
from retman_api.models import MembershipType, Membership, Customer, Trainer, Visitation

admin.site.register(MembershipType)
admin.site.register(Membership)
admin.site.register(Customer)
admin.site.register(Trainer)
admin.site.register(Visitation)