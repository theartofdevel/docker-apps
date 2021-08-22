// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const is = require("electron-is")


window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }

    document.getElementById("btn").addEventListener('click', () => {
        const process = require('child_process');

        const outputElement = document.getElementById("output")

        let osDetect;
        if (is.windows()) {
            osDetect = "Windows Detected"
        } else if (is.macOS()) {
            osDetect = "macOS Detected"
        } else if (is.linux()) {
            osDetect = "Linux Detected"
        } else {
            osDetect = "Unknown OS"
        }
        outputElement.value += osDetect + '\n'

        const cmd = "./test.sh"

        let child = process.spawn(cmd);

        child.on('error', function (err) {
            outputElement.value += 'error: ' + err + '\n'
            console.error(err)
        })

        child.stdout.on('data', function (data) {
            outputElement.value += data + '\n'
        })

        child.stderr.on('data', function (data) {
            outputElement.value += 'stderr:' + data + '\n'
        })

        child.on('close', function (code) {
            outputElement.value += 'exit code: ' + code
        })

    })
})