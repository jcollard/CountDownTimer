import { Time } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

interface QuickButton {
  getDisplayText(): string;
  click(cdc: CountDownComponent): void;
}

class TimeButton implements QuickButton {
  public label: string;
  public time: Time

  constructor(label: string, hours: number, minutes: number) {
    this.label = label;
    this.time = { hours: hours, minutes: minutes };
  }

  public getDisplayText(): string {
    return this.label;
  }

  public click(cdc: CountDownComponent): void {
    cdc.setTime(this.time.hours, this.time.minutes);
  }
}

class IgnoredButton implements QuickButton {
  public getDisplayText() {
    return '--';
  }

  public click(cdc: CountDownComponent): void {

  }
}

function entry(label?: string, hours?: number, minutes?: number): QuickButton {
  if (label && hours !== undefined && minutes !== undefined) {
    return new TimeButton(label, hours, minutes);
  } else {
    return new IgnoredButton();
  }
}

function parseTime(timeString: string): Date {
  const splits: string[] = timeString.split(":");
  const hours: number = Number.parseInt(splits[0]);
  const minutes: number = Number.parseInt(splits[1]);
  const seconds: number = splits.length > 2 ? Number.parseInt(splits[2]) : 0;
  const d: Date = new Date();
  d.setHours(hours);
  d.setMinutes(minutes);
  d.setSeconds(seconds);
  return d;
}

function dateToString(d: Date): string {
  const hours: string = `${d.getHours()}`.padStart(2, '0');
  const mins: string = `${d.getMinutes()}`.padStart(2, '0');
  const seconds: string = `${d.getSeconds()}`.padStart(2, '0');
  return `${hours}:${mins}:${seconds}`;
}

@Component({
  selector: 'app-root',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountDownComponent implements OnInit, AfterViewInit {
  title = 'CountDown';
  @ViewChild('timer') el!: ElementRef;
  @ViewChild('audioPlayer') audioPlayerEl!: ElementRef;
  @ViewChild('explosionPlayer') explosionPlayerEl!: ElementRef;

  public audioPlayer!: HTMLAudioElement;
  public explosionPlayer!: HTMLAudioElement;
  private outputArea!: HTMLDivElement;
  private playSound: boolean = false;
  private dayNumToString: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  public readonly days: Array<string>;
  public readonly bestTimes: Record<string, Array<QuickButton>>;
  public soundEnabled: boolean = false;
  public sound?: HTMLAudioElement;
  public endAt: string = "12:00";
  public timeSet: number = 5;

  constructor() {
    this.bestTimes = {
      'Monday': [
        entry('A', 8, 35),
        entry('B', 9, 25),
        entry('C', 10, 15),
        entry('D', 11, 30),
        entry('E', 12, 20),
        entry("WOM", 13, 40),
        entry('8th', 15, 35)
      ],

      'Tuesday': [
        entry('D', 9, 10),
        entry('E', 10, 35),
        entry('F', 12, 20),
        entry(),
        entry(),
        entry("WOM", 14, 40),
        entry('8th', 15, 35)
      ],

      'Wednesday': [
        entry('B', 10, 10),
        entry('A', 11, 35),
        entry('C', 13, 10),
        entry(),
        entry(),
        entry("7th", 14, 40),
        entry('Club', 15, 35)
      ],

      'Thursday': [
        entry('F', 9, 10),
        entry('D', 10, 35),
        entry('E', 12, 20),
        entry(),
        entry(),
        entry(),
        entry('8th', 15, 35)
      ],

      'Friday': [
        entry('C', 9, 10),
        entry('B', 10, 35),
        entry('A', 13, 10),
        entry(),
        entry(),
        entry(),
        entry()
      ],

      '75 Mins': [
        entry('1st', 9, 5),
        entry('2nd', 10, 25),
        entry('3rd', 12, 5),
        entry('Late 1st', 10, 5),
        entry('Late 2nd', 11, 25),
        entry('Late 3rd', 13, 0),
        entry()

      ]
    }
    this.days = Object.keys(this.bestTimes);
  }

  ngOnInit(): void {
    this.setTimeFromNow(60, true);
    this.findAndSetBestTime();
  }

  ngAfterViewInit(): void {
    this.outputArea = this.el.nativeElement;
    this.audioPlayer = this.audioPlayerEl.nativeElement;
    this.explosionPlayer = this.explosionPlayerEl.nativeElement;
    setInterval(() => this.updateTime(), 250);
  }

  /**
   * Attempts to find the best time for the countdown timer to
   * start based on the current date and time.
   */
  private findAndSetBestTime(): void {
    const currentDate: Date = new Date();
    const currentDay: string = this.dayNumToString[currentDate.getDay()];
    const bestTimesToday: Array<QuickButton> = this.bestTimes[currentDay];

    for (const entry of bestTimesToday) {
      if (entry instanceof TimeButton) {
        const dateCheck = new Date();
        dateCheck.setHours(entry.time.hours, entry.time.minutes);
        if (dateCheck > currentDate) {
          entry.click(this);
          break;
        }
      }
    }
  }

  private timesUp(): void {
    this.outputArea.innerHTML = "Times Up!";
    document.title = "Times Up!"
    if (this.playSound && this.soundEnabled) {
      this.sound?.play();
    }

    this.playSound = false;
  }

  private updateTime(): void {
    const remainingMillis = parseTime(this.endAt).getTime() - (new Date().getTime());

    if (this.sound === undefined) {
      this.sound = this.audioPlayer;
    }

    if (remainingMillis <= 0) {
      this.timesUp();
      return;
    }

    const seconds = Math.round(remainingMillis / 1000);
    const mins = `${Math.floor(seconds / 60)}`.padStart(2, '0');
    const secs = `${seconds % 60}`.padStart(2, '0');
    document.title = `${mins}:${secs}`;
    this.outputArea.innerHTML = document.title;
    this.playSound = true;
  }

  public setTimeFromNow(minutes: number, ignoreSeconds?: boolean): void {
    const targetTime: Date = new Date();
    targetTime.setTime(new Date().getTime() + minutes * 60 * 1000);
    if (ignoreSeconds) {
      targetTime.setSeconds(0);
    }
    this.endAt = dateToString(targetTime);
  }

  public setTime(hour: number, minutes: number, seconds?: number): void {
    const targetTime: Date = new Date();
    targetTime.setHours(hour, minutes, seconds ? seconds : 0);
    this.endAt = dateToString(targetTime);
  }
}