import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  stats = [
    { value: '50k+', label: 'Happy customers' },
    { value: '20k+', label: 'Products' },
    { value: '120+', label: 'Cities served' },
    { value: '4.8/5', label: 'Average rating' },
  ];

  values = [
    { icon: 'fa-heart', title: 'Customer first', desc: 'Every decision starts with what is best for the people who shop with us.' },
    { icon: 'fa-leaf', title: 'Responsible sourcing', desc: 'We partner with brands that care about people and the planet.' },
    { icon: 'fa-tag', title: 'Honest pricing', desc: 'Fair prices, transparent deals, and no hidden fees at checkout.' },
    { icon: 'fa-truck-fast', title: 'Fast delivery', desc: 'Reliable, trackable shipping that gets your order to you quickly.' },
  ];
}
