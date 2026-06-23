import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const quickLinks = [
  { href: '/about', label: 'عن كيمستري' },
  { href: '/courses', label: 'جميع الدورات' },
  { href: '/lab', label: 'المعمل التفاعلي' },
  { href: '/faq', label: 'الأسئلة الشائعة' },
];

const categories = [
  { href: '/courses?category=organic', label: 'الكيمياء العضوية' },
  { href: '/courses?category=inorganic', label: 'الكيمياء غير العضوية' },
  { href: '/courses?category=physical', label: 'الكيمياء الفيزيائية' },
  { href: '/courses?category=analytical', label: 'الكيمياء التحليلية' },
];

const contactItems = [
  { icon: Mail, text: 'youssef@chimstry.com', href: 'mailto:youssef@chimstry.com' },
  { icon: Phone, text: '01033558125', href: 'https://wa.me/201033558125' },
  { icon: MapPin, text: 'بني سويف، مصر' },
];

export default function Footer() {
  return (
    <footer dir="rtl" className="bg-white border-t border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <span className="text-xl font-bold text-[#1e40af]">كيمستري</span>
            <p className="text-[#475569] text-sm leading-relaxed">
              منصة تعليمية متخصصة في علوم الكيمياء، نقدم محتوى تفاعلي وشامل لطلاب الكيمياء في جميع المراحل التعليمية.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[#1e293b] font-bold text-base">روابط سريعة</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#475569] hover:text-[#1e40af] text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[#1e293b] font-bold text-base">التصنيفات</h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-[#475569] hover:text-[#1e40af] text-sm transition-colors duration-200"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[#1e293b] font-bold text-base">معلومات الاتصال</h3>
            <ul className="space-y-3">
              {contactItems.map((item) => (
                <li key={item.text}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-[#475569] hover:text-[#1e40af] text-sm transition-colors"
                    >
                      <item.icon className="w-4 h-4 text-[#1e40af] shrink-0" />
                      {item.text}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-2 text-[#475569] text-sm">
                      <item.icon className="w-4 h-4 text-[#1e40af] shrink-0" />
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e5e7eb] text-center">
          <p className="text-[#94a3b8] text-sm">
            © {new Date().getFullYear()} كيمستري. جميع الحقوق محفوظة.
          </p>
          <p className="text-[#94a3b8] text-xs mt-1">
            صمم وطور بواسطة <span className="text-[#1e40af]">المهندس يوسف محمد حسين</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
