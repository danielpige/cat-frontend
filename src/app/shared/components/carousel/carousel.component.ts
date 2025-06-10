import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Images } from '../../../core/models/images.model';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() images: Images[] = [];
  currentIndex = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000); // Cambia cada 3 segundos
  }
}
