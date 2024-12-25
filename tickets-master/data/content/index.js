import { locations_us } from "@/data/destinations/locations"
import { locations_us_es } from "@/data/destinations/locations_es"
// import { topCities } from "@/data/destinations/topCities"
import { topCities_us, topCities_us_es } from "@/data/destinations/topCities_us"
import { topCities_se, topCities_se_en, topCities_se_no, topCities_se_dk, topCities_se_fi } from "@/data/destinations/topCities_se"
import { topCities_co_es, topCities_co_en } from "@/data/destinations/topCities_co"
import { topCities_ar_es, topCities_ar_en } from "@/data/destinations/topCities_ar"
import { topCities_pt, topCities_pt_en } from "@/data/destinations/topCities_pt"
import { topCities_id, topCities_id_en } from "@/data/destinations/topCities_id"
import { socials, socials_us } from "@/data/socials"

export const defaultContent = {
  // visuals
  logo: {
    imageSrc: '/img/logo/tickets.png',
    altName: 'TICKETS',
  },
  aboutHero: {
    imageSrc: '/img/misc/flights.jpg',
    altName: 'about.hero_imgAlt',
  },
  aboutCounter: {
    imageSrc: '/img/about/about.png',
    altName: 'about.hero_imgAlt',
  },

  // destinations
  locations: {
    default: locations_us,
    en: locations_us,
    es: locations_us_es
  },
  topCities: {
    default: topCities_us,
    en: topCities_us,
    es: topCities_us_es,
    se: topCities_se
  },

  // socials
  socials: socials,

  mapCoordinates: "https://www.google.com/maps/embed",
}

export const domainContent = {
  'tickets.af': {
    logo: {
      imageSrc: '/img/logo/tickets/af.png',
    }
  },
  'tickets.ar': {
    logo: {
      imageSrc: '/img/logo/tickets/ar.png',
    },

    locations: {
      default: locations_us,
      en: locations_us,
      es: locations_us_es
    },

    topCities: {
      default: topCities_ar_es,
      es: topCities_ar_es,
      en: topCities_ar_en
    },

    mapCoordinates: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12000000.176213508!2d-64.1857096!3d-38.4160957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sar!4v123456789",  // Argentina map

    pages: {
      en: {
        destinations: {
          continents: false,
          countries: true,
          cities: true,
        },
      },
      es: {
        destinations: {
          continents: false,
          countries: true,
          cities: true,
        },
      }
    },
    
    gaValue: process.env.NEXT_PUBLIC_TICKETS_AR_GA_MEASUREMENT_ID,
  },
  'tickets.ax': {
    logo: {
      imageSrc: '/img/logo/tickets/ax.png',
    }
  },
  'tickets.dz': {
    logo: {
      imageSrc: '/img/logo/tickets/dz.png',
    }
  },
  'tickets.asia': {
    logo: {
      imageSrc: '/img/logo/tickets/asia.png',
    }
  },
  'tickets.bz': {
    logo: {
      imageSrc: '/img/logo/tickets/bz.png',
    }
  },
  'tickets.bj': {
    logo: {
      imageSrc: '/img/logo/tickets/bj.png',
    }
  },
  'tickets.bo': {
    logo: {
      imageSrc: '/img/logo/tickets/bo.png',
    }
  },
  'tickets.ba': {
    logo: {
      imageSrc: '/img/logo/tickets/ba.png',
    }
  },
  'tickets.tur.br': {
    logo: {
      imageSrc: '/img/logo/tickets/br.png',
    }
  },
  'tickets.com.kh': {
    logo: {
      imageSrc: '/img/logo/tickets/kh.png',
    }
  },
  'tickets.td': {
    logo: {
      imageSrc: '/img/logo/tickets/td.png',
    }
  },
  'tickets.cl': {
    logo: {
      imageSrc: '/img/logo/tickets/cl.png',
    }
  },
  'tickets.中国': {
    logo: {
      imageSrc: '/img/logo/tickets/中国.png',
    }
  },
  'tickets.com.co': {
    logo: {
      imageSrc: '/img/logo/tickets/co.png',
    },

    locations: {
      default: locations_us,
      en: locations_us,
      es: locations_us_es
    },

    topCities: {
      default: topCities_co_es,
      es: topCities_co_es,
      en: topCities_co_en
    },
    mapCoordinates: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15900000.176213508!2d-74.297333!3d4.570868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sco!4v123456789",  // Colombia map

    pages: {
      en: {
        destinations: {
          continents: false,
          countries: true,
          cities: true,
        },
      },
      es: {
        destinations: {
          continents: false,
          countries: true,
          cities: true,
        },
      }
    },
    
    gaValue: process.env.NEXT_PUBLIC_TICKETS_CO_GA_MEASUREMENT_ID,
  },
  'tickets.cm': {
    logo: {
      imageSrc: '/img/logo/tickets/cm.png',
    }
  },
  'tickets.cr': {
    logo: {
      imageSrc: '/img/logo/tickets/cr.png',
    }
  },
  'tickets.hr': {
    logo: {
      imageSrc: '/img/logo/tickets/hr.png',
    }
  },
  'tickets.cy': {
    logo: {
      imageSrc: '/img/logo/tickets/cy.png',
    }
  },
  'tickets.do': {
    logo: {
      imageSrc: '/img/logo/tickets/do.png',
    }
  },
  'tickets.tl': {
    logo: {
      imageSrc: '/img/logo/tickets/tl.png',
    }
  },
  'tickets.ec': {
    logo: {
      imageSrc: '/img/logo/tickets/ec.png',
    }
  },
  'tickets.eg': {
    logo: {
      imageSrc: '/img/logo/tickets/eg.png',
    },
    mapCoordinates: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d6782343.097389!2d31.235712!3d26.820553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg!4v123456789",  // Egypt map
  },
  'tickets.sv': {
    logo: {
      imageSrc: '/img/logo/tickets/sv.png',
    }
  },
  'tickets.et': {
    logo: {
      imageSrc: '/img/logo/tickets/et.png',
    }
  },
  'tickets.gf': {
    logo: {
      imageSrc: '/img/logo/tickets/gf.png',
    }
  },
  'tickets.ga': {
    logo: {
      imageSrc: '/img/logo/tickets/ga.png',
    }
  },
  'tickets.com.ge': {
    logo: {
      imageSrc: '/img/logo/tickets/ge.png',
    }
  },
  'tickets.co.de': {
    logo: {
      imageSrc: '/img/logo/tickets/de.png',
    }
  },
  'tickets.com.gr': {
    logo: {
      imageSrc: '/img/logo/tickets/gr.png',
    }
  },
  'tickets.gl': {
    logo: {
      imageSrc: '/img/logo/tickets/gl.png',
    }
  },
  'tickets.gt': {
    logo: {
      imageSrc: '/img/logo/tickets/gt.png',
    }
  },
  'tickets.gy': {
    logo: {
      imageSrc: '/img/logo/tickets/gy.png',
    }
  },
  'tickets.ht': {
    logo: {
      imageSrc: '/img/logo/tickets/ht.png',
    }
  },
  'tickets.hn': {
    logo: {
      imageSrc: '/img/logo/tickets/hn.png',
    }
  },
  'tickets.org.in': {
    logo: {
      imageSrc: '/img/logo/tickets/in.png',
    }
  },
  'tickets.co.id': {
    logo: {
      imageSrc: '/img/logo/tickets/id.png',
    },

    locations: {
      default: locations_us,
      en: locations_us,
      es: locations_us_es
    },

    topCities: {
      default: topCities_id,
      id: topCities_id,
      en: topCities_id_en
    },

    mapCoordinates: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12674178.981564512!2d113.921327!3d-0.789275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v123456789",

    pages: {
      en: {
        destinations: {
          continents: false,
          countries: true,
          cities: true,
        },
      },
      id: {
        destinations: {
          continents: false,
          countries: true,
          cities: true,
        },
      }
    },
    
    gaValue: process.env.NEXT_PUBLIC_TICKETS_ID_GA_MEASUREMENT_ID,
  },
  'tickets.ci': {
    logo: {
      imageSrc: '/img/logo/tickets/ci.png',
    }
  },
  'tickets.co.jp': {
    logo: {
      imageSrc: '/img/logo/tickets/jp.png',
    }
  },
  'tickets.ke': {
    logo: {
      imageSrc: '/img/logo/tickets/ke.png'
    }
  },
  'tickets.la': {
    logo: {
      imageSrc: '/img/logo/tickets/la.png'
    }
  },
  'tickets.ly': {
    logo: {
      imageSrc: '/img/logo/tickets/ly.png'
    }
  },
  'tickets.mg': {
    logo: {
      imageSrc: '/img/logo/tickets/mg.png',
    }
  },
  'tickets.ml': {
    logo: {
      imageSrc: '/img/logo/tickets/ml.png'
    }
  },
  'tickets.mr': {
    logo: {
      imageSrc: '/img/logo/tickets/mr.png'
    }
  },
  'tickets.co.ma': {
    logo: {
      imageSrc: '/img/logo/tickets/ma.png'
    }
  },
  'tickets.co.mz': {
    logo: {
      imageSrc: '/img/logo/tickets/mz.png'
    }
  },
  'tickets.nu': {
    logo: {
      imageSrc: '/img/logo/tickets/nu.png'
    }
  },
  'tickets.com.ni': {
    logo: {
      imageSrc: '/img/logo/tickets/ni.png'
    }
  },
  'tickets.ng': {
    logo: {
      imageSrc: '/img/logo/tickets/ng.png'
    }
  },
  'tickets.com.pk': {
    logo: {
      imageSrc: '/img/logo/tickets/pk.png'
    }
  },
  'tickets.pa': {
    logo: {
      imageSrc: '/img/logo/tickets/pa.png'
    }
  },
  'tickets.com.py': {
    logo: {
      imageSrc: '/img/logo/tickets/py.png'
    }
  },
  'tickets.pe': {
    logo: {
      imageSrc: '/img/logo/tickets/pe.png'
    }
  },
  'tickets.ph': {
    logo: {
      imageSrc: '/img/logo/tickets/ph.png'
    }
  },
  'tickets.pt': {
    logo: {
      imageSrc: '/img/logo/tickets/pt.png'
    },

    locations: {
      default: locations_us,
      en: locations_us,
      es: locations_us_es
    },

    topCities: {
      default: topCities_pt,
      pt: topCities_pt,
      en: topCities_pt_en
    },

    mapCoordinates: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3156354.409380732!2d-8.2244542!3d39.3998718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2spt!4v123456789", // Portugal map

    pages: {
      en: {
        destinations: {
          continents: false,
          countries: true,
          cities: true,
        },
      },
      pt: {
        destinations: {
          continents: false,
          countries: true,
          cities: true,
        },
      }
    },
    
    gaValue: process.env.NEXT_PUBLIC_TICKETS_PT_GA_MEASUREMENT_ID,
  },
  'tickets.com.pr': {
    logo: {
      imageSrc: '/img/logo/tickets/pr.png'
    }
  },
  'tickets.lc': {
    logo: {
      imageSrc: '/img/logo/tickets/lc.png'
    }
  },
  'tickets.sn': {
    logo: {
      imageSrc: '/img/logo/tickets/sn.png'
    }
  },
  'tickets.com.sg': {
    logo: {
      imageSrc: '/img/logo/tickets/sg.png'
    }
  },
  'tickets.so': {
    logo: {
      imageSrc: '/img/logo/tickets/so.png'
    }
  },
  'tickets.sd': {
    logo: {
      imageSrc: '/img/logo/tickets/sd.png'
    }
  },
  'tickets.sr': {
    logo: {
      imageSrc: '/img/logo/tickets/sr.png'
    }
  },
  'tickets.se': {
    logo: {
      imageSrc: '/img/logo/tickets/se.png'
    },

    topCities: {
      default: topCities_se,
      se: topCities_se,
      en: topCities_se_en,
      no: topCities_se_no,
      dk: topCities_se_dk,
      fi: topCities_se_fi
    },
    mapCoordinates: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d8585943.176213508!2d16.1562959!3d60.1281616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sse!4v123456789",  // Sweden map

    pages: {
      se: {
        destinations: {
          continents: false,
          countries: true,
          cities: true,
        },
      },
      en: {
        destinations: {
          continents: false,
          countries: true,
          cities: true,
        },
      },
      no: {
        destinations: {
          continents: false,
          countries: true,
          cities: true,
        },
      },
      dk: {
        destinations: {
          continents: false,
          countries: true,
          cities: true,
        },
      },
      fi: {
        destinations: {
          continents: false,
          countries: true,
          cities: true,
        },
      }
    },
    
    gaValue: process.env.NEXT_PUBLIC_TICKETS_SE_GA_MEASUREMENT_ID,
  },
  'tickets.tj': {
    logo: {
      imageSrc: '/img/logo/tickets/tj.png'
    }
  },
  'tickets.tz': {
    logo: {
      imageSrc: '/img/logo/tickets/tz.png'
    }
  },
  'tickets.in.th': {
    logo: {
      imageSrc: '/img/logo/tickets/th.png'
    }
  },
  'tickets.tg': {
    logo: {
      imageSrc: '/img/logo/tickets/tg.png'
    }
  },
  'tickets.co.tt': {
    logo: {
      imageSrc: '/img/logo/tickets/tt.png'
    }
  },
  'tickets.tn': {
    logo: {
      imageSrc: '/img/logo/tickets/tn.png'
    }
  },
  'tickets.web.tr': {
    logo: {
      imageSrc: '/img/logo/tickets/tr.png'
    }
  },
  'tickets.in.ua': {
    logo: {
      imageSrc: '/img/logo/tickets/ua.png'
    }
  },
  'tickets.me.uk': {
    logo: {
      imageSrc: '/img/logo/tickets/uk.png'
    }
  },
  'tickets.us': {
    // alternates: {
      // addMarketToMain: false,
      // addMarketToMain: true,
      // addMarketToMain: ['US', 'MX', 'CA'],

      // langswithMarkets: {
        // es: ['US', 'MX', 'CA'],
        // es: []
      // }
    // },

    logo: {
      imageSrc: '/img/logo/tickets/us.png'
    },

    locations: {
      default: locations_us,
      en: locations_us,
      es: locations_us_es
    },
    topCities: {
      default: topCities_us,
      en: topCities_us,
      es: topCities_us_es
    },

    socials: socials_us,

    mapCoordinates: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d8774326.097393278!2d-96.4785197989329!3d40.59711959471243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sua!4v1728290958058",  // US map

    //pages
    pages: {
      en: {
        destinations: {
          continents: true,
          countries: true,
          cities: true,
        },
      },
      es: {
        destinations: {
          continents: true,
          countries: true,
          cities: true,
        },
      }
    },

    impactValue: process.env.NEXT_PUBLIC_TICKETS_US_IMPACT,
    gaValue: process.env.NEXT_PUBLIC_TICKETS_US_GA_MEASUREMENT_ID,

    // googleAuth: {
    //   clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_US,
    //   clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET_US,
    // }
  },
  'tickets.com.ve': {
    logo: {
      imageSrc: '/img/logo/tickets/ve.png'
    }
  },
  'tickets.vn': {
    logo: {
      imageSrc: '/img/logo/tickets/vn.png'
    }
  }
};