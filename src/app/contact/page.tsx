import MarketingPage from '@/components/common/MarketingPage';
import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <MarketingPage title="Contact Us" subtitle="We'd love to hear from you">
  <p>Email us at <a className="underline" href="mailto:marginkidz@gmail.com">marginkidz@gmail.com</a> or use the form below.</p>
      <ContactForm />
    </MarketingPage>
  );
}


