export const QUESTION_DURATION_SECONDS = 10;

export type ProfileQuestion = {
  question: string;
  options: [string, string, string, string];
};

export type TriviaQuestion = {
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

export const PROFILE_QUESTIONS: ProfileQuestion[] = [
  {
    question: "Chanteuse préférée des années 2000 ?",
    options: ["Britney Spears", "Christina Aguilera", "Beyoncé", "Shakira"]
  },
  {
    question: "Dessin animé préféré des années 2000 ?",
    options: ["Barbie", "Totally Spies", "Winx Club", "W.I.T.C.H."]
  },
  {
    question: "Groupe / boys band préféré ?",
    options: ["Black Eyed Peas", "Destiny's Child", "Sum 41", "Daft Punk"]
  },
  {
    question: "Bonbon/snack emblématique des années 2000 ?",
    options: ["Dragibus", "Carambar", "Hollywood chewing-gum", "Tagada"]
  },
  {
    question: "Console préférée ?",
    options: ["PS2", "DS", "Game Boy Advance", "Xbox"]
  },
  {
    question: "Série préférée ?",
    options: ["Charmed", "Friends", "Smallville", "Malcolm"]
  },
  {
    question: "Coupe de cheveux préférée des années 2000 ?",
    options: ["Mèches blondes", "Frange", "Cheveux lissés", "Couettes hautes"]
  },
  {
    question: "Appareil techno culte ?",
    options: ["Tamagotchi", "iPod", "Nokia 3310", "Game Boy"]
  },
  {
    question: "Boisson préférée de l'époque ?",
    options: ["Fanta", "Oasis", "Lipton Ice Tea", "Capri-Sun"]
  },
  {
    question: "Danse/mouvement culte ?",
    options: ["Tecktonik", "Moonwalk", "Robot", "S Club Party"]
  }
];

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: "En quelle année sort le premier iPhone ?",
    options: ["2007", "2005", "2009", "2003"],
    correctIndex: 0
  },
  {
    question: "Qui chante \"Toxic\" ?",
    options: ["Christina Aguilera", "Britney Spears", "Shakira", "Beyoncé"],
    correctIndex: 1
  },
  {
    question: "Quel film sort en 2003 avec Johnny Depp en pirate ?",
    options: ["Sherlock Holmes", "Charlie et la Chocolaterie", "Pirates des Caraïbes", "Edward aux mains d'argent"],
    correctIndex: 2
  },
  {
    question: "Quel réseau social est lancé en 2004 par Mark Zuckerberg ?",
    options: ["MySpace", "Twitter", "Skyblog", "Facebook"],
    correctIndex: 3
  },
  {
    question: "Quelle chanteuse se rase la tête en 2007 ?",
    options: ["Britney Spears", "Pink", "Avril Lavigne", "Christina Aguilera"],
    correctIndex: 0
  },
  {
    question: "Quelle console sort en 2000 ?",
    options: ["Xbox", "PS2", "Wii", "PS3"],
    correctIndex: 1
  },
  {
    question: "Quelle plateforme de blog était culte chez les ados français dans les années 2000 ?",
    options: ["Tumblr", "WordPress", "Skyblog", "Medium"],
    correctIndex: 2
  },
  {
    question: "Quel film d'animation sort en 2003 avec un poisson-clown ?",
    options: ["Shrek", "Cars", "Ratatouille", "Le Monde de Nemo"],
    correctIndex: 3
  },
  {
    question: "Qui remporte la Coupe du Monde de football en 2006 ?",
    options: ["Italie", "France", "Brésil", "Allemagne"],
    correctIndex: 0
  },
  {
    question: "Quel groupe chante \"In the End\" ?",
    options: ["Evanescence", "Linkin Park", "Nickelback", "Three Days Grace"],
    correctIndex: 1
  },
  {
    question: "Quelle console portable à deux écrans sort en 2004 ?",
    options: ["Game Boy Advance", "PSP", "Nintendo DS", "Game Boy Color"],
    correctIndex: 2
  },
  {
    question: "Quelle actrice joue Hermione Granger dans Harry Potter ?",
    options: ["Emma Roberts", "Emma Stone", "Dakota Fanning", "Emma Watson"],
    correctIndex: 3
  },
  {
    question: "En quelle année sort le premier jeu \"Les Sims\" ?",
    options: ["2000", "1998", "2002", "2004"],
    correctIndex: 0
  },
  {
    question: "Quel site de partage de vidéos devient un phénomène mondial en 2005-2006 ?",
    options: ["Dailymotion", "YouTube", "Vimeo", "TikTok"],
    correctIndex: 1
  },
  {
    question: "En quelle année sort \"Where Is The Love\" des Black Eyed Peas ?",
    options: ["2001", "2005", "2003", "2007"],
    correctIndex: 2
  },
  {
    question: "Quelle marque de survêtement est culte, portée par Paris Hilton ?",
    options: ["Levi's", "Diesel", "Calvin Klein", "Juicy Couture"],
    correctIndex: 3
  },
  {
    question: "Quel animal virtuel dans un œuf électronique est culte ?",
    options: ["Tamagotchi", "Furby", "Bratz", "Polly Pocket"],
    correctIndex: 0
  },
  {
    question: "Qui chante \"Genie in a Bottle\" ?",
    options: ["Britney Spears", "Christina Aguilera", "Mandy Moore", "Jessica Simpson"],
    correctIndex: 1
  },
  {
    question: "Quel film de 2004 avec Lindsay Lohan se déroule dans un lycée ?",
    options: ["Clueless", "10 Things I Hate About You", "Mean Girls", "She's All That"],
    correctIndex: 2
  },
  {
    question: "Quelle entreprise lance l'iPod en 2001 ?",
    options: ["Sony", "Microsoft", "Samsung", "Apple"],
    correctIndex: 3
  },
  {
    question: "Quelle émission de télé-réalité française lance Loana en 2001 ?",
    options: ["Loft Story", "Koh-Lanta", "Star Academy", "Nice People"],
    correctIndex: 0
  },
  {
    question: "Quel membre de NSYNC devient solo avec \"SexyBack\" ?",
    options: ["Nick Carter", "Justin Timberlake", "Joey Fatone", "JC Chasez"],
    correctIndex: 1
  },
  {
    question: "Quel téléphone increvable est culte dans les années 2000 ?",
    options: ["iPhone", "Motorola Razr", "Nokia 3310", "Samsung Galaxy"],
    correctIndex: 2
  },
  {
    question: "Quelle messagerie instantanée était culte pour chatter après l'école ?",
    options: ["WhatsApp", "Discord", "Slack", "MSN Messenger"],
    correctIndex: 3
  },
  {
    question: "Quel film sort en 2001 avec des monstres qui sortent des placards ?",
    options: ["Monstres & Cie", "Toy Story", "Le Monde de Nemo", "Les Indestructibles"],
    correctIndex: 0
  },
  {
    question: "Quelle émission de télé-réalité lance la famille Kardashian à la fin des années 2000 ?",
    options: ["Les Anges de la télé-réalité", "Keeping Up with the Kardashians", "Secret Story", "Loft Story"],
    correctIndex: 1
  },
  {
    question: "Quelle vidéo virale de 2002 montre un ado maladroit avec un sabre laser improvisé ?",
    options: ["Numa Numa Guy", "Chocolate Rain", "Star Wars Kid", "Keyboard Cat"],
    correctIndex: 2
  },
  {
    question: "En 2007, qui publie en larmes la vidéo culte \"Leave Britney Alone\" ?",
    options: ["Perez Hilton", "Tila Tequila", "Soulja Boy", "Chris Crocker"],
    correctIndex: 3
  },
  {
    question: "Quelle star épouse un ami d'enfance à Las Vegas en 2004... pour 55 heures seulement ?",
    options: ["Britney Spears", "Paris Hilton", "Pamela Anderson", "Jessica Simpson"],
    correctIndex: 0
  },
  {
    question: "Quelle chaîne de fast-food est pointée du doigt dans le documentaire choc \"Super Size Me\" (2004) ?",
    options: ["Burger King", "McDonald's", "KFC", "Subway"],
    correctIndex: 1
  },
  {
    question: "Quel jeu de construction en blocs sort en 2009 et devient culte ?",
    options: ["Roblox", "Fortnite", "Minecraft", "Terraria"],
    correctIndex: 2
  },
  {
    question: "Quel jouet parlant fait courir la rumeur (fausse) qu'il dirait \"Satan\" si on l'écoute à l'envers ?",
    options: ["Tamagotchi", "Bratz", "Teletubbies", "Furby"],
    correctIndex: 3
  },
  {
    question: "Quel dessin animé avec une éponge qui vit dans un ananas démarre en 1999 et cartonne dans les années 2000 ?",
    options: ["Bob l'éponge", "Les Razmoket", "Dora l'exploratrice", "Oggy et les cafards"],
    correctIndex: 0
  },
  {
    question: "Quelle marque de casquette trucker devient un délire de stars comme Paris Hilton et Ashton Kutcher ?",
    options: ["New Era", "Von Dutch", "Ed Hardy", "Von Trapp"],
    correctIndex: 1
  },
  {
    question: "Quelle marque de chaussures à roulette cachée dans le talon cartonne dans les cours de récré ?",
    options: ["Vans", "Converse", "Heelys", "Crocs"],
    correctIndex: 2
  },
  {
    question: "Quel réseau, ancêtre de Facebook, est LE repaire des ados avant d'être racheté par Rupert Murdoch ?",
    options: ["Friendster", "Bebo", "Orkut", "MySpace"],
    correctIndex: 3
  },
  {
    question: "Quel jeu avec un chien virtuel à élever et dresser sort sur DS en 2005 ?",
    options: ["Nintendogs", "Tamagotchi", "The Sims", "Animal Crossing"],
    correctIndex: 0
  },
  {
    question: "Quelle boisson énergisante autrichienne explose avec le slogan \"Ça vous donne des ailes\" ?",
    options: ["Monster", "Red Bull", "Rockstar", "Burn"],
    correctIndex: 1
  },
  {
    question: "Quel jeu d'arcade où il faut danser sur des flèches cartonne dans les années 2000 ?",
    options: ["Guitar Hero", "Just Dance", "Dance Dance Revolution", "SingStar"],
    correctIndex: 2
  },
  {
    question: "Quel président français lance un \"Casse-toi...\" resté culte au Salon de l'Agriculture 2008 ?",
    options: ["Jacques Chirac", "François Hollande", "Dominique de Villepin", "Nicolas Sarkozy"],
    correctIndex: 3
  }
];
