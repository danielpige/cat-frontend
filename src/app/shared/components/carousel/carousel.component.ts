import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Images } from '../../../core/models/images.model';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent {
  @Input() images: Images[] = [];
}
