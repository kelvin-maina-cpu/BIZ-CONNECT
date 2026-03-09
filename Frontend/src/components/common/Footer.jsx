export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Biz Connet</h3>
            <p className="text-gray-400 text-sm">
              Connecting talented students with amazing opportunities.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/gigs" className="hover:text-white">Browse Gigs</a></li>
              <li><a href="/register" className="hover:text-white">Join as Student</a></li>
              <li><a href="/register" className="hover:text-white">Hire Talent</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">support@bizconnet.com</p>
            <p className="text-gray-400 text-sm">km542454@gmail.com</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          © 2026 Biz Connet. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
