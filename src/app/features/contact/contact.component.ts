import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  form = { name: '', email: '', subject: '', message: '' };
  sent = false;

  channels = [
    { icon: 'fa-envelope', title: 'Email us', value: 'support@ngstore.com', sub: 'We reply within 24 hours' },
    { icon: 'fa-phone', title: 'Call us', value: '+91 98765 43210', sub: 'Mon–Sat, 9am – 7pm' },
    { icon: 'fa-location-dot', title: 'Visit us', value: 'MG Road, Bangalore', sub: 'India 560001' },
  ];

  faqs = [
    { q: 'How long does delivery take?', a: 'Most orders arrive within 3–5 business days. Express options are available at checkout.' },
    { q: 'What is your return policy?', a: 'You can return any item within 30 days for a full refund, no questions asked.' },
    { q: 'Do you ship internationally?', a: 'We currently ship across India, with more regions coming soon.' },
  ];

  constructor(private toast: ToastService) {}

  submit(): void {
    if (!this.form.name || !this.form.email || !this.form.message) {
      this.toast.show('Please fill in all required fields', 'error', 'fa-solid fa-circle-exclamation');
      return;
    }
    this.sent = true;
    this.toast.show('Message sent! We\'ll be in touch soon.', 'success', 'fa-solid fa-paper-plane');
    this.form = { name: '', email: '', subject: '', message: '' };
  }
}
