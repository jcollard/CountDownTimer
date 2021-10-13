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
  if (label && hours && minutes) {
    return new TimeButton(label, hours, minutes);
  } else {
    return new IgnoredButton();
  }
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

  private audioPlayer!: HTMLAudioElement;
  private outputArea!: HTMLDivElement;
  private playSound: boolean = false;
  private dayNumToString: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  public days: Array<string> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  public bestTimes!: Record<string, Array<QuickButton>>;
  public soundEnabled: boolean = false;
  public endAt: string = "12:00";
  public timeSet: number = 5;

  ngOnInit(): void {
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
      ]
    }

    this.setTimeFromNow(60, true);
    this.findAndSetBestTime();

    setInterval(() => this.timeLeft(), 250);
  }

  ngAfterViewInit(): void {
    this.outputArea = this.el.nativeElement;
    this.audioPlayer = this.audioPlayerEl.nativeElement;
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
        dateCheck.setHours(entry.time.hours);
        dateCheck.setMinutes(entry.time.minutes);
        if (dateCheck > currentDate) {
          entry.click(this);
          break;
        }
      }
    }
  }

  private timeLeft(): void {
    const endAt = this.parseTime();
    const remainingMillis = endAt.getTime() - (new Date().getTime());
    if (remainingMillis <= 0) {
      this.outputArea.innerHTML = "Times Up!";
      if (this.playSound && this.soundEnabled) {
        this.audioPlayer.play();
      }

      this.playSound = false;
      return;
    }
    const seconds = Math.round(remainingMillis / 1000);
    const mins = `${Math.floor(seconds / 60)}`.padStart(2, '0');
    const secs = `${seconds % 60}`.padStart(2, '0');
    this.outputArea.innerHTML = `${mins}:${secs}`;
    this.playSound = true;
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

  public setTimeFromNow(minutes: number, seconds?: boolean): void {
    const targetTime: Date = new Date();
    targetTime.setTime(new Date().getTime() + minutes * 60 * 1000);
    if (seconds) {
      targetTime.setSeconds(0);
    }
    this.endAt = this.dateToString(targetTime);
  }

  private dateToString(d: Date): string {
    const hours: string = `${d.getHours()}`.padStart(2, '0');
    const mins: string = `${d.getMinutes()}`.padStart(2, '0');
    const seconds: string = `${d.getSeconds()}`.padStart(2, '0');
    return `${hours}:${mins}:${seconds}`;
  }

  public setTime(hour: number, minutes: number): void {
    const targetTime: Date = new Date();
    targetTime.setHours(hour);
    targetTime.setMinutes(minutes);
    targetTime.setSeconds(0);
    this.endAt = this.dateToString(targetTime);
  }

}
