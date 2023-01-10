import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Message {
  @PrimaryColumn({ type: 'text' })
  @Generated('uuid')
    id: string

  @Column({ type: 'text', nullable: true })
    title?: string

  @Column({ type: 'text', nullable: true })
    thumb?: string

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date

  @Column({ type: 'simple-array', nullable: true })
    tags?: string[]

  @Column({ type: 'text', nullable: true })
    category?: string

  @Column({ type: 'text', nullable: true })
    content?: string

  @Column({ type: 'text', nullable: true })
    fileExt?: string

  @Column({ type: 'text', nullable: true })
    filePath?: string

  @Column({ type: 'text', nullable: true })
    fileFrom?: string

  @Column({ type: 'text', nullable: true })
    link?: string

  @Column({ type: 'int', nullable: true })
    size?: number

  @Column({ type: 'int', nullable: true })
    width?: number

  @Column({ type: 'int', nullable: true })
    height?: number

  @Column({ type: 'boolean', nullable: true })
    isTrash?: boolean
}
