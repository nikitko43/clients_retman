from channels.auth import AuthMiddlewareStack
from channels.routing import URLRouter, ProtocolTypeRouter
import retman_api.routing


application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            retman_api.routing.websocket_urlpatterns
        )
    ),
})

