export default function disableServices() {
    const { exec } = require('child_process');

    // Disable Cortana
    exec('sc config "Cortana" start= disabled', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error disabling Cortana: ${stderr}`);
            return { success: false, message: 'Failed to disable Cortana.' };
        }
        console.log('Cortana disabled successfully.');
    });

    // Disable Telemetry
    exec('sc config "DiagTrack" start= disabled', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error disabling Telemetry: ${stderr}`);
            return { success: false, message: 'Failed to disable Telemetry.' };
        }
        console.log('Telemetry disabled successfully.');
    });

    // Add more services to disable as needed
    return { success: true, message: 'Unnecessary background services disabled successfully.' };
}