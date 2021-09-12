import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('passwords')
export class Password extends BaseEntity {
  @PrimaryColumn()
  password: string;

  @Column()
  valid: number;

  setPassword(value: string) {
    this.password = value;
    return this;
  }
}
