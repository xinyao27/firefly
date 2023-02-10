import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import type { ArticleModel, ArticleWhere } from '~~/models/Article'

@Entity()
export class Article implements ArticleModel {
  @PrimaryColumn({ type: 'text' })
  @Generated('uuid')
    id: string

  @Column({ type: 'text' })
    title: string

  @Column({ type: 'text' })
    filePath: string

  @Column({ type: 'simple-array', nullable: true })
    tags?: string[]

  @Column({ type: 'text', nullable: true })
    icon?: string

  @Column({ type: 'text', nullable: true, default: 'default' })
    where?: ArticleWhere

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date
}
