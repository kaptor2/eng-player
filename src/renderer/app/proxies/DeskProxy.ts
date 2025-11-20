import { DeskEntity } from '@main/entities';
import { BaseProxy } from '@renderer/library/BaseProxy';

export class DeskProxy extends BaseProxy<DeskEntity> {
  constructor() {
    super('desk');
  }
}
