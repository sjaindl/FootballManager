import { Component, OnInit } from '@angular/core'
import { Feedback } from '../shared/feedback'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  title: string = 'Starting Eleven'
  lat: number = 46.899395
  lng: number = 15.248251
  zoom: number = 15

  feedbackForm: FormGroup
  feedback: Feedback
  submittedFeedback = null

  formErrors = {
    'firstname': '',
    'lastname': '',
    'email': '',
    'gdpr': ''
  }

  validationMessages = {
    'firstname': {
      'required':      'Vorname ist verpflichtend.',
      'minlength':     'Der Vorname muss mindestens 2 Zeichen lang sein.',
      'maxlength':     'Der Vorname darf maximal 25 Zeichen lang sein.'
    },
    'lastname': {
      'required':      'Nachname ist verpflichtend.',
      'minlength':     'Der Nachname muss mindestens 2 Zeichen lang sein.',
      'maxlength':     'Der Nachname darf maximal 25 Zeichen lang sein.'
    },
    'email': {
      'required':      'Die E-Mail ist verpflichtend.',
      'email':         'E-Mail hat kein gültiges Format.'
    },
    'gdpr': {
      'requiredTrue':  'Die DSGVO muss akzeptiert werden.'
    }
  }

  constructor(private formBuilder: FormBuilder, private titleService: Title, private metaTagService: Meta) {
    this.createForm()
  }

  ngOnInit() {
    this.titleService.setTitle("HV TDP Stainz: Kontakt")
    this.metaTagService.updateTag({
      name: 'description', content: "Kontaktiere den HV TDP Stainz: Adresse, Feedback und Stadion."
    })
  }

  createForm() {
    this.feedbackForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      email: ['', [Validators.required, Validators.email] ],
      agreeContact: false,
      agreeGDPR: [false, [Validators.requiredTrue] ],
      message: ''
    })

    this.onValueChanged() // (re)set validation messages now

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data))
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { 
      return 
    }

    for (const field in this.formErrors) {
      this.formErrors[field] = '' // clear previous error message (if any)
      const control = this.feedbackForm.get(field)
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field]
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' '
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value

    // this.feedbackService.submitFeedback(this.feedback)
    //   .subscribe(feedback => { 
        this.submittedFeedback = this.feedback
      // })

      var mailSubject = 'Feedback '
      mailSubject += this.submittedFeedback.firstname + ' ' 
      + this.submittedFeedback.lastname + ', '
      + this.submittedFeedback.email

      if (this.submittedFeedback.agreeContact) {
        mailSubject += ', Kontaktaufnahme erlaubt'
      }

      window.location.href = 'mailto:hvtdpstainz@gmx.at?subject='
        + mailSubject
        + "&body=" + this.submittedFeedback.message

    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      email: '',
      agreeContact: false,
      agreeGDPR: false,
      message: ''
    })
  }

}
