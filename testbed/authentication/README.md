1. add the following to `/etc/hosts`:

    ```
    127.0.0.1			logs.unicon.local grouper-ui.unicon.local grouper-ws.unicon.local idp.unicon.local sp.unicon.local test-app.unicon.local cas.unicon.local shibui.unicon.local mailhog.unicon.local
    127.0.0.1           mq.unicon.local
    ```

2. `docker compose up -d` to start, `docker compose logs -f` to follow logs.

3. Access [https://shibui.unicon.local]. You'll need to accept the self signed certificate
