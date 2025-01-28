import { 
    Entity, 
    PrimaryGeneratedColumn,
    Column
} from "typeorm"

@Entity()
export class Users {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: 'text'})
    name!: string

    @Column({type: 'text'})
    password!: string 
}