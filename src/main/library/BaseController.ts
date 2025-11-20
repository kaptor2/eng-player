import { AppDataSource } from '@main/db';
import { ipcMain } from 'electron';
import { EntityTarget, ObjectLiteral, Repository } from 'typeorm';

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
        .filter((name) => {
          const isNotConstructor = name !== 'constructor';
          const isFunction = typeof (this as never)[name] === 'function';
          const isNotInit = name !== 'initIPC';

          return isNotConstructor && isFunction && isNotInit;
        })
        .forEach((name) => methods.add(name));

      proto = Object.getPrototypeOf(proto);
    }

    methods.forEach((name) => {
      const channel = `${this.name}:${name}`;

      ipcMain.removeHandler(channel);

      const method = (this as never)[name] as (...args: unknown[]) => Promise<unknown>;

      ipcMain.handle(channel, async (_event, ...args: unknown[]) => {
        console.log('Handler invoked:', channel);
        return await method.apply(this, args);
      });
    });
  }
}
