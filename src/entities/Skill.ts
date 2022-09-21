import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Upvote from "./Upvote";

@Entity()
class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Upvote, "skill")
  upvotes: Upvote[];

  // relations: {
  //   upvotes: {
  //     target: "Upvote",
  //     type: "one-to-many",
  //     inverseSide: "skill",
  //   },
  // },
}

export default Skill;
