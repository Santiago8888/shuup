from django.db import models
from shuup.core import models as shuup_models

class DataOrder(models.Model):
    order = models.OneToOneField(shuup_models.Order)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    test_field = models.CharField(max_length=10)
