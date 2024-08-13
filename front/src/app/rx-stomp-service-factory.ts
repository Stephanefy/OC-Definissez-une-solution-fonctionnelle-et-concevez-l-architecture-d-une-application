import { RxStompService } from './services/rx-stomp.service';
import { myRxStompConfig } from './my-rx-stomp.config';
import { WebsocketService } from './services/websocket.service';

export function rxStompServiceFactory(webSocketService: WebsocketService) {

  console.log(webSocketService.getHasConnection())

  console.log("get current client",webSocketService.getClient())
  if (webSocketService.getHasConnection()) return;

  const rxStomp = new RxStompService();
  

  rxStomp.configure(myRxStompConfig);
  rxStomp.activate();

  webSocketService.setHasConnection(true)
  webSocketService.setClient(rxStomp);
  return rxStomp;
}