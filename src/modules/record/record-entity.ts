import { 
    Entity, 
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
} from "typeorm"

@Entity()
export class Records {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @CreateDateColumn()
    creat_at!: Date

    @Column({type: 'text'})
    message!: string

    @Column({type: 'text'})
    id_user!: string 
}