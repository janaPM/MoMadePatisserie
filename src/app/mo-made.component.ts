import { Component, NgModule, signal, computed, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

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
  price: number;
  flavor: string;
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
  eventDate = '';
  cakeMessage = '';

  // Auto-advance step 1 when vibe is selected
  onVibeSelect(vibeName: string) {
    this.selectedVibe.set(vibeName);
    setTimeout(() => this.nextStep(), 300); // Small delay for visual feedback
  }

  // Auto-advance step 2 when flavor is selected
  onFlavorSelect(flavorName: string) {
    this.selectedFlavor.set(flavorName);
    setTimeout(() => this.nextStep(), 300); // Small delay for visual feedback
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
    private location: Location,
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
      
      // Handle product URL on page load
      setTimeout(() => this.handleProductUrl(), 500);
      
      // Listen for hash changes (when user navigates via browser)
      window.addEventListener('hashchange', () => this.handleProductUrl());
    }
  }
  
  // Check URL for product ID and open zoom if found
  private handleProductUrl() {
    const hash = window.location.hash;
    
    // Handle product URL
    const productMatch = hash.match(/#product\/(\d+)/);
    if (productMatch) {
      const productId = parseInt(productMatch[1], 10);
      // Find product across all categories
      for (const category of this.categories) {
        const product = category.products.find(p => p.id === productId);
        if (product) {
          // Set the category and view first
          this.selectedCategoryId.set(category.id);
          this.currentView.set('category');
          // Open the product zoom after a short delay
          setTimeout(() => this.openZoom(product), 100);
          break;
        }
      }
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
    'assets/images/IMG_5087.webp',
    'assets/images/IMG_5088.webp'
  ];
  currentStoryIndex = signal(0);

  googleRating = signal(4.9);
  
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

  // getSeasonalProducts(): Product[] {
  //   const month = new Date().getMonth();
  //   if (month <= 1 || month >= 10) {
  //     return [
  //       { id: 101, name: 'Strawberry Bliss', price: 1600, flavor: 'fruit', image: 'assets/images/IMG_5089.webp', description: 'Vanilla sponge with Strawberry Compote & Vanilla Swiss Meringue Buttercream' },
  //       { id: 102, name: 'Chocolate Strawberry Dream', price: 1800, flavor: 'chocolate', image: 'assets/images/IMG_5088.webp', description: 'Chocolate sponge with fresh strawberry & Chocolate Ganache' }
  //     ];
  //   } else if (month >= 2 && month <= 5) {
  //     return [
  //       { id: 201, name: 'Mango Delight', price: 1700, flavor: 'fruit', image: 'assets/images/IMG_5087.webp', description: 'Vanilla Sponge with Fresh Mango & Vanilla Swiss Meringue Buttercream' },
  //       { id: 202, name: 'Pistachio Mango Fusion', price: 2000, flavor: 'nutty', image: 'assets/images/IMG_5089.webp', description: 'Pistachio sponge with Fresh Mango, Raspberry & Vanilla Swiss Meringue Buttercream' },
  //       { id: 203, name: 'Tropical Berry', price: 1800, flavor: 'fruit', image: 'assets/images/IMG_5087.webp', description: 'Vanilla Sponge with Fresh Mango, Raspberry & Vanilla Swiss Meringue Buttercream' }
  //     ];
  //   } else {
  //     return [
  //       { id: 301, name: 'Strawberry Bliss', price: 1600, flavor: 'fruit', image: 'assets/images/IMG_5089.webp', description: 'Vanilla sponge with Strawberry Compote & Vanilla Swiss Meringue Buttercream' },
  //       { id: 302, name: 'Tropical Berry', price: 1800, flavor: 'fruit', image: 'assets/images/IMG_5087.webp', description: 'Vanilla Sponge with Fresh Mango, Raspberry & Vanilla Swiss Meringue Buttercream' }
  //     ];
  //   }
  // }

  // getSeasonalTitle(): string {
  //   const month = new Date().getMonth();
  //   if (month <= 1 || month >= 10) return 'Winter Specials';
  //   if (month >= 2 && month <= 4) return 'Summer Harvest';
  //   return 'Monsoon Delights';
  // }

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
  
  // GitHub raw URL base for images (works before site is hosted)
  private readonly GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/karthickajan/MoMadePatisserie/main/src/';
  // Use GitHub Pages URL for now, change to custom domain when ready
  private readonly SITE_BASE_URL = 'https://karthickajan.github.io/MoMadePatisserie';
  
  // Update Open Graph meta tags for product sharing
  private updateMetaTags(product: {id: number; name: string; image: string; description: string}) {
    const productUrl = `${this.SITE_BASE_URL}/#product/${product.id}`;
    // Use GitHub raw URL for images (works even before hosting)
    const imageUrl = `${this.GITHUB_RAW_BASE}${product.image}`;
    const title = `${product.name} - Mo Made Patisserie`;
    const description = product.description;
    
    // Update document title
    document.title = title;
    
    // Update OG tags
    this.setMetaContent('og-title', title);
    this.setMetaContent('og-description', description);
    this.setMetaContent('og-url', productUrl);
    this.setMetaContent('og-image', imageUrl);
    this.setMetaContent('og-type', 'product');
    
    // Update Twitter tags
    this.setMetaContent('twitter-title', title);
    this.setMetaContent('twitter-description', description);
    this.setMetaContent('twitter-image', imageUrl);
  }
  
  // Reset meta tags to default
  private resetMetaTags() {
    const defaultTitle = 'Best Custom Cakes Bangalore | Luxury Patisserie by Monisha | Mo Made Patisserie';
    const defaultDescription = 'Award-winning patisserie creating bespoke wedding cakes and luxury desserts in Bangalore';
    const defaultImage = `${this.GITHUB_RAW_BASE}assets/images/IMG_5087.webp`;
    
    document.title = defaultTitle;
    
    this.setMetaContent('og-title', 'Mo Made Patisserie | Premium Custom Cakes Bangalore');
    this.setMetaContent('og-description', defaultDescription);
    this.setMetaContent('og-url', this.SITE_BASE_URL);
    this.setMetaContent('og-image', defaultImage);
    this.setMetaContent('og-type', 'website');
    
    this.setMetaContent('twitter-title', 'Mo Made Patisserie | Premium Cakes Bangalore');
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
    
    // Product URL that opens zoom view
    const productUrl = `${this.SITE_BASE_URL}/#product/${product.id}`;
    
    // Try to share with image using Web Share API Level 2
    try {
      const imageUrl = `${this.GITHUB_RAW_BASE}${product.image}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `${product.name.replace(/\s+/g, '-')}.webp`, { type: 'image/webp' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        // Share image with just the URL in text
        await navigator.share({
          files: [file],
          text: `${product.name} - Mo Made Patisserie\n${productUrl}`
        });
        return;
      }
    } catch (err) {
      console.log('Image share failed:', err);
    }
    
    // Fallback: Share URL only (cleaner for copy)
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          url: productUrl
        });
      } catch (err) {
        console.log('Share cancelled:', err);
      }
    } else {
      // Desktop: Copy just the URL
      try {
        await navigator.clipboard.writeText(productUrl);
        alert('Link copied to clipboard!');
      } catch (err) {
        window.open(`https://wa.me/?text=${encodeURIComponent(productUrl)}`, '_blank');
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
      price: 'From ₹3,000',
      image: 'assets/images/w1.webp',
      products: [
        { id: 1, name: 'Blush Garden Tier', price: 12500, flavor: 'vanilla', image: 'assets/images/w1.webp', description: 'Three-tier vanilla sponge with fresh roses and gold leaf accents' },
        { id: 2, name: 'Midnight Elegance', price: 15000, flavor: 'chocolate', image: 'assets/images/w2.webp', description: 'Dark chocolate ganache with deep burgundy sugar flowers' },
        { id: 3, name: 'Tropical Paradise', price: 11000, flavor: 'fruit', image: 'assets/images/w3.webp', description: 'Mango passion fruit layers with edible orchids' },
        { id: 4, name: 'Classic White', price: 9500, flavor: 'vanilla', image: 'assets/images/w4.webp', description: 'Traditional white fondant with delicate lace patterns' },
        { id: 5, name: 'Hazelnut Dream', price: 13500, flavor: 'nutty', image: 'assets/images/w5.webp', description: 'Praline buttercream with caramelized hazelnuts' },
        { id: 6, name: 'Berry Romance', price: 14000, flavor: 'fruit', image: 'assets/images/c9.webp', description: 'Mixed berry compote with white chocolate drip' }
      ]
    },
    {
      id: 'signature',
      title: 'Celebration Cakes',
      description: 'Our most loved classic flavors and timeless celebration designs',
      price: 'From ₹3,000',
      image: 'assets/images/c1.webp',
      products: [
        { id: 21, name: 'Chocolate Caramel', price: 1400, flavor: 'chocolate', image: 'assets/images/c1.webp', description: 'Chocolate sponge, salted caramel, Chocolate Feuilletine filling & Chocolate Ganache Frosting' },
        { id: 22, name: 'Chocolate Raspberry', price: 1500, flavor: 'chocolate', image: 'assets/images/c2.webp', description: 'Chocolate Sponge, Raspberry compote, Chocolate Feuilletine filling & Chocolate Swiss Meringue buttercream' },
        { id: 23, name: 'Chocolate Hazelnut', price: 1600, flavor: 'chocolate', image: 'assets/images/c3.webp', description: 'Chocolate sponge, Hazelnut praline, Chocolate Feuilletine filling & Chocolate Ganache frosting' },
        { id: 24, name: 'Red Velvet', price: 1300, flavor: 'vanilla', image: 'assets/images/c4.webp', description: 'Red Velvet sponge with cream cheese frosting or chocolate ganache' },
        { id: 25, name: 'Vanilla Berry', price: 1400, flavor: 'fruit', image: 'assets/images/c5.webp', description: 'Vanilla Sponge, Berry Compote, White Chocolate Pistachio feuilletine & Vanilla Swiss Meringue buttercream' },
        { id: 26, name: 'Lemon Blueberry', price: 1200, flavor: 'fruit', image: 'assets/images/c6.webp', description: 'Vanilla Sponge, Lemon curd, Blueberry compote & Vanilla Swiss Meringue buttercream' },
        { id: 27, name: 'Chocolate Caramel', price: 1400, flavor: 'chocolate', image: 'assets/images/c7.webp', description: 'Chocolate sponge, salted caramel, Chocolate Feuilletine filling & Chocolate Ganache Frosting' },
        { id: 28, name: 'Chocolate Raspberry', price: 1500, flavor: 'chocolate', image: 'assets/images/c8.webp', description: 'Chocolate Sponge, Raspberry compote, Chocolate Feuilletine filling & Chocolate Swiss Meringue buttercream' },
        { id: 29, name: 'Chocolate Hazelnut', price: 1600, flavor: 'chocolate', image: 'assets/images/c9.webp', description: 'Chocolate sponge, Hazelnut praline, Chocolate Feuilletine filling & Chocolate Ganache frosting' }
      ]
    },
    {
      id: 'premium',
      title: 'Confectionery',
      description: 'Exquisite ingredients, complex pairings, and luxury finishes',
      price: 'Commissioned Pieces',
      image: 'assets/images/co1.webp',
      products: [
        { id: 31, name: 'Coffee Hazelnut', price: 2000, flavor: 'nutty', image: 'assets/images/co1.webp', description: 'Vanilla Sponge, Chocolate Hazelnut feuilletine & Coffee Buttercream' },
        { id: 32, name: 'Coconut Passionfruit', price: 2200, flavor: 'fruit', image: 'assets/images/IMG_5089.webp', description: 'Coconut sponge, Passionfruit filling, White chocolate Feuilletine & Vanilla Swiss Meringue Buttercream' },
        { id: 33, name: 'Carrot Walnut', price: 1800, flavor: 'nutty', image: 'assets/images/co2.webp', description: 'Carrot Walnut Sponge with Cream cheese frosting' },
        { id: 34, name: 'Banana Dulce', price: 1900, flavor: 'vanilla', image: 'assets/images/co4.webp', description: 'Banana Walnut Sponge, Dulce Filling & Vanilla Swiss Meringue Buttercream' },
        { id: 35, name: 'Pistachio Raspberry', price: 2400, flavor: 'nutty', image: 'assets/images/co5.webp', description: 'Pistachio Sponge, Raspberry compote, White Chocolate feuilletine & Vanilla Swiss Meringue Buttercream' },
        { id: 36, name: 'Lychee Rose', price: 2200, flavor: 'fruit', image: 'assets/images/co6.webp', description: 'Vanilla Raspberry Sponge, Lychee Filling & Rose Swiss Meringue Buttercream' },
        { id: 37, name: 'Coffee Hazelnut', price: 2000, flavor: 'nutty', image: 'assets/images/co7.webp', description: 'Vanilla Sponge, Chocolate Hazelnut feuilletine & Coffee Buttercream' },
        { id: 38, name: 'Coconut Passionfruit', price: 2200, flavor: 'fruit', image: 'assets/images/co8.webp', description: 'Coconut sponge, Passionfruit filling, White chocolate Feuilletine & Vanilla Swiss Meringue Buttercream' },
        { id: 39, name: 'Carrot Walnut', price: 1800, flavor: 'nutty', image: 'assets/images/co9.webp', description: 'Carrot Walnut Sponge with Cream cheese frosting' },
        { id: 40, name: 'Banana Dulce', price: 1900, flavor: 'vanilla', image: 'assets/images/co10.webp', description: 'Banana Walnut Sponge, Dulce Filling & Vanilla Swiss Meringue Buttercream' },
        { id: 41, name: 'Pistachio Raspberry', price: 2400, flavor: 'nutty', image: 'assets/images/co11.webp', description: 'Pistachio Sponge, Raspberry compote, White Chocolate feuilletine & Vanilla Swiss Meringue Buttercream' },
        { id: 42, name: 'Lychee Rose', price: 2200, flavor: 'fruit', image: 'assets/images/co12.webp', description: 'Vanilla Raspberry Sponge, Lychee Filling & Rose Swiss Meringue Buttercream' },
        { id: 43, name: 'Coffee Hazelnut', price: 2000, flavor: 'nutty', image: 'assets/images/co13.webp', description: 'Vanilla Sponge, Chocolate Hazelnut feuilletine & Coffee Buttercream' },
        { id: 44, name: 'Coconut Passionfruit', price: 2200, flavor: 'fruit', image: 'assets/images/co14.webp', description: 'Coconut sponge, Passionfruit filling, White chocolate Feuilletine & Vanilla Swiss Meringue Buttercream' },
        { id: 45, name: 'Carrot Walnut', price: 1800, flavor: 'nutty', image: 'assets/images/co15.webp', description: 'Carrot Walnut Sponge with Cream cheese frosting' }
      ]
    },
    {
      id: 'seasonal',
      title: 'Summer Special',
      description: 'Fresh, limited-edition treats inspired by the summer season',
      price: 'By Consultation',
      image: 'assets/images/s1.webp',
      products: [
        { id: 41, name: 'Sugar Free Option', price: 300, flavor: 'vanilla', image: 'assets/images/s1.webp', description: 'Replace refined sugar with natural sweeteners (Add-on)' },
        { id: 42, name: 'Eggless Sponge Base', price: 0, flavor: 'vanilla', image: 'assets/images/s6.webp', description: '100% Eggless sponge for any flavor (Select to customize)' },
        { id: 43, name: 'Gluten Free Almond', price: 500, flavor: 'nutty', image: 'assets/images/s3.webp', description: 'Almond flour based sponge (Add-on)' },
        { id: 44, name: 'Custom Topper', price: 450, flavor: 'vanilla', image: 'assets/images/s4.webp', description: 'Acrylic or Fondant topper with personalized message' },
        { id: 45, name: 'Sugar Free Option', price: 300, flavor: 'vanilla', image: 'assets/images/s5.webp', description: 'Replace refined sugar with natural sweeteners (Add-on)' }
      ]
    },
    {
      id: 'custom',
      title: 'Winter Special',
      description: 'Build your own dream cake or customize dietary preferences',
      price: 'By Consultation',
      image: 'assets/images/IMG_5090.webp',
      products: [
        { id: 41, name: 'Sugar Free Option', price: 300, flavor: 'vanilla', image: 'assets/images/IMG_5090.webp', description: 'Replace refined sugar with natural sweeteners (Add-on)' },
        { id: 41, name: 'Sugar Free Option', price: 300, flavor: 'vanilla', image: 'assets/images/IMG_5087.webp', description: 'Replace refined sugar with natural sweeteners (Add-on)' },
        { id: 42, name: 'Eggless Sponge Base', price: 0, flavor: 'vanilla', image: 'assets/images/wi1.webp', description: '100% Eggless sponge for any flavor (Select to customize)' },
        { id: 43, name: 'Gluten Free Almond', price: 500, flavor: 'nutty', image: 'assets/images/wi2.webp', description: 'Almond flour based sponge (Add-on)' },
        { id: 44, name: 'Custom Topper', price: 450, flavor: 'vanilla', image: 'assets/images/wi3.webp', description: 'Acrylic or Fondant topper with personalized message' }
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
