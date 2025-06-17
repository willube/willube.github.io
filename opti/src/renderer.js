const { ipcRenderer } = require('electron');
const ramOptimizer = require('./tweaks/ram');
const servicesOptimizer = require('./tweaks/services');
const gpuOptimizer = require('./tweaks/gpu');
const cpuOptimizer = require('./tweaks/cpu');
const tempFilesCleaner = require('./tweaks/tempfiles');
const autostartManager = require('./tweaks/autostart');

document.getElementById('optimize-ram').addEventListener('click', () => {
    ramOptimizer().then(result => {
        displayStatus('RAM optimization ' + (result ? 'successful' : 'failed'));
    });
});

document.getElementById('disable-services').addEventListener('click', () => {
    servicesOptimizer().then(result => {
        displayStatus('Background services ' + (result ? 'disabled' : 'failed'));
    });
});

document.getElementById('optimize-gpu').addEventListener('click', () => {
    gpuOptimizer().then(result => {
        displayStatus('GPU optimization ' + (result ? 'successful' : 'failed'));
    });
});

document.getElementById('activate-cpu').addEventListener('click', () => {
    cpuOptimizer().then(result => {
        displayStatus('CPU performance profile ' + (result ? 'activated' : 'failed'));
    });
});

document.getElementById('clean-tempfiles').addEventListener('click', () => {
    tempFilesCleaner().then(result => {
        displayStatus('Temporary files ' + (result ? 'deleted' : 'failed'));
    });
});

document.getElementById('manage-autostart').addEventListener('click', () => {
    autostartManager().then(result => {
        displayStatus('Autostart programs ' + (result ? 'managed' : 'failed'));
    });
});

function displayStatus(message) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.classList.add('visible');
    setTimeout(() => {
        statusElement.classList.remove('visible');
    }, 3000);
}