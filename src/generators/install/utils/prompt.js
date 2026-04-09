"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrompt = createPrompt;
const inquirer = require("inquirer");
function createPrompt(projects) {
    return inquirer.prompt({
        name: 'projects',
        type: 'checkbox',
        message: 'Which projects would you want to version independently?',
        choices: projects.map(({ projectName }) => ({
            name: projectName,
            checked: true,
        })),
    });
}
//# sourceMappingURL=prompt.js.map