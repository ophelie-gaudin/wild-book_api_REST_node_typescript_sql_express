import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Skill from "./Skill";
import Wilder from "./Wilder";

@Entity()
class Upvote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  counter: number;

  @ManyToOne(() => Wilder, "upvotes", { onDelete: "CASCADE" })
  wilder: Wilder;

  @ManyToOne(() => Skill, "upvotes", { onDelete: "CASCADE" })
  skill: Skill;

  // relations: {
  //   wilder: {
  //     target: "Wilder",
  //     type: "many-to-one",
  //     inverseSide: "upvotes",
  //   },
  //   skill: {
  //     target: "Skill",
  //     type: "many-to-one",
  //     inverseSide: "upvotes",
  //   },
  // },
}

export default Upvote;
