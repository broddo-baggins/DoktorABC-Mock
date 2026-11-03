import React from 'react'
import LegalDocument, { LegalContact } from './legal/LegalDocument'

const sections = [
  {
    id: 'about-doktorabc',
    title: 'About DoktorABC',
    body: (
      <>
        <p>
          DoktorABC is an online healthcare platform that connects you with qualified doctors, partner pharmacies and
          treatments. The service is available online at any time, although doctors review consultations during their
          working hours.
        </p>
        <p>
          By using our services you agree to these terms and to use the service only for its intended purpose: obtaining
          medical advice, prescriptions and treatment for yourself.
        </p>
      </>
    ),
  },
  {
    id: 'eligibility',
    title: 'Who can use the service',
    body: (
      <>
        <p>
          You must be at least 18 years old and a real person acting for yourself. Automated access, bots and scripts
          are not permitted, and no prescription will be issued to an account that is not operated by a person.
        </p>
        <p>
          If you use the service on behalf of someone else, you must have their permission. We verify identity because
          it matters for safe prescribing.
        </p>
      </>
    ),
  },
  {
    id: 'accurate-information',
    title: 'Giving accurate information',
    body: (
      <>
        <p>
          Answer medical questionnaires truthfully and completely. Leaving out or misstating your medical history to
          get a faster approval puts your health at risk.
        </p>
        <p>
          Our doctors rely on accurate information to treat you safely, and they are trained to notice answers that do
          not fit together. They may ask further questions before deciding.
        </p>
      </>
    ),
  },
  {
    id: 'payment',
    title: 'Payment and refunds',
    body: (
      <>
        <p>
          We accept a range of payment methods. Payment for a consultation or treatment is processed when you confirm
          your order.
        </p>
        <p>
          Prices are shown in your local currency or in euros. If a price looks wrong, please contact us before paying;
          we cannot honour a price that is clearly a mistake.
        </p>
        <p>
          Refunds are considered case by case. Changing your mind after a treatment has been given is not normally a
          reason for a refund, in the same way that a completed service cannot be returned.
        </p>
      </>
    ),
  },
  {
    id: 'consultations',
    title: 'Consultations',
    body: (
      <>
        <p>
          Video and online consultations are carried out by qualified, registered doctors, not by automated systems.
        </p>
        <p>
          Some conditions cannot be assessed remotely. If your doctor advises an in-person examination, please follow
          that advice; it is given to keep you safe.
        </p>
      </>
    ),
  },
  {
    id: 'prescriptions',
    title: 'Prescriptions and medicines',
    body: (
      <>
        <p>
          A doctor prescribes a medicine only when they judge it appropriate for your condition. Follow the dosing
          instructions and read the patient information leaflet that comes with it.
        </p>
        <p>
          Do not share your medicines with anyone else, even if they appear to have the same condition. Medicines are
          prescribed for one person, and sharing prescription medicines is illegal in many countries.
        </p>
        <p>
          If you experience side effects, contact us or your doctor straight away. Do not wait for symptoms to get
          worse.
        </p>
      </>
    ),
  },
  {
    id: 'your-responsibilities',
    title: 'Your responsibilities',
    body: (
      <>
        <p>
          Keep your account secure and use a strong, unique password. You are responsible for activity on your account,
          including orders placed by anyone who has used your login.
        </p>
        <p>
          Make sure your delivery details are correct. If a parcel goes astray because of an incorrect address or
          postcode we will help, but please check your details before ordering.
        </p>
      </>
    ),
  },
  {
    id: 'limitations',
    title: 'Limits of our service',
    body: (
      <>
        <p>We work to provide a reliable service, but we cannot guarantee that:</p>
        <ul>
          <li>the website will always be available without interruption;</li>
          <li>every delivery will arrive within the estimated time;</li>
          <li>a treatment will produce a particular result, as results vary from person to person;</li>
          <li>customer service will always reply immediately.</li>
        </ul>
        <p>
          We are not liable for events outside our reasonable control, such as natural events, failures of
          third-party networks or internet outages.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    body: (
      <p>
        We may update these terms from time to time and will tell you by email when we do. If you keep using the service
        after a change, you accept the updated terms. If you do not agree with them, you can stop using the service at
        any time.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: (
      <>
        <p>If you have questions about these terms, or anything else, you can reach us here:</p>
        <LegalContact email="legal@doktorabc.com" />
      </>
    ),
  },
]

const Terms = () => (
  <LegalDocument
    title="Terms and conditions"
    updated="January 2025"
    summary="By using DoktorABC you agree to these terms. We have written them as plainly as we can, but they are legally binding, so please read them in full."
    sections={sections}
    closing="These terms exist to protect you and us, so that everyone using the service is treated safely and fairly. If anything is unclear, ask us and we will explain."
  />
)

export default Terms
