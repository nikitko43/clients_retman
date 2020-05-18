import asyncio
import json

from aio_pika import connect, Message
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings

from retman_api.db_queries import get_untrained_result, delete_result, save_card_result


class NotificationsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            'notifications',
            self.channel_name
        )
        await self.accept()

        untrained_result = await get_untrained_result()
        if untrained_result:
            message = {'guid': untrained_result.guid, 'label': untrained_result.card_id,
                       'image_url': untrained_result.url}

            await self.channel_layer.group_send('notifications',
                                                {'type': 'recognition_notification', 'message': message})

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            'notifications',
            self.channel_name
        )

    async def receive(self, text_data):
        event_loop = asyncio.get_event_loop()
        connection = await connect(settings.RABBITMQ_URL, loop=event_loop)
        channel = await connection.channel()

        data = json.loads(text_data)

        if data['label'] is None:
            await delete_result(data)
        else:
            await save_card_result(data)

        await channel.default_exchange.publish(
            Message(bytes(text_data, 'utf-8')), routing_key="face_recognition_train",
        )

        await connection.close()

    async def recognition_notification(self, event):
        message = event['message']

        await self.send(text_data=json.dumps(message))
