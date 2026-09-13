const fs = require("fs-extra");
const path = require("path");
const statePath = path.join(__dirname, "..", "botstate.json");

function getState() {
    try {
        return fs.readJsonSync(statePath);
    } catch {
        return { on: true, allowedUser: null };
    }
}

function setState(state) {
    fs.writeJsonSync(statePath, state);
}

module.exports = { getState, setState };
