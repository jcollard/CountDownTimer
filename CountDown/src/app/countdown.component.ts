import { Time } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountDownComponent implements OnInit, AfterViewInit {
  title = 'CountDown';
  @ViewChild('timer') el!: ElementRef;
  private outputArea!: HTMLDivElement;
  public endAt: string = "12:00";

  ngOnInit(): void {

    console.log(this.endAt);
    const currentDate = new Date();

    this.endAt = `${currentDate.getHours()+1}:${currentDate.getMinutes()}`;
    setInterval(() => this.timeLeft(), 250);
  }

  ngAfterViewInit(): void {
    this.outputArea = this.el.nativeElement;
  }

  private timeLeft(): void {
    const endAt = this.parseTime();
    const currentTime = new Date();
    const endTime = new Date();
    endTime.setHours(endAt.hours);
    endTime.setMinutes(endAt.minutes);
    endTime.setSeconds(0);
    const remainingMillis = endTime.getTime() - (new Date().getTime());
    if(remainingMillis <= 0){
      this.outputArea.innerHTML = "Times Up!";
      return;
    }
    const seconds = Math.round(remainingMillis/1000);
    const minutesRemaining = Math.round(seconds/60);
    const secondsRemaining = seconds % 60;
    const secondsString = seconds < 10 ? '0' + secondsRemaining : secondsRemaining;
    this.outputArea.innerHTML = `${minutesRemaining}:${secondsString}`;
  }

  private parseTime(): Time {
    const hours: number = Number.parseInt(this.endAt.split(":")[0]);
    const minutes: number = Number.parseInt(this.endAt.split(":")[1]);
    return { hours: hours, minutes: minutes };
  }

}
