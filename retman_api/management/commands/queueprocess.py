import json

from django.core.management.base import BaseCommand

import asyncio

from aio_pika import connect
from channels.layers import get_channel_layer
from django.conf import settings

from retman_api.db_queries import check_label_timeout, create_recognition_result


async def process_recognition_result(message):
    channel_layer = get_channel_layer()
    label = message['label']
    guid = message['guid']
    print(f'received {label} {guid}', flush=True)
    if label is None or await check_label_timeout(label) and label != 0:
        message['image_url'] = '/recognition/static/' + message['image_path']
        await create_recognition_result(message)
        await channel_layer.group_send('notifications', {'type': 'recognition_notification', 'message': message})


async def get_face_recognition_messages():
    event_loop = asyncio.get_event_loop()
    connection = await connect(settings.RABBITMQ_URL, loop=event_loop)
    print('started', flush=True)

    async with connection:
        channel = await connection.channel()
        queue = await channel.declare_queue("face_recognition")

        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    await process_recognition_result(json.loads(message.body))


class Command(BaseCommand):
    channel_layer = get_channel_layer()

    def handle(self, *args, **options):
        asyncio.run(get_face_recognition_messages())
