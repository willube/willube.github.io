module.exports = function deleteTempFiles() {
    const { exec } = require('child_process');

    exec('del /q/f/s %TEMP%\\*', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error deleting temporary files: ${error.message}`);
            return { success: false, message: 'Failed to delete temporary files.' };
        }
        if (stderr) {
            console.error(`Error output: ${stderr}`);
            return { success: false, message: 'Failed to delete temporary files.' };
        }
        console.log(`Temporary files deleted: ${stdout}`);
        return { success: true, message: 'Temporary files deleted successfully.' };
    });
};