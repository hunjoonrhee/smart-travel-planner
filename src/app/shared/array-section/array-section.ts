import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-array-section',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './array-section.html',
  styleUrl: './array-section.scss',
})
export class ArraySection {
  readonly title = input.required<string>();
  readonly titleIcon = input<string>();
  readonly addBtnIcon = input<string>();
  readonly addLabel = input<string>();
  readonly onAdd = output();
}
