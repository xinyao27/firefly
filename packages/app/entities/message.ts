import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import type { MessageCategory, MessageFrom, MessageMetadata, MessageModel, MessageWhere } from '~/models/Message'

@Entity()
export class Message implements MessageModel {
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
    category?: MessageCategory

  @Column({ type: 'text', nullable: true })
    content?: string

  @Column({ type: 'text', nullable: true })
    fileExt?: string

  @Column({ type: 'text', nullable: true, unique: true })
    filePath?: string

  @Column({ type: 'text', nullable: true })
    from?: MessageFrom

  @Column({ type: 'int', nullable: true })
    size?: number

  @Column({ type: 'text', nullable: true })
    link?: string

  @Column({ type: 'simple-json', nullable: true })
    metadata?: MessageMetadata

  @Column({ type: 'text', nullable: true, default: 'default' })
    where?: MessageWhere

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date

  @ManyToOne(() => Message)
  @JoinColumn()
    parent?: Message
}
