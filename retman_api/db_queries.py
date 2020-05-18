from datetime import datetime
from datetime import timedelta

from channels.db import database_sync_to_async
from django.conf import settings

from retman_api.models import RecognitionResult


@database_sync_to_async
def check_label_timeout(label):
    timeout = settings.LABEL_TIMEOUT
    datetime_with_timeout = datetime.now() - timedelta(seconds=timeout)
    return not RecognitionResult.objects.filter(datetime__gt=datetime_with_timeout, card_id=label).exists()


@database_sync_to_async
def create_recognition_result(result):
    RecognitionResult.objects.create(card_id=result['label'], guid=result['guid'], url=result['image_url'])


@database_sync_to_async
def save_card_result(result):
    RecognitionResult.objects.filter(guid=result['guid']).update(card_id=result['label'])


@database_sync_to_async
def get_untrained_result():
    return RecognitionResult.objects.filter(card_id__isnull=True).first()


@database_sync_to_async
def delete_result(data):
    RecognitionResult.objects.filter(guid=data['guid']).delete()
