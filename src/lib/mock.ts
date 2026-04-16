export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
}

export const CATEGORIES = [
  "Elektronik",
  "Moda",
  "Ev & Yaşam",
  "Spor",
  "Hobi"
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "kablosuz-kulaklik-pro",
    name: "Kablosuz Kulaklık Pro",
    price: 1299.90,
    category: "Elektronik",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    description: "Yüksek ses kalitesi ve gürültü engelleme özelliği.",
    rating: 4.5
  },
  {
    id: "2",
    slug: "akilli-saat-v2",
    name: "Akıllı Saat V2",
    price: 3499.00,
    category: "Elektronik",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    description: "Tüm gün pil ömrü ve sağlık takibi.",
    rating: 4.8
  },
  {
    id: "3",
    slug: "spor-ayakkabi-runner",
    name: "Spor Ayakkabı Runner",
    price: 899.50,
    category: "Moda",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    description: "Hafif ve rahat koşu ayakkabısı.",
    rating: 4.2
  },
  {
    id: "4",
    slug: "modern-masa-lambasi",
    name: "Modern Masa Lambası",
    price: 450.00,
    category: "Ev & Yaşam",
    image: "https://images.unsplash.com/photo-1507473888900-52e1adad5481?w=500&q=80",
    description: "Ayarlanabilir parlaklık ve şık tasarım.",
    rating: 4.0
  },
  {
    id: "5",
    slug: "yoga-mati-premium",
    name: "Yoga Matı Premium",
    price: 299.90,
    category: "Spor",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80",
    description: "Kaymaz yüzeyli profesyonel yoga matı.",
    rating: 4.7
  }
];
