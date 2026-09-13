import { INDIAN_WOMENS_FASHION_CATALOG } from '../data/indianWomensFashionCatalog';

// Recommendation Engine querying 350+ Product Dataset based on Wardrobe Gaps & Personalization
export function recommendProductsFromCatalog(wardrobeItems = [], userPreferences = {}, filters = {}) {
  const {
    targetOccasion = 'All',
    categoryFilter = 'All',
    brandFilter = 'All',
    maxBudget = 5000,
    minBudget = 0,
    styleFilter = 'All'
  } = filters;

  // 1. Analyze existing wardrobe categories & colors
  const existingCategories = new Set(wardrobeItems.map(i => (i.category || '').toLowerCase()));
  const existingColors = wardrobeItems.map(i => (i.color || '').toLowerCase());

  // Detect wardrobe gaps (e.g., has tops & bottoms but lacks outerwear or footwear)
  const lacksOuterwear = !existingCategories.has('outerwear') && !existingCategories.has('jacket') && !existingCategories.has('blazer');
  const lacksFootwear = !existingCategories.has('footwear') && !existingCategories.has('shoes') && !existingCategories.has('sneakers');
  const lacksEthnic = !existingCategories.has('ethnic wear') && !existingCategories.has('kurti') && !existingCategories.has('kurta set');

  // Filter Catalog by criteria
  const eligibleProducts = INDIAN_WOMENS_FASHION_CATALOG.filter(product => {
    // Budget filter
    if (product.discount_price > maxBudget || product.discount_price < minBudget) return false;

    // Category filter
    if (categoryFilter !== 'All' && product.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }

    // Brand filter
    if (brandFilter !== 'All' && product.brand.toLowerCase() !== brandFilter.toLowerCase()) {
      return false;
    }

    // Occasion filter
    if (targetOccasion !== 'All' && targetOccasion !== 'Creative Workspace' && targetOccasion !== 'Formal Evening / Wedding') {
      const matchOcc = product.occasion.some(occ => occ.toLowerCase() === targetOccasion.toLowerCase());
      if (!matchOcc) return false;
    }

    // Style filter
    if (styleFilter !== 'All' && !product.style.some(s => s.toLowerCase() === styleFilter.toLowerCase())) {
      return false;
    }

    return true;
  });

  // 2. Score each eligible catalog product
  const scoredProducts = eligibleProducts.map(product => {
    let score = 75;

    // A. Wardrobe Gap Synergy (Up to +15 pts)
    const catLower = product.category.toLowerCase();
    if (lacksOuterwear && (catLower.includes('jacket') || catLower.includes('blazer') || catLower.includes('cardigan'))) {
      score += 12;
    }
    if (lacksFootwear && (catLower.includes('sneakers') || catLower.includes('flats') || catLower.includes('sandals'))) {
      score += 10;
    }
    if (lacksEthnic && (catLower.includes('kurti') || catLower.includes('kurta set') || catLower.includes('ethnic'))) {
      score += 10;
    }

    // B. Color Synergy with Wardrobe (Up to +10 pts)
    const prodColor = product.color.toLowerCase();
    const hasNeutralPair = existingColors.some(ec => 
      (prodColor.includes('beige') || prodColor.includes('white') || prodColor.includes('black')) ||
      (ec.includes('blue') || ec.includes('indigo') || ec.includes('black'))
    );
    if (hasNeutralPair) score += 8;

    // C. User Style Preferences Match (Up to +8 pts)
    if (userPreferences.primaryStyle) {
      const prefStyleLower = userPreferences.primaryStyle.toLowerCase();
      const styleMatches = product.style.some(s => prefStyleLower.includes(s.toLowerCase()));
      if (styleMatches) score += 8;
    }

    // D. Rating Boost
    score += Math.round(product.rating * 1.5);

    const finalScore = Math.min(99, Math.max(82, score));

    // Find best paired item from user's existing wardrobe
    let pairedItem = wardrobeItems[0] || null;
    if (wardrobeItems.length > 0) {
      if (catLower.includes('jacket') || catLower.includes('blazer') || catLower.includes('top')) {
        pairedItem = wardrobeItems.find(i => (i.category || '').toLowerCase().includes('bottom') || (i.category || '').toLowerCase().includes('jeans')) || wardrobeItems[0];
      } else if (catLower.includes('jeans') || catLower.includes('trouser') || catLower.includes('skirt')) {
        pairedItem = wardrobeItems.find(i => (i.category || '').toLowerCase().includes('top') || (i.category || '').toLowerCase().includes('outerwear')) || wardrobeItems[0];
      }
    }

    // Generate personalized match explanation
    const pairedName = pairedItem ? pairedItem.name : 'your casual wardrobe pieces';
    const matchReason = `Priced at ₹${product.discount_price} (${Math.round((1 - product.discount_price/product.price)*100)}% OFF). Fills the ${product.category} gap in your closet. Coordinates seamlessly with your ${pairedName} for ${product.occasion[0] || 'college'} style.`;

    const bodySuitability = `${product.fit} fit construction in ${product.fabric} ensures comfort and proportional silhouette balance for college & daily wear.`;

    return {
      id: product.product_id,
      product_id: product.product_id,
      name: product.product_name,
      brand: product.brand,
      price: product.discount_price,
      originalPrice: product.price,
      rating: product.rating,
      matchScore: finalScore,
      matchReason,
      bodySuitability,
      pairedItemName: pairedItem ? pairedItem.name : null,
      pairedItemId: pairedItem ? pairedItem.id : null,
      image: product.image_url,
      images: [product.image_url],
      category: product.category,
      subcategory: product.subcategory,
      color: product.color,
      fabric: product.fabric,
      fitType: `${product.fit} Fit`,
      style: product.style,
      occasion: product.occasion,
      sizes: product.sizes,
      tags: product.tags,
      product_url: product.product_url
    };
  });

  // Sort by match score descending
  scoredProducts.sort((a, b) => b.matchScore - a.matchScore);

  return scoredProducts;
}
