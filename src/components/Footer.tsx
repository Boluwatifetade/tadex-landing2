'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Twitter, Linkedin, Github, ArrowRight, ExternalLink } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        // show the error from backend if it exists
        alert(data?.error || 'Error sending email')
        return
      }

      setIsSubmitted(true)
      setEmail('')
      setTimeout(() => setIsSubmitted(false), 3000)
    } catch (err) {
      console.error('Network error:', err)
      alert('Network error')
    }
  }



  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'How it Works', href: '#how-it-works' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'FAQ', href: '#faq' }
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Security', href: '/security' }
    ]
  }

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/TadexTeam', label: 'Twitter' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/boluwatife-tade/', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/Boluwatifetade', label: 'GitHub' },
  { icon: Mail, href: 'mailto:tadex.team@gmail.com', label: 'Email' }


  ]



  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* brand + newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="mb-8">
              <div className="text-3xl font-bold text-[#004859] mb-4">Tadex</div>
              <p className="text-lg text-slate-600 max-w-md">
                Automate your crypto trading, eliminate emotions, and maximize profits with our advanced trading platform.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#004859] mb-4">Join the Waitlist</h3>
              <p className="text-slate-600 mb-4">Get early access and be the first to know when we launch.</p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex gap-3 max-w-md">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 border-slate-300 focus:border-[#004859] rounded-lg"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-[#004859] hover:bg-[#00323B] text-white px-6 py-2 rounded-lg font-medium group"
                  >
                    Join
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              ) : (
                <div className="flex items-center gap-2 text-[#00B894] font-medium">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Thanks! You&apos;re on the waitlist.
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-4">Follow us</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-slate-200 hover:bg-[#004859] text-slate-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* right links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* product */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Product</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-slate-600 hover:text-[#004859] transition-colors duration-200 flex items-center group"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* company */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-slate-600 hover:text-[#004859] transition-colors duration-200 flex items-center group"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* legal */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-slate-600 hover:text-[#004859] transition-colors duration-200 flex items-center group"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-slate-600 text-sm">© 2025 Tadex. All rights reserved.</div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00B894] rounded-full animate-pulse"></div>
                All systems operational
              </span>
              <span>Made with ❤️ for traders</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
