const spanish = {
  comicPages: {
    add: "Crear páginas",
  },
  comicProfile: {
    create: "Crear cómic",
    edit: "Editar perfil",
    save: "Guardar cambios",
    coverImageSize: "Las imágenes de portada pueden tener hasta {{megabytes}} megabytes.",
    coverImage: "Imagen de portada",
    basicInfo: "Información general",
    title: "Título",
    subdomain: "Subdominio",
    description: "Descripción",
    visibility: {
      name: "Visibilidad",
      public: "Público (Accesible a través de una búsqueda)",
      unlisted: "No listado (Oculto en los motores de búsqueda)",
      private: "Privado (solo invitados y administradores)",
    },
    likes: {
      name: "Me gusta",
      enabled: "Los usuarios pueden dar me gusta a las páginas del cómic",
    },
    comments: {
      name: "Comentarios",
      allowed: "Los usuarios pueden comentar libremente",
      moderated: "Los comentarios son moderados",
      disabled: "Los comentarios están desactivados",
    },
    helperTexts: {
      subdomain:
        "Solo A-Z, números, guiones y guiones bajos. Tu cómic estará alojado en http://{{domain}}.caveartwebcomics.com",
      description: "¡Cuéntanos sobre tu cómic!",
    },
    errors: {
      "403": "No tienes permiso para hacer cambios en este cómic.",
      titleMissing: "¡Tu cómic necesita un nombre!",
      subdomainMissing: "Tu cómic necesita un subdominio.",
    },
  },
  contentWarnings: {
    title: "Advertencias de contenido",
    description:
      "Ayuda a los usuarios a filtrar contenido no deseado (como para preferencias personales, controles NSFW, etc.) seleccionando cualquier etiqueta de advertencia de contenido que aplique.",
    absent: "No hay",
    sexualContent: "Contenido sexual/sugestivo",
    violentContent: "Muerte/violencia",
    languageContent: "Contenido sensible",
    substanceContent: "Drogas/alcohol",
    Nudity: {
      name: "Desnudez",
      definition:
        "Cuerpos desnudos sin censura. Si se representan genitales, debes marcarlo como 'desnudez frontal'.",
      someNudity: "Desnudez parcial o leve",
      frequentNudity: "Desnudez frontal",
    },
    sexScenes: {
      name: "Escenas sexuales",
      definition:
        "Actividad sexual consensuada en pantalla (oral, penetración, etc.).",
      someSexScenes: "Escenas sexuales ocasionales o censuradas",
      frequentSexScenes: "Escenas sexuales frecuentes o gráficas",
    },
    sexualViolence: {
      name: "Violencia sexual",
      definition:
        "Actividad sexual no consensuada en pantalla (violación, agresión, contacto/acoso sexual, explotación, exhibicionismo).",
      someSexualViolence: "Violencia sexual excluyendo violación",
      frequentSexualViolence: "Violencia sexual gráfica o violación",
    },
    suggestiveContent: {
      name: "Contenido sugestivo",
      definition:
        "Referencias sexuales leves o materiales provocativos como insinuaciones, comentarios sexuales, lencería o juguetes sexuales.",
      someSuggestiveContent: "Algo de contenido sugestivo",
      frequentSuggestiveContent: "Contenido sugestivo frecuente",
    },
    violence: {
      name: "Violencia",
      definition:
        "Cualquier tipo de fuerza física contra otros personajes, incluida la violencia de dibujos animados. Otras advertencias de contenido determinan qué tan gráfica es.",
      someViolence: "Representaciones de violencia",
      frequentViolence: "Representaciones frecuentes de violencia",
    },
    gore: {
      name: "Sangriento",
      definition:
        "Las heridas incluyen no solo sangre, sino carne expuesta, órganos y/o huesos, o desmembramiento sangriento. Esto incluye representaciones caricaturescas.",
      someGore: "Sangriento ocasional",
      frequentGore: "Sangriento frecuente",
    },
    blood: {
      name: "Sangre",
      definition:
        "Las heridas sangran, pero no se representa sangre. Esto incluye sangre caricaturesca o sangre no humana que no sea roja.",
      someBlood: "Representaciones de sangre leve/caricaturesca",
      frequentBlood: "Representaciones de sangre abundante",
    },
    deathAndSuicide: {
      name: "Muerte y suicidio",
      definition: "La muerte de personajes entra en la trama.",
      someDeathAndSuicide: "Ocurren muertes y/o suicidios",
      frequentDeathAndSuicide:
        "Muerte y/o suicidio frecuente, intenso o traumático",
    },
    sexualLanguage: {
      name: "Lenguaje sexual",
      definition:
        "Personajes que describen cosas sexualmente explícitas, como lo que van a hacer en una escena de sexo.",
      someSexualLanguage: "Lenguaje sexual",
      frequentSexualLanguage: "Lenguaje sexual frecuente/gráfico",
    },
    swearing: {
      name: "Maldiciones",
      definition:
        "Expletivos. 'Explícito' significa uso intenso o frecuente de blasfemias como la palabra F, MFer, etc. Moderado denota que se usa cualquier blasfemia.",
      someSwearing: "Blasfemias moderadas",
      frequentSwearing: "Blasfemias explícitas",
    },
    slurs: {
      name: "Peyorativos",
      definition:
        "Términos ofensivos y despectivos para describir a una persona debido a sus características intrínsecas, como su raza, sexualidad o género.",
      someSlurs: "Uso ocasional de peyorativos",
      frequentSlurs: "Uso frecuente o intenso de peyorativos",
    },
    abusiveLanguage: {
      name: "Abuso emocional",
      definition:
        "Uno o más personajes humillan, insultan, manipulan y/o infunden miedo e inseguridad en otro personaje como parte de una dinámica abusiva.",
      someAbusiveLanguage: "Algo de abuso emocional",
      frequentAbusiveLanguage: "Abuso emocional extremo o recurrente",
    },
    hardDrugUse: {
      name: "Uso de drogas fuertes",
      definition:
        "Uso de cualquier sustancia ilícita donde la adicción o la sobredosis fatal representan un riesgo serio. Por ejemplo: cocaína, opiáceos, metanfetamina.",
      someHardDrugUse: "Uso ocasional de drogas fuertes",
      frequentHardDrugUse: "Uso o abuso frecuente de drogas fuertes",
    },
    commonDrugUse: {
      name: "Uso de drogas suaves",
      definition:
        "Uso de sustancias ilícitas que no están asociadas con la sobredosis o la adicción. Por ejemplo: marihuana, hongos, LSD.",
      someCommonDrugUse: "Uso ocasional de drogas",
      frequentCommonDrugUse: "Uso frecuente de drogas",
    },
    alcoholUse: {
      name: "Uso de alcohol",
      definition:
        "Uso de alcohol de cualquier naturaleza, desde cerveza y vino hasta licores fuertes. Representaciones de personajes ebrios.",
      someAlcoholUse: "Algo de uso de alcohol",
      frequentAlcoholUse: "Uso frecuente o abuso de alcohol",
    },
    referencesToSubstances: {
      name: "Referencias a drogas o alcohol",
      definition:
        "El contenido no muestra su uso, pero muestra referencias a drogas y/o alcohol, como en diálogos o anuncios en el mundo ficticio.",
      someReferencesToSubstances: "Referencias ocasionales a sustancias",
      frequentReferencesToSubstances: "Referencias frecuentes a sustancias",
    },
  },
  genres: {
    title: "Géneros",
    Action: "Acción",
    Adventure: "Aventura",
    Comedy: "Comedia",
    Drama: "Drama",
    Fantasy: "Fantasía",
    Horror: "Terror",
    Mystery: "Misterio",
    Romance: "Romance",
    "Sci-Fi": "Ciencia Ficción",
    "Slice of Life": "Recuentos de la vida",
    Superhero: "Superhéroe",
    Thriller: "Suspenso",
    Historical: "Histórico",
    Western: "Western",
    Noir: "Noir",
    Dystopian: "Distopía",
    Mecha: "Mecha",
    "Magical Girl": "Chica Mágica",
    Pokemon: "Pokémon",
    Fandom: "Fandom",
  },
};

export default spanish;