'use strict';

const { readdirSync, statSync } = require('fs');
const { join } = require('path');
const { spawn } = require('child_process');

const spawnNPMAsync = function(cwd, ...cmd) {
    return new Promise((resolve) => {
        const child = spawn('npm', [...cmd], {
            stdio: [0, 1, 2],
            cwd: cwd,
        });
        child.on('exit', () => {
            resolve();
        });
    });
};

const exec = async function() {
    const elementDir = join(__dirname, '../element');
    const names = readdirSync(elementDir).filter(name => {
        // 过滤掉一些文件，如macOS系统中的.DS_Store等
        const stat = statSync(join(elementDir, name));
        return stat.isDirectory();
    });

    for (let name of names) {
        const dir = join(elementDir, name);
        await spawnNPMAsync(dir, 'install');
        await spawnNPMAsync(dir, 'run', 'build');
    }

};

exec();
