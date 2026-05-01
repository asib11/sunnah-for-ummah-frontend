import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-xl font-bold mb-3">Sunnah for Ummah</h3>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
              Reviving the Sunnah through modest, stylish clothing. Spread Dawah, Look Good.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Shop", "New Arrivals", "Best Sellers", "About Us"].map((link) => (
                <li key={link}>
                  <a href="#" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {["Track Order", "Return Policy", "Shipping Info", "FAQs"].map((link) => (
                <li key={link}>
                  <a href="#" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-foreground/70" />
                <span className="font-body text-sm text-primary-foreground/70">+880 1XXX-XXXXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-foreground/70" />
                <span className="font-body text-sm text-primary-foreground/70">info@sunnahforummah.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-foreground/70" />
                <span className="font-body text-sm text-primary-foreground/70">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center">
          <p className="font-body text-xs text-primary-foreground/50">
            © 2026 Sunnah for Ummah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
