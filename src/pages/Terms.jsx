import React from 'react'
import { Shield, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
        <p className="text-xl text-gray-600">The fine print that makes lawyers happy</p>
        <p className="text-sm text-gray-500 mt-2">Last updated: January 2025</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> By using DoktorABC, you agree to these terms. We've tried to make them readable, but they're still legally binding. We recommend reading them while enjoying a cup of tea.
                </p>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                1. Welcome to DoktorABC
              </h2>
              <p className="text-gray-700 mb-4">
                Congratulations! You've found us. DoktorABC is an online healthcare platform that connects you with qualified doctors, 
                pharmacies, and treatments. Think of us as your friendly neighborhood doctor's office, but online and open 24/7 
                (well, almost—doctors need sleep too).
              </p>
              <p className="text-gray-700">
                By accessing our services, you're agreeing to play by our rules. Don't worry, they're mostly common sense stuff 
                like "don't be mean" and "use our service as intended."
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                2. You Must Be Old Enough (And Human)
              </h2>
              <p className="text-gray-700 mb-4">
                You must be at least 18 years old to use our services. Sorry, kids—this isn't a playground. Also, you must be a 
                real, living, breathing human being. No bots, no aliens (unless you have valid Earth identification), and definitely 
                no sentient AI trying to get prescriptions.
              </p>
              <p className="text-gray-700">
                If you're using our service on behalf of someone else, make sure you have their permission. We take identity 
                verification seriously—it's kind of important when dealing with healthcare.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                3. Honesty is the Best Policy
              </h2>
              <p className="text-gray-700 mb-4">
                When filling out medical questionnaires, please tell the truth. We know it's tempting to say you're super healthy 
                to get that approval faster, but lying about your medical history is like trying to fix a leaky faucet with 
                duct tape—it might work temporarily, but you'll regret it later.
              </p>
              <p className="text-gray-700">
                Our doctors need accurate information to provide safe treatment. Plus, they're trained to spot inconsistencies 
                (they didn't go to medical school for nothing). So save everyone time and be honest.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                4. Payment Terms (The Money Part)
              </h2>
              <p className="text-gray-700 mb-4">
                We accept various payment methods because we're modern like that. When you pay for a consultation or treatment, 
                that payment is processed faster than you can say "credit card declined" (hopefully that doesn't happen).
              </p>
              <p className="text-gray-700 mb-4">
                All prices are in your local currency (or Euros, because we're fancy). If you see a price that seems too good 
                to be true, double-check—we're not running a "buy one, get ten free" sale (unfortunately).
              </p>
              <p className="text-gray-700">
                Refunds are handled on a case-by-case basis. We're reasonable people, but "I changed my mind after getting 
                treated" isn't typically a valid reason for a refund. Think of it like getting a haircut—you can't return it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                5. Consultations Are Real, Not Magic
              </h2>
              <p className="text-gray-700 mb-4">
                Our video consultations are conducted by actual, qualified doctors. They're not AI chatbots pretending to be 
                doctors (though that would be impressive technology). They went to medical school, passed exams, and everything.
              </p>
              <p className="text-gray-700">
                However, even the best doctors can't diagnose everything through a screen. If your doctor says you need an 
                in-person visit, please listen. They're not trying to ruin your day—they're trying to keep you healthy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                6. Prescriptions and Medications
              </h2>
              <p className="text-gray-700 mb-4">
                If a doctor prescribes you medication, it's because they think it's appropriate for your condition. Please 
                follow the instructions. We know the package insert has tiny text, but it's there for a reason.
              </p>
              <p className="text-gray-700 mb-4">
                Don't share your medications with others. Yes, even if your friend has "the same thing." Medicine isn't 
                one-size-fits-all, and sharing prescriptions is illegal in most places (and just generally a bad idea).
              </p>
              <p className="text-gray-700">
                If you experience side effects, contact us or your doctor immediately. Don't wait until your condition worsens 
                or you've developed superpowers (though that would be cool, it's probably just an allergic reaction).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 text-primary-600 mr-2" />
                7. Your Responsibilities
              </h2>
              <p className="text-gray-700 mb-4">
                You're responsible for keeping your account secure. Use a strong password—"password123" doesn't count. If 
                someone hacks your account and orders treatments, that's on you (and possibly them, but mostly you).
              </p>
              <p className="text-gray-700">
                You're also responsible for providing accurate delivery information. If your package goes to the wrong address 
                because you typo'd your postcode, we'll help, but please double-check next time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                8. Our Limitations (The Legal CYA Section)
              </h2>
              <p className="text-gray-700 mb-4">
                While we do our best to provide excellent service, we can't guarantee that:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">
                <li>The website will never have a hiccup (even Netflix goes down sometimes)</li>
                <li>Your package will arrive via teleportation (we're working on it, but logistics is hard)</li>
                <li>Treatment results will exceed your wildest dreams (though we hope they do)</li>
                <li>Our customer service will always answer in under 2 seconds (we're human, not robots)</li>
              </ul>
              <p className="text-gray-700">
                We're not liable for things outside our control. Acts of God, alien invasions, internet outages, your 
                cat unplugging your router—these things happen, and they're not our fault.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                9. Changes to Terms
              </h2>
              <p className="text-gray-700">
                We might update these terms occasionally. When we do, we'll let you know (probably via email, not carrier pigeon). 
                If you keep using our service after changes, you're agreeing to the new terms. If you don't like them, you can 
                stop using our service (though we hope you won't).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                10. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these terms (or anything else), reach out to us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> legal@doktorabc.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +44 20 7123 4567</p>
                <p className="text-gray-700"><strong>Address:</strong> Sky Marketing Ltd., Office 219, LABS Atrium, London, UK, NW1 8AH</p>
              </div>
            </section>

            <div className="mt-12 p-6 bg-primary-50 rounded-lg border-2 border-primary-200">
              <p className="text-sm text-gray-700 text-center">
                <strong>Remember:</strong> These terms exist to protect both you and us. We're not trying to be difficult—we 
                just want everyone to be safe and happy. If something seems unclear, just ask. We're here to help! 🏥
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Terms

