# Wireframes & UI Design

# AI-Powered Recipe Generator

## 🎨 Design System

### Color Palette

- **Primary Orange:** #F97316 (orange-500)
- **Secondary Blue:** #3B82F6 (blue-500)
- **Success Green:** #10B981 (emerald-500)
- **Warning Yellow:** #F59E0B (amber-500)
- **Error Red:** #EF4444 (red-500)
- **Neutral Gray:** #6B7280 (gray-500)
- **Background Light:** #FEFEFE
- **Background Dark:** #111827

### Typography

- **Primary Font:** Geist Sans
- **Monospace Font:** Geist Mono
- **Heading Sizes:** text-5xl, text-3xl, text-2xl, text-xl
- **Body Text:** text-base, text-sm
- **Font Weights:** font-normal, font-semibold, font-bold

### Component Library

- **Buttons:** Rounded corners (rounded-lg), hover effects
- **Input Fields:** Border focus states, placeholder text
- **Cards:** Shadow elevation, padding consistency
- **Navigation:** Clean, minimal design
- **Icons:** Food-themed emoji and SVG icons

## 📱 Wireframe Specifications

### 1. Landing Page (Desktop & Mobile)

```
┌─────────────────────────────────────────────────────┐
│                    HEADER                           │
│  🍳 AI Recipe Generator                             │
│  "Discover delicious recipes with AI"              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 HERO SECTION                       │
│  ┌─────────────────┐  ┌─────────────────┐         │
│  │ What's in your  │  │      👨‍🍳         │         │
│  │ kitchen?        │  │                 │         │
│  │                 │  │ AI-Powered      │         │
│  │ [Ingredient     │  │ Cooking         │         │
│  │  Input Field]   │  │ Assistant       │         │
│  │                 │  │                 │         │
│  │ [Generate ✨]   │  │                 │         │
│  └─────────────────┘  └─────────────────┘         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 FEATURES GRID                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │   🎯    │  │   🥗    │  │   ⚡    │             │
│  │ Smart   │  │ Dietary │  │ Instant │             │
│  │ Match   │  │ Prefs   │  │ Results │             │
│  └─────────┘  └─────────┘  └─────────┘             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 AUTH SECTION                        │
│               Get Started                           │
│          Sign in with magic link                    │
│                                                     │
│         [Email Input Field]                         │
│         [Send Magic Link 🪄]                        │
└─────────────────────────────────────────────────────┘
```

### 2. Recipe Generator Page

```
┌─────────────────────────────────────────────────────┐
│  NAVIGATION: Home | Saved Recipes | Profile         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              INGREDIENT INPUT                       │
│  "Enter your ingredients"                           │
│  ┌─────────────────────────────────────────────────┐ │
│  │ chicken, rice, tomatoes, onions            [+] │ │
│  └─────────────────────────────────────────────────┘ │
│                                                     │
│  Tags: [chicken] [rice] [tomatoes] [onions]         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│               FILTER OPTIONS                        │
│  Dietary: [Vegan] [Keto] [Gluten-Free] [Dairy-Free]│
│  Cuisine: [Italian] [Asian] [Mexican] [American]    │
│  Time: [< 15min] [< 30min] [< 1hr] [Any]           │
│  Difficulty: [Beginner] [Intermediate] [Advanced]   │
│                                                     │
│               [Generate Recipes 🔥]                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│               LOADING STATE                         │
│              🍳 Cooking up recipes...               │
│              ████████████ 100%                     │
└─────────────────────────────────────────────────────┘
```

### 3. Recipe Results Page

```
┌─────────────────────────────────────────────────────┐
│              RECIPE CARDS GRID                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │[Recipe Img] │  │[Recipe Img] │  │[Recipe Img] │ │
│  │             │  │             │  │             │ │
│  │ Chicken     │  │ Fried Rice  │  │ Tomato      │ │
│  │ Stir Fry    │  │ Special     │  │ Chicken     │ │
│  │             │  │             │  │ Curry       │ │
│  │ ⏱️ 25 min   │  │ ⏱️ 30 min   │  │ ⏱️ 45 min   │ │
│  │ 👨‍🍳 Easy    │  │ 👨‍🍳 Medium  │  │ 👨‍🍳 Easy    │ │
│  │ ⭐ 4.8      │  │ ⭐ 4.5      │  │ ⭐ 4.7      │ │
│  │ [❤️ Save]   │  │ [❤️ Save]   │  │ [❤️ Save]   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│               PAGINATION                            │
│        [← Previous]  1 2 3 4 5  [Next →]           │
└─────────────────────────────────────────────────────┘
```

### 4. Recipe Detail Page

```
┌─────────────────────────────────────────────────────┐
│                  RECIPE HEADER                      │
│  [← Back to Results]              [❤️ Save Recipe]  │
│                                                     │
│  ┌─────────────────┐                               │
│  │                 │  Chicken Stir Fry             │
│  │  [Recipe Image] │  ⭐⭐⭐⭐⭐ 4.8 (124 reviews)    │
│  │     Large       │                               │
│  │                 │  ⏱️ Prep: 15min | Cook: 25min  │
│  │                 │  👨‍🍳 Difficulty: Easy          │
│  └─────────────────┘  🍽️ Serves: 4 people          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 RECIPE CONTENT                      │
│  ┌─────────────────┐  ┌─────────────────┐           │
│  │   INGREDIENTS   │  │   INSTRUCTIONS  │           │
│  │                 │  │                 │           │
│  │ □ 1 lb chicken  │  │ 1. Heat oil in  │           │
│  │ □ 2 cups rice   │  │    large pan    │           │
│  │ □ 3 tomatoes    │  │                 │           │
│  │ □ 1 onion       │  │ 2. Add chicken  │           │
│  │ □ 2 tbsp oil    │  │    and cook     │           │
│  │ □ Salt & pepper │  │                 │           │
│  │                 │  │ 3. Add veggies  │           │
│  │ [Shopping List] │  │    and stir     │           │
│  └─────────────────┘  │                 │           │
│                       │ 4. Season and   │           │
│                       │    serve hot    │           │
│                       │                 │           │
│                       │ [Print Recipe]  │           │
│                       └─────────────────┘           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│               NUTRITION & TIPS                      │
│  Nutrition (per serving):                           │
│  Calories: 320 | Protein: 25g | Carbs: 35g         │
│                                                     │
│  Chef's Tips:                                       │
│  • Use day-old rice for better texture              │
│  • Don't overcrowd the pan                          │
│  • High heat is key for good stir fry               │
└─────────────────────────────────────────────────────┘
```

### 5. User Profile Page

```
┌─────────────────────────────────────────────────────┐
│               PROFILE HEADER                        │
│  👤 john.doe@email.com                              │
│  Member since: January 2024                         │
│  Recipes saved: 23 | Recipes created: 5             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              PREFERENCES                            │
│  Dietary Restrictions:                              │
│  [✓] Vegetarian  [ ] Vegan  [ ] Gluten-Free        │
│  [ ] Keto       [✓] Low-Sodium                     │
│                                                     │
│  Favorite Cuisines:                                 │
│  [✓] Italian  [✓] Asian  [ ] Mexican               │
│                                                     │
│  Cooking Skill: [Beginner] [●Intermediate] [Expert] │
│                                                     │
│              [Update Preferences]                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│               SAVED RECIPES                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │[Thumb Img]  │  │[Thumb Img]  │  │[Thumb Img]  │ │
│  │Pasta        │  │Chicken      │  │Vegetable    │ │
│  │Carbonara    │  │Curry        │  │Stir Fry     │ │
│  │Saved 2d ago │  │Saved 1w ago │  │Saved 2w ago │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                     │
│              [View All Saved Recipes]               │
└─────────────────────────────────────────────────────┘
```

### 6. Mobile Responsive Design

```
Mobile (375px width):

┌─────────────────────┐
│    🍳 Recipe Gen    │
│                     │
│ What's in kitchen?  │
│ ┌─────────────────┐ │
│ │ [Ingredients]   │ │
│ └─────────────────┘ │
│ [Generate ✨]       │
│                     │
│     👨‍🍳             │
│ AI Cooking Asst     │
│                     │
│ ┌─────────────────┐ │
│ │      🎯         │ │
│ │ Smart Matching  │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │      🥗         │ │
│ │ Dietary Prefs   │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │      ⚡         │ │
│ │ Instant Results │ │
│ └─────────────────┘ │
│                     │
│    Get Started      │
│ ┌─────────────────┐ │
│ │ [Email Input]   │ │
│ └─────────────────┘ │
│ [Send Magic Link]   │
└─────────────────────┘
```

## 🎯 User Experience Flow

### Primary User Journey

1. **Landing** → User sees value proposition
2. **Authentication** → Quick magic link signup
3. **Onboarding** → Set dietary preferences
4. **Input** → Enter available ingredients
5. **Filtering** → Customize recipe criteria
6. **Generation** → AI creates recipes
7. **Selection** → Choose preferred recipe
8. **Cooking** → Follow instructions
9. **Feedback** → Rate and save recipe

### Secondary Flows

- **Browse Saved Recipes** → Quick access to favorites
- **Update Preferences** → Refine personalization
- **Share Recipes** → Social sharing features
- **Shopping List** → Export ingredients list

## 🔄 Interaction Patterns

### Micro-interactions

- **Ingredient Tags:** Fade in animation when added
- **Loading States:** Progress bars with cooking messages
- **Button Hovers:** Smooth color transitions
- **Card Animations:** Subtle lift on hover
- **Form Feedback:** Real-time validation

### Error States

- **No Recipes Found:** Suggest ingredient alternatives
- **Network Error:** Retry button with offline mode
- **Invalid Input:** Inline validation messages
- **Authentication Error:** Clear error explanation

### Success States

- **Recipe Generated:** Celebration animation
- **Recipe Saved:** Heart animation
- **Magic Link Sent:** Email confirmation message
- **Preferences Updated:** Success notification

## 📐 Design Specifications

### Spacing System (Tailwind)

- **xs:** 0.5rem (8px)
- **sm:** 1rem (16px)
- **md:** 1.5rem (24px)
- **lg:** 2rem (32px)
- **xl:** 3rem (48px)

### Border Radius

- **sm:** 0.125rem (2px)
- **md:** 0.375rem (6px)
- **lg:** 0.5rem (8px)
- **xl:** 0.75rem (12px)
- **2xl:** 1rem (16px)

### Shadow System

- **sm:** 0 1px 2px rgba(0,0,0,0.05)
- **md:** 0 4px 6px rgba(0,0,0,0.07)
- **lg:** 0 10px 15px rgba(0,0,0,0.1)
- **xl:** 0 20px 25px rgba(0,0,0,0.15)

## ✅ Accessibility Guidelines

### WCAG 2.1 AA Compliance

- **Color Contrast:** Minimum 4.5:1 ratio
- **Keyboard Navigation:** Full keyboard accessibility
- **Screen Readers:** Semantic HTML and ARIA labels
- **Focus States:** Visible focus indicators
- **Alt Text:** Descriptive image alternatives

### Inclusive Design

- **Font Size:** Minimum 16px for body text
- **Touch Targets:** Minimum 44px x 44px
- **Error Messages:** Clear, descriptive text
- **Loading States:** Screen reader announcements
- **Form Labels:** Associated with inputs

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
.container {
  /* Base: Mobile (320px+) */
  padding: 1rem;
}

@media (min-width: 640px) {
  /* Small tablets and large phones */
  .container {
    padding: 2rem;
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  /* Tablets */
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  /* Small desktops */
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  /* Large desktops */
  .container {
    max-width: 1280px;
  }
}
```

## 🎨 Component States

### Button States

```jsx
// Primary Button
className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700
           disabled:bg-gray-300 disabled:cursor-not-allowed
           transition-colors duration-200"

// Secondary Button
className="border border-gray-300 hover:border-gray-400
           hover:bg-gray-50 active:bg-gray-100"
```

### Input States

```jsx
// Default Input
className="border border-gray-300 focus:ring-2 focus:ring-orange-500
           focus:border-transparent"

// Error Input
className="border border-red-500 focus:ring-2 focus:ring-red-500"

// Success Input
className="border border-green-500 focus:ring-2 focus:ring-green-500"
```

---

**Document Version:** 1.0  
**Last Updated:** Day 15  
**Design Tool:** Figma (conceptual)  
**Status:** ✅ Ready for Development
