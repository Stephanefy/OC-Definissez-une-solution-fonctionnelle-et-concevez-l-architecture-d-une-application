import { Injectable, OnDestroy } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import { StompSubscription } from '@stomp/stompjs/src/stomp-subscription';
import { Message } from '../models/Message';
import { RxStompService } from '../../../.history/src/app/services/rx-stomp.service_20240531212309';
import { myRxStompConfig } from '../my-rx-stomp.config';

export type ListenerCallBack = (message: Message) => void;

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  private client: RxStompService | undefined = undefined;

  private subscription: StompSubscription | undefined;

  private isConnected = false;

  private userSession: { username: string } | undefined = undefined;

  public hasConnection!: boolean;

  constructor() {
   this.initializeWS();
  }


  private initializeWS(): void {
    if (this.client === undefined) {
      const rxStompService = new RxStompService();

      rxStompService.configure(myRxStompConfig);
      rxStompService.activate();


      this.client = rxStompService;
    }
  }

  public login(username: string, role: string): void {
    console.log(username, role);
  }

  public send(message: Message): void {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: '/support-dashboard/new-request',
        body: JSON.stringify(message),
      });
    }
  }


  public setClient(client: RxStompService): void {
    this.client = client;
  }

  public setHasConnection(hasConnection: boolean): void {
    this.hasConnection = hasConnection;
  }

  public getHasConnection(): boolean {
    return this.hasConnection;
  }

  public getClient(): RxStompService | undefined {
    return this.client;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
