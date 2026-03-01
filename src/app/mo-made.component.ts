import { Component, NgModule, signal, computed, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ============================================
// Contact Information Constants
// ============================================
const CONTACT = {
  PHONE: '+919538954851',
  WHATSAPP_URL: 'https://wa.me/919538954851'
};

interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  products: Product[];
  isCatalog?: boolean;
  catalogUrl?: string;
}

@Component({
  selector: 'app-mo-made',
  templateUrl: './mo-made.component.html',
  styleUrls: ['./mo-made.component.scss']
})
export class MoMadeComponent implements OnInit {
  // Contact info constants
  contactPhone = CONTACT.PHONE;
  contactWhatsappUrl = CONTACT.WHATSAPP_URL;

  currentView = signal<'landing' | 'category'>('landing');
  selectedCategoryId = signal<string>('');
  scrollPositionBeforeCategory = 0;
  step = signal(1);
  selectedVibe = signal('');
  selectedFlavor = signal('');
  customerName = '';

  // Policy Modal State
  activePolicyModal = signal<'payment' | 'shipping' | 'refund' | 'terms' | null>(null);

  openPolicyModal(policy: 'payment' | 'shipping' | 'refund' | 'terms') {
    this.activePolicyModal.set(policy);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closePolicyModal() {
    this.activePolicyModal.set(null);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  getPolicyTitle(): string {
    const titles = {
      payment: 'Payment Policy',
      shipping: 'Delivery Policy',
      refund: 'Refund & Cancellation Policy',
      terms: 'Terms of Service'
    };
    return titles[this.activePolicyModal() || 'payment'];
  }
  eventDate = '';
  cakeMessage = '';

  // Select vibe (user must click Next to proceed)
  onVibeSelect(vibeName: string) {
    this.selectedVibe.set(vibeName);
  }

  // Select flavor (user must click Next to proceed)
  onFlavorSelect(flavorName: string) {
    this.selectedFlavor.set(flavorName);
  }

  // Floating Concierge Menu State
  isMenuOpen = signal(false);
  
  // Scroll visibility tracking
  isScrolling = signal(false);
  lastScrollY = signal(0);
  scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  conciergeVisible = computed(() => !this.isScrolling());

  // Boutique Carousel State (Mobile)
  activeCarouselIndex = signal(0);
  carouselScrollPosition = 0; // Store horizontal scroll position

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('popstate', () => {
        if (this.zoomedProduct()) {
          this.closeZoom();
        } else if (this.currentView() === 'category') {
          this.goBack();
        }
      });

      // iOS Safari zoom prevention on input focus
      this.setupIOSZoomPrevention();

      // Signal app is ready - removes splash screen and triggers fade-in
      this.triggerAppReady();
      
      // Handle hash URL on page load (category, product, or section anchor)
      setTimeout(() => this.handleHashUrl(), 500);
      
      // Listen for hash changes (when user navigates via browser)
      window.addEventListener('hashchange', () => this.handleHashUrl());
    }
  }
  
  // Handle all hash-based URLs: #category/*, #product/*, #boutique, #story, #concierge
  private handleHashUrl() {
    const hash = window.location.hash;
    if (!hash) return;

    // Handle #category/<id> — open category view
    const categoryMatch = hash.match(/#category\/([a-zA-Z0-9_-]+)/);
    if (categoryMatch) {
      const categoryId = categoryMatch[1];
      const category = this.categories.find(c => c.id === categoryId);
      if (category && !category.isCatalog) {
        this.selectedCategoryId.set(categoryId);
        this.currentView.set('category');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    
    // Handle #product/<id> — open product zoom
    const productMatch = hash.match(/#product\/(\d+)/);
    if (productMatch) {
      const productId = parseInt(productMatch[1], 10);
      for (const category of this.categories) {
        const product = category.products.find(p => p.id === productId);
        if (product) {
          this.selectedCategoryId.set(category.id);
          this.currentView.set('category');
          setTimeout(() => this.openZoom(product), 100);
          break;
        }
      }
      return;
    }

    // Handle section anchors: #boutique, #story, #concierge
    const sectionMatch = hash.match(/#(boutique|story|concierge)/);
    if (sectionMatch) {
      // Make sure we're on landing view first
      if (this.currentView() !== 'landing') {
        this.currentView.set('landing');
      }
      setTimeout(() => {
        const el = document.getElementById(sectionMatch[1]);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }

  // Mark app as ready - hides splash screen and triggers fade-in animation
  private triggerAppReady() {
    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      const splashScreen = document.getElementById('splash-screen');
      const appRoot = document.querySelector('app-root');
      
      if (splashScreen) {
        // Add hidden class to splash screen to fade it out
        splashScreen.classList.add('hidden');
      }
      
      if (appRoot) {
        // Add app-ready class to app-root to fade in content
        appRoot.classList.add('app-ready');
      }
    });
  }

  // Prevent iOS Safari auto-zoom on input focus by setting font-size to 16px
  private setupIOSZoomPrevention() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // Add a style tag to set all inputs to 16px font (iOS only zooms when font < 16px)
      const style = document.createElement('style');
      style.textContent = `
        input, select, textarea {
          font-size: 16px !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ============================================
  // Scroll Detection for Concierge Visibility
  // ============================================
  @HostListener('window:scroll')
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentScrollY = window.scrollY;
    const lastScroll = this.lastScrollY();

    // Determine if scrolling down (hide) or up (show)
    if (currentScrollY > lastScroll && currentScrollY > 100) {
      // Scrolling down
      this.isScrolling.set(true);
    } else {
      // Scrolling up or at top
      this.isScrolling.set(false);
    }

    this.lastScrollY.set(currentScrollY);

    // Clear existing timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Set timeout to show after scroll stops
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling.set(false);
    }, 1500); // Show after 1.5 seconds of no scrolling
  }

  // ============================================
  // Floating Concierge Menu Methods
  // ============================================
  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  openWhatsApp() {
    if (isPlatformBrowser(this.platformId)) {
      const message = "Hi! I'm interested in your cakes, want to explore on it.";
      const encodedMessage = encodeURIComponent(message);
      // Try to open WhatsApp app directly on mobile, fallback to web
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = `whatsapp://send?phone=918525015160&text=${encodedMessage}`;
      } else {
        window.open(`https://wa.me/918525015160?text=${encodedMessage}`, '_blank');
      }
    }
  }

  openInstagram() {
    if (isPlatformBrowser(this.platformId)) {
      window.open('https://instagram.com/mo_made_patisserie', '_blank');
    }
  }

  callDirectly() {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = 'tel:+918525015160';
    }
  }

  // ============================================
  // Boutique Carousel Scroll Handler (Mobile)
  // ============================================
  onCarouselScroll(event: Event) {
    const scrollContainer = event.target as HTMLElement;
    const scrollLeft = scrollContainer.scrollLeft;
    const cardWidth = scrollContainer.querySelector('.carousel-card')?.getBoundingClientRect().width ?? 0;
    
    // Save horizontal scroll position
    this.carouselScrollPosition = scrollLeft;
    
    if (cardWidth > 0) {
      const index = Math.round(scrollLeft / cardWidth);
      this.activeCarouselIndex.set(Math.max(0, Math.min(index, this.categories.length - 1)));
    }
  }

  // Restore carousel scroll position after returning from category view
  restoreCarouselPosition() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const carousel = document.querySelector('.boutique-carousel') as HTMLElement;
        if (carousel && this.carouselScrollPosition > 0) {
          carousel.scrollTo({ left: this.carouselScrollPosition, behavior: 'smooth' });
        }
      }, 100);
    }
  }

  storyImages = [
    'assets/images/IMG_5087_m.webp',
    'assets/images/co1_m.webp'
  ];
  currentStoryIndex = signal(0);

  googleRating = signal(4.9);
  yearsCrafting = signal(new Date().getFullYear() - 2014);
  
  readonly GOOGLE_REVIEW_URL = 'https://search.google.com/local/reviews?placeid=ChIJSeo3hiE9rjsRc3uMRT1FxGY';
  readonly GOOGLE_WRITE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJSeo3hiE9rjsRc3uMRT1FxGY';

  toggleStoryImage() {
    this.currentStoryIndex.update(i => (i + 1) % this.storyImages.length);
  }

  openGoogleReviews() {
    if (isPlatformBrowser(this.platformId)) {
      window.open(this.GOOGLE_REVIEW_URL, '_blank');
    }
  }

  openWriteGoogleReview() {
    if (isPlatformBrowser(this.platformId)) {
      window.open(this.GOOGLE_WRITE_REVIEW_URL, '_blank');
    }
  }


  getCakeMessageLines(): [string, string | null] {
    if (!this.cakeMessage || !this.cakeMessage.trim()) return ["", null];
    const words = this.cakeMessage.trim().split(/\s+/);
    const firstLine = words.slice(0, 2).join(" ");
    const rest = words.slice(2).join(" ");
    if (!rest) return [firstLine, null];
    let secondLine = rest.slice(0, 20);
    if (rest.length > 20) secondLine += "...";
    return [firstLine, secondLine];
  }
  
  categoryTypeFilterSignal = signal('wedding');
  mobileFiltersOpen = signal(false);
  zoomedProduct = signal<{id: number; name: string; image: string; description: string} | null>(null);
  
  // Getter/setter for ngModel binding
  get categoryTypeFilter() { return this.categoryTypeFilterSignal(); }
  set categoryTypeFilter(val: string) { 
    this.categoryTypeFilterSignal.set(val);
    this.selectedCategoryId.set(val);
  }
  
  toggleMobileFilters() {
    this.mobileFiltersOpen.update(v => !v);
  }
  
  openZoom(product: {id: number; name: string; image: string; description: string}) {
    this.zoomedProduct.set(product);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
      // Update URL to product-specific URL
      window.history.pushState({ view: 'product', productId: product.id }, '', '#product/' + product.id);
      // Update OG meta tags for social sharing
      this.updateMetaTags(product);
    }
  }
  
  private readonly SITE_BASE_URL = 'https://momadepatisserie.com';
  
  // Update Open Graph meta tags for product sharing
  private updateMetaTags(product: {id: number; name: string; image: string; description: string}) {
    const productUrl = `${this.SITE_BASE_URL}/#product/${product.id}`;
    const imageUrl = `${this.SITE_BASE_URL}/${product.image}`;
    const title = `${product.name} - Mo Made Patisserie`;
    const description = product.description;
    
    document.title = title;
    
    this.setMetaContent('og-title', title);
    this.setMetaContent('og-description', description);
    this.setMetaContent('og-url', productUrl);
    this.setMetaContent('og-image', imageUrl);
    this.setMetaContent('og-type', 'product');
    
    this.setMetaContent('twitter-title', title);
    this.setMetaContent('twitter-description', description);
    this.setMetaContent('twitter-image', imageUrl);
  }
  
  // Reset meta tags to default
  private resetMetaTags() {
    const defaultTitle = 'Mo Made Patisserie | Bespoke Wedding & Luxury Custom Cakes Bangalore';
    const defaultDescription = 'Bespoke architectural wedding cakes & luxury custom confections by Architect Monisha Prakash. Handcrafted in Bangalore. LBB Award Winner.';
    const defaultImage = `${this.SITE_BASE_URL}/assets/images/IMG_5087.webp`;
    
    document.title = defaultTitle;
    
    this.setMetaContent('og-title', 'Mo Made Patisserie | Bespoke Wedding & Luxury Cakes Bangalore');
    this.setMetaContent('og-description', 'Architectural sugar art by Monisha Prakash. Bespoke wedding tiers, milestone celebration cakes & luxury confections. Handcrafted in Bangalore.');
    this.setMetaContent('og-url', this.SITE_BASE_URL);
    this.setMetaContent('og-image', defaultImage);
    this.setMetaContent('og-type', 'website');
    
    this.setMetaContent('twitter-title', 'Mo Made Patisserie | Architectural Sugar Art Bangalore');
    this.setMetaContent('twitter-description', defaultDescription);
    this.setMetaContent('twitter-image', defaultImage);
  }
  
  private setMetaContent(id: string, content: string) {
    const element = document.getElementById(id);
    if (element) {
      element.setAttribute('content', content);
    }
  }
  
  closeZoom() {
    this.zoomedProduct.set(null);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
      // Restore URL to category view or home
      const categoryId = this.selectedCategoryId();
      if (categoryId && this.currentView() === 'category') {
        window.history.replaceState({ view: 'category', categoryId }, '', '#category/' + categoryId);
      } else {
        window.history.replaceState({}, '', window.location.pathname);
      }
      // Reset meta tags to default
      this.resetMetaTags();
    }
  }
  
  async shareProduct() {
    const product = this.zoomedProduct();
    if (!product || !isPlatformBrowser(this.platformId)) return;
    
    const productUrl = `${this.SITE_BASE_URL}/#product/${product.id}`;
    const shareText = `Check out "${product.name}" from Mo Made Patisserie 🎂`;
    
    // Use Web Share API (text + url only — no file sharing for cross-platform reliability)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} - Mo Made Patisserie`,
          text: shareText,
          url: productUrl
        });
      } catch (err: any) {
        // User cancelled — not an error
        if (err?.name !== 'AbortError') {
          console.log('Share failed:', err);
        }
      }
    } else {
      // Desktop fallback: copy link
      try {
        await navigator.clipboard.writeText(`${shareText}\n${productUrl}`);
        alert('Link copied to clipboard!');
      } catch {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${productUrl}`)}`, '_blank');
      }
    }
  }

  vibes = [
    { name: 'Romantic', desc: 'Soft florals, blush tones, dreamy elegance' },
    { name: 'Minimal', desc: 'Clean lines, subtle beauty, modern chic' },
    { name: 'Whimsical', desc: 'Playful, colorful, fairy-tale magic' }
  ];

  flavors = [
    { name: 'Vanilla Bean' },
    { name: 'Dark Chocolate' },
    { name: 'Red Velvet' },
    { name: 'Butterscotch' },
    { name: 'Strawberry' },
    { name: 'Pineapple' },
    { name: 'Mango' },
    { name: 'Coffee' }
  ];

 categories: Category[] = [
    {
      id: 'wedding',
      title: 'Wedding Cakes',
      description: 'Multi-tier floral masterpieces with handcrafted sugar flowers',
      price: '₹3,000/kg onwards',
      image: 'assets/images/w1_m.webp',
      products: [
        // w1_m / w1 — Grand 5-tier white cake, blush & white sugar roses, gold baroque scroll detailing, "VS" monogram & couple silhouette topper
        { id: 1, name: 'Grand Rose Baroque', image: 'assets/images/w1_m.webp', description: 'Magnificent five-tier white cake adorned with blush & white sugar roses, intricate gold baroque scroll detailing, personalised monogram & couple silhouette topper' },
        // w2 — Two-tier: dusty mauve top tier, white base, cascading mauve & white sugar roses, gold "SS" monogram topper & gold leaf accents
        { id: 2, name: 'Mauve Rose Monogram', image: 'assets/images/w2.webp', description: 'Two-tier cake with a dusty mauve top and ivory base, cascading mauve & white sugar roses, gold leaf accents & a personalised gold monogram topper' },
        // w3 — Two-tier white embossed lace texture, cascading deep burgundy & blush roses, gold initial letters "S&G", pearl border
        { id: 3, name: 'Lace & Burgundy Rose', image: 'assets/images/w3.webp', description: 'Two-tier white cake with embossed lace texture, cascading deep burgundy & blush sugar roses, gold initial letters & a delicate pearl border' },
        // w4 — Three-tier white cake with cascading purple, pink & gold edible butterflies, pink watercolor brushstrokes, gold monogram "S&P"
        { id: 4, name: 'Butterfly Garden Tier', image: 'assets/images/w4.webp', description: 'Three-tier white cake with cascading purple, pink & gold edible butterflies, soft watercolor brushstrokes & a personalised gold monogram' },
        // w5 — Two-tier white textured buttercream, white dahlia flower, fresh green foliage & gold leaf rim
        { id: 5, name: 'White Dahlia Greens', image: 'assets/images/w5.webp', description: 'Two-tier white textured buttercream cake with a statement white dahlia bloom, fresh green foliage sprigs & a delicate gold leaf rim' },
        // c9 — Two-tier white cake with vibrant tropical fresh flowers — bird of paradise, anthurium, monstera
        { id: 6, name: 'Tropical Bloom Tier', image: 'assets/images/c9.webp', description: 'Two-tier white cake adorned with fresh tropical blooms — bird of paradise, anthurium & monstera — with orange & strawberry accents at the base' }
      ]
    },
    {
      id: 'celebration',
      title: 'Celebration Cakes',
      description: 'Our most loved classic flavors and timeless celebration designs',
      price: '₹3,000/kg onwards',
      image: 'assets/images/c1_m.webp',
      products: [
        // c1_m / c1 — Two-tier white buttercream with sugar roses, fresh berries, orange slices & wavy gold piping
        { id: 21, name: 'Floral Fruit Celebration', image: 'assets/images/c1_m.webp', description: 'Two-tier white buttercream cake adorned with handcrafted sugar roses, fresh berries, orange slices & wavy gold piping' },
        // c2 — Custom multi-tier fondant cake with cat character toppers, "Happy Birthday" lettering & gold ball decorations
        { id: 22, name: 'Character Fondant Tier', image: 'assets/images/c2.webp', description: 'Custom multi-tier fondant cake with personalised character toppers, name lettering & gold ball decorations' },
        // c3 — White buttercream with fresh strawberries on top, red satin ribbon & gold candles
        { id: 23, name: 'Strawberry Ribbon Cake', image: 'assets/images/c3.webp', description: 'White buttercream cake topped with fresh strawberries & gold candles, adorned with a classic red satin ribbon' },
        // c4 — Elegant two-tier white cake with white peonies, gold butterfly accents & gold pregnant silhouette line art
        { id: 24, name: 'White Peony Gold Tier', image: 'assets/images/c4.webp', description: 'Elegant two-tier white cake with white peonies, gold butterfly accents, gold leaf & a hand-drawn gold silhouette' },
        // c5 — White buttercream with chocolate ganache drip, fresh strawberries, blueberries & kiwi on top
        { id: 25, name: 'Chocolate Drip Mixed Fruit', image: 'assets/images/c5.webp', description: 'White buttercream cake with rich chocolate ganache drip, topped with fresh strawberries, blueberries & kiwi' },
        // c6 — White cake with golden honey drip, Winnie the Pooh character art, fondant bees & honeycomb
        { id: 26, name: 'Pooh\'s Hunny Drip', image: 'assets/images/c6.webp', description: 'White buttercream cake with golden honey drip, hand-painted character art & fondant bee and honeycomb accents' },
        // c7 — Three-tier teal/mint kids cake with fondant race cars, checkered flags, boy figurine, personalised name
        { id: 27, name: 'Wheelie Big Birthday', image: 'assets/images/c7.webp', description: 'Three-tier custom buttercream cake with fondant race cars, checkered flags, personalised name & character topper' },
        // c8 — Pastel rainbow fondant disc cake with rainbow fondant topper
        { id: 28, name: 'Rainbow Pastel Petal', image: 'assets/images/c8.webp', description: 'White buttercream cake layered with pastel rainbow fondant discs & topped with a handcrafted rainbow fondant topper' }
      ]
    },
    {
      id: 'confectionery',
      title: 'Confectionery',
      description: 'Exquisite ingredients, complex pairings, and luxury finishes',
      price: 'Commissioned Pieces',
      image: 'assets/images/co1_m.webp',
      products: [
        // co1_m / co1 — Chocolate cupcakes with chocolate SMB, pink fondant bow toppers & white cake pops with pearl sprinkles
        { id: 31, name: 'Chocolate Bow Cupcakes & Pops', image: 'assets/images/co1_m.webp', description: 'Rich chocolate cupcakes with chocolate Swiss meringue buttercream & pink fondant bow toppers, paired with white vanilla cake pops with pearl sprinkles' },
        // IMG_5089 — Pink & mocha macaron tower on gold board, white peony & gold candle
        { id: 32, name: 'Macaron Tower', image: 'assets/images/IMG_5089.webp', description: 'Elegant tower of pink & mocha French macarons on a gold board, crowned with a white peony & gold candle — perfect as a centrepiece gift' },
        // co2 — Vanilla cupcakes with lavender buttercream & edible butterfly toppers, purple glazed mini donuts
        { id: 33, name: 'Butterfly Garden Collection', image: 'assets/images/co2.webp', description: 'Vanilla cupcakes with lavender buttercream & edible butterfly toppers, paired with purple glazed mini donuts' },
        // co4 — Vanilla cupcakes with vanilla SMB, fresh raspberries, blueberries & passionfruit on top
        { id: 34, name: 'Berry Passionfruit Cupcakes', image: 'assets/images/co4.webp', description: 'Light vanilla cupcakes with silky vanilla Swiss meringue buttercream, topped with fresh raspberries, blueberries & passionfruit' },
        // co5 — Mixed dessert spread: vanilla cupcakes, pink glazed donuts, cake pops & sugar cookies with pink flower decorations
        { id: 35, name: 'Celebration Dessert Spread', image: 'assets/images/co5.webp', description: 'A curated assortment of vanilla cupcakes, pink glazed donuts, cake pops & fondant flower sugar cookies' },
        // co6 — Chocolate crinkle cookies in glass domes with blue ribbon, Mo Made gift boxes
        { id: 36, name: 'Crinkle Cookie Gift Domes', image: 'assets/images/co6.webp', description: 'Chocolate crinkle cookies presented in elegant glass cloches tied with blue ribbon, gift-boxed in Mo Made signature packaging' },
        // co7 — Vanilla cupcakes with soft vanilla buttercream swirl & pink fondant flower toppers
        { id: 37, name: 'Vanilla Blossom Cupcakes', image: 'assets/images/co7.webp', description: 'Delicate vanilla cupcakes with a soft vanilla buttercream swirl & handcrafted pink fondant flower toppers' },
        // co8 — Vanilla cupcakes with pink buttercream & white fondant bow toppers + pink royal iced sugar cookies
        { id: 38, name: 'Pink Bow Cupcakes & Cookies', image: 'assets/images/co8.webp', description: 'Vanilla cupcakes with pink buttercream & white fondant bow toppers, paired with pink royal iced sugar cookies' },
        // co9 — Assorted dessert bars: vanilla cream, strawberry & chocolate ganache topped with fresh mixed berries
        { id: 39, name: 'Fresh Berry Dessert Bars', image: 'assets/images/co9.webp', description: 'Assorted dessert bars — vanilla cream, strawberry & chocolate ganache — topped with fresh strawberries, raspberries, blueberries & blackberries' },
        // co10 — Assorted cupcake boxes: vanilla with red ribbon, strawberry pink, chocolate crushed hazelnut & lemon curd swirl
        { id: 40, name: 'Signature Cupcake Box', image: 'assets/images/co10.webp', description: 'Assorted cupcake box featuring vanilla with red ribbon bow, strawberry pink frosting, chocolate with crushed hazelnuts & lemon curd swirl' },
        // co11 — Tiramisu dessert cups layered with ladyfingers, mascarpone cream & cocoa dusting, topped with a fresh whole cherry
        { id: 41, name: 'Tiramisu Cherry Cups', image: 'assets/images/co11.webp', description: 'Individual tiramisu dessert cups layered with espresso-soaked ladyfingers, mascarpone cream & cocoa dusting, each topped with a fresh whole cherry' },
        // co12 — Mermaid themed collection: vanilla cupcakes, teal & pink sugar cookies with mermaid tails, starfish, cake pops
        { id: 42, name: 'Mermaid Collection', image: 'assets/images/co12.webp', description: 'Whimsical mermaid-themed collection of vanilla cupcakes, teal & pink royal iced sugar cookies with mermaid tails & starfish, and cake pops' },
        // co13 — Pink daisy cakesicles, French macarons, cake pops & rainbow cakesicles
        { id: 43, name: 'Pink Daisy Dessert Collection', image: 'assets/images/co13.webp', description: 'Charming collection of pink chocolate-coated cakesicles with fondant daisy flowers, French macarons & rainbow cake pops' },
        // co14 — Pink molded chocolate confectionery: waffle cone cake pops, heart-embossed choc slabs, mini donuts in pink & lavender
        { id: 44, name: 'Pink Chocolate Confectionery', image: 'assets/images/co14.webp', description: 'Playful pink molded chocolate collection featuring waffle cone cake pops, heart-embossed chocolate slabs & mini donuts in pink and lavender' },
        // co15 — Chocolate sponge cake slice cross-section: rich chocolate layers, red berry compote filling, white cream frosting
        { id: 45, name: 'Chocolate Berry Layer Cake', image: 'assets/images/co15.webp', description: 'Rich chocolate sponge layered with vibrant red berry compote & finished with smooth white cream frosting — shown as a generous cross-section slice' }
      ]
    },
    {
      id: 'summer',
      title: 'Summer Special',
      description: 'Fresh, limited-edition treats inspired by the summer season',
      price: 'By Consultation',
      image: 'assets/images/s1_m.webp',
      products: [
        // s1_m / s1 — Vanilla mango cake slices: vanilla sponge, fresh mango pieces, raspberry compote drizzle & white meringue kisses (flat lay)
        { id: 51, name: 'Vanilla Mango Raspberry', image: 'assets/images/s1_m.webp', description: 'Vanilla sponge layered with fresh mango pieces & raspberry compote drizzle, served with delicate white meringue kisses on the side' },
        // s2 — Top-down white cream cake piled with fresh mango cubes, strawberries & blueberries, gold "Happy Birthday" acrylic topper
        { id: 52, name: 'Mango Berry Birthday', image: 'assets/images/s2.webp', description: 'White buttercream cake generously topped with fresh mango cubes, halved strawberries & whole blueberries with a gold acrylic birthday topper' },
        // s3 — Two-tier statement cake: yellow fondant ruffle bottom tier, white top tier with dried orange slices, pearls & gold wire curls
        { id: 53, name: 'Citrus Ruffle Tier', image: 'assets/images/s3.webp', description: 'Show-stopping two-tier cake with a vibrant yellow fondant ruffle base, white top tier adorned with dried citrus slices, pearls & delicate gold wire curls' },
        // s4 — White buttercream cylinder cake with whole dried orange slices, white orchid blooms & gold leaf scattered across
        { id: 54, name: 'Dried Orange Orchid', image: 'assets/images/s4.webp', description: 'Sleek white buttercream cake decorated with whole dried orange slices, fresh white orchid blooms & scattered gold leaf accents' },
        // s5 — Semi-naked mango layer cake: cream & sponge layers visible on side, fresh mango chunks piled on top, daisy flowers & gold "Happy Birthday" disc
        { id: 55, name: 'Fresh Mango Layer Cake', image: 'assets/images/s5.webp', description: 'Semi-naked layer cake with visible cream & sponge layers, piled high with fresh mango chunks, fondant daisy flowers & a gold birthday disc topper' },
        // s6 — Top-down view: white cream cake covered in fresh mango cubes, strawberries & blueberries, gold "Happy Birthday" acrylic topper
        { id: 56, name: 'Mango Strawberry Blueberry', image: 'assets/images/s6.webp', description: 'White buttercream cake topped with a vibrant medley of fresh mango cubes, halved strawberries & whole blueberries with a gold acrylic topper' },
        // s7 — Individual fresh mango cream cups: rows of white paper cups filled with cream and generous fresh mango pieces
        { id: 57, name: 'Fresh Mango Cream Cups', image: 'assets/images/s7.webp', description: 'Individual dessert cups filled with light cream and generous portions of fresh mango — ideal for bulk orders & celebrations' }
      ]
    },
    {
      id: 'winter',
      title: 'Winter Special',
      description: 'Build your own dream cake or customize dietary preferences',
      price: 'By Consultation',
      image: 'assets/images/IMG_5290_m.webp',
      products: [
        // IMG_5290_m — Chocolate drip cake with Ferrero Rocher, chocolate bars & miniature whiskey bottles (from previous batch)
        { id: 61, name: 'Chocolate Whiskey Drip', image: 'assets/images/IMG_5290_m.webp', description: 'Indulgent white buttercream cake with chocolate ganache drip, loaded with Ferrero Rocher, chocolate bars & miniature whiskey bottle toppers' },
        // IMG_5087 — Semi-naked cake with fresh mixed fruits (strawberries, raspberries, blueberries, orange) & rosemary on rustic wooden board
        { id: 62, name: 'Rustic Naked Fruit Cake', image: 'assets/images/IMG_5087.webp', description: 'Semi-naked buttercream cake topped with fresh strawberries, raspberries, blueberries, orange slices & fragrant rosemary sprigs on a rustic wooden board' },
        // wi1 — White buttercream cake with mixed fresh berries, gold leaf, custom Starbucks fondant mug topper & "Happy Birthday" acrylic plaque
        { id: 63, name: 'Berry Gold Birthday Cake', image: 'assets/images/wi1.webp', description: 'White buttercream cake piled with fresh strawberries, raspberries, blackberries & blueberries, gold leaf accents & a custom fondant character mug topper' },
        // wi2 — Full chocolate ganache drip cake: Nutella jar, Oreo cookies, KitKat bars, Maltesers & fresh strawberries
        { id: 64, name: 'Nutella Oreo Chocolate Drip', image: 'assets/images/wi2.webp', description: 'All-chocolate ganache drip cake loaded with a Nutella jar, Oreo cookies, KitKat bars, Maltesers & fresh strawberries — the ultimate indulgence' },
        // wi3 — Dark chocolate bubble/sphere cake with gold spatter, dark red rose buds, fresh strawberries & gold "Happy Birthday" plaque
        { id: 65, name: 'Dark Chocolate Bubble Cake', image: 'assets/images/wi3.webp', description: 'Dramatic dark chocolate bubble cake with gold spatter, dark red rose buds, fresh strawberries & a gold "Happy Birthday" plaque' },
        // wi4 — White buttercream with chocolate ganache drip, Jack Daniel's mini bottles, Ferrero Rocher, KitKat & gold leaf
        { id: 66, name: 'Jack Daniels Chocolate Drip', image: 'assets/images/wi4.webp', description: 'White buttercream cake with chocolate ganache drip, Jack Daniel\'s miniature bottles, Ferrero Rocher, KitKat bars & gold leaf — perfect for a grown-up celebration' }
      ]
    },
    {
      id: 'catalog',
      title: 'The Collection',
      description: 'Explore our complete artisanal portfolio',
      price: 'Download PDF',
      image: '',
      products: [],
      isCatalog: true,
      catalogUrl: 'assets/Mo_Made_Patisserie.pdf'
    }
  ];

  // Open PDF catalog
  openCatalog() {
    if (isPlatformBrowser(this.platformId)) {
      window.open('assets/Mo_Made_Patisserie.pdf', '_blank');
    }
  }

  activeCategory = computed(() => this.categories.find(c => c.id === this.selectedCategoryId()));

  filteredProducts = computed(() => {
    const category = this.activeCategory();
    if (!category) return [];
    return [...category.products];
  });

  openCategory(categoryId: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollPositionBeforeCategory = window.scrollY;
    }
    this.selectedCategoryId.set(categoryId);
    this.currentView.set('category');
    if (isPlatformBrowser(this.platformId)) {
      window.history.pushState({ view: 'category', categoryId }, '', '#category/' + categoryId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goBack() {
    this.currentView.set('landing');
    this.categoryTypeFilterSignal.set('wedding');
    if (isPlatformBrowser(this.platformId)) {
      // Clear hash from URL
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => {
        window.scrollTo({ top: this.scrollPositionBeforeCategory, behavior: 'smooth' });
        // Restore carousel horizontal scroll position
        this.restoreCarouselPosition();
      }, 50);
    }
  }

  scrollToConcierge() {
    setTimeout(() => {
      document.getElementById('concierge')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  nextStep() { if (this.step() < 3) this.step.update(v => v + 1); }
  prevStep() { if (this.step() > 1) this.step.update(v => v - 1); }

  canSubmit(): boolean {
    return !!(this.customerName && this.eventDate && this.selectedVibe() && this.selectedFlavor());
  }

  inquireProduct(productName: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    const phone = '919538954851';
    const message = 'Hi Monisha! I am interested in the "' + productName + '" from Mo Made Patisserie. Could you please share more details about customization options and pricing? Thank you!';
    // Try to open WhatsApp app directly on mobile, fallback to web
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'whatsapp://send?phone=' + phone + '&text=' + encodeURIComponent(message);
    } else {
      window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(message), '_blank');
    }
  }

  sendToWhatsApp() {
    if (!this.canSubmit() || !isPlatformBrowser(this.platformId)) return;
    const phone = '919538954851';
    const messageOnCake = this.cakeMessage ? ' Message on cake: "' + this.cakeMessage + '"' : '';
    const message = 'Hi Monisha! I am ' + this.customerName + ', and I am absolutely in love with Mo Made artistry! I am looking for a cake with a *' + this.selectedVibe() + '* vibe and *' + this.selectedFlavor() + '* flavor for *' + this.formatDate(this.eventDate) + '*.' + messageOnCake + ' Would love to discuss this with you!';
    // Try to open WhatsApp app directly on mobile, fallback to web
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'whatsapp://send?phone=' + phone + '&text=' + encodeURIComponent(message);
    } else {
      window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(message), '_blank');
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  getFlavorPattern(): string {
    const flavor = this.selectedFlavor();
    if (!flavor || this.step() < 2) return 'url(#velvetPattern)';
    const f = flavor.toLowerCase();
    if (f.includes('chocolate') || f.includes('velvet')) return 'url(#crossHatchPattern)';
    if (f.includes('vanilla')) return 'url(#stipplePattern)';
    if (f.includes('strawberry') || f.includes('mango') || f.includes('pineapple')) return 'url(#wavyPattern)';
    if (f.includes('butterscotch') || f.includes('coffee') || f.includes('pistachio')) return 'url(#hexPattern)';
    return 'url(#velvetPattern)';
  }

  getCakeFillGradient(): string {
    const flavor = this.selectedFlavor();
    if (!flavor) return 'url(#cakeGradDefault)';
    const f = flavor.toLowerCase();
    if (f.includes('chocolate')) return 'url(#cakeGradChocolate)';
    if (f.includes('vanilla')) return 'url(#cakeGradVanilla)';
    if (f.includes('red velvet') || f.includes('velvet')) return 'url(#cakeGradRedVelvet)';
    if (f.includes('strawberry')) return 'url(#cakeGradStrawberry)';
    if (f.includes('mango')) return 'url(#cakeGradMango)';
    if (f.includes('pineapple')) return 'url(#cakeGradPineapple)';
    if (f.includes('butterscotch')) return 'url(#cakeGradButterscotch)';
    if (f.includes('coffee')) return 'url(#cakeGradCoffee)';
    return 'url(#cakeGradDefault)';
  }

  getFlavorAccentColor(): string {
    const flavor = this.selectedFlavor();
    if (!flavor) return 'var(--color-secondary)';
    const f = flavor.toLowerCase();
    if (f.includes('chocolate')) return '#6B4226';
    if (f.includes('vanilla')) return '#D4AF37';
    if (f.includes('red velvet') || f.includes('velvet')) return '#B91C1C';
    if (f.includes('strawberry')) return '#E75480';
    if (f.includes('mango')) return '#FF9500';
    if (f.includes('pineapple')) return '#FFD700';
    if (f.includes('butterscotch')) return '#CD853F';
    if (f.includes('coffee')) return '#6F4E37';
    return 'var(--color-secondary)';
  }
}

@NgModule({
  declarations: [MoMadeComponent],
  imports: [CommonModule, FormsModule],
  exports: [MoMadeComponent]
})
export class MoMadeModule {}
