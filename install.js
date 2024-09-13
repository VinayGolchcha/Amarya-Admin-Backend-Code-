import { execSync } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';

const installConda = async () => {
    const platform = os.platform();
    console.log("platform:", platform);
    console.log("Directory:", os.homedir());
    console.log('Checking for Conda installation...');
    try {
        execSync('conda --version', { stdio: 'pipe' });
        console.log('Conda is already installed.');
    } catch (error) {
        console.log('Conda is not installed. Installing Miniconda...');

        let installerUrl, installerPath, condaPath;


        if (platform === 'win32') {
            installerUrl = 'https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe';
            installerPath = path.join(os.tmpdir(), 'Miniconda3-latest-Windows-x86_64.exe');
            condaPath = path.join(os.homedir(), 'Miniconda3', 'Scripts', 'conda.exe');
        } else if (platform === 'darwin') {
            installerUrl = 'https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh';
            installerPath = path.join(os.tmpdir(), 'Miniconda3-latest-MacOSX-x86_64.sh');
            condaPath = path.join(os.homedir(), 'miniconda3', 'bin', 'conda');
        } else if (platform === 'linux') {
            installerUrl = 'https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh';
            installerPath = path.join(os.tmpdir(), 'Miniconda3-latest-Linux-x86_64.sh');
            condaPath = path.join(os.homedir(), 'miniconda3', 'bin', 'conda');
        } else {
            throw new Error(`Unsupported platform: ${platform}`);
        }

        // Download and install Miniconda
        execSync(`curl -o ${installerPath} ${installerUrl}`, { stdio: 'inherit' });
        if (platform === 'win32') {
            execSync(`start /wait "" "${installerPath}" /InstallationType=JustMe /AddToPath=1 /RegisterPython=1 /S /D=${path.join(os.homedir(), 'Miniconda3')}`, { stdio: 'inherit' });
        } else {
            execSync(`bash ${installerPath} -b -p ${path.join(os.homedir(), 'miniconda3')}`, { stdio: 'inherit' });
        }
        console.log('Miniconda installed successfully.');

        // Add Miniconda to PATH
        process.env.PATH = `${path.dirname(condaPath)}${path.delimiter}${process.env.PATH}`;
        console.log(`Miniconda added to PATH: ${condaPath}`);
    }
};


const setupEnvironment = async () => {
    console.log('Creating/Updating Conda environment...');
    try {
        // Use the correct conda command based on the platform
        const condaCommand = os.platform() === 'win32' ? 'conda.bat' : 'conda';
        const condaPath = path.join(os.homedir(), os.platform() === 'win32' ? 'Miniconda3' : 'miniconda3', 'bin', condaCommand); // Changed 'condabin' to 'bin'
        console.log(`Using Conda at: ${condaPath}`);
        // Check if Conda binary exists
        if (!fs.existsSync(condaPath)) {
            throw new Error(`Conda binary not found at ${condaPath}. Please check the Conda installation.`);
        }

        // Use the full path to conda
        console.log(`Using Conda at: ${condaPath}`);
        const envList = execSync(`${condaPath} env list`).toString();

        if (envList.includes('conda_env')) {
            console.log('Conda environment "conda_env" already exists. Updating...');
            execSync(`${condaPath} env update -f environment.yml`, { stdio: 'inherit' });
        } else {
            console.log('Creating new Conda environment "conda_env"...');
            execSync(`${condaPath} env create -f environment.yml`, { stdio: 'inherit' });
        }

        console.log('Conda environment created/updated successfully.');

        // Activating the environment manually for Linux-based systems
        if (os.platform() !== 'win32') {
            console.log('Activating Conda environment for Linux...');
            const activateScript = path.join(os.homedir(), 'miniconda3', 'bin', 'activate');
            const command = `source ${activateScript} conda_env && echo "Conda environment activated."`;
            execSync(command, { stdio: 'inherit', shell: '/bin/bash' });
        } else {
            console.log('Activating Conda environment for Windows...');
            execSync(`${condaPath} activate conda_env`, { stdio: 'inherit' });
        }

    } catch (error) {
        console.error(`Error setting up environment: ${error.message}`);
    }
};


export { installConda, setupEnvironment };
