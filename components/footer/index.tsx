import Link from 'next/link';

export const Footer = () => (
  <footer className="bg-foreground text-background py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">AnyLangPod</h3>
          <p className="text-background/80">AI-powered language learning through news podcasts</p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-4">Product</h4>
          <ul className="space-y-2">
            <li><Link href="#features" className="hover:text-background/80 transition-colors">Features</Link></li>
            <li><Link href="#pricing" className="hover:text-background/80 transition-colors">Pricing</Link></li>
            <li><Link href="#testimonials" className="hover:text-background/80 transition-colors">Testimonials</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-4">Company</h4>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-background/80 transition-colors">About</Link></li>
            <li><Link href="/blog" className="hover:text-background/80 transition-colors">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-background/80 transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><Link href="/privacy" className="hover:text-background/80 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-background/80 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
        <p>&copy; 2024 AnyLangPod. All rights reserved.</p>
      </div>
    </div>
  </footer>
); 