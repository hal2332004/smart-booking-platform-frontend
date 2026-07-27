import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

export function SEO({ title, description, image }: SEOProps) {
  const { language } = useI18n();

  useEffect(() => {
    // 1. Update Document Title
    const defaultTitle =
      language === 'vi'
        ? 'SmartBooking — Cho thuê căn hộ cao cấp & Căn hộ dịch vụ tại Đà Nẵng'
        : 'SmartBooking — Premium Apartment Rentals in Da Nang';

    const pageTitle = title ? `${title} | SmartBooking` : defaultTitle;
    document.title = pageTitle;

    // 2. Update Meta Description
    const defaultDesc =
      language === 'vi'
        ? 'Nền tảng tìm kiếm và cho thuê căn hộ, chung cư cao cấp, căn hộ dịch vụ uy tín tại Đà Nẵng. Thông tin đã được xác minh 100%, giá thuê minh bạch, hỗ trợ đặt xem phòng 24/7.'
        : 'Discover verified, premium apartments and serviced rentals across Da Nang, Vietnam. Transparent pricing, direct landlord contact, and flexible viewings.';

    const pageDesc = description || defaultDesc;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', pageDesc);

    // 3. Update OG Meta Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);

    if (image) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) ogImage.setAttribute('content', image);
    }
  }, [title, description, image, language]);

  return null;
}
