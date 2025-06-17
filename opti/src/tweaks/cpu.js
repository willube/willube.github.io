const { exec } = require('child_process');

function activateCpuPerformanceProfile() {
    // Command to activate CPU performance profile
    const command = 'powercfg /setactive SCHEME_MAX'; // Example command for high performance

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error activating CPU performance profile: ${error.message}`);
            return { success: false, message: 'Failed to activate CPU performance profile.' };
        }
        if (stderr) {
            console.error(`Error output: ${stderr}`);
            return { success: false, message: 'Error occurred while activating CPU performance profile.' };
        }
        console.log(`CPU performance profile activated: ${stdout}`);
        return { success: true, message: 'CPU performance profile activated successfully.' };
    });
}

module.exports = activateCpuPerformanceProfile;