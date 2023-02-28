import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn, Tree, TreeChildren, TreeParent, UpdateDateColumn } from 'typeorm'
import type { BlockCategory, BlockFrom, BlockMetadata, BlockModel, BlockWhere } from '~/models/Block'
@Entity()
@Tree('closure-table')
export class Block implements BlockModel {
  @PrimaryColumn({ type: 'text' })
  @Generated('uuid')
    id: string

  @Column({ type: 'text', nullable: true })
    title?: string

  @Column({ type: 'text', nullable: true })
    thumb?: string

  @Column({ type: 'simple-array', nullable: true })
    tags?: string[]

  @Column({ type: 'text', nullable: true })
    category?: BlockCategory

  @Column({ type: 'text', nullable: true })
    content?: string

  @Column({ type: 'text', nullable: true })
    fileExt?: string

  @Column({ type: 'text', nullable: true, unique: true })
    path?: string

  @Column({ type: 'text', nullable: true })
    from?: BlockFrom

  @Column({ type: 'int', nullable: true })
    size?: number

  @Column({ type: 'text', nullable: true })
    link?: string

  @Column({ type: 'simple-json', nullable: true })
    metadata?: BlockMetadata

  @Column({ type: 'text', nullable: true, default: 'default' })
    where?: BlockWhere

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date

  @TreeParent()
    parent?: Block

  @TreeChildren()
    children?: Block[]
}
