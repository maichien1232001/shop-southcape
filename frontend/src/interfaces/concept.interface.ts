export interface Hotspot {
  productId: string;
  x: number; // vị trí % từ bên trái (0 - 100)
  y: number; // vị trí % từ bên trên (0 - 100)
}

export interface Lookbook {
  id: string;
  image: string; // đường dẫn đến ảnh chụp lookbook
  hotspots: Hotspot[];
  title?: string;
  description?: string;
}

export interface Concept {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  lookbooks: Lookbook[];
  tags: string[];
  themeColor: string; // Màu nền chủ đạo (Tailwind class)
  accentColor: string; // Màu viền/chữ nhấn (Tailwind class)
}
