import React from 'react'
import LegalDocument, { LegalContact } from './legal/LegalDocument'

const sections = [
  {
    id: 'data-we-collect',
    title: 'What data we collect and why',
    body: (
      <>
        <p>
          We collect the information you give us because we need it to provide healthcare. A doctor cannot prescribe
          safely without knowing your medical background.
        </p>
        <p>
          <strong>Personal information.</strong> Your name, email address, phone number, date of birth and address: the
          details any healthcare provider needs.
        </p>
        <p>
          <strong>Health information.</strong> Your medical history, symptoms, consultation notes and prescriptions.
          This is sensitive data and we protect it as such.
        </p>
        <p>
          <strong>Technical information.</strong> Your IP address, browser type and device details. We use these to keep
          the website working properly and to detect suspicious activity, such as attempts to break into accounts.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use-data',
    title: 'How we use your data',
    body: (
      <>
        <p>We use your data to:</p>
        <ul>
          <li>provide healthcare services;</li>
          <li>process payments;</li>
          <li>send you appointment reminders;</li>
          <li>improve our services;</li>
          <li>meet our legal obligations.</li>
        </ul>
        <p>We <strong>do not</strong> use your data to:</p>
        <ul>
          <li>send you irrelevant marketing emails;</li>
          <li>sell to data brokers;</li>
          <li>target advertising at you based on your medical conditions;</li>
          <li>share your information with anyone you know without your consent.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-protect-data',
    title: 'How we protect your data',
    body: (
      <>
        <p>
          We use industry-standard security measures, including encryption, secure servers and regular security
          audits. In particular we use:
        </p>
        <ul>
          <li>256-bit SSL encryption for data in transit;</li>
          <li>regular security updates, so known vulnerabilities are patched promptly;</li>
          <li>access controls, so only authorised staff can see your data;</li>
          <li>backup systems, so your records survive a technical failure.</li>
        </ul>
        <p>
          No system is completely secure. If a security incident affects your data, we will tell you promptly and act
          to fix it.
        </p>
      </>
    ),
  },
  {
    id: 'who-we-share-with',
    title: 'Who we share data with',
    body: (
      <>
        <p>We share your data only when it is necessary:</p>
        <ul>
          <li><strong>Doctors</strong> need your medical information to treat you.</li>
          <li><strong>Pharmacies</strong> need your prescription details to dispense your order.</li>
          <li><strong>Payment processors</strong> handle payments and do not see your medical information.</li>
          <li><strong>Delivery services</strong> need your address to deliver parcels and are not told what is inside.</li>
          <li><strong>Legal authorities</strong> receive data only where the law requires it.</li>
        </ul>
        <p>
          We <strong>never</strong> sell your data, whether to advertisers, data brokers or anyone else. Your medical
          information belongs to you.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your rights',
    body: (
      <>
        <p>Under the GDPR and other privacy laws, you have the right to:</p>
        <ul>
          <li><strong>Access:</strong> ask what data we hold about you;</li>
          <li><strong>Correction:</strong> have inaccurate information corrected;</li>
          <li><strong>Deletion:</strong> ask us to delete your data, although we may have to keep some records for legal reasons;</li>
          <li><strong>Portability:</strong> take your data to another provider;</li>
          <li><strong>Objection:</strong> object to certain uses of your data.</li>
        </ul>
        <p>To exercise any of these rights, contact us. We will not make it difficult.</p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies',
    body: (
      <>
        <p>
          We use cookies, small files stored by your browser, to make the website work, remember your preferences and
          keep you signed in.
        </p>
        <p>
          We use essential cookies, which the site needs to function, and analytics cookies, which show us how the site
          is used so we can improve it. You can control cookies in your browser settings, but turning them off may stop
          some features working, such as staying signed in.
        </p>
      </>
    ),
  },
  {
    id: 'data-retention',
    title: 'How long we keep data',
    body: (
      <>
        <p>
          We keep your data for as long as it is needed for your care. Medical records must be kept for a legally set
          period. If you delete your account, we delete or anonymise your data, except where the law requires us to
          keep it.
        </p>
        <p>
          Medical records are usually kept for several years; the exact period depends on the jurisdiction. We follow
          those requirements and delete data once we no longer need it.
        </p>
      </>
    ),
  },
  {
    id: 'international-transfers',
    title: 'International transfers',
    body: (
      <p>
        We are based in the UK, but some of the services we use, such as cloud providers, may store data in other
        countries. When they do, we make sure the data has an adequate level of protection.
      </p>
    ),
  },
  {
    id: 'childrens-privacy',
    title: "Children's privacy",
    body: (
      <p>
        Our services are for adults aged 18 and over, and we do not knowingly collect data from children. If you are a
        parent or guardian and believe your child has given us information, tell us and we will delete it immediately.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        We may update this policy when privacy law or our technology changes, and we will notify you when we do. If you
        keep using the service after a change, you accept the updated policy. If you do not agree with it, you can stop
        using the service.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us about privacy',
    body: (
      <>
        <p>For any privacy question, contact our privacy officer:</p>
        <LegalContact email="privacy@doktorabc.com" label="Privacy officer" />
        <p className="mt-4">
          You also have the right to complain to your data protection authority (in the UK, the Information
          Commissioner's Office) if you believe we have not respected your privacy rights.
        </p>
      </>
    ),
  },
]

const Privacy = () => (
  <LegalDocument
    title="Privacy policy"
    updated="January 2025"
    summary="We comply with the GDPR, encrypt your data and never sell it. Your medical information receives the highest level of protection we apply."
    sections={sections}
    closing="We are a healthcare company, and we treat your medical information with the care it deserves. If you have any concern about how we use your data, ask us and we will answer plainly."
  />
)

export default Privacy
