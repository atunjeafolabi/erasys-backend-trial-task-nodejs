import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('passwords')
export class Password extends BaseEntity {
  @PrimaryColumn()
  password: string;

  @Column()
  valid: number;

  compromised: boolean;
  errorMessages: [];

  setValue(value: string) {
    this.password = value;
  }

  getValue() {
    return this.password;
  }

  setCompromised(value: boolean) {
    this.compromised = value;
  }

  isCompromised() {
    return this.compromised;
  }

  setValid(value: number) {
    this.valid = value;
  }

  isValid() {
    return this.valid;
  }

  setErrorMessages(messages: []) {
    this.errorMessages = messages;
  }

  getErrorMessages() {
    return this.errorMessages;
  }
}
