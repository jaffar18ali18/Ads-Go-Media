// Lightweight brand and model dataset for dynamic model selection
window.BRAND_DATA = {
  brands: [
    "Apple","Samsung","Xiaomi","Redmi","Realme","Vivo","Oppo","OnePlus","Motorola","iQOO","Poco","Nokia","Infinix","Tecno","Lava","Micromax","Nothing","Google Pixel","Asus","Honor","Sony","Lenovo","ZTE","HTC","Panasonic","Alcatel","Other"
  ],
  models: {
    Samsung: {
      series: {
        "Galaxy S Series": ["Galaxy S23","Galaxy S22","Galaxy S21"],
        "Galaxy A Series": ["Galaxy A54","Galaxy A34","Galaxy A14"],
        "Galaxy M Series": ["Galaxy M34","Galaxy M14"],
        "Galaxy Z Series": ["Galaxy Z Fold4","Galaxy Z Flip4"]
      },
      latest: ["Galaxy S23","Galaxy A54"],
      popular: ["Galaxy A54","Galaxy S22"]
    },
    Apple: {
      series: {
        "iPhone 15 Series": ["iPhone 15","iPhone 15 Plus","iPhone 15 Pro","iPhone 15 Pro Max"],
        "iPhone 14 Series": ["iPhone 14","iPhone 14 Plus","iPhone 14 Pro","iPhone 14 Pro Max"],
        "iPhone 13 Series": ["iPhone 13","iPhone 13 Mini","iPhone 13 Pro"]
      },
      latest: ["iPhone 15","iPhone 15 Pro"],
      popular: ["iPhone 13","iPhone 14"]
    },
    Xiaomi: {
      series: {
        "Redmi Note Series": ["Redmi Note 12","Redmi Note 11"],
        "Xiaomi Series": ["Xiaomi 13","Xiaomi 12"]
      },
      latest: ["Xiaomi 13"],
      popular: ["Redmi Note 12"]
    },
    // Watch brands and sample models
    Boat: {
      series: {"Boat Series": ["Boat Xtend","Boat Wave","Boat Watch X"]},
      latest: ["Boat Xtend"],
      popular: ["Boat Xtend","Boat Wave"]
    },
    Noise: {
      series: {"Noise Series": ["Noise ColorFit","NoiseFit Pro"]},
      latest: ["Noise ColorFit"],
      popular: ["Noise ColorFit"]
    },
    "Fire-Boltt": {
      series: {"Fire-Boltt Series": ["Fire-Boltt Invincible","Fire-Boltt Beast"]},
      latest: ["Fire-Boltt Invincible"],
      popular: ["Fire-Boltt Beast"]
    },
    Titan: {
      series: {"Titan Series": ["Titan Neo","Titan Classic"]},
      latest: ["Titan Neo"],
      popular: ["Titan Classic"]
    },
    Fastrack: {
      series: {"Fastrack Series": ["Fastrack Reflex","Fastrack Trend"]},
      latest: ["Fastrack Reflex"],
      popular: ["Fastrack Reflex"]
    },
    Sonata: {
      series: {"Sonata Series": ["Sonata Classic","Sonata Sport"]},
      latest: ["Sonata Classic"],
      popular: ["Sonata Sport"]
    }
    // Other brands can be extended similarly
  }
};
