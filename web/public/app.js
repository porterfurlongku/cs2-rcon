// Connect to WebSocket server
const socket = io();

// DOM Elements
const playerCountElement = document.querySelector('#playerCount span');
const presetButtonsContainer = document.getElementById('presetButtons');
const customCommandInput = document.getElementById('customCommand');
const consoleOutput = document.getElementById('consoleOutput');

// Update player count
socket.on('playerCount', (count) => {
    playerCountElement.textContent = count;
});

// Handle preset commands
socket.on('presetCommands', (presets) => {
    presetButtonsContainer.innerHTML = '';
    Object.entries(presets).forEach(([label, command]) => {
        const button = document.createElement('button');
        button.className = 'bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-left';
        button.textContent = label;
        button.onclick = () => sendCommand(command);
        presetButtonsContainer.appendChild(button);
    });
});

// Handle command responses
socket.on('commandResponse', ({ command, response, error }) => {
    const timestamp = new Date().toLocaleTimeString();
    const commandDiv = document.createElement('div');
    commandDiv.className = 'mb-2';

    // Command sent
    const commandText = document.createElement('div');
    commandText.className = 'text-blue-400';
    commandText.textContent = `[${timestamp}] > ${command}`;
    commandDiv.appendChild(commandText);

    // Response or error
    const responseText = document.createElement('div');
    responseText.className = error ? 'text-red-400' : 'text-green-400';
    responseText.textContent = error || response || 'Command executed successfully';
    commandDiv.appendChild(responseText);

    consoleOutput.appendChild(commandDiv);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
});

// Send custom command
function sendCustomCommand() {
    const command = customCommandInput.value.trim();
    if (command) {
        sendCommand(command);
        customCommandInput.value = '';
    }
}

// Send command to server
function sendCommand(command) {
    socket.emit('rconCommand', command);
}

// Handle Enter key in custom command input
customCommandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendCustomCommand();
    }
});

// Auto-reconnect on connection loss
socket.on('disconnect', () => {
    console.log('Disconnected from server. Attempting to reconnect...');
});

socket.on('connect', () => {
    console.log('Connected to server');
}); 