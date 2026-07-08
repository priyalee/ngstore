import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ar';

type Dict = Record<string, Partial<Record<Lang, string>> & { en: string }>;

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly storageKey = 'ngstore-lang';
  private readonly rtlLangs: Lang[] = ['ar'];

  private langSubject = new BehaviorSubject<Lang>(this.read());
  lang$ = this.langSubject.asObservable();

  private dict: Dict = {
    'announce.freeShip': { en: 'Free shipping on orders over $50', hi: '$50 से अधिक के ऑर्डर पर मुफ़्त शिपिंग', es: 'Envío gratis en pedidos superiores a $50', fr: 'Livraison gratuite dès 50 $', de: 'Kostenloser Versand ab 50 $', zh: '订单满 $50 免运费', ja: '50ドル以上のご注文で送料無料', ar: 'شحن مجاني للطلبات التي تزيد عن 50 دولارًا' },
    'announce.returns': { en: '30-day easy returns', hi: '30-दिन आसान रिटर्न', es: 'Devoluciones fáciles en 30 días', fr: 'Retours faciles sous 30 jours', de: '30 Tage einfache Rückgabe', zh: '30 天轻松退货', ja: '30日間の簡単返品', ar: 'إرجاع سهل خلال 30 يومًا' },
    'announce.secure': { en: 'Secure checkout', hi: 'सुरक्षित चेकआउट', es: 'Pago seguro', fr: 'Paiement sécurisé', de: 'Sicherer Checkout', zh: '安全结账', ja: '安全なお支払い', ar: 'دفع آمن' },

    'search.placeholder': { en: 'Search for products, brands and more', hi: 'उत्पाद, ब्रांड और अधिक खोजें', es: 'Busca productos, marcas y más', fr: 'Rechercher des produits, des marques et plus', de: 'Produkte, Marken und mehr suchen', zh: '搜索产品、品牌等', ja: '商品やブランドなどを検索', ar: 'ابحث عن المنتجات والعلامات التجارية والمزيد' },
    'search.button': { en: 'Search', hi: 'खोजें', es: 'Buscar', fr: 'Rechercher', de: 'Suchen', zh: '搜索', ja: '検索', ar: 'بحث' },

    'nav.home': { en: 'Home', hi: 'होम', es: 'Inicio', fr: 'Accueil', de: 'Startseite', zh: '首页', ja: 'ホーム', ar: 'الرئيسية' },
    'nav.products': { en: 'Products', hi: 'उत्पाद', es: 'Productos', fr: 'Produits', de: 'Produkte', zh: '商品', ja: '商品', ar: 'المنتجات' },
    'nav.shop': { en: 'Shop', hi: 'शॉप', es: 'Tienda', fr: 'Boutique', de: 'Shop', zh: '商店', ja: 'ショップ', ar: 'المتجر' },
    'nav.about': { en: 'About', hi: 'हमारे बारे में', es: 'Acerca de', fr: 'À propos', de: 'Über uns', zh: '关于', ja: '会社概要', ar: 'من نحن' },
    'nav.contact': { en: 'Contact', hi: 'संपर्क', es: 'Contacto', fr: 'Contact', de: 'Kontakt', zh: '联系我们', ja: 'お問い合わせ', ar: 'اتصل بنا' },
    'nav.allProducts': { en: 'All products', hi: 'सभी उत्पाद', es: 'Todos los productos', fr: 'Tous les produits', de: 'Alle Produkte', zh: '所有商品', ja: 'すべての商品', ar: 'كل المنتجات' },
    'nav.deals': { en: "Today's Deals", hi: 'आज के सौदे', es: 'Ofertas de hoy', fr: 'Offres du jour', de: 'Angebote des Tages', zh: '今日特惠', ja: '本日のセール', ar: 'عروض اليوم' },
    'nav.returns': { en: 'Returns &', hi: 'रिटर्न और', es: 'Devoluciones y', fr: 'Retours et', de: 'Rückgaben &', zh: '退货与', ja: '返品・', ar: 'المرتجعات و' },
    'nav.orders': { en: 'Orders', hi: 'ऑर्डर', es: 'Pedidos', fr: 'Commandes', de: 'Bestellungen', zh: '订单', ja: '注文', ar: 'الطلبات' },
    'nav.wishlist': { en: 'Wishlist', hi: 'इच्छा-सूची', es: 'Favoritos', fr: 'Favoris', de: 'Wunschliste', zh: '心愿单', ja: 'お気に入り', ar: 'قائمة الرغبات' },
    'nav.myAccount': { en: 'My Account', hi: 'मेरा खाता', es: 'Mi cuenta', fr: 'Mon compte', de: 'Mein Konto', zh: '我的账户', ja: 'マイアカウント', ar: 'حسابي' },

    'action.signIn': { en: 'Sign In', hi: 'साइन इन', es: 'Iniciar sesión', fr: 'Se connecter', de: 'Anmelden', zh: '登录', ja: 'サインイン', ar: 'تسجيل الدخول' },
    'action.signOut': { en: 'Sign out', hi: 'साइन आउट', es: 'Cerrar sesión', fr: 'Se déconnecter', de: 'Abmelden', zh: '退出登录', ja: 'サインアウト', ar: 'تسجيل الخروج' },
    'action.cart': { en: 'Cart', hi: 'कार्ट', es: 'Carrito', fr: 'Panier', de: 'Warenkorb', zh: '购物车', ja: 'カート', ar: 'السلة' },

    'loc.deliverTo': { en: 'Deliver to', hi: 'यहाँ डिलीवर करें', es: 'Enviar a', fr: 'Livrer à', de: 'Liefern nach', zh: '配送至', ja: 'お届け先', ar: 'التوصيل إلى' },
    'loc.choose': { en: 'Choose your delivery location', hi: 'अपना डिलीवरी स्थान चुनें', es: 'Elige tu ubicación de entrega', fr: 'Choisissez votre lieu de livraison', de: 'Wähle deinen Lieferort', zh: '选择您的配送地点', ja: '配送先を選択', ar: 'اختر موقع التوصيل' },

    'lang.settings': { en: 'Language settings', hi: 'भाषा सेटिंग', es: 'Configuración de idioma', fr: 'Paramètres de langue', de: 'Spracheinstellungen', zh: '语言设置', ja: '言語設定', ar: 'إعدادات اللغة' },
    'lang.desc': { en: 'Select the language you prefer for browsing, shopping and communications.', hi: 'ब्राउज़िंग, खरीदारी और संचार के लिए अपनी पसंदीदा भाषा चुनें।', es: 'Selecciona el idioma que prefieres para navegar, comprar y comunicarte.', fr: 'Sélectionnez la langue que vous préférez pour naviguer, acheter et communiquer.', de: 'Wähle die Sprache, die du zum Stöbern, Einkaufen und Kommunizieren bevorzugst.', zh: '选择您在浏览、购物和沟通时偏好的语言。', ja: '閲覧・ショッピング・連絡に使用する言語を選択してください。', ar: 'اختر اللغة التي تفضلها للتصفح والتسوق والتواصل.' },
    'lang.save': { en: 'Save changes', hi: 'बदलाव सहेजें', es: 'Guardar cambios', fr: 'Enregistrer', de: 'Änderungen speichern', zh: '保存更改', ja: '変更を保存', ar: 'حفظ التغييرات' },
    'common.cancel': { en: 'Cancel', hi: 'रद्द करें', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', zh: '取消', ja: 'キャンセル', ar: 'إلغاء' },

    'hero.welcome': { en: 'Welcome to the store', hi: 'स्टोर में आपका स्वागत है', es: 'Bienvenido a la tienda', fr: 'Bienvenue dans la boutique', de: 'Willkommen im Store', zh: '欢迎来到商店', ja: 'ストアへようこそ', ar: 'مرحبًا بك في المتجر' },
    'hero.badge': { en: 'Summer Sale — up to 50% off', hi: 'समर सेल — 50% तक की छूट', es: 'Rebajas de verano — hasta 50% de descuento', fr: "Soldes d'été — jusqu'à 50 % de réduction", de: 'Sommer-Sale — bis zu 50 % Rabatt', zh: '夏季大促 — 低至五折', ja: 'サマーセール — 最大50%オフ', ar: 'تخفيضات الصيف — حتى 50٪' },
    'hero.title1': { en: 'Everything you love,', hi: 'आपकी पसंद का सब कुछ,', es: 'Todo lo que amas,', fr: 'Tout ce que vous aimez,', de: 'Alles, was du liebst,', zh: '你所热爱的一切，', ja: 'あなたの好きなすべてを、', ar: 'كل ما تحب،' },
    'hero.title2': { en: 'delivered to your door.', hi: 'आपके दरवाज़े तक।', es: 'entregado en tu puerta.', fr: 'livré à votre porte.', de: 'direkt an deine Tür geliefert.', zh: '送货上门。', ja: 'ドアまでお届け。', ar: 'يُوصَّل إلى بابك.' },
    'hero.subtitle': { en: 'Shop the latest in electronics, fashion and essentials. Curated quality, fair prices, and fast free shipping on orders over $50.', hi: 'इलेक्ट्रॉनिक्स, फैशन और ज़रूरी सामान में नवीनतम खरीदें। चुनिंदा गुणवत्ता, उचित दाम और $50+ ऑर्डर पर तेज़ मुफ़्त शिपिंग।', es: 'Compra lo último en electrónica, moda y esenciales. Calidad seleccionada, precios justos y envío gratis en pedidos de más de $50.', fr: 'Achetez les dernières nouveautés en électronique, mode et essentiels. Qualité sélectionnée, prix justes et livraison gratuite dès 50 $.', de: 'Entdecke Neuheiten aus Elektronik, Mode und Essentials. Kuratierte Qualität, faire Preise und kostenloser Versand ab 50 $.', zh: '选购最新的电子产品、时尚和生活必需品。精选品质、公道价格，订单满 $50 免费快递。', ja: '最新の電子機器・ファッション・日用品をお買い物。厳選された品質、公正な価格、50ドル以上で送料無料。', ar: 'تسوّق أحدث الإلكترونيات والأزياء والأساسيات. جودة مختارة وأسعار عادلة وشحن مجاني للطلبات فوق 50 دولارًا.' },
    'hero.shopNow': { en: 'Shop Now', hi: 'अभी खरीदें', es: 'Comprar ahora', fr: 'Acheter', de: 'Jetzt einkaufen', zh: '立即购买', ja: '今すぐ購入', ar: 'تسوّق الآن' },
    'hero.stat.products': { en: 'Products', hi: 'उत्पाद', es: 'Productos', fr: 'Produits', de: 'Produkte', zh: '商品', ja: '商品', ar: 'المنتجات' },
    'hero.stat.customers': { en: 'Happy customers', hi: 'खुश ग्राहक', es: 'Clientes felices', fr: 'Clients satisfaits', de: 'Zufriedene Kunden', zh: '满意客户', ja: '満足のお客様', ar: 'عملاء سعداء' },
    'hero.stat.rating': { en: 'Avg. rating', hi: 'औसत रेटिंग', es: 'Valoración media', fr: 'Note moyenne', de: 'Ø Bewertung', zh: '平均评分', ja: '平均評価', ar: 'متوسط التقييم' },

    'sec.categoryEyebrow': { en: 'Shop by category', hi: 'श्रेणी अनुसार खरीदें', es: 'Compra por categoría', fr: 'Acheter par catégorie', de: 'Nach Kategorie einkaufen', zh: '按类别选购', ja: 'カテゴリーで探す', ar: 'تسوّق حسب الفئة' },
    'sec.categoryTitle': { en: 'Find what you need', hi: 'जो चाहिए वो पाएं', es: 'Encuentra lo que necesitas', fr: 'Trouvez ce dont vous avez besoin', de: 'Finde, was du brauchst', zh: '找到你所需', ja: '必要なものを見つけよう', ar: 'اعثر على ما تحتاجه' },
    'sec.featEyebrow': { en: 'Handpicked for you', hi: 'आपके लिए चुना गया', es: 'Elegido para ti', fr: 'Sélectionné pour vous', de: 'Für dich ausgewählt', zh: '为你精选', ja: 'あなたへのおすすめ', ar: 'مختار من أجلك' },
    'sec.featTitle': { en: 'Featured products', hi: 'विशेष उत्पाद', es: 'Productos destacados', fr: 'Produits en vedette', de: 'Ausgewählte Produkte', zh: '精选商品', ja: '注目の商品', ar: 'منتجات مميزة' },
    'sec.viewAll': { en: 'View all', hi: 'सभी देखें', es: 'Ver todo', fr: 'Voir tout', de: 'Alle ansehen', zh: '查看全部', ja: 'すべて見る', ar: 'عرض الكل' },
    'sec.seeAll': { en: 'See all', hi: 'सभी देखें', es: 'Ver todo', fr: 'Tout voir', de: 'Alle ansehen', zh: '查看全部', ja: 'すべて見る', ar: 'عرض الكل' },

    'foot.tagline': { en: 'Your everyday store for tech, fashion & essentials — curated, fairly priced, delivered fast.', hi: 'टेक, फैशन और ज़रूरी सामान के लिए आपका रोज़मर्रा का स्टोर — चुनिंदा, उचित दाम, तेज़ डिलीवरी।', es: 'Tu tienda diaria de tecnología, moda y esenciales: seleccionada, con precios justos y entrega rápida.', fr: 'Votre boutique du quotidien pour la tech, la mode et les essentiels — sélectionnée, à prix juste, livrée vite.', de: 'Dein Alltags-Shop für Technik, Mode & Essentials — kuratiert, fair, schnell geliefert.', zh: '你的日常科技、时尚与必需品商店——精选、公道、快速送达。', ja: 'テック・ファッション・日用品の毎日のお店 — 厳選、公正価格、迅速配送。', ar: 'متجرك اليومي للتقنية والأزياء والأساسيات — مختار، بأسعار عادلة، وتوصيل سريع.' },
    'foot.newsTitle': { en: 'Get 10% off your first order', hi: 'अपने पहले ऑर्डर पर 10% छूट पाएं', es: 'Obtén 10% de descuento en tu primer pedido', fr: 'Obtenez 10 % sur votre première commande', de: 'Erhalte 10 % Rabatt auf deine erste Bestellung', zh: '首单立减 10%', ja: '初回注文が10%オフ', ar: 'احصل على خصم 10٪ على طلبك الأول' },
    'foot.newsSub': { en: 'Join the NgStore list for early access to drops and members-only deals.', hi: 'ड्रॉप्स और सदस्य-मात्र सौदों तक जल्दी पहुंच के लिए NgStore सूची में शामिल हों।', es: 'Únete a la lista de NgStore para acceso anticipado a lanzamientos y ofertas exclusivas.', fr: 'Rejoignez la liste NgStore pour un accès anticipé aux nouveautés et offres exclusives.', de: 'Tritt der NgStore-Liste bei für frühen Zugang zu Neuheiten und exklusiven Angeboten.', zh: '加入 NgStore 列表，抢先获取新品和会员专属优惠。', ja: 'NgStore リストに登録して、新商品や会員限定セールにいち早くアクセス。', ar: 'انضم إلى قائمة NgStore للوصول المبكر إلى الجديد والعروض الحصرية.' },
    'foot.subscribe': { en: 'Subscribe', hi: 'सब्सक्राइब करें', es: 'Suscribirse', fr: "S'abonner", de: 'Abonnieren', zh: '订阅', ja: '登録する', ar: 'اشترك' },
    'foot.subscribed': { en: 'Subscribed', hi: 'सब्सक्राइब किया', es: 'Suscrito', fr: 'Abonné', de: 'Abonniert', zh: '已订阅', ja: '登録済み', ar: 'تم الاشتراك' },
    'foot.colShop': { en: 'Shop', hi: 'शॉप', es: 'Tienda', fr: 'Boutique', de: 'Shop', zh: '商店', ja: 'ショップ', ar: 'المتجر' },
    'foot.colCompany': { en: 'Company', hi: 'कंपनी', es: 'Empresa', fr: 'Entreprise', de: 'Unternehmen', zh: '公司', ja: '会社', ar: 'الشركة' },
    'foot.colHelp': { en: 'Help', hi: 'सहायता', es: 'Ayuda', fr: 'Aide', de: 'Hilfe', zh: '帮助', ja: 'ヘルプ', ar: 'المساعدة' },
    'foot.allProducts': { en: 'All Products', hi: 'सभी उत्पाद', es: 'Todos los productos', fr: 'Tous les produits', de: 'Alle Produkte', zh: '所有商品', ja: 'すべての商品', ar: 'كل المنتجات' },
    'foot.deals': { en: 'Deals', hi: 'सौदे', es: 'Ofertas', fr: 'Offres', de: 'Angebote', zh: '优惠', ja: 'セール', ar: 'العروض' },
    'foot.aboutUs': { en: 'About Us', hi: 'हमारे बारे में', es: 'Sobre nosotros', fr: 'À propos', de: 'Über uns', zh: '关于我们', ja: '会社概要', ar: 'من نحن' },
    'foot.ordersReturns': { en: 'Orders & Returns', hi: 'ऑर्डर और रिटर्न', es: 'Pedidos y devoluciones', fr: 'Commandes et retours', de: 'Bestellungen & Rückgaben', zh: '订单与退货', ja: '注文と返品', ar: 'الطلبات والمرتجعات' },
    'foot.shipping': { en: 'Shipping', hi: 'शिपिंग', es: 'Envíos', fr: 'Livraison', de: 'Versand', zh: '配送', ja: '配送', ar: 'الشحن' },
    'foot.returnsPolicy': { en: 'Returns Policy', hi: 'रिटर्न नीति', es: 'Política de devoluciones', fr: 'Politique de retour', de: 'Rückgaberichtlinie', zh: '退货政策', ja: '返品ポリシー', ar: 'سياسة الإرجاع' },
    'foot.trackOrder': { en: 'Track Order', hi: 'ऑर्डर ट्रैक करें', es: 'Rastrear pedido', fr: 'Suivre la commande', de: 'Bestellung verfolgen', zh: '追踪订单', ja: '注文を追跡', ar: 'تتبّع الطلب' },
    'foot.faq': { en: 'FAQ', hi: 'सामान्य प्रश्न', es: 'Preguntas frecuentes', fr: 'FAQ', de: 'FAQ', zh: '常见问题', ja: 'よくある質問', ar: 'الأسئلة الشائعة' },
    'foot.rights': { en: 'All rights reserved.', hi: 'सर्वाधिकार सुरक्षित।', es: 'Todos los derechos reservados.', fr: 'Tous droits réservés.', de: 'Alle Rechte vorbehalten.', zh: '版权所有。', ja: '無断複写・転載を禁じます。', ar: 'جميع الحقوق محفوظة.' },
  };

  constructor() {
    this.apply(this.langSubject.value);
  }

  private read(): Lang {
    try {
      const saved = localStorage.getItem(this.storageKey) as Lang | null;
      if (saved) return saved;
    } catch {}
    return 'en';
  }

  private apply(lang: Lang): void {
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', this.rtlLangs.includes(lang) ? 'rtl' : 'ltr');
    try { localStorage.setItem(this.storageKey, lang); } catch {}
  }

  get lang(): Lang { return this.langSubject.value; }

  setLang(lang: Lang): void {
    this.apply(lang);
    this.langSubject.next(lang);
  }

  translate(key: string): string {
    const entry = this.dict[key];
    if (!entry) return key;
    return entry[this.lang] ?? entry.en;
  }
}
