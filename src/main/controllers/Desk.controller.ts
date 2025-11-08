import { DeskEntity } from "@main/entities";
import { BaseController } from "@main/library/BaseController";

export class DeskController extends BaseController<DeskEntity> {
  constructor() {
    super(DeskEntity);
  }
}