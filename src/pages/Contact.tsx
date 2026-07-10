import { useState, type FormEvent } from 'react';
import { Mail, Send } from 'lucide-react';

const contactEmail = 'hello@pixelbeads.design';

export function Contact() {
  const [status, setStatus] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();
    const subject = encodeURIComponent(`PixelBeads message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

    setStatus('Opening your email app with the message ready to send...');
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="bg-[#1a1a1a] min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e8e6e3] mb-4">Contact Us</h1>
        <p className="text-[#9a948d] mb-3">
          Send feedback, feature requests, or questions about PixelBeads.
        </p>
        <a href={`mailto:${contactEmail}`} className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-[#d4a574] hover:text-[#e3b984]">
          <Mail className="h-4 w-4" />
          {contactEmail}
        </a>

        <form className="craft-card p-6 space-y-4" onSubmit={handleSubmit}>
          <label htmlFor="contact-name" className="block">
            <span className="block text-sm text-[#a09b94] mb-2">Name</span>
            <input id="contact-name" name="name" required autoComplete="name" className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-3 py-2 text-[#e8e6e3] outline-none focus:border-[#d4a574]" />
          </label>
          <label htmlFor="contact-email" className="block">
            <span className="block text-sm text-[#a09b94] mb-2">Email</span>
            <input id="contact-email" name="email" type="email" required autoComplete="email" className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-3 py-2 text-[#e8e6e3] outline-none focus:border-[#d4a574]" />
          </label>
          <label htmlFor="contact-message" className="block">
            <span className="block text-sm text-[#a09b94] mb-2">Message</span>
            <textarea id="contact-message" name="message" required minLength={10} rows={6} className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-3 py-2 text-[#e8e6e3] outline-none focus:border-[#d4a574]" />
          </label>
          <button type="submit" className="craft-btn inline-flex items-center gap-2 px-5 py-2.5">
            <Send className="h-4 w-4" />
            Prepare Email
          </button>
          {status && <p role="status" className="text-sm text-[#a09b94]">{status}</p>}
        </form>
      </div>
    </main>
  );
}
