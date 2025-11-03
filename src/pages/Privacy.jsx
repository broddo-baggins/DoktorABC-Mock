import React from 'react'
import { Shield, Lock, Eye, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Lock className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-xl text-gray-600">How we handle your data (spoiler: we're very careful)</p>
        <p className="text-sm text-gray-500 mt-2">Last updated: January 2025</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  <strong>Your Privacy Matters:</strong> We take data protection seriously. We're GDPR compliant, use encryption, 
                  and we definitely don't sell your data to sketchy third parties. Your medical information is especially protected 
                  because, well, it's medical information.
                </p>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 text-primary-600 mr-2" />
                1. What Data We Collect (And Why)
              </h2>
              <p className="text-gray-700 mb-4">
                We collect information you give us (like your name, email, and medical history) because we need it to provide 
                healthcare services. We're not being nosy—it's kind of hard to prescribe medication without knowing what's wrong.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Personal Information:</strong> Name, email, phone number, date of birth, address. Standard stuff that 
                every healthcare provider needs.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Health Information:</strong> Medical history, symptoms, consultation notes, prescriptions. This is 
                sensitive data, and we treat it as such. We don't store it on sticky notes or shout it from rooftops.
              </p>
              <p className="text-gray-700">
                <strong>Technical Information:</strong> IP address, browser type, device info. We use this to make sure our 
                website works properly and to catch any suspicious activity (like someone trying to hack us).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 text-primary-600 mr-2" />
                2. How We Use Your Data
              </h2>
              <p className="text-gray-700 mb-4">
                We use your data to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">
                <li>Provide healthcare services (obviously)</li>
                <li>Process payments (because free healthcare isn't free for us)</li>
                <li>Send you appointment reminders (so you don't forget)</li>
                <li>Improve our services (we're always trying to get better)</li>
                <li>Comply with legal requirements (laws exist, and we follow them)</li>
              </ul>
              <p className="text-gray-700">
                We <strong>don't</strong> use your data to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">
                <li>Spam you with irrelevant emails (we hate spam too)</li>
                <li>Sell to data brokers (that's not cool)</li>
                <li>Create targeted ads based on your medical conditions (that would be creepy)</li>
                <li>Share with your ex (that's just mean)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 text-primary-600 mr-2" />
                3. How We Protect Your Data
              </h2>
              <p className="text-gray-700 mb-4">
                We use industry-standard security measures because your privacy is important. Think encryption, secure servers, 
                regular security audits—the whole shebang. We're more secure than Fort Knox (though we don't store gold, just 
                medical records).
              </p>
              <p className="text-gray-700 mb-4">
                Our servers are protected better than a dragon's hoard. We use:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">
                <li>256-bit SSL encryption (very strong encryption)</li>
                <li>Regular security updates (we patch vulnerabilities faster than you can say "data breach")</li>
                <li>Access controls (not everyone can see your data—only authorized staff)</li>
                <li>Backup systems (because technology sometimes breaks)</li>
              </ul>
              <p className="text-gray-700">
                However, no system is 100% secure (even Fort Knox has been breached in movies). We do our best, but if 
                something happens, we'll let you know immediately and fix it ASAP.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 text-primary-600 mr-2" />
                4. Who We Share Data With
              </h2>
              <p className="text-gray-700 mb-4">
                We're not gossipy. We only share your data when necessary:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">
                <li><strong>Doctors:</strong> They need your medical info to treat you (obviously)</li>
                <li><strong>Pharmacies:</strong> They need your prescription details to fulfill orders</li>
                <li><strong>Payment Processors:</strong> They process payments (they don't see your medical info)</li>
                <li><strong>Delivery Services:</strong> They need your address to deliver packages (they don't know what's inside)</li>
                <li><strong>Legal Authorities:</strong> Only if required by law (we're not criminals, but we follow the law)</li>
              </ul>
              <p className="text-gray-700">
                We <strong>never</strong> sell your data. Not to advertisers, not to data brokers, not to sketchy companies. 
                Your medical information is yours, and we respect that.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                5. Your Rights (You Have Some)
              </h2>
              <p className="text-gray-700 mb-4">
                Under GDPR and other privacy laws, you have rights:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">
                <li><strong>Access:</strong> You can ask what data we have about you</li>
                <li><strong>Correction:</strong> You can fix incorrect information</li>
                <li><strong>Deletion:</strong> You can ask us to delete your data (though we might need to keep some for legal reasons)</li>
                <li><strong>Portability:</strong> You can take your data elsewhere (we're not clingy)</li>
                <li><strong>Objection:</strong> You can object to certain uses of your data</li>
              </ul>
              <p className="text-gray-700">
                To exercise these rights, just contact us. We'll help you out (and we won't make it difficult, promise).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                6. Cookies (Not the Chocolate Chip Kind)
              </h2>
              <p className="text-gray-700 mb-4">
                We use cookies to make our website work properly. No, not the delicious kind—these are small files that help 
                us remember your preferences and keep you logged in.
              </p>
              <p className="text-gray-700">
                We use essential cookies (needed for the site to work) and analytics cookies (to see how people use our site 
                so we can improve it). You can control cookies through your browser settings, but turning them off might break 
                some features (like staying logged in).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 text-primary-600 mr-2" />
                7. Data Retention (How Long We Keep Stuff)
              </h2>
              <p className="text-gray-700 mb-4">
                We keep your data as long as necessary for healthcare purposes (which can be a while, because medical records 
                need to be kept for legal reasons). If you delete your account, we'll delete or anonymize your data, except 
                where we're legally required to keep it.
              </p>
              <p className="text-gray-700">
                Medical records are typically kept for several years (it varies by jurisdiction). We follow legal requirements, 
                but we're not hoarders—we delete what we can when we can.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                8. International Transfers
              </h2>
              <p className="text-gray-700">
                We're based in the UK, but we might use services that store data elsewhere (like cloud providers). When we do, 
                we make sure those services have adequate protection. We don't just dump your data anywhere—we're responsible 
                about it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                9. Children's Privacy
              </h2>
              <p className="text-gray-700">
                Our services are for adults 18+. We don't knowingly collect data from children. If you're a parent and think 
                your child has given us information, let us know and we'll delete it immediately. We're not in the business 
                of collecting kids' data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                10. Changes to This Policy
              </h2>
              <p className="text-gray-700">
                We might update this policy occasionally (privacy laws change, technology evolves, etc.). When we do, we'll 
                notify you. If you keep using our service, you're agreeing to the updated policy. If you don't like the changes, 
                you can stop using our service (though we hope you won't).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                11. Contact Us About Privacy
              </h2>
              <p className="text-gray-700 mb-4">
                Questions about privacy? We're here to help:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Privacy Officer:</strong> privacy@doktorabc.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +44 20 7123 4567</p>
                <p className="text-gray-700"><strong>Address:</strong> Sky Marketing Ltd., Office 219, LABS Atrium, London, UK, NW1 8AH</p>
              </div>
              <p className="text-gray-700 mt-4">
                You also have the right to complain to your local data protection authority if you think we've violated your 
                privacy rights. We hope it doesn't come to that, but it's your right.
              </p>
            </section>

            <div className="mt-12 p-6 bg-primary-50 rounded-lg border-2 border-primary-200">
              <p className="text-sm text-gray-700 text-center">
                <strong>Bottom Line:</strong> We respect your privacy and protect your data. We're not sketchy data brokers—we're 
                a healthcare company that happens to understand technology. Your medical information is sensitive, and we treat it 
                accordingly. If you have concerns, just ask. We're transparent (unlike some companies). 🔒
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Privacy

