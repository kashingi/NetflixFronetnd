import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {

  landingForm!: FormGroup
  year = new Date().getFullYear();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.landingForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  login() {
    this.router.navigate(['/login']);
  }

  getStarted() {
    this.router.navigate(['/signup'], {
      queryParams: { email: this.landingForm.value.email }
    });
  }

  reasons = [
    {
      title: 'Enjoy on your TV',
      text: 'Watch on smart TVs, playstations, xbox, players and more.',
      icon: 'tv'
    },
    {
      title: 'Download your shows to watch offline',
      text: 'Save your favourites easily and always have something to watch.',
      icon: 'file_download'
    },
    {
      title: 'Watch everywhere',
      text: 'Stream unlimited movies and TV shows on your phone, tablet, laptop and TV.',
      icon: 'devices'
    },
    {
      title: 'Create profiles for kids',
      text: 'Send kids on adventures in a space made just for them - free with your membership.',
      icon: 'face'
    }
  ]

  faqs = [
    {
      question: 'What is a movie show?',
      answer: 'Is a movie streaming service that offers a wide variety of award-wining TV shows, movies, anime, documentaries and more.'
    },
    {
      question: 'How much does this movie show cost?',
      answer: 'Plans start at KES 4500 a month, no extra costs, no conflicts'
    },
    {
      question: 'Where can I watch?',
      answer: 'Watch anywhere, anytime. Sign in with your account to watch on the web or on devices like smartphones, tablets, smart TVs and more.'
    },
    {
      question: 'How do I cancel?',
      answer: 'You can cancel your membership online by two cliks. There are no cancellation fees, start or stop your accouct anytime.'
    },
    {
      question: 'What can I watch on movie show',
      answer: 'A huge library of feature films, documentaries, anime, TV shows and more'
    },
    {
      question: 'Is movie show good for kids?',
      answer: 'The kids experience includes family-friendly entertainment with personal controls to restrict content by maturity rating.'
    }
  ]
}
