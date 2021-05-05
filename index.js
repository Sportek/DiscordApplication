"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@discord-factory/core");
core_1.Factory.getInstance().init().then(() => {
    console.log(core_1.Factory.getInstance().$container.events);
});
