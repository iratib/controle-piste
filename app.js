/* ═══════════════════════════════════════════════════════════
   CONFIGURATION DES PLANS DE CONTRÔLE (architecture data-driven)
   Une tâche du sidebar = un objet ici. Ajouter une tâche = ajouter
   un objet ; aucune autre modification de code n'est requise.

   Champ (field):
     id, label, type ('text'|'select'|'textarea'), options[], placeholder,
     required, uppercase, autofillTarget,
     role : 'primary' (titre carte + regroupement stats) | 'meta' (ligne 2)
            | 'description' (ligne principale) | 'context' (ajouté après —)
            | 'action' | 'note'
     metaPrefix : préfixe affiché devant une valeur meta (ex: 'PCA')
   Catégorie (chip): { id, label, emoji, color (hex), autofill }

   ⚠️ Les tâches 2 à 6 contiennent des champs/catégories DE DÉPART,
   à affiner avec les libellés réels du terrain.
   ═══════════════════════════════════════════════════════════ */
// Liste des services / fonctions (commune). « AUTRE » ouvre une saisie libre.
const SERVICES = ["CHEF D'ÉQUIPE", 'CARISTE', 'BAGAGISTE', 'CHAUFFEUR BUS', 'CHAUFFEUR BUDAS', 'CHAUFFEUR PMR', 'CHAUFFEUR PUSHBACK', 'CAMION VIDANGE', 'CAMION EAU POTABLE', 'AUTRE'];

const CONTROL_PLANS = [
  /* ── 1. CIRCULATION (tâche d'origine) ── */
  {
    id: 'ss-piste',
    nom: 'Circulation',
    icon: '🚦',
    subtitle: 'Contrôle circulation tarmac',
    reportTitle: 'CONTRÔLE CIRCULATION — RAM HANDLING',
    reportSubtitle: 'Rapport de contrôle qualité tarmac',
    multiCategory: true, // Type d'infraction : choix multiple (clic = sélectionne, re-clic = annule)
    sections: [
      { icon: '👤', title: 'Agent contrevenant', fields: [
        { id: 'nom', label: 'Nom', type: 'text', required: true, uppercase: true, role: 'primary', placeholder: "Nom de l'agent" },
        { id: 'pca', label: 'N° PCA', type: 'text', role: 'meta', metaPrefix: 'PCA', placeholder: 'N° badge / PCA (optionnel)' },
        { id: 'service', label: 'Service / Fonction', type: 'select', role: 'meta', placeholder: '— Sélectionner —', options: SERVICES, allowOther: true, uppercase: true, otherPlaceholder: 'Précisez la fonction' },
      ] },
      { icon: '⚠️', title: "Type d'infraction", categories: true, fields: [
        { id: 'infraction', label: "Description complète de l'infraction", type: 'text', required: true, uppercase: true, autofillTarget: true, role: 'description', placeholder: 'Ex: DEGAGEMENT ESCABOT SANS GUIDAGE C25' },
        { id: 'zone', label: 'Zone / Parking', type: 'text', uppercase: true, role: 'context', placeholder: 'Ex: B10, C25, Porte 12…' },
      ] },
      { icon: '📝', title: 'Action / Remarque', fields: [
        { id: 'action', label: 'Suite à donner', type: 'checkboxes', role: 'action', options: ['Rapport écrit', 'Intéressé avisé'] },
        { id: 'note', label: 'Note complémentaire', type: 'textarea', role: 'note', placeholder: 'Observations…' },
      ] }
    ],
    categories: [
      { id: 'vitesse',        label: 'Grande vitesse',    emoji: '🟡', color: '#F59E0B', autofill: 'CONDUITE A GRANDE VITESSE' },
      { id: 'cale',           label: 'Sans cale',         emoji: '🔵', color: '#3B82F6', autofill: 'BRANCHEMENT GPU SANS CALE' },
      { id: 'guidage',        label: 'Sans guidage',      emoji: '🟢', color: '#10B981', autofill: 'DEGAGEMENT SANS GUIDAGE' },
      { id: 'sens',           label: 'Sens interdit',     emoji: '🟣', color: '#8B5CF6', autofill: 'CONDUITE SENS INTERDIT' },
      { id: 'stop',           label: 'Non-respect STOP',  emoji: '🟠', color: '#F59E0B', autofill: 'NON RESPECT STOP' },
      { id: 'voie',           label: 'Voie interdite',    emoji: '🔴', color: '#EF4444', autofill: 'SORTE PAR VOIE INTERDITE' },
      { id: 'gpu',            label: 'Branchement GPU',   emoji: '⚡', color: '#3B82F6', autofill: 'BRANCHEMENT GPU SANS CALE' },
      { id: 'bus',            label: 'Conduite bus',      emoji: '🚌', color: '#F59E0B', autofill: 'CONDUITE BUS A GRANDE VITESSE' },
      { id: 'escabot',        label: 'Conduite escabot',  emoji: '🚜', color: '#F59E0B', autofill: "CONDUITE D'ESCABOT A GRANDE VITESSE" },
      { id: 'correspondance', label: 'Correspondance',    emoji: '📍', color: '#EF4444', autofill: 'SORTE PAR VOIE INTERDITE CORRESPONDANCE' },
      { id: 'autre',          label: 'Autre',             emoji: '🔧', color: '#CC0000' },
    ]
  },

  /* ── 2. CONTRÔLE TRANSPORT (moyens de transport : bus, budas, pick-up…)
     Points de contrôle = chips (multi-sélection). Photo justificative en cas
     de non conformité. ── */
  {
    id: 'engins',
    nom: 'Contrôle Transport',
    icon: '🚌',
    subtitle: 'Conformité des moyens de transport',
    reportTitle: 'CONTRÔLE TRANSPORT — RAM HANDLING',
    reportSubtitle: 'Rapport de contrôle des moyens de transport',
    multiCategory: true, // plusieurs points non conformes possibles
    // Onglet « Général » : recensement de la vacation (1 fiche / vacation).
    // vehicles = nb de moyens dispo par type ; personnel = grille type × shift.
    general: {
      title: 'Recensement de la vacation',
      vehicles: [
        { id: 'bus',    label: 'Bus' },
        { id: 'budas',  label: 'Navettes Budas' },
        { id: 'pmr',    label: 'Camions PMR' },
        { id: 'pickup', label: 'Pick-up' },
        { id: 'vip',    label: 'Voiture VIP' },
      ],
      shifts: [
        { id: 'journee', label: 'Journée' },
        { id: 'matin',   label: 'Matin' },
        { id: 'aprem',   label: 'Après-midi' },
        { id: 'nuit',    label: 'Nuit' },
      ],
    },
    sections: [
      { icon: '🚌', title: 'Moyen de transport', fields: [
        { id: 'type_engin', label: 'Type de transport', type: 'select', role: 'primary', placeholder: '— Sélectionner —', allowOther: true, otherValue: 'AUTRES', otherPlaceholder: 'Précisez le moyen de transport', options: ['BUS', 'BUDAS', 'PICKUP', 'VOITURE VIP', 'AUTRES'] },
        { id: 'num_engin', label: 'N° / Immatriculation', type: 'text', uppercase: true, role: 'meta', metaPrefix: 'N°' },
        { id: 'conducteur', label: 'Conducteur', type: 'text', uppercase: true, role: 'meta' },
        { id: 'conformite', label: 'Conformité', type: 'conformity', role: 'status' },
      ] },
      { icon: '⚠️', title: 'Point(s) de contrôle non conforme(s)', categories: true, conditional: 'nonconform', fields: [
        { id: 'anomalie', label: 'Détail / Observation', type: 'text', required: true, uppercase: true, autofillTarget: true, role: 'description', placeholder: 'Ex: CABINE CONDUCTEUR NON PROPRE' },
        { id: 'photo', label: 'Photo (non conformité)', type: 'photo', role: 'photo' },
        { id: 'zone', label: 'Zone / Parking', type: 'text', uppercase: true, role: 'context' },
      ] },
      { icon: '📝', title: 'Action / Remarque', fields: [
        { id: 'action', label: 'Suite à donner', type: 'checkboxes', role: 'action', options: ['Rapport écrit', 'Intéressé avisé'] },
        { id: 'note', label: 'Note complémentaire', type: 'textarea', role: 'note', placeholder: 'Observations…' },
      ] }
    ],
    categories: [
      { id: 'proprete_cabine', label: 'Propreté cabine conducteur', emoji: '🧼', color: '#3B82F6', autofill: 'CABINE CONDUCTEUR NON PROPRE' },
      { id: 'proprete_pax',    label: 'Propreté partie passagers',  emoji: '🧹', color: '#3B82F6', autofill: 'PARTIE DEDIEE AUX PASSAGERS NON PROPRE' },
      { id: 'proprete_gen',    label: 'Propreté générale du moyen', emoji: '✨', color: '#10B981', autofill: 'MOYEN DE TRANSPORT NON PROPRE' },
      { id: 'epi_uniforme',    label: 'EPI / uniforme conducteur',  emoji: '🦺', color: '#F59E0B', autofill: 'EPI / UNIFORME CONDUCTEUR NON CONFORME' },
      { id: 'pca',             label: 'Validité PCA',               emoji: '🪪', color: '#EF4444', autofill: 'PCA (PERMIS DE CONDUIRE AEROPORT) NON VALIDE / ABSENT' },
      { id: 'etat',            label: 'État du véhicule',           emoji: '🔧', color: '#8B5CF6', autofill: 'MAUVAIS ETAT DU VEHICULE' },
      { id: 'autre',           label: 'Autre',                      emoji: '➕', color: '#CC0000' },
    ]
  },

  /* ── 3. CONTRÔLE EPI (config de départ) ── */
  {
    id: 'epi',
    nom: 'Contrôle EPI',
    icon: '🦺',
    subtitle: 'Équipements de protection individuelle',
    reportTitle: 'CONTRÔLE EPI — RAM HANDLING',
    reportSubtitle: 'Rapport de contrôle du port des EPI',
    multiCategory: true, // points non conformes : choix multiple (clic = sélectionne, re-clic = annule)
    sections: [
      { icon: '👤', title: 'Agent contrôlé', fields: [
        { id: 'nom', label: 'Nom', type: 'text', required: true, uppercase: true, role: 'primary', placeholder: "Nom de l'agent" },
        { id: 'service', label: 'Service / Fonction', type: 'select', role: 'meta', placeholder: '— Sélectionner —', options: SERVICES, allowOther: true, uppercase: true, otherPlaceholder: 'Précisez la fonction' },
        { id: 'conformite', label: 'Conformité', type: 'conformity', role: 'status' },
      ] },
      { icon: '⚠️', title: 'EPI manquant / non conforme', categories: true, conditional: 'nonconform', fields: [
        { id: 'constat', label: 'Constat', type: 'text', required: true, uppercase: true, autofillTarget: true, role: 'description', placeholder: 'Ex: GILET HAUTE VISIBILITE NON PORTE' },
        { id: 'photo', label: 'Photo (non conformité)', type: 'photo', role: 'photo' },
        { id: 'zone', label: 'Zone', type: 'text', uppercase: true, role: 'context' },
      ] },
      { icon: '📝', title: 'Action / Remarque', fields: [
        { id: 'action', label: 'Suite à donner', type: 'checkboxes', role: 'action', options: ['Rapport écrit', 'Intéressé avisé'] },
        { id: 'note', label: 'Note complémentaire', type: 'textarea', role: 'note', placeholder: 'Observations…' },
      ] }
    ],
    categories: [
      { id: 'casque',     label: 'Casque',          emoji: '⛑️', color: '#F59E0B', autofill: 'CASQUE / CASQUETTE NON PORTE' },
      { id: 'gilet',      label: 'Gilet HV',        emoji: '🦺', color: '#F59E0B', autofill: 'GILET HAUTE VISIBILITE NON PORTE' },
      { id: 'chaussures', label: 'Chaussures séc.', emoji: '🥾', color: '#3B82F6', autofill: 'CHAUSSURES DE SECURITE NON PORTEES' },
      { id: 'gants',      label: 'Gants',           emoji: '🧤', color: '#10B981', autofill: 'GANTS NON PORTES' },
      { id: 'auditive',   label: 'Prot. auditive',  emoji: '🎧', color: '#8B5CF6', autofill: 'PROTECTION AUDITIVE ABSENTE' },
      { id: 'lunettes',   label: 'Lunettes',        emoji: '🥽', color: '#3B82F6', autofill: 'LUNETTES DE PROTECTION ABSENTES' },
      { id: 'tenue',      label: 'Tenue non conf.', emoji: '👕', color: '#EF4444', autofill: 'TENUE DE TRAVAIL NON CONFORME' },
      { id: 'autre',      label: 'Autre',           emoji: '➕', color: '#CC0000' },
    ]
  },

  /* ── 5. CONTRÔLE ZONES (config de départ) ── */
  {
    id: 'zones',
    nom: 'Contrôle zones',
    icon: '📍',
    subtitle: 'Inspection des zones / parkings',
    reportTitle: 'CONTRÔLE ZONES — RAM HANDLING',
    reportSubtitle: "Rapport d'inspection des zones",
    multiCategory: true, // points non conformes : choix multiple (clic = sélectionne, re-clic = annule)
    sections: [
      { icon: '📍', title: 'Zone contrôlée', fields: [
        { id: 'zone', label: 'Zone contrôlée', type: 'select', required: true, role: 'primary', placeholder: '— Sélectionner la zone —', options: ['T1', 'T2', 'CORRESPONDANCE', 'LIVRAISON'] },
        { id: 'conformite', label: 'Conformité', type: 'conformity', role: 'status' },
      ] },
      // Section visible UNIQUEMENT si « Non conforme » (conditional: 'nonconform')
      { icon: '⚠️', title: 'Anomalie constatée', categories: true, conditional: 'nonconform', fields: [
        { id: 'constat', label: 'Constat', type: 'text', required: true, uppercase: true, autofillTarget: true, role: 'description', placeholder: 'Ex: PRESENCE DE FOD' },
        { id: 'photo', label: 'Photo (non conformité)', type: 'photo', role: 'photo' },
      ] },
      { icon: '📝', title: 'Action / Remarque', fields: [
        { id: 'action', label: 'Suite à donner', type: 'checkboxes', role: 'action', options: ['Rapport écrit', 'Intéressé avisé'] },
        { id: 'note', label: 'Note complémentaire', type: 'textarea', role: 'note', placeholder: 'Observations…' },
      ] }
    ],
    categories: [
      { id: 'fod',          label: 'FOD présent',        emoji: '🔩', color: '#EF4444', autofill: 'PRESENCE DE FOD' },
      { id: 'marquage',     label: 'Marquage effacé',    emoji: '🚧', color: '#F59E0B', autofill: 'MARQUAGE AU SOL EFFACE' },
      { id: 'eclairage',    label: 'Éclairage HS',       emoji: '💡', color: '#F59E0B', autofill: 'ECLAIRAGE DEFECTUEUX' },
      { id: 'encombrement', label: 'Encombrement',       emoji: '📦', color: '#3B82F6', autofill: 'ZONE ENCOMBREE' },
      { id: 'proprete',     label: 'Propreté',           emoji: '🧹', color: '#10B981', autofill: 'DEFAUT DE PROPRETE' },
      { id: 'materiel',     label: 'Matériel abandonné', emoji: '🛠️', color: '#8B5CF6', autofill: 'MATERIEL ABANDONNE' },
      { id: 'delimitation', label: 'Non délimitée',      emoji: '🚥', color: '#EF4444', autofill: 'ZONE NON DELIMITEE' },
      { id: 'autre',        label: 'Autre',              emoji: '➕', color: '#CC0000' },
    ]
  },

  /* ── 6. CONTRÔLE CALES / CÔNES (config de départ) ── */
  {
    id: 'cales',
    nom: 'Contrôle cales/cônes',
    icon: '🔻',
    subtitle: 'Calage & balisage avion',
    reportTitle: 'CONTRÔLE CALES / CÔNES — RAM HANDLING',
    reportSubtitle: 'Rapport de contrôle calage et balisage',
    multiCategory: true, // points non conformes : choix multiple (clic = sélectionne, re-clic = annule)
    sections: [
      { icon: '✈️', title: 'Avion / Parking', fields: [
        { id: 'vol', label: 'N° Vol / Avion', type: 'text', required: true, uppercase: true, role: 'primary', placeholder: 'Ex: AT201 / CN-RGY' },
        { id: 'parking', label: 'Parking', type: 'text', uppercase: true, role: 'meta', metaPrefix: 'Pkg' },
        { id: 'conformite', label: 'Conformité', type: 'conformity', role: 'status' },
      ] },
      { icon: '⚠️', title: 'Anomalie cales / cônes', categories: true, conditional: 'nonconform', fields: [
        { id: 'constat', label: 'Constat', type: 'text', required: true, uppercase: true, autofillTarget: true, role: 'description', placeholder: 'Ex: CALE ABSENTE TRAIN PRINCIPAL' },
        { id: 'photo', label: 'Photo (non conformité)', type: 'photo', role: 'photo' },
        { id: 'position', label: 'Position (train / roue)', type: 'text', uppercase: true, role: 'context' },
      ] },
      { icon: '📝', title: 'Action / Remarque', fields: [
        { id: 'action', label: 'Suite à donner', type: 'checkboxes', role: 'action', options: ['Rapport écrit', 'Intéressé avisé'] },
        { id: 'note', label: 'Note complémentaire', type: 'textarea', role: 'note', placeholder: 'Observations…' },
      ] }
    ],
    categories: [
      { id: 'cale_absente',  label: 'Cale absente',         emoji: '🚫', color: '#EF4444', autofill: 'CALE ABSENTE' },
      { id: 'cale_position', label: 'Cale mal positionnée', emoji: '🔻', color: '#F59E0B', autofill: 'CALE MAL POSITIONNEE' },
      { id: 'cone_absent',   label: 'Cône absent',          emoji: '⚠️', color: '#EF4444', autofill: 'CONE DE SECURITE ABSENT' },
      { id: 'cone_position', label: 'Cône mal positionné',  emoji: '🚧', color: '#F59E0B', autofill: 'CONE MAL POSITIONNE' },
      { id: 'nombre',        label: 'Nombre insuffisant',   emoji: '🔢', color: '#8B5CF6', autofill: 'NOMBRE DE CALES / CONES INSUFFISANT' },
      { id: 'deteriore',     label: 'Matériel détérioré',   emoji: '🛠️', color: '#3B82F6', autofill: 'MATERIEL DETERIORE' },
      { id: 'autre',         label: 'Autre',                emoji: '➕', color: '#CC0000' },
    ]
  },

  /* ── 7. CONTRÔLE AGENT RAMP (constat seul + photo justificative) ──
     Le contrôleur CONSTATE une anomalie parmi les points (chips), la coche,
     joint une photo si nécessaire. AUCUNE action : le traitement est fait
     par la hiérarchie via le rapport reçu. */
  {
    id: 'agent-ramp',
    nom: 'Contrôle agent ramp',
    icon: '👷',
    subtitle: 'Constat des anomalies agent ramp',
    reportTitle: 'CONTRÔLE AGENT RAMP — RAM HANDLING',
    reportSubtitle: 'Rapport de constat (transmis à la hiérarchie pour traitement)',
    multiCategory: true, // plusieurs anomalies cochables pour un même vol
    sections: [
      { icon: '⚠️', title: 'Anomalie constatée', categories: true, fields: [
        { id: 'constat', label: 'Constat', type: 'text', required: true, uppercase: true, autofillTarget: true, role: 'description', placeholder: 'Sélectionnez un point ci-dessus' },
        { id: 'photo', label: 'Photo justificative (si nécessaire)', type: 'photo', role: 'photo' },
      ] },
      { icon: '👷', title: 'Agent ramp / Vol', fields: [
        { id: 'agent_ramp', label: 'Agent ramp', type: 'text', required: true, uppercase: true, role: 'primary', placeholder: "Nom de l'agent ramp" },
        { id: 'num_vol', label: 'N° Vol', type: 'text', uppercase: true, role: 'meta', metaPrefix: 'Vol', placeholder: 'Ex: AT201' },
        { id: 'parking', label: 'Parking', type: 'text', uppercase: true, role: 'meta', metaPrefix: 'Pkg' },
        { id: 'machine', label: 'Machine / Engin', type: 'text', uppercase: true, role: 'meta', metaPrefix: 'Machine', placeholder: '(optionnel)' },
      ] },
      { icon: '📝', title: 'Remarque', fields: [
        { id: 'note', label: 'Note complémentaire', type: 'textarea', role: 'note', placeholder: 'Observations…' },
      ] }
    ],
    categories: [
      { id: 'vestimentaire', label: 'Tenue vestimentaire',      emoji: '👕', color: '#F59E0B', autofill: 'NON RESPECT TENUE VESTIMENTAIRE' },
      { id: 'frein_zec',     label: 'Test frein entrée ZEC',    emoji: '🛑', color: '#EF4444', autofill: "TEST FREIN NON EFFECTUE A L'ENTREE ZEC" },
      { id: 'distance',      label: 'Distance sécurité zone 1', emoji: '📏', color: '#EF4444', autofill: 'NON RESPECT DISTANCE DE SECURITE ZONE 1' },
      { id: 'guidage_gse',   label: 'Guidage retrait GSE',      emoji: '🚜', color: '#10B981', autofill: 'RETRAIT GSE SANS GUIDAGE' },
      { id: 'circuit',       label: 'Circuit autour avion',     emoji: '🔄', color: '#8B5CF6', autofill: "CIRCUIT AUTOUR DE L'AVION NON RESPECTE" },
      { id: 'calage',        label: 'Calage avion',             emoji: '🔻', color: '#EF4444', autofill: 'CALAGE AVION NON CONFORME' },
      { id: 'cones',         label: 'Utilisation cônes',        emoji: '🚧', color: '#F59E0B', autofill: 'UTILISATION DES CONES NON CONFORME' },
      { id: 'soutes_ouv',    label: 'Ouv./ferm. soutes',        emoji: '🚪', color: '#3B82F6', autofill: 'OUVERTURE / FERMETURE SOUTES NON CONFORME' },
      { id: 'toctoc',        label: 'Toc-toc portes avion',     emoji: '✊', color: '#8B5CF6', autofill: 'TOC-TOC PORTES AVION NON EFFECTUE' },
      { id: 'soutes_ctrl',   label: 'Contrôle soutes av./ap.',  emoji: '🧳', color: '#3B82F6', autofill: 'CONTROLE SOUTES AVANT / APRES NON EFFECTUE' },
      { id: 'filets',        label: 'Filets de séparation',     emoji: '🕸️', color: '#F59E0B', autofill: 'FILETS DE SEPARATION NON CONTROLES PAR SECTION' },
      { id: 'scan',          label: 'Scan des bagages',         emoji: '📲', color: '#10B981', autofill: 'SCAN DES BAGAGES NON EFFECTUE' },
      { id: 'autre',         label: 'Autre',                    emoji: '➕', color: '#CC0000' },
    ]
  },
];

/* ── COMPAGNIES (onglet galerie : carte = logo → checklist du vol) ──
   Les logos sont dans le dossier images/. La checklist sera ajoutée ensuite. */
const COMPANIES = [
  { code: 'RAM', nom: 'Royal Air Maroc',     logo: 'images/logoRAM.jpg' },
  { code: 'AF',  nom: 'Air France',          logo: 'images/AF.png' },
  { code: 'TK',  nom: 'Turkish Airlines',    logo: 'images/TK.png' },
  { code: 'EK',  nom: 'Emirates',            logo: 'images/EK.png' },
  { code: 'EY',  nom: 'Etihad Airways',      logo: 'images/EY.png' },
  { code: 'QR',  nom: 'Qatar Airways',       logo: 'images/QR.png' },
  { code: 'SV',  nom: 'Saudia',              logo: 'images/SV.jpeg' },
  { code: 'GF',  nom: 'Gulf Air',            logo: 'images/GF.png' },
  { code: 'KU',  nom: 'Kuwait Airways',      logo: 'images/ku.png' },
  { code: 'RJ',  nom: 'Royal Jordanian',     logo: 'images/RJ.png' },
  { code: 'TU',  nom: 'Tunisair',            logo: 'images/TU.png' },
  { code: 'HV',  nom: 'TO',                  logo: 'images/hv.to.png' },
  { code: 'L6',  nom: 'Mauritania Airlines', logo: 'images/l6.jpeg' },
  { code: 'TUI', nom: 'TUI fly',             logo: 'images/logotui.jpg' },
];
function companyByCode(code) { return COMPANIES.find(c => c.code === code) || null; }

/* ── CHECKLISTS DE VOL « standard » (points C/NC + remarques) ──
   Moteur générique piloté par config. Ajouter une compagnie = ajouter
   une entrée ici (clé = code COMPANIES). EK a son propre module dédié. */
const FLIGHT_CHECKLISTS = {
  HV: {
    flightCode: 'TO',
    title: 'Contrôle des vols TO',
    prest: 'SSQ',
    ref: '01/01',
    hasObservations: true,
    idFields: [
      { id: 'num_vol', label: 'Numéro vol' },
      { id: 'n_esc', label: 'Numéro escabeau' },
      { id: 'aramp1', label: 'Agent ramp 1' },
      { id: 'date', label: 'Date', type: 'date' },
      { id: 'n_bc4', label: 'Numéro tapis à bagages' },
      { id: 'aramp2', label: 'Agent ramp 2' },
      { id: 'type_avion', label: "Type d'avion", type: 'select', options: ['Boeing', 'Airbus'] },
      { id: 'n_gpu', label: 'Numéro GPU' },
      { id: 'cariste', label: 'Cariste 1' },
      { id: 'cariste2', label: 'Cariste 2' },
      { id: 'imm', label: 'Immatriculation' },
    ],
    points: [
      "Vérification matériel GSE",
      "Dégagement FOD sur le parking et le matériel",
      "Briefing avec le superviseur et l'équipe",
      "Mise en place (cônes et cales)",
      "Mise en place du GPU / crochet selon le type d'avion",
      "Respect des 3 freins pendant l'approchement",
      "Limitation vitesse",
      "Guidage obligatoire dans la zone 1 de la ZEC",
      "Mise en place des cales (BC4 - GPU)",
      "Accostage d'escabeau avec un respect de sécurité entre l'engin et le fuselage d'avion",
      "Mise en place des cônes de sécurité (débarquement ou embarquement des passagers)",
      "Mise en place du cône sur la plate-forme d'escabeau",
      "Mise en place de trois cônes à chaque extrémité d'aile pour les machines / winglets",
    ],
  },
};

/* ── STATE ── */
const STORE = 'ssqc';
const kSession = `${STORE}:session`;             // session COMMUNE à toutes les tâches
const kRecords = id => `${STORE}:${id}:records`; // enregistrements par tâche
const kLastPlan = `${STORE}:lastPlan`;
const kTheme = `${STORE}:theme`;
const kGeneral = id => `${STORE}:${id}:general`; // recensement « Général » par tâche (1 / vacation)

let currentPlan = null;
let currentView = 'plan'; // 'plan' | 'compagnies' | 'checklist'
let ekPhotos = [];        // images jointes à la fiche de vol EK en cours : [{ name, url }]
let ekFlights = [];       // vols EK enregistrés (persistés)
let clCfg = null;         // config de checklist standard en cours
let clCompany = null;     // compagnie de la checklist en cours
let clRecords = [];       // contrôles enregistrés (par compagnie, persistés)
let session = { agent: '', date: '', vacation: '', startTime: '' };
let records = [];
let selectedCategoryId = '';
let selectedCategoryIds = []; // plans multiCategory : plusieurs anomalies cochées
let selectedConformity = ''; // 'Conforme' | 'Non conforme' | '' (tâches avec champ type 'conformity')
let currentSub = 'controle'; // sous-vue d'un plan à recensement : 'controle' | 'general'
let capturedPhotos = {};     // { [fieldId]: dataURL } pour les champs type 'photo'

/* ── HELPERS ── */
function planById(id) { return CONTROL_PLANS.find(p => p.id === id) || null; }
function allFields() { return currentPlan.sections.flatMap(s => s.fields); }
function fieldsByRole(role) { return allFields().filter(f => f.role === role); }
function catById(id) { return currentPlan.categories.find(c => c.id === id) || null; }
function catLabel(id) { const c = catById(id); return c ? c.label : 'Autre'; }
function catColor(id) { const c = catById(id); return c ? c.color : 'var(--ram-red)'; }
function recordCats(r) { return (r.categories && r.categories.length) ? r.categories : (r.category ? [r.category] : []); }
function recordCatLabel(r) { const c = recordCats(r); return c.length ? c.map(catLabel).join(', ') : catLabel(r.category); }
function recordCountOf(id) {
  if (currentPlan && id === currentPlan.id) return records.length;
  try { return JSON.parse(localStorage.getItem(kRecords(id)) || '[]').length; } catch (e) { return 0; }
}
function conformityField() { return allFields().find(f => f.type === 'conformity') || null; }
function conditionalFieldIds() {
  const set = new Set();
  currentPlan.sections.forEach(sec => { if (sec.conditional) sec.fields.forEach(f => set.add(f.id)); });
  return set;
}

function rgba(hex, a) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
  return `rgba(${r},${g},${b},${a})`;
}
function textOn(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#000' : '#fff';
}
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

/* ── THEME (mode jour / nuit) ── */
function applyTheme(theme) {
  const dark = theme !== 'light';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  localStorage.setItem(kTheme, dark ? 'dark' : 'light');
  document.querySelectorAll('.theme-btn').forEach(b => b.textContent = dark ? '🌙' : '☀️');
  const ts = document.getElementById('themeSwitch'); if (ts) ts.textContent = dark ? 'Nuit' : 'Jour';
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = dark ? '#0A0A0F' : '#EEF1F6';
}
function toggleTheme() {
  applyTheme((localStorage.getItem(kTheme) || 'dark') === 'light' ? 'dark' : 'light');
}

/* ── INIT ── */
(function init() {
  applyTheme(localStorage.getItem(kTheme) || 'dark');
  document.getElementById('setupDate').value = new Date().toISOString().split('T')[0];
  migrate();

  const s = localStorage.getItem(kSession);
  if (s) {
    try { session = JSON.parse(s) || session; } catch (e) {}
    document.getElementById('setupOverlay').style.display = 'none';
    startApp();
  }
  // sinon : l'overlay de configuration de session reste visible
})();

// Migration : v1 (clés fixes) -> namespace ss-piste ; session par-plan v2 -> session commune v3
function migrate() {
  const legacy = localStorage.getItem('ssPisteSession');
  if (legacy && !localStorage.getItem('ssqc:ss-piste:session')) {
    localStorage.setItem('ssqc:ss-piste:session', legacy);
    const lr = localStorage.getItem('ssPisteRecords');
    if (lr) localStorage.setItem('ssqc:ss-piste:records', lr);
    localStorage.removeItem('ssPisteSession');
    localStorage.removeItem('ssPisteRecords');
  }
  if (!localStorage.getItem(kSession)) {
    const old = localStorage.getItem('ssqc:ss-piste:session');
    if (old) { localStorage.setItem(kSession, old); localStorage.setItem(kLastPlan, 'ss-piste'); }
  }
}

/* ── SESSION (commune) ── */
function startSession() {
  const agent = document.getElementById('setupAgent').value.trim();
  const date = document.getElementById('setupDate').value;
  const vacation = document.getElementById('setupVacation').value;
  if (!agent) { showToast("⚠️ Veuillez entrer le nom de l'agent", false); return; }
  if (!date) { showToast('⚠️ Veuillez sélectionner une date', false); return; }

  session = { agent, date, vacation, startTime: new Date().toTimeString().slice(0, 5) };
  localStorage.setItem(kSession, JSON.stringify(session));
  document.getElementById('setupOverlay').style.display = 'none';
  startApp();
}
function saveSession() { localStorage.setItem(kSession, JSON.stringify(session)); }
function saveRecords() { localStorage.setItem(kRecords(currentPlan.id), JSON.stringify(records)); }

function startApp() {
  document.getElementById('appMain').style.display = '';
  document.getElementById('sidebar').style.display = 'flex';
  const last = localStorage.getItem(kLastPlan);
  openPlan(planById(last) ? last : CONTROL_PLANS[0].id);
}

/* ── OUVERTURE D'UNE TÂCHE ── */
function openPlan(id) {
  currentView = 'plan';
  document.getElementById('tabBar').style.display = '';
  currentPlan = planById(id) || CONTROL_PLANS[0];
  try { records = JSON.parse(localStorage.getItem(kRecords(currentPlan.id)) || '[]'); } catch (e) { records = []; }
  localStorage.setItem(kLastPlan, currentPlan.id);
  document.getElementById('headerTitle').textContent = currentPlan.nom;
  document.getElementById('headerSub').textContent = currentPlan.subtitle || 'Contrôle Qualité';
  buildForm();
  setupGeneralTab();
  updateBanner();
  updateRecordCount();
  renderNav();
  showTab('saisie');
  window.scrollTo(0, 0);
}

function switchPlan(id) {
  closeSidebar();
  if (currentView === 'plan' && currentPlan && id === currentPlan.id) return;
  openPlan(id);
}

/* ── VUE COMPAGNIES (galerie de logos) ── */
function openCompanies() {
  closeSidebar();
  currentView = 'compagnies';
  document.getElementById('headerTitle').textContent = 'Contrôle compagnies';
  document.getElementById('headerSub').textContent = 'Sélectionner une compagnie';
  document.getElementById('tabBar').style.display = 'none';
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const sc = document.getElementById('screen-compagnies');
  sc.classList.add('active'); sc.style.display = '';
  renderCompanies();
  renderNav();
  window.scrollTo(0, 0);
}
function renderCompanies() {
  document.getElementById('companiesGrid').innerHTML = COMPANIES.map(c => `
    <div class="company-card" onclick="openCompanyChecklist('${c.code}')">
      <div class="company-logo"><img src="${esc(c.logo)}" alt="${esc(c.nom)}" loading="lazy"></div>
      <div class="company-name">${esc(c.nom)}</div>
    </div>`).join('');
}

/* ═══════════════════════════════════════════════════════════
   MA CHECKLIST VACATION — liste des contrôles que le contrôleur
   connecté doit assurer pendant sa vacation. Cochée AUTOMATIQUEMENT
   dès qu'un enregistrement existe pour le contrôle. Aucun cochage
   manuel : le contrôleur ne peut pas cocher lui-même, c'est la saisie
   qui valide. ═══════════════════════════════════════════════════════ */
function ekCountStore() { try { return JSON.parse(localStorage.getItem(STORE + ':ek:flights') || '[]').length; } catch (e) { return 0; } }
function clCountStore(code) { try { return JSON.parse(localStorage.getItem(STORE + ':cl:' + code + ':records') || '[]').length; } catch (e) { return 0; } }

// Liste des contrôles attendus pendant la vacation (+ comptage auto)
function controllerChecklistItems() {
  const items = CONTROL_PLANS.map(p => ({ key: 'plan:' + p.id, icon: p.icon, label: p.nom, count: recordCountOf(p.id) }));
  items.push({ key: 'ek', icon: '🛫', label: 'Fiche de vol EK (Emirates)', count: ekCountStore() });
  Object.keys(FLIGHT_CHECKLISTS).forEach(code => {
    items.push({ key: 'cl:' + code, icon: '🛫', label: FLIGHT_CHECKLISTS[code].title, count: clCountStore(code) });
  });
  return items;
}
// Un contrôle est « assuré » UNIQUEMENT s'il existe au moins un enregistrement
// (cochage 100 % automatique — aucun cochage manuel par le contrôleur).
function vacItemDone(it) { return it.count > 0; }
function controllerDoneFraction() {
  const items = controllerChecklistItems();
  return items.filter(it => vacItemDone(it)).length + '/' + items.length;
}

function openControllerChecklist() {
  closeSidebar();
  currentView = 'mychecklist';
  document.getElementById('headerTitle').textContent = 'Ma checklist vacation';
  document.getElementById('headerSub').textContent = 'Contrôles à assurer';
  document.getElementById('tabBar').style.display = 'none';
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const sc = document.getElementById('screen-mychecklist');
  sc.classList.add('active'); sc.style.display = '';
  renderControllerChecklist();
  renderNav();
  window.scrollTo(0, 0);
}

function renderControllerChecklist() {
  const items = controllerChecklistItems();
  const total = items.length;
  const doneCount = items.filter(it => vacItemDone(it)).length;
  const pct = total ? Math.round(doneCount / total * 100) : 0;
  const d = session.date ? new Date(session.date + 'T12:00:00').toLocaleDateString('fr-FR') : '—';
  const box = document.getElementById('mychecklistBody');
  if (!box) return;
  box.innerHTML = `
    <div class="vac-head">
      <div class="vac-agent">👤 ${esc(session.agent || '—')}</div>
      <div class="vac-meta">📅 ${d} · ${esc(session.vacation || '')}</div>
    </div>
    <div class="vac-progress">
      <div class="vac-progress-bar"><div class="vac-progress-fill" style="width:${pct}%"></div></div>
      <div class="vac-progress-label">${doneCount}/${total} contrôles assurés</div>
    </div>
    ${items.map(it => {
      const done = vacItemDone(it);
      const sub = done ? (it.count + ' enregistrement' + (it.count > 1 ? 's' : '')) : 'À faire — se coche dès le 1ᵉʳ enregistrement';
      return `<div class="vac-item ${done ? 'done' : ''}">
        <div class="vac-check">${done ? '✅' : '⬜'}</div>
        <div class="vac-item-main">
          <div class="vac-item-label">${it.icon || ''} ${esc(it.label)}</div>
          <div class="vac-item-sub">${esc(sub)}</div>
        </div>
        <span class="vac-auto">auto</span>
      </div>`;
    }).join('')}
    <div class="section-spacer"></div>`;
}

/* ── CHECKLIST D'UNE COMPAGNIE (contenu à venir) ── */
function openCompanyChecklist(code) {
  const c = companyByCode(code);
  if (!c) return;
  currentView = 'checklist';
  document.getElementById('headerTitle').textContent = c.nom;
  document.getElementById('headerSub').textContent = 'Checklist de contrôle vol';
  document.getElementById('tabBar').style.display = 'none';
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const sc = document.getElementById('screen-checklist');
  sc.classList.add('active'); sc.style.display = '';
  if (c.code === 'EK') {
    renderEKChecklist(c);
  } else if (FLIGHT_CHECKLISTS[c.code]) {
    renderChecklist(c);
  } else {
    document.getElementById('checklistBody').innerHTML = `
      <button class="btn-sm" style="margin-bottom:14px" onclick="openCompanies()">← Retour aux compagnies</button>
      <div class="checklist-head">
        <img src="${esc(c.logo)}" alt="${esc(c.nom)}">
        <div>
          <div class="checklist-title">${esc(c.nom)}</div>
          <div class="checklist-sub">Code ${esc(c.code)}</div>
        </div>
      </div>
      <div class="empty-state">
        <div class="empty-icon">🚧</div>
        <div class="empty-title">Checklist à venir</div>
        <div class="empty-sub">La checklist de contrôle du vol ${esc(c.nom)} (${esc(c.code)}) sera ajoutée prochainement.</div>
      </div>`;
  }
  renderNav();
  window.scrollTo(0, 0);
}

/* ═══════════════════════════════════════════════════════════
   CHECKLIST VOL EK (Emirates) — reprise du formulaire + PDF de
   l'app EKCHECK-PRO de l'agent. Saisie → génération PDF (fenêtre
   d'impression, même mise en page : en-tête bleu marine, cartes
   Personnel/Matériel vert/rouge, Chronologie, Observations, Images).
   ═══════════════════════════════════════════════════════════ */
function ekRow(inner) { return `<div class="form-field">${inner}</div>`; }
function ekText(id, label, attrs = '') {
  return ekRow(`<div class="field-label">${label}</div><input id="ek_${id}" class="field-input" ${attrs}>`);
}
function ekCheck(id, label, checked) {
  return `<label class="ek-check"><input type="checkbox" id="ek_${id}" ${checked ? 'checked' : ''}><span>${label}</span></label>`;
}
function ekCheckNum(id, label, checked, numId, numVal) {
  return `<div class="ek-check-num">
    <label class="ek-check"><input type="checkbox" id="ek_${id}" ${checked ? 'checked' : ''}><span>${label}</span></label>
    <input type="number" id="ek_${numId}" class="field-input ek-num" min="0" max="50" value="${numVal}">
  </div>`;
}

function ekFormHTML() {
  return `
  <div class="form-section">
    <div class="form-section-header"><span class="form-section-icon">✈️</span><span class="form-section-title">Informations du vol</span></div>
    ${ekText('flightNumber', 'Numéro de vol', 'placeholder="EK751" style="text-transform:uppercase" autocomplete="off"')}
    ${ekText('date', 'Date', 'type="date"')}
    ${ekText('eta', 'ETA', 'type="time"')}
    ${ekText('ata', 'ATA', 'type="time"')}
    ${ekRow(`<div class="field-label">Position</div>
      <select id="ek_position" class="field-select" onchange="toggleEKTransport()">
        <option value="accoste">Accosté</option>
        <option value="au_large">Au large</option>
      </select>`)}
    ${ekText('pkg', 'PKG', 'value="J01"')}
    ${ekText('editedBy', 'Édité par', 'placeholder="Nom du contrôleur" autocomplete="off"')}
  </div>

  <div class="form-section">
    <div class="form-section-header"><span class="form-section-icon">👥</span><span class="form-section-title">Personnel</span></div>
    <div class="form-field">
      ${ekCheckNum('agentsRampPresent', 'Agents Ramp', false, 'agentsRampCount', 3)}
      ${ekCheckNum('caristesArriveePresent', 'Caristes Arrivée', false, 'caristesArriveeCount', 5)}
      ${ekCheckNum('caristesDepartPresent', 'Caristes Départ', false, 'caristesDepartCount', 3)}
      ${ekCheckNum('bagagistesPresent', 'Bagagistes', false, 'bagagistesCount', 8)}
      ${ekCheckNum('wingWalkerPresent', 'Wing Walker', false, 'wingWalkerCount', 2)}
      ${ekCheck('pushbackPresent', 'Pushback', false)}
      ${ekCheck('eauPotablePresent', 'Eau Potable', false)}
      ${ekCheck('vidangePresent', 'Vidange', false)}
      ${ekCheck('conesCalesSecurite', 'Cônes et cales de sécurité', true)}
      ${ekCheck('verificationEngins', 'Vérification Engins', true)}
      ${ekCheck('inspectionSoutes', 'Inspection Soutes', true)}
    </div>
    ${ekText('plateforme', 'Plate-forme', 'placeholder="6356/6357" autocomplete="off"')}
    ${ekText('nrEauPotable', 'Citerne eau potable', 'placeholder="3040" autocomplete="off"')}
    ${ekText('porteConteneurs', 'Porte-conteneurs', 'type="number" min="0" max="50" value="0"')}
    ${ekText('portePalettes', 'Porte-palettes', 'type="number" min="0" max="50" value="0"')}
  </div>

  <div class="form-section conditional-section" id="ekTransport">
    <div class="form-section-header"><span class="form-section-icon">🚌</span><span class="form-section-title">Transport — Au large</span></div>
    <div class="form-field">
      ${ekCheck('nbrBusArrivee', 'Bus pax arrivée', true)}
      ${ekCheck('nbrNavetteFbArrivee', 'Navette pax F/J arrivée', true)}
      ${ekCheck('nbrBusDepart', 'Bus pax départ', true)}
      ${ekCheck('nbrNavetteFbDepart', 'Navette pax F/J départ', true)}
      ${ekCheck('escabeau', 'Escabeau', true)}
    </div>
  </div>

  <div class="form-section">
    <div class="form-section-header"><span class="form-section-icon">🕐</span><span class="form-section-title">Chronologie opérations</span></div>
    ${ekText('accordOuverturesSoutes', 'Accord Ouvertures Soutes', 'type="time"')}
    ${ekText('debutDechargement', 'Début Déchargement', 'type="time"')}
    ${ekText('finDechargement', 'Fin Déchargement', 'type="time"')}
    ${ekText('debutChargement', 'Début Chargement', 'type="time"')}
    ${ekText('finChargement', 'Fin Chargement', 'type="time"')}
    ${ekText('debutLivraison', 'Début Livraison', 'type="time"')}
    ${ekText('finLivraison', 'Fin Livraison', 'type="time"')}
  </div>

  <div class="form-section">
    <div class="form-section-header"><span class="form-section-icon">📝</span><span class="form-section-title">Observations & images</span></div>
    ${ekRow(`<div class="field-label">Observations</div><textarea id="ek_observations" class="field-input" style="resize:vertical;min-height:80px"></textarea>`)}
    <div class="form-field">
      <input type="file" id="ek_photoInput" accept="image/*" multiple style="display:none" onchange="onEKPhotos(this)">
      <button type="button" class="photo-btn" onclick="document.getElementById('ek_photoInput').click()">📷 Ajouter des images</button>
      <div class="photo-preview" id="ekPhotoPrev"></div>
    </div>
  </div>`;
}

function renderEKChecklist(c) {
  ekPhotos = [];
  document.getElementById('checklistBody').innerHTML = `
    <button class="btn-sm" style="margin-bottom:14px" onclick="openCompanies()">← Retour aux compagnies</button>
    <div class="checklist-head">
      <img src="${esc(c.logo)}" alt="${esc(c.nom)}">
      <div>
        <div class="checklist-title">${esc(c.nom)} — Fiche de vol</div>
        <div class="checklist-sub">Checklist de contrôle vol EK</div>
      </div>
    </div>
    ${ekFormHTML()}
    <button class="btn-submit" onclick="saveEKFlight()">➕ Enregistrer le vol</button>
    <button class="btn-export" style="margin:0 12px 12px;width:calc(100% - 24px)" onclick="generateEKPdf()">🖨️ Aperçu PDF (sans enregistrer)</button>

    <div class="form-section" style="margin-top:6px">
      <div class="form-section-header"><span class="form-section-icon">📋</span><span class="form-section-title">Vols enregistrés <span id="ekCount">0</span></span></div>
    </div>
    <div id="ekList"></div>
    <div class="section-spacer"></div>`;
  toggleEKTransport();
  loadEKFlights();
  renderEKList();
}

/* ── Persistance des vols EK ── */
function kEKFlights() { return STORE + ':ek:flights'; }
function loadEKFlights() { try { ekFlights = JSON.parse(localStorage.getItem(kEKFlights()) || '[]'); } catch (e) { ekFlights = []; } }
function saveEKFlightsStore() { localStorage.setItem(kEKFlights(), JSON.stringify(ekFlights)); }
function ekFlightById(id) { return ekFlights.find(f => f.id === id) || null; }

function saveEKFlight() {
  const f = readEKFlight();
  if (!f.flightNumber) { showToast('⚠️ Numéro de vol requis', false); return; }
  f.id = Date.now(); f.time = new Date().toTimeString().slice(0, 5); f.timestamp = Date.now();
  ekFlights.push(f);
  try { saveEKFlightsStore(); }
  catch (err) { ekFlights.pop(); showToast('⚠️ Stockage plein — supprimez des vols/images', false); return; }
  showToast('✅ Vol enregistré', true);
  renderEKChecklist(companyByCode('EK')); // réinitialise le formulaire + rafraîchit la liste
}
function deleteEKFlight(id) {
  ekFlights = ekFlights.filter(f => f.id !== id);
  saveEKFlightsStore();
  renderEKList();
}
function renderEKList() {
  const box = document.getElementById('ekList');
  const cnt = document.getElementById('ekCount');
  if (cnt) cnt.textContent = ekFlights.length;
  if (!box) return;
  if (!ekFlights.length) {
    box.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">Aucun vol enregistré</div><div class="empty-sub">Les vols EK saisis apparaîtront ici</div></div>`;
    return;
  }
  const sorted = [...ekFlights].sort((a, b) => b.timestamp - a.timestamp);
  box.innerHTML = sorted.map(f => {
    const d = f.date ? new Date(f.date + 'T12:00:00').toLocaleDateString('fr-FR') : '-';
    return `<div class="record-card">
      <div class="record-header">
        <div>
          <div class="record-name">${esc(f.flightNumber)}</div>
          <div class="record-meta">${d} · ${f.position === 'au_large' ? 'Au large' : 'Accosté'} · PKG ${esc(f.pkg)}</div>
        </div>
        <div class="badge" style="background:#1a237e;color:#fff;border:1px solid #1a237e">EK</div>
      </div>
      <div class="record-footer">
        <div class="record-time">🕐 ${esc(f.time)}</div>
        <div class="record-actions">
          <button class="btn-sm" onclick="downloadEKPdf(${f.id})" title="Télécharger le PDF">⬇️ PDF</button>
          <button class="btn-sm" onclick="shareEKPdf(${f.id})" title="Partager le PDF (WhatsApp, e-mail…)">📤 Partager</button>
          <button class="btn-sm" onclick="generateEKPdfById(${f.id})" title="Aperçu / impression">🖨️</button>
          <button class="btn-sm danger" onclick="deleteEKFlight(${f.id})">🗑️</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ── Partage texte d'un vol EK (WhatsApp / e-mail / natif) ──
   Le PDF visuel s'obtient via 🖨️ PDF ; mail/WhatsApp partagent un
   résumé texte (l'attachement direct du PDF n'est pas possible hors-ligne
   sans bibliothèque). Sur mobile, la boîte d'impression permet aussi de
   partager/enregistrer le PDF. */
function buildEKText(f) {
  const d = f.date ? new Date(f.date + 'T12:00:00').toLocaleDateString('fr-FR') : '-';
  const m = b => b ? '✓' : '✗';
  let t = `FICHE DE VOL ${f.flightNumber} — EMIRATES\n`;
  t += `===============================\n`;
  t += `Date: ${d}  |  Position: ${f.position === 'au_large' ? 'Au large' : 'Accosté'}  |  PKG: ${f.pkg || '-'}\n`;
  t += `ETA: ${f.eta || '-'}  |  ATA: ${f.ata || '-'}\n\n`;
  t += `PERSONNEL\n`;
  t += `- Agents Ramp: ${m(f.agentsRampPresent)} (${f.agentsRampPresent ? f.agentsRampCount : 0})\n`;
  t += `- Caristes Arrivée: ${m(f.caristesArriveePresent)} (${f.caristesArriveePresent ? f.caristesArriveeCount : 0})\n`;
  t += `- Caristes Départ: ${m(f.caristesDepartPresent)} (${f.caristesDepartPresent ? f.caristesDepartCount : 0})\n`;
  t += `- Bagagistes: ${m(f.bagagistesPresent)} (${f.bagagistesPresent ? f.bagagistesCount : 0})\n`;
  t += `- Wing Walker: ${m(f.wingWalkerPresent)} (${f.wingWalkerPresent ? f.wingWalkerCount : 0})\n`;
  t += `- Pushback: ${m(f.pushbackPresent)}  |  Inspection Soutes: ${m(f.inspectionSoutes)}\n\n`;
  t += `MATÉRIEL\n`;
  t += `- Cônes/cales: ${m(f.conesCalesSecurite)}  |  Vérif. Engins: ${m(f.verificationEngins)}\n`;
  t += `- Eau Potable: ${m(f.eauPotablePresent)} (citerne ${f.nrEauPotable || '-'})  |  Vidange: ${m(f.vidangePresent)}\n`;
  t += `- Plate-forme: ${f.plateforme || '-'}  |  Porte-conteneurs: ${f.porteConteneurs || 0}  |  Porte-palettes: ${f.portePalettes || 0}\n`;
  if (f.position === 'au_large') {
    t += `\nTRANSPORT (au large)\n`;
    t += `- Bus arrivée: ${m(f.nbrBusArrivee)}  |  Navette F/J arrivée: ${m(f.nbrNavetteFbArrivee)}\n`;
    t += `- Bus départ: ${m(f.nbrBusDepart)}  |  Navette F/J départ: ${m(f.nbrNavetteFbDepart)}  |  Escabeau: ${m(f.escabeau)}\n`;
  }
  t += `\nCHRONOLOGIE\n`;
  t += `- Accord ouv. soutes: ${f.accordOuverturesSoutes || '-'}\n`;
  t += `- Déchargement: ${f.debutDechargement || '-'} → ${f.finDechargement || '-'}\n`;
  t += `- Chargement: ${f.debutChargement || '-'} → ${f.finChargement || '-'}\n`;
  t += `- Livraison: ${f.debutLivraison || '-'} → ${f.finLivraison || '-'}\n`;
  if (f.observations) t += `\nOBSERVATIONS\n${f.observations}\n`;
  t += `\nÉdité par: ${f.editedBy || '-'}`;
  return t;
}
function shareEKWhatsApp(id) { const f = ekFlightById(id); if (f) window.open(`https://wa.me/?text=${encodeURIComponent(buildEKText(f))}`, '_blank'); }
function shareEKMail(id) {
  const f = ekFlightById(id); if (!f) return;
  window.location.href = `mailto:?subject=${encodeURIComponent('Fiche de vol ' + f.flightNumber + ' — Emirates')}&body=${encodeURIComponent(buildEKText(f))}`;
}
function shareEKNative(id) {
  const f = ekFlightById(id); if (!f) return;
  const text = buildEKText(f);
  if (navigator.share) navigator.share({ title: 'Fiche de vol ' + f.flightNumber, text });
  else navigator.clipboard.writeText(text).then(() => showToast('📋 Copié!', true));
}

function toggleEKTransport() {
  const sel = document.getElementById('ek_position');
  const sec = document.getElementById('ekTransport');
  if (sel && sec) sec.classList.toggle('show', sel.value === 'au_large');
}

function onEKPhotos(input) {
  const files = Array.from(input.files || []);
  let pending = files.length;
  if (!pending) return;
  files.forEach(f => fileToResizedDataURL(f, url => {
    if (url) ekPhotos.push({ name: f.name, url });
    if (--pending <= 0) renderEKPhotos();
  }));
  input.value = '';
}
function renderEKPhotos() {
  const box = document.getElementById('ekPhotoPrev');
  if (!box) return;
  box.innerHTML = ekPhotos.map((p, i) =>
    `<div class="photo-thumb" style="margin:6px 6px 0 0;display:inline-block">
      <img src="${p.url}" alt="${esc(p.name)}">
      <button type="button" class="photo-remove" onclick="removeEKPhoto(${i})">✕</button>
    </div>`).join('');
}
function removeEKPhoto(i) { ekPhotos.splice(i, 1); renderEKPhotos(); }

// Lecture du formulaire EK → objet flight (mêmes clés que l'app EKCHECK)
function readEKFlight() {
  const g = id => document.getElementById('ek_' + id);
  const v = id => { const e = g(id); return e ? e.value.trim() : ''; };
  const c = id => { const e = g(id); return e ? e.checked : false; };
  const n = id => { const e = g(id); return e ? (parseInt(e.value, 10) || 0) : 0; };
  return {
    flightNumber: v('flightNumber').toUpperCase(), date: v('date'), eta: v('eta'), ata: v('ata'),
    position: v('position') || 'accoste', pkg: v('pkg') || 'J01', editedBy: v('editedBy'),
    agentsRampPresent: c('agentsRampPresent'), agentsRampCount: n('agentsRampCount'),
    caristesArriveePresent: c('caristesArriveePresent'), caristesArriveeCount: n('caristesArriveeCount'),
    caristesDepartPresent: c('caristesDepartPresent'), caristesDepartCount: n('caristesDepartCount'),
    bagagistesPresent: c('bagagistesPresent'), bagagistesCount: n('bagagistesCount'),
    wingWalkerPresent: c('wingWalkerPresent'), wingWalkerCount: n('wingWalkerCount'),
    pushbackPresent: c('pushbackPresent'), eauPotablePresent: c('eauPotablePresent'), vidangePresent: c('vidangePresent'),
    conesCalesSecurite: c('conesCalesSecurite'), verificationEngins: c('verificationEngins'), inspectionSoutes: c('inspectionSoutes'),
    plateforme: v('plateforme'), nrEauPotable: v('nrEauPotable'),
    porteConteneurs: n('porteConteneurs'), portePalettes: n('portePalettes'),
    nbrBusArrivee: c('nbrBusArrivee'), nbrNavetteFbArrivee: c('nbrNavetteFbArrivee'),
    nbrBusDepart: c('nbrBusDepart'), nbrNavetteFbDepart: c('nbrNavetteFbDepart'), escabeau: c('escabeau'),
    accordOuverturesSoutes: v('accordOuverturesSoutes'), debutDechargement: v('debutDechargement'), finDechargement: v('finDechargement'),
    debutChargement: v('debutChargement'), finChargement: v('finChargement'), debutLivraison: v('debutLivraison'), finLivraison: v('finLivraison'),
    observations: v('observations'), uploadedImages: ekPhotos.slice(),
  };
}

const EK_PDF_CSS = `
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4; margin: 12mm; }
    .ekdoc { font-family: Arial, sans-serif; background: #f5f5f5; color: #000; margin: 0; padding: 24px; box-sizing: border-box; width: 794px; max-width: 794px; }
    .ekdoc .header { background: #1a237e; color: #fff; padding: 16px 18px; border-radius: 8px; display: flex; align-items: center; gap: 12px; margin-bottom: 18px; box-sizing: border-box; }
    .ekdoc .header .logo-slot { flex: 0 0 118px; display: flex; align-items: center; }
    .ekdoc .header .logo-slot.right { justify-content: flex-end; }
    .ekdoc .header .logo-slot img { max-height: 50px; max-width: 100%; background: #fff; border-radius: 6px; padding: 4px; box-sizing: border-box; }
    .ekdoc .header h1 { margin: 0; font-size: 22px; flex: 1; min-width: 0; text-align: center; }
    .ekdoc .card { background: #fff; padding: 18px 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 18px; page-break-inside: avoid; }
    .ekdoc .card h2 { color: #1a237e; margin: 0 0 14px; border-bottom: 2px solid #1a237e; padding-bottom: 8px; font-size: 17px; }
    .ekdoc table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    .ekdoc table td, .ekdoc table th { word-wrap: break-word; overflow-wrap: anywhere; }
    .ekdoc td { font-size: 13px; }
    .ekdoc .lbl { padding: 8px; border-bottom: 1px solid #eee; }
    .ekdoc .grid2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .ekdoc .footer { margin-top: 24px; border-top: 1px solid #ccc; padding-top: 10px; color: #666; font-size: 12px; text-align: center; }
`;
function buildEKReportBody(f) {
  const handlerLogo = new URL('images/logo.png', location.href).href;
  const compLogo = new URL('images/EK.png', location.href).href;
  const dateStr = f.date ? new Date(f.date + 'T12:00:00').toLocaleDateString('fr-FR') : '-';
  // cellule info/horaire : rose si vide
  const ic = val => `<td style="padding:8px;border-bottom:1px solid #eee;background:${val ? '#fff' : '#ffcdd2'};">${esc(val || '-')}</td>`;
  // case présence : vert si oui, rouge si non
  const pc = (label, ok, suffix = '') => `<div style="padding:10px;background:${ok ? '#e8f5e9' : '#ffebee'};border-radius:4px;font-size:13px;"><strong>${esc(label)}:</strong> ${ok ? '✓' : '✗'}${suffix}</div>`;
  // case valeur : vert si rempli, rose si vide/0
  const vc = (label, val) => `<div style="padding:10px;background:${val ? '#e8f5e9' : '#ffcdd2'};border-radius:4px;font-size:13px;"><strong>${esc(label)}:</strong> ${esc(val || (val === 0 ? '0' : '-'))}</div>`;

  const transport = f.position === 'au_large' ? `
    <div class="card">
      <h2>Transport</h2>
      <div class="grid2">
        ${pc('Bus pax arrivée', f.nbrBusArrivee)}
        ${pc('Navette pax F/J arrivée', f.nbrNavetteFbArrivee)}
        ${pc('Bus pax départ', f.nbrBusDepart)}
        ${pc('Navette pax F/J départ', f.nbrNavetteFbDepart)}
        ${pc('Escabeau', f.escabeau)}
      </div>
    </div>` : '';

  const observations = f.observations ? `
    <div class="card">
      <h2>Observations</h2>
      <div style="padding:10px;background:#f8f9fa;border-radius:4px;white-space:pre-wrap;font-size:13px;">${esc(f.observations)}</div>
    </div>` : '';

  const images = (f.uploadedImages && f.uploadedImages.length) ? `
    <div class="card">
      <h2>Images</h2>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:8px;">
        ${f.uploadedImages.map(im => `<div style="text-align:center;">
          <img src="${im.url}" style="max-width:100%;max-height:300px;object-fit:contain;border-radius:4px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
          <div style="margin-top:8px;font-size:11px;color:#666;">${esc(im.name)}</div>
        </div>`).join('')}
      </div>
    </div>` : '';

  return `<div class="ekdoc">
  <div class="header">
    <div class="logo-slot"><img src="${handlerLogo}" alt="RAM Handling"></div>
    <h1>Fiche de Vol - ${esc(f.flightNumber || '')}</h1>
    <div class="logo-slot right"><img src="${compLogo}" alt="Emirates"></div>
  </div>

  <div class="card">
    <h2>Informations du Vol</h2>
    <table>
      <tr><td class="lbl" style="width:25%"><strong>Numéro de Vol:</strong></td>${ic(f.flightNumber)}<td class="lbl" style="width:25%"><strong>Date:</strong></td>${ic(dateStr === '-' ? '' : dateStr)}</tr>
      <tr><td class="lbl"><strong>ETA:</strong></td>${ic(f.eta)}<td class="lbl"><strong>ATA:</strong></td>${ic(f.ata)}</tr>
      <tr><td class="lbl"><strong>Position:</strong></td><td class="lbl" style="background:#fff">${f.position === 'au_large' ? 'Au large' : 'Accosté'}</td><td class="lbl"><strong>PKG:</strong></td>${ic(f.pkg)}</tr>
      <tr><td class="lbl"><strong>Édité par:</strong></td><td class="lbl" colspan="3" style="background:${f.editedBy ? '#fff' : '#ffcdd2'}">${esc(f.editedBy || '-')}</td></tr>
    </table>
  </div>

  <div class="card">
    <h2>Personnel</h2>
    <div class="grid2">
      ${pc('Agents Ramp', f.agentsRampPresent, ` (${f.agentsRampPresent ? f.agentsRampCount : 0})`)}
      ${pc('Bagagistes', f.bagagistesPresent, ` (${f.bagagistesPresent ? f.bagagistesCount : 0})`)}
      ${pc('Caristes Arrivée', f.caristesArriveePresent, ` (${f.caristesArriveePresent ? f.caristesArriveeCount : 0})`)}
      ${pc('Caristes Départ', f.caristesDepartPresent, ` (${f.caristesDepartPresent ? f.caristesDepartCount : 0})`)}
      ${pc('Wing Walker', f.wingWalkerPresent, ` (${f.wingWalkerPresent ? f.wingWalkerCount : 0})`)}
      ${pc('Pushback', f.pushbackPresent)}
      ${pc('Inspection Soutes', f.inspectionSoutes)}
    </div>
  </div>

  <div class="card">
    <h2>Matériel</h2>
    <div class="grid2">
      ${pc('Cônes et cales de sécurité', f.conesCalesSecurite)}
      ${pc('Eau Potable', f.eauPotablePresent)}
      ${vc('Citerne eau potable', f.nrEauPotable)}
      ${pc('Vidange', f.vidangePresent)}
      ${vc('Plate-forme', f.plateforme)}
      ${vc('Porte-conteneurs', f.porteConteneurs)}
      ${vc('Porte-palettes', f.portePalettes)}
      ${pc('Vérification Engins', f.verificationEngins)}
    </div>
  </div>

  ${transport}

  <div class="card">
    <h2>Chronologie Operations</h2>
    <table>
      <tr><td class="lbl" style="width:50%"><strong>Accord Ouvertures Soutes:</strong></td>${ic(f.accordOuverturesSoutes)}</tr>
      <tr><td class="lbl"><strong>Début Déchargement:</strong></td>${ic(f.debutDechargement)}</tr>
      <tr><td class="lbl"><strong>Fin Déchargement:</strong></td>${ic(f.finDechargement)}</tr>
      <tr><td class="lbl"><strong>Début Chargement:</strong></td>${ic(f.debutChargement)}</tr>
      <tr><td class="lbl"><strong>Fin Chargement:</strong></td>${ic(f.finChargement)}</tr>
      <tr><td class="lbl"><strong>Début Livraison:</strong></td>${ic(f.debutLivraison)}</tr>
      <tr><td class="lbl"><strong>Fin Livraison:</strong></td>${ic(f.finLivraison)}</tr>
    </table>
  </div>

  ${observations}
  ${images}

  <div class="footer">Préparé par Ramp Cmn — ${new Date().getFullYear()}</div>
  </div>`;
}

function buildEKReportHTML(f) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Fiche de Vol - ${esc(f.flightNumber || 'EK')}</title><style>${EK_PDF_CSS}</style></head><body>${buildEKReportBody(f)}</body></html>`;
}

function printEKFlight(f) {
  const w = window.open('', '_blank');
  if (!w) { showToast('⚠️ Autorisez les fenêtres pop-up', false); return; }
  w.document.write(buildEKReportHTML(f));
  w.document.close();
  setTimeout(() => w.print(), 600);
}
function generateEKPdf() {
  const f = readEKFlight();
  if (!f.flightNumber) { showToast('⚠️ Numéro de vol requis', false); return; }
  printEKFlight(f);
}
function generateEKPdfById(id) { const f = ekFlightById(id); if (f) printEKFlight(f); }

/* ── Vrai fichier PDF via html2pdf (bibliothèque vendorisée, hors-ligne) ── */
function ekPdfFilename(f) {
  const d = f.date ? new Date(f.date + 'T12:00:00').toLocaleDateString('fr-FR').replace(/\//g, '-') : '';
  return `fiche_vol_${(f.flightNumber || 'EK')}${d ? '_' + d : ''}.pdf`;
}
function ekPdfWorker(f) {
  const el = document.createElement('div');
  el.style.width = '794px'; // ~ largeur A4 à 96 dpi
  el.style.background = '#f5f5f5';
  el.innerHTML = `<style>${EK_PDF_CSS}</style>${buildEKReportBody(f)}`;
  const opt = {
    margin: 0, // marges gérées par le padding interne du document → évite le rognage à droite
    filename: ekPdfFilename(f),
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#f5f5f5', width: 794, windowWidth: 794 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };
  return window.html2pdf().set(opt).from(el);
}
// Télécharge le vrai .pdf d'un vol enregistré
function downloadEKPdf(id) {
  const f = ekFlightById(id); if (!f) return;
  if (!window.html2pdf) { printEKFlight(f); return; } // repli si la lib n'est pas chargée
  showToast('⏳ Génération du PDF…', true);
  Promise.resolve(ekPdfWorker(f).save()).catch(() => showToast('⚠️ Erreur PDF', false));
}
// Partage le vrai fichier PDF via la feuille de partage native (WhatsApp, e-mail…)
async function shareEKPdf(id) {
  const f = ekFlightById(id); if (!f) return;
  if (!window.html2pdf) { shareEKNative(id); return; }
  try {
    showToast('⏳ Génération du PDF…', true);
    const blob = await ekPdfWorker(f).outputPdf('blob');
    const file = new File([blob], ekPdfFilename(f), { type: 'application/pdf' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Fiche de vol ' + f.flightNumber, text: 'Fiche de vol ' + f.flightNumber + ' — Emirates' });
    } else {
      Promise.resolve(ekPdfWorker(f).save()); // bureau / sans partage de fichier : téléchargement
      showToast('PDF téléchargé (partage de fichier non dispo ici)', true);
    }
  } catch (err) {
    if (err && err.name === 'AbortError') return; // partage annulé
    showToast('⚠️ Erreur PDF', false);
  }
}

/* ═══════════════════════════════════════════════════════════
   CHECKLIST DE VOL STANDARD (générique) — ex. vol TO (TUI fly).
   Points à vérifier C/NC + remarques + en-tête d'identification.
   Reprend le principe EK : saisie → enregistrement → liste → PDF/partage.
   ═══════════════════════════════════════════════════════════ */
function clKey(code) { return STORE + ':cl:' + code + ':records'; }
function loadClRecords(code) { try { clRecords = JSON.parse(localStorage.getItem(clKey(code)) || '[]'); } catch (e) { clRecords = []; } }
function saveClRecordsStore() { localStorage.setItem(clKey(clCompany.code), JSON.stringify(clRecords)); }
function clRecordById(id) { return clRecords.find(r => r.id === id) || null; }

function renderChecklist(company) {
  clCompany = company;
  clCfg = FLIGHT_CHECKLISTS[company.code];
  const idHTML = clCfg.idFields.map(f => {
    const input = f.type === 'select'
      ? `<select id="cl_${f.id}" class="field-select"><option value="">— Sélectionner —</option>${(f.options || []).map(o => `<option>${esc(o)}</option>`).join('')}</select>`
      : `<input id="cl_${f.id}" class="field-input" ${f.type === 'date' ? 'type="date"' : 'autocomplete="off"'}>`;
    return ekRow(`<div class="field-label">${esc(f.label)}</div>${input}`);
  }).join('');
  const ptsHTML = clCfg.points.map((p, i) => `
    <div class="cl-point">
      <div class="cl-point-label">${i + 1}. ${esc(p)}</div>
      <div class="cl-point-row">
        <select id="cl_status_${i}" class="field-select cl-status">
          <option value="">—</option>
          <option value="C">C (Conforme)</option>
          <option value="NC">NC (Non conforme)</option>
          <option value="NA">NA (Non applicable)</option>
        </select>
        <input id="cl_remark_${i}" class="field-input" placeholder="Remarque" autocomplete="off">
      </div>
    </div>`).join('');
  document.getElementById('checklistBody').innerHTML = `
    <button class="btn-sm" style="margin-bottom:14px" onclick="openCompanies()">← Retour aux compagnies</button>
    <div class="checklist-head">
      <img src="${esc(company.logo)}" alt="${esc(company.nom)}">
      <div>
        <div class="checklist-title">${esc(clCfg.title)}</div>
        <div class="checklist-sub">${esc(company.nom)} · vol ${esc(clCfg.flightCode)}</div>
      </div>
    </div>
    <div class="form-section">
      <div class="form-section-header"><span class="form-section-icon">🪪</span><span class="form-section-title">Identification</span></div>
      ${idHTML}
    </div>
    <div class="form-section">
      <div class="form-section-header"><span class="form-section-icon">✅</span><span class="form-section-title">Points à vérifier</span></div>
      ${ptsHTML}
    </div>
    ${clCfg.hasObservations ? `<div class="form-section">
      <div class="form-section-header"><span class="form-section-icon">🗒️</span><span class="form-section-title">Observations</span></div>
      ${ekRow(`<textarea id="cl_observations" class="field-input" style="resize:vertical;min-height:90px" placeholder="Observations générales…"></textarea>`)}
    </div>` : ''}
    <button class="btn-submit" onclick="saveChecklistRecord()">➕ Enregistrer le contrôle</button>
    <button class="btn-export" style="margin:0 12px 12px;width:calc(100% - 24px)" onclick="previewClPdf()">🖨️ Aperçu PDF (sans enregistrer)</button>
    <div class="form-section" style="margin-top:6px">
      <div class="form-section-header"><span class="form-section-icon">📋</span><span class="form-section-title">Contrôles enregistrés <span id="clCount">0</span></span></div>
    </div>
    <div id="clList"></div>
    <div class="section-spacer"></div>`;
  loadClRecords(company.code);
  renderClList();
}

function readChecklist() {
  const values = {};
  clCfg.idFields.forEach(f => { const e = document.getElementById('cl_' + f.id); values[f.id] = e ? e.value.trim() : ''; });
  const points = clCfg.points.map((p, i) => {
    const s = document.getElementById('cl_status_' + i);
    const r = document.getElementById('cl_remark_' + i);
    return { text: p, status: s ? s.value : '', remark: r ? r.value.trim() : '' };
  });
  const obs = document.getElementById('cl_observations');
  return { values, points, observations: obs ? obs.value.trim() : '' };
}

function saveChecklistRecord() {
  const rec = readChecklist();
  if (!rec.values.date) { showToast('⚠️ Date requise', false); return; }
  rec.id = Date.now(); rec.time = new Date().toTimeString().slice(0, 5); rec.timestamp = Date.now();
  rec.companyCode = clCompany.code;
  clRecords.push(rec);
  try { saveClRecordsStore(); }
  catch (err) { clRecords.pop(); showToast('⚠️ Stockage plein', false); return; }
  showToast('✅ Contrôle enregistré', true);
  renderChecklist(clCompany); // réinitialise le formulaire + rafraîchit la liste
}
function deleteClRecord(id) {
  clRecords = clRecords.filter(r => r.id !== id);
  saveClRecordsStore();
  renderClList();
}
function renderClList() {
  const box = document.getElementById('clList');
  const cnt = document.getElementById('clCount');
  if (cnt) cnt.textContent = clRecords.length;
  if (!box) return;
  if (!clRecords.length) {
    box.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">Aucun contrôle enregistré</div></div>`;
    return;
  }
  const sorted = [...clRecords].sort((a, b) => b.timestamp - a.timestamp);
  box.innerHTML = sorted.map(r => {
    const v = r.values || {};
    const d = v.date ? new Date(v.date + 'T12:00:00').toLocaleDateString('fr-FR') : '-';
    const title = v.imm || v.type_avion || (clCfg.flightCode);
    const nc = (r.points || []).filter(p => p.status === 'NC').length;
    const bColor = nc ? '#EF4444' : '#22C55E';
    const bLabel = nc ? (nc + ' NC') : 'Conforme';
    return `<div class="record-card">
      <div class="record-header">
        <div>
          <div class="record-name">${esc(title)}</div>
          <div class="record-meta">${d}${v.type_avion ? ' · ' + esc(v.type_avion) : ''}</div>
        </div>
        <div class="badge" style="background:${rgba(bColor, 0.12)};color:${bColor};border:1px solid ${rgba(bColor, 0.3)}">${esc(bLabel)}</div>
      </div>
      <div class="record-footer">
        <div class="record-time">🕐 ${esc(r.time)}</div>
        <div class="record-actions">
          <button class="btn-sm" onclick="downloadClPdf(${r.id})" title="Télécharger le PDF">⬇️ PDF</button>
          <button class="btn-sm" onclick="shareClPdf(${r.id})" title="Partager le PDF">📤 Partager</button>
          <button class="btn-sm" onclick="printClById(${r.id})" title="Aperçu / impression">🖨️</button>
          <button class="btn-sm danger" onclick="deleteClRecord(${r.id})">🗑️</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ── PDF / impression checklist ── */
const CL_PDF_CSS = `
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4; margin: 12mm; }
    .cldoc { font-family: Arial, sans-serif; background: #f5f5f5; color: #000; margin: 0; padding: 24px; box-sizing: border-box; width: 794px; max-width: 794px; }
    .cldoc .header { background: #1a237e; color: #fff; padding: 16px 18px; border-radius: 8px; display: flex; align-items: center; gap: 12px; margin-bottom: 18px; box-sizing: border-box; }
    .cldoc .header .logo-slot { flex: 0 0 118px; display: flex; align-items: center; }
    .cldoc .header .logo-slot.right { justify-content: flex-end; }
    .cldoc .header .logo-slot img { max-height: 50px; max-width: 100%; background: #fff; border-radius: 6px; padding: 4px; box-sizing: border-box; }
    .cldoc .header h1 { margin: 0; font-size: 22px; flex: 1; min-width: 0; text-align: center; }
    .cldoc .card { background: #fff; padding: 18px 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 18px; page-break-inside: avoid; }
    .cldoc .card h2 { color: #1a237e; margin: 0 0 14px; border-bottom: 2px solid #1a237e; padding-bottom: 8px; font-size: 17px; }
    .cldoc table td, .cldoc table th { word-wrap: break-word; overflow-wrap: anywhere; }
    .cldoc .info { width: 100%; border-collapse: collapse; table-layout: fixed; }
    .cldoc .info td { padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; }
    .cldoc .pts { width: 100%; border-collapse: collapse; }
    .cldoc .pts th { background: #1a237e; color: #fff; text-align: left; padding: 9px 8px; font-size: 13px; }
    .cldoc .pts td { padding: 9px 8px; border-bottom: 1px solid #eee; font-size: 13px; vertical-align: top; }
    .cldoc .pts .st { text-align: center; font-weight: bold; width: 86px; }
    .cldoc .pts .rm { width: 34%; color: #1a237e; }
    .cldoc .obsbox { padding: 10px; background: #f8f9fa; border-radius: 4px; font-size: 13px; line-height: 1.5; white-space: pre-wrap; }
`;
function buildChecklistBody(rec) {
  const cfg = FLIGHT_CHECKLISTS[rec.companyCode] || clCfg;
  const comp = companyByCode(rec.companyCode);
  const ramLogo = new URL('images/logo.png', location.href).href;
  const compLogo = new URL((comp && comp.logo) || 'images/logotui.jpg', location.href).href;
  const v = rec.values || {};
  const dateStr = v.date ? new Date(v.date + 'T12:00:00').toLocaleDateString('fr-FR') : '';
  const year = v.date ? new Date(v.date + 'T12:00:00').getFullYear() : new Date().getFullYear();

  const valOf = f => f.type === 'date' ? dateStr : (v[f.id] || '');
  const pair = f => `<td style="width:16%"><strong>${esc(f.label)} :</strong></td><td style="width:17%">${esc(valOf(f))}</td>`;
  let infoRows = '';
  for (let i = 0; i < cfg.idFields.length; i += 3) {
    infoRows += `<tr>${cfg.idFields.slice(i, i + 3).map(pair).join('')}</tr>`;
  }
  infoRows += `<tr><td><strong>Prestation :</strong></td><td>${esc(cfg.prest)}</td><td><strong>Réf :</strong></td><td>${esc(cfg.ref)}</td><td><strong>Année :</strong></td><td>${year}</td></tr>`;

  const stMap = { C: { bg: '#c8e6c9', sym: '✓' }, NC: { bg: '#ffcdd2', sym: '✗' }, NA: { bg: '#fff3cd', sym: 'NA' } };
  const ptsRows = (rec.points || []).map(p => {
    const m = stMap[p.status] || { bg: '#fff', sym: '—' };
    return `<tr><td class="pt">${esc(p.text)}</td><td class="st" style="background:${m.bg}">${m.sym}</td><td class="rm">${esc(p.remark || '')}</td></tr>`;
  }).join('');
  const obsBlock = rec.observations ? `<div class="card"><h2>Observations</h2><div class="obsbox">${esc(rec.observations)}</div></div>` : '';

  return `<div class="cldoc">
    <div class="header">
      <div class="logo-slot"><img src="${ramLogo}" alt="RAM Handling"></div>
      <h1>${esc(cfg.title)}</h1>
      <div class="logo-slot right"><img src="${compLogo}" alt="${esc(comp ? comp.nom : '')}"></div>
    </div>
    <div class="card">
      <h2>Informations du contrôle</h2>
      <table class="info">${infoRows}</table>
    </div>
    <div class="card">
      <h2>Les points à vérifier par l'utilisateur</h2>
      <table class="pts">
        <tr><th class="pt">Points de vérification</th><th class="st">C/NC/NA</th><th class="rm">Remarques</th></tr>
        ${ptsRows}
      </table>
    </div>
    ${obsBlock}
  </div>`;
}
function buildChecklistHTML(rec) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${esc((FLIGHT_CHECKLISTS[rec.companyCode] || clCfg).title)}</title><style>${CL_PDF_CSS}</style></head><body>${buildChecklistBody(rec)}</body></html>`;
}
function printChecklist(rec) {
  const w = window.open('', '_blank');
  if (!w) { showToast('⚠️ Autorisez les fenêtres pop-up', false); return; }
  w.document.write(buildChecklistHTML(rec));
  w.document.close();
  setTimeout(() => w.print(), 600);
}
function previewClPdf() {
  const rec = readChecklist();
  rec.companyCode = clCompany.code;
  printChecklist(rec);
}
function printClById(id) { const r = clRecordById(id); if (r) printChecklist(r); }

function clPdfFilename(rec) {
  const cfg = FLIGHT_CHECKLISTS[rec.companyCode] || clCfg;
  const v = rec.values || {};
  const d = v.date ? new Date(v.date + 'T12:00:00').toLocaleDateString('fr-FR').replace(/\//g, '-') : '';
  const ref = v.imm || v.type_avion || '';
  return `controle_vol_${cfg.flightCode}${ref ? '_' + ref : ''}${d ? '_' + d : ''}.pdf`.replace(/\s+/g, '');
}
function clPdfWorker(rec) {
  const el = document.createElement('div');
  el.style.width = '794px';
  el.style.background = '#fff';
  el.innerHTML = `<style>${CL_PDF_CSS}</style>${buildChecklistBody(rec)}`;
  const opt = {
    margin: 0, // marges gérées par le padding interne du document → évite le rognage à droite
    filename: clPdfFilename(rec),
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#fff', width: 794, windowWidth: 794 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };
  return window.html2pdf().set(opt).from(el);
}
function downloadClPdf(id) {
  const r = clRecordById(id); if (!r) return;
  if (!window.html2pdf) { printChecklist(r); return; }
  showToast('⏳ Génération du PDF…', true);
  Promise.resolve(clPdfWorker(r).save()).catch(() => showToast('⚠️ Erreur PDF', false));
}
function buildClText(rec) {
  const cfg = FLIGHT_CHECKLISTS[rec.companyCode] || clCfg;
  const v = rec.values || {};
  const d = v.date ? new Date(v.date + 'T12:00:00').toLocaleDateString('fr-FR') : '-';
  let t = `${cfg.title.toUpperCase()} — RAM HANDLING\n===============================\n`;
  t += `Date: ${d} | Type avion: ${v.type_avion || '-'} | Imm: ${v.imm || '-'}\n`;
  t += `ESC: ${v.n_esc || '-'} ${v.aramp1 || ''} | BC4: ${v.n_bc4 || '-'} ${v.aramp2 || ''} | GPU: ${v.n_gpu || '-'} ${v.cariste || ''}\n\n`;
  t += `POINTS À VÉRIFIER\n`;
  (rec.points || []).forEach((p, i) => { t += `${i + 1}. [${p.status || '-'}] ${p.text}${p.remark ? ' — ' + p.remark : ''}\n`; });
  if (rec.observations) t += `\nOBSERVATIONS\n${rec.observations}\n`;
  return t;
}
async function shareClPdf(id) {
  const r = clRecordById(id); if (!r) return;
  if (!window.html2pdf) {
    if (navigator.share) navigator.share({ title: clPdfFilename(r), text: buildClText(r) });
    else navigator.clipboard.writeText(buildClText(r)).then(() => showToast('📋 Copié!', true));
    return;
  }
  try {
    showToast('⏳ Génération du PDF…', true);
    const blob = await clPdfWorker(r).outputPdf('blob');
    const file = new File([blob], clPdfFilename(r), { type: 'application/pdf' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: clPdfFilename(r), text: (FLIGHT_CHECKLISTS[r.companyCode] || clCfg).title });
    } else {
      Promise.resolve(clPdfWorker(r).save());
      showToast('PDF téléchargé (partage de fichier non dispo ici)', true);
    }
  } catch (err) {
    if (err && err.name === 'AbortError') return;
    showToast('⚠️ Erreur PDF', false);
  }
}

function updateBanner() {
  document.getElementById('bannerAgent').textContent = session.agent || '—';
  const d = session.date ? new Date(session.date + 'T12:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
  document.getElementById('bannerMeta').textContent = `${d} • ${session.vacation} • ${currentPlan.nom}`;
}

/* ── SIDEBAR ── */
function renderNav() {
  document.getElementById('sidebarNav').innerHTML = CONTROL_PLANS.map(p => {
    const active = currentView === 'plan' && currentPlan && p.id === currentPlan.id;
    const count = recordCountOf(p.id);
    let html = `<div class="nav-item ${active ? 'active' : ''}" onclick="switchPlan('${p.id}')">
      <span class="nav-icon">${p.icon}</span>
      <span class="nav-label">${esc(p.nom)}</span>
      <span class="nav-count">${count}</span>
    </div>`;
    // Plan à recensement : déplie deux sous-entrées quand il est ouvert
    if (p.general && active) {
      html += `<div class="nav-subitem ${currentSub === 'general' ? 'active' : ''}" onclick="openPlanSub('${p.id}','general')">
        <span class="nav-icon">📊</span><span class="nav-label">Général</span>
      </div>
      <div class="nav-subitem ${currentSub === 'controle' ? 'active' : ''}" onclick="openPlanSub('${p.id}','controle')">
        <span class="nav-icon">📋</span><span class="nav-label">Contrôle visé</span>
      </div>`;
    }
    return html;
  }).join('');

  const ref = document.getElementById('sidebarNavRef');
  if (ref) {
    const onComp = currentView === 'compagnies' || currentView === 'checklist';
    ref.innerHTML = `<div class="nav-item ${onComp ? 'active' : ''}" onclick="openCompanies()">
      <span class="nav-icon">🏢</span>
      <span class="nav-label">Contrôle compagnies</span>
      <span class="nav-count">${COMPANIES.length}</span>
    </div>`;
  }

  const top = document.getElementById('sidebarNavTop');
  if (top) {
    top.innerHTML = `<div class="nav-item ${currentView === 'mychecklist' ? 'active' : ''}" onclick="openControllerChecklist()">
      <span class="nav-icon">🗓️</span>
      <span class="nav-label">Ma checklist vacation</span>
      <span class="nav-count">${controllerDoneFraction()}</span>
    </div>`;
  }

  const ss = document.getElementById('sidebarSession');
  if (ss) {
    const d = session.date ? new Date(session.date + 'T12:00:00').toLocaleDateString('fr-FR') : '—';
    ss.innerHTML = `👤 ${esc(session.agent || '—')}<br>📅 ${d} · ${esc(session.vacation || '')}`;
  }
}
function toggleSidebar() {
  document.getElementById('sidebar').classList.contains('open') ? closeSidebar() : openSidebar();
}
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarBackdrop').classList.add('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').classList.remove('open');
}

/* ── FORM (généré depuis la config) ── */
function fieldInputHTML(f) {
  if (f.type === 'conformity') {
    return `<div class="conformity-toggle">
      <button type="button" class="conf-btn conf-ok" data-val="Conforme" onclick="setConformity(this)">✅ Conforme</button>
      <button type="button" class="conf-btn conf-no" data-val="Non conforme" onclick="setConformity(this)">⛔ Non conforme</button>
    </div>`;
  }
  if (f.type === 'select') {
    const opts = f.dependsOn ? [] : (f.options || []); // dépendant : options remplies au choix du parent
    let html = `<select class="field-select" id="f_${f.id}" onchange="onSelectChange(this)">
      <option value="">${esc(f.placeholder || '— Sélectionner —')}</option>
      ${opts.map(o => `<option>${esc(o)}</option>`).join('')}
    </select>`;
    // Saisie libre révélée quand « AUTRE » est choisi
    if (f.allowOther) {
      html += `<input type="text" class="field-input" id="f_${f.id}_other" placeholder="${esc(f.otherPlaceholder || 'Précisez…')}" autocomplete="off" style="display:none;margin-top:8px;">`;
    }
    return html;
  }
  if (f.type === 'checkboxes') {
    // Choix multiple : le contrôleur peut cocher les deux ou un seul.
    return `<div class="checkbox-group" id="f_${f.id}">
      ${(f.options || []).map(o => `<label class="checkbox-item">
        <input type="checkbox" value="${esc(o)}"> <span>${esc(o)}</span>
      </label>`).join('')}
    </div>`;
  }
  if (f.type === 'textarea') {
    return `<textarea class="field-input" id="f_${f.id}" placeholder="${esc(f.placeholder || '')}" style="resize:vertical;min-height:70px;"></textarea>`;
  }
  if (f.type === 'photo') {
    return `<div class="photo-field">
      <input type="file" id="f_${f.id}" accept="image/*" capture="environment" style="display:none" onchange="onPhotoChange(this,'${f.id}')">
      <button type="button" class="photo-btn" onclick="document.getElementById('f_${f.id}').click()">📷 Ajouter une photo</button>
      <div class="photo-preview" id="prev_${f.id}"></div>
    </div>`;
  }
  return `<input type="${f.type || 'text'}" class="field-input" id="f_${f.id}" placeholder="${esc(f.placeholder || '')}" autocomplete="off">`;
}

/* ── ONGLET « GÉNÉRAL » : recensement de la vacation (1 fiche / vacation) ── */
function loadGeneral(id) { try { return JSON.parse(localStorage.getItem(kGeneral(id)) || '{}'); } catch (e) { return {}; } }

// À l'ouverture d'un plan à recensement : on démarre sur « Général » par défaut
function setupGeneralTab() {
  showSaisieSub(currentPlan && currentPlan.general ? 'general' : 'controle');
}

// Choix Contrôle / Général depuis le sidebar
function openPlanSub(id, sub) {
  if (currentView !== 'plan' || !currentPlan || currentPlan.id !== id) openPlan(id);
  showTab('saisie');
  showSaisieSub(sub);
  renderNav();
  closeSidebar();
  window.scrollTo(0, 0);
}

function showSaisieSub(which) {
  const isGen = which === 'general';
  currentSub = isGen ? 'general' : 'controle';
  const ctrl = document.getElementById('saisieControle');
  const gen = document.getElementById('saisieGeneral');
  if (ctrl) ctrl.style.display = isGen ? 'none' : '';
  if (gen) gen.style.display = isGen ? '' : 'none';
  if (isGen) renderGeneral();
  // En-tête : reflète la sous-vue pour les plans à recensement
  if (currentPlan && currentPlan.general) {
    const sub = document.getElementById('headerSub');
    if (sub) sub.textContent = isGen ? (currentPlan.general.title || 'Recensement') : (currentPlan.subtitle || 'Contrôle Qualité');
  }
}

function renderGeneral() {
  const cfg = currentPlan && currentPlan.general;
  const box = document.getElementById('generalSection');
  if (!cfg || !box) return;
  const data = loadGeneral(currentPlan.id);
  const veh = data.vehicles || {};
  const pers = data.personnel || {};
  const vv = id => (veh[id] != null ? veh[id] : '');
  const pv = (t, s) => (pers[t] && pers[t][s] != null ? pers[t][s] : '');
  box.innerHTML = `
    <div class="gen-block">
      <div class="gen-block-title">🚌 Moyens de transport disponibles</div>
      ${cfg.vehicles.map(v => `
        <div class="gen-row">
          <label for="gveh_${v.id}">${esc(v.label)}</label>
          <input type="number" inputmode="numeric" min="0" class="field-input gen-num" id="gveh_${v.id}" value="${vv(v.id)}" placeholder="0">
        </div>`).join('')}
    </div>
    <div class="gen-block">
      <div class="gen-block-title">👥 Personnel par shift (nombre d'agents)</div>
      <table class="gen-table">
        <thead><tr><th>Type</th>${cfg.shifts.map(s => `<th>${esc(s.label)}</th>`).join('')}</tr></thead>
        <tbody>
          ${cfg.vehicles.map(v => `<tr>
            <td>${esc(v.label)}</td>
            ${cfg.shifts.map(s => `<td><input type="number" inputmode="numeric" min="0" class="field-input" id="gper_${v.id}_${s.id}" value="${pv(v.id, s.id)}" placeholder="0"></td>`).join('')}
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function saveGeneral() {
  const cfg = currentPlan && currentPlan.general;
  if (!cfg) return;
  const num = el => { const n = el ? parseInt(el.value, 10) : 0; return isNaN(n) ? 0 : n; };
  const vehicles = {};
  cfg.vehicles.forEach(v => { const n = num(document.getElementById('gveh_' + v.id)); if (n) vehicles[v.id] = n; });
  const personnel = {};
  cfg.vehicles.forEach(v => cfg.shifts.forEach(s => {
    const n = num(document.getElementById('gper_' + v.id + '_' + s.id));
    if (n) { (personnel[v.id] = personnel[v.id] || {})[s.id] = n; }
  }));
  localStorage.setItem(kGeneral(currentPlan.id), JSON.stringify({ vehicles, personnel, savedAt: Date.now() }));
  showToast('✅ Recensement enregistré');
}

function buildForm() {
  document.getElementById('formSections').innerHTML = currentPlan.sections.map(sec => `
    <div class="form-section ${sec.conditional ? 'conditional-section' : ''}">
      <div class="form-section-header">
        <span class="form-section-icon">${sec.icon}</span>
        <span class="form-section-title">${esc(sec.title)}</span>
      </div>
      ${sec.categories ? `<div class="form-field"><div class="chips-grid" id="infractionChips"></div></div>` : ''}
      ${sec.fields.map(f => `
        <div class="form-field">
          ${f.label ? `<div class="field-label">${esc(f.label)}</div>` : ''}
          ${fieldInputHTML(f)}
        </div>`).join('')}
    </div>
  `).join('');
  if (currentPlan.sections.some(s => s.categories)) renderChips();
  selectedCategoryId = '';
  selectedCategoryIds = [];
  selectedConformity = '';
  capturedPhotos = {};
}

// Selects dépendants : recharge les options d'un champ selon la valeur du champ parent
function onSelectChange(el) {
  const parentId = el.id.replace(/^f_/, '');
  // Champ « AUTRE » : affiche/masque la saisie libre associée
  const self = allFields().find(f => f.id === parentId);
  if (self && self.allowOther) {
    const other = document.getElementById('f_' + parentId + '_other');
    if (other) {
      const show = el.value === (self.otherValue || 'AUTRE');
      other.style.display = show ? '' : 'none';
      if (show) other.focus(); else other.value = '';
    }
  }
  allFields().filter(f => f.dependsOn === parentId).forEach(dep => {
    const sel = document.getElementById('f_' + dep.id);
    if (!sel) return;
    const opts = (dep.optionsByValue && dep.optionsByValue[el.value]) || [];
    sel.innerHTML = `<option value="">${esc(dep.placeholder || '— Sélectionner —')}</option>` +
      opts.map(o => `<option>${esc(o)}</option>`).join('');
    sel.value = '';
  });
}

// Bascule Conforme / Non conforme : débloque/masque les sections conditionnelles
function setConformity(el) {
  el.parentElement.querySelectorAll('.conf-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  selectedConformity = el.dataset.val;
  const show = selectedConformity === 'Non conforme';
  document.querySelectorAll('.conditional-section').forEach(s => s.classList.toggle('show', show));
  if (!show) {
    const grid = document.getElementById('infractionChips');
    if (grid) grid.querySelectorAll('.chip').forEach(c => { c.classList.remove('selected'); c.removeAttribute('style'); });
    selectedCategoryId = '';
    selectedCategoryIds = [];
    conditionalFieldIds().forEach(id => {
      const inp = document.getElementById('f_' + id); if (inp) inp.value = '';
      if (capturedPhotos[id]) { delete capturedPhotos[id]; renderPhotoPreview(id); } // vide une photo prise puis annulée
    });
  }
}

function renderChips() {
  const grid = document.getElementById('infractionChips');
  if (!grid) return;
  grid.innerHTML = currentPlan.categories.map(c =>
    `<div class="chip" data-cat="${c.id}" onclick="selectChip(this)">${c.emoji} ${esc(c.label)}</div>`
  ).join('');
}

function selectChip(el) {
  const grid = el.parentElement;
  const cat = catById(el.dataset.cat);

  // Mode multi-sélection (ex. Contrôle agent ramp) : bascule sans vider les autres
  if (currentPlan.multiCategory) {
    const on = el.classList.toggle('selected');
    if (cat && on) { el.style.background = cat.color; el.style.borderColor = cat.color; el.style.color = textOn(cat.color); }
    else el.removeAttribute('style');
    selectedCategoryIds = [...grid.querySelectorAll('.chip.selected')].map(c => c.dataset.cat);
    selectedCategoryId = selectedCategoryIds[0] || '';
    // Constat = liste des anomalies cochées (autofills joints)
    const target = allFields().find(f => f.autofillTarget);
    if (target) {
      const inp = document.getElementById('f_' + target.id);
      if (inp) inp.value = selectedCategoryIds.map(id => { const c = catById(id); return c ? (c.autofill || c.label.toUpperCase()) : ''; }).filter(Boolean).join(' ; ');
    }
    return;
  }

  // Mode mono-sélection (par défaut)
  grid.querySelectorAll('.chip').forEach(c => { c.classList.remove('selected'); c.removeAttribute('style'); });
  el.classList.add('selected');
  if (cat) {
    el.style.background = cat.color;
    el.style.borderColor = cat.color;
    el.style.color = textOn(cat.color);
    selectedCategoryId = cat.id;
    const target = allFields().find(f => f.autofillTarget);
    if (target && cat.autofill) {
      const inp = document.getElementById('f_' + target.id);
      if (inp && !inp.value) inp.value = cat.autofill;
    }
  }
}

/* ── PHOTO (champ type 'photo') ──
   Redimensionne (max 1024px) + JPEG q0.7 avant stockage pour ne pas
   saturer le localStorage, puis affiche une miniature. */
// Lit un fichier image, le redimensionne (max 1024px, JPEG q0.7) et renvoie un dataURL via cb.
function fileToResizedDataURL(file, cb) {
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1024;
      let { width: w, height: h } = img;
      if (w > MAX || h > MAX) { const s = MAX / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }
      const cv = document.createElement('canvas');
      cv.width = w; cv.height = h;
      cv.getContext('2d').drawImage(img, 0, 0, w, h);
      let dataURL;
      try { dataURL = cv.toDataURL('image/jpeg', 0.7); } catch (err) { dataURL = e.target.result; }
      cb(dataURL);
    };
    img.onerror = () => cb(null);
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
function onPhotoChange(input, fid) {
  const file = input.files && input.files[0];
  if (!file) return;
  fileToResizedDataURL(file, url => {
    if (!url) { showToast('⚠️ Image illisible', false); return; }
    capturedPhotos[fid] = url;
    renderPhotoPreview(fid);
  });
}
function renderPhotoPreview(fid) {
  const box = document.getElementById('prev_' + fid);
  if (!box) return;
  const url = capturedPhotos[fid];
  box.innerHTML = url
    ? `<div class="photo-thumb"><img src="${url}" alt="photo"><button type="button" class="photo-remove" onclick="removePhoto('${fid}')">✕</button></div>`
    : '';
}
function removePhoto(fid) {
  delete capturedPhotos[fid];
  const inp = document.getElementById('f_' + fid);
  if (inp) inp.value = '';
  renderPhotoPreview(fid);
}

/* ── TABS ── */
function showTab(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const screen = document.getElementById('screen-' + name);
  if (screen) { screen.classList.add('active'); screen.style.display = ''; }
  const btns = document.querySelectorAll('.tab-btn');
  const map = { saisie: 0, liste: 1, stats: 2, rapport: 3 };
  if (btns[map[name]]) btns[map[name]].classList.add('active');

  if (name === 'liste') renderRecords(records);
  if (name === 'stats') renderStats();
}

/* ── SAVE RECORD ── */
function saveRecord() {
  const conf = conformityField();
  const data = {};
  for (const f of allFields()) {
    if (f.type === 'conformity') { data[f.id] = selectedConformity; continue; }
    if (f.type === 'photo') { data[f.id] = capturedPhotos[f.id] || ''; continue; }
    if (f.type === 'checkboxes') {
      const box = document.getElementById('f_' + f.id);
      const checked = box ? [...box.querySelectorAll('input:checked')].map(c => c.value) : [];
      data[f.id] = checked.join(' + ');
      continue;
    }
    const el = document.getElementById('f_' + f.id);
    let v = (el ? el.value : '').trim();
    // « AUTRE » : remplacer par la fonction saisie librement
    if (f.type === 'select' && f.allowOther && v === (f.otherValue || 'AUTRE')) {
      const other = document.getElementById('f_' + f.id + '_other');
      const ov = other ? other.value.trim() : '';
      if (ov) v = ov;
    }
    if (f.uppercase) v = v.toUpperCase();
    data[f.id] = v;
  }

  if (conf && !selectedConformity) { showToast('⚠️ Indiquez Conforme / Non conforme', false); return; }
  // Quand la tâche est conforme, les champs des sections conditionnelles ne sont pas requis
  const skipCond = conf && selectedConformity !== 'Non conforme';
  const condIds = conditionalFieldIds();
  for (const f of allFields()) {
    if (!f.required) continue;
    if (skipCond && condIds.has(f.id)) continue;
    if (!data[f.id]) { showToast('⚠️ ' + (f.label || f.id) + ' requis', false); return; }
  }

  const newRec = {
    id: Date.now(),
    ...data,
    category: selectedCategoryId,
    time: new Date().toTimeString().slice(0, 5),
    timestamp: Date.now()
  };
  if (currentPlan.multiCategory) newRec.categories = selectedCategoryIds.slice();
  records.push(newRec);
  try {
    saveRecords();
  } catch (err) {
    records.pop();
    showToast('⚠️ Stockage plein — supprimez des photos/enregistrements', false);
    return;
  }

  allFields().forEach(f => {
    const el = document.getElementById('f_' + f.id);
    if (el) {
      if (f.type === 'checkboxes') el.querySelectorAll('input:checked').forEach(c => { c.checked = false; });
      else el.value = '';
    }
    if (f.allowOther) { const o = document.getElementById('f_' + f.id + '_other'); if (o) { o.value = ''; o.style.display = 'none'; } }
    if (f.type === 'photo') { delete capturedPhotos[f.id]; renderPhotoPreview(f.id); }
  });
  const grid = document.getElementById('infractionChips');
  if (grid) grid.querySelectorAll('.chip').forEach(c => { c.classList.remove('selected'); c.removeAttribute('style'); });
  document.querySelectorAll('.conf-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.conditional-section').forEach(s => s.classList.remove('show'));
  selectedCategoryId = '';
  selectedCategoryIds = [];
  selectedConformity = '';

  updateRecordCount();
  renderNav();
  showToast('✅ Enregistré', true);
}

function updateRecordCount() { document.getElementById('recordCount').textContent = records.length; }

/* ── RENDER RECORDS ── */
function filterRecords(q) {
  const Q = q.trim().toUpperCase();
  const searchFields = allFields().filter(f => ['primary', 'meta', 'description', 'context'].includes(f.role));
  const filtered = Q ? records.filter(r => searchFields.some(f => String(r[f.id] || '').toUpperCase().includes(Q))) : records;
  renderRecords(filtered);
}

function renderRecords(list) {
  const container = document.getElementById('recordsList');
  if (!list.length) {
    container.innerHTML = `<div class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-title">Aucun enregistrement</div>
      <div class="empty-sub">Les saisies de « ${esc(currentPlan.nom)} » apparaîtront ici</div>
    </div>`;
    return;
  }

  const primary = fieldsByRole('primary')[0];
  const metas = fieldsByRole('meta').slice().sort((a, b) => (a.metaPrefix ? 1 : 0) - (b.metaPrefix ? 1 : 0));
  const desc = allFields().find(f => f.autofillTarget) || fieldsByRole('description')[0];
  const contexts = fieldsByRole('context');
  const actions = fieldsByRole('action');
  const notes = fieldsByRole('note');
  const photos = allFields().filter(f => f.type === 'photo');
  const statusF = conformityField();

  const sorted = [...list].sort((a, b) => b.timestamp - a.timestamp);
  container.innerHTML = sorted.map(r => {
    const metaStr = metas.map(m => r[m.id] ? (m.metaPrefix ? m.metaPrefix + ' ' + r[m.id] : r[m.id]) : '').filter(Boolean).join(' · ');
    const ctxStr = contexts.map(c => r[c.id]).filter(Boolean).join(' — ');
    const conforme = statusF && r[statusF.id] === 'Conforme';
    const cats = recordCats(r);
    const bColor = conforme ? '#22C55E' : catColor(r.category);
    const bLabel = conforme ? 'Conforme'
      : (cats.length > 1 ? cats.length + ' anomalies'
        : (statusF && !catById(r.category) ? (r[statusF.id] || 'Non conforme') : catLabel(r.category)));
    const mainLine = conforme
      ? '✅ Conforme'
      : `⚠️ ${esc(desc ? r[desc.id] : '')}${ctxStr ? ' — ' + esc(ctxStr) : ''}`;
    return `<div class="record-card" id="card-${r.id}">
      <div class="record-header">
        <div>
          <div class="record-name">${esc(primary ? r[primary.id] : '')}</div>
          <div class="record-meta">${esc(metaStr || '—')}</div>
        </div>
        <div class="badge" style="background:${rgba(bColor, 0.12)};color:${bColor};border:1px solid ${rgba(bColor, 0.3)}">${esc(bLabel)}</div>
      </div>
      <div class="record-body">
        <div class="record-infraction">${mainLine}</div>
        ${actions.map(a => r[a.id] ? `<div class="record-action-note">🔧 ${esc(r[a.id])}</div>` : '').join('')}
        ${notes.map(n => r[n.id] ? `<div class="record-action-note" style="color:var(--text-muted);margin-top:4px">💬 ${esc(r[n.id])}</div>` : '').join('')}
        ${photos.map(p => r[p.id] ? `<a class="record-photo" href="${r[p.id]}" target="_blank"><img src="${r[p.id]}" alt="photo justificative"></a>` : '').join('')}
      </div>
      <div class="record-footer">
        <div class="record-time">🕐 ${esc(r.time)}</div>
        <div class="record-actions">
          <button class="btn-sm danger" onclick="deleteRecord(${r.id})">🗑️ Suppr.</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function deleteRecord(id) {
  records = records.filter(r => r.id !== id);
  saveRecords();
  updateRecordCount();
  renderNav();
  renderRecords(records);
}

/* ── STATS ── */
function renderStats() {
  const total = records.length;
  const statusF = conformityField();
  // libellé / couleur d'un groupe (gère le pseudo-groupe '__conforme')
  const lblFor = id => id === '__conforme' ? 'Conforme' : catLabel(id);
  const clrFor = id => id === '__conforme' ? '#22C55E' : catColor(id);

  const byCat = {};
  records.forEach(r => {
    if (statusF && r[statusF.id] === 'Conforme') { byCat['__conforme'] = (byCat['__conforme'] || 0) + 1; return; }
    const cats = recordCats(r);
    if (cats.length) cats.forEach(k => { byCat[k] = (byCat[k] || 0) + 1; });
    else { byCat['autre'] = (byCat['autre'] || 0) + 1; }
  });
  const catSorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]);

  let cards = `<div class="stat-card"><div class="stat-value red">${total}</div><div class="stat-label">Total</div></div>`;
  catSorted.slice(0, 3).forEach(([id, count]) => {
    cards += `<div class="stat-card"><div class="stat-value" style="color:${clrFor(id)}">${count}</div><div class="stat-label">${esc(lblFor(id))}</div></div>`;
  });
  document.getElementById('statsGrid').innerHTML = cards;

  const max = catSorted.length ? catSorted[0][1] : 1;
  document.getElementById('chartSection').innerHTML = `
    <div class="chart-title">Répartition par type</div>
    ${catSorted.length ? catSorted.map(([id, count]) => `
      <div class="bar-row">
        <div class="bar-label">${esc(lblFor(id))}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${(count / max * 100)}%;background:${clrFor(id)}"></div></div>
        <div class="bar-count">${count}</div>
      </div>`).join('') : '<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:20px">Aucune donnée</div>'}
  `;

  const primary = fieldsByRole('primary')[0];
  const bySubject = {};
  records.forEach(r => { const k = primary ? (r[primary.id] || '—') : '—'; bySubject[k] = (bySubject[k] || 0) + 1; });
  const subjSorted = Object.entries(bySubject).sort((a, b) => b[1] - a[1]);

  document.getElementById('infraSummary').innerHTML = subjSorted.length ? `
    <div style="padding:12px 16px;border-bottom:1px solid var(--border)">
      <div class="chart-title" style="margin:0">Par ${esc((primary && primary.label) || 'agent')}</div>
    </div>
    ${subjSorted.map(([name, count]) => `
      <div class="summary-row">
        <div class="summary-name">${esc(name)}</div>
        <div class="summary-count">${count}
          <span class="badge" style="background:${rgba('#EF4444', 0.12)};color:#F87171;border:1px solid ${rgba('#EF4444', 0.3)}">${count}</span>
        </div>
      </div>`).join('')}
  ` : '<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:13px">Aucune donnée</div>';
}

/* ── RAPPORT ── */
function buildReportText() {
  const primary = fieldsByRole('primary')[0];
  const metas = fieldsByRole('meta');
  const desc = allFields().find(f => f.autofillTarget) || fieldsByRole('description')[0];
  const contexts = fieldsByRole('context');
  const actions = fieldsByRole('action');
  const notes = fieldsByRole('note');
  const photos = allFields().filter(f => f.type === 'photo');
  const statusF = conformityField();

  const d = session.date ? new Date(session.date + 'T12:00:00').toLocaleDateString('fr-FR') : '—';
  let text = `${currentPlan.reportTitle || currentPlan.nom}\n`;
  text += `===============================\n`;
  text += `Date: ${d} | Vacation: ${session.vacation} | Agent: ${session.agent}\n\n`;
  text += `ENREGISTREMENTS (${records.length})\n`;
  text += `-------------------------------\n`;
  records.forEach((r, i) => {
    text += `${i + 1}. ${primary ? r[primary.id] : ''}`;
    const metaStr = metas.map(m => r[m.id]).filter(Boolean).join(', ');
    if (metaStr) text += ` (${metaStr})`;
    if (statusF && r[statusF.id]) text += ` — ${r[statusF.id]}`;
    if (desc && r[desc.id]) text += ` — ${r[desc.id]}`;
    contexts.forEach(c => { if (r[c.id]) text += ` [${r[c.id]}]`; });
    actions.forEach(a => { if (r[a.id]) text += `\n   → ${a.label || 'Action'}: ${r[a.id]}`; });
    notes.forEach(n => { if (r[n.id]) text += `\n   → ${n.label || 'Note'}: ${r[n.id]}`; });
    if (photos.some(p => r[p.id])) text += `\n   → Photo justificative jointe`;
    text += `\n   (${r.time})\n\n`;
  });
  text += buildGeneralReportText();
  const remarks = document.getElementById('remarksText') && document.getElementById('remarksText').value.trim();
  if (remarks) text += `OBSERVATIONS\n------------\n${remarks}\n`;
  return text;
}

// Bloc « Recensement de la vacation » pour le rapport (plans avec config general)
function buildGeneralReportText() {
  const cfg = currentPlan && currentPlan.general;
  if (!cfg) return '';
  const data = loadGeneral(currentPlan.id);
  const veh = data.vehicles || {};
  const pers = data.personnel || {};
  let t = `\nRECENSEMENT DE LA VACATION\n--------------------------\n`;
  t += `Moyens de transport disponibles:\n`;
  cfg.vehicles.forEach(v => { t += `  - ${v.label}: ${veh[v.id] || 0}\n`; });
  t += `Personnel par shift (agents):\n`;
  cfg.vehicles.forEach(v => {
    const line = cfg.shifts.map(s => `${s.label} ${(pers[v.id] && pers[v.id][s.id]) || 0}`).join(' | ');
    t += `  - ${v.label}: ${line}\n`;
  });
  return t + '\n';
}

function copyToClipboard() { navigator.clipboard.writeText(buildReportText()).then(() => showToast('📋 Copié!', true)); }
function shareViaNative() { if (navigator.share) navigator.share({ title: currentPlan.nom, text: buildReportText() }); else copyToClipboard(); }
function shareViaWhatsApp() { window.open(`https://wa.me/?text=${encodeURIComponent(buildReportText())}`, '_blank'); }

function printReport() {
  const fields = allFields();
  const d = session.date ? new Date(session.date + 'T12:00:00').toLocaleDateString('fr-FR') : '—';
  const remarks = document.getElementById('remarksText') && document.getElementById('remarksText').value.trim();
  const cols = fields.map(f => f.label || f.id).concat(['Catégorie', 'Heure']);

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>${esc(currentPlan.nom)}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 13px; margin: 20px; color: #000; }
    h1 { font-size: 18px; text-align: center; margin-bottom: 4px; }
    .sub { text-align: center; font-size: 11px; color: #666; margin-bottom: 20px; }
    .meta { margin-bottom: 16px; padding: 10px; border: 1px solid #ccc; }
    .meta span { margin-right: 20px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th { background: #CC0000; color: white; padding: 8px; text-align: left; font-size: 12px; }
    td { padding: 8px; border-bottom: 1px solid #eee; font-size: 12px; vertical-align: top; }
    tr:nth-child(even) { background: #f9f9f9; }
    .remarks { padding: 10px; border: 1px solid #ccc; margin-top: 10px; white-space: pre-wrap; font-size: 12px; }
    .footer { text-align: right; font-size: 11px; color: #888; margin-top: 20px; }
  </style></head><body>
  <h1>${esc(currentPlan.icon || '')} ${esc(currentPlan.reportTitle || currentPlan.nom)}</h1>
  <div class="sub">${esc(currentPlan.reportSubtitle || 'Rapport de contrôle qualité')}</div>
  <div class="meta">
    <span>Date: ${d}</span>
    <span>Vacation: ${esc(session.vacation)}</span>
    <span>Agent: ${esc(session.agent)}</span>
    <span>Total: ${records.length} enregistrement(s)</span>
  </div>
  <table>
    <tr>${cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr>
    ${records.map(r => `<tr>
      ${fields.map(f => f.type === 'photo'
        ? `<td>${r[f.id] ? `<img src="${r[f.id]}" style="max-width:120px;max-height:120px">` : '—'}</td>`
        : `<td>${esc(r[f.id] || '—')}</td>`).join('')}
      <td>${esc(recordCatLabel(r))}</td>
      <td>${esc(r.time)}</td>
    </tr>`).join('')}
  </table>
  ${remarks ? `<div class="remarks"><strong>OBSERVATIONS:</strong>\n${esc(remarks)}</div>` : ''}
  <div class="footer">Edité par: ${esc(session.agent)} — ${new Date().toLocaleString('fr-FR')}</div>
  </body></html>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 500);
}

function exportCSV() {
  const fields = allFields();
  const header = fields.map(f => f.label || f.id).concat(['Catégorie', 'Heure'])
    .map(v => '"' + v.replace(/"/g, '""') + '"').join(',') + '\n';
  const rows = records.map(r =>
    fields.map(f => f.type === 'photo' ? (r[f.id] ? 'Oui' : 'Non') : r[f.id]).concat([recordCatLabel(r), r.time])
      .map(v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"').join(',')
  ).join('\n');
  const blob = new Blob(['﻿' + header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentPlan.id}-${session.date}.csv`;
  a.click();
}

function newSession() {
  if (!confirm('Nouvelle vacation ? Tous les enregistrements de TOUTES les tâches seront effacés.')) return;
  localStorage.removeItem(kSession);
  CONTROL_PLANS.forEach(p => { localStorage.removeItem(kRecords(p.id)); localStorage.removeItem(kGeneral(p.id)); });
  localStorage.removeItem(STORE + ':ek:flights');
  Object.keys(FLIGHT_CHECKLISTS).forEach(code => localStorage.removeItem(STORE + ':cl:' + code + ':records'));
  localStorage.removeItem(STORE + ':vacChecklist');
  localStorage.removeItem(kLastPlan);
  records = [];
  ekFlights = [];
  clRecords = [];
  session = { agent: '', date: '', vacation: '', startTime: '' };
  closeSidebar();
  document.getElementById('appMain').style.display = 'none';
  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('setupOverlay').style.display = '';
  document.getElementById('setupAgent').value = '';
  document.getElementById('setupDate').value = new Date().toISOString().split('T')[0];
}

function shareApp() {
  if (navigator.share) navigator.share({ title: 'Contrôle Qualité RAM', url: window.location.href });
  else navigator.clipboard.writeText(window.location.href).then(() => showToast('🔗 Lien copié!', true));
}

/* ── TOAST ── */
function showToast(msg, ok = true) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.className = 'toast show' + (ok ? ' success' : '');
  setTimeout(() => t.className = 'toast', 2200);
}
