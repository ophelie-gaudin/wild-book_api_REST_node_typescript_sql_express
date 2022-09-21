"use strict";
/**
 * VERSION WITH MAKER CONTROLLER
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("../utils"));
const repository = utils_1.default.getRepository("Upvote");
const upvotesController = {
    create: async (req, res) => {
        const existingUpvote = await repository.findOne({
            where: {
                skill: { id: req.body.skillId },
                wilder: { id: req.body.wilderId },
            },
        });
        // Check if relationship already exists
        if (existingUpvote !== null) {
            res.json(existingUpvote);
        }
        else {
            const upvote = await repository.save({
                wilder: { id: req.body.wilderId },
                skill: { id: req.body.skillId },
            });
            res.json(upvote);
        }
    },
    increase: async (req, res) => {
        const existingUpvote = await repository.findOneBy({
            id: req.params.upvoteId,
        });
        if (existingUpvote !== null) {
            existingUpvote.counter = Number(existingUpvote.counter) + 1;
            await repository.save(existingUpvote);
            res.json(existingUpvote);
        }
        else {
            // create an error
            throw new Error("This Upvote doesn't exist ! ");
        }
    },
};
exports.default = upvotesController;
