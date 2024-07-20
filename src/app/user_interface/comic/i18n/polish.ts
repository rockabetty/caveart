const polish = {
  comicPages: {
    add: "Dodaj strony",
  },
  comicProfile: {
    create: "Utwórz komiks",
    edit: "Edytuj profil",
    save: "Zapisz zmiany",
    coverImageSize: "Obrazy okładki mogą mieć do {{megabytes}} megabajtów.",
    coverImage: "Obraz okładki",
    basicInfo: "Podstawowe informacje",
    title: "Tytuł",
    subdomain: "Subdomena",
    description: "Opis",
    visibility: {
      name: "Widoczność",
      public: "Publiczny (Dostępny przez wyszukiwarkę)",
      unlisted: "Niepubliczny (Ukryty w wyszukiwarkach)",
      private: "Prywatny (tylko dla zaproszonych i administratorów)",
    },
    likes: {
      name: "Polubienia",
      enabled: "Użytkownicy mogą polubić strony komiksu",
    },
    comments: {
      name: "Komentarze",
      allowed: "Użytkownicy mogą swobodnie komentować",
      moderated: "Komentarze są moderowane",
      disabled: "Komentarze są wyłączone",
    },
    helperTexts: {
      subdomain:
        "Tylko A-Z, liczby, myślniki i podkreślenia. Twój komiks będzie hostowany pod adresem http://{{domain}}.caveartwebcomics.com",
      description: "Opowiedz nam o swoim komiksie!",
    },
    errors: {
      "403": "Nie masz uprawnień do dokonywania zmian w tym komiksie.",
      titleMissing: "Twój komiks potrzebuje nazwy!",
      subdomainMissing: "Twój komiks potrzebuje subdomeny.",
    },
  },
  contentWarnings: {
    title: "Ostrzeżenia o treści",
    description:
      "Pomóż użytkownikom filtrować niechciane treści (np. zgodnie z osobistymi preferencjami, kontrolami NSFW itp.) wybierając odpowiednie etykiety ostrzeżeń o treści.",
    absent: "Brak",
    sexualContent: "Treści seksualne/sugestywne",
    violentContent: "Śmierć/przemoc",
    languageContent: "Treści wrażliwe",
    substanceContent: "Narkotyki/alkohol",
    Nudity: {
      name: "Nagość",
      definition:
        "Nagie ciała bez cenzury. Jeśli są ukazane genitalia, należy oznaczyć to jako 'nagość frontalna'.",
      someNudity: "Częściowa lub łagodna nagość",
      frequentNudity: "Nagość frontalna",
    },
    sexScenes: {
      name: "Sceny seksu",
      definition:
        "Zgoda na aktywność seksualną na ekranie (oralną, penetracyjną itp.).",
      someSexScenes: "Sporadyczne lub ocenzurowane sceny seksu",
      frequentSexScenes: "Częste lub graficzne sceny seksu",
    },
    sexualViolence: {
      name: "Przemoc seksualna",
      definition:
        "Niechciana aktywność seksualna na ekranie (gwałt, napaść, dotykanie/kontakt seksualny, molestowanie, wykorzystywanie, ekshibicjonizm).",
      someSexualViolence: "Przemoc seksualna wyłączając gwałt",
      frequentSexualViolence: "Graficzna przemoc seksualna lub gwałt",
    },
    suggestiveContent: {
      name: "Sugestywna treść",
      definition:
        "Łagodne prowokacyjne odniesienia seksualne lub materiały, takie jak insynuacje, uwagi seksualne, bielizna lub zabawki erotyczne.",
      someSuggestiveContent: "Nieco sugestywna treść",
      frequentSuggestiveContent: "Częsta sugestywna treść",
    },
    violence: {
      name: "Przemoc",
      definition:
        "Jakikolwiek rodzaj przemocy fizycznej wobec innych postaci, w tym przemoc kreskówkowa. Inne ostrzeżenia o treści określają, jak graficzna jest przemoc.",
      someViolence: "Ukazania przemocy",
      frequentViolence: "Częste ukazania przemocy",
    },
    gore: {
      name: "Makabra",
      definition:
        "Obrażenia obejmują nie tylko krew, ale i odsłonięte mięśnie, narządy i/lub kości oraz krwawe rozczłonkowanie. Obejmuje to również przedstawienia kreskówkowe.",
      someGore: "Sporadyczna makabra",
      frequentGore: "Częsta makabra",
    },
    blood: {
      name: "Krew",
      definition:
        "Obrażenia krwawią, ale nie ukazują makabry. Obejmuje to kreskówkową krew lub nie-ludzką krew, która nie jest czerwona.",
      someBlood: "Łagodne/kreskówkowe ukazania krwi",
      frequentBlood: "Obfite ukazania krwi",
    },
    deathAndSuicide: {
      name: "Śmierć i samobójstwo",
      definition: "Śmierć postaci pojawia się w fabule.",
      someDeathAndSuicide: "Występują śmierci i/lub samobójstwa",
      frequentDeathAndSuicide: "Częsta, intensywna lub traumatyczna śmierć i/lub samobójstwo",
    },
    sexualLanguage: {
      name: "Język seksualny",
      definition:
        "Postacie opisujące jawnie seksualne rzeczy, np. co zamierzają zrobić w scenie seksu.",
      someSexualLanguage: "Język seksualny",
      frequentSexualLanguage: "Częsty/graficzny język seksualny",
    },
    swearing: {
      name: "Przekleństwa",
      definition:
        "Wulgaryzmy. 'Explicit' oznacza intensywne lub częste używanie wulgaryzmów, takich jak F-word, MFer itp. Moderate oznacza, że jakiekolwiek wulgaryzmy są używane.",
      someSwearing: "Umiarkowane przekleństwa",
      frequentSwearing: "Ostre przekleństwa",
    },
    slurs: {
      name: "Obelgi",
      definition:
        "Obraźliwe i pejoratywne określenia osób ze względu na ich cechy wrodzone, takie jak rasa, seksualność czy płeć.",
      someSlurs: "Sporadyczne używanie obelg",
      frequentSlurs: "Częste lub intensywne używanie obelg",
    },
    abusiveLanguage: {
      name: "Przemoc emocjonalna",
      definition:
        "Jedna lub więcej postaci upokarza, obraża, manipuluje i/lub wprowadza strach i niepewność w innej postaci w ramach dynamicznego związku.",
      someAbusiveLanguage: "Nieco przemocy emocjonalnej",
      frequentAbusiveLanguage: "Ekstremalna lub powtarzająca się przemoc emocjonalna",
    },
    hardDrugUse: {
      name: "Używanie twardych narkotyków",
      definition:
        "Używanie jakiejkolwiek nielegalnej substancji, gdzie uzależnienie lub śmiertelne przedawkowanie stanowi poważne ryzyko. Na przykład: kokaina, opiaty, metamfetamina.",
      someHardDrugUse: "Sporadyczne używanie twardych narkotyków",
      frequentHardDrugUse: "Częste używanie lub nadużywanie twardych narkotyków",
    },
    commonDrugUse: {
      name: "Używanie miękkich narkotyków",
      definition:
        "Używanie nielegalnych substancji, które nie są związane z możliwością przedawkowania lub uzależnienia. Na przykład: marihuana, grzyby, LSD.",
      someCommonDrugUse: "Sporadyczne używanie narkotyków",
      frequentCommonDrugUse: "Częste używanie narkotyków",
    },
    alcoholUse: {
      name: "Używanie alkoholu",
      definition:
        "Używanie alkoholu o jakimkolwiek charakterze, od piwa i wina po mocne trunki. Przedstawienia pijanych postaci.",
      someAlcoholUse: "Sporadyczne używanie alkoholu",
      frequentAlcoholUse: "Częste używanie lub nadużywanie alkoholu",
    },
    referencesToSubstances: {
      name: "Odniesienia do narkotyków lub alkoholu",
      definition:
        "Treści nie ukazują ich używania, ale zawierają odniesienia do narkotyków i/lub alkoholu, np. w dialogach lub reklamach w świecie przedstawionym.",
      someReferencesToSubstances: "Sporadyczne odniesienia do substancji",
      frequentReferencesToSubstances: "Częste odniesienia do substancji",
    },
  },
  genres: {
    title: "Gatunki",
    Action: "Akcja",
    Adventure: "Przygoda",
    Comedy: "Komedia",
    Drama: "Dramat",
    Fantasy: "Fantasy",
    Horror: "Horror",
    Mystery: "Kryminał",
    Romance: "Romans",
    "Sci-Fi": "Science Fiction",
    "Slice of Life": "Okruchy życia",
    Superhero: "Superbohater",
    Thriller: "Thriller",
    Historical: "Historyczny",
    Western: "Western",
    Noir: "Noir",
    Dystopian: "Dystopia",
    Mecha: "Mecha",
    "Magical Girl": "Magical Girl",
    Pokemon: "Pokemon",
    Fandom: "Fandom",
  },
};

export default polish;