import { DevTools } from '@effect/experimental';
import { NodeSocket } from '@effect/platform-node';
import { Layer } from 'effect';

export const DevToolsLive = DevTools.layerWebSocket().pipe(
  Layer.provide(NodeSocket.layerWebSocketConstructor),
);
