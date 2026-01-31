# Image Optimization Strategy

## Current Findings
- **808 KB savings potential** from oversized images
- **2 images** can be served in modern formats (WebP/AVIF)
- **1.52s LCP delay** (need <500ms)

## Quick Implementation (3 Options)

### **Option 1: Responsive Images with WebP (Manual)**
Convert JPEGs to WebP and use `<picture>` tag:

```html
<picture>
  <source srcset="assets/images/IMG_5087.webp" type="image/webp">
  <source srcset="assets/images/IMG_5087.jpeg" type="image/jpeg">
  <img src="assets/images/IMG_5087.jpeg" alt="Cake" loading="eager">
</picture>
```

**Tools:**
- macOS/Linux: `cwebp -q 80 input.jpeg -o output.webp`
- Online: https://www.convertio.co/jpeg-webp/

### **Option 2: Cloudinary CDN (Best for Scale)**
Upload images to Cloudinary and reference via URL:

```html
<img src="https://res.cloudinary.com/[YOUR_CLOUD]/image/upload/c_scale,w_800,f_auto/IMG_5087" alt="Cake">
```

**Benefits:**
- Automatic WebP/AVIF serving
- Responsive sizing
- CDN caching
- One-click optimization

### **Option 3: Local Image Resizing (Build-Time)**
Add a build script to generate multiple sizes:

```bash
npm install sharp --save-dev
```

Then create a script to auto-generate WebP versions.

## Current Status
✅ **Preload added** for hero image
✅ **Cache headers configured** (1 year for assets)
✅ **Tailwind deferred** (removes render-blocking)
⏳ **Image optimization** - Choose Option 1, 2, or 3 above

## Estimated Impact
After implementing images:
- **LCP: 1.52s → 800ms** (preload + WebP)
- **Total savings: 808 KB** (better UX on slow networks)
- **Lighthouse score: 70-75 → 85-90**
