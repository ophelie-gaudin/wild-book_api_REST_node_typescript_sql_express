/**
 * VERSION WITH MAKER CONTROLLER
 */

// const datasource = require("../utils");

// const repository = datasource.getRepository("Skill");

// module.exports = makeController({ entityName: "skill" });

import { Request, Response } from "express";
import datasource from "../utils";

const repository = datasource.getRepository("Upvote");

const upvotesController = {
  create: async (req: Request, res: Response): Promise<void> => {
    const existingUpvote = await repository.findOne({
      where: {
        skill: { id: req.body.skillId },
        wilder: { id: req.body.wilderId },
      },
    });

    // Check if relationship already exists

    if (existingUpvote !== null) {
      res.json(existingUpvote);
    } else {
      const upvote = await repository.save({
        wilder: { id: req.body.wilderId },
        skill: { id: req.body.skillId },
      });
      res.json(upvote);
    }
  },

  increase: async (req: Request, res: Response): Promise<void> => {
    const existingUpvote = await repository.findOneBy({
      id: req.params.upvoteId,
    });

    if (existingUpvote !== null) {
      existingUpvote.counter = Number(existingUpvote.counter) + 1;

      await repository.save(existingUpvote);

      res.json(existingUpvote);
    } else {
      // create an error

      throw new Error("This Upvote doesn't exist ! ");
    }
  },
};

export default upvotesController;
