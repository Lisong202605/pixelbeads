export function Contact() {
  return (
    <main className="bg-[#1a1a1a] min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e8e6e3] mb-4">Contact Us</h1>
        <p className="text-[#6b6560] mb-10">
          Send feedback, feature requests, or questions about PixelBeads.
        </p>
        <form className="craft-card p-6 space-y-4" onSubmit={(event) => event.preventDefault()}>
          <label className="block">
            <span className="block text-sm text-[#a09b94] mb-2">Name</span>
            <input className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-3 py-2 text-[#e8e6e3] outline-none focus:border-[#d4a574]" />
          </label>
          <label className="block">
            <span className="block text-sm text-[#a09b94] mb-2">Email</span>
            <input type="email" className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-3 py-2 text-[#e8e6e3] outline-none focus:border-[#d4a574]" />
          </label>
          <label className="block">
            <span className="block text-sm text-[#a09b94] mb-2">Message</span>
            <textarea rows={6} className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-3 py-2 text-[#e8e6e3] outline-none focus:border-[#d4a574]" />
          </label>
          <button type="submit" className="craft-btn px-5 py-2.5">Send Message</button>
        </form>
      </div>
    </main>
  );
}
