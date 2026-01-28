import { Component, NgModule, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
}

@Component({
  selector: 'app-mo-made',
  template: `
    <div class="min-h-screen bg-[#FDFBF9]">
      @if (currentView() === 'landing') {
        <div class="animate-fadeIn">
          <nav class="fixed w-full z-50 bg-[#FDFBF9]/90 backdrop-blur-md border-b border-[#F3DCD4]/50 transition-all duration-300">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="font-serif text-lg sm:text-2xl font-bold tracking-wider text-[#2D2926]">Mo Made</span>
                <span class="text-[#C49B8D] font-serif italic font-semibold text-xs sm:text-sm">Patisserie</span>
              </div>
              <div class="hidden md:flex items-center gap-8 text-sm font-sans font-medium tracking-wide">
                <a href="#boutique" class="text-[#2D2926] hover:text-[#C49B8D] transition-colors">Collections</a>
                <a href="#story" class="text-[#2D2926] hover:text-[#C49B8D] transition-colors">Our Story</a>
                <a href="#concierge" class="text-[#2D2926] hover:text-[#C49B8D] transition-colors">Order</a>
              </div>
              <a href="#concierge" class="bg-[#2D2926] text-white px-5 py-2.5 rounded-full text-sm font-sans font-medium hover:bg-[#C49B8D] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Book Now
              </a>
            </div>
          </nav>

          <section class="min-h-screen bg-gradient-to-br from-[#FDFBF9] via-[#FFF8F5] to-[#F3DCD4]/30 pt-24 relative overflow-hidden">
            <div class="absolute top-20 right-0 w-96 h-96 bg-[#F3DCD4]/20 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 left-0 w-80 h-80 bg-[#C49B8D]/10 rounded-full blur-3xl"></div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
              <div class="flex flex-col xl:flex-row items-center gap-12 xl:gap-20 2xl:gap-32">
                <div class="flex-1 min-w-[340px] max-w-2xl space-y-8 text-center xl:text-left z-10">
                  <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F3DCD4] to-[#F3DCD4]/60 border border-[#C49B8D]/30">
                    <svg class="w-4 h-4 text-[#C49B8D]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span class="text-xs font-sans font-bold text-[#2D2926] uppercase tracking-[0.2em]">LBB Award Winner</span>
                    <svg class="w-4 h-4 text-[#C49B8D]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <h1 class="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2D2926] leading-[1.1]">
                    Where <span class="italic text-[#C49B8D]">Sugar</span><br/>Becomes Art
                  </h1>
                  <p class="text-lg sm:text-xl text-[#5A5552] max-w-lg mx-auto lg:mx-0 font-sans font-light leading-relaxed">
                    Bespoke floral wedding cakes & artisanal cakesicles handcrafted with love in Bangalore by <span class="font-medium text-[#2D2926]">Monisha Prakash</span>
                  </p>
                  <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <a href="#concierge" class="group inline-flex items-center justify-center gap-3 bg-[#2D2926] text-white px-8 py-4 rounded-full font-sans font-medium hover:bg-[#C49B8D] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                      Consult on WhatsApp
                      <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </a>
                    <a href="#boutique" class="inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur text-[#2D2926] border border-[#F3DCD4] px-8 py-4 rounded-full font-sans font-medium hover:bg-[#F3DCD4]/30 transition-all duration-300">
                      View Collections
                    </a>
                  </div>
                </div>
                <div class="flex-1 relative z-10">
                  <div class="absolute -inset-4 sm:-inset-6 bg-gradient-to-br from-[#F3DCD4] to-[#C49B8D]/30 rounded-[40px] -rotate-3 shadow-2xl"></div>
                  <div class="relative group">
                    <img src="assets/images/IMG_5087.jpeg" alt="Signature Floral Cake" class="relative rounded-[32px] shadow-2xl z-10 w-full object-cover h-[400px] sm:h-[500px] lg:h-[550px] group-hover:scale-[1.02] transition-transform duration-700"/>
                    <div class="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl z-20 border border-[#F3DCD4]/50">
                      <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-[#F3DCD4] rounded-full flex items-center justify-center">
                          <svg class="w-6 h-6 text-[#C49B8D]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </div>
                        <div>
                          <p class="text-xs text-[#7A7471] font-sans uppercase tracking-wider">Trusted by</p>
                          <p class="font-serif text-lg text-[#2D2926] font-bold">5000+ Clients</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="bg-white border-y border-[#F3DCD4]/50 py-8">
            <div class="max-w-6xl mx-auto px-4 sm:px-6">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div class="space-y-1">
                  <p class="font-serif text-3xl sm:text-4xl text-[#2D2926] font-bold">4.9<span class="text-[#C49B8D]">/5</span></p>
                  <p class="text-xs font-sans uppercase tracking-[0.15em] text-[#7A7471]">Google Rating</p>
                </div>
                <div class="space-y-1">
                  <p class="font-serif text-3xl sm:text-4xl text-[#2D2926] font-bold">100<span class="text-[#C49B8D]">%</span></p>
                  <p class="text-xs font-sans uppercase tracking-[0.15em] text-[#7A7471]">Eggless Options</p>
                </div>
                <div class="space-y-1">
                  <p class="font-serif text-3xl sm:text-4xl text-[#2D2926] font-bold">7<span class="text-[#C49B8D]">+</span></p>
                  <p class="text-xs font-sans uppercase tracking-[0.15em] text-[#7A7471]">Years Crafting</p>
                </div>
                <div class="space-y-1">
                  <p class="font-serif text-3xl sm:text-4xl text-[#2D2926] font-bold">5K<span class="text-[#C49B8D]">+</span></p>
                  <p class="text-xs font-sans uppercase tracking-[0.15em] text-[#7A7471]">Happy Celebrations</p>
                </div>
              </div>
            </div>
          </section>

          <section id="boutique" class="py-20 sm:py-28 bg-[#FDFBF9]">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
              <div class="text-center mb-16 space-y-4">
                <div class="inline-flex items-center gap-2 text-[#C49B8D]">
                  <span class="w-12 h-px bg-[#C49B8D]"></span>
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/></svg>
                  <span class="w-12 h-px bg-[#C49B8D]"></span>
                </div>
                <h2 class="font-serif text-4xl sm:text-5xl text-[#2D2926] font-bold">The Boutique</h2>
                <p class="text-[#7A7471] font-sans text-lg max-w-2xl mx-auto">Curated collections of edible artistry, each piece handcrafted to perfection</p>
              </div>
              <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                @for (category of categories; track category.id) {
                  <div class="group cursor-pointer" (click)="openCategory(category.id)">
                    <div class="relative overflow-hidden rounded-3xl mb-6 aspect-[4/5] bg-[#F3DCD4]/30">
                      <img [src]="category.image" [alt]="category.title" class="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"/>
                      <div class="absolute inset-0 bg-gradient-to-t from-[#2D2926]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div class="absolute bottom-6 left-6 right-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <span class="inline-flex items-center gap-2 bg-white/90 backdrop-blur text-[#2D2926] px-4 py-2 rounded-full text-sm font-sans font-medium">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          View Collection
                        </span>
                      </div>
                    </div>
                    <div class="space-y-2 px-2">
                      <div class="flex items-center justify-between">
                        <h3 class="font-serif text-2xl text-[#2D2926] group-hover:text-[#C49B8D] transition-colors">{{category.title}}</h3>
                        <svg class="w-5 h-5 text-[#C49B8D] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                      </div>
                      <p class="text-[#7A7471] font-sans text-sm leading-relaxed">{{category.description}}</p>
                      <p class="text-[#C49B8D] font-sans font-bold text-lg">{{category.price}}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </section>

          <section id="story" class="py-20 sm:py-28 bg-white relative overflow-hidden">
            <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F3DCD4]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
              <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div class="relative order-2 lg:order-1 group cursor-pointer" (click)="toggleStoryImage()">
                  <div class="absolute -inset-4 bg-gradient-to-br from-[#F3DCD4]/50 to-[#C49B8D]/20 rounded-[40px] rotate-2"></div>
                  
                  <div class="relative rounded-[32px] overflow-hidden shadow-xl aspect-video md:aspect-[4/5] lg:aspect-video xl:aspect-[4/3] group-hover:scale-[1.02] transition-transform duration-700">
                    <!-- Image Slider -->
                    @for (img of storyImages; track img; let i = $index) {
                      <img [src]="img" 
                           [class]="'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ' + (currentStoryIndex() === i ? 'opacity-100' : 'opacity-0')"
                           alt="Our Story Video Cover"/>
                    }
                    
                    <!-- Play Button Overlay -->
                    <div class="absolute inset-0 flex items-center justify-center z-20 bg-black/10 group-hover:bg-black/20 transition-colors">
                      <button class="w-20 h-20 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </button>
                    </div>

                    <!-- Narrative Overlay -->
                    <div class="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black/80 to-transparent text-left">
                       <p class="text-white/80 font-sans text-xs uppercase tracking-[0.2em] mb-2">Watch the Film</p>
                       <p class="text-white font-serif text-2xl italic">"From a concept to a masterpiece."</p>
                    </div>
                  </div>
                </div>
                <div class="space-y-8 order-1 lg:order-2">
                  <div class="inline-flex items-center gap-2 text-[#C49B8D]">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <span class="text-xs font-sans font-bold uppercase tracking-[0.2em]">Our Story</span>
                  </div>
                  <h2 class="font-serif text-4xl sm:text-5xl text-[#2D2926] font-bold leading-tight">
                    More than cakes,<br/><span class="italic text-[#C49B8D]">we craft memories</span>
                  </h2>
                  <blockquote class="text-[#5A5552] font-sans text-lg leading-relaxed border-l-4 border-[#F3DCD4] pl-6 italic">
                    "Every cake I create carries a piece of my heart. From selecting the perfect sugar flowers to hand-painting delicate petals, I believe that the art of baking is really the art of loving."
                  </blockquote>
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16 rounded-full bg-[#F3DCD4] flex items-center justify-center">
                      <span class="font-serif text-2xl text-[#C49B8D] font-bold">M</span>
                    </div>
                    <div>
                      <p class="font-serif text-xl text-[#2D2926] font-bold">Monisha Prakash</p>
                      <p class="text-[#7A7471] font-sans text-sm">Founder & Sugar Artist</p>
                    </div>
                  </div>
                  <div class="pt-4">
                    <a href="https://instagram.com/mo_made_patisserie" target="_blank" class="inline-flex items-center gap-3 text-[#2D2926] hover:text-[#C49B8D] transition-colors font-sans font-medium group">
                      <span class="w-10 h-10 rounded-full bg-[#F3DCD4] flex items-center justify-center group-hover:bg-[#C49B8D] transition-colors">
                        <svg class="w-5 h-5 text-[#C49B8D] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      </span>
                      Follow our journey &#64;mo_made_patisserie
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="concierge" class="py-20 sm:py-28 bg-[#2D2926] text-white relative overflow-hidden">
            <div class="absolute inset-0 opacity-5 bg-pattern"></div>
            <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
              <div class="text-center mb-12 space-y-4">
                <div class="inline-flex items-center gap-2">
                  <svg class="w-5 h-5 text-[#C49B8D]" fill="currentColor" viewBox="0 0 24 24"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
                  <span class="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#F3DCD4]">Occasion Concierge</span>
                  <svg class="w-5 h-5 text-[#C49B8D]" fill="currentColor" viewBox="0 0 24 24"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
                </div>
                <h2 class="font-serif text-4xl sm:text-5xl text-[#F3DCD4] font-bold">Design Your Dream Cake</h2>
                <p class="text-gray-400 font-sans text-lg max-w-2xl mx-auto">Three simple steps to begin your bespoke cake journey</p>
              </div>

              <div class="flex justify-center items-center gap-4 mb-12">
                @for (s of [1,2,3]; track s; let i = $index) {
                  <div class="flex items-center">
                    <div [class]="'w-10 h-10 rounded-full flex items-center justify-center font-sans font-bold text-sm transition-all duration-300 ' + (step() >= s ? 'bg-[#C49B8D] text-white' : 'bg-white/10 text-gray-500')">{{s}}</div>
                    @if (i < 2) {
                      <div [class]="'w-16 sm:w-24 h-0.5 mx-2 transition-all duration-300 ' + (step() > s ? 'bg-[#C49B8D]' : 'bg-white/10')"></div>
                    }
                  </div>
                }
              </div>

              <div class="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl max-w-6xl mx-auto">
                <div class="flex flex-col 2xl:flex-row gap-12 2xl:gap-16">
                  <div class="flex-1">
                    @if (step() === 1) {
                      <div class="space-y-8 animate-slideUp">
                        <div class="text-center">
                          <h3 class="font-serif text-2xl text-[#F3DCD4] mb-2">Select Your Vibe</h3>
                          <p class="text-gray-400 font-sans text-sm">What aesthetic speaks to your celebration?</p>
                        </div>
                        <div class="grid sm:grid-cols-3 gap-4">
                          @for (vibe of vibes; track vibe.name) {
                            <div (click)="selectedVibe.set(vibe.name)" [class]="'relative cursor-pointer rounded-2xl p-6 text-center transition-all duration-300 border ' + (selectedVibe() === vibe.name ? 'border-[#C49B8D] bg-[#C49B8D]/10' : 'border-white/10 hover:border-white/30 bg-white/5')">
                              <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-[#F3DCD4]/5 flex items-center justify-center border border-[#C49B8D]/20">
                                <svg class="w-7 h-7 text-[#C49B8D]" fill="none" stroke="currentColor" stroke-width="0.5" viewBox="0 0 24 24">
                                  @if (vibe.name === 'Romantic') {
                                    <path d="M12 21C12 21 4 13.5 4 8.5C4 5.5 6.5 3 9.5 3C11 3 12 4 12 4C12 4 13 3 14.5 3C17.5 3 20 5.5 20 8.5C20 13.5 12 21 12 21Z"/>
                                  }
                                  @if (vibe.name === 'Minimal') {
                                    <rect x="3" y="3" width="18" height="18" rx="0"/>
                                    <line x1="3" y1="12" x2="21" y2="12"/>
                                    <line x1="12" y1="3" x2="12" y2="21"/>
                                  }
                                  @if (vibe.name === 'Whimsical') {
                                    <circle cx="12" cy="12" r="3"/>
                                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>
                                  }
                                </svg>
                              </div>
                              <h4 class="font-serif text-lg text-white mb-1">{{vibe.name}}</h4>
                              <p class="text-gray-400 font-sans text-xs leading-relaxed">{{vibe.desc}}</p>
                              @if (selectedVibe() === vibe.name) {
                                <div class="absolute top-3 right-3">
                                  <svg class="w-4 h-4 text-[#C49B8D]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                                </div>
                              }
                            </div>
                          }
                        </div>
                        <button (click)="nextStep()" [disabled]="!selectedVibe()" [class]="'w-full py-4 rounded-xl font-sans font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ' + (selectedVibe() ? 'bg-[#C49B8D] hover:bg-[#B38A7C] shadow-lg hover:shadow-xl' : 'bg-gray-600 cursor-not-allowed')">
                          Continue to Flavors
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                        </button>
                      </div>
                    }

                    @if (step() === 2) {
                      <div class="space-y-8 animate-slideUp">
                        <div class="text-center">
                          <h3 class="font-serif text-2xl text-[#F3DCD4] mb-2">Choose Your Flavor Profile</h3>
                          <p class="text-gray-400 font-sans text-sm">Our signature flavors, crafted to perfection</p>
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          @for (flavor of flavors; track flavor.name) {
                            <div (click)="selectedFlavor.set(flavor.name)" [class]="'cursor-pointer rounded-xl p-4 text-center transition-all duration-300 border ' + (selectedFlavor() === flavor.name ? 'border-[#C49B8D] bg-[#C49B8D]/10' : 'border-white/10 hover:border-white/30 bg-white/5')">
                              <div class="w-10 h-10 mx-auto mb-3 rounded-full bg-[#F3DCD4]/5 flex items-center justify-center border border-[#C49B8D]/20">
                                <svg class="w-5 h-5 text-[#C49B8D]" fill="none" stroke="currentColor" stroke-width="0.5" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="8"/>
                                  <circle cx="12" cy="12" r="4" stroke-dasharray="2,2"/>
                                  <circle cx="12" cy="12" r="1" fill="currentColor"/>
                                </svg>
                              </div>
                              <p class="text-sm text-white font-serif">{{flavor.name}}</p>
                            </div>
                          }
                        </div>
                        <div class="flex gap-4">
                          <button (click)="prevStep()" class="flex-1 py-4 rounded-xl font-sans font-bold text-white bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
                            Back
                          </button>
                          <button (click)="nextStep()" [disabled]="!selectedFlavor()" [class]="'flex-1 py-4 rounded-xl font-sans font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ' + (selectedFlavor() ? 'bg-[#C49B8D] hover:bg-[#B38A7C] shadow-lg' : 'bg-gray-600 cursor-not-allowed')">
                            Continue
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                          </button>
                        </div>
                      </div>
                    }

                    @if (step() === 3) {
                      <div class="space-y-8 animate-slideUp">
                        <div class="text-center">
                          <h3 class="font-serif text-2xl text-[#F3DCD4] mb-2">Final Details</h3>
                          <p class="text-gray-400 font-sans text-sm">Tell us about your special day</p>
                        </div>
                        <div class="grid sm:grid-cols-2 gap-6">
                          <div class="space-y-2">
                            <label class="text-xs font-sans uppercase tracking-widest text-gray-400">Your Name</label>
                            <input type="text" [(ngModel)]="customerName" placeholder="e.g. Priya Sharma" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white font-sans placeholder-gray-500 focus:outline-none focus:border-[#C49B8D] focus:ring-1 focus:ring-[#C49B8D] transition-all"/>
                          </div>
                          <div class="space-y-2">
                            <label class="text-xs font-sans uppercase tracking-widest text-gray-400">Event Date</label>
                            <input type="date" [(ngModel)]="eventDate" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white font-sans focus:outline-none focus:border-[#C49B8D] focus:ring-1 focus:ring-[#C49B8D] transition-all"/>
                          </div>
                        </div>
                        <div class="space-y-2">
                          <label class="text-xs font-sans uppercase tracking-widest text-gray-400">Message on Cake</label>
                          <input type="text" [(ngModel)]="cakeMessage" placeholder="e.g. Happy Birthday Priya!" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white font-sans placeholder-gray-500 focus:outline-none focus:border-[#C49B8D] focus:ring-1 focus:ring-[#C49B8D] transition-all"/>
                          <p class="text-xs text-gray-500 font-sans">Leave blank if no message needed</p>
                        </div>
                        <div class="bg-[#C49B8D]/10 rounded-xl p-4 border border-[#C49B8D]/30">
                          <p class="text-sm font-sans text-[#F3DCD4]">
                            <span class="font-bold">Your Selection:</span> {{selectedVibe()}} vibe with {{selectedFlavor()}} flavor
                          </p>
                        </div>
                        <div class="flex gap-4">
                          <button (click)="prevStep()" class="flex-1 py-4 rounded-xl font-sans font-bold text-white bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
                            Back
                          </button>
                          <button (click)="sendToWhatsApp()" [disabled]="!canSubmit()" [class]="'flex-1 py-4 rounded-xl font-sans font-bold transition-all duration-300 flex items-center justify-center gap-2 ' + (canSubmit() ? 'bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg hover:shadow-xl' : 'bg-gray-600 text-gray-400 cursor-not-allowed')">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>
                            Send to WhatsApp
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                  
                  <div class="2xl:w-[420px] flex items-center justify-center">
                    <div [class]="'relative w-full max-w-[360px] 2xl:max-w-[400px] aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFF8F5] via-[#FFF0EB] to-[#FFE4DB] shadow-2xl border border-white/50 cake-preview-container ' + (canSubmit() ? 'ring-4 ring-[#C49B8D]/30' : '')">
                      <!-- Sparkle animation when ready to submit -->
                      @if (canSubmit()) {
                        <div class="absolute inset-0 pointer-events-none z-30">
                          <div class="sparkle sparkle-1"></div>
                          <div class="sparkle sparkle-2"></div>
                          <div class="sparkle sparkle-3"></div>
                          <div class="sparkle sparkle-4"></div>
                          <div class="sparkle sparkle-5"></div>
                          <div class="sparkle sparkle-6"></div>
                          <div class="sparkle sparkle-7"></div>
                          <div class="sparkle sparkle-8"></div>
                          <div class="sparkle sparkle-9"></div>
                          <div class="sparkle sparkle-10"></div>
                        </div>
                      }
                      <div class="absolute inset-0 flex items-center justify-center" style="perspective: 800px;">
                        <div class="cake-3d relative" style="transform-style: preserve-3d; transform: rotateX(-15deg) rotateY(-20deg);">
                          <svg class="w-64 h-72" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <!-- Premium Chocolate - Rich & Decadent -->
                              <linearGradient id="cakeGradChocolate" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#8B5A3C"/>
                                <stop offset="40%" stop-color="#6B4226"/>
                                <stop offset="100%" stop-color="#4A2C17"/>
                              </linearGradient>
                              <!-- Vanilla Bean - Creamy Elegance -->
                              <linearGradient id="cakeGradVanilla" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#FFFEF5"/>
                                <stop offset="50%" stop-color="#FFF8DC"/>
                                <stop offset="100%" stop-color="#F5E6C8"/>
                              </linearGradient>
                              <!-- Red Velvet - Bold & Romantic -->
                              <linearGradient id="cakeGradRedVelvet" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#DC3545"/>
                                <stop offset="50%" stop-color="#B91C1C"/>
                                <stop offset="100%" stop-color="#8B0000"/>
                              </linearGradient>
                              <!-- Strawberry - Fresh Pink Blush -->
                              <linearGradient id="cakeGradStrawberry" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#FFD1DC"/>
                                <stop offset="50%" stop-color="#FF9EB5"/>
                                <stop offset="100%" stop-color="#E75480"/>
                              </linearGradient>
                              <!-- Mango - Tropical Sunset -->
                              <linearGradient id="cakeGradMango" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#FFE135"/>
                                <stop offset="50%" stop-color="#FFBF00"/>
                                <stop offset="100%" stop-color="#FF9500"/>
                              </linearGradient>
                              <!-- Pineapple - Golden Tropical -->
                              <linearGradient id="cakeGradPineapple" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#FFFACD"/>
                                <stop offset="50%" stop-color="#FFE066"/>
                                <stop offset="100%" stop-color="#FFD700"/>
                              </linearGradient>
                              <!-- Butterscotch - Caramel Warmth -->
                              <linearGradient id="cakeGradButterscotch" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#FFE4B5"/>
                                <stop offset="50%" stop-color="#DEB887"/>
                                <stop offset="100%" stop-color="#CD853F"/>
                              </linearGradient>
                              <!-- Coffee - Mocha Sophistication -->
                              <linearGradient id="cakeGradCoffee" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#C4A484"/>
                                <stop offset="50%" stop-color="#A67B5B"/>
                                <stop offset="100%" stop-color="#6F4E37"/>
                              </linearGradient>
                              <!-- Default - Rose Petal Blush -->
                              <linearGradient id="cakeGradDefault" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#FFF0EB"/>
                                <stop offset="50%" stop-color="#F3DCD4"/>
                                <stop offset="100%" stop-color="#E8C8BD"/>
                              </linearGradient>
                              <!-- Frosting Gradients -->
                              <linearGradient id="frostingWhite" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#FFFFFF"/>
                                <stop offset="100%" stop-color="#FAFAFA"/>
                              </linearGradient>
                              <linearGradient id="frostingPink" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#FFF0F5"/>
                                <stop offset="100%" stop-color="#FFB6C1"/>
                              </linearGradient>
                              <linearGradient id="frostingChoco" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#A67B5B"/>
                                <stop offset="100%" stop-color="#6B4226"/>
                              </linearGradient>
                              <!-- Gold accent for Minimal vibe -->
                              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#D4AF37"/>
                                <stop offset="50%" stop-color="#FFD700"/>
                                <stop offset="100%" stop-color="#D4AF37"/>
                              </linearGradient>
                              <filter id="cakeShadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#2D2926" flood-opacity="0.3"/>
                              </filter>
                              <filter id="innerGlow">
                                <feGaussianBlur stdDeviation="2" result="blur"/>
                                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                              </filter>
                            </defs>
                            
                            <g filter="url(#cakeShadow)" class="cake-body">
                              <ellipse cx="100" cy="215" rx="65" ry="12" [attr.fill]="getCakeFillGradient()" opacity="0.9"/>
                              <ellipse cx="100" cy="215" rx="60" ry="10" fill="url(#frostingWhite)" opacity="0.3"/>
                              
                              <path d="M35 165 L35 215 Q35 220 100 225 Q165 220 165 215 L165 165 Q165 170 100 175 Q35 170 35 165" [attr.fill]="getCakeFillGradient()" class="cake-tier-bottom"/>
                              <ellipse cx="100" cy="165" rx="65" ry="12" [attr.fill]="getCakeFillGradient()"/>
                              <ellipse cx="100" cy="165" rx="60" ry="10" fill="url(#frostingWhite)" opacity="0.2"/>
                              @if (selectedVibe() === 'Romantic') {
                                <ellipse cx="100" cy="165" rx="55" ry="8" fill="none" stroke="#F8BBD9" stroke-width="3" stroke-dasharray="8,4" class="animate-pulse"/>
                              }
                              
                              <path d="M45 115 L45 165 Q45 168 100 173 Q155 168 155 165 L155 115 Q155 118 100 123 Q45 118 45 115" [attr.fill]="getCakeFillGradient()" class="cake-tier-middle"/>
                              <ellipse cx="100" cy="115" rx="55" ry="10" [attr.fill]="getCakeFillGradient()"/>
                              <ellipse cx="100" cy="115" rx="50" ry="8" fill="url(#frostingWhite)" opacity="0.2"/>
                              
                              <!-- Cake Message Text - 2 lines, 20 chars each -->
                              @if (cakeMessage && cakeMessage.trim()) {
                                <g class="cake-message">
                                  <text x="100" y="140" text-anchor="middle" fill="#2D2926" font-size="8" font-family="'Playfair Display', serif" font-style="italic" opacity="0.9">
                                    {{getCakeMessageLines()[0]}}
                                  </text>
                                  @if (getCakeMessageLines()[1]) {
                                    <text x="100" y="152" text-anchor="middle" fill="#2D2926" font-size="8" font-family="'Playfair Display', serif" font-style="italic" opacity="0.9">
                                      {{getCakeMessageLines()[1]}}
                                    </text>
                                  }
                                </g>
                              }
                              
                              @if (selectedVibe() === 'Minimal') {
                                <!-- Truly minimal - clean, no ribbons or accents -->
                              }
                              
                              <path d="M55 70 L55 115 Q55 118 100 122 Q145 118 145 115 L145 70 Q145 73 100 77 Q55 73 55 70" [attr.fill]="getCakeFillGradient()" class="cake-tier-top"/>
                              <ellipse cx="100" cy="70" rx="45" ry="8" [attr.fill]="getCakeFillGradient()"/>
                              <ellipse cx="100" cy="70" rx="40" ry="6" fill="url(#frostingWhite)" opacity="0.25"/>
                              
                              @if (selectedVibe() === 'Romantic') {
                                <g class="romantic-decorations">
                                  <!-- Heart flowers on top -->
                                  <path d="M75 55 C72 50, 66 50, 66 55 C66 60, 75 65, 75 65 C75 65, 84 60, 84 55 C84 50, 78 50, 75 55" fill="#F8BBD9" opacity="0.9"/>
                                  <path d="M95 48 C91 42, 83 42, 83 48 C83 55, 95 62, 95 62 C95 62, 107 55, 107 48 C107 42, 99 42, 95 48" fill="#F48FB1" opacity="0.85"/>
                                  <path d="M118 52 C115 48, 110 48, 110 52 C110 57, 118 61, 118 61 C118 61, 126 57, 126 52 C126 48, 121 48, 118 52" fill="#F8BBD9" opacity="0.9"/>
                                  <path d="M100 38 C97 33, 92 33, 92 38 C92 43, 100 48, 100 48 C100 48, 108 43, 108 38 C108 33, 103 33, 100 38" fill="#EC407A" opacity="0.8"/>
                                  
                                  <!-- Small hearts on sides -->
                                  <path d="M55 130 C53 127, 49 127, 49 130 C49 133, 55 136, 55 136 C55 136, 61 133, 61 130 C61 127, 57 127, 55 130" fill="#F8BBD9" opacity="0.7"/>
                                  <path d="M145 135 C143 132, 140 132, 140 135 C140 138, 145 141, 145 141 C145 141, 150 138, 150 135 C150 132, 147 132, 145 135" fill="#F48FB1" opacity="0.6"/>
                                  <circle cx="50" cy="180" r="6" fill="#F8BBD9" opacity="0.7"/>
                                  <circle cx="150" cy="185" r="5" fill="#F48FB1" opacity="0.6"/>
                                </g>
                              }
                              
                              @if (selectedVibe() === 'Minimal') {
                                <!-- Truly minimal - clean cake with no decorations, just elegant simplicity -->
                              }
                              
                              @if (selectedVibe() === 'Whimsical') {
                                <g class="whimsical-decorations">
                                  <circle cx="70" cy="50" r="6" fill="#E1BEE7"/>
                                  <circle cx="90" cy="42" r="8" fill="#B2EBF2"/>
                                  <circle cx="115" cy="48" r="7" fill="#C8E6C9"/>
                                  <circle cx="130" cy="55" r="5" fill="#FFECB3"/>
                                  
                                  <path d="M40 180 Q35 195 42 205" stroke="#F8BBD9" stroke-width="4" fill="none" stroke-linecap="round"/>
                                  <path d="M50 175 Q48 185 52 192" stroke="#B2EBF2" stroke-width="3" fill="none" stroke-linecap="round"/>
                                  <path d="M160 180 Q165 192 158 202" stroke="#C8E6C9" stroke-width="4" fill="none" stroke-linecap="round"/>
                                  <path d="M150 178 Q153 186 148 193" stroke="#FFECB3" stroke-width="3" fill="none" stroke-linecap="round"/>
                                  
                                  <circle cx="60" cy="100" r="4" fill="#E1BEE7" opacity="0.8"/>
                                  <circle cx="140" cy="105" r="3" fill="#B2EBF2" opacity="0.8"/>
                                  <circle cx="55" cy="145" r="5" fill="#C8E6C9" opacity="0.7"/>
                                  <circle cx="145" cy="150" r="4" fill="#FFECB3" opacity="0.7"/>
                                </g>
                              }
                              
                              @if (!selectedVibe() && step() >= 1) {
                                <g class="default-topper">
                                  <ellipse cx="100" cy="55" rx="20" ry="6" fill="#F3DCD4"/>
                                  <rect x="95" y="35" width="10" height="25" rx="2" fill="#F3DCD4"/>
                                  <circle cx="100" cy="32" r="8" fill="#C49B8D"/>
                                  <text x="100" y="36" text-anchor="middle" fill="white" font-size="10" font-weight="bold">?</text>
                                </g>
                              }
                            </g>
                            
                            <g class="shine-effects">
                              <ellipse cx="75" cy="90" rx="8" ry="3" fill="white" opacity="0.3"/>
                              <ellipse cx="70" cy="140" rx="6" ry="2" fill="white" opacity="0.25"/>
                              <ellipse cx="68" cy="188" rx="7" ry="2.5" fill="white" opacity="0.2"/>
                            </g>
                          </svg>
                        </div>
                      </div>
                      
                      <div class="absolute bottom-4 left-4 right-4">
                        <div class="bg-white/90 backdrop-blur-sm rounded-xl p-3 text-center shadow-lg">
                          @if (selectedVibe() && selectedFlavor()) {
                            <p class="text-xs font-sans text-[#7A7471]">Your Creation</p>
                            <p class="font-serif text-sm text-[#2D2926] font-bold">{{selectedVibe()}} · {{selectedFlavor()}}</p>
                          } @else if (selectedVibe()) {
                            <p class="text-xs font-sans text-[#7A7471]">Style Selected</p>
                            <p class="font-serif text-sm text-[#2D2926] font-bold">{{selectedVibe()}} Vibe</p>
                          } @else {
                            <p class="text-xs font-sans text-[#7A7471]">Cake Preview</p>
                            <p class="font-serif text-sm text-[#C49B8D]">Select vibe & flavor</p>
                          }
                        </div>
                      </div>
                      
                      @if (selectedFlavor()) {
                        <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
                          <span class="text-xs font-sans font-bold" [style.color]="getFlavorAccentColor()">{{selectedFlavor()}}</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer class="bg-[#FDFBF9] border-t border-[#F3DCD4]/50 py-16">
            <div class="max-w-6xl mx-auto px-4 sm:px-6">
              <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                <div class="lg:col-span-2 space-y-4">
                  <div class="flex items-center gap-2">
                    <span class="font-serif text-3xl font-bold text-[#2D2926]">Mo Made</span>
                    <span class="text-[#C49B8D] font-serif italic">Patisserie</span>
                  </div>
                  <p class="text-[#7A7471] font-sans leading-relaxed max-w-sm">Artisanal cakes crafted with love and precision. Making your celebrations sweeter since 2018.</p>
                  <div class="flex gap-4">
                    <a href="https://instagram.com/mo_made_patisserie" target="_blank" class="w-10 h-10 rounded-full bg-[#F3DCD4] flex items-center justify-center text-[#C49B8D] hover:bg-[#C49B8D] hover:text-white transition-all duration-300">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <a href="#concierge" class="w-10 h-10 rounded-full bg-[#F3DCD4] flex items-center justify-center text-[#C49B8D] hover:bg-[#C49B8D] hover:text-white transition-all duration-300">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z"/></svg>
                    </a>
                  </div>
                </div>
                <div class="space-y-4">
                  <h4 class="font-serif text-lg text-[#2D2926] font-bold">Quick Links</h4>
                  <ul class="space-y-2 text-[#7A7471] font-sans">
                    <li><a href="#boutique" class="hover:text-[#C49B8D] transition-colors">Collections</a></li>
                    <li><a href="#story" class="hover:text-[#C49B8D] transition-colors">Our Story</a></li>
                    <li><a href="#concierge" class="hover:text-[#C49B8D] transition-colors">Book Now</a></li>
                  </ul>
                </div>
                <div class="space-y-4">
                  <h4 class="font-serif text-lg text-[#2D2926] font-bold">Visit Us</h4>
                  <p class="text-[#7A7471] font-sans text-sm leading-relaxed">Mahalakshmipuram Layout<br/>Bangalore, Karnataka<br/>India</p>
                  <p class="text-[#C49B8D] font-sans font-medium text-sm">By Appointment Only</p>
                </div>
              </div>
              <div class="border-t border-[#F3DCD4]/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p class="text-xs text-[#7A7471] font-sans uppercase tracking-widest">&copy; 2026 Mo Made Patisserie. All rights reserved.</p>
                <p class="text-xs text-[#7A7471] font-sans">Crafted with <svg class="w-3 h-3 inline text-[#C49B8D]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> in Bangalore</p>
              </div>
            </div>
          </footer>
        </div>
      } @else {
        <div class="animate-slideUp">
          <div class="sticky top-0 z-50 bg-[#FDFBF9]/95 backdrop-blur-md border-b border-[#F3DCD4]/50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <div class="flex items-center justify-between">
                <button (click)="goBack()" class="inline-flex items-center gap-2 text-[#2D2926] hover:text-[#C49B8D] transition-colors font-sans font-medium group">
                  <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
                  Back to Home
                </button>
                <div class="flex items-center gap-2">
                  <span class="font-serif text-xl font-bold text-[#2D2926]">Mo Made</span>
                  <span class="text-[#C49B8D] font-serif italic text-sm">Patisserie</span>
                </div>
                <a href="#" (click)="inquireProduct(activeCategory()?.title || ''); $event.preventDefault()" class="bg-[#2D2926] text-white px-4 py-2 rounded-full text-sm font-sans font-medium hover:bg-[#C49B8D] transition-all inline-flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>
                  Inquire
                </a>
              </div>
            </div>

            <div class="border-t border-[#F3DCD4]/30 bg-white/50">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 class="font-serif text-2xl sm:text-3xl text-[#2D2926] font-bold">{{activeCategory()?.title}}</h1>
                    <p class="text-[#7A7471] font-sans text-sm mt-1">Refine Your Selection</p>
                  </div>
                  <div class="flex flex-wrap gap-3">
                    <div class="relative">
                      <select [(ngModel)]="flavorFilterSignal" (ngModelChange)="onFlavorFilterChange($event)" class="appearance-none bg-white border border-[#F3DCD4] rounded-full pl-4 pr-14 py-2.5 text-sm font-sans text-[#2D2926] focus:outline-none focus:border-[#C49B8D] focus:ring-1 focus:ring-[#C49B8D]/20 cursor-pointer transition-all hover:border-[#C49B8D]/50">
                        <option value="all">All Flavors</option>
                        <option value="chocolate">Chocolate</option>
                        <option value="fruit">Fruit</option>
                        <option value="nutty">Nutty</option>
                        <option value="vanilla">Vanilla</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg class="w-4 h-4 text-[#C49B8D]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                      </div>
                    </div>
                    <div class="relative">
                      <select [(ngModel)]="priceSortSignal" (ngModelChange)="onPriceSortChange($event)" class="appearance-none bg-white border border-[#F3DCD4] rounded-full pl-4 pr-14 py-2.5 text-sm font-sans text-[#2D2926] focus:outline-none focus:border-[#C49B8D] focus:ring-1 focus:ring-[#C49B8D]/20 cursor-pointer transition-all hover:border-[#C49B8D]/50">
                        <option value="default">Sort by Price</option>
                        <option value="low">Low to High</option>
                        <option value="high">High to Low</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg class="w-4 h-4 text-[#C49B8D]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 bg-[#FDFBF9]">
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 xl:gap-24">
              @for (product of filteredProducts(); track product.id) {
                <div class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#F3DCD4]/30 hover:border-[#C49B8D]/30">
                  <div class="relative aspect-[4/5] overflow-hidden">
                    <img [src]="product.image" [alt]="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#2D2926]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 border border-[#F3DCD4]/50">
                      <span class="text-[10px] font-sans font-bold text-[#C49B8D] uppercase tracking-[0.15em]">{{product.flavor}}</span>
                    </div>
                  </div>
                  <div class="p-6 space-y-4">
                    <h3 class="font-serif text-xl text-[#2D2926] group-hover:text-[#C49B8D] transition-colors leading-tight">{{product.name}}</h3>
                    <p class="text-[#7A7471] font-sans text-sm leading-relaxed line-clamp-2">{{product.description}}</p>
                    <div class="flex items-center justify-between pt-2 border-t border-[#F3DCD4]/30">
                      <p class="font-sans text-xl text-[#2D2926] font-bold tracking-tight">₹{{product.price | number}}</p>
                      <button (click)="inquireProduct(product.name)" class="inline-flex items-center gap-2 bg-[#F3DCD4]/50 hover:bg-[#C49B8D] text-[#2D2926] hover:text-white px-4 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>
                        Inquire
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
            @if (filteredProducts().length === 0) {
              <div class="text-center py-16">
                <svg class="w-16 h-16 mx-auto text-[#F3DCD4] mb-4" fill="none" stroke="currentColor" stroke-width="0.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
                <p class="font-serif text-xl text-[#2D2926] mb-2">No products match your filters</p>
                <p class="text-[#7A7471] font-sans text-sm">Try adjusting your selection criteria</p>
              </div>
            }
          </div>

          <div class="bg-[#2D2926] py-16">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <h3 class="font-serif text-2xl sm:text-3xl text-[#F3DCD4] font-bold mb-4">Can't find what you're looking for?</h3>
              <p class="text-gray-400 font-sans mb-8 max-w-xl mx-auto">We specialize in bespoke creations tailored to your vision. Let's design your perfect cake together.</p>
              <button (click)="goBack(); scrollToConcierge()" class="inline-flex items-center gap-3 bg-[#C49B8D] hover:bg-[#B38A7C] text-white px-8 py-4 rounded-full font-sans font-medium transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
                Start Custom Order
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes draw {
      from { stroke-dashoffset: 1000; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes float {
      0%, 100% { transform: rotateX(-15deg) rotateY(-20deg) translateY(0); }
      50% { transform: rotateX(-15deg) rotateY(-20deg) translateY(-8px); }
    }
    @keyframes pulse-soft {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
    .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
    .animate-draw { 
      stroke-dasharray: 1000; 
      stroke-dashoffset: 1000; 
      animation: draw 2s ease-out forwards; 
    }
    .cake-3d {
      animation: float 4s ease-in-out infinite;
    }
    .cake-preview-container {
      background: linear-gradient(135deg, #FFF8F5 0%, #FFF0EB 50%, #FFE4DB 100%);
    }
    .cake-preview-container::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%);
      pointer-events: none;
    }
    .cake-tier-bottom, .cake-tier-middle, .cake-tier-top {
      transition: fill 0.5s ease;
    }
    .romantic-decorations, .minimal-decorations, .whimsical-decorations {
      animation: fadeIn 0.6s ease-out forwards;
    }
    .shine-effects ellipse {
      animation: pulse-soft 3s ease-in-out infinite;
    }
    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-400 { animation-delay: 0.4s; }
    
    /* Sparkle animation for ready-to-submit state */
    @keyframes sparkle {
      0% { opacity: 0; transform: scale(0) rotate(0deg); }
      20% { opacity: 1; transform: scale(1) rotate(45deg); }
      40% { opacity: 0.6; transform: scale(0.6) rotate(90deg); }
      60% { opacity: 1; transform: scale(1.1) rotate(135deg); }
      80% { opacity: 0.4; transform: scale(0.4) rotate(180deg); }
      100% { opacity: 0; transform: scale(0) rotate(225deg); }
    }
    @keyframes float-sparkle {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(180deg); }
    }
    .sparkle {
      position: absolute;
      pointer-events: none;
    }
    .sparkle::before {
      content: '✦';
      font-size: inherit;
      color: #FFD700;
      text-shadow: 0 0 10px #FFD700, 0 0 20px #FFA500, 0 0 30px #FF8C00;
      animation: sparkle 2s ease-in-out infinite, float-sparkle 3s ease-in-out infinite;
    }
    .sparkle-1 { top: 3%; left: 18%; font-size: 18px; }
    .sparkle-1::before { animation-delay: 0s; }
    .sparkle-2 { top: 6%; right: 42%; font-size: 24px; }
    .sparkle-2::before { animation-delay: 0.2s; }
    .sparkle-3 { top: 20%; left: 13%; font-size: 14px; }
    .sparkle-3::before { animation-delay: 0.4s; }
    .sparkle-4 { top: 25%; right: 5%; font-size: 20px; }
    .sparkle-4::before { animation-delay: 0.6s; }
    .sparkle-5 { top: 45%; left: 15%; font-size: 16px; }
    .sparkle-5::before { animation-delay: 0.8s; }
    .sparkle-6 { top: 50%; right: 22%; font-size: 22px; }
    .sparkle-6::before { animation-delay: 1s; }
    .sparkle-7 { bottom: 35%; left: 20%; font-size: 15px; }
    .sparkle-7::before { animation-delay: 0.3s; }
    .sparkle-8 { bottom: 30%; right: 12%; font-size: 19px; }
    .sparkle-8::before { animation-delay: 0.5s; }
    .sparkle-9 { bottom: 15%; left: 16%; font-size: 21px; }
    .sparkle-9::before { animation-delay: 0.7s; }
    .sparkle-10 { bottom: 10%; right: 12%; font-size: 17px; }
    .sparkle-10::before { animation-delay: 0.9s; }
    
    :host { display: block; font-family: 'Inter', sans-serif; }
    .font-serif { font-family: 'Playfair Display', serif; }
    .font-sans { font-family: 'Inter', sans-serif; }
    input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
    .bg-pattern { background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    select option { background: #2D2926; color: white; }
  `]
})
export class MoMadeComponent {
  currentView = signal<'landing' | 'category'>('landing');
  selectedCategoryId = signal<string>('');
  step = signal(1);
  selectedVibe = signal('');
  selectedFlavor = signal('');
  customerName = '';
  eventDate = '';
  cakeMessage = '';

  storyImages = [
    'assets/images/IMG_5087.jpeg',
    'assets/images/IMG_5088.jpeg'
  ];
  currentStoryIndex = signal(0);

  toggleStoryImage() {
    this.currentStoryIndex.update(i => (i + 1) % this.storyImages.length);
  }

  getSeasonalProducts(): Product[] {
    const month = new Date().getMonth(); // 0-11
    // Winter: Nov(10), Dec(11), Jan(0), Feb(1)
    // Summer: Mar(2), Apr(3), May(4)
    // Monsoon: Jun(5), Jul(6), Aug(7), Sep(8), Oct(9)
    
    if (month <= 1 || month >= 10) {
      // Winter
      return [
        { id: 101, name: 'Strawberry & Cream', price: 1800, flavor: 'fruit', image: 'assets/images/IMG_5089.png', description: 'Fresh seasonal strawberries with light chantilly cream' },
        { id: 102, name: 'Rich Plum Cake', price: 1200, flavor: 'fruit', image: 'assets/images/IMG_5088.jpeg', description: 'Traditional fruit cake soaked in premium spirits' },
        { id: 103, name: 'Hot Cocoa Tea Cake', price: 950, flavor: 'chocolate', image: 'assets/images/IMG_5088.jpeg', description: 'Warm spiced chocolate cake perfect for chilly evenings' }
      ];
    } else if (month >= 2 && month <= 4) {
      // Summer
      return [
        { id: 201, name: 'Alphonso Mango Delight', price: 2200, flavor: 'fruit', image: 'assets/images/IMG_5089.png', description: 'Fresh Ratnagiri mangoes with vanilla sponge' },
        { id: 202, name: 'Lemon Blueberry', price: 1600, flavor: 'fruit', image: 'assets/images/IMG_5087.jpeg', description: 'Zesty lemon curd with fresh blueberries' }
      ];
    } else {
      // Monsoon/Autumn
      return [
        { id: 301, name: 'Spiced Carrot Cake', price: 1400, flavor: 'nutty', image: 'assets/images/IMG_5087.jpeg', description: 'Moist carrot cake with walnuts and cream cheese frosting' },
        { id: 302, name: 'Dark Cherry Forest', price: 1800, flavor: 'chocolate', image: 'assets/images/IMG_5088.jpeg', description: 'Classic black forest with fresh dark cherries' }
      ];
    }
  }

  getSeasonalTitle(): string {
    const month = new Date().getMonth();
    if (month <= 1 || month >= 10) return 'Winter Specials';
    if (month >= 2 && month <= 4) return 'Summer Harvest';
    return 'Monsoon Delights';
  }

  /**
   * Splits the cake message into two lines:
   * - First line: first two words
   * - Second line: next 20 characters (if any), with ellipsis if more
   */
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
  
  flavorFilterSignal = signal('all');
  priceSortSignal = signal('default');
  
  get flavorFilter() { return this.flavorFilterSignal(); }
  set flavorFilter(val: string) { this.flavorFilterSignal.set(val); }
  
  get priceSort() { return this.priceSortSignal(); }
  set priceSort(val: string) { this.priceSortSignal.set(val); }

  onFlavorFilterChange(value: string) {
    this.flavorFilterSignal.set(value);
  }

  onPriceSortChange(value: string) {
    this.priceSortSignal.set(value);
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
      price: 'Starting ₹5,500',
      image: 'assets/images/IMG_5089.png',
      products: [
        { id: 1, name: 'Blush Garden Tier', price: 12500, flavor: 'vanilla', image: 'assets/images/IMG_5087.jpeg', description: 'Three-tier vanilla sponge with fresh roses and gold leaf accents' },
        { id: 2, name: 'Midnight Elegance', price: 15000, flavor: 'chocolate', image: 'assets/images/IMG_5088.jpeg', description: 'Dark chocolate ganache with deep burgundy sugar flowers' },
        { id: 3, name: 'Tropical Paradise', price: 11000, flavor: 'fruit', image: 'assets/images/IMG_5089.png', description: 'Mango passion fruit layers with edible orchids' },
        { id: 4, name: 'Classic White', price: 9500, flavor: 'vanilla', image: 'assets/images/IMG_5087.jpeg', description: 'Traditional white fondant with delicate lace patterns' },
        { id: 5, name: 'Hazelnut Dream', price: 13500, flavor: 'nutty', image: 'assets/images/IMG_5088.jpeg', description: 'Praline buttercream with caramelized hazelnuts' },
        { id: 6, name: 'Berry Romance', price: 14000, flavor: 'fruit', image: 'assets/images/IMG_5089.png', description: 'Mixed berry compote with white chocolate drip' }
      ]
    },
    {
      id: 'signature',
      title: 'Signature Collection',
      description: 'Our most loved classic flavors and timeless designs',
      price: 'Starting ₹1,500',
      image: 'assets/images/IMG_5087.jpeg',
      products: [
        { id: 21, name: 'Classic Vanilla Bean', price: 1500, flavor: 'vanilla', image: 'assets/images/IMG_5087.jpeg', description: 'Moist vanilla sponge with Madagascar bean buttercream' },
        { id: 22, name: 'Dutch Chocolate', price: 1600, flavor: 'chocolate', image: 'assets/images/IMG_5088.jpeg', description: 'Rich chocolate ganache layer cake' },
        { id: 23, name: 'Red Velvet Supreme', price: 1600, flavor: 'vanilla', image: 'assets/images/IMG_5089.png', description: 'Authentic red velvet with cream cheese frosting' }
      ]
    },
    {
      id: 'premium',
      title: 'Premium Collection',
      description: 'Exquisite ingredients, complex pairings, and luxury finishes',
      price: 'Starting ₹2,200',
      image: 'assets/images/IMG_5088.jpeg',
      products: [
        { id: 31, name: 'Hazelnut Praline', price: 2500, flavor: 'nutty', image: 'assets/images/IMG_5088.jpeg', description: 'Roasted hazelnut mousse with crunchy praline' },
        { id: 32, name: 'Saffron Pistachio', price: 2800, flavor: 'nutty', image: 'assets/images/IMG_5087.jpeg', description: 'Kashmiri saffron infused sponge with pistachio paste' },
        { id: 33, name: 'Belgian Truffle', price: 2400, flavor: 'chocolate', image: 'assets/images/IMG_5088.jpeg', description: 'Imported Belgian chocolate truffle indulgence' }
      ]
    },
    {
      id: 'seasonal',
      title: this.getSeasonalTitle(),
      description: 'Fresh, limited-edition treats inspired by the season',
      price: 'Seasonal Pricing',
      image: 'assets/images/IMG_5089.png',
      products: this.getSeasonalProducts()
    },
    {
      id: 'custom',
      title: 'Customization',
      description: 'Build your own dream cake or customize dietary preferences',
      price: 'Varies',
      image: 'assets/images/IMG_5090.png',
      products: [
        { id: 41, name: 'Sugar Free Option', price: 300, flavor: 'vanilla', image: 'assets/images/IMG_5087.jpeg', description: 'Replace refined sugar with natural sweeteners (Add-on)' },
        { id: 42, name: 'Eggless Sponge Base', price: 0, flavor: 'vanilla', image: 'assets/images/IMG_5087.jpeg', description: '100% Eggless sponge for any flavor (Select to customize)' },
        { id: 43, name: 'Gluten Free Almond', price: 500, flavor: 'nutty', image: 'assets/images/IMG_5087.jpeg', description: 'Almond flour based sponge (Add-on)' },
        { id: 44, name: 'Custom Topper', price: 450, flavor: 'vanilla', image: 'assets/images/IMG_5089.png', description: 'Acrylic or Fondant topper with personalized message' }
      ]
    }
  ];

  activeCategory = computed(() => this.categories.find(c => c.id === this.selectedCategoryId()));

  filteredProducts = computed(() => {
    const category = this.activeCategory();
    if (!category) return [];
    let products = [...category.products];
    const flavorVal = this.flavorFilterSignal();
    const sortVal = this.priceSortSignal();
    if (flavorVal !== 'all') {
      products = products.filter(p => p.flavor === flavorVal);
    }
    if (sortVal === 'low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'high') {
      products.sort((a, b) => b.price - a.price);
    }
    return products;
  });

  openCategory(categoryId: string) {
    this.selectedCategoryId.set(categoryId);
    this.currentView.set('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack() {
    this.currentView.set('landing');
    this.flavorFilterSignal.set('all');
    this.priceSortSignal.set('default');
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
    const phone = '919900000000';
    const message = `Hi Monisha! ✨

I'm interested in the "${productName}" from Mo Made Patisserie.

Could you please share more details about customization options and pricing?

Thank you! 🎂`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  }

  sendToWhatsApp() {
    if (!this.canSubmit()) return;
    const phone = '919900000000';
    const messageOnCake = this.cakeMessage ? `\n\nMessage on cake: "${this.cakeMessage}"` : '';
    const message = `Hi Monisha! ✨

I'm ${this.customerName}, and I'm absolutely in love with Mo Made's artistry!

I'm looking for a cake with a *${this.selectedVibe()}* vibe and *${this.selectedFlavor()}* flavor for *${this.formatDate(this.eventDate)}*.${messageOnCake}

Would love to discuss this with you! 🎂`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
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
    if (!flavor) return '#C49B8D';
    const f = flavor.toLowerCase();
    // Premium accent colors that harmonize with vibes
    if (f.includes('chocolate')) return '#6B4226';
    if (f.includes('vanilla')) return '#D4AF37';
    if (f.includes('red velvet') || f.includes('velvet')) return '#B91C1C';
    if (f.includes('strawberry')) return '#E75480';
    if (f.includes('mango')) return '#FF9500';
    if (f.includes('pineapple')) return '#FFD700';
    if (f.includes('butterscotch')) return '#CD853F';
    if (f.includes('coffee')) return '#6F4E37';
    return '#C49B8D';
  }
}

@NgModule({
  declarations: [MoMadeComponent],
  imports: [CommonModule, FormsModule],
  exports: [MoMadeComponent]
})
export class MoMadeModule {}
