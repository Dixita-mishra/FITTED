// Real-time Weather & Climate Fashion Intelligence Service using Open-Meteo API (Free, zero key requirement)

const WEATHER_CODE_MAP = {
  0: { condition: 'Clear & Sunny', icon: 'Sun', color: 'text-amber-500' },
  1: { condition: 'Mainly Clear', icon: 'Sun', color: 'text-amber-400' },
  2: { condition: 'Partly Cloudy', icon: 'CloudSun', color: 'text-amber-600' },
  3: { condition: 'Overcast', icon: 'Cloud', color: 'text-stone-500' },
  45: { condition: 'Foggy & Misty', icon: 'CloudFog', color: 'text-stone-400' },
  48: { condition: 'Rime Fog', icon: 'CloudFog', color: 'text-stone-400' },
  51: { condition: 'Light Drizzle', icon: 'CloudDrizzle', color: 'text-sky-500' },
  53: { condition: 'Moderate Drizzle', icon: 'CloudDrizzle', color: 'text-sky-600' },
  55: { condition: 'Dense Drizzle', icon: 'CloudDrizzle', color: 'text-sky-700' },
  61: { condition: 'Slight Rain', icon: 'CloudRain', color: 'text-blue-500' },
  63: { condition: 'Moderate Rain', icon: 'CloudRain', color: 'text-blue-600' },
  65: { condition: 'Heavy Rain', icon: 'CloudRain', color: 'text-blue-700' },
  80: { condition: 'Rain Showers', icon: 'CloudRain', color: 'text-blue-500' },
  95: { condition: 'Thunderstorm', icon: 'Zap', color: 'text-purple-600' }
};

export async function fetchRealtimeWeather(city = 'New Delhi') {
  try {
    let lat = 28.6139;
    let lon = 77.2090;
    let cityName = city;

    // Search city coordinates via Geocoding API if custom city passed
    if (city && city.toLowerCase() !== 'current location') {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          lat = geoData.results[0].latitude;
          lon = geoData.results[0].longitude;
          cityName = `${geoData.results[0].name}, ${geoData.results[0].country_code?.toUpperCase() || ''}`;
        }
      }
    }

    // Fetch current forecast from Open-Meteo
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m`
    );

    if (!weatherRes.ok) throw new Error(`Weather API HTTP ${weatherRes.status}`);

    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather || {};
    const temp = Math.round(current.temperature ?? 24);
    const code = current.weathercode ?? 0;
    const wind = Math.round(current.windspeed ?? 12);
    
    const weatherMeta = WEATHER_CODE_MAP[code] || { condition: 'Clear & Mild', icon: 'Sun', color: 'text-amber-500' };

    // Climate-to-Fashion Recommendation Engine
    let advice = "";
    let outfitCombo = "";

    if (code >= 51 && code <= 95) {
      advice = "Rainy & damp conditions. Opt for water-resistant outerwear and weather-sealed footwear.";
      outfitCombo = "Weatherproof Tech Jacket + Tapered Denim + Suede/Gore-Tex Loafers";
    } else if (temp >= 30) {
      advice = "Hot & humid climate. Wear breathable hand-loomed linen and moisture-wicking organic cotton.";
      outfitCombo = "Khadi Linen Cuban Shirt + Lightweight Chino Shorts";
    } else if (temp >= 22) {
      advice = "Pleasant & mild climate. Ideal for effortless light layering with unstructured blazers.";
      outfitCombo = "Structured Charcoal Blazer + Off-White Oversized Tee";
    } else if (temp >= 15) {
      advice = "Breezy & cool temperature. Layer crisp outerwear over soft knit bases.";
      outfitCombo = "Raw Denim Jacket + Heavyweight Cotton Crew + Pleated Trousers";
    } else {
      advice = "Chilly & cold climate. Heavy wool layering and structured thermal outerwear recommended.";
      outfitCombo = "Velvet Luxe Overcoat + Cashmere Sweater + Leather Boots";
    }

    return {
      success: true,
      city: cityName,
      temperature: temp,
      windspeed: wind,
      condition: weatherMeta.condition,
      color: weatherMeta.color,
      advice,
      outfitCombo,
      fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (err) {
    console.warn("[Fitted Weather API Warning] Using offline fallback forecast:", err);
    return {
      success: false,
      city: "New Delhi, IN",
      temperature: 26,
      windspeed: 10,
      condition: "Clear & Sunny",
      color: "text-amber-500",
      advice: "Mild & pleasant climate. Ideal for light layering with high-contrast blazers.",
      outfitCombo: "Structured Charcoal Blazer + Off-White Tee",
      fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
}

// Climate-to-Wardrobe Intelligent Clothes Matching
export function getClimateClothesRecommendation(weatherData, wardrobeItems = []) {
  const temp = weatherData?.temperature ?? 24;
  const condition = (weatherData?.condition || '').toLowerCase();
  const isRainy = condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm');

  // Helper to find best matching item in wardrobe
  const findItem = (categoryTerms, subCategoryTerms = [], colorKeywords = []) => {
    return wardrobeItems.find(item => {
      const cat = (item.category || '').toLowerCase();
      const sub = (item.subCategory || item.subcategory || '').toLowerCase();
      const name = (item.name || '').toLowerCase();
      const color = (item.color || '').toLowerCase();
      
      const matchesCat = categoryTerms.some(t => cat.includes(t) || name.includes(t));
      const matchesSub = subCategoryTerms.length === 0 || subCategoryTerms.some(t => sub.includes(t) || name.includes(t));
      const matchesColor = colorKeywords.length === 0 || colorKeywords.some(c => color.includes(c) || name.includes(c));
      return matchesCat && matchesSub && matchesColor;
    }) || wardrobeItems.find(item => {
      const cat = (item.category || '').toLowerCase();
      return categoryTerms.some(t => cat.includes(t));
    });
  };

  let category = 'Mild';
  let advice = '';
  let selectedPieces = [];

  if (isRainy) {
    category = 'Rainy Weather';
    advice = 'Damp & wet ground conditions. Choose water-resistant outer layers, cropped ankle-length bottoms, and dark sneakers.';
    const jacket = findItem(['outerwear'], ['jacket', 'cardigan'], ['black', 'denim']);
    const bottom = findItem(['bottoms'], ['cargo', 'jeans'], ['black', 'olive']);
    const shoes = findItem(['footwear'], ['sneakers'], ['black']);
    selectedPieces = [jacket, bottom, shoes].filter(Boolean);
  } else if (temp >= 28) {
    category = 'Hot & Sunny';
    advice = `Warm ${temp}°C weather. Stay cool with breathable cotton, breezy linen trousers or flowy kurtis with open footwear.`;
    const top = findItem(['tops'], ['kurti', 'top', 't-shirt'], ['white', 'pink', 'blue']);
    const bottom = findItem(['bottoms'], ['trousers', 'jeans'], ['white', 'beige', 'light blue']);
    const shoes = findItem(['footwear'], ['sandals', 'flats', 'sneakers'], ['tan', 'beige', 'white']);
    selectedPieces = [top, bottom, shoes].filter(Boolean);
  } else if (temp >= 20) {
    category = 'Pleasant & Mild';
    advice = `Pleasant ${temp}°C climate. Ideal for everyday college wear: crisp crewneck tees or embroidered kurtis paired with classic straight denim.`;
    const top = findItem(['tops'], ['t-shirt', 'top', 'kurti'], ['white', 'black', 'blue']);
    const bottom = findItem(['bottoms'], ['jeans', 'trousers'], ['blue', 'black', 'beige']);
    const shoes = findItem(['footwear'], ['sneakers', 'flats'], ['white', 'beige']);
    selectedPieces = [top, bottom, shoes].filter(Boolean);
  } else if (temp >= 14) {
    category = 'Breezy & Cool';
    advice = `Cool ${temp}°C breeze. Layer a classic denim or cropped jacket over your top for comfortable warmth.`;
    const outer = findItem(['outerwear'], ['jacket', 'cardigan'], ['denim', 'beige']);
    const top = findItem(['tops'], ['top', 't-shirt'], ['black', 'white']);
    const bottom = findItem(['bottoms'], ['trousers', 'jeans'], ['beige', 'black', 'grey']);
    const shoes = findItem(['footwear'], ['sneakers', 'flats'], ['white', 'black']);
    selectedPieces = [outer, top, bottom, shoes].filter(Boolean);
  } else {
    category = 'Chilly & Cold';
    advice = `Chilly ${temp}°C temperatures. Heavy knitwear, cozy cardigans, and full-length denim or trousers recommended.`;
    const knit = findItem(['outerwear'], ['cardigan', 'jacket'], ['lavender', 'black']);
    const top = findItem(['tops'], ['top', 't-shirt'], ['black', 'cream']);
    const bottom = findItem(['bottoms'], ['jeans', 'trousers'], ['black', 'grey']);
    const shoes = findItem(['footwear'], ['sneakers'], ['black', 'white']);
    selectedPieces = [knit, top, bottom, shoes].filter(Boolean);
  }

  const pieceNames = selectedPieces.map(p => p.name).join(' + ');

  return {
    category,
    temperature: temp,
    condition: weatherData?.condition || 'Clear & Sunny',
    city: weatherData?.city || 'Local Area',
    advice,
    pieceNames: pieceNames || 'Essential White Crewneck T-Shirt + Classic Blue Jeans + Retro White Sneakers',
    pieces: selectedPieces
  };
}

