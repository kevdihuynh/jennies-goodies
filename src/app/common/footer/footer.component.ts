import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from './../../utils/global-constants';
import * as _ from 'lodash';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public globalConstants = GlobalConstants;
  public socialMedia = [
    {
      title: 'Facebook',
      iconClass: 'fab fa-facebook fa-2x text-dark',
      url: `${this.globalConstants.company.facebook}`,
      displayTitle: false,
      openTab: true
    },
    {
      title: 'Instagram',
      iconClass: 'fab fa-instagram fa-2x text-dark',
      url: `${this.globalConstants.company.instagram}`,
      displayTitle: false,
      openTab: true
    },
    {
      title: 'Email',
      iconClass: 'fas fa-envelope fa-2x text-dark',
      url: `mailto:${this.globalConstants.company.email}?Subject=Hey Jennie`,
      displayTitle: false,
      openTab: true
    },
    {
      title: this.globalConstants.company.phoneNumber,
      iconClass: 'fas fa-phone fa-2x text-dark',
      url: `tel:${this.globalConstants.company.phoneNumber}`,
      displayTitle: true,
      openTab: false
    }
  ];

  public links = [
      {
        title: 'About',
        url: '#/about'
      },
      {
        title: 'Privacy',
        url: '#/privacy'
      },
      {
        title: 'Terms',
        url: '#/terms'
      }
  ];
  public year = '2021';

  constructor(firestore: AngularFirestore) {
    firestore.collection('settings').doc('copyright').valueChanges().subscribe((copyright) => {
      this.year = _.get(copyright, ['year']);
    });
  }

  ngOnInit(): void {
  }

}
