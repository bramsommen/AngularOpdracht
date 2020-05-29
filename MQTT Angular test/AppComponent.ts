import { App } from "./Models/DiGi/App";
import {
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { Router, Event, ActivatedRoute, NavigationEnd } from "@angular/router";
import { SessionService } from "./_services/session.service";
import { UserService } from "./_services/user.service";

import { Subscription } from "rxjs";
import { IMqttMessage, MqttService } from "ngx-mqtt";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  topicname: any;
  msg: any;
  isConnected: boolean = false;
  @ViewChild("msglog", { static: true }) msglog: ElementRef;

  constructor(private _mqttService: MqttService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  subscribeNewTopic(): void {
    console.log("inside subscribe new topic");
    this.subscription = this._mqttService
      .observe(this.topicname)
      .subscribe((message: IMqttMessage) => {
        this.msg = message;
        console.log("msg: ", message);
        this.logMsg(
          "Message: " +
            message.payload.toString() +
            "<br> for topic: " +
            message.topic
        );
      });
    this.logMsg("subscribed to topic: " + this.topicname);
  }

  sendmsg(): void {
    // use unsafe publish for non-ssl websockets
    this._mqttService.unsafePublish(this.topicname, this.msg, {
      qos: 1,
      retain: true,
    });
    this.msg = "";
  }

  logMsg(message): void {
    this.msglog.nativeElement.innerHTML += "<br><hr>" + message;
  }

  clear(): void {
    this.msglog.nativeElement.innerHTML = "";
  }
}
