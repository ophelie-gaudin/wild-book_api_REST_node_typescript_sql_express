import datasource from "../utils";
import { Request, Response } from "express";
import Wilder from "../entities/Wilder";
import Skill from "../entities/Skill";
import Upvote from "../entities/Upvote";
import { DeepPartial, In } from "typeorm";
// import { In } from "typeorm";

const repository = datasource.getRepository(Wilder);

const skillRepository = datasource.getRepository(Skill);

const upvoteRepository = datasource.getRepository(Upvote);

export const wildersController = {
  create: async (req: Request, res: Response): Promise<void> => {
    // //* 1st METHOD : lancer les requêtes via TypeORM

    try {
      const data = await repository.save(req.body);

      console.log("Wilder created");
      res.json(data);
    } catch (err: any) {
      console.error("CREATE Error:", err);
      res.json({ success: false });
    }
  },

  findAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const wilders = await repository.find({
        relations: ["upvotes", "upvotes.skill"],
      });
      res.json(wilders);
    } catch (err) {
      console.error("FINDALL Error :", err);
      res.json({ success: false });
    }
  },

  find: async (req: Request, res: Response): Promise<void> => {
    try {
      const wilderId = req.params.wilderId;
      const wilder = await repository.findOneBy({ id: Number(wilderId) });
      res.json(wilder);
    } catch (err: any) {
      console.error("FIND Error :", err);
      res.json({ success: false });
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    const wilderId = req.params.wilderId;

    const wilder = await repository.findOneBy({ id: Number(wilderId) });

    if (wilder !== null) {
      // Object.assign permet de modifier un objet existant
      // on aurait aussi pu faire : wilder.name = req.body.name;
      Object.assign(wilder, req.body);

      try {
        const updatedWilder = await repository.save(wilder);

        res.json(updatedWilder);
      } catch (err: any) {
        console.error("UPDATE: Error when saving:", err);
        res.json({ success: false });
      }
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const wilderId = req.params.wilderId;

    try {
      const wilder = await repository.findOneBy({ id: Number(wilderId) });

      if (wilder !== null) {
        try {
          await repository.remove(wilder);
          res.json({ success: true });
        } catch (err) {
          console.error("DELETE Error:", err);
          res.json({ success: false });
        }
      }
    } catch (err: any) {
      console.error("DELETE Error when finding", err);
      res.json({ success: false });
    }
  },

  addSkills: async (req: Request, res: Response): Promise<void> => {
    try {
      const skillsIds: number[] = req.body.skillsIds;
      const wilderId = Number(req.params.wilderId);
      const newUpvotesArray: Array<DeepPartial<Upvote>> = [];

      skillsIds.forEach((skillId): void => {
        newUpvotesArray.push({
          wilder: { id: wilderId },
          skill: { id: skillId },
          counter: 0,
        });
      });

      const newUpvotes = await upvoteRepository.save(newUpvotesArray);

      res.json(newUpvotes);
    } catch (err: any) {
      console.log(err);
      res.send("Error while adding skill to wilder");
    }
  },

  findAllSkills: async (req: Request, res: Response): Promise<void> => {
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
        console.log(
          `Skills of Wilder id = ${req.params.wilderId} :`,
          JSON.stringify(wilderSkills, null, 4)
        );

        res.json(wilderSkills);
      }
    } catch (err: any) {
      console.log(err);
      res.send("Error while seeing wilder's skills");
    }
  },

  deleteSkills: async (req: Request, res: Response): Promise<void> => {
    try {
      const skillsIdsArray = req.body.skillsIds;
      const wilderId = Number(req.params.wilderId);

      console.log("Req.body: ", req.body);
      console.log("skillsIdsArray", skillsIdsArray);
      console.log("wilderId", wilderId);

      await upvoteRepository.delete({
        wilder: { id: wilderId },
        skill: { id: In(skillsIdsArray) },
      });

      res.json({ success: true });
    } catch (err: any) {
      console.log(err);
      res.send("Error while deleting wilder's skills");
    }
  },
};

export default wildersController;
