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
  public timeSet: number = 5;

  ngOnInit(): void {
    this.setTime(60);
    setInterval(() => this.timeLeft(), 250);
  }

  ngAfterViewInit(): void {
    this.outputArea = this.el.nativeElement;
  }

  private timeLeft(): void {
    const endAt = this.parseTime();
    const remainingMillis = endAt.getTime() - (new Date().getTime());
    if (remainingMillis <= 0) {
      this.outputArea.innerHTML = "Times Up!";
      return;
    }
    const seconds = Math.round(remainingMillis / 1000);
    const minutesRemaining = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    const secondsString = `${secondsRemaining}`.padStart(2, '0');
    this.outputArea.innerHTML = `${minutesRemaining}:${secondsString}`;
  }

  private parseTime(): Date {
    const d: Date = new Date();
    const splits: string[] = this.endAt.split(":");
    const hours: number = Number.parseInt(this.endAt.split(":")[0]);
    const minutes: number = Number.parseInt(this.endAt.split(":")[1]);
    const seconds: number = splits.length > 2 ? Number.parseInt(this.endAt.split(":")[2]) : 0;
    d.setHours(hours);
    d.setMinutes(minutes);
    d.setSeconds(seconds);
    return d;
  }

  public setTime(minutes: number): void {
    const targetTime: Date = new Date();
    targetTime.setTime(new Date().getTime() + minutes * 60 * 1000);
    const hours: string = `${targetTime.getHours()}`.padStart(2, '0');
    const mins: string = `${targetTime.getMinutes()}`.padStart(2, '0');
    const seconds: string = `${targetTime.getSeconds()}`.padStart(2, '0');
    this.endAt = `${hours}:${mins}:${seconds}`;
  }

}
