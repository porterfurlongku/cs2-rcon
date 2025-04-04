#!/bin/bash

cd /home/steam/cs2-server

# Start CS2 server with RCON enabled
./game/bin/linuxsteamrt64/cs2 -dedicated \
    -console \
    -usercon \
    +game_type 0 \
    +game_mode 1 \
    +map de_dust2 \
    +rcon_password "${RCON_PASSWORD}" \
    +sv_password "${SERVER_PASSWORD}" \
    +sv_setsteamaccount "${STEAM_ACCOUNT}" \
    +sv_lan 0 \
    +ip 0.0.0.0 \
    -port 27015 