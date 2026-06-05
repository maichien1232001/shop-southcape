import { Product } from '../interfaces/product.interface';
import { Concept } from '../interfaces/concept.interface';

export const PRODUCTS: Product[] = [
  {
    id: 'prod_pleated_skirt',
    sku: 'SKU-WOM-PLEATED-001',
    name: {
      vi: 'Chân váy xếp ly dệt kim Southcape',
      en: 'Southcape Pleated Knit Skirt',
      ja: 'サウスケープ プリーツ ニット スカート'
    },
    description: {
      vi: 'Chân váy xếp ly dệt kim cao cấp phong cách thể thao thanh lịch, sử dụng chất liệu vải co giãn 4 chiều kháng khuẩn, thoáng mát tối ưu cho hoạt động golf.',
      en: 'Premium knit pleated skirt with elegant sporty style, featuring antibacterial 4-way stretch fabric optimized for golf activities.',
      ja: '抗菌・4方向ストレッチ生地を採用し、ゴルフ向けに最適化されたエレガントなスポーツスタイルのプリーツニットスカート。'
    },
    prices: {
      USD: { price: 185, compare_at_price: 220 },
      VND: { price: 4625000, compare_at_price: 5500000 }
    },
    details: [
      'Chất liệu: 82% Polyester, 18% Polyurethane',
      'Công nghệ dệt kim giữ nếp ly sắc nét sau nhiều lần giặt',
      'Tích hợp quần bảo hộ mềm mịn co giãn bên trong',
      'Thiết kế cạp cao tôn dáng'
    ],
    category: 'women',
    subCategory: 'Skirt',
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop'
    ],
    colors: ['Off-White', 'Navy Blue', 'Soft Beige'],
    sizes: ['S', 'M', 'L'],
    inventory: 45,
    status: 'active',
    rating: 4.8,
    reviewsCount: 24,
    inStock: true
  },
  {
    id: 'prod_navy_vest',
    sku: 'SKU-WOM-VEST-002',
    name: {
      vi: 'Áo Gile dệt kim gân nổi Southcape',
      en: 'Southcape Signature Ribbed Vest',
      ja: 'サウスケープ シグネチャー リブ ベスト'
    },
    description: {
      vi: 'Áo gile dệt kim gân nổi phom dáng ôm vừa vặn, thích hợp mặc phối ngoài áo polo tạo điểm nhấn tinh tế đậm chất "Quiet Luxury" trên sân golf.',
      en: 'Ribbed knit vest in a custom-tailored slim fit, perfect for layering over polo shirts to create a subtle Quiet Luxury statement on the course.',
      ja: '体に程よくフィットするリブ編みニットベスト。ポロシャツと重ねることで、ゴルフ場での静かなラグジュアリー（Quiet Luxury）を表現。'
    },
    prices: {
      USD: { price: 145 },
      VND: { price: 3625000 }
    },
    details: [
      'Chất liệu: 100% Sợi Cotton Mercerized siêu mềm',
      'Họa tiết gân dệt nổi tạo hiệu ứng chiều sâu trực quan',
      'Bo cổ chữ V sâu vừa phải lịch sự',
      'Thoáng khí, thấm hút mồ hôi tốt'
    ],
    category: 'women',
    subCategory: 'Knitwear',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=600&auto=format&fit=crop'
    ],
    colors: ['Deep Navy', 'Off-White', 'Forest Green'],
    sizes: ['S', 'M', 'L'],
    inventory: 30,
    status: 'active',
    rating: 4.9,
    reviewsCount: 18,
    inStock: true
  },
  {
    id: 'prod_white_polo',
    sku: 'SKU-WOM-POLO-003',
    name: {
      vi: 'Áo Polo thể thao tối giản hiệu năng',
      en: 'Performance Minimalist Polo',
      ja: 'パフォーマンス ミニマリスト ポロ'
    },
    description: {
      vi: 'Áo polo cộc tay chất liệu thể thao cao cấp siêu nhẹ, thiết kế cổ trụ khóa kéo ẩn tinh tế mang lại vẻ ngoài hiện đại tối giản.',
      en: 'Ultralight performance polo shirt with short sleeves, featuring a zipper collar tab for a modern minimalist look.',
      ja: '超軽量で機能的な半袖ポロシャツ。ジッパー式の襟元が特徴で、現代的かつミニマルな印象を与えます。'
    },
    prices: {
      USD: { price: 125, compare_at_price: 145 },
      VND: { price: 3125000, compare_at_price: 3625000 }
    },
    details: [
      'Chất liệu: 88% Nylon, 12% Spandex',
      'Công nghệ làm mát tức thì và kháng UV UPF 50+',
      'Khóa kéo YKK ẩn thời thượng',
      'Phom áo ôm nhẹ thoải mái khi swing'
    ],
    category: 'women',
    subCategory: 'Polo',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop'
    ],
    colors: ['Off-White', 'Soft Pink', 'Dark Charcoal'],
    sizes: ['S', 'M', 'L', 'XL'],
    inventory: 60,
    status: 'active',
    rating: 4.7,
    reviewsCount: 32,
    inStock: true
  },
  {
    id: 'prod_golf_visor',
    sku: 'SKU-ACC-VISOR-004',
    name: {
      vi: 'Mũ visor viền da AeroLeather',
      en: 'AeroLeather Shield Visor',
      ja: 'エアロレザー シールド バイザー'
    },
    description: {
      vi: 'Mũ lưỡi trai nửa đầu (visor) phối viền da cừu cao cấp, bảo vệ mắt khỏi ánh nắng mặt trời mà vẫn thông thoáng da đầu hiệu quả.',
      en: 'Visor cap detailed with premium sheepskin leather trims, protecting the eyes from direct sunlight while keeping the head cool.',
      ja: '高級ラムスキンレザーのトリムをあしらったサンバイザー。直射日光から目を保護しつつ、蒸れを防ぎます。'
    },
    prices: {
      USD: { price: 65 },
      VND: { price: 1625000 }
    },
    details: [
      'Chất liệu: Cotton Canvas kết hợp Da thật',
      'Quai cài phía sau thun co giãn thêu nổi chữ Southcape',
      'Lớp lót trán thấm hút mồ hôi nhanh, không gây kích ứng da'
    ],
    category: 'accessories',
    subCategory: 'Cap',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=600&auto=format&fit=crop'
    ],
    colors: ['Pure White', 'Midnight Navy', 'Caramel Leather'],
    sizes: ['One Size'],
    inventory: 150,
    status: 'active',
    rating: 4.6,
    reviewsCount: 15,
    inStock: true
  },
  {
    id: 'prod_tote_bag',
    sku: 'SKU-ACC-TOTE-005',
    name: {
      vi: 'Túi du lịch Southcape Canvas Weekend',
      en: 'Southcape Canvas Weekend Tote',
      ja: 'サウスケープ キャンバス ウィークエンド トート'
    },
    description: {
      vi: 'Túi tote du lịch cỡ vừa chế tác từ vải canvas dệt dày dặn chống thấm nhẹ kết hợp quai xách da bò thượng hạng.',
      en: 'Medium-sized travel tote crafted from thick, water-resistant canvas, combined with premium cowhide leather handles.',
      ja: '撥水加工を施した肉厚なキャンバス地と、高級牛革ハンドルを組み合わせたミディアmサイズのトラベルトート。'
    },
    prices: {
      USD: { price: 220, compare_at_price: 260 },
      VND: { price: 5500000, compare_at_price: 6500000 }
    },
    details: [
      'Chất liệu: Heavyweight Cotton Canvas & Genuine Leather',
      'Ngăn chứa đồ siêu rộng có khóa kéo an toàn',
      'Nhiều ngăn nhỏ bên trong để bóng golf, tee và ví cá nhân',
      'Kích thước: 38cm x 30cm x 15cm'
    ],
    category: 'accessories',
    subCategory: 'Bags',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop'
    ],
    colors: ['Natural/Beige', 'Black Canvas'],
    sizes: ['One Size'],
    inventory: 20,
    status: 'active',
    rating: 4.9,
    reviewsCount: 11,
    inStock: true
  },
  {
    id: 'prod_olive_vest',
    sku: 'SKU-MEN-VEST-006',
    name: {
      vi: 'Áo Gile len cừu Merino cao cấp',
      en: 'Premium Wool Knit Vest',
      ja: 'プレミアム ウール ニット ベスト'
    },
    description: {
      vi: 'Áo len gile cổ tròn dệt từ sợi len cừu Merino mỏng nhẹ, mang lại cảm giác ấm áp dễ chịu cho những buổi swing sáng sớm se lạnh.',
      en: 'Crewneck knit vest woven from lightweight Merino wool, providing cozy warmth for cool early morning swings.',
      ja: '軽量なメリノウールで編み上げたクルーネックベスト。冷え込む早朝のラウンドに心地よい温かさを提供します。'
    },
    prices: {
      USD: { price: 155 },
      VND: { price: 3875000 }
    },
    details: [
      'Chất liệu: 70% Merino Wool, 30% Cashmere',
      'Tông màu ô liu tự nhiên nhã nhặn',
      'Khả năng điều nhiệt tự nhiên độc đáo',
      'Viền cổ và gấu dệt gân co giãn giữ phom tốt'
    ],
    category: 'men',
    subCategory: 'Knitwear',
    images: [
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?q=80&w=600&auto=format&fit=crop'
    ],
    colors: ['Olive Green', 'Warm Sand', 'Charcoal Grey'],
    sizes: ['M', 'L', 'XL'],
    inventory: 25,
    status: 'active',
    rating: 4.8,
    reviewsCount: 14,
    inStock: true
  },
  {
    id: 'prod_tapered_pants',
    sku: 'SKU-MEN-PANTS-007',
    name: {
      vi: 'Quần tây thể thao phom Tapered',
      en: 'Smart Performance Trousers',
      ja: 'スマート パフォーマンス トラウザーズ'
    },
    description: {
      vi: 'Quần tây phom tapered ôm nhẹ thời thượng, sử dụng vải co giãn kỹ thuật cao chống nhăn giúp golfer tự tin từ sân tập đến buổi họp.',
      en: 'Contemporary tapered-fit trousers made from wrinkle-resistant performance stretch fabric, taking you from the driving range to business meetings.',
      ja: '防シワ性に優れた高機能ストレッチ素材を使用した、モダンなテーパードパンツ。ゴルフ練習場からビジネスシーンまでカバー。'
    },
    prices: {
      USD: { price: 195 },
      VND: { price: 4875000 }
    },
    details: [
      'Chất liệu: 90% Polyamide, 10% Elastane',
      'Chống nhăn tuyệt đối và chống thấm nước nhẹ',
      'Đai lưng co giãn giấu bên trong mang lại sự thoải mái tối đa',
      'Đường may giấu tinh xảo'
    ],
    category: 'men',
    subCategory: 'Pants',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop'
    ],
    colors: ['Sandy Beige', 'Steel Grey', 'Midnight Navy'],
    sizes: ['30', '32', '34', '36'],
    inventory: 35,
    status: 'active',
    rating: 4.7,
    reviewsCount: 22,
    inStock: true
  },
  {
    id: 'prod_leather_glove',
    sku: 'SKU-ACC-GLOVE-008',
    name: {
      vi: 'Găng tay golf da cừu Cabretta',
      en: 'Cabretta Leather Pro Glove',
      ja: 'カブレッタ レザー プロ グローブ'
    },
    description: {
      vi: 'Găng tay golf da cừu Cabretta siêu mềm mang lại cảm giác bám gậy chân thật nhất, đồng hành cùng những cú swing hoàn hảo.',
      en: 'Ultra-soft Cabretta leather golf glove offering a supreme direct feel and excellent grip for perfect swings.',
      ja: '最高級のカブレッタレザー（羊革）を使用し、極上のフィット感と高いグリップ力を実現したゴルフグローブ。'
    },
    prices: {
      USD: { price: 45 },
      VND: { price: 1125000 }
    },
    details: [
      'Chất liệu: 100% Da cừu Cabretta cao cấp loại 1',
      'Các lỗ nhỏ li ti thông hơi trên các ngón tay',
      'Khóa dán Velcro in chìm logo Southcape sang trọng',
      'Đường may thun ở khớp tay tăng độ linh hoạt'
    ],
    category: 'accessories',
    subCategory: 'Glove',
    images: [
      'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?q=80&w=600&auto=format&fit=crop'
    ],
    colors: ['Snow White', 'Tan Brown'],
    sizes: ['S', 'M', 'L'],
    inventory: 120,
    status: 'active',
    rating: 4.9,
    reviewsCount: 40,
    inStock: true
  },
  {
    id: 'prod_linen_polo',
    sku: 'SKU-MEN-POLO-009',
    name: {
      vi: 'Áo Polo vải sợi Linen pha Cotton',
      en: 'Linen Blend Comfort Polo',
      ja: 'リネン ブレンド コンフォート ポロ'
    },
    description: {
      vi: 'Áo polo dệt từ sợi linen pha cotton mát mẻ, mang tinh thần Quiet Luxury thoải mái khi diện cả trên sân golf và những chuyến nghỉ dưỡng.',
      en: 'Linen-cotton blend polo shirt with high breathability, bringing a relaxed Quiet Luxury vibe perfect for both golf rounds and resorts.',
      ja: '通気性に優れたリネン・コットン混紡ポロシャツ。リゾートや日常に映える、リラックスしたQuiet Luxuryを提案。'
    },
    prices: {
      USD: { price: 135 },
      VND: { price: 3375000 }
    },
    details: [
      'Chất liệu: 55% Linen, 45% Cotton',
      'Mặt vải có kết cấu mộc tự nhiên thoáng mát vượt trội',
      'Cổ áo mềm mại và hàng cúc xà cừ tự nhiên',
      'Phom dáng Relaxed-fit mặc cực kỳ dễ chịu'
    ],
    category: 'men',
    subCategory: 'Polo',
    images: [
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop'
    ],
    colors: ['Heather Lavender', 'Soft Beige', 'Sage Green'],
    sizes: ['M', 'L', 'XL'],
    inventory: 55,
    status: 'active',
    rating: 4.6,
    reviewsCount: 19,
    inStock: true
  },
  {
    id: 'prod_leather_shoes',
    sku: 'SKU-ACC-SHOES-010',
    name: {
      vi: 'Giày Golf đinh cao su Tour Spikeless',
      en: 'Southcape Tour Spikeless Shoes',
      ja: 'サウスケープ ツアー スパイクレス シューズ'
    },
    description: {
      vi: 'Giày golf Spikeless thời trang chống nước, thiết kế đế cao su đúc đa hướng bám cỏ vượt trội và êm ái suốt 18 hố.',
      en: 'Stylish, waterproof spikeless golf shoes featuring multi-directional rubber traction outsoles, maintaining premium cushioning for 18 holes.',
      ja: '防水機能を備えたスタイリッシュなスパイクレスシューズ。多方向へのグリップ力を備えたアウトソールで18ホール快適。'
    },
    prices: {
      USD: { price: 240, compare_at_price: 280 },
      VND: { price: 6000000, compare_at_price: 7000000 }
    },
    details: [
      'Chất liệu: Da Microfiber cao cấp chống thấm nước tuyệt đối',
      'Đế giữa EVA đàn hồi giảm chấn thương',
      'Đế ngoài cao su Spikeless thông minh, có thể diện đi chơi thường ngày'
    ],
    category: 'accessories',
    subCategory: 'Shoes',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop'
    ],
    colors: ['Off-White/Tan', 'Full Black'],
    sizes: ['40', '41', '42', '43', '44'],
    inventory: 15,
    status: 'active',
    rating: 4.8,
    reviewsCount: 16,
    inStock: true
  }
];

export const CONCEPTS: Concept[] = [
  {
    id: 'cliffside_links',
    title: 'Cliffside Links',
    subtitle: 'NĂNG ĐỘNG VEN BIỂN VÀ GIÓ ĐẠI DƯƠNG',
    description: 'Bộ sưu tập thời trang golf hiệu năng cao với phối màu Trắng & Xanh Navy sắc sảo. Lấy cảm hứng từ những đường bóng uốn lượn bên vách đá ven biển Nam Hải hùng vĩ của South Cape, kết hợp chất liệu cản gió kỹ thuật và độ co giãn tối ưu.',
    coverImage: '/assets/concept_cliffside.png',
    tags: ['Coastal', 'Performance', 'Women Golf', 'Summer 2026'],
    themeColor: 'bg-[#183020]/5 text-[#183020]',
    accentColor: 'border-[#183020] text-[#183020]',
    lookbooks: [
      {
        id: 'lookbook_cliffside_1',
        image: '/assets/concept_cliffside.png',
        title: 'The Coastal Swing',
        description: 'Vẻ đẹp tối giản giao hòa cùng biển trời xanh thẳm. Điểm nhấn là áo polo trắng khóa kéo chìm phối cùng chân váy dập ly dệt kim.',
        hotspots: [
          { productId: 'prod_white_polo', x: 45, y: 35 },
          { productId: 'prod_pleated_skirt', x: 42, y: 65 },
          { productId: 'prod_golf_visor', x: 48, y: 15 }
        ]
      }
    ]
  },
  {
    id: 'sunset_clubhouse',
    title: 'Sunset Clubhouse',
    subtitle: 'ẤM ÁP HÒA NHỊP CÙNG NẮNG HOÀNG HÔN',
    description: 'Tận hưởng khoảnh khắc hoàng hôn thanh bình tại Clubhouse với các thiết kế dệt kim sợi len cừu Merino siêu nhẹ. Tông màu Ô liu nhạt, be cát và đất ấm mang lại cảm giác dễ chịu, ấm áp tuyệt đối đầy tinh tế.',
    coverImage: '/assets/concept_sunset.png',
    tags: ['Luxury Knitwear', 'Cozy Style', 'Clubhouse Look'],
    themeColor: 'bg-[#b2935b]/5 text-[#6c593a]',
    accentColor: 'border-[#b2935b] text-[#b2935b]',
    lookbooks: [
      {
        id: 'lookbook_sunset_1',
        image: '/assets/concept_sunset.png',
        title: 'Quiet Golden Hour',
        description: 'Phối đồ nhiều lớp lịch lãm với áo gile len cừu Merino ô liu khoác ngoài polo cùng quần tây phom đứng tinh xảo.',
        hotspots: [
          { productId: 'prod_olive_vest', x: 48, y: 35 },
          { productId: 'prod_tapered_pants', x: 50, y: 70 }
        ]
      }
    ]
  },
  {
    id: 'summer_breeze',
    title: 'Summer Breeze',
    subtitle: 'ĐÓN GIÓ HÈ MÁT LÀNH TRÊN SÂN CỎ',
    description: 'Dành cho những ngày nắng đẹp rực rỡ, bộ sưu tập Summer Breeze ứng dụng chất liệu vải lưới dệt thông khí độc quyền và màu phấn nhã nhặn. Nhẹ nhàng như một làn gió mát rượi lướt qua.',
    coverImage: '/assets/concept_breeze.png',
    tags: ['Mesh fabric', 'Pastel Vibe', 'Ultralightwear'],
    themeColor: 'bg-[#98b7c5]/5 text-[#2c4755]',
    accentColor: 'border-[#98b7c5] text-[#4f788b]',
    lookbooks: [
      {
        id: 'lookbook_breeze_1',
        image: '/assets/concept_breeze.png',
        title: 'Pastel Lightness',
        description: 'Vẻ ngoài thư thái và tràn đầy sức sống. Áo polo linen phối oải hương dịu nhẹ và chiếc mũ visor viền da tinh tế.',
        hotspots: [
          { productId: 'prod_linen_polo', x: 52, y: 40 },
          { productId: 'prod_golf_visor', x: 55, y: 18 }
        ]
      }
    ]
  },
  {
    id: 'quiet_luxury',
    title: 'Quiet Luxury Off-Course',
    subtitle: 'THỜI TRANG NGHỈ DƯỠNG SANG TRỌNG',
    description: 'Sự mở rộng từ sân golf đến nhịp sống hàng ngày. Các trang phục với phom dáng thả lỏng, may từ chất liệu sợi linen tự nhiên, canvas thô mộc kết hợp chi tiết da thủ công mang đậm tính nghệ thuật sắp đặt.',
    coverImage: '/assets/concept_luxury.png',
    tags: ['Off-Course', 'Linen', 'Genuine Leather', 'Resort Wear'],
    themeColor: 'bg-[#333333]/5 text-[#111111]',
    accentColor: 'border-[#111111] text-[#111111]',
    lookbooks: [
      {
        id: 'lookbook_luxury_1',
        image: '/assets/concept_luxury.png',
        title: 'Editorial Essentials',
        description: 'Bố cục flat lay phong cách tạp chí trưng bày những phụ kiện thiết yếu: Găng tay da Cabretta thêu chìm, túi tote vải canvas phối da bò cùng giày golf spikeless cao cấp.',
        hotspots: [
          { productId: 'prod_tote_bag', x: 62, y: 50 },
          { productId: 'prod_leather_glove', x: 38, y: 68 },
          { productId: 'prod_leather_shoes', x: 50, y: 25 }
        ]
      }
    ]
  }
];
