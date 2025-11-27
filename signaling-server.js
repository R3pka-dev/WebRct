const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });
const clients = new Map();

function genId(){ return Math.random().toString(36).slice(2,9); }

wss.on('connection', (ws) => {
  const id = genId();
  clients.set(id, ws);
  ws.send(JSON.stringify({ type: 'id', id }));
  console.log('Client connected', id);

  ws.on('message', (msg) => {
    let data;
    try{ data = JSON.parse(msg); }catch(e){ return; }
    const target = data.to;
    if(target && clients.has(target)){
      data.from = id;
      clients.get(target).send(JSON.stringify(data));
    }
  });

  ws.on('close', () => { 
    clients.delete(id); 
    console.log('Client closed', id); 
  });
});

console.log('Signaling server running on ws://localhost:3000');
