const { exec } = require('child_process');

function optimizeRAM() {
    exec('echo 3 > /proc/sys/vm/drop_caches', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error optimizing RAM: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error output: ${stderr}`);
            return;
        }
        console.log(`RAM optimization successful: ${stdout}`);
    });
}

module.exports = optimizeRAM;