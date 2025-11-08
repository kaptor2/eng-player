import { EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { ipcMain } from "electron";
import { AppDataSource } from "@main/db";

export abstract class BaseController<TEntity extends ObjectLiteral> {
  protected repo: Repository<TEntity>;
  protected name: string;

  constructor(entity: EntityTarget<TEntity>) {
    this.repo = AppDataSource.getRepository(entity);
    this.name = this.repo.metadata.tableName;
    console.log('Controller initialized:', this.name);
    this.initIPC();
  }

  async getAll(): Promise<TEntity[]> {
    return this.repo.find();
  }

  async create(props: TEntity): Promise<TEntity> {
    const entity = this.repo.create(props);
    return this.repo.save(entity);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  private initIPC() {
    let proto = Object.getPrototypeOf(this);
    const methods = new Set<string>();

    while (proto && proto !== Object.prototype) {
      Object.getOwnPropertyNames(proto)
        .filter(name => name !== "constructor" && typeof (this as any)[name] === "function" && name !== "initIPC")
        .forEach(name => methods.add(name));

      proto = Object.getPrototypeOf(proto);
    }

    methods.forEach(name => {
      const channel = `${this.name}:${name}`;

      ipcMain.removeHandler(channel);

      const method = (this as any)[name] as (...args: unknown[]) => Promise<unknown>;

      ipcMain.handle(channel, async (_event, ...args: unknown[]) => {
        console.log('Handler invoked:', channel);
        return await method.apply(this, args);
      });
    });
  }
};