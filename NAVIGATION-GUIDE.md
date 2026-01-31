# Navigation & Mobile Menu Visual Guide

## 📱 Mobile View (< 768px)

```
┌─────────────────────────────────┐
│ Mo Made  ☰  [WhatsApp] [Book]  │  ← Header
└─────────────────────────────────┘

After clicking ☰:
┌─────────────────────────────────┐
│ Mo Made  ✕  [WhatsApp] [Book]  │  ← Header changes to X
├─────────────────────────────────┤
│ Collections                      │
│ Our Story                        │
│ FAQ                              │
│ Order                            │
├─────────────────────────────────┤
│ [WhatsApp Button]               │
│ [Book Now Button]               │
└─────────────────────────────────┘
  ↓ Menu slides down with animation ↓
```

## 🖥️ Desktop View (≥ 768px)

```
┌─────────────────────────────────────────────────────────┐
│ Mo Made   Collections  Our Story  FAQ  Order            │
│ Patisserie           [WhatsApp] [Book Now]              │
└─────────────────────────────────────────────────────────┘
  ↑ All visible at once, no hamburger menu ↑
```

## 🔄 Navigation Flow

### Landing Page (Home)
```
┌─────────────────────────┐
│  Header w/ Nav Links    │
├─────────────────────────┤
│  Hero Section           │
│  Trust Signals          │
│  Collections Grid       │
│  Our Story              │
│  Concierge Form         │
│  Footer                 │
└─────────────────────────┘
      ↑
   (View: "landing")
```

### Category View (When you click a collection)
```
┌─────────────────────────┐
│  Header w/ Back Button  │
├─────────────────────────┤
│  Category Title         │
│  Filters (Flavor, Price)│
├─────────────────────────┤
│  Product Grid (3 cols)  │
│  [Product 1]            │
│  [Product 2]            │
│  [Product 3]            │
│  [Product 4]            │
│  ...                    │
└─────────────────────────┘
      ↑
   (View: "category")
```

### FAQ Page (When you click FAQ in nav)
```
┌─────────────────────────┐
│  Header w/ Nav Links    │
├─────────────────────────┤
│  "Frequently Asked      │
│   Questions"            │
├─────────────────────────┤
│  [Question 1] ✓         │
│  [Question 2]           │
│  [Question 3]           │ ← Click to expand
│  [Question 4]           │
│  [Question 5]           │
│  [Question 6]           │
│  [Question 7]           │
│  [Question 8]           │
├─────────────────────────┤
│  "Visit Us in Bangalore"│
│  [Address Info]         │
│  [Products List]        │
├─────────────────────────┤
│  "Ready to Create?"     │
│  [CTA Buttons]          │
└─────────────────────────┘
      ↑
   (View: "faq")
```

## 🎯 User Interactions

### Header Navigation
```
User clicks "FAQ"
    ↓
Header component emits: (navigateTo)="faq"
    ↓
Main component: currentView.set('faq')
    ↓
Template: @else if (currentView() === 'faq')
    ↓
FAQ Component renders
```

### Mobile Menu
```
User clicks ☰
    ↓
mobileMenuOpen.set(true)
    ↓
Menu slides down with animation
    ↓
User clicks "FAQ"
    ↓
navigate('faq')
    ↓
closeMobileMenu()
    ↓
Menu slides up
    ↓
FAQ page shows
```

### FAQ Accordion
```
User clicks Question 5
    ↓
toggleFaq(4)  [index starts at 0]
    ↓
expandedFaqIndex.set(4)
    ↓
Template: @if (expandedFaqIndex() === 4)
    ↓
Answer appears with slideUp animation
```

## 📊 Component Communication

```
AppComponent
    │
    └─ MoMadeComponent
        │   ↓ currentView signal
        │   ├─ "landing"
        │   ├─ "category" 
        │   └─ "faq"
        │
        ├─ HeaderComponent
        │   │ (Standalone)
        │   ├─ Inputs: none
        │   ├─ Outputs: (navigateTo) EventEmitter
        │   └─ Internal: mobileMenuOpen signal
        │
        └─ FaqComponent
            │ (Standalone)
            ├─ Inputs: none
            ├─ Outputs: none
            └─ Internal: expandedFaqIndex signal
```

## ✨ Animation Timings

| Animation | Duration | Used For |
|-----------|----------|----------|
| slideDown | 300ms | Mobile menu entrance |
| slideUp | 400ms | FAQ answer expansion |
| fadeIn | 500ms | Landing page load |
| scroll | 300ms | Smooth scroll to sections |

## 🎨 Color & Styling

### Header
- Background: `nav-header-bg` (primary with opacity)
- Text: `var(--color-primary)`
- Hover: `var(--color-secondary)`
- CTA: `var(--color-primary)` → hover `var(--color-secondary)`

### Mobile Menu
- Background: White with backdrop blur
- Borders: `border-accent-50`
- Items: Gray text on hover changes to secondary color

### FAQ Accordion
- Closed: `border border-accent-50` + white background
- Open: Light accent background with top border
- Answer text: `text-[#7A7471]`

## 📱 Responsive Breakpoints

| Screen | Width | Behavior |
|--------|-------|----------|
| Mobile | < 768px | Show hamburger menu |
| Tablet | 768px - 1024px | Show full header |
| Desktop | > 1024px | Show full header with spacing |

## 🚀 Performance Notes

- **Bundle impact:** Minimal (2-3 KB additional)
- **Animation performance:** GPU-accelerated transforms
- **Mobile menu:** Only renders when open (optimized)
- **FAQ component:** Lazy evaluates answers on click

---

**Last Updated:** February 1, 2026
