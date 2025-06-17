export function manageAutostart(appName, action) {
    const { exec } = require('child_process');

    let command;

    if (action === 'enable') {
        command = `powershell -Command "Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' -Name '${appName}' -Value 'C:\\Path\\To\\Your\\App.exe'"`;
    } else if (action === 'disable') {
        command = `powershell -Command "Remove-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' -Name '${appName}'"`;
    } else {
        return Promise.reject(new Error('Invalid action. Use "enable" or "disable".'));
    }

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${stderr}`);
            } else {
                resolve(`Successfully ${action}d ${appName} on startup.`);
            }
        });
    });
}