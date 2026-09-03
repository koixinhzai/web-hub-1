// Danh mục dịch vụ hiển thị trên nav-bar.
// slug = null ứng với "Trang chủ": hiển thị tất cả các loại dịch vụ.
// Mỗi spa trong data/spas.js khai báo mảng `categories` chứa các slug bên dưới
// để xác định nó thuộc (những) danh mục nào.

export const categories = [
  { label: 'Home', slug: null, title: 'Home' },
  { label: 'VIP Spas', slug: 'vip', title: 'VIP SPAS' },
  { label: 'Therapists', slug: 'therapists', title: 'THERAPISTS' },
  { label: 'Massage Types', slug: 'massage-types', title: 'MASSAGE TYPES' },
  { label: 'Top Rated', slug: 'top-rated', title: 'TOP RATED' },
  { label: 'City Guide', slug: 'city-guide', title: 'CITY GUIDE' },
  { label: 'Spa Chains', slug: 'spa-chains', title: 'SPA CHAINS' },
  { label: 'Male Therapists', slug: 'male-therapists', title: 'MALE THERAPISTS' },
  { label: 'Videos', slug: 'videos', title: 'VIDEOS' },
  { label: 'Advertise', slug: 'advertise', title: 'ADVERTISE' },
  { label: 'Reviews', slug: 'reviews', title: 'REVIEWS' },
  { label: 'Blacklist', slug: 'blacklist', title: 'BLACKLIST' },
]

export const findCategory = (slug) => categories.find((c) => c.slug === slug)
