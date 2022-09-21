/**
 * VERSION WITH MAKER CONTROLLER
 */

// const datasource = require("../utils");

// const repository = datasource.getRepository("Skill");

// module.exports = makeController({ entityName: "skill" });

import datasource from "../utils";
import { Request, Response } from "express";

const repository = datasource.getRepository("Skill");

export default {
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const skillCreated = await repository.query(
        "INSERT INTO skill(name) VALUES (?)",
        [req.body.name]
      );
      const data = await repository.query("SELECT * FROM skill WHERE id=?", [
        skillCreated.id,
      ]);
      console.log("Skill created");
      res.json(data[0]);
    } catch (err: any) {
      console.error("CREATE Error:", err);
      res.json({ success: false });
    }
  },

  findAll: async (req: Request, res: Response): Promise<void> => {
    const data = await repository.find();
    res.json(data);
  },

  find: async (req: Request, res: Response): Promise<void> => {
    try {
      const skillId = req.params.skillId;

      const data = await repository.findOneBy({ id: skillId });

      res.json(data);
    } catch (err) {
      console.error("FIND Error :", err);
      res.json({ success: false });
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const skillId: string = req.params.skillId;

      const skillToUpdate = await repository.findOneBy({ id: skillId });

      // Object.assign permet de modifier un objet existant
      // on aurait aussi pu faire : skill.name = req.body.name;
      try {
        if (skillToUpdate !== null) {
          const skillUpdated = Object.assign(skillToUpdate, req.body);

          await repository.save(skillUpdated);
          res.json(skillUpdated);
        }
      } catch (err: any) {
        console.error("UPDATE: Error when saving:", err);
        res.json({ success: false });
      }
    } catch (err: any) {
      console.error("UPDATE Error when finding:", err);
      res.json({ success: false });
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const skillId = Number(req.params.skillId);

    const skillToDelete = await repository.findOneBy({ id: skillId });
    if (skillToDelete !== null) {
      try {
        await repository.remove(skillToDelete);
        res.json({ success: true });
      } catch (err: any) {
        console.error("DELETE Error:", err);
        res.json({ success: false });
      }
    }
  },
};
