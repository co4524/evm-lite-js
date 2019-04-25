function log(message, jsonData) {
    console.log(
        message + '\n' +
        JSON.colorStringify(jsonData, null, 4)
    );
}

function testPrompt(message) {
    let width = process.stdout.columns;
    let lineUnit = '=';
    let line = lineUnit.repeat(width);
    let spaceForCenter = ' '.repeat(~~((width - message.length) / 2));
    console.log(line + '\n' + spaceForCenter + message + '\n' + line);
}

module.exports = {
    log: log,
    testPrompt: testPrompt,
}
