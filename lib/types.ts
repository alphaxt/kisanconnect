export type UserRole = 'farmer' | 'buyer' | 'agronomist' | 'admin'

export interface Profile {
  id: string
  full_name: string
  phone?: string
  cnic?: string
  role: UserRole
  province?: string
  district?: string
  village?: string
  land_acres?: number
  avatar_url?: string
  is_verified: boolean
  created_at: string
}

export interface MandiPrice {
  id: string
  city: string
  province: string
  crop: string
  price: number
  unit: string
  change_pct: number
  source: string
  updated_at: string
}

export interface Listing {
  id: string
  user_id: string
  type: 'sell' | 'buy'
  crop: string
  crop_emoji?: string
  quantity: number
  quantity_unit: string
  price: number
  min_order: number
  location: string
  province: string
  district?: string
  description?: string
  image_url?: string
  is_organic: boolean
  is_active: boolean
  expires_at: string
  created_at: string
  profiles?: Profile
}

export interface DiseaseScan {
  id: string
  user_id?: string
  image_url: string
  disease_name?: string
  crop?: string
  confidence?: number
  severity?: 'low' | 'medium' | 'high'
  treatment?: string[]
  location?: string
  district?: string
  is_public: boolean
  created_at: string
  profiles?: Profile
}

export interface ForumPost {
  id: string
  user_id: string
  title: string
  title_urdu?: string
  body: string
  body_urdu?: string
  category: string
  tags?: string[]
  images?: string[]
  likes_count: number
  views_count: number
  is_answered: boolean
  is_pinned: boolean
  created_at: string
  profiles?: Profile
  replies_count?: number
  user_liked?: boolean
}

export interface ForumReply {
  id: string
  post_id: string
  user_id: string
  body: string
  body_urdu?: string
  likes_count: number
  is_accepted: boolean
  created_at: string
  profiles?: Profile
}

export interface LoanApplication {
  id: string
  user_id: string
  scheme_name: string
  bank_name: string
  amount: number
  purpose?: string
  land_acres?: number
  crop?: string
  cnic: string
  phone: string
  full_name: string
  province?: string
  village?: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  notes?: string
  created_at: string
}

export interface CropPlan {
  id: string
  user_id: string
  name: string
  crop: string
  district: string
  land_acres: number
  soil_type?: string
  irrigation?: string
  sowing_date?: string
  harvest_date?: string
  events?: CalendarEvent[]
  notes?: string
  created_at: string
}

export interface CalendarEvent {
  date: string
  type: 'planting' | 'irrigation' | 'fertilizer' | 'harvest' | 'spray' | 'other'
  label: string
  color: string
  notes?: string
}

export interface WeatherData {
  city: string
  temperature: number
  feels_like: number
  humidity: number
  wind_speed: number
  wind_direction: string
  description: string
  icon: string
  uv_index?: number
  rain_chance?: number
  forecast: ForecastDay[]
}

export interface ForecastDay {
  date: string
  day: string
  icon: string
  description: string
  high: number
  low: number
  rain_chance: number
  humidity: number
}

export interface LoanScheme {
  id: string
  name: string
  bank_name: string
  bank_icon: string
  max_amount: string
  interest_rate: string
  type: 'govt' | 'bank' | 'micro'
  features: string[]
  eligibility: string[]
  documents: string[]
  processing_days: number
  apply_url?: string
}

export const PAKISTAN_CROPS = [
  'Wheat', 'Rice (Basmati)', 'Rice (Irri)', 'Cotton', 'Sugarcane',
  'Maize', 'Mango', 'Potato', 'Onion', 'Tomato', 'Banana', 'Apple',
  'Tobacco', 'Sunflower', 'Canola', 'Chickpeas', 'Lentils', 'Date Palm',
  'Pomegranate', 'Citrus (Kinnow)', 'Guava', 'Vegetables (Mixed)'
]

export const PAKISTAN_PROVINCES = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'AJK', 'GB']

export const PAKISTAN_DISTRICTS: Record<string, string[]> = {
  Punjab: ['Lahore','Faisalabad','Multan','Gujranwala','Rawalpindi','Sialkot','Gujrat','Sargodha','Bahawalpur','Sahiwal','Okara','Jhang','Sheikhupura','Rahim Yar Khan','Kasur'],
  Sindh: ['Karachi','Hyderabad','Sukkur','Larkana','Nawabshah','Mirpurkhas','Thatta','Dadu','Khairpur','Jacobabad'],
  KPK: ['Peshawar','Mardan','Swat','Abbottabad','Mansehra','Kohat','Dera Ismail Khan','Chitral','Dir'],
  Balochistan: ['Quetta','Turbat','Gwadar','Khuzdar','Hub','Lasbela','Zhob'],
  AJK: ['Mirpur','Muzaffarabad','Rawalakot'],
  GB: ['Gilgit','Hunza','Skardu'],
}

export const DISEASE_DATABASE: Record<string, {
  name: string, crop: string, severity: 'low'|'medium'|'high',
  symptoms: string, treatment: string[], urdu_name: string, urdu_treatment: string
}> = {
  'wheat_leaf_rust': {
    name: 'Wheat Leaf Rust', crop: 'Wheat', severity: 'high',
    urdu_name: 'گندم کا پتہ زنگ',
    symptoms: 'Orange-brown pustules on leaves, yellowing of leaf tissue',
    treatment: [
      'Immediately spray Propiconazole 25EC @ 0.5ml/L water',
      'Repeat spray after 10-14 days if symptoms persist',
      'Remove and burn severely infected plants',
      'Improve field drainage to reduce humidity',
      'Next season use rust-resistant variety like Punjab-2011'
    ],
    urdu_treatment: 'Propiconazole سپرے کریں، متاثرہ پودے جلا دیں'
  },
  'rice_blast': {
    name: 'Rice Blast', crop: 'Rice', severity: 'high',
    urdu_name: 'چاول کا بلاسٹ',
    symptoms: 'Diamond-shaped gray-brown lesions on leaves, collar rot at panicle base',
    treatment: [
      'Apply Tricyclazole 75WP @ 0.6g/L water immediately',
      'Drain field completely for 3-4 days',
      'Avoid excessive nitrogen fertilizer',
      'Burn all infected stubble after harvest',
      'Use certified blast-resistant seed next season'
    ],
    urdu_treatment: 'Tricyclazole سپرے کریں، کھیت سے پانی نکال دیں'
  },
  'cotton_bollworm': {
    name: 'Cotton Bollworm', crop: 'Cotton', severity: 'high',
    urdu_name: 'کپاس کی سنڈی',
    symptoms: 'Holes in green bolls, premature boll opening, frass visible',
    treatment: [
      'Spray Chlorpyrifos 40EC @ 2ml/L or Cypermethrin 10EC @ 1ml/L',
      'Install pheromone traps at 10/acre for monitoring',
      'Apply Nuclear Polyhedrosis Virus (NPV) as bio-pesticide',
      'Interplant with maize as trap crop',
      'Avoid late planting which increases pest pressure'
    ],
    urdu_treatment: 'Chlorpyrifos یا Cypermethrin سپرے کریں، pheromone ٹریپ لگائیں'
  },
  'potato_late_blight': {
    name: 'Potato Late Blight', crop: 'Potato', severity: 'high',
    urdu_name: 'آلو کا جھلساؤ',
    symptoms: 'Water-soaked dark lesions on leaves, white fungal growth on undersides',
    treatment: [
      'Apply Mancozeb 80WP @ 2.5g/L or Metalaxyl @ 1g/L',
      'Remove and destroy all infected tubers immediately',
      'Avoid overhead irrigation, use drip instead',
      'Apply preventive spray before rain events',
      'Use certified disease-free seed potatoes next season'
    ],
    urdu_treatment: 'Mancozeb سپرے کریں، متاثرہ کند فوری ہٹائیں'
  },
  'mango_anthracnose': {
    name: 'Mango Anthracnose', crop: 'Mango', severity: 'medium',
    urdu_name: 'آم کا چھوت',
    symptoms: 'Dark brown-black spots on fruits and leaves, flower blight',
    treatment: [
      'Spray Copper Oxychloride 50WP @ 3g/L before and after rain',
      'Apply Mancozeb 80WP @ 2.5g/L at 15-day intervals',
      'Prune to improve air circulation in canopy',
      'Harvest at proper maturity to reduce post-harvest losses',
      'Store in ventilated, cool conditions'
    ],
    urdu_treatment: 'Copper Oxychloride سپرے کریں، درختوں کی کٹائی کریں'
  },
  'sugarcane_red_rot': {
    name: 'Sugarcane Red Rot', crop: 'Sugarcane', severity: 'medium',
    urdu_name: 'گنے کا سرخ سڑن',
    symptoms: 'Red discoloration inside stalk, sour fermented smell, yellowing leaves',
    treatment: [
      'Use disease-free ratoons from certified nurseries',
      'Hot water treatment of seed cane at 50°C for 2 hours',
      'Apply Carbendazim 50WP @ 1g/L as soil drench',
      'Improve field drainage to reduce waterlogging',
      'Remove and burn infected stools completely'
    ],
    urdu_treatment: 'صحت مند بیج استعمال کریں، گرم پانی سے بیج کا علاج کریں'
  },
  'tomato_virus': {
    name: 'Tomato Yellow Leaf Curl Virus', crop: 'Tomato', severity: 'high',
    urdu_name: 'ٹماٹر کا وائرس',
    symptoms: 'Upward curling yellow leaves, stunted plants, whitefly infestation',
    treatment: [
      'Remove and destroy all infected plants immediately',
      'Control whitefly vector with Imidacloprid 20SL @ 0.5ml/L',
      'Use yellow sticky traps @ 20/acre for whitefly monitoring',
      'Plant resistant varieties (e.g., Nadir, Roma VF)',
      'Maintain field hygiene, remove crop debris'
    ],
    urdu_treatment: 'متاثرہ پودے ہٹائیں، Imidacloprid سے سفید مکھی کنٹرول کریں'
  },
  'wheat_yellow_rust': {
    name: 'Wheat Yellow Rust', crop: 'Wheat', severity: 'high',
    urdu_name: 'گندم کا زرد زنگ',
    symptoms: 'Yellow-orange stripes of pustules on leaves following leaf veins',
    treatment: [
      'Spray Propiconazole 25EC or Tebuconazole 25WP immediately',
      'Scout fields weekly during Feb-April (peak season)',
      'Apply when 1-2% leaf area infected for best results',
      'Use resistant varieties: Ujala-2016, Borlaug-16',
      'Report outbreak to local agriculture office'
    ],
    urdu_treatment: 'Propiconazole فوری سپرے کریں، زرد زنگ کا آغاز پر علاج کریں'
  }
}
