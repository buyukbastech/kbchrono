import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        collections: "Collections",
        craftsmanship: "Craftsmanship",
        partnership: "Partnership",
        story: "Philosophy",
        contact: "Contact"
      },
      partnership: {
        subtitle: "Our Engineering Partner",
        title: "Crafted by Pyzerion",
        description: "Every pixel, transition, and line of code in the Kbchrono digital experience has been meticulously designed and developed by Pyzerion.",
        visitWebsite: "Visit Pyzerion Website",
        tagline: "Architecting the Future of Business with AI",
        services: {
          title: "Pyzerion Core Expertise",
          web: {
            title: "High-Performance Web Design",
            desc: "Breathtaking user interfaces, fluid animations, and robust, ultra-fast architectures designed for premium brands."
          },
          crm: {
            title: "Custom CRM Solutions",
            desc: "Tailored customer relationship management systems built to scale enterprise workflows and optimize sales processes."
          },
          ai: {
            title: "AI Voice & Process Automation",
            desc: "Intelligent voice assistants, predictive analytics, and next-generation automation that redefine operational efficiency."
          }
        },
        projectStory: {
          title: "The kbchrono Project",
          desc: "Collaborating closely with kbchrono, Pyzerion designed and engineered this digital platform. Blending luxury aesthetics with high-performance modern web technologies (React, TypeScript, Vite, Tailwind CSS), they brought our vision of haute horlogerie to life in the digital world. The result is a seamless, stunning showcase of engineering and master craftsmanship."
        }
      },
      hero: {
        subtitle: "Exclusive Timepieces",
        title: "Engineered for Excellence",
        description: "The flawless harmony of fine hand craftsmanship and modern engineering. Each timepiece is an exclusive reflection of aesthetics and quality.",
        cta: "Explore Collection"
      },
      craftsmanship: {
        subtitle: "The Art of Perfection",
        title: "Exclusive Design, Flawless Craftsmanship",
        description1: "Beyond measuring time, we transform it into a work of art. Every timepiece from the kbchrono ateliers comes to life with unique hand craftsmanship.",
        description2: "Only the finest materials are selected in our design process. Each piece is carefully crafted to create a legacy passed down from generation to generation.",
        stats: {
          value1: "Aesthetics",
          label1: "Flawless Lines",
          value2: "Elegance",
          label2: "Fine Details",
          value3: "Mastery",
          label3: "Unique Craft"
        }
      },
      story: {
        subtitle: "The kbchrono Philosophy",
        title: "A Vision Beyond Time",
        milestones: {
          m1: {
            title: "Vision",
            description: "Pushing the boundaries of traditional watchmaking to create mechanical masterpieces of the future."
          },
          m2: {
            title: "Design",
            description: "Meticulously considered details, blending timeless aesthetics with modern lines."
          },
          m3: {
            title: "Innovation",
            description: "Bringing a brand new aesthetic and luxury dimension to time with creative touches that transcend the boundaries of traditional watchmaking."
          },
          m4: {
            title: "Mastery",
            description: "The result of fine craftsmanship and a relentless pursuit of perfection, shaped by master hands."
          }
        }
      },
      contact: {
        subtitle: "Private Consultation",
        title: "Experience kbchrono",
        description: "We invite you to discover our world of exceptional horology. Schedule a private consultation at one of our boutiques or arrange a personal viewing at your convenience.",
        book: "Book a Consultation",
        discover: "Discover More",
        phoneLabel: "Phone",
        emailLabel: "Email Address"
      },
      footer: {
        description: "Exclusive haute horlogerie. Each timepiece is a masterwork of precision engineering and artisanal craftsmanship.",
        explore: "Explore",
        boutiques: "Boutiques",
        newsletter: "Newsletter",
        newsletterDesc: "Receive exclusive updates from the world of kbchrono.",
        emailPlaceholder: "Your email",
        join: "Join",
        rights: "© 2026 kbchrono. All rights reserved."
      },
      whatsapp: {
        message: "Hello! I would like to get information about kbchrono watches."
      },
      collectionGrid: {
        title: "Masterpieces of Time",
        filter: {
          all: "All Collections",
          ap: "Audemars Piguet",
          rm: "Richard Mille",
          pp: "Patek Philippe",
          rolex: "Rolex"
        }
      },
      notFound: {
        title: "404",
        message: "Oops! Page not found",
        return: "Return to Home"
      },
      common: {
        back: "Back to Collection",
        notFound: "Timepiece not found.",
        specs: "Technical Specifications",
        engineering: "Engineering Details",
        theStory: "The Story",
        behind: "Behind the Creation",
        requestInfo: "Request Information",
        bookViewing: "Book Viewing",
        specLabels: {
          movement: "Movement",
          case_material: "Case Material",
          case_size: "Case Size",
          water_resistance: "Water Resistance",
          power_reserve: "Power Reserve",
          crystal: "Crystal"
        }
      },
      watches: {
        "kunkor-tourbillon": {
          name: "kbchrono Tourbillon",
          tagline: "Where time becomes art",
          description: "Hand-finished rose gold skeleton tourbillon with 72-hour power reserve. A masterpiece of traditional watchmaking.",
          story: "The kbchrono Tourbillon represents three years of relentless pursuit of perfection. Each component is hand-finished by our master watchmakers in our Geneva atelier, resulting in a timepiece that transcends mere timekeeping to become a wearable work of art.",
          collection: "Haute Horlogerie",
          specs: {
            movement: "Manual-winding tourbillon, Cal. AV-7001",
            case_material: "18K Rose Gold",
            case_size: "42mm × 10.2mm",
            water_resistance: "30 meters",
            power_reserve: "72 hours",
            crystal: "Sapphire crystal, anti-reflective coating"
          }
        },
        "carbon-chronos": {
          name: "Carbon Chronos",
          tagline: "Built for the extreme",
          description: "Carbon fiber chronograph with racing DNA. Engineered to withstand the most demanding environments.",
          story: "Born on the racetrack, the Carbon Chronos channels the relentless spirit of motorsport into a timepiece of extraordinary performance. Its forged carbon case is lighter than titanium yet stronger than steel.",
          collection: "Sport",
          specs: {
            movement: "Automatic chronograph, Cal. AV-5200",
            case_material: "Forged Carbon & Grade 5 Titanium",
            case_size: "44mm × 14.5mm",
            water_resistance: "100 meters",
            power_reserve: "65 hours",
            crystal: "Sapphire crystal with double AR coating"
          }
        },
        "midnight-elegance": {
          name: "Midnight Elegance",
          tagline: "Timeless sophistication",
          description: "Platinum dress watch with deep blue sunburst dial. The epitome of understated luxury.",
          story: "The Midnight Elegance distills centuries of horological tradition into a single, perfectly proportioned timepiece. Its sunburst blue dial catches light like the surface of a midnight ocean.",
          collection: "Classic",
          specs: {
            movement: "Ultra-thin automatic, Cal. AV-3100",
            case_material: "950 Platinum",
            case_size: "39mm × 7.8mm",
            water_resistance: "50 meters",
            power_reserve: "60 hours",
            crystal: "Box sapphire crystal"
          }
        },
        "stealth-perpetual": {
          name: "Stealth Perpetual",
          tagline: "Engineered for eternity",
          description: "Titanium skeleton with perpetual calendar. A feat of micro-engineering and futuristic design.",
          story: "The Stealth Perpetual houses one of the most complex movements ever created by our manufacture. Its perpetual calendar will accurately track the date, day, month, and moon phase until the year 2100 without a single adjustment.",
          collection: "Complications",
          specs: {
            movement: "Automatic perpetual calendar, Cal. AV-9500",
            case_material: "Grade 5 Titanium, DLC coated",
            case_size: "41mm × 11.5mm",
            water_resistance: "50 meters",
            power_reserve: "55 hours",
            crystal: "Sapphire crystal front and back"
          }
        },
        "lunaire-tourbillon-42mm-onyx-edition": {
          name: "Lunaire Tourbillon — Onyx Edition",
          tagline: "A new masterpiece from our workshop",
          description: "Revolutionizing the world of horology, the Lunaire Tourbillon brings the unique mechanism of the sky to your wrist. With its Onyx case and completely handmade movement, it's the rarest piece in the collection.",
          story: "Revolutionizing the world of horology, the Lunaire Tourbillon brings the unique mechanism of the sky to your wrist. With its Onyx case and completely handmade movement, it's the rarest piece in the collection.",
          collection: "Lunaire Tourbillon",
          specs: {
            movement: "Automatic Swiss Movement",
            case_material: "Grade 5 Titanium",
            case_size: "42mm",
            water_resistance: "50 meters",
            power_reserve: "60 hours",
            crystal: "Sapphire Crystal"
          }
        }
      }
    }
  },
  tr: {
    translation: {
      nav: {
        collections: "Koleksiyonlar",
        craftsmanship: "İşçilik",
        partnership: "Partnership",
        story: "Felsefemiz",
        contact: "İletişim"
      },
      partnership: {
        subtitle: "Mühendislik Ortağımız",
        title: "Pyzerion Tarafından Tasarlandı",
        description: "Kbchrono dijital deneyimindeki her bir piksel, geçiş ve kod satırı Pyzerion tarafından titizlikle tasarlanmış ve geliştirilmiştir.",
        visitWebsite: "Pyzerion Web Sitesini Ziyaret Edin",
        tagline: "Yapay Zeka ile İş Dünyasının Geleceğini İnşa Ediyoruz",
        services: {
          title: "Pyzerion Uzmanlık Alanları",
          web: {
            title: "Yüksek Performanslı Web Tasarımı",
            desc: "Premium markalar için tasarlanmış nefes kesici kullanıcı arayüzleri, akıcı animasyonlar ve sağlam, ultra hızlı altyapılar."
          },
          crm: {
            title: "Özel CRM Çözümleri",
            desc: "Kurumsal iş akışlarını ölçeklendirmek ve satış süreçlerini optimize etmek için oluşturulmuş özel müşteri ilişkileri yönetim sistemleri."
          },
          ai: {
            title: "Yapay Zeka ve Süreç Otomasyonu",
            desc: "Operasyonel verimliliği yeniden tanımlayan akıllı sesli asistanlar, öngörücü analitikler ve yeni nesil otomasyonlar."
          }
        },
        projectStory: {
          title: "kbchrono Projesi",
          desc: "kbchrono ile yakın iş birliği içinde çalışan Pyzerion, bu dijital platformu tasarladı ve geliştirdi. Lüks estetiği, yüksek performanslı modern web teknolojileri (React, TypeScript, Vite, Tailwind CSS) ile harmanlayarak yüksek saatçilik (haute horlogerie) vizyonumuzu dijital dünyaya taşıdılar. Sonuç, mühendislik ve usta işçiliğin kusursuz ve büyüleyici bir birleşimidir."
        }
      },
      hero: {
        subtitle: "Özel Tasarım Saatler",
        title: "Mükemmellik İçin Tasarlandı",
        description: "İnce el işçiliği ve modern mühendisliğin kusursuz uyumu. Her bir saat, estetik ve kalitenin seçkin bir yansımasıdır.",
        cta: "Koleksiyonu Keşfet"
      },
      craftsmanship: {
        subtitle: "Mükemmellik Sanatı",
        title: "Özgün Tasarım, Kusursuz El İşçiliği",
        description1: "Zamanı ölçmenin ötesinde, onu bir sanat eserine dönüştürüyoruz. kbchrono atölyelerinden çıkan her bir saat, benzersiz bir el işçiliğiyle hayat bulur.",
        description2: "Tasarım sürecimizde yalnızca en iyi materyaller seçilir. Her bir parça, nesilden nesile aktarılacak bir miras yaratmak için özenle tasarlanır.",
        stats: {
          value1: "Estetik",
          label1: "Kusursuz Çizgiler",
          value2: "Zarafet",
          label2: "İnce Detaylar",
          value3: "Ustalık",
          label3: "Eşsiz İşçilik"
        }
      },
      story: {
        subtitle: "kbchrono Felsefesi",
        title: "Zamanın Ötesinde Bir Vizyon",
        milestones: {
          m1: {
            title: "Vizyon",
            description: "Geleneksel saatçiliğin sınırlarını zorlayarak, geleceğin mekanik şaheserlerini yaratmak."
          },
          m2: {
            title: "Tasarım",
            description: "Her bir detayı özenle düşünülmüş, zamansız estetiği modern çizgilerle buluşturan tasarımlar."
          },
          m3: {
            title: "İnovasyon",
            description: "Geleneksel saatçiliğin sınırlarını aşan yaratıcı dokunuşlarla, zamana yepyeni bir estetik ve lüks boyutu kazandırmak."
          },
          m4: {
            title: "Ustalık",
            description: "Usta ellerde şekillenen, ince bir el işçiliğinin ve mükemmellik arayışının eseri."
          }
        }
      },
      contact: {
        subtitle: "Özel Konsültasyon",
        title: "kbchrono'u Deneyimleyin",
        description: "Sizi olağanüstü horoloji dünyamızı keşfetmeye davet ediyoruz. Butiklerimizden birinde özel bir görüşme planlayın veya size uygun bir zamanda kişisel bir sunum ayarlayın.",
        book: "Görüşme Ayarla",
        discover: "Daha Fazlasını Keşfet",
        phoneLabel: "Telefon",
        emailLabel: "E-posta Adresi"
      },
      footer: {
        description: "Özel tasarım lüks saatler. Her saat, ince işçilik ve zarafetin bir başyapıtıdır.",
        explore: "Keşfet",
        boutiques: "Butikler",
        newsletter: "Bülten",
        newsletterDesc: "kbchrono dünyasından özel güncellemeler alın.",
        emailPlaceholder: "E-postanız",
        join: "Katıl",
        rights: "© 2026 kbchrono. Tüm hakları saklıdır."
      },
      whatsapp: {
        message: "Merhaba! kbchrono saatleri hakkında bilgi almak istiyorum."
      },
      collectionGrid: {
        title: "Zamanın Başyapıtları",
        filter: {
          all: "Tüm Koleksiyonlar",
          ap: "Audemars Piguet",
          rm: "Richard Mille",
          pp: "Patek Philippe",
          rolex: "Rolex"
        }
      },
      notFound: {
        title: "404",
        message: "Hata! Sayfa bulunamadı",
        return: "Ana Sayfaya Dön"
      },
      common: {
        back: "Koleksiyona Dön",
        notFound: "Saat bulunamadı.",
        specs: "Teknik Özellikler",
        engineering: "Mühendislik Detayları",
        theStory: "Hikaye",
        behind: "Yaratılışın Arkasında",
        requestInfo: "Bilgi Alın",
        bookViewing: "Randevu Alın",
        specLabels: {
          movement: "Mekanizma",
          case_material: "Kasa Materyali",
          case_size: "Kasa Çapı",
          water_resistance: "Su Geçirmezlik",
          power_reserve: "Güç Rezervi",
          crystal: "Cam"
        }
      },
      watches: {
        "kunkor-tourbillon": {
          name: "kbchrono Tourbillon",
          tagline: "Zamanın sanata dönüştüğü yer",
          description: "72 saatlik güç rezervine sahip el yapımı pembe altın iskelet tourbillon. Geleneksel saatçiliğin bir başyapıtı.",
          story: "kbchrono Tourbillon, üç yıllık amansız bir mükemmellik arayışını temsil ediyor. Her bir bileşen, Cenevre atölyemizdeki usta saatçilerimiz tarafından elle işlenmiştir ve sonuçta sadece zaman işleyişini aşan, giyilebilir bir sanat eseri ortaya çıkmıştır.",
          collection: "Haute Horlogerie",
          specs: {
            movement: "Manuel kurmalı tourbillon, Cal. AV-7001",
            case_material: "18K Pembe Altın",
            case_size: "42mm × 10.2mm",
            water_resistance: "30 metre",
            power_reserve: "72 saat",
            crystal: "Safir kristal, yansıma önleyici kaplama"
          }
        },
        "carbon-chronos": {
          name: "Carbon Chronos",
          tagline: "Ekstrem koşullar için üretildi",
          description: "Yarış DNA'sına sahip karbon fiber kronograf. En zorlu ortamlara dayanacak şekilde tasarlandı.",
          story: "Yarış pistinde doğan Carbon Chronos, motor sporlarının amansız ruhunu olağanüstü performanslı bir saate dönüştürüyor. Dövme karbon kasası titanyumdan daha hafif ama çelikten daha güçlüdür.",
          collection: "Sport",
          specs: {
            movement: "Otomatik kronograf, Cal. AV-5200",
            case_material: "Dövme Karbon ve 5. Sınıf Titanyum",
            case_size: "44mm × 14.5mm",
            water_resistance: "100 metre",
            power_reserve: "65 saat",
            crystal: "Çift AR kaplamalı safir cam"
          }
        },
        "midnight-elegance": {
          name: "Midnight Elegance",
          tagline: "Zamansız zarafet",
          description: "Derin mavi güneş ışığı kadranlı platin klasik saat. Sade lüksün somut örneği.",
          story: "Midnight Elegance, yüzyıllık horolojik geleneği tek bir mükemmel orantılı saate damıtıyor. Güneş şualı mavi kadranı, gece yarısı okyanusunun yüzeyi gibi ışığı yakalıyor.",
          collection: "Classic",
          specs: {
            movement: "Ultra ince otomatik, Cal. AV-3100",
            case_material: "950 Platin",
            case_size: "39mm × 7.8mm",
            water_resistance: "50 metre",
            power_reserve: "60 saat",
            crystal: "Box safir cam"
          }
        },
        "stealth-perpetual": {
          name: "Stealth Perpetual",
          tagline: "Ebediyet için mühendislik",
          description: "Sonsuz takvimli titanyum iskelet. Mikro mühendislik ve fütüristik tasarımın bir başarısı.",
          story: "Stealth Perpetual, manufaktürümüz tarafından yaratılan en karmaşık mekanizmalardan birine ev sahipliği yapıyor. Sonsuz takvimi, 2100 yılına kadar tek bir ayar gerektirmeden tarihi, günü, ayı ve ay evresini hatasız takip edecektir.",
          collection: "Complications",
          specs: {
            movement: "Otomatik sonsuz takvim, Cal. AV-9500",
            case_material: "5. Sınıf Titanyum, DLC kaplama",
            case_size: "41mm × 11.5mm",
            water_resistance: "50 metre",
            power_reserve: "55 saat",
            crystal: "Ön ve arka safir cam"
          }
        },
        "lunaire-tourbillon-42mm-onyx-edition": {
          name: "Lunaire Tourbillon — Onyx Edition",
          tagline: "Atölyemizden yeni bir başyapıt",
          description: "Horoloji dünyasında devrim yaratan Lunaire Tourbillon, gökyüzünün eşsiz mekanizmasını bileğinize taşıyor. Onyx kasası ve tamamen el yapımı mekanizmasıyla koleksiyonun en nadide parçası.",
          story: "Horoloji dünyasında devrim yaratan Lunaire Tourbillon, gökyüzünün eşsiz mekanizmasını bileğinize taşıyor. Onyx kasası ve tamamen el yapımı mekanizmasıyla koleksiyonun en nadide parçası.",
          collection: "Lunaire Tourbillon",
          specs: {
            movement: "Otomatik İsviçre Mekanizması",
            case_material: "5. Sınıf Titanyum",
            case_size: "42mm",
            water_resistance: "50 metre",
            power_reserve: "60 saat",
            crystal: "Safir Cam"
          }
        }
      }
    }
  },
  ar: {
    translation: {
      nav: {
        collections: "المجموعات",
        craftsmanship: "الحرفية",
        partnership: "الشراكة",
        story: "فلسفتنا",
        contact: "اتصل بنا"
      },
      partnership: {
        subtitle: "شريكنا الهندسي",
        title: "صُنع بواسطة بايزيريون",
        description: "تم تصميم وتطوير كل بكسل وانتقال وخط برمجيات في تجربة Kbchrono الرقمية بدقة متناهية بواسطة بايزيريون.",
        visitWebsite: "زيارة موقع بايزيريون",
        tagline: "بناء مستقبل الأعمال باستخدام الذكاء الاصطناعي",
        services: {
          title: "خبرات بايزيريون الأساسية",
          web: {
            title: "تصميم مواقع عالية الأداء",
            desc: "واجهات مستخدم تحبس الأنفاس، ورسوم متحركة سلسة، وبنى برمجية قوية وفائقة السرعة مصممة للعلامات التجارية الفاخرة."
          },
          crm: {
            title: "حلول إدارة علاقات العملاء (CRM) المخصصة",
            desc: "أنظمة مخصصة لإدارة علاقات العملاء مصممة لتوسيع نطاق تدفقات العمل في المؤسسات وتحسين عمليات البيع."
          },
          ai: {
            title: "الذكاء الاصطناعي وأتمتة العمليات",
            desc: "مساعدين صوتيين أذكياء، تحليلات تنبؤية، وأتمتة من الجيل التالي تعيد تعريف الكفاءة التشغيلية."
          }
        },
        projectStory: {
          title: "مشروع kbchrono",
          desc: "بالتعاون الوثيق مع kbchrono، صممت بايزيريون هذه المنصة الرقمية وطورتها. ومن خلال دمج جماليات الفخامة مع تقنيات الويب الحديثة عالية الأداء (React و TypeScript و Vite و Tailwind CSS)، نجحوا في تجسيد رؤيتنا للساعات الفاخرة في العالم الرقمي. والنتيجة هي مزيج سلس ورائع بين الهندسة والبراعة الحرفية."
        }
      },
      hero: {
        subtitle: "ساعات حصرية",
        title: "هندسة من أجل التميز",
        description: "الانسجام الخالي من العيوب بين الحرفية اليدوية الدقيقة والهندسة الحديثة. كل ساعة هي انعكاس حصري للجماليات والجودة.",
        cta: "استكشف المجموعة"
      },
      craftsmanship: {
        subtitle: "فن الكمال",
        title: "تصميم حصري, براعة لا تشوبها شائبة",
        description1: "أبعد من قياس الوقت، نحن نحوله إلى عمل فني. تنبض كل ساعة من ورش عمل kbchrono بالحياة من خلال براعة يدوية فريدة.",
        description2: "يتم اختيار أفضل المواد فقط في عملية التصميم لدينا. تم تصميم كل قطعة بعناية لإنشاء إرث ينتقل من جيل إلى جيل.",
        stats: {
          value1: "جماليات",
          label1: "خطوط مثالية",
          value2: "أناقة",
          label2: "تفاصيل دقيقة",
          value3: "براعة",
          label3: "حرفية فريدة"
        }
      },
      story: {
        subtitle: "فلسفة kbchrono",
        title: "رؤية تتجاوز الزمن",
        milestones: {
          m1: {
            title: "الرؤية",
            description: "دفع حدود صناعة الساعات التقليدية لإنشاء روائع ميكانيكية للمستقبل."
          },
          m2: {
            title: "التصميم",
            description: "تفاصيل مدروسة بدقة، تمزج بين الجماليات الخالدة والخطوط الحديثة."
          },
          m3: {
            title: "الابتكار",
            description: "إضفاء بُعد جديد تمامًا من الجماليات والفخامة على الوقت بلمسات إبداعية تتجاوز حدود صناعة الساعات التقليدية."
          },
          m4: {
            title: "البراعة",
            description: "نتيجة للحرفية الدقيقة والسعي الدؤوب للكمال، تشكلت بأيدي خبراء."
          }
        }
      },
      contact: {
        subtitle: "استشارة خاصة",
        title: "تجربة kbchrono",
        description: "ندعوكم لاكتشاف عالمنا من صناعة الساعات الاستثنائية. حدد موعداً لاستشارة خاصة في أحد متاجرنا أو رتب لعرض شخصي في الوقت الذي يناسبك.",
        book: "حجز استشارة",
        discover: "اكتشف المزيد",
        phoneLabel: "الهاتف",
        emailLabel: "البريد الإلكتروني"
      },
      footer: {
        description: "صناعة الساعات الراقية والحصرية. كل ساعة هي عمل فني من الهندسة الدقيقة والحرفية اليدوية.",
        explore: "استكشف",
        boutiques: "المتاجر",
        newsletter: "النشرة الإخبارية",
        newsletterDesc: "احصل على تحديثات حصرية من عالم kbchrono.",
        emailPlaceholder: "بريدك الإلكتروني",
        join: "انضمام",
        rights: "© 2026 kbchrono. جميع الحقوق محفوظة."
      },
      whatsapp: {
        message: "مرحباً! أود الحصول على معلومات حول ساعات kbchrono."
      },
      collectionGrid: {
        title: "روائع الزمن",
        filter: {
          all: "جميع المجموعات",
          ap: "أوديمار بيغي",
          rm: "ريتشارد ميل",
          pp: "باتيك فيليب",
          rolex: "رولكس"
        }
      },
      notFound: {
        title: "404",
        message: "عذراً! الصفحة غير موجودة",
        return: "العودة إلى الصفحة الرئيسية"
      },
      common: {
        back: "العودة إلى المجموعة",
        notFound: "لم يتم العثور على الساعة.",
        specs: "المواصفات الفنية",
        engineering: "تفاصيل الهندسة",
        theStory: "القصة",
        behind: "خلف الكواليس",
        requestInfo: "طلب معلومات",
        bookViewing: "حجز موعد",
        specLabels: {
          movement: "الحركة",
          case_material: "مادة العلبة",
          case_size: "حجم العلبة",
          water_resistance: "مقاومة الماء",
          power_reserve: "احتياطي الطاقة",
          crystal: "الكريستال"
        }
      },
      watches: {
        "kunkor-tourbillon": {
          name: "kbchrono توربيون",
          tagline: "حيث يصبح الوقت فناً",
          description: "توربيون هيكلي من الذهب الوردي مشغول يدوياً مع احتياطي طاقة لمدة 72 ساعة. تحفة فنية من صناعة الساعات التقليدية.",
          story: "تمثل ساعة kbchrono توربيون ثلاث سنوات من السعي الدؤوب لتحقيق الكمال. تم تشطيب كل مكون يدوياً على يد صانعي الساعات المهرة لدينا في ورشة جنيف الخاصة بنا، مما أدى إلى ساعة تتجاوز مجرد قياس الوقت لتصبح قطعة فنية قابلة للارتداء.",
          collection: "الساعات الفاخرة",
          specs: {
            movement: "توربيون يدوي الإطار، Cal. AV-7001",
            case_material: "ذهب وردي عيار 18 قيراط",
            case_size: "42mm × 10.2mm",
            water_resistance: "30 متراً",
            power_reserve: "72 ساعة",
            crystal: "كريستال الياقوت المضاد للانعكاس"
          }
        },
        "carbon-chronos": {
          name: "كربون كرونوس",
          tagline: "صُممت للأحوال القاسية",
          description: "كرونوغراف من ألياف الكربون مع الحمض النووي للسباقات. صُمم ليتحمل أكثر البيئات تطلباً.",
          story: "ولدت ساعة كربون كرونوس على حلبة السباق، وتجسد روح رياضة السيارات التي لا تهدأ في ساعة ذات أداء استثنائي. علبتها المصنوعة من الكربون المطروق أخف من التيتانيوم ولكنها أقوى من الفولاذ.",
          collection: "رياضي",
          specs: {
            movement: "كرونوغراف أوتوماتيكي، Cal. AV-5200",
            case_material: "كربون مطروق وتيتانيوم من الدرجة الخامسة",
            case_size: "44mm × 14.5mm",
            water_resistance: "100 متر",
            power_reserve: "65 ساعة",
            crystal: "كريستال ياقوت بطبقتين مضادتين للانعكاس"
          }
        },
        "midnight-elegance": {
          name: "أناقة منتصف الليل",
          tagline: "رقي خالد",
          description: "ساعة بلاتينية بقرص أزرق عميق بنمط أشعة الشمس. تجسيد للفخامة المتواضعة.",
          story: "تختصر ساعة أناقة منتصف الليل قروناً من تقاليد صناعة الساعات في ساعة واحدة متناسبة تماماً. يلتقط قرصها الأزرق نمط أشعة الشمس الضوء مثل سطح المحيط في منتصف الليل.",
          collection: "كلاسيك",
          specs: {
            movement: "أوتوماتيكي رفيع للغاية، Cal. AV-3100",
            case_material: "بلاتين 950",
            case_size: "39mm × 7.8mm",
            water_resistance: "50 متراً",
            power_reserve: "60 ساعة",
            crystal: "كريستال ياقوت صندوقي"
          }
        },
        "stealth-perpetual": {
          name: "ستيلث بيربيتوال",
          tagline: "هندسة للأبدية",
          description: "هيكل تيتانيوم مع تقويم دائم. إنجاز في الهندسة الدقيقة والتصميم المستقبلي.",
          story: "تضم ساعة ستيلث بيربيتوال واحدة من أكثر الحركات تعقيداً التي ابتكرها مصنعنا على الإطلاق. سيقوم تقويمها الدائم بتتبع التاريخ واليوم والشهر ومرحلة القمر بدقة حتى عام 2100 دون تعديل واحد.",
          collection: "تعقيدات",
          specs: {
            movement: "تقويم دائم أوتوماتيكي، Cal. AV-9500",
            case_material: "تيتانيوم درجة خامسة مطلي DLC",
            case_size: "41mm × 11.5mm",
            water_resistance: "50 متراً",
            power_reserve: "55 ساعة",
            crystal: "كريستال ياقوت أمامي وخلفي"
          }
        },
        "lunaire-tourbillon-42mm-onyx-edition": {
          name: "لونير توربيون — طبعة العقيق",
          tagline: "تحفة جديدة من ورشتنا",
          description: "تُحدث ثورة في عالم صناعة الساعات، حيث تجلب ساعة لونير توربيون آلية السماء الفريدة إلى معصمك. بفضل علبتها المصنوعة من العقيق وحركتها المصنوعة يدوياً بالكامل، فهي أندر قطعة في المجموعة.",
          story: "تُحدث ثورة في عالم صناعة الساعات، حيث تجلب ساعة لونير توربيون آلية السماء الفريدة إلى معصمك. بفضل علبتها المصنوعة من العقيق وحركتها المصنوعة يدوياً بالكامل، فهي أندر قطعة في المجموعة.",
          collection: "لونير توربيون",
          specs: {
            movement: "حركة سويسرية أوتوماتيكية",
            case_material: "تيتانيوم من الدرجة الخامسة",
            case_size: "42mm",
            water_resistance: "50 متراً",
            power_reserve: "60 ساعة",
            crystal: "كريستال ياقوت"
          }
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    // Eğer bir dil seçilmemişse varsayılan olarak İngilizce başla
    lng: localStorage.getItem('i18nextLng') || 'en',
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
