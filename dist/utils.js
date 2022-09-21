"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Skill_1 = __importDefault(require("./entities/Skill"));
const Upvote_1 = __importDefault(require("./entities/Upvote"));
const Wilder_1 = __importDefault(require("./entities/Wilder"));
const datasource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "./wilders.db",
    synchronize: true,
    entities: [Wilder_1.default, Skill_1.default, Upvote_1.default],
    logging: ["query", "error"],
});
exports.default = datasource;
