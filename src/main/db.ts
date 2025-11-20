import { app } from 'electron';
import path from 'path';
import { DataSource } from 'typeorm';

import { DeskEntity } from './entities';

const dbPath = path.join(app.getPath('userData'), 'database.sqlite');

export const AppDataSource = new DataSource({
  type: 'sqljs',
  autoSave: true,
  location: dbPath,
  synchronize: true,
  logging: false,
  entities: [DeskEntity],
  sqlJsConfig: {
    locateFile: (file: string) => {
      if (app.isPackaged) {
        return path.join(process.resourcesPath, 'app.asar.unpacked/node_modules/sql.js/dist', file);
      }
      return path.join(__dirname, '../../node_modules/sql.js/dist', file);
    },
  },
});
