"use strict";
/**
 * VERSION WITH MAKER CONTROLLER
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const datasource = require("../utils");
// const repository = datasource.getRepository("Skill");
// module.exports = makeController({ entityName: "skill" });
const utils_1 = __importDefault(require("../utils"));
const repository = utils_1.default.getRepository("Skill");
exports.default = {
    create: async (req, res) => {
        try {
            const skillCreated = await repository.query("INSERT INTO skill(name) VALUES (?)", [req.body.name]);
            const data = await repository.query("SELECT * FROM skill WHERE id=?", [
                skillCreated.id,
            ]);
            console.log("Skill created");
            res.json(data[0]);
        }
        catch (err) {
            console.error("CREATE Error:", err);
            res.json({ success: false });
        }
    },
    findAll: async (req, res) => {
        const data = await repository.find();
        res.json(data);
    },
    find: async (req, res) => {
        try {
            const skillId = req.params.skillId;
            const data = await repository.findOneBy({ id: skillId });
            res.json(data);
        }
        catch (err) {
            console.error("FIND Error :", err);
            res.json({ success: false });
        }
    },
    update: async (req, res) => {
        try {
            const skillId = req.params.skillId;
            const skillToUpdate = await repository.findOneBy({ id: skillId });
            // Object.assign permet de modifier un objet existant
            // on aurait aussi pu faire : skill.name = req.body.name;
            try {
                if (skillToUpdate !== null) {
                    const skillUpdated = Object.assign(skillToUpdate, req.body);
                    await repository.save(skillUpdated);
                    res.json(skillUpdated);
                }
            }
            catch (err) {
                console.error("UPDATE: Error when saving:", err);
                res.json({ success: false });
            }
        }
        catch (err) {
            console.error("UPDATE Error when finding:", err);
            res.json({ success: false });
        }
    },
    delete: async (req, res) => {
        const skillId = Number(req.params.skillId);
        const skillToDelete = await repository.findOneBy({ id: skillId });
        if (skillToDelete !== null) {
            try {
                await repository.remove(skillToDelete);
                res.json({ success: true });
            }
            catch (err) {
                console.error("DELETE Error:", err);
                res.json({ success: false });
            }
        }
    },
};
