import { BaseController } from "@main/library/BaseController";
import { ENTITY_NAMES } from "@shared/registry";
import { ipcRenderer } from "electron";
import { ObjectLiteral } from "typeorm";

export abstract class BaseProxy<TEntity extends ObjectLiteral> implements Omit<BaseController<TEntity>, 'repo'> {
  constructor(public name: keyof typeof ENTITY_NAMES) { }

  getAll(): Promise<TEntity[]> {
    return ipcRenderer.invoke(`${this.name}:getAll`);
  }
  create(props: Omit<TEntity, 'id'>): Promise<TEntity> {
    return ipcRenderer.invoke(`${this.name}:create`, props);
  }
  delete(id: number): Promise<void> {
    return ipcRenderer.invoke(`${this.name}:delete`, id);
  }
};