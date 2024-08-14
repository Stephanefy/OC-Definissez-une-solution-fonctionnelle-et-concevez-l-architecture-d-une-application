// data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private isAdminSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private isClientSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private receiverNameSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  private receiverIdSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  private onlineUsersSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  public isAdmin$: Observable<boolean> = this.isAdminSubject.asObservable();
  public isClient$: Observable<boolean> = this.isClientSubject.asObservable();
  public receiverName$: Observable<string> =
    this.receiverNameSubject.asObservable();
  public receiverId$: Observable<string> =
    this.receiverIdSubject.asObservable();
  public onlineUsers$: Observable<any[]> = this.onlineUsersSubject.asObservable();

  constructor() {
    //@ts-ignore
    if(JSON.parse(localStorage.getItem("currentUser"))?.role === "SUPPORT") {
      this.setIsAdmin(true);
    }
  }

  setIsAdmin(bool: boolean) {
    this.isAdminSubject.next(bool);
  }

  setReceiverName(name: string) {
    this.receiverNameSubject.next(name);
  }

  setReceiverId(id: string) {
    this.receiverIdSubject.next(id);
  }

  getReceiverNameData() {
    return this.receiverNameSubject.value;
  }

  getReceiverIdData() {
    return this.receiverIdSubject.value;
  }

  getisAdminData() {
    
    return this.isAdminSubject.value;
  }

  setOnlineUsers(onlineUsers: any[]) {
    this.onlineUsersSubject.next(onlineUsers);
  }

  getOnlineUsersData() {
    return this.onlineUsersSubject.value;
  }

}
