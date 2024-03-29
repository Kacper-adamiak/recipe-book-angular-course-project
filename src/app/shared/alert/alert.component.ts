import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-alert',
  template: `
    <div class="backdrop"></div>
    <div class="alert-box">
      <p>
        {{ message }}
      </p>
      <div class="alert-box-actions">
        <button (click)="closeAlert()" class="btn btn-primary">Close</button>
      </div>
    </div>
  `,
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() message: string
  @Output() close = new EventEmitter<void>()

  closeAlert() {
    this.close.emit()
  }
}
