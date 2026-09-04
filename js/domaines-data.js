/* LES BOURGUIGNOLS : DONNÉES DU SITE (domaines, cuvées, arrivages)
   Copie du contenu publié en ligne, prise le 2026-09-04 16 h 59 min 56 s.
   Sert de secours quand la base ne répond pas. Ne pas modifier à la main :
   ce fichier est réécrit à chaque « node build-pages.js ». */
window.LB_DATA = {
  "regions": [
    "Champagne",
    "Chablis",
    "Côte de Nuits",
    "Côte de Beaune",
    "Côte chalonnaise",
    "Mâconnais",
    "Rhône Nord",
    "Provence"
  ],
  "domaines": [
    {
      "id": "georges-remy",
      "nom": "Domaine Georges Rémy",
      "site": "https://domainegeorgesremy.fr",
      "vins": [
        {
          "nom": "Les Hauts Clos",
          "note": "Parcelle de Bouzy en pinot noir pur, cuvée millésimée taillée pour la garde.",
          "cepage": "Pinot noir",
          "couleur": "effervescent",
          "appellation": "Champagne Grand Cru"
        },
        {
          "nom": "Le Mont de Tauxières",
          "note": "Assemblage millésimé à parts égales de pinot noir et de chardonnay.",
          "cepage": "Pinot noir, Chardonnay",
          "couleur": "effervescent",
          "appellation": "Champagne Grand Cru"
        },
        {
          "nom": "Blanc de Noirs",
          "note": "Pinot noir de Bouzy, millésimé.",
          "cepage": "Pinot noir",
          "couleur": "effervescent",
          "appellation": "Champagne Grand Cru"
        },
        {
          "nom": "Les Vaudayants",
          "note": "Rosé d'assemblage en pur pinot noir de Bouzy, cuvée numérotée non millésimée.",
          "cepage": "Pinot noir",
          "couleur": "effervescent",
          "appellation": "Champagne Grand Cru"
        },
        {
          "nom": "Les Juliennes",
          "note": "Rosé de macération en pur pinot noir de Bouzy, millésimé.",
          "cepage": "Pinot noir",
          "couleur": "effervescent",
          "appellation": "Champagne Grand Cru"
        },
        {
          "nom": "Les Muits",
          "note": "Blanc de blancs issu d'une parcelle de Tauxières, millésimé.",
          "cepage": "Chardonnay",
          "couleur": "effervescent",
          "appellation": "Champagne Premier Cru"
        },
        {
          "nom": "Les Quatre Terroirs",
          "note": "Assemblage des parcelles des quatre villages du domaine, à forte dominante pinot noir, cuvée numérotée.",
          "cepage": "Pinot noir, Chardonnay",
          "couleur": "effervescent",
          "appellation": "Champagne Premier Cru"
        },
        {
          "nom": "Les Vaudayants",
          "note": "Bouzy rouge, vin tranquille de pinot noir, millésimé.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Coteaux Champenois Bouzy"
        },
        {
          "nom": "Le Chapeau de Fer",
          "note": "Bouzy rouge issu d'une parcelle unique, millésimé.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Coteaux Champenois Bouzy"
        }
      ],
      "ordre": 1,
      "photo": "images/d-georges-remy.jpg",
      "region": "Champagne",
      "surface": "5,3 ha",
      "village": "Bouzy",
      "visible": true,
      "pratique": "biologique certifié",
      "vigneron": "Georges Rémy (vigneron, propriétaire)",
      "fondation": "1629",
      "signature": "Pinots noirs de Bouzy vinifiés parcelle par parcelle, très peu dosés.",
      "sousRegion": "Montagne de Reims",
      "description": "Installé à Bouzy, village grand cru de la Montagne de Reims, Georges Rémy a rejoint le domaine familial en 2000 et a signé ses premières cuvées de champagne en 2014, après des vins tranquilles dès 2011. Ses 5,3 hectares, répartis entre Bouzy, Ambonnay, Louvois et Tauxières, sont labourés depuis 2012 et certifiés en agriculture biologique depuis 2018. Chaque parcelle est vinifiée séparément, souvent sous bois, avec un dosage minimal, ce qui donne des champagnes de garde à dominante pinot noir."
    },
    {
      "id": "lilbert-fils",
      "nom": "Domaine Lilbert-Fils",
      "site": "https://www.champagne-lilbert.com",
      "vins": [
        {
          "nom": "Grand Cru Blanc de Blancs Brut",
          "note": "Cuvée principale de la maison, assemblage de Cramant, Chouilly et Oiry, au moins trois ans sur lies et faiblement dosée.",
          "cepage": "Chardonnay",
          "couleur": "effervescent",
          "appellation": "Champagne Grand Cru"
        },
        {
          "nom": "Perle",
          "note": "Sélection de vieilles vignes des trois villages, tirée à pression réduite pour une mousse plus délicate; la cuvée la plus rare de la maison.",
          "cepage": "Chardonnay",
          "couleur": "effervescent",
          "appellation": "Champagne Grand Cru"
        },
        {
          "nom": "Cramant Grand Cru Blanc de Blancs Millésimé",
          "note": "Issu uniquement de Cramant, dont la parcelle Les Buissons plantée en 1936; produit seulement les bonnes années.",
          "cepage": "Chardonnay",
          "couleur": "effervescent",
          "appellation": "Champagne Grand Cru"
        }
      ],
      "ordre": 2,
      "photo": "images/d-lilbert-fils.jpg",
      "region": "Champagne",
      "surface": "3,5 ha",
      "village": "Cramant",
      "visible": true,
      "pratique": "lutte raisonnée",
      "vigneron": "Bertrand Lilbert (vigneron, propriétaire)",
      "fondation": "1746",
      "signature": "Blancs de blancs grand cru de Cramant, tendus, crayeux et très peu dosés.",
      "sousRegion": "Côte des Blancs",
      "description": "Famille de vignerons à Cramant depuis 1746, les Lilbert cultivent 3,5 hectares de chardonnay répartis en une quinzaine de parcelles classées grand cru à Cramant, Chouilly et Oiry. Bertrand Lilbert, qui a pris la relève de son père Georges, n'élabore que trois cuvées, toutes en blanc de blancs, remuées à la main dans une cave creusée dans la craie et faiblement dosées. Le style est celui de la Côte des Blancs dans ce qu'elle a de plus pur : tension, minéralité crayeuse et bulle très fine."
    },
    {
      "id": "jean-collet",
      "nom": "Domaine Jean Collet",
      "site": "https://domaine-collet.fr",
      "vins": [
        {
          "nom": "Chablis Grand Cru Valmur",
          "note": "Parcelle historique de la famille, réputée pour sa profondeur et sa tension.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chablis Grand Cru Valmur"
        },
        {
          "nom": "Chablis Grand Cru Les Clos",
          "note": "Petite parcelle acquise plus récemment dans le climat le plus complet de Chablis, élevée sous bois.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chablis Grand Cru Les Clos"
        },
        {
          "nom": "Chablis 1er Cru Montée de Tonnerre",
          "note": "Rive droite, élevage en fûts sans bois neuf, cuvée dense et structurée.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chablis 1er Cru Montée de Tonnerre"
        },
        {
          "nom": "Chablis 1er Cru Vaillons",
          "note": "Rive gauche, élevage partiel en fût, style élégant avec davantage de chair.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chablis 1er Cru Vaillons"
        },
        {
          "nom": "Chablis 1er Cru Montmains",
          "note": "Rive gauche, élevé entièrement en cuve, profil droit et minéral.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chablis 1er Cru Montmains"
        },
        {
          "nom": "Chablis 1er Cru Les Forêts",
          "note": "Rive gauche, vin structuré, riche et ample.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chablis 1er Cru Les Forêts"
        },
        {
          "nom": "Chablis 1er Cru Butteaux",
          "note": "Rive gauche, parmi les premiers crus du domaine conduits en agriculture biologique.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chablis 1er Cru Butteaux"
        },
        {
          "nom": "Chablis 1er Cru Mont de Milieu",
          "note": "Rive droite, élevage sous bois.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chablis 1er Cru Mont de Milieu"
        },
        {
          "nom": "Chablis Vieilles Vignes",
          "note": "Vin généreux et direct, notes épicées et iodées portées par une acidité minérale.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chablis"
        },
        {
          "nom": "Petit Chablis",
          "note": "Élevé en cuve inox pour préserver la fraîcheur.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Petit Chablis"
        }
      ],
      "ordre": 3,
      "photo": "images/d-jean-collet.jpg",
      "region": "Chablis",
      "surface": "40 ha",
      "village": "Chablis",
      "visible": true,
      "pratique": null,
      "vigneron": "Romain Collet (vigneron, 3e génération)",
      "fondation": "1954",
      "signature": "Chablis de terroir, précis et minéraux, des grands crus Valmur et Les Clos aux premiers crus des deux rives.",
      "sousRegion": null,
      "description": "Fondé en 1954 par Jean Collet, héritier d'une lignée de vignerons chablisiens remontant à 1792, le domaine exploite aujourd'hui une quarantaine d'hectares sur les deux rives du Serein, du Petit Chablis aux grands crus Valmur et Les Clos. Romain Collet, petit-fils du fondateur, a pris la relève en 2008 et a engagé une large part du vignoble en agriculture biologique; les grands crus et plusieurs premiers crus sont désormais certifiés, le reste étant en conversion. Les cuvées les plus tendues sont élevées en cuve, les climats plus denses en fûts et foudres sans bois neuf."
    },
    {
      "id": "henri-magnien",
      "nom": "Domaine Henri Magnien",
      "site": "http://www.henrimagnien.com",
      "vins": [
        {
          "nom": "Ruchottes-Chambertin",
          "note": "Vignes d'une cinquantaine d'années sur oolithe blanche et calcaire de Prémeaux.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Ruchottes-Chambertin Grand Cru"
        },
        {
          "nom": "Corton Les Grandes Lolières",
          "note": "Vignes presque centenaires sur calcaire à silex, parcelle ajoutée récemment en Côte de Beaune.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Corton Grand Cru Les Grandes Lolières"
        },
        {
          "nom": "Gevrey-Chambertin 1er Cru Les Cazetiers",
          "note": "Sept parcelles sur quatre types de sols, avec de vieilles vignes de Pinot Magnien.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin 1er Cru Les Cazetiers"
        },
        {
          "nom": "Gevrey-Chambertin 1er Cru Lavaux Saint-Jacques",
          "note": "Vignes d'une soixantaine d'années sur sol argilo-calcaire.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin 1er Cru Lavaux Saint-Jacques"
        },
        {
          "nom": "Gevrey-Chambertin 1er Cru Estournelles Saint-Jacques",
          "note": "Premier cru situé juste au-dessus de Lavaux Saint-Jacques, dans la combe de Lavaux.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin 1er Cru Estournelles Saint-Jacques"
        },
        {
          "nom": "Gevrey-Chambertin 1er Cru Champeaux",
          "note": "Vignes d'environ 35 ans.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin 1er Cru Champeaux"
        },
        {
          "nom": "Aloxe-Corton 1er Cru La Coutière",
          "note": "Exposition est, vignes de plus de 60 ans à 340 m d'altitude.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Aloxe-Corton 1er Cru La Coutière"
        },
        {
          "nom": "Gevrey-Chambertin Vieilles Vignes",
          "note": "Vignes plantées en 1915, dont du Pinot Magnien.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin"
        },
        {
          "nom": "Gevrey-Chambertin Champerrier",
          "note": "Lieu-dit, vignes de 55 ans sur calcaire à entroques et argiles ferrugineuses.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin"
        },
        {
          "nom": "Gevrey-Chambertin XV",
          "note": "Assemblage de quinze parcelles du village.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin"
        }
      ],
      "ordre": 4,
      "photo": "images/d-henri-magnien.jpg",
      "region": "Côte de Nuits",
      "surface": "8 ha",
      "village": "Gevrey-Chambertin",
      "visible": true,
      "pratique": null,
      "vigneron": "Charles Magnien (vigneron, 12e génération)",
      "fondation": "1987",
      "signature": "Pinots noirs de Gevrey-Chambertin fins et élégants, de Ruchottes-Chambertin aux premiers crus Cazetiers et Lavaux-Saint-Jacques.",
      "sousRegion": null,
      "description": "La famille Magnien est établie à Gevrey-Chambertin depuis 1656, et le domaine actuel a été constitué en 1987 par Henri Magnien avec son fils François et son petit-fils Charles. Charles Magnien dirige aujourd'hui les huit hectares répartis entre Gevrey-Chambertin et Corton et ne produit que des rouges de pinot noir, dont une sélection massale issue du Pinot Magnien, une mutation repérée dans les vignes familiales vers 1850. Macérations à froid, levures indigènes et bois neuf mesuré donnent des vins fins et élégants, fidèles à chaque climat."
    },
    {
      "id": "lucien-boillot",
      "nom": "Domaine Lucien Boillot",
      "site": null,
      "vins": [
        {
          "nom": "Gevrey-Chambertin 1er Cru Les Cherbaudes",
          "note": "Parcelle de 0,4 ha plantée en 1922 sur argilo-calcaire.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin 1er Cru Les Cherbaudes"
        },
        {
          "nom": "Gevrey-Chambertin 1er Cru Les Corbeaux",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin 1er Cru Les Corbeaux"
        },
        {
          "nom": "Gevrey-Chambertin 1er Cru La Perrière",
          "note": "Minuscule parcelle de 0,09 ha plantée en 1953, séparée du grand cru Mazis-Chambertin par un simple chemin.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin 1er Cru La Perrière"
        },
        {
          "nom": "Gevrey-Chambertin Les Evocelles",
          "note": "Lieu-dit du village traité avec le même soin que les premiers crus du domaine.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin"
        },
        {
          "nom": "Gevrey-Chambertin",
          "note": "Assemblage de vieilles vignes de plusieurs lieux-dits du village.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin"
        },
        {
          "nom": "Nuits-Saint-Georges 1er Cru Les Pruliers",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Nuits-Saint-Georges 1er Cru Les Pruliers"
        },
        {
          "nom": "Volnay 1er Cru Les Caillerets",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay 1er Cru Les Caillerets"
        },
        {
          "nom": "Volnay 1er Cru Les Angles",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay 1er Cru Les Angles"
        },
        {
          "nom": "Volnay 1er Cru Les Brouillards",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay 1er Cru Les Brouillards"
        },
        {
          "nom": "Pommard 1er Cru Les Croix Noires",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Pommard 1er Cru Les Croix Noires"
        }
      ],
      "ordre": 5,
      "photo": "images/d-lucien-boillot.jpg",
      "region": "Côte de Nuits",
      "surface": "7 ha",
      "village": "Gevrey-Chambertin",
      "visible": true,
      "pratique": null,
      "vigneron": "Pierre Boillot (vigneron, propriétaire)",
      "fondation": "années 1950",
      "signature": "Gevrey-Chambertin et Volnay de vieilles vignes, purs et sans artifice.",
      "sousRegion": null,
      "description": "Créé dans les années 1950 par Lucien Boillot, le domaine est dirigé depuis 2003 par son fils Pierre, qui a alors repris sa part des vignes familiales après la séparation d'avec son frère Louis. Un peu plus de sept hectares, dont 4,3 en Côte de Nuits autour de Gevrey-Chambertin et 2,8 en Côte de Beaune à Volnay, Pommard et Puligny-Montrachet, donnent une quinzaine d'appellations. Vendanges manuelles, égrappage, levures indigènes, extraction douce et élevage de 16 à 18 mois avec environ 30 % de bois neuf : Pierre Boillot recherche des vins transparents, purs et fins."
    },
    {
      "id": "amiot-fils",
      "nom": "Domaine Amiot & Fils",
      "site": "https://domaineamiotetfils.fr",
      "vins": [
        {
          "nom": "Clos de la Roche",
          "note": "Le grand cru emblématique de Morey-Saint-Denis, souvent cité comme le vin phare du domaine.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Clos de la Roche Grand Cru"
        },
        {
          "nom": "Charmes-Chambertin",
          "note": "Second grand cru du domaine, sur la commune voisine de Gevrey-Chambertin.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Charmes-Chambertin Grand Cru"
        },
        {
          "nom": "Morey-Saint-Denis 1er Cru Les Ruchots",
          "note": "Premier cru situé au sud du village, à la limite de Chambolle-Musigny.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Morey-Saint-Denis 1er Cru Les Ruchots"
        },
        {
          "nom": "Morey-Saint-Denis 1er Cru Les Millandes",
          "note": "Premier cru voisin du Clos de la Roche, sur le coteau central de Morey.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Morey-Saint-Denis 1er Cru Les Millandes"
        },
        {
          "nom": "Morey-Saint-Denis 1er Cru Aux Charmes",
          "note": "Premier cru situé au nord du village, dans le prolongement des Charmes de Gevrey.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Morey-Saint-Denis 1er Cru Aux Charmes"
        },
        {
          "nom": "Morey-Saint-Denis 1er Cru Les Blanchards",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Morey-Saint-Denis 1er Cru Les Blanchards"
        },
        {
          "nom": "Gevrey-Chambertin 1er Cru Les Combottes",
          "note": "Premier cru de Gevrey enclavé entre plusieurs grands crus, à la limite de Morey.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin 1er Cru Les Combottes"
        },
        {
          "nom": "Morey-Saint-Denis",
          "note": "Le village rouge du domaine, assemblage de parcelles autour de la maison familiale.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Morey-Saint-Denis"
        },
        {
          "nom": "Morey-Saint-Denis Blanc",
          "note": "Rare blanc de Morey-Saint-Denis, l'un des seuls villages de la Côte de Nuits à en produire.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Morey-Saint-Denis"
        },
        {
          "nom": "Bourgogne",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Bourgogne"
        }
      ],
      "ordre": 6,
      "photo": "images/d-amiot-fils.jpg",
      "region": "Côte de Nuits",
      "surface": "5 ha",
      "village": "Morey-Saint-Denis",
      "visible": true,
      "pratique": null,
      "vigneron": "Jean-Louis Amiot et Léon Amiot (père et fils, 10e et 11e générations)",
      "fondation": null,
      "signature": "Des Morey-Saint-Denis d'élégance et de générosité, vendangés à la main et élevés 16 à 18 mois en fût.",
      "sousRegion": null,
      "description": "Installée à Morey-Saint-Denis depuis dix générations, la famille Amiot cultive aujourd'hui environ 5 hectares répartis sur Morey, Gevrey-Chambertin et Chambolle-Musigny, dont deux grands crus. Jean-Louis Amiot, rejoint par son fils Léon en 2020, conduit un vignoble certifié HVE et en conversion vers l'agriculture biologique. Le domaine figure parmi les Vignerons de l'année 2026 du Guide Hachette des Vins."
    },
    {
      "id": "robert-groffier",
      "nom": "Domaine Robert Groffier",
      "site": null,
      "vins": [
        {
          "nom": "Chambertin-Clos de Bèze Grand Cru",
          "note": "Parcelle d'environ 0,42 ha de vignes plus que centenaires, élevée le plus souvent en fût neuf.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Chambertin-Clos de Bèze Grand Cru"
        },
        {
          "nom": "Chambertin Grand Cru",
          "note": "Haut de la parcelle du Clos de Bèze, vinifié à part sous l'appellation Chambertin depuis 2022.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Chambertin Grand Cru"
        },
        {
          "nom": "Bonnes-Mares Grand Cru",
          "note": "Près d'un hectare de vieilles vignes, avec une cuvée séparée Les Terres Blanches depuis 2022.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Bonnes-Mares Grand Cru"
        },
        {
          "nom": "Chambolle-Musigny 1er Cru Les Amoureuses",
          "note": "Environ un hectare, la plus grande propriété privée du climat, désormais scindé en deux cuvées selon le sol, argiles et sables.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Chambolle-Musigny 1er Cru Les Amoureuses"
        },
        {
          "nom": "Chambolle-Musigny 1er Cru Les Hauts Doix",
          "note": "Un hectare de vignes d'environ 80 ans, première parcelle vendangée chaque année.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Chambolle-Musigny 1er Cru Les Hauts Doix"
        },
        {
          "nom": "Chambolle-Musigny 1er Cru Les Sentiers",
          "note": "Premier cru situé juste sous Bonnes-Mares, à la limite de Morey-Saint-Denis.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Chambolle-Musigny 1er Cru Les Sentiers"
        },
        {
          "nom": "Gevrey-Chambertin Les Seuvrées",
          "note": "Lieu-dit de Gevrey-Chambertin, élevé avec une faible proportion de bois neuf.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin"
        },
        {
          "nom": "Bourgogne Côte d'Or Pinot Noir",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Bourgogne Côte d'Or"
        }
      ],
      "ordre": 7,
      "photo": "images/d-robert-groffier.jpg",
      "region": "Côte de Nuits",
      "surface": "8 ha",
      "village": "Morey-Saint-Denis",
      "visible": true,
      "pratique": "lutte raisonnée",
      "vigneron": "Nicolas Groffier (vigneron, 4e génération)",
      "fondation": "années 1950",
      "signature": "Chambolle-Musigny dans toute sa sensualité, entre parfum floral, fruit éclatant et texture soyeuse.",
      "sousRegion": null,
      "description": "Constitué dans les années 1950 par Jules Groffier, le domaine s'étend sur un peu moins de 8 hectares, avec son cœur à Chambolle-Musigny où la famille est le plus grand propriétaire privé des Amoureuses. Nicolas Groffier, quatrième génération, signe les vins depuis le millésime 2004 en adaptant la part de vendange entière et de bois neuf à chaque année. Depuis 2022, plusieurs parcelles sont vinifiées séparément pour isoler l'expression de chaque sol."
    },
    {
      "id": "felettig",
      "nom": "Domaine Felettig",
      "site": "https://www.domainefelettig.com",
      "vins": [
        {
          "nom": "Echezeaux Grand Cru",
          "note": "Le grand cru de la Côte de Nuits du domaine, sur la commune de Flagey-Échezeaux.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Échezeaux Grand Cru"
        },
        {
          "nom": "Corton Grand Cru Les Grandes Lolières",
          "note": "Seul grand cru rouge de la Côte de Beaune, sur le versant est de la colline de Corton.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Corton Grand Cru"
        },
        {
          "nom": "Chambolle-Musigny 1er Cru Les Charmes",
          "note": "Premier cru situé au sud du village, sous Les Amoureuses.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Chambolle-Musigny 1er Cru Les Charmes"
        },
        {
          "nom": "Chambolle-Musigny 1er Cru Les Fuées",
          "note": "Premier cru au nord du village, dans le prolongement de Bonnes-Mares.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Chambolle-Musigny 1er Cru Les Fuées"
        },
        {
          "nom": "Chambolle-Musigny 1er Cru Les Feusselottes",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Chambolle-Musigny 1er Cru Les Feusselottes"
        },
        {
          "nom": "Chambolle-Musigny 1er Cru Les Combottes",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Chambolle-Musigny 1er Cru Les Combottes"
        },
        {
          "nom": "Vosne-Romanée 1er Cru Les Reignots",
          "note": "Premier cru en haut de coteau, juste au-dessus de La Romanée.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Vosne-Romanée 1er Cru Les Reignots"
        },
        {
          "nom": "Nuits-Saint-Georges 1er Cru Les Terres Blanches",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Nuits-Saint-Georges 1er Cru Les Terres Blanches"
        },
        {
          "nom": "Chambolle-Musigny Vieilles vignes",
          "note": "Le village de référence du domaine, issu de vieilles vignes de plusieurs parcelles.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Chambolle-Musigny"
        },
        {
          "nom": "Bourgogne Hautes Côtes de Nuits",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Bourgogne Hautes Côtes de Nuits"
        }
      ],
      "ordre": 8,
      "photo": "images/d-felettig.jpg",
      "region": "Côte de Nuits",
      "surface": "13 ha",
      "village": "Chambolle-Musigny",
      "visible": true,
      "pratique": "lutte raisonnée",
      "vigneron": "Gilbert Felettig et Christine Felettig (frère et sœur, 3e génération)",
      "fondation": "1993",
      "signature": "Des Chambolle-Musigny purs, vibrants et élégants, portés par la fraîcheur et une pointe saline.",
      "sousRegion": null,
      "description": "Fondé par les parents d'Henri Felettig, qui vinifie lui-même depuis 1969, le domaine a pris sa forme actuelle en 1993 lorsque Christine et Gilbert ont rejoint leurs parents. Il compte aujourd'hui 13 hectares répartis sur une centaine de parcelles, de Gevrey-Chambertin à Beaune, dont sept premiers crus de Chambolle-Musigny. Les vins sont élevés 14 à 18 mois en fût, avec une part de bois neuf mesurée."
    },
    {
      "id": "edouard-confuron",
      "nom": "Domaine Edouard Confuron",
      "site": null,
      "vins": [
        {
          "nom": "Vosne-Romanée Les Hautes Maizières",
          "note": "Parcelle issue des terres familiales d'origine, qui donne un vin épicé, complexe et serré en finale.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Vosne-Romanée"
        },
        {
          "nom": "Vosne-Romanée Le Pré de la Folie",
          "note": "Cuvée en vendange entière au toucher velouté et à la longue persistance.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Vosne-Romanée"
        },
        {
          "nom": "Gevrey-Chambertin Les Seuvrées",
          "note": "Lieu-dit au sud de Gevrey-Chambertin, à la limite de Morey-Saint-Denis.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Gevrey-Chambertin"
        },
        {
          "nom": "Nuits-Saint-Georges Aux Allots",
          "note": "Parcelle exploitée en fermage, du côté de Vosne-Romanée.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Nuits-Saint-Georges"
        },
        {
          "nom": "Bourgogne Pinot Noir",
          "note": "Vinifié avec une part de vendange entière, vif et tendu.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Bourgogne"
        },
        {
          "nom": "Coteaux Bourguignons",
          "note": "Cuvée d'entrée de gamme vinifiée presque entièrement en grappes entières.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Coteaux Bourguignons"
        },
        {
          "nom": "Bourgogne Aligoté",
          "note": null,
          "cepage": "Aligoté",
          "couleur": "blanc",
          "appellation": "Bourgogne Aligoté"
        }
      ],
      "ordre": 9,
      "photo": "images/d-edouard-confuron.jpg",
      "region": "Côte de Nuits",
      "surface": "1,5 ha",
      "village": "Vosne-Romanée",
      "visible": true,
      "pratique": null,
      "vigneron": "Edouard Confuron (vigneron, fondateur)",
      "fondation": "2021",
      "signature": "Une jeune signature de Vosne-Romanée, entre vendange entière, infusion douce et fruit lumineux.",
      "sousRegion": null,
      "description": "Fils de François Confuron-Gindre, Edouard Confuron a créé son propre domaine en 2021 tout en poursuivant le travail au domaine familial de Vosne-Romanée. Sur 1,5 hectare répartis entre Vosne-Romanée, Gevrey-Chambertin et Nuits-Saint-Georges, il vinifie en vendange entière et avec très peu de soufre, en privilégiant l'infusion plutôt que l'extraction. Le vignoble est conduit en agriculture biologique, sans certification à ce jour."
    },
    {
      "id": "jean-marc-millot",
      "nom": "Domaine Jean-Marc Millot",
      "site": "https://www.jean-marc-millot.com",
      "vins": [
        {
          "nom": "Grands Échézeaux Grand Cru",
          "note": "Le plus prestigieux des grands crus du domaine, voisin du Clos de Vougeot.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Grands Échézeaux Grand Cru"
        },
        {
          "nom": "Échézeaux",
          "note": "Grand cru de Flagey-Échezeaux, dans la famille depuis la fin des années 1980.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Échézeaux Grand Cru"
        },
        {
          "nom": "Échézeaux du Dessus",
          "note": "Parcelle vinifiée à part, sur le haut du grand cru.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Échézeaux Grand Cru"
        },
        {
          "nom": "Clos de Vougeot « Grand Maupertui »",
          "note": "Parcelle du haut du Clos, dans le secteur du Grand Maupertui.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Clos de Vougeot Grand Cru"
        },
        {
          "nom": "Vosne Romanée 1er Cru « Les Suchots »",
          "note": "Premier cru de référence du domaine, entre Échézeaux et Romanée-Saint-Vivant.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Vosne-Romanée 1er Cru Les Suchots"
        },
        {
          "nom": "Vosne Romanée",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Vosne-Romanée"
        },
        {
          "nom": "Côte de Nuits « Vieilles Vignes »",
          "note": "Cuvée de vieilles vignes, appellation historique du domaine.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Côte de Nuits-Villages"
        },
        {
          "nom": "Côte de Nuits « Les Faulques »",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Côte de Nuits-Villages"
        },
        {
          "nom": "Bourgogne Pinot Noir",
          "note": null,
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Bourgogne"
        },
        {
          "nom": "Aligoté",
          "note": "Cuvée nature en vendange entière, élevée en amphore, produite à 580 bouteilles sur 0,11 ha.",
          "cepage": "Aligoté",
          "couleur": "blanc",
          "appellation": "Bourgogne Aligoté"
        }
      ],
      "ordre": 10,
      "photo": "images/d-jean-marc-millot.jpg",
      "region": "Côte de Nuits",
      "surface": "8 ha",
      "village": "Nuits-Saint-Georges",
      "visible": true,
      "pratique": null,
      "vigneron": "Alix Millot (vigneronne, fille de Jean-Marc Millot)",
      "fondation": null,
      "signature": "Pureté du fruit, fraîcheur et texture soyeuse, dans le respect de chaque terroir.",
      "sousRegion": null,
      "description": "Installé à Nuits-Saint-Georges, le domaine cultive 8 hectares en Côte de Nuits, dont un parcellaire remarquable autour de Vosne-Romanée et de Flagey-Échezeaux avec trois grands crus. Alix Millot, qui a rejoint son père Jean-Marc en 2014, dirige aujourd'hui la maison et y mène des essais de vins nature et d'élevage en amphore. Le vignoble est conduit en agriculture biologique, sans certification officielle."
    },
    {
      "id": "gerard-julien",
      "nom": "Domaine Gérard Julien",
      "site": "http://www.domaine-julien.fr/",
      "vins": [
        {
          "nom": "Échezeaux Grand Cru",
          "note": "Marnes, limons rouges et cailloutis calcaires; environ 1 000 bouteilles par an, le sommet de la gamme.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Échezeaux Grand Cru"
        },
        {
          "nom": "Nuits-Saint-Georges 1er Cru Les Bousselots",
          "note": "Limons et cailloutis calcaires sur le versant nord de Nuits, le seul premier cru du domaine.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Nuits-Saint-Georges 1er Cru Les Bousselots"
        },
        {
          "nom": "Nuits-Saint-Georges Aux Saints-Juliens",
          "note": "Lieu-dit de 0,60 ha en sols limoneux et cailloutis calcaires, isolé en cuvée parcellaire.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Nuits-Saint-Georges Aux Saints-Juliens"
        },
        {
          "nom": "Nuits-Saint-Georges",
          "note": "Assemblage de quatre climats villages (Longecourts, Maladières, Fleurières, Charbonnières) sur 1,30 ha.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Nuits-Saint-Georges"
        },
        {
          "nom": "Aloxe-Corton Les Valozières",
          "note": "Seule appellation de Côte de Beaune du domaine, 0,60 ha au pied de la colline de Corton.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Aloxe-Corton Les Valozières"
        },
        {
          "nom": "Côte de Nuits-Villages",
          "note": "Cœur du domaine avec 5,50 ha répartis sur huit climats de Comblanchien, dont Les Loges, Les Essarts et Les Retraits.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Côte de Nuits-Villages"
        },
        {
          "nom": "Bourgogne Pinot Noir",
          "note": "Argiles et calcaires, entrée de gamme gourmande du domaine.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Bourgogne"
        },
        {
          "nom": "Bourgogne Aligoté",
          "note": "0,45 ha sur marne blanche et calcaire, le seul blanc de la maison.",
          "cepage": "Aligoté",
          "couleur": "blanc",
          "appellation": "Bourgogne Aligoté"
        }
      ],
      "ordre": 11,
      "photo": "images/d-gerard-julien.jpg",
      "region": "Côte de Nuits",
      "surface": "9,55 ha",
      "village": "Comblanchien",
      "visible": true,
      "pratique": null,
      "vigneron": "Étienne Julien (vigneron, cinquième génération)",
      "fondation": "1882",
      "signature": "Des pinots noirs de Côte de Nuits axés sur le fruit rouge, la finesse et des tanins fondus.",
      "sousRegion": null,
      "description": "Installée à Comblanchien, juste au sud de Nuits-Saint-Georges, la famille Julien cultive la vigne depuis cinq générations, depuis les premières parcelles acquises par François-Xavier Julien. Étienne Julien conduit le domaine depuis le millésime 2012 et a fait évoluer les pratiques vers une viticulture plus respectueuse des sols, sans certification. Le cœur du vignoble est l'appellation Côte de Nuits-Villages, complétée par des parcelles à Nuits-Saint-Georges, à Aloxe-Corton et par un rare Échezeaux Grand Cru."
    },
    {
      "id": "camille-thiriet",
      "nom": "Domaine Camille Thiriet",
      "site": "https://domainecamillethiriet.com/",
      "vins": [
        {
          "nom": "Le Clos Magny",
          "note": "Première vigne en propre du domaine, la parcelle la plus haute à 320 m d'altitude sur une mosaïque de sols rocheux.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Côte de Nuits-Villages"
        },
        {
          "nom": "La Robignotte",
          "note": "Monopole de 0,60 ha sous La Montagne, argilo-calcaire profond veiné de marnes bleues; cerise noire et violette.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Côte de Nuits-Villages"
        },
        {
          "nom": "La Montagne",
          "note": "Vignes de 60 ans à 280 m d'altitude sur les coteaux de Corgoloin; expression aérienne et fine.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Côte de Nuits-Villages"
        },
        {
          "nom": "Aux Montagnes",
          "note": "Vignes de 70 ans à Comblanchien sur calcaire rocheux peu profond; fraîcheur et minéralité.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Côte de Nuits-Villages"
        },
        {
          "nom": "Cuvée Deslandes",
          "note": "Assemblage des parcelles Le Creux de Sobron et Les Grandes Vignes, avec environ la moitié de vendange entière.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Côte de Nuits-Villages"
        },
        {
          "nom": "Les Retraits",
          "note": "Vignes de 50 ans voisines du Clos de la Maréchale, argilo-calcaire classique de la Côte de Nuits.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Côte de Nuits-Villages"
        },
        {
          "nom": "Les Blanches",
          "note": "Vieilles vignes de 90 ans à Pommard sur argiles très blanches; puissance et délicatesse.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Bourgogne"
        },
        {
          "nom": "En la Place",
          "note": "Vignes de 90 ans à Corgoloin sur sols sablo-argileux; bouquet floral de rose et fraise des bois.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Bourgogne"
        },
        {
          "nom": "La Montagne Blanc",
          "note": "Petite parcelle de 0,19 ha à Corgoloin, élevée dix mois en fûts; profil minéral.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Côte de Nuits-Villages"
        },
        {
          "nom": "Aligoté du Jardin",
          "note": "Trois vieilles parcelles de Meursault, Corgoloin et Comblanchien, élevées dix mois en fûts.",
          "cepage": "Aligoté",
          "couleur": "blanc",
          "appellation": "Bourgogne Aligoté"
        }
      ],
      "ordre": 12,
      "photo": "images/d-camille-thiriet.jpg",
      "region": "Côte de Nuits",
      "surface": "6 ha",
      "village": "Corgoloin",
      "visible": true,
      "pratique": null,
      "vigneron": "Camille Thiriet et Matt Chittick (cofondateurs; Matt Chittick, vinificateur)",
      "fondation": "2016",
      "signature": "Des pinots noirs aériens et digestes qui réhabilitent le sud de la Côte de Nuits.",
      "sousRegion": null,
      "description": "Fondé en 2016 à Corgoloin par Camille Thiriet et l'œnologue canadien Matt Chittick, le domaine a d'abord été un micro-négoce vinifié dans un garage, avant d'acquérir ses premières vignes en 2021 puis de reprendre le Domaine Gilles Jourdan en 2022. Il travaille aujourd'hui près de six hectares, surtout en Côte de Nuits-Villages, sur les terroirs discrets de Corgoloin et de Comblanchien. Vinifications parcellaires, infusions douces, une partie des vignes labourées au cheval, sans revendiquer d'étiquette bio ou nature."
    },
    {
      "id": "y-clerget",
      "nom": "Domaine Y. Clerget",
      "site": "https://www.domaine-clerget.com",
      "vins": [
        {
          "nom": "Clos de Vougeot Grand Cru",
          "note": "0,40 ha dans le secteur Grand Maupertui, vignes de plus de 40 ans.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Clos de Vougeot Grand Cru"
        },
        {
          "nom": "Pommard 1er Cru Les Rugiens-Hauts",
          "note": "Un hectare en deux parcelles sur sols rocheux riches en oxyde de fer.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Pommard 1er Cru Les Rugiens"
        },
        {
          "nom": "Volnay 1er Cru Clos du Verseuil",
          "note": "Monopole de 0,68 ha acheté en 1936, cuvée emblématique du domaine.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay 1er Cru Clos du Verseuil"
        },
        {
          "nom": "Volnay 1er Cru Les Caillerets",
          "note": "0,37 ha de vignes de plus de 50 ans sur argilo-calcaire, l'un des climats les plus réputés de Volnay.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay 1er Cru Les Caillerets"
        },
        {
          "nom": "Volnay 1er Cru Carelle sous la Chapelle",
          "note": "0,65 ha exposés sud-est, vignes de plus de 45 ans.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay 1er Cru Carelle sous la Chapelle"
        },
        {
          "nom": "Volnay 1er Cru Les Santenots",
          "note": "0,68 ha sur la commune de Meursault, vinifié avec une forte proportion de vendange entière.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay 1er Cru Les Santenots"
        },
        {
          "nom": "Volnay 1er Cru Champans",
          "note": "Cuvée apparue avec les parcelles récemment ajoutées au domaine.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay 1er Cru Champans"
        },
        {
          "nom": "Volnay 1er Cru Les Mitans",
          "note": "Cuvée apparue avec les parcelles récemment ajoutées au domaine.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay 1er Cru Les Mitans"
        },
        {
          "nom": "Volnay",
          "note": "1,09 ha de vignes de plus de 45 ans, entièrement éraflé.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay"
        },
        {
          "nom": "Meursault Les Chevalières",
          "note": "0,37 ha de vignes de 40 ans, l'unique blanc du domaine.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault Les Chevalières"
        }
      ],
      "ordre": 13,
      "photo": "images/d-y-clerget.jpg",
      "region": "Côte de Beaune",
      "surface": "10 ha",
      "village": "Pommard",
      "visible": true,
      "pratique": null,
      "vigneron": "Thibaud Clerget (vigneron, 28e génération)",
      "fondation": "1268",
      "signature": "Des Volnay de haute précision, macérations à froid, levures indigènes et extractions douces.",
      "sousRegion": null,
      "description": "La famille Clerget est établie à Volnay depuis 1268, soit vingt-huit générations de vignerons. Après une parenthèse où les raisins étaient vendus à Henri Boillot, Thibaud Clerget a relancé la mise en bouteille au domaine avec le millésime 2015, à 24 ans, au sortir de ses années chez Boillot et Hudelot-Noëllat. Établi à Pommard, le domaine réunit une dizaine d'hectares à Volnay, Pommard, Meursault et Vougeot, dont le monopole Clos du Verseuil acquis en 1936."
    },
    {
      "id": "nicolas-rossignol",
      "nom": "Domaine Nicolas Rossignol",
      "site": "https://www.nicolas-rossignol.com",
      "vins": [
        {
          "nom": "Volnay 1er Cru Caillerets",
          "note": "Le climat de référence de Volnay, sur argiles rouges et calcaire; la cuvée la plus recherchée du domaine.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay 1er Cru Les Caillerets"
        },
        {
          "nom": "Volnay 1er Cru Taillepieds",
          "note": "Coteau pentu et caillouteux au-dessus du village, réputé pour sa tension.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay 1er Cru Taillepieds"
        },
        {
          "nom": "Volnay 1er Cru Santenots",
          "note": "Climat situé sur Meursault mais rattaché à Volnay pour les rouges, profil plus charnu.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay 1er Cru Santenots"
        },
        {
          "nom": "Volnay 1er Cru Clos des Angles",
          "note": "Premier cru du bas de coteau, en limite de Pommard.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay 1er Cru Clos des Angles"
        },
        {
          "nom": "Volnay 1er Cru Fremiets",
          "note": "Climat voisin de Pommard, à la fois structuré et parfumé.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay 1er Cru Fremiets"
        },
        {
          "nom": "Pommard 1er Cru Épenots",
          "note": "Grand climat de Pommard côté Beaune, réputé pour son velouté.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Pommard 1er Cru Les Épenots"
        },
        {
          "nom": "Pommard 1er Cru Jarolières",
          "note": "Climat côté Volnay, l'un des Pommard les plus fins du domaine.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Pommard 1er Cru Les Jarolières"
        },
        {
          "nom": "Pommard 1er Cru Chanlins",
          "note": "Haut de coteau côté Volnay, sols maigres et calcaires.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Pommard 1er Cru Les Chanlins"
        },
        {
          "nom": "Beaune 1er Cru Clos des Mouches",
          "note": "Climat célèbre au sud de Beaune, versant rouge.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Beaune 1er Cru Clos des Mouches"
        },
        {
          "nom": "Volnay",
          "note": "Assemblage de cinq parcelles villages, dont des argiles rouges sous Caillerets et des sols blancs plus frais à La Bouchère.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Volnay"
        }
      ],
      "ordre": 14,
      "photo": "images/d-nicolas-rossignol.jpg",
      "region": "Côte de Beaune",
      "surface": "17 ha",
      "village": "Volnay",
      "visible": true,
      "pratique": "lutte raisonnée",
      "vigneron": "Nicolas Rossignol (vigneron, cinquième génération)",
      "fondation": "1997",
      "signature": "Une lecture parcellaire de Volnay et de Pommard, sept et huit premiers crus côte à côte.",
      "sousRegion": null,
      "description": "Cinquième génération de vignerons à Volnay, Nicolas Rossignol a créé son domaine en 1997 avec trois hectares, après des expériences à Châteauneuf-du-Pape, à Bordeaux et en Afrique du Sud, avant de le porter à 17 hectares répartis sur une trentaine d'appellations de la Côte de Beaune. Chaque parcelle est vinifiée séparément, en levures indigènes, sans collage ni filtration, avec des infusions plutôt que des extractions depuis 2002. La viticulture est raisonnée et s'inspire de la biodynamie, sans désherbant chimique ni certification."
    },
    {
      "id": "jobard-morey",
      "nom": "Domaine Jobard-Morey",
      "site": null,
      "vins": [
        {
          "nom": "Meursault 1er Cru Charmes",
          "note": "0,33 ha dans l'un des premiers crus les plus réputés de Meursault, côté Puligny.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault 1er Cru Les Charmes"
        },
        {
          "nom": "Meursault 1er Cru Poruzot",
          "note": "0,50 ha au centre de la commune, premier cru à la fois riche et tendu.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault 1er Cru Le Poruzot"
        },
        {
          "nom": "Meursault Les Narvaux",
          "note": "0,83 ha sur ce lieu-dit réputé du haut du coteau, aux sols maigres et calcaires.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault Les Narvaux"
        },
        {
          "nom": "Meursault Les Tillets",
          "note": "0,45 ha sur un lieu-dit d'altitude, apprécié pour sa fraîcheur.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault Les Tillets"
        },
        {
          "nom": "Meursault",
          "note": "0,55 ha de vignes villages, cuvée d'entrée dans l'univers du domaine.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault"
        },
        {
          "nom": "Meursault Rouge",
          "note": "Un Meursault rouge devenu rare, que le domaine continue de produire.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Meursault"
        },
        {
          "nom": "Bourgogne Blanc",
          "note": "Petite parcelle située derrière le Clos des Perrières, à Meursault.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Bourgogne"
        },
        {
          "nom": "Bourgogne Aligoté",
          "note": null,
          "cepage": "Aligoté",
          "couleur": "blanc",
          "appellation": "Bourgogne Aligoté"
        }
      ],
      "ordre": 15,
      "photo": "images/d-jobard-morey.jpg",
      "region": "Côte de Beaune",
      "surface": "5,5 ha",
      "village": "Meursault",
      "visible": true,
      "pratique": null,
      "vigneron": "Valentin Jobard (vigneron)",
      "fondation": "1949",
      "signature": "Des Meursault de vieilles vignes, riches mais tendus, encore confidentiels.",
      "sousRegion": null,
      "description": "Fondé en 1949 à Meursault, le domaine est né de l'union d'un Jobard et d'une Morey au lendemain de la Seconde Guerre mondiale. Valentin Jobard, cousin d'Antoine et de Rémi Jobard et formé chez Vincent Dureuil-Janthial puis Bernard Bouvier, s'y est impliqué dès 2013 et en a pris la direction en 2016. Ses quelque 5,5 hectares, plantés pour une bonne part de vieilles vignes d'après-guerre, se concentrent sur Meursault, avec les premiers crus Charmes et Poruzot et les lieux-dits Les Narvaux et Les Tillets, élevés en fûts avec un bois neuf mesuré."
    },
    {
      "id": "tessier",
      "nom": "Domaine Tessier",
      "site": null,
      "vins": [
        {
          "nom": "Meursault 1er Cru Les Charmes Dessus",
          "note": "Parcelle située dans la partie haute des Charmes, voisine de celle des Comtes Lafon.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault 1er Cru Les Charmes"
        },
        {
          "nom": "Meursault 1er Cru Les Genevrières",
          "note": "Le domaine détient une parcelle dans les Genevrières Dessus, l'un des climats les plus réputés de Meursault.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault 1er Cru Les Genevrières"
        },
        {
          "nom": "Meursault 1er Cru Le Poruzot Dessus",
          "note": "Partie supérieure du climat Poruzot, sur le coteau de Meursault.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault 1er Cru Le Poruzot"
        },
        {
          "nom": "Meursault Les Casse-Têtes",
          "note": "Lieu-dit de village vinifié séparément.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault"
        },
        {
          "nom": "Meursault Les Grands Charrons",
          "note": "Lieu-dit de village vinifié séparément.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault"
        },
        {
          "nom": "Meursault",
          "note": null,
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault"
        },
        {
          "nom": "Bourgogne Blanc Champ Perrier",
          "note": "Chardonnay issu du lieu-dit Champ Perrier.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Bourgogne"
        },
        {
          "nom": "Bourgogne Blanc Herbeux",
          "note": null,
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Bourgogne"
        }
      ],
      "ordre": 16,
      "photo": "images/d-tessier.jpg",
      "region": "Côte de Beaune",
      "surface": "7,5 ha",
      "village": "Meursault",
      "visible": true,
      "pratique": null,
      "vigneron": "Arnaud Tessier (vigneron, propriétaire)",
      "fondation": "2007",
      "signature": "Des meursaults de terroir, précis et équilibrés, qui privilégient la retenue à la démonstration.",
      "sousRegion": null,
      "description": "Installé au coeur du village de Meursault, Arnaud Tessier reprend les vignes familiales à la mort de son père et met en bouteille ses propres vins à partir de 2007, alors que le raisin était auparavant vendu au négoce. Il cultive 7,5 hectares selon les pratiques de l'agriculture biologique, sans certification, avec des rendements maîtrisés par l'ébourgeonnage. Les vins fermentent avec des levures indigènes et profitent d'un élevage long et lent."
    },
    {
      "id": "pernot-belicard",
      "nom": "Domaine Pernot-Bélicard",
      "site": null,
      "vins": [
        {
          "nom": "Bâtard-Montrachet Grand Cru",
          "note": null,
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Bâtard-Montrachet Grand Cru"
        },
        {
          "nom": "Bienvenues-Bâtard-Montrachet Grand Cru",
          "note": null,
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Bienvenues-Bâtard-Montrachet Grand Cru"
        },
        {
          "nom": "Puligny-Montrachet 1er Cru Champ Canet",
          "note": "Petite parcelle sur argile, calcaire et graviers, située au-dessus des Combettes; élevage de 15 mois en fût.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Puligny-Montrachet 1er Cru Champ Canet"
        },
        {
          "nom": "Puligny-Montrachet 1er Cru Perrières",
          "note": "Vignes de plus de 60 ans sur calcaire jurassique dur, voisines des Referts, pour un vin précis et pierreux.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Puligny-Montrachet 1er Cru Les Perrières"
        },
        {
          "nom": "Puligny-Montrachet 1er Cru Champ Gain",
          "note": "Climat haut sur le coteau, autrefois boisé.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Puligny-Montrachet 1er Cru Champ Gain"
        },
        {
          "nom": "Meursault 1er Cru Perrières",
          "note": null,
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault 1er Cru Les Perrières"
        },
        {
          "nom": "Beaune 1er Cru Pertuisots Blanc",
          "note": null,
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Beaune 1er Cru Les Pertuisots"
        },
        {
          "nom": "Puligny-Montrachet Composition Parcellaire",
          "note": "Assemblage de huit parcelles de village, dont Les Houlières, La Rue aux Vaches et Les Boudrières, sur argile brune et calcaire.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Puligny-Montrachet"
        },
        {
          "nom": "Meursault Vieilles Vignes",
          "note": null,
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault"
        },
        {
          "nom": "Bourgogne Côte d'Or Chardonnay",
          "note": null,
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Bourgogne Côte d'Or"
        }
      ],
      "ordre": 17,
      "photo": "images/d-pernot-belicard.jpg",
      "region": "Côte de Beaune",
      "surface": "6,5 ha",
      "village": "Puligny-Montrachet",
      "visible": true,
      "pratique": null,
      "vigneron": "Philippe Pernot (vigneron, propriétaire)",
      "fondation": "2009",
      "signature": "Des blancs de Puligny classiques, précis et minéraux, vendangés tôt pour préserver la fraîcheur.",
      "sousRegion": null,
      "description": "Petit-fils de Paul Pernot, Philippe Pernot fonde le domaine en 2009 après son mariage avec la fille de la famille Bélicard, qui possédait des vignes à Puligny-Montrachet. Le domaine réunit ainsi des parcelles des deux familles, à Puligny et à Meursault, sur environ 6,5 hectares travaillés à la main, avec un ébourgeonnage sévère et un soin particulier porté aux vieilles vignes. Les blancs sont élevés en fût puis affinés quelques mois en cuve sur lies fines."
    },
    {
      "id": "armand-heitz",
      "nom": "Domaine Armand Heitz",
      "site": "https://www.armandheitz.com",
      "vins": [
        {
          "nom": "Chassagne-Montrachet 1er Cru Chenevottes",
          "note": "Discret dans sa jeunesse, il s'ouvre généreusement après un ou deux ans; élevage de 11 mois avec 20 à 40 % de fûts neufs.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chassagne-Montrachet 1er Cru Les Chenevottes"
        },
        {
          "nom": "Chassagne-Montrachet 1er Cru Morgeot",
          "note": "Sols de marnes calcaires au sud de Chassagne; un blanc ample à la texture crémeuse, équilibré par une belle salinité.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chassagne-Montrachet 1er Cru Morgeot"
        },
        {
          "nom": "Meursault 1er Cru Perrières",
          "note": "L'un des climats les plus réputés de Meursault, pour un vin puissant et intense.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault 1er Cru Les Perrières"
        },
        {
          "nom": "Meursault La Barre",
          "note": "Lieu-dit de village qui privilégie la fraîcheur et la pureté du fruit.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Meursault"
        },
        {
          "nom": "Saint-Aubin 1er Cru Murgers des Dents de Chien",
          "note": "Climat de haut de coteau, voisin de Chevalier-Montrachet.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Saint-Aubin 1er Cru Murgers des Dents de Chien"
        },
        {
          "nom": "Pommard 1er Cru Arvelets",
          "note": null,
          "cepage": "Pinot Noir",
          "couleur": "rouge",
          "appellation": "Pommard 1er Cru Les Arvelets"
        },
        {
          "nom": "Beaune 1er Cru Boucherottes",
          "note": "Parcelle à faibles rendements, vinifiée en vendange entière, 14 mois d'élevage avec 20 % de fûts neufs.",
          "cepage": "Pinot Noir",
          "couleur": "rouge",
          "appellation": "Beaune 1er Cru Les Boucherottes"
        },
        {
          "nom": "Santenay 1er Cru La Comme",
          "note": null,
          "cepage": "Pinot Noir",
          "couleur": "rouge",
          "appellation": "Santenay 1er Cru La Comme"
        },
        {
          "nom": "Morey-Saint-Denis 1er Cru Monts Luisants",
          "note": null,
          "cepage": "Pinot Noir",
          "couleur": "rouge",
          "appellation": "Morey-Saint-Denis 1er Cru Les Monts Luisants"
        },
        {
          "nom": "Bourgogne Aligoté",
          "note": null,
          "cepage": "Aligoté",
          "couleur": "blanc",
          "appellation": "Bourgogne Aligoté"
        }
      ],
      "ordre": 18,
      "photo": "images/d-armand-heitz.jpg",
      "region": "Côte de Beaune",
      "surface": "20 ha",
      "village": "Chassagne-Montrachet",
      "visible": true,
      "pratique": null,
      "vigneron": "Armand Heitz (vigneron, propriétaire)",
      "fondation": "1857",
      "signature": "Le terroir sans filtre: des vins vivants, nés d'une viticulture régénératrice.",
      "sousRegion": null,
      "description": "Héritier d'une lignée de vignerons remontant à 1857, Armand Heitz reprend en 2011 les vignes familiales de Chassagne-Montrachet, jusque-là louées à la maison Drouhin, après des études d'oenologie à Changins, en Suisse. Après quelques années en biodynamie, il oriente le domaine vers l'agroécologie et la permaculture: couverts végétaux, arbres entre les parcelles, paillage et élevage intégré. Les vinifications restent peu interventionnistes, avec levures indigènes et une large part de vendange entière pour les rouges."
    },
    {
      "id": "coffinet-duvernay",
      "nom": "Domaine Coffinet-Duvernay",
      "site": null,
      "vins": [
        {
          "nom": "Bâtard-Montrachet Grand Cru",
          "note": "Argilo-calcaire du Jurassique; un vin riche et profond, aux notes de miel, de fleurs blanches et de sous-bois.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Bâtard-Montrachet Grand Cru"
        },
        {
          "nom": "Chassagne-Montrachet 1er Cru Les Caillerets",
          "note": "L'un des climats les plus réputés de Chassagne pour les blancs.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chassagne-Montrachet 1er Cru Les Caillerets"
        },
        {
          "nom": "Chassagne-Montrachet 1er Cru Les Blanchots Dessus",
          "note": "Premier cru voisin du Montrachet, qui donne un vin puissant.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chassagne-Montrachet 1er Cru Blanchot Dessus"
        },
        {
          "nom": "Chassagne-Montrachet 1er Cru Morgeot Les Grands Clos",
          "note": "Un vin riche et ample, dans le style généreux des Morgeot.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chassagne-Montrachet 1er Cru Morgeot"
        },
        {
          "nom": "Chassagne-Montrachet 1er Cru Les Fairendes",
          "note": "Vignes d'environ 85 ans, aux notes fumées et de fenouil.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chassagne-Montrachet 1er Cru Les Fairendes"
        },
        {
          "nom": "Chassagne-Montrachet 1er Cru La Maltroie",
          "note": "Un vin intense, d'une élégance fraîche.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chassagne-Montrachet 1er Cru La Maltroie"
        },
        {
          "nom": "Chassagne-Montrachet 1er Cru Dent de Chien",
          "note": null,
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chassagne-Montrachet 1er Cru Dent de Chien"
        },
        {
          "nom": "Chassagne-Montrachet Les Blanchots Dessous",
          "note": "Lieu-dit de village en contrebas de Criots-Bâtard-Montrachet, au profil minéral; environ 25 % de fûts neufs.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chassagne-Montrachet"
        },
        {
          "nom": "Chassagne-Montrachet",
          "note": null,
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Chassagne-Montrachet"
        },
        {
          "nom": "Chassagne-Montrachet Rouge Les Voillenots",
          "note": null,
          "cepage": "Pinot Noir",
          "couleur": "rouge",
          "appellation": "Chassagne-Montrachet"
        }
      ],
      "ordre": 19,
      "photo": "images/d-coffinet-duvernay.jpg",
      "region": "Côte de Beaune",
      "surface": "6,5 ha",
      "village": "Chassagne-Montrachet",
      "visible": true,
      "pratique": "lutte raisonnée",
      "vigneron": "Bastien Duvernay (vigneron), avec ses parents Laura Coffinet et Philippe Duvernay (fondateurs)",
      "fondation": "1989",
      "signature": "Des chassagnes classiques et élégants, fidèles à l'expression de chaque climat.",
      "sousRegion": null,
      "description": "Fondé en 1989 par Laura Coffinet, dont la famille est enracinée à Chassagne depuis 1860, et son mari Philippe Duvernay, originaire de Givry, le domaine cultive environ 6,5 hectares, dont une parcelle du grand cru Bâtard-Montrachet. Leur fils Bastien les a rejoints en 2012 et conduit aujourd'hui les vinifications. Vendanges manuelles, pressurage pneumatique, levures indigènes et usage mesuré du bois neuf définissent une approche traditionnelle et peu interventionniste."
    },
    {
      "id": "nicolas-perrault",
      "nom": "Domaine Nicolas Perrault",
      "site": "https://domaineperraultnicolas.fr",
      "vins": [
        {
          "nom": "Maranges 1er Cru Le Clos des Loyères",
          "note": "Parcelle phare du domaine, au fruit frais de cassis et de framboise, aux tanins fins.",
          "cepage": "Pinot Noir",
          "couleur": "rouge",
          "appellation": "Maranges 1er Cru Le Clos des Loyères"
        },
        {
          "nom": "Maranges 1er Cru Le Clos des Rois",
          "note": "Sols riches en calcaire; un pinot noir de corps moyen, à la trame fraîche et aux tanins soyeux.",
          "cepage": "Pinot Noir",
          "couleur": "rouge",
          "appellation": "Maranges 1er Cru Le Clos des Rois"
        },
        {
          "nom": "Maranges 1er Cru Le Clos Roussots",
          "note": "Profil épicé et fruité, aux tanins ronds et élégants.",
          "cepage": "Pinot Noir",
          "couleur": "rouge",
          "appellation": "Maranges 1er Cru Le Clos Roussots"
        },
        {
          "nom": "Maranges 1er Cru La Fussière Blanc",
          "note": "Le blanc du domaine, au nez grillé et épicé, à la bouche volumineuse.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Maranges 1er Cru La Fussière"
        },
        {
          "nom": "Maranges 1er Cru La Fussière Rouge",
          "note": null,
          "cepage": "Pinot Noir",
          "couleur": "rouge",
          "appellation": "Maranges 1er Cru La Fussière"
        }
      ],
      "ordre": 20,
      "photo": "images/d-nicolas-perrault.jpg",
      "region": "Côte de Beaune",
      "surface": "6 ha",
      "village": "Dezize-lès-Maranges",
      "visible": true,
      "pratique": "biologique certifié",
      "vigneron": "Nicolas Perrault (vigneron, propriétaire)",
      "fondation": "1947",
      "signature": "Des maranges premiers crus qui allient la finesse du terroir à l'éclat du fruit.",
      "sousRegion": null,
      "description": "À la pointe sud de la Côte de Beaune, le domaine familial fondé par le grand-père de Nicolas Perrault est aujourd'hui conduit par la troisième génération. Ancien chef de culture au Château de la Crée, à Santenay, Nicolas reprend les vignes en 2012 avec l'objectif de les certifier en agriculture biologique, ce qui est aujourd'hui chose faite, tout en s'inspirant des préparations de la biodynamie. Six hectares répartis sur neuf appellations, deux tiers de pinot noir et un tiers de chardonnay, sont vendangés à la main et triés sur table."
    },
    {
      "id": "raphael-corcia",
      "nom": "Domaine Raphaël Corcia",
      "site": null,
      "vins": [
        {
          "nom": "Mercurey 1er Cru Les Crêts",
          "note": "Parcelle de 0,55 ha plantée en 1949, le sommet de la gamme en rouge.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Mercurey 1er Cru"
        },
        {
          "nom": "Mercurey 1er Cru Les Crêts",
          "note": "Vignes de 1949 sur 0,23 ha, un blanc de texture crayeuse et de fruit blanc.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Mercurey 1er Cru"
        },
        {
          "nom": "Mercurey Le Clos Pontot",
          "note": "Monopole du domaine, vignes replantées en 1974.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Mercurey"
        },
        {
          "nom": "Mercurey Le Clos Pontot",
          "note": "Parcelle de 0,4 ha plantée en 1951 dans le clos monopole.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Mercurey"
        },
        {
          "nom": "Mercurey En Grillot",
          "note": "Vieilles vignes des années 1940 et 1950 sur 0,53 ha.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Mercurey"
        },
        {
          "nom": "Mercurey Le Chazeaux",
          "note": "Petite parcelle de 0,22 ha plantée dans les années 1960.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Mercurey"
        },
        {
          "nom": "Bourgogne Les Cortechats",
          "note": "Un hectare de vignes de 1959, le rouge d'entrée de gamme du domaine.",
          "cepage": "Pinot noir",
          "couleur": "rouge",
          "appellation": "Bourgogne"
        },
        {
          "nom": "Bourgogne Petits Ronds",
          "note": "Vignes de 1970 sur 0,35 ha.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Bourgogne"
        },
        {
          "nom": "Bourgogne Aligoté Les Potets",
          "note": "Cuvée ajoutée à la gamme avec le millésime 2023.",
          "cepage": "Aligoté",
          "couleur": "blanc",
          "appellation": "Bourgogne Aligoté"
        }
      ],
      "ordre": 21,
      "photo": "images/d-raphael-corcia.jpg",
      "region": "Côte chalonnaise",
      "surface": "4 ha",
      "village": "Mercurey",
      "visible": true,
      "pratique": null,
      "vigneron": "Raphaël Corcia (vigneron, propriétaire)",
      "fondation": "2021",
      "signature": "Des Mercurey de vieilles vignes, précis et minéraux, signés par une jeune maison en conversion biologique.",
      "sousRegion": null,
      "description": "Raphaël Corcia a repris en 2021 l'ancien Domaine de la Vieille Fontaine à Mercurey, quatre hectares de vieilles vignes dont plusieurs parcelles plantées dans les années 1940 et 1950. Dès le premier millésime, il a fait le choix d'une viticulture biologique et d'interventions minimales au chai. Les étiquettes portent aussi le nom d'Alain et Raphaël Corcia."
    },
    {
      "id": "eric-forest",
      "nom": "Domaine Eric Forest",
      "site": "https://www.ericforest.fr/",
      "vins": [
        {
          "nom": "Pouilly-Fuissé 1er Cru Les Crays",
          "note": "Éboulis calcaires et marnes exposés plein sud, un vin ample à la minéralité ciselée.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Pouilly-Fuissé 1er Cru"
        },
        {
          "nom": "Pouilly-Fuissé La Roche",
          "note": "Vignes à 401 m d'altitude sur roche bajocienne fissurée, minéralité saline et citronnée.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Pouilly-Fuissé"
        },
        {
          "nom": "Pouilly-Fuissé ÂME Forest",
          "note": "Assemblage de quatre terroirs frais cultivés par trois générations de la famille.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Pouilly-Fuissé"
        },
        {
          "nom": "Pouilly-Fuissé 24 Carats",
          "note": "Micro-cuvée des trois ou quatre meilleurs fûts de La Roche et des Crays, produite seulement dans les grands millésimes.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Pouilly-Fuissé"
        },
        {
          "nom": "Saint-Véran Terre Noire",
          "note": "Vignes centenaires sur argiles sombres à Davayé, un vin très concentré.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Saint-Véran"
        },
        {
          "nom": "Saint-Véran La Renommée",
          "note": "Coteau pentu et calcaire chaud, profil plein et rond.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Saint-Véran"
        },
        {
          "nom": "Mâcon-Vergisson Sur la Roche",
          "note": "Argiles ferrugineuses sur calcaire, exposition nord-est, un vin frais et minéral.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Mâcon-Vergisson"
        },
        {
          "nom": "Mâcon-Pierreclos Le Clos des Charmes",
          "note": "Monopole de vignes centenaires sur argilo-marneux exposé sud.",
          "cepage": "Chardonnay",
          "couleur": "blanc",
          "appellation": "Mâcon-Pierreclos"
        }
      ],
      "ordre": 22,
      "photo": "images/d-eric-forest.jpg",
      "region": "Mâconnais",
      "surface": "7,5 ha",
      "village": "Vergisson",
      "visible": true,
      "pratique": null,
      "vigneron": "Eric Forest (vigneron, propriétaire)",
      "fondation": null,
      "signature": "Des Pouilly-Fuissé riches et salins, où la minéralité de la roche tient tête à la maturité.",
      "sousRegion": "Pouilly-Fuissé",
      "description": "Huitième génération d'une famille de vignerons de Vergisson, Eric Forest conduit le domaine depuis 1999 sur des parcelles plantées entre 1930 et 1979, au pied de la roche de Vergisson. Le travail est entièrement manuel, la vigne est labourée et menée sans herbicide, et les vins sont élevés dix à quinze mois en fût avec peu de soufre, puis mis en bouteille par gravité, souvent sans filtration."
    },
    {
      "id": "chambeyron-manin",
      "nom": "Domaine Chambeyron-Manin",
      "site": null,
      "vins": [
        {
          "nom": "Côte-Rôtie Côte Brune",
          "note": "Schistes abrupts de la Côte Brune, vinification en grappes entières avec levures indigènes et élevage de 18 mois.",
          "cepage": "Syrah (sérine)",
          "couleur": "rouge",
          "appellation": "Côte-Rôtie"
        }
      ],
      "ordre": 23,
      "photo": "images/d-chambeyron-manin.jpg",
      "region": "Rhône Nord",
      "surface": "0,5 ha",
      "village": "Ampuis",
      "visible": true,
      "pratique": null,
      "vigneron": "Véronique Manin (vigneronne)",
      "fondation": null,
      "signature": "Une seule cuvée, un seul coteau : la Côte Brune en vendange entière, tannique et profonde.",
      "sousRegion": "Côte-Rôtie",
      "description": "Micro-domaine familial d'Ampuis fondé par Marius Chambeyron, aujourd'hui conduit par Véronique Manin, troisième génération. Une seule parcelle d'un demi-hectare sur la Côte Brune, plantée de syrah de type sérine dans les années 1930 et 1960, travaillée entièrement à la main sans intrant de synthèse. La production dépasse rarement 200 caisses par an."
    },
    {
      "id": "bernard-gripa",
      "nom": "Domaine Bernard Gripa",
      "site": null,
      "vins": [
        {
          "nom": "Saint-Joseph Le Berceau",
          "note": "Sélection des plus vieilles vignes du berceau historique de l'appellation, élevée en demi-muids.",
          "cepage": "Syrah",
          "couleur": "rouge",
          "appellation": "Saint-Joseph"
        },
        {
          "nom": "Saint-Joseph Le Berceau",
          "note": "Les meilleurs climats de marsanne du domaine, un blanc de garde d'une quinzaine d'années.",
          "cepage": "Marsanne, Roussanne",
          "couleur": "blanc",
          "appellation": "Saint-Joseph"
        },
        {
          "nom": "Saint-Joseph",
          "note": "Coteaux granitiques de Tournon et Mauves, environ un quart de vendange entière.",
          "cepage": "Syrah",
          "couleur": "rouge",
          "appellation": "Saint-Joseph"
        },
        {
          "nom": "Saint-Joseph",
          "note": "Vignes de coteau d'une trentaine d'années, élevage en demi-muids de 600 litres.",
          "cepage": "Marsanne, Roussanne",
          "couleur": "blanc",
          "appellation": "Saint-Joseph"
        },
        {
          "nom": "Saint-Péray Les Figuiers",
          "note": "Cuvée haute de gamme, vignes de 60 ans sur argilo-calcaire, majoritaire en roussanne.",
          "cepage": "Roussanne, Marsanne",
          "couleur": "blanc",
          "appellation": "Saint-Péray"
        },
        {
          "nom": "Saint-Péray Les Pins",
          "note": "Vignes de 40 ans, élevage en demi-muids de plusieurs vins, profil frais et floral.",
          "cepage": "Marsanne, Roussanne",
          "couleur": "blanc",
          "appellation": "Saint-Péray"
        }
      ],
      "ordre": 24,
      "photo": "images/d-bernard-gripa.jpg",
      "region": "Rhône Nord",
      "surface": "17,6 ha",
      "village": "Mauves",
      "visible": true,
      "pratique": null,
      "vigneron": "Fabrice Gripa (vigneron, avec son père Bernard)",
      "fondation": null,
      "signature": "Des blancs de marsanne et roussanne tendus et des Saint-Joseph de granit, classiques et sans lourdeur.",
      "sousRegion": "Saint-Joseph et Saint-Péray",
      "description": "Vignerons à Mauves depuis le XVIIe siècle, les Gripa ont commencé à mettre en bouteille sous leur nom en 1974 avec Bernard, l'un des artisans du renouveau de Saint-Joseph et de Saint-Péray. Son fils Fabrice mène aujourd'hui le domaine, dont la moitié des vignes est plantée en marsanne et roussanne, chose rare dans le secteur. Les sols sont labourés, sans herbicide ni insecticide, et les rouges sont foulés au pied en cuves de bois ouvertes."
    },
    {
      "id": "jean-pierre-gaussen",
      "nom": "Domaine Jean-Pierre Gaussen",
      "site": null,
      "vins": [
        {
          "nom": "Bandol Longue Garde",
          "note": "Produite seulement dans certains millésimes, longue macération et près de deux ans en vieux foudres.",
          "cepage": "Mourvèdre (environ 95 %), Cinsault",
          "couleur": "rouge",
          "appellation": "Bandol"
        },
        {
          "nom": "Bandol Tradition",
          "note": "Le rouge produit chaque année, mourvèdre dominant sur argilo-calcaire.",
          "cepage": "Mourvèdre, Cinsault",
          "couleur": "rouge",
          "appellation": "Bandol"
        },
        {
          "nom": "Bandol rosé",
          "note": "Apprécié pour ses notes florales et sa typicité, selon la description du domaine.",
          "cepage": null,
          "couleur": "rosé",
          "appellation": "Bandol"
        },
        {
          "nom": "Bandol blanc",
          "note": "Blanc floral, encépagement indiqué par le Guide Hachette.",
          "cepage": "Clairette, Bourboulenc",
          "couleur": "blanc",
          "appellation": "Bandol"
        }
      ],
      "ordre": 25,
      "photo": "images/d-jean-pierre-gaussen.jpg",
      "region": "Provence",
      "surface": "12 ha",
      "village": "La Cadière-d’Azur",
      "visible": true,
      "pratique": null,
      "vigneron": "Jean-Pierre et Julia Gaussen, avec leur fille Mireille",
      "fondation": "années 1960",
      "signature": "Des Bandol de mourvèdre presque pur, denses et taillés pour la garde.",
      "sousRegion": "Bandol",
      "description": "Jean-Pierre et Julia Gaussen ont fondé le domaine dans les années 1960 à partir d'un seul hectare, en bâtissant eux-mêmes la cave, aujourd'hui creusée dans la roche et tenue à 14 degrés toute l'année. Leur fille Mireille les accompagne dans l'élaboration des vins. Sur douze hectares d'argilo-calcaire, le mourvèdre domine largement les rouges, élevés vingt à vingt-deux mois en foudres."
    }
  ],
  "arrivages": [
    {
      "id": "automne-2026",
      "date": "2026-10-19",
      "texte": "Le conteneur quitte Beaune à la mi-septembre. Les réservations sont ouvertes jusqu’au 5 octobre ; les quantités indiquées sont celles qu’il reste à réserver. Livraison dans la succursale SAQ de votre choix.",
      "titre": "Arrivage d’automne : Champagne et Côte de Nuits",
      "lignes": [
        {
          "note": "",
          "prix": "",
          "cuvee": "Les Hauts Clos",
          "format": "Caisse de 6",
          "quantite": "14 caisses",
          "domaineId": "georges-remy",
          "millesime": ""
        },
        {
          "note": "Quantités très limitées",
          "prix": "",
          "cuvee": "Grand Cru Blanc de Blancs Brut",
          "format": "Caisse de 6",
          "quantite": "6 caisses",
          "domaineId": "lilbert-fils",
          "millesime": ""
        },
        {
          "note": "",
          "prix": "",
          "cuvee": "Chablis 1er Cru Montée de Tonnerre",
          "format": "Caisse de 12",
          "quantite": "20 caisses",
          "domaineId": "jean-collet",
          "millesime": "2023"
        },
        {
          "note": "Allocation",
          "prix": "",
          "cuvee": "Chambertin Grand Cru",
          "format": "Caisse de 6",
          "quantite": "4 caisses",
          "domaineId": "robert-groffier",
          "millesime": "2022"
        },
        {
          "note": "",
          "prix": "",
          "cuvee": "Echezeaux Grand Cru",
          "format": "Caisse de 6",
          "quantite": "10 caisses",
          "domaineId": "felettig",
          "millesime": "2022"
        },
        {
          "note": "",
          "prix": "",
          "cuvee": "Grands Échézeaux Grand Cru",
          "format": "Caisse de 6",
          "quantite": "8 caisses",
          "domaineId": "jean-marc-millot",
          "millesime": "2022"
        }
      ],
      "statut": "a-venir",
      "visible": true,
      "dateTexte": "Semaine du 19 octobre 2026"
    },
    {
      "id": "printemps-2026",
      "date": "2026-04-14",
      "texte": "Arrivé et distribué. Quelques bouteilles restent en entrepôt : écrivez-nous.",
      "titre": "Arrivage de printemps : Côte de Beaune en blanc",
      "lignes": [
        {
          "note": "",
          "prix": "",
          "cuvee": "Meursault 1er Cru Charmes",
          "format": "Caisse de 6",
          "quantite": "",
          "domaineId": "jobard-morey",
          "millesime": "2022"
        },
        {
          "note": "",
          "prix": "",
          "cuvee": "Meursault 1er Cru Les Charmes Dessus",
          "format": "Caisse de 6",
          "quantite": "",
          "domaineId": "tessier",
          "millesime": "2022"
        },
        {
          "note": "",
          "prix": "",
          "cuvee": "Bâtard-Montrachet Grand Cru",
          "format": "Caisse de 6",
          "quantite": "",
          "domaineId": "coffinet-duvernay",
          "millesime": "2022"
        }
      ],
      "statut": "arrive",
      "visible": true,
      "dateTexte": "Avril 2026"
    }
  ]
};
