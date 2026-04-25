/**
 * Static catalog backing category/provider API simulations.
 * Replace with remote fetch + cache when backend exists.
 */
import type { Category, ServiceProvider } from '../../types';

export const SEED_CATEGORIES: Category[] = [
  { id: 'cat-hospital', name: 'Hospital', icon: 'hospital' },
  { id: 'cat-salon', name: 'Salon', icon: 'salon' },
  { id: 'cat-college', name: 'College Office', icon: 'college' },
  { id: 'cat-restaurant', name: 'Restaurant', icon: 'restaurant' },
];

export const SEED_PROVIDERS: ServiceProvider[] = [
  {
    id: 'prov-hosp-pmc',
    name: 'Providence Medical Center',
    categoryId: 'cat-hospital',
    image:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop&q=80',
    rating: 4.6,
    location: '1200 Wellness Blvd, Metro City',
    busyness: 'high',
    currentVisitors: 38,
    services: [
      {
        id: 'svc-pmc-1',
        name: 'General Checkup',
        duration: '45 min',
        price: '$125',
      },
      {
        id: 'svc-pmc-2',
        name: 'Blood Test',
        duration: '20 min',
        price: '$48',
      },
      {
        id: 'svc-pmc-3',
        name: 'X-Ray',
        duration: '30 min',
        price: '$210',
      },
      {
        id: 'svc-pmc-4',
        name: 'Specialist Consultation',
        duration: '60 min',
        price: '$280',
      },
    ],
  },
  {
    id: 'prov-hosp-rch',
    name: 'Riverside Community Hospital',
    categoryId: 'cat-hospital',
    image:
      'https://images.unsplash.com/photo-1586773860418-d3722dacf216?w=800&h=600&fit=crop&q=80',
    rating: 4.3,
    location: '88 River Road, Riverside',
    busyness: 'moderate',
    currentVisitors: 22,
    services: [
      {
        id: 'svc-rch-1',
        name: 'General Checkup',
        duration: '40 min',
        price: '$110',
      },
      {
        id: 'svc-rch-2',
        name: 'Blood Test',
        duration: '25 min',
        price: '$42',
      },
      {
        id: 'svc-rch-3',
        name: 'X-Ray',
        duration: '35 min',
        price: '$195',
      },
      {
        id: 'svc-rch-4',
        name: 'Specialist Consultation',
        duration: '50 min',
        price: '$265',
      },
    ],
  },
  {
    id: 'prov-salon-urban',
    name: 'Urban Edge Studio',
    categoryId: 'cat-salon',
    image:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&q=80',
    rating: 4.8,
    location: '42 Style District, Downtown',
    busyness: 'moderate',
    currentVisitors: 14,
    services: [
      {
        id: 'svc-urban-1',
        name: 'Haircut',
        duration: '45 min',
        price: '$55',
      },
      {
        id: 'svc-urban-2',
        name: 'Beard Styling',
        duration: '30 min',
        price: '$35',
      },
      {
        id: 'svc-urban-3',
        name: 'Facial',
        duration: '60 min',
        price: '$95',
      },
      {
        id: 'svc-urban-4',
        name: 'Hair Spa',
        duration: '75 min',
        price: '$120',
      },
    ],
  },
  {
    id: 'prov-salon-luxe',
    name: 'Luxe Hair Lounge',
    categoryId: 'cat-salon',
    image:
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop&q=80',
    rating: 4.7,
    location: '15 Market Street, Suite 3',
    busyness: 'low',
    currentVisitors: 9,
    services: [
      {
        id: 'svc-luxe-1',
        name: 'Haircut',
        duration: '50 min',
        price: '$62',
      },
      {
        id: 'svc-luxe-2',
        name: 'Beard Styling',
        duration: '35 min',
        price: '$40',
      },
      {
        id: 'svc-luxe-3',
        name: 'Facial',
        duration: '55 min',
        price: '$88',
      },
      {
        id: 'svc-luxe-4',
        name: 'Hair Spa',
        duration: '80 min',
        price: '$135',
      },
    ],
  },
  {
    id: 'prov-college-nu',
    name: 'Northridge University — Registrar Office',
    categoryId: 'cat-college',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&q=80',
    rating: 4.5,
    location: 'Admin Building A, Northridge Campus',
    busyness: 'moderate',
    currentVisitors: 31,
    services: [
      {
        id: 'svc-nu-1',
        name: 'Bonafide Certificate',
        duration: '15 min',
        price: '$12',
      },
      {
        id: 'svc-nu-2',
        name: 'Fee Payment',
        duration: '20 min',
        price: 'Varies',
      },
      {
        id: 'svc-nu-3',
        name: 'ID Card Issue',
        duration: '25 min',
        price: '$18',
      },
    ],
  },
  {
    id: 'prov-rest-copper',
    name: 'The Copper Table',
    categoryId: 'cat-restaurant',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&q=80',
    rating: 4.6,
    location: '200 Harbor View, Waterfront',
    busyness: 'high',
    currentVisitors: 44,
    services: [
      {
        id: 'svc-copper-1',
        name: 'Table Booking',
        duration: '2 hr slot',
        price: '$25 deposit',
      },
      {
        id: 'svc-copper-2',
        name: 'Takeaway Order',
        duration: '25 min',
        price: 'Varies',
      },
      {
        id: 'svc-copper-3',
        name: 'Family Dining',
        duration: '90 min',
        price: 'Varies',
      },
    ],
  },
  {
    id: 'prov-rest-sakura',
    name: 'Sakura Bistro',
    categoryId: 'cat-restaurant',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&q=80',
    rating: 4.4,
    location: '9 Garden Lane, Midtown',
    busyness: 'low',
    currentVisitors: 16,
    services: [
      {
        id: 'svc-sakura-1',
        name: 'Table Booking',
        duration: '2 hr slot',
        price: '$20 deposit',
      },
      {
        id: 'svc-sakura-2',
        name: 'Takeaway Order',
        duration: '20 min',
        price: 'Varies',
      },
      {
        id: 'svc-sakura-3',
        name: 'Family Dining',
        duration: '120 min',
        price: 'Varies',
      },
    ],
  },
];
