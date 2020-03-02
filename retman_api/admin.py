from django.contrib import admin

# Register your models here.
from retman_api.models import MembershipType, Membership, Customer, Trainer, Visitation


class MembershipAdmin(admin.ModelAdmin):
    search_fields = ['customer__full_name', 'customer__card_id']


admin.site.register(MembershipType)
admin.site.register(Membership, MembershipAdmin)
admin.site.register(Customer)
admin.site.register(Trainer)
admin.site.register(Visitation)
