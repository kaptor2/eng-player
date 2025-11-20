import { useState } from 'react';

import { DeskEntity } from '@main/entities';

import { DeskProxy } from './app/proxies/DeskProxy';

const deskProxy = new DeskProxy();

export function App() {
  const [data, setData] = useState<DeskEntity[]>([]);

  const loadData = async () => {
    const result = await deskProxy.getAll();
    setData(result);
  };

  const addRecord = async () => {
    await deskProxy.create({
      video: `test_video_${Date.now()}`,
      start: '00:00',
      end: '00:10',
      sub: 'Test subtitle',
    });
    loadData();
  };

  return (
    <div>
      <h1>Hello from React + Electron!</h1>
      <button onClick={addRecord}>Add Record</button>
      <button onClick={loadData}>Load Data</button>
      <p>
        Total:
        {data.length}
      </p>
      {data.map((item) => (
        <p key={item.id}>
          ID:
          {item.id}
          {item.video}
        </p>
      ))}
    </div>
  );
}
