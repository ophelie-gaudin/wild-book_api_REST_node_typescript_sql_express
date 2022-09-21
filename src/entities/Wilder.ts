import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Upvote from "./Upvote";

@Entity()
class Wilder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Upvote, "wilder")
  upvotes: Upvote[];

  // relations: {
  //   upvotes: {
  //     target: "Upvote",
  //     type: "one-to-many",
  //     inverseSide: "wilder",
  //   },
  // },
}

export default Wilder;
