import { useState } from 'react';

import './app.css';
import { DeskEntity } from '@main/entities';

import { Typography } from './app/kit/Typography';
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
      <h1>TYPOGRAPHY</h1>

      <Typography level="body-lg">Test</Typography>
      <Typography level="body-md">Test</Typography>
      <Typography level="body-sm">Test</Typography>
      <Typography level="title-sm">Test</Typography>
      <Typography level="title-md">Test</Typography>
      <Typography level="body-lg">Test</Typography>
      <Typography level="caption">Test</Typography>
      <Typography level="h1">Test</Typography>
      <Typography level="h2">Test</Typography>
      <Typography level="h3">Test</Typography>

      <h1>Hello from React + Electron!</h1>
      <button onClick={addRecord}>Add Record</button>
      <button onClick={loadData}>Load Data</button>
      <p>
        Total:
        {data.length}
      </p>
      {data.map((item) => {
        return (
          <p key={item.id}>
            ID:
            {item.id}
            {item.video}
          </p>
        );
      })}
    </div>
  );
}
