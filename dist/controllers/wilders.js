"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wildersController = void 0;
const utils_1 = __importDefault(require("../utils"));
const Wilder_1 = __importDefault(require("../entities/Wilder"));
const Skill_1 = __importDefault(require("../entities/Skill"));
const Upvote_1 = __importDefault(require("../entities/Upvote"));
const typeorm_1 = require("typeorm");
// import { In } from "typeorm";
const repository = utils_1.default.getRepository(Wilder_1.default);
const skillRepository = utils_1.default.getRepository(Skill_1.default);
const upvoteRepository = utils_1.default.getRepository(Upvote_1.default);
exports.wildersController = {
    create: async (req, res) => {
        // //* 1st METHOD : lancer les requêtes via TypeORM
        try {
            const data = await repository.save(req.body);
            console.log("Wilder created");
            res.json(data);
        }
        catch (err) {
            console.error("CREATE Error:", err);
            res.json({ success: false });
        }
    },
    findAll: async (req, res) => {
        try {
            const wilders = await repository.find({
                relations: ["upvotes", "upvotes.skill"],
            });
            res.json(wilders);
        }
        catch (err) {
            console.error("FINDALL Error :", err);
            res.json({ success: false });
        }
    },
    find: async (req, res) => {
        try {
            const wilderId = req.params.wilderId;
            const wilder = await repository.findOneBy({ id: Number(wilderId) });
            res.json(wilder);
        }
        catch (err) {
            console.error("FIND Error :", err);
            res.json({ success: false });
        }
    },
    update: async (req, res) => {
        const wilderId = req.params.wilderId;
        const wilder = await repository.findOneBy({ id: Number(wilderId) });
        if (wilder !== null) {
            // Object.assign permet de modifier un objet existant
            // on aurait aussi pu faire : wilder.name = req.body.name;
            Object.assign(wilder, req.body);
            try {
                const updatedWilder = await repository.save(wilder);
                res.json(updatedWilder);
            }
            catch (err) {
                console.error("UPDATE: Error when saving:", err);
                res.json({ success: false });
            }
        }
    },
    delete: async (req, res) => {
        const wilderId = req.params.wilderId;
        try {
            const wilder = await repository.findOneBy({ id: Number(wilderId) });
            if (wilder !== null) {
                try {
                    await repository.remove(wilder);
                    res.json({ success: true });
                }
                catch (err) {
                    console.error("DELETE Error:", err);
                    res.json({ success: false });
                }
            }
        }
        catch (err) {
            console.error("DELETE Error when finding", err);
            res.json({ success: false });
        }
    },
    addSkills: async (req, res) => {
        try {
            const skillsIds = req.body.skillsIds;
            const wilderId = Number(req.params.wilderId);
            const newUpvotesArray = [];
            skillsIds.forEach((skillId) => {
                newUpvotesArray.push({
                    wilder: { id: wilderId },
                    skill: { id: skillId },
                    counter: 0,
                });
            });
            const newUpvotes = await upvoteRepository.save(newUpvotesArray);
            res.json(newUpvotes);
        }
        catch (err) {
            console.log(err);
            res.send("Error while adding skill to wilder");
        }
    },
    findAllSkills: async (req, res) => {
        try {
            // const wilderUpvotes = await upvoteRepository.find({
            //   where: { wilder: { id: Number(req.params.wilderId) } },
            //   relations: ["skill"],
            // });
            // * Ici, je vais récupérer la skill contenue dans chaque upvote qui a pour wilder.id req.params.wilderId
            // Attention, ici on n'a cependant pas le upvote.counter pour chaque skill du wilder
            const wilderSkills = await skillRepository.find({
                where: { upvotes: { wilder: { id: Number(req.params.wilderId) } } },
            });
            if (wilderSkills !== null) {
                console.log(`Skills of Wilder id = ${req.params.wilderId} :`, JSON.stringify(wilderSkills, null, 4));
                res.json(wilderSkills);
            }
        }
        catch (err) {
            console.log(err);
            res.send("Error while seeing wilder's skills");
        }
    },
    deleteSkills: async (req, res) => {
        try {
            const skillsIdsArray = req.body.skillsIds;
            const wilderId = Number(req.params.wilderId);
            console.log("Req.body: ", req.body);
            console.log("skillsIdsArray", skillsIdsArray);
            console.log("wilderId", wilderId);
            await upvoteRepository.delete({
                wilder: { id: wilderId },
                skill: { id: (0, typeorm_1.In)(skillsIdsArray) },
            });
            res.json({ success: true });
        }
        catch (err) {
            console.log(err);
            res.send("Error while deleting wilder's skills");
        }
    },
};
exports.default = exports.wildersController;
