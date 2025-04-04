FROM ubuntu:22.04

# Install required dependencies
RUN apt-get update && \
    apt-get install -y \
    lib32gcc-s1 \
    curl \
    wget \
    ca-certificates \
    software-properties-common \
    locales \
    && rm -rf /var/lib/apt/lists/*

# Set locale
RUN locale-gen en_US.UTF-8
ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

# Create steam user and set up directories
RUN useradd -m steam
WORKDIR /home/steam

# Install SteamCMD
RUN mkdir -p /home/steam/steamcmd && \
    cd /home/steam/steamcmd && \
    wget https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz && \
    tar -xvzf steamcmd_linux.tar.gz && \
    rm steamcmd_linux.tar.gz

# Create CS2 server directory
RUN mkdir -p /home/steam/cs2-server

# Add steam user to required groups and set permissions
RUN chown -R steam:steam /home/steam

# Switch to steam user
USER steam

# Install CS2 server
RUN /home/steam/steamcmd/steamcmd.sh +force_install_dir /home/steam/cs2-server \
    +force_install_dir /home/steam/cs2-server \
    +login anonymous \
    +app_update 730 validate \
    +quit && \
    /home/steam/cs2-server/game/bin/linuxsteamrt64/cs2 -dedicated

# Copy server configuration
COPY --chown=steam:steam ./cfg /home/steam/cs2-server/game/csgo/cfg/

# Expose required ports
EXPOSE 27015/tcp 27015/udp 27020/tcp 27020/udp

# Set entry point
COPY --chown=steam:steam ./start.sh /home/steam/start.sh
RUN chmod +x /home/steam/start.sh

ENTRYPOINT ["/home/steam/start.sh"] 