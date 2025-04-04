# CS2 Docker Server with RCON

This repository contains a Docker setup for running a Counter-Strike 2 dedicated server with RCON support.

## Prerequisites

- Docker
- Docker Compose
- Steam Game Server Login Token (GSLT) - Get it from [Steam](https://steamcommunity.com/dev/managegameservers)

## Setup

1. Clone this repository:
```bash
git clone <repository-url>
cd cs2-docker
```

2. Edit the `docker-compose.yml` file and set your environment variables:
- `RCON_PASSWORD`: Password for RCON access
- `SERVER_PASSWORD`: Password for joining the server (leave empty for public server)
- `STEAM_ACCOUNT`: Your Steam GSLT token

3. (Optional) Modify the server configuration in `cfg/server.cfg`

## Usage

1. Start the server:
```bash
docker-compose up -d
```

2. Stop the server:
```bash
docker-compose down
```

3. View server logs:
```bash
docker-compose logs -f
```

## Connecting to the Server

- Server IP: `localhost` (or your server's IP address)
- Default port: `27015`
- Connect using the game console: `connect <ip>:27015; password <server_password>`

## RCON Usage

You can use any RCON client that supports Source engine games to connect to the server using:
- Host: `localhost` (or your server's IP)
- Port: `27015`
- Password: The value you set for `RCON_PASSWORD`

## Common RCON Commands

- Change map: `changelevel <map_name>`
- Kick player: `kick <player_name>`
- Ban player: `ban <player_name>`
- List players: `status`
- Set next map: `mp_nextmap <map_name>`

## Troubleshooting

1. If the server fails to start, check:
   - Correct GSLT token
   - Port availability (27015 TCP/UDP)
   - Docker logs for detailed error messages

2. If you can't connect to the server:
   - Verify firewall settings
   - Check if ports are properly forwarded
   - Ensure the server password is correct

## License

This project is open-source and available under the MIT License. 