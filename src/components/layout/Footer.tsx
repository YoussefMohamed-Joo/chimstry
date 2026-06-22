import Link from 'next/link';
import { Atom, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaYoutube, FaTelegram } from 'react-icons/fa';

const quickLinks = [
  { href: '/about', label: 'عن كيمستري' },
  { href: '/courses', label: 'جميع الدورات' },
  { href: '/blog', label: 'المدونة' },
  { href: '/faq', label: 'الأسئلة الشائعة' },
  { href: '/contact', label: 'اتصل بنا' },
];

const categories = [
  { href: '/courses?category=organic', label: 'الكيمياء العضوية' },
  { href: '/courses?category=inorganic', label: 'الكيمياء غير العضوية' },
  { href: '/courses?category=physical', label: 'الكيمياء الفيزيائية' },
  { href: '/courses?category=analytical', label: 'الكيمياء التحليلية' },
];

const contactItems = [
  { icon: Mail, text: 'info@chimstry.com', href: 'mailto:info@chimstry.com' },
  { icon: Phone, text: '+966 55 123 4567', href: 'tel:+966551234567' },
  { icon: MapPin, text: 'الرياض، المملكة العربية السعودية' },
];

const socialLinks = [
  { icon: FaFacebook, href: '#', hoverColor: 'hover:text-blue-500' },
  { icon: FaTwitter, href: '#', hoverColor: 'hover:text-sky-400' },
  { icon: FaYoutube, href: '#', hoverColor: 'hover:text-red-500' },
  { icon: FaTelegram, href: '#', hoverColor: 'hover:text-sky-500' },
];

export default function Footer() {
  return (
    <footer dir="rtl" className="relative bg-[#0B1E3D]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-sm" />
                <Atom className="w-6 h-6 text-cyan-400 relative z-10" />
              </div>
              <span className="text-xl font-bold text-white">كيمستري</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              منصة تعليمية متخصصة في علوم الكيمياء، نقدم محتوى تفاعلي وشامل لطلاب الكيمياء في جميع المراحل التعليمية.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ icon: Icon, href, hoverColor }) => (
                <Link
                  key={href}
                  href={href}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 ${hoverColor} hover:bg-white/10 transition-all`}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">روابط سريعة</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 text-sm transition-all duration-200 hover:pr-1 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">التصنيفات</h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-gray-400 hover:text-cyan-400 text-sm transition-all duration-200 hover:pr-1 block"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">معلومات الاتصال</h3>
            <ul className="space-y-4">
              {contactItems.map((item) => (
                <li key={item.text}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 text-sm transition-all"
                    >
                      <item.icon className="w-4 h-4 text-cyan-400 shrink-0" />
                      {item.text}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-3 text-gray-400 text-sm">
                      <item.icon className="w-4 h-4 text-cyan-400 shrink-0" />
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} كيمستري. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
