import { FaInstagram, FaThreads, FaTiktok } from 'react-icons/fa6';

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/salsa_coreana/',
    Icon: FaInstagram,
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@salsa_coreana?_r=1&_t=ZS-95XpCKR6YGW&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGnmSXk5oG8F7FylKcH1saZzWE9QxNAM3GcQCRA516ecix70zCigjD9g_dW3BQ_aem_mG3y_aIChRdJ3o8rheAACw',
    Icon: FaTiktok,
  },
  {
    name: 'Threads',
    href: 'https://www.threads.com/@salsa_coreana',
    Icon: FaThreads,
  },
] as const;

export default function Footer() {
  return (
    <footer className="bg-neutral-950 px-5 py-12 text-white sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-white/60">© 2026 MOKDA. Todos los derechos reservados.</p>

        <div className="flex items-center gap-4">
          {socialLinks.map(({ name, href, Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="text-white transition-colors hover:text-gray-300"
            >
              <Icon aria-hidden="true" className="h-6 w-6" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
