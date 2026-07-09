import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, MessageSquare, Smile, BookOpen, Pill, Home, X, Users, Sun, ChevronDown, ExternalLink, Sparkles } from 'lucide-react';
import happyImg from '../assets/happy.jpg';

interface ServicesProps {
  language: 'gr' | 'en' | 'fr';
}

const Services: React.FC<ServicesProps> = ({ language }) => {
  const [selectedCondition, setSelectedCondition] = useState<{name: string, definition?: string, symptoms: readonly string[]} | null>(null);
  const [showDepyArticle, setShowDepyArticle] = useState(false);
  const [showDepySources, setShowDepySources] = useState(false);

  const content = {
    gr: {
      title: 'Υπηρεσίες',
      subtitle: 'Ολοκληρωμένη Φροντίδα για την Οικογένεια',
      description: 'Στο Διαδικτυακό Ιατρείο μας προσφέρεται ένα πλήρες φάσμα διαγνωστικών και θεραπευτικών υπηρεσιών σχεδιασμένων να υποστηρίξουν εφήβους και τις οικογένειες τους σε κάθε στάδιο της ψυχικοκοινωνικής τους ανάπτυξης.',
      services: [
        {
          title: 'Ψυχιατρική & Ψυχολογική Αξιολόγηση',
          description: 'Ολοκληρωμένη εκτίμηση και διάγνωση καταστάσεων ψυχικής υγείας σε παιδιά και εφήβους.',
          features: ['Λεπτομερείς κλινικές συνεντεύξεις και εξετάσεις', 'Ψυχολογικές δοκιμασίες', 'Διαγνωστική διατύπωση', 'Σχεδιασμός θεραπείας']
        },
        {
          title: 'Ατομική Ψυχοθεραπεία',
          description: 'Εξατομικευμένη Ψυχοθεραπευτική Προσέγγιση βασισμένη σε κλινικές έρευνες και τις ανάγκες κάθε εφήβου και της οικογένειας του.',
          features: ['Ψυχοδυναμική Ψυχοθεραπεία Εφήβου', 'Γνωσιακή Συμπεριφορική Ψυχοθεραπεία Εφήβου', 'Ψυχοδυναμική Ψυχοθεραπεία Οικογένειας', 'Τεχνικές Γνωσιακής Συμπεριφορικής θεραπείας', 'Τεχνικές Βελτίωσης Κοινωνικών Δεξιοτήτων', 'Θεραπεία Ενσυναίσθησης (Mentalisation Therapy)', 'Διαχείριση Διαζυγίου']
        },
        {
          title: 'Οικογενειακή Θεραπεία',
          description: 'Εργασία με ολόκληρο το οικογενειακό σύστημα για βελτίωση της επικοινωνίας και ενίσχυση των σχέσεων.',
          features: ['Ψυχοδυναμική Ψυχοθεραπεία Οικογένειας', 'Διαχείριση Διαζυγίου', 'Συμβουλευτική Οικογένειας', 'Συμβουλευτική Γονέων', 'Παρέμβαση στο Σχολικό Πλαίσιο']
        },
        {
          title: 'Φαρμακευτική Στήριξη',
          description: 'Συμβουλευτική και υποστήριξη για τη φαρμακευτική αγωγή εφήβων με ψυχικές διαταραχές.',
          features: ['Σχεδιασμός Φαρμακευτικής αγωγής', 'Συζήτηση Θεραπευτικών Πρωτοκόλλων με συναδέλφους', 'Αναλυτική Εκπαίδευση Γονέων και Εφήβων στη Φαρμακευτική Αγωγή']
        },
        {
          title: 'Εποπτείες',
          description: 'Επαγγελματική εποπτεία και υποστήριξη για ψυχιάτρους και ψυχολόγους στην παιδική και εφηβική ψυχιατρική.',
          features: ['Ατομική Εποπτεία Ειδικευόμενων Ψυχιάτρων', 'Ατομική Εποπτεία Κλινικών Ψυχολόγων', 'Ομαδική Εποπτεία Ειδικευόμενων Ψυχιάτρων', 'Ομαδική Εποπτεία Ψυχολόγων']
        },
        {
          title: 'Επιστημονική Επιμέλεια Βιβλίων , Παραμυθιών , Παιδικών Παιχνιδιών',
          description: 'Συμβουλευτική και επιστημονική επιμέλεια σε παιδικά βιβλία και παραμύθια με θέματα ψυχικής υγείας.',
          features: ['Ακρίβεια περιεχομένου', 'Κατάλληλη γλώσσα για ηλικίες', 'Εκπαιδευτική αξία', 'Επαγγελματική αξιολόγηση']
        }
      ],
      conditionsTitle: 'Διαγνώσεις που Χρήζουν Θεραπείας',
      conditionsDescription: 'Παρακάτω θα βρείτε κάποια από τα συνήθη συμπτώματα των διαταραχών αλλά δεν αναφέρονται αναλυτικά τα κριτήρια τους για λόγους προστασίας των ασθενών.',
      conditions: [
        {
          name: 'ΔΤΧ Άγχους',
          definition: 'Οι διαταραχές άγχους χαρακτηρίζονται από επίμονο άγχος και ανησυχία.',
          symptoms: [
            'Αποφυγή δραστηριοτήτων ή/και σχολείου ή/και προσώπων',
            'Θλίψη ή/και ευερεθιστότητα',
            'Αποφυγή να μείνει μόνος/η',
            'Δυσκολία στον ύπνο',
            'Παρουσία τικ'
          ]
        },
        {
          name: 'Κατάθλιψη',
          definition: 'Η κατάθλιψη εκδηλώνεται διαφορετικά από την κατάθλιψη των ενηλίκων.',
          symptoms: [
            'Έντονη θλίψη',
            'Εκρήξεις θυμού',
            'Έντονες ενοχές',
            'Δυσκολία στον ύπνο',
            'Αποφυγή δραστηριοτήτων',
            'Απομόνωση',
            'Αυτοτραυματισμός',
            'Σκοτεινές σκέψεις',
            'Απελπισία για το παρόν/το μέλλον'
          ]
        },
        {
          name: 'ΔΕΠΥ',
          definition: 'Η ΔΕΠΥ παρουσιάζει ως πυρηνικά συμπτώματα τη διάσπαση προσοχής, την υπερκινητικότητα και την παρορμητικότητα.',
          symptoms: [
            'Δυσκολία συγκέντρωσης',
            'Αφηρημάδα',
            'Δυσκολία στον ύπνο',
            'Δυσκολία να περιμένει τη σειρά του',
            'Αγένεια',
            'Επικίνδυνο παιχνίδι'
          ]
        },
        {
          name: 'ΔΑΦ',
          definition: 'Διαταραχές Φάσματος Αυτισμού',
          symptoms: [
            'Επαναλαμβανόμενα μοτίβα συμπεριφοράς',
            'Επαναλαμβανόμενες κινήσεις',
            'Δυσκολία στην εξωλεκτική επικοινωνία',
            'Δυσκολία στην ανάπτυξη και κατανόηση των σχέσεων',
            'Εξαιρετικά περιορισμένα ενδιαφέροντα',
            'Υπέρ/Υπόαντιδραστικότητα στις αισθητηριακές πληροφορίες'
          ]
        },
        {
          name: 'Διαταραχές Διαγωγής',
          definition: 'Αντικατάσταση των Αντισυμπεριφορικών προβλημάτων',
          symptoms: [
            'Θυμωμένη/Ευερέθιστη διάθεση',
            'Προκλητική συμπεριφορά',
            'Εκρηκτική συμπεριφορά',
            'Εκδικητικότητα',
            'Παραβίαση κανόνων',
            'Αδιαφορία στα συναισθήματα του άλλου',
            'Καταστροφή ιδιοκτησίας',
            'Απάτη/Κλοπή'
          ]
        },
        {
          name: 'ΔΤΧ Διατροφής',
          definition: 'Διαταραχές Διατροφής',
          symptoms: [
            'Περιορισμένη ή Αυξημένη λήψη τροφής',
            'Αίσθηση απώλειας ελέγχου',
            'Συχνή και έντονη γυμναστική',
            'Εμέτοι',
            'Ενοχές',
            'Ανησυχία για το σωματικό βάρος/εικόνα σώματος',
            'Επιπλοκές (π.χ. διακοπή περιόδου, απώλεια μαλλιών, δέρμα που ξεφλουδίζει)'
          ]
        },
        {
          name: 'Διαταραχή Μετατραυματικού Στρες',
          definition: 'Η Διαταραχή Μετατραυματικού Στρες μπορεί να αναπτυχθεί μετά από τραυματική/ες εμπειρία/ες.',
          symptoms: [
            'Επαναλαμβανόμενες, ενοχλητικές μνήμες',
            'Επαναλαμβανόμενα, ενοχλητικά όνειρα',
            'Επαναβιώσεις/Flashbacks',
            'Αποφυγή σχετικών υπαινισγμών, καταστάσεων, προσώπων',
            'Υπεραγρύπνηση',
            'Δυσκολία στον ύπνο',
            'Θλίψη',
            'Αδυναμία να θυμηθεί σημαντικές πληροφορίες του τραύματος',
            'Αυτοτραυματισμοί',
            'Ευερεθιστότητα'
          ]
        },
        {
          name: 'ΔΤΧ Διάθεσης',
          definition: 'Οι διαταραχές διάθεσης περιλαμβάνουν την κατάθλιψη, την διπολική διαταραχή και άλλες παρόμοιες διαταραχές.',
          symptoms: [
            'Έντονες διακυμάνσεις στη διάθεση (αβάσταχτη θλίψη ή υπερβολική χαρά)',
            'Έντονες διακυμάνσεις στην ενέργεια (πολλή ή ελάχιστη ενέργεια)',
            'Διογκωμένη αυτοεκτίμηση',
            'Καλμπάζουσες σκέψεις',
            'Μειωμένη σχολική απόδοση',
            'Δυσκολία στη συγκέντρωση',
            'Αποφυγή ή έντονη ενασχόληση με δραστηριότητες',
            'Επικίνδυνη συμπεριφορά',
            'Αγένεια',
            'Δυσκολίες στον ύπνο'
          ]
        },
        {
          name: 'Τικς',
          definition: 'Τα τικς (μυοσπάσματα) είναι αιφνίδιες, ταχείες, επαναλαμβανόμενες, μη ρυθμικές κινητικές κινήσεις ή φωνητικές εκφράσεις.',
          symptoms: [
            'Κινητικά τικ: Βλεφαρίσματα, κούνημα κεφαλιού, ανασήκωμα ώμων',
            'Φωνητικά τικ: Βήχας, καθαρισμός λαιμού, γρυλίσματα, επανάληψη λέξεων'
          ]
        },
        {
          name: 'Ψυχώσεις',
          definition: 'Οι ψυχώσεις είναι σοβαρές ψυχικές διαταραχές που χαρακτηρίζονται από απώλεια επαφής με την πραγματικότητα.',
          symptoms: [
            'Παραληρητικές ιδέες (π.χ. καταδίωξης, μεγαλείου, ελέγχου)',
            'Ψευδαισθήσεις (ακουστικές, οπτικές, απτικές)',
            'Αποδιοργανωμένη σκέψη',
            'Αποδιοργανωμένος λόγος',
            'Αποδιοργανωμένη ή κατατονική συμπεριφορά',
            'Έλλειψη επίγνωσης της διαταραχής'
          ]
        },
        {
          name: 'Ιδεοψυχαναγκαστική Διαταραχή (OCD)',
          definition: 'Ψυχική διαταραχή με επαναλαμβανόμενες, ανεπιθύμητες σκέψεις (ιδεοληψίες) και καταναγκαστικές συμπεριφορές.',
          symptoms: [
            'Επαναλαμβανόμενες σκέψεις που προκαλούν άγχος (π.χ. μικρόβια, συμμετρία)',
            'Τελετουργικές πράξεις για μείωση άγχους (π.χ. πλύσιμο/γλύψιμο/τρίψιμο χεριών, τακτοποίηση χώρου, σκέπασμα, παιχνίδι με πόρτες/παράθυρα)',
            'Ο πάσχων αναγνωρίζει τον παράλογο χαρακτήρα των σκέψεων του'
          ]
        },
        {
          name: 'Διαταραχές Ύπνου - Αφύπνισης',
          definition: 'Ομάδα διαταραχών που επηρεάζουν την ποιότητα, ποσότητα ή χρονοκαθυστέρηση του ύπνου.',
          symptoms: [
            'Αϋπνία: Δυσκολία έναρξης/διατήρησης ύπνου',
            'Υπερυπνία: Υπερβολική υπνηλία κατά τη μέρα',
            'Διαταραχές κιρκάδιου ρυθμού: Ύπνος σε λάθος ώρες',
            'Παραϋπνίες: Εφιάλτες, υπνοβασία, τρόμος ύπνου',
            'Σύνδρομο Απνοιών Ύπνου: Διακοπές της αναπνοής κατά τη διάρκεια του ύπνου'
          ]
        }
      ],
      notListed: 'Δεν βλέπετε την συγκεκριμένη ανησυχία σας στη λίστα; Παρακαλώ επικοινωνήστε - είμαστε εδώ να βοηθήσουμε με οποιεσδήποτε προκλήσεις ψυχικής υγείας αντιμετωπίζει το παιδί σας.'
    },
    en: {
      title: 'Our Services',
      subtitle: 'Comprehensive Care for Every Need',
      description: 'We offer a full range of psychiatric and psychotherapeutic services designed to support children, adolescents, and their families through every stage of mental health treatment.',
      services: [
        {
          title: 'Psychiatric & Psychological Assessment',
          description: 'Comprehensive evaluation and diagnosis of mental health conditions in children and adolescents.',
          features: ['Detailed clinical interviews', 'Psychological testing', 'Diagnostic formulation', 'Treatment planning']
        },
        {
          title: 'Individual Psychotherapy',
          description: 'Evidence-based therapeutic approaches tailored to each child\'s unique needs and developmental stage.',
          features: ['Cognitive Behavioral Therapy', 'Play therapy', 'Psychodynamic therapy', 'Trauma-informed care']
        },
        {
          title: 'Family Therapy',
          description: 'Working with the entire family system to improve communication and strengthen relationships.',
          features: ['Family system assessment', 'Communication skills', 'Conflict resolution', 'Parenting support']
        },
        {
          title: 'Crisis Intervention',
          description: 'Immediate support and intervention during mental health crises and emergency situations.',
          features: ['24/7 availability', 'Safety planning', 'Emergency assessment', 'Rapid stabilization']
        },
        {
          title: 'Supervision',
          description: 'Professional supervision and support for psychiatrists and psychologists in child and adolescent psychiatry.',
          features: ['Individual Supervision of Psychiatry Residents', 'Individual Supervision of Clinical Psychologists', 'Group Supervision of Psychiatry Residents', 'Group Supervision of Psychologists']
        },
        {
            title: 'Scientific Editing of Children\'s Books and Stories',
            description: 'Consultation and scientific editing for children\'s books and stories addressing mental health topics.',
          features: ['Content accuracy', 'Age-appropriate language', 'Educational value', 'Collaboration with publishers/authors']
        }
      ],
      conditionsTitle: 'Diagnoses We Handle',
      conditionsDescription: 'Below you will find some of the common symptoms of disorders but their criteria are not detailed for patient protection reasons.',
      conditions: [
        {
          name: 'Anxiety Disorders',
          definition: 'Anxiety disorders are characterized by persistent anxiety and worry.',
          symptoms: [
            'Avoidance of activities or school or people',
            'Sadness or irritability',
            'Avoidance of being alone',
            'Sleep difficulties',
            'Presence of tics'
          ]
        },
        {
          name: 'Depression',
          definition: 'Depression manifests differently from adult depression.',
          symptoms: [
            'Intense sadness',
            'Anger outbursts',
            'Intense guilt',
            'Sleep difficulties',
            'Avoidance of activities',
            'Isolation',
            'Self-harm',
            'Dark thoughts',
            'Despair about present/future'
          ]
        },
        {
          name: 'ADHD',
          definition: 'ADHD presents with core symptoms of attention deficit, hyperactivity, and impulsivity.',
          symptoms: [
            'Difficulty concentrating',
            'Absentmindedness',
            'Sleep difficulties',
            'Difficulty waiting for turn',
            'Rudeness',
            'Dangerous play'
          ]
        },
        {
          name: 'Autism Spectrum Disorders',
          definition: 'Autism Spectrum Disorders',
          symptoms: [
            'Repetitive behavioral patterns',
            'Repetitive movements',
            'Difficulty in external communication',
            'Difficulty in developing and understanding relationships',
            'Extremely limited interests',
            'Hyper/Hypo-reactivity to sensory information'
          ]
        },
        {
          name: 'Conduct Disorders',
          definition: 'Replacement of Antisocial Behavioral Problems',
          symptoms: [
            'Angry/Irritable mood',
            'Defiant behavior',
            'Explosive behavior',
            'Vindictiveness',
            'Rule violations',
            'Indifference to others\' feelings',
            'Property destruction',
            'Deceit/Theft'
          ]
        },
        {
          name: 'Eating Disorders',
          definition: 'Eating Disorders',
          symptoms: [
            'Restricted or Increased food intake',
            'Feeling of loss of control',
            'Frequent and intense exercise',
            'Vomiting',
            'Guilt',
            'Concern about body weight/image',
            'Complications (e.g., missed periods, hair loss, flaky skin)'
          ]
        },
        {
          name: 'Post-Traumatic Stress Disorder',
          definition: 'Post-Traumatic Stress Disorder can develop after traumatic experience(s).',
          symptoms: [
            'Recurrent, distressing memories',
            'Recurrent, distressing dreams',
            'Flashbacks',
            'Avoidance of related cues, situations, people',
            'Hypervigilance',
            'Sleep difficulties',
            'Sadness',
            'Inability to remember important trauma information',
            'Self-harm',
            'Irritability'
          ]
        },
        {
          name: 'Mood Disorders',
          definition: 'Mood disorders include depression, bipolar disorder and other similar disorders.',
          symptoms: [
            'Intense mood swings (unbearable sadness or excessive joy)',
            'Intense energy fluctuations (much or minimal energy)',
            'Inflated self-esteem',
            'Grandiose thoughts',
            'Reduced school performance',
            'Difficulty concentrating',
            'Avoidance or intense engagement with activities',
            'Dangerous behavior',
            'Rudeness',
            'Sleep difficulties'
          ]
        },
        {
          name: 'Tics',
          definition: 'Tics (muscle spasms) are sudden, rapid, repetitive, non-rhythmic motor movements or vocal expressions.',
          symptoms: [
            'Motor tics: Blinking, head shaking, shoulder shrugging',
            'Vocal tics: Coughing, throat clearing, grunting, word repetition'
          ]
        },
        {
          name: 'Psychoses',
          definition: 'Psychoses are serious mental disorders characterized by loss of contact with reality.',
          symptoms: [
            'Delusional ideas (e.g., persecution, grandeur, control)',
            'Hallucinations (auditory, visual, tactile)',
            'Disorganized thinking',
            'Disorganized speech',
            'Disorganized or catatonic behavior',
            'Lack of awareness of the disorder'
          ]
        },
        {
          name: 'Obsessive-Compulsive Disorder (OCD)',
          definition: 'Mental disorder with recurrent, unwanted thoughts (obsessions) and compulsive behaviors.',
          symptoms: [
            'Recurrent thoughts that cause anxiety (e.g., germs, symmetry)',
            'Ritualistic actions to reduce anxiety (e.g., washing/licking/rubbing hands, organizing space, covering, playing with doors/windows)',
            'The sufferer recognizes the irrational nature of their thoughts'
          ]
        },
        {
          name: 'Sleep-Wake Disorders',
          definition: 'Group of disorders that affect sleep quality, quantity, or timing.',
          symptoms: [
            'Insomnia: Difficulty initiating/maintaining sleep',
            'Hypersomnia: Excessive daytime sleepiness',
            'Circadian rhythm disorders: Sleep at wrong times',
            'Parasomnias: Nightmares, sleepwalking, night terrors',
            'Sleep Apnea Syndrome: Breathing interruptions during sleep'
          ]
        }
      ],
      notListed: 'Don\'t see your specific concern listed? Please reach out - we\'re here to help with any mental health challenges your child may be facing.'
    },
    fr: {
      title: 'Services',
      subtitle: 'Soins Complets pour la Famille',
      description: 'Dans notre Clinique en ligne, nous offrons un spectre complet de services diagnostiques et thérapeutiques conçus pour soutenir les adolescents et leurs familles à chaque étape de leur développement psychosocial.',
      services: [
        {
          title: 'Évaluation Psychiatrique & Psychologique',
          description: 'Évaluation complète et diagnostic des conditions de santé mentale chez les enfants et adolescents.',
          features: ['Entretiens cliniques détaillés et examens', 'Tests psychologiques', 'Formulation diagnostique', 'Planification thérapeutique']
        },
        {
          title: 'Psychothérapie Individuelle',
          description: 'Approche Psychothérapeutique Personnalisée basée sur la recherche clinique et les besoins de chaque adolescent et de sa famille.',
          features: ['Psychothérapie Psychodynamique de l\'Adolescent', 'Thérapie Cognitivo-Comportementale de l\'Adolescent', 'Psychothérapie Psychodynamique Familiale', 'Techniques de Thérapie Cognitivo-Comportementale', 'Techniques d\'Amélioration des Compétences Sociales', 'Thérapie de Mentalisation', 'Gestion du Divorce']
        },
        {
          title: 'Thérapie Familiale',
          description: 'Travail avec tout le système familial pour améliorer la communication et renforcer les relations.',
          features: ['Psychothérapie Psychodynamique Familiale', 'Gestion du Divorce', 'Conseil Familial', 'Conseil Parental', 'Intervention dans le Cadre Scolaire']
        },
        {
          title: 'Support Pharmacologique',
          description: 'Conseil et soutien pour le traitement pharmacologique des adolescents avec troubles mentaux.',
          features: ['Planification du Traitement Pharmacologique', 'Discussion des Protocoles Thérapeutiques avec collègues', 'Formation Analytique des Parents et Adolescents au Traitement Pharmacologique']
        },
        {
          title: 'Supervisions',
          description: 'Supervision professionnelle et soutien pour psychiatres et psychologues en psychiatrie de l\'enfant et de l\'adolescent.',
          features: ['Supervision Individuelle des Psychiatres en Formation', 'Supervision Individuelle des Psychologues Cliniques', 'Supervision de Groupe des Psychiatres en Formation', 'Supervision de Groupe des Psychologues']
        },
        {
          title: 'Édition Scientifique de Livres, Contes, Jeux pour Enfants',
          description: 'Conseil et édition scientifique de livres et contes pour enfants avec thèmes de santé mentale.',
          features: ['Exactitude du contenu', 'Langage approprié pour les âges', 'Valeur éducative', 'Évaluation professionnelle']
        }
      ],
      conditionsTitle: 'Diagnostics Nécessitant un Traitement',
      conditionsDescription: 'Ci-dessous vous trouverez certains des symptômes courants des troubles mais leurs critères ne sont pas mentionnés en détail pour des raisons de protection des patients.',
      conditions: [
        {
          name: 'Troubles d\'Anxiété',
          definition: 'Les troubles d\'anxiété se caractérisent par une anxiété et une inquiétude persistantes.',
          symptoms: [
            'Évitement d\'activités et/ou d\'école et/ou de personnes',
            'Tristesse et/ou irritabilité',
            'Évitement de rester seul(e)',
            'Difficulté de sommeil',
            'Présence de tics'
          ]
        },
        {
          name: 'Dépression',
          definition: 'La dépression se manifeste différemment de la dépression des adultes.',
          symptoms: [
            'Tristesse intense',
            'Explosions de colère',
            'Culpabilité intense',
            'Difficulté de sommeil',
            'Évitement d\'activités',
            'Isolement',
            'Automutilation',
            'Pensées sombres',
            'Désespoir pour le présent/l\'avenir'
          ]
        },
        {
          name: 'TDAH',
          definition: 'Le TDAH présente comme symptômes nucléaires la distraction de l\'attention, l\'hyperactivité et l\'impulsivité.',
          symptoms: [
            'Difficulté de concentration',
            'Distraction',
            'Difficulté de sommeil',
            'Difficulté à attendre son tour',
            'Agitation',
            'Jeu dangereux'
          ]
        },
        {
          name: 'TSA',
          definition: 'Troubles du Spectre de l\'Autisme',
          symptoms: [
            'Modèles comportementaux répétitifs',
            'Mouvements répétitifs',
            'Difficulté dans la communication non verbale',
            'Difficulté dans le développement et la compréhension des relations',
            'Intérêts extrêmement limités',
            'Hyper/Hypo-réactivité aux informations sensorielles'
          ]
        },
        {
          name: 'Troubles de l\'Alimentation',
          definition: 'Les troubles de l\'alimentation affectent la relation avec la nourriture et l\'image corporelle.',
          symptoms: [
            'Restriction alimentaire sévère',
            'Épisodes de suralimentation',
            'Comportements compensatoires',
            'Préoccupation excessive avec le poids',
            'Image corporelle déformée',
            'Évitement de situations sociales impliquant la nourriture'
          ]
        },
        {
          name: 'Troubles de la Conduite',
          definition: 'Remplacement des Problèmes Comportementaux Antisociaux',
          symptoms: [
            'Humeur en colère/irritable',
            'Comportement de défi',
            'Comportement explosif',
            'Vindictivité',
            'Violations de règles',
            'Indifférence aux sentiments des autres',
            'Destruction de biens',
            'Tromperie/Vol'
          ]
        },
        {
          name: 'Troubles du Sommeil',
          definition: 'Les troubles du sommeil affectent la qualité et la quantité du sommeil.',
          symptoms: [
            'Difficulté à s\'endormir',
            'Réveils fréquents pendant la nuit',
            'Réveil précoce',
            'Somnolence diurne excessive',
            'Cauchemars récurrents',
            'Terreurs nocturnes',
            'Syndrome d\'Apnée du Sommeil: Interruptions respiratoires pendant le sommeil'
          ]
        },
        {
          name: 'Trouble de Stress Post-Traumatique',
          definition: 'Le Trouble de Stress Post-Traumatique peut se développer après une ou des expériences traumatiques.',
          symptoms: [
            'Souvenirs récurrents et pénibles',
            'Rêves récurrents et pénibles',
            'Flashbacks',
            'Évitement des indices, situations, personnes liés',
            'Hypervigilance',
            'Difficultés de sommeil',
            'Tristesse',
            'Incapacité de se souvenir d\'informations importantes sur le traumatisme',
            'Automutilation',
            'Irritabilité'
          ]
        },
        {
          name: 'Troubles de l\'Humeur',
          definition: 'Les troubles de l\'humeur incluent la dépression, le trouble bipolaire et d\'autres troubles similaires.',
          symptoms: [
            'Sauts d\'humeur intenses (tristesse insupportable ou joie excessive)',
            'Fluctuations d\'énergie intenses (beaucoup ou peu d\'énergie)',
            'Estime de soi gonflée',
            'Pensées grandioses',
            'Performance scolaire réduite',
            'Difficulté de concentration',
            'Évitement ou engagement intense avec les activités',
            'Comportement dangereux',
            'Impolitesse',
            'Difficultés de sommeil'
          ]
        },
        {
          name: 'Tics',
          definition: 'Les tics (spasmes musculaires) sont des mouvements moteurs ou expressions vocales soudains, rapides, répétitifs, non rythmiques.',
          symptoms: [
            'Tics moteurs: Clignement, hochement de tête, haussement d\'épaules',
            'Tics vocaux: Toux, raclement de gorge, grognement, répétition de mots'
          ]
        },
        {
          name: 'Psychoses',
          definition: 'Les psychoses sont des troubles mentaux graves caractérisés par une perte de contact avec la réalité.',
          symptoms: [
            'Idées délirantes (ex: persécution, grandeur, contrôle)',
            'Hallucinations (auditives, visuelles, tactiles)',
            'Pensée désorganisée',
            'Parole désorganisée',
            'Comportement désorganisé ou catatonique',
            'Manque de conscience du trouble'
          ]
        },
        {
          name: 'Trouble Obsessionnel-Compulsif (TOC)',
          definition: 'Trouble mental avec pensées récurrentes et indésirables (obsessions) et comportements compulsifs.',
          symptoms: [
            'Pensées récurrentes qui causent de l\'anxiété (ex: germes, symétrie)',
            'Actions ritualistes pour réduire l\'anxiété (ex: se laver/se lécher/se frotter les mains, organiser l\'espace, couvrir, jouer avec les portes/fenêtres)',
            'Le souffrant reconnaît la nature irrationnelle de ses pensées'
          ]
        },
        {
          name: 'Troubles du Sommeil-Éveil',
          definition: 'Groupe de troubles qui affectent la qualité, la quantité ou le moment du sommeil.',
          symptoms: [
            'Insomnie: Difficulté à initier/maintenir le sommeil',
            'Hypersomnie: Somnolence diurne excessive',
            'Troubles du rythme circadien: Sommeil aux mauvais moments',
            'Parasomnies: Cauchemars, somnambulisme, terreurs nocturnes',
            'Syndrome d\'Apnée du Sommeil: Interruptions respiratoires pendant le sommeil'
          ]
        }
      ],
      notListed: 'Vous ne voyez pas votre préoccupation spécifique listée? N\'hésitez pas à nous contacter - nous sommes là pour aider avec tous les défis de santé mentale que votre enfant pourrait affronter.'
    }
  } as const;

  type Lang = keyof typeof content;
  const lang: Lang = language;
  type Service = typeof content[Lang extends never ? 'gr' : Lang]['services'][number];

  const icons = [Brain, MessageSquare, Home, Pill, Users, BookOpen];

  // Πηγές άρθρου ΔΕΠΥ (κοινές για όλες τις γλώσσες — βιβλιογραφικές αναφορές)
  const depySources: { text: string; url?: string }[] = [
    {
      text: 'Stevens, J. R., Wilens, T. E., & Stern, T. A. (2013). Using stimulants for attention-deficit/hyperactivity disorder: clinical approaches and challenges. The primary care companion for CNS disorders, 15(2), PCC.12f01472.',
      url: 'https://doi.org/10.4088/PCC.12f01472'
    },
    {
      text: 'National Guideline Centre (UK). (2018). Withdrawal from pharmacological treatment and drug holidays: Attention deficit hyperactivity disorder: diagnosis and management. National Institute for Health and Care Excellence (NICE).'
    },
    {
      text: 'Ventura, P., de Giambattista, C., Trerotoli, P., Cavone, M., Di Gioia, A., & Margari, L. (2022). Methylphenidate Use for Emotional Dysregulation in Children and Adolescents with ADHD and ADHD and ASD: A Naturalistic Study. Journal of clinical medicine, 11(10), 2922.',
      url: 'https://doi.org/10.3390/jcm11102922'
    },
    {
      text: 'Taşkan, M., Tufan, A. E., Öztürk, Y., Balta Kesikbaş, B., İmrek, Y., Akıncı, B., & Koçak, G. (2024). Drug Holidays May Attenuate Beneficial Effects of Treatment on Emotion Regulation and Recognition Among Children with ADHD: A Single-Center, Prospective Study. Psychiatry and clinical psychopharmacology, 34(4), 285–293.',
      url: 'https://doi.org/10.5152/pcp.2024.24862'
    }
  ];

  const depyArticle = {
    gr: {
      label: 'Άρθρο · ΔΕΠΥ & Καλοκαίρι',
      title: 'Γιατί διακόπτουμε το φάρμακο της ΔΕΠΥ στις διακοπές;',
      intro: [
        'Το κλείσιμο των σχολείων και η έναρξη της καλοκαιρινής περιόδου γεννά συχνά πολλά ερωτήματα στους γονείς παιδιών και εφήβων με ΔΕΠΥ (Διαταραχή Ελλειμματικής Προσοχής και Υπερκινητικότητας). Πολλοί γονείς αναρωτιούνται αν είναι καλό να συνεχίσουν το φάρμακο για τη ΔΕΠΥ ή να κάνουν ένα διάλειμμα για τις διακοπές του καλοκαιριού. Έτσι, έρχονται διάφορες επακόλουθες ερωτήσεις, όπως το πώς επηρεάζονται τα συμπτώματα και αν τελικά υπάρχουν οφέλη από μια προσωρινή διακοπή.',
        'Αυτό είναι γνωστό και ως «drug holiday» δηλαδή την διακοπή των φαρμάκων κατά τις διακοπές. Ο όρος «drug holiday» αναφέρεται στη συμφωνημένη προσωρινή διακοπή της φαρμακευτικής αγωγής για ένα συγκεκριμένο χρονικό διάστημα, πάντα μετά από συνεννόηση με τον θεράποντα ιατρό.',
        'Τα ερωτήματα αυτά είναι απόλυτα κατανοητά, καθώς γύρω από το θέμα υπάρχει σημαντική σύγχυση. Στο διαδίκτυο και στα μέσα ενημέρωσης κυκλοφορούν πολλές και συχνά αντικρουόμενες πληροφορίες, γεγονός που δυσκολεύει τους γονείς και τους ασθενείς να κατανοήσουν τι πραγματικά ισχύει. Η απάντηση, όμως, δεν είναι ούτε τόσο απλή ούτε ίδια για όλα τα παιδιά και έφηβους. Σίγουρα, το καλοκαίρι μπορεί να είναι μια ευκαιρία να βγούμε εκτός της καθημερινής ρουτίνας και ορισμένων υποχρεώσεων, αλλά αυτό δεν ισχύει σε υποχρεώσεις που σχετίζονται με την υγεία. Παρόλα αυτά η διακοπή του φαρμάκου της ΔΕΠΥ συστήνεται σε ορισμένες περιπτώσεις. Οι λόγοι για τους οποίους μπορεί να προταθεί ένα «drug holiday» περιλαμβάνουν την αξιολόγηση της ανάγκης συνέχισης της θεραπείας, τη διαχείριση πιθανών ανεπιθύμητων ενεργειών, τον έλεγχο πιθανής ανοχής στο φάρμακο και την καλύτερη κατανόηση από το παιδί και την οικογένεια των οφελών της θεραπείας.',
        'Η απόφαση για διακοπή της θεραπείας δεν είναι ίδια για όλους. Αντίθετα, πρέπει να λαμβάνεται εξατομικευμένα, αφού συζητηθούν προσεκτικά: τα οφέλη της συνέχισης της αγωγής, οι πιθανές παρενέργειες, οι ανάγκες και οι ιδιαιτερότητες του ατόμου με ΔΕΠΥ, καθώς και οι απόψεις της οικογένειας και των φροντιστών.',
        'Η έναρξη, η συνέχιση ή η προσωρινή διακοπή της φαρμακευτικής αγωγής για τη ΔΕΠΥ θα πρέπει πάντοτε να γίνεται σε συνεργασία με τον ειδικό ιατρό και να βασίζεται στις ανάγκες του ατόμου.'
      ],
      tipsTitle: 'Προτάσεις για το καλοκαίρι',
      tipsIntro: 'Το καλοκαίρι είναι και μια ευκαιρία για σύνδεση, επικοινωνία και ενίσχυση δεξιοτήτων. Με βάση αυτό προτείνουμε κάποια βασικά για το πώς να βοηθήσουμε τα παιδιά να απολαύσουν τις διακοπές χωρίς χάος. Οι καλοκαιρινές διακοπές είναι μια ανάσα ελευθερίας για όλα τα παιδιά, όμως για τα παιδιά με ΔΕΠΥ η έλλειψη προγράμματος μπορεί να φέρει ένταση, βαρεμάρα και περισσότερες συγκρούσεις.',
      tips: [
        'Είναι σημαντικό να διατηρήσετε μια βασική ρουτίνα με σταθερές ώρες για ύπνο, γεύματα και κάποιες καθημερινές δραστηριότητες βοηθούν το παιδί να νιώθει ασφάλεια.',
        'Οι ευκαιρίες για κίνηση μπορούν να βοηθήσουν σημαντικά στην καθημερινότητα, όπως είναι το κολύμπι και το ποδήλατο. Τέτοιες δραστηριότητες βοηθούν στη διοχέτευση της ενέργειας.',
        'Η διατήρηση της υπερβολικής οθόνης. Η χρήση κινητού ή tablet μπορεί να αυξήσει την ανησυχία και την ευερεθιστότητα.',
        'Προγραμματίστε μικρές καθημερινές «αποστολές», όπως είναι μια κατασκευή, το πότισμα των φυτών ή η προετοιμασία για την παραλία δίνουν στο παιδί αίσθηση ευθύνης.',
        'Η προετοιμασία για μια αλλαγή είναι συχνά το κλειδί. Ενημερώστε τα από πριν για εκδρομές ή αλλαγές στο πρόγραμμα.',
        'Διατηρήστε την επικοινωνία με τον ειδικό. Αν υπάρχουν απορίες σχετικά με τη συμπεριφορά ή τη φαρμακευτική αγωγή κατά τη διάρκεια του καλοκαιριού, συζητήστε με τον ειδικό που παρακολουθεί το παιδί.'
      ],
      closing: 'Το πιο σημαντικό είναι να θυμόμαστε ότι τα παιδιά με ΔΕΠΥ δεν χρειάζονται «τέλειες» διακοπές. Χρειάζονται ένα περιβάλλον με κατανόηση, λίγη δομή και πολλές ευκαιρίες για παιχνίδι και ξεκούραση.',
      sourcesTitle: 'Πηγές',
      readMore: 'Διαβάστε περισσότερα',
      readLess: 'Εμφάνιση λιγότερων',
      author: 'Σοφία Σπυριάδου'
    },
    en: {
      label: 'Article · ADHD & Summer',
      title: 'Why do we stop ADHD medication during the holidays?',
      intro: [
        'The closing of schools and the start of the summer period often raises many questions for parents of children and adolescents with ADHD (Attention Deficit Hyperactivity Disorder). Many parents wonder whether it is good to continue the ADHD medication or to take a break during the summer holidays. Various follow-up questions then arise, such as how the symptoms are affected and whether there are ultimately benefits to a temporary interruption.',
        'This is also known as a «drug holiday», meaning the interruption of medication during the holidays. The term «drug holiday» refers to the agreed temporary interruption of pharmacological treatment for a specific period of time, always after consultation with the treating physician.',
        'These questions are entirely understandable, as there is significant confusion around the topic. On the internet and in the media there is a great deal of often contradictory information, which makes it difficult for parents and patients to understand what really applies. The answer, however, is neither so simple nor the same for all children and adolescents. Certainly, the summer can be an opportunity to step out of the daily routine and certain obligations, but this does not apply to obligations related to health. Nevertheless, stopping ADHD medication is recommended in certain cases. The reasons a «drug holiday» may be suggested include assessing the need to continue treatment, managing possible side effects, checking for possible tolerance to the medication, and a better understanding by the child and family of the benefits of the treatment.',
        'The decision to stop treatment is not the same for everyone. On the contrary, it must be made on an individualized basis, after carefully discussing: the benefits of continuing the treatment, the possible side effects, the needs and particularities of the person with ADHD, as well as the views of the family and caregivers.',
        'Starting, continuing or temporarily stopping ADHD medication should always be done in collaboration with the specialist physician and be based on the needs of the individual.'
      ],
      tipsTitle: 'Suggestions for the summer',
      tipsIntro: 'The summer is also an opportunity for connection, communication and skill-building. On this basis, we suggest some essentials on how to help children enjoy the holidays without chaos. Summer holidays are a breath of freedom for all children, but for children with ADHD the lack of a schedule can bring tension, boredom and more conflicts.',
      tips: [
        'It is important to maintain a basic routine: fixed hours for sleep, meals and some daily activities help the child feel safe.',
        'Opportunities for movement can help significantly in daily life, such as swimming and cycling. Such activities help channel energy.',
        'Managing excessive screen time. The use of a mobile phone or tablet can increase anxiety and irritability.',
        'Plan small daily «missions», such as a craft, watering the plants or preparing for the beach — they give the child a sense of responsibility.',
        'Preparing for a change is often the key. Inform them in advance about outings or changes in the schedule.',
        'Keep in touch with the specialist. If there are questions about behavior or medication during the summer, discuss them with the specialist following the child.'
      ],
      closing: 'The most important thing is to remember that children with ADHD do not need «perfect» holidays. They need an environment with understanding, a little structure and plenty of opportunities for play and rest.',
      sourcesTitle: 'Sources',
      readMore: 'Read more',
      readLess: 'Show less',
      author: 'Σοφία Σπυριάδου'
    },
    fr: {
      label: 'Article · TDAH & Été',
      title: 'Pourquoi interrompons-nous le médicament du TDAH pendant les vacances ?',
      intro: [
        "La fermeture des écoles et le début de la période estivale suscitent souvent de nombreuses questions chez les parents d'enfants et d'adolescents atteints de TDAH (Trouble Déficitaire de l'Attention avec Hyperactivité). Beaucoup de parents se demandent s'il est bon de continuer le médicament pour le TDAH ou de faire une pause pendant les vacances d'été. Ainsi surviennent diverses questions, comme la façon dont les symptômes sont affectés et s'il existe finalement des bénéfices à une interruption temporaire.",
        "Cela est aussi connu sous le nom de « drug holiday », c'est-à-dire l'interruption des médicaments pendant les vacances. Le terme « drug holiday » désigne l'interruption temporaire convenue du traitement pharmacologique pour une période déterminée, toujours après concertation avec le médecin traitant.",
        "Ces questions sont tout à fait compréhensibles, car il existe une confusion importante autour du sujet. Sur Internet et dans les médias circulent de nombreuses informations souvent contradictoires, ce qui rend difficile pour les parents et les patients de comprendre ce qui est réellement valable. La réponse, cependant, n'est ni si simple ni identique pour tous les enfants et adolescents. Certes, l'été peut être une occasion de sortir de la routine quotidienne et de certaines obligations, mais cela ne s'applique pas aux obligations liées à la santé. Néanmoins, l'interruption du médicament du TDAH est recommandée dans certains cas. Les raisons pour lesquelles un « drug holiday » peut être proposé incluent l'évaluation du besoin de poursuivre le traitement, la gestion des effets indésirables possibles, le contrôle d'une éventuelle tolérance au médicament et une meilleure compréhension par l'enfant et la famille des bénéfices du traitement.",
        "La décision d'interrompre le traitement n'est pas la même pour tous. Au contraire, elle doit être prise de manière individualisée, après avoir soigneusement discuté : les bénéfices de la poursuite du traitement, les effets secondaires possibles, les besoins et les particularités de la personne atteinte de TDAH, ainsi que les points de vue de la famille et des soignants.",
        "Le début, la poursuite ou l'interruption temporaire du traitement pharmacologique du TDAH doit toujours se faire en collaboration avec le médecin spécialiste et se baser sur les besoins de la personne."
      ],
      tipsTitle: "Suggestions pour l'été",
      tipsIntro: "L'été est aussi une occasion de connexion, de communication et de renforcement des compétences. Sur cette base, nous proposons quelques éléments essentiels pour aider les enfants à profiter des vacances sans chaos. Les vacances d'été sont une bouffée de liberté pour tous les enfants, mais pour les enfants atteints de TDAH, le manque de programme peut apporter tension, ennui et davantage de conflits.",
      tips: [
        "Il est important de maintenir une routine de base : des heures fixes pour le sommeil, les repas et certaines activités quotidiennes aident l'enfant à se sentir en sécurité.",
        "Les occasions de bouger peuvent beaucoup aider au quotidien, comme la natation et le vélo. De telles activités aident à canaliser l'énergie.",
        "La gestion de l'excès d'écran. L'utilisation du téléphone ou de la tablette peut augmenter l'anxiété et l'irritabilité.",
        "Planifiez de petites « missions » quotidiennes, comme un bricolage, l'arrosage des plantes ou la préparation pour la plage — elles donnent à l'enfant un sens des responsabilités.",
        "La préparation à un changement est souvent la clé. Informez-les à l'avance des sorties ou des changements de programme.",
        "Gardez le contact avec le spécialiste. En cas de questions sur le comportement ou le traitement pendant l'été, discutez-en avec le spécialiste qui suit l'enfant."
      ],
      closing: "Le plus important est de se rappeler que les enfants atteints de TDAH n'ont pas besoin de vacances « parfaites ». Ils ont besoin d'un environnement empreint de compréhension, d'un peu de structure et de nombreuses occasions de jeu et de repos.",
      sourcesTitle: 'Sources',
      readMore: 'Lire la suite',
      readLess: 'Afficher moins',
      author: 'Σοφία Σπυριάδου'
    }
  } as const;

  const depy = depyArticle[lang];


  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-black font-semibold text-xl sm:text-2xl font-quicksand">{content[lang].title}</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-6 font-poppins">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300">
              {content[lang].subtitle}
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-nunito">
            {content[lang].description}
          </p>
        </motion.div>

        {/* Εικόνα με ευτυχισμένα παιδιά πριν τις κάρτες υπηρεσιών */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          className="mb-12 overflow-hidden rounded-4xl shadow-2xl border border-gray-100 max-w-5xl mx-auto"
        >
          <img
            src={happyImg}
            alt="Χαρούμενα παιδιά χαμογελούν και διασκεδάζουν μαζί"
            className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover"
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-20">
          {content[lang].services.map((service: Service, index: number) => {
            const IconComponent = icons[index];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-blue-50 rounded-4xl p-6 sm:p-8 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-500"
              >
                {/* Icon */}
                    <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 p-4 rounded-2xl w-fit mb-6 shadow-lg"
                >
                  <IconComponent className="h-8 w-8 text-gray-700" />
                  </motion.div>
                  
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 font-poppins">
                    {service.title}
                  </h3>
                  
                <p className="text-gray-600 mb-6 leading-relaxed font-nunito">
                    {service.description}
                  </p>
                  
                    <ul className="space-y-3">
                      {service.features.map((feature: string, featureIndex: number) => (
                        <motion.li 
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center text-sm text-gray-600 font-quicksand"
                        >
                          <motion.div 
                            whileHover={{ scale: 1.5 }}
                            className="w-2 h-2 bg-gradient-to-r from-rose-soft to-purple-soft rounded-full mr-3"
                          />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-5xl p-8 md:p-12 shadow-2xl border border-gray-100"
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-800 mb-4 font-poppins">{content[lang].conditionsTitle}</h3>
            {content[lang].conditionsDescription && (
              <p className="text-gray-600 text-lg font-nunito max-w-4xl mx-auto leading-relaxed">
                {content[lang].conditionsDescription}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {content[lang].conditions.map((condition, index: number) => (
              <motion.button 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCondition({
                  name: condition.name, 
                  definition: condition.definition,
                  symptoms: condition.symptoms
                })}
                className="bg-gradient-to-r from-pastel-pink to-baby-blue border border-rose-soft/20 rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <span className="text-gray-700 font-medium text-sm font-quicksand">{condition.name}</span>
              </motion.button>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-warm-cream to-yellow-soft p-6 rounded-3xl"
          >
            <Smile className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
            <p className="text-gray-600 italic font-nunito leading-relaxed">
              {content[lang].notListed}
            </p>
          </motion.div>
        </motion.div>

        {/* Άρθρο: ΔΕΠΥ & Καλοκαίρι */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 relative overflow-hidden rounded-5xl p-1 bg-gradient-to-br from-pink-200/80 via-purple-200/70 to-blue-200/80 shadow-2xl"
        >
          <div className="relative rounded-[2.3rem] bg-white/95 backdrop-blur-sm p-8 md:p-12 border border-white/70 overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -right-10 h-52 w-52 rounded-full bg-yellow-soft/30 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-purple-soft/20 blur-3xl" aria-hidden />

            {/* Header */}
            <div className="relative flex flex-col items-center text-center mb-8">
              <motion.div
                whileHover={{ rotate: 18, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-soft via-pink-200 to-purple-200 shadow-lg"
              >
                <Sun className="h-8 w-8 text-yellow-600" />
              </motion.div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-purple-700 font-quicksand">
                <Sparkles className="h-3.5 w-3.5" />
                {depy.label}
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-poppins leading-tight max-w-3xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                  {depy.title}
                </span>
              </h3>
              <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-rose-soft via-purple-soft to-blue-soft" />
            </div>

            {/* Πάντα ορατή εισαγωγή */}
            <div className="relative space-y-4 max-w-3xl mx-auto">
              {depy.intro.slice(0, 2).map((paragraph: string, i: number) => (
                <p key={i} className="text-gray-700 leading-relaxed font-nunito text-justify">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Επεκτεινόμενο περιεχόμενο */}
            <AnimatePresence initial={false}>
              {showDepyArticle && (
                <motion.div
                  key="depy-more"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="relative space-y-4 max-w-3xl mx-auto pt-4">
                    {depy.intro.slice(2).map((paragraph: string, i: number) => (
                      <p key={i} className="text-gray-700 leading-relaxed font-nunito text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Προτάσεις για το καλοκαίρι */}
                  <div className="mt-10 max-w-3xl mx-auto">
                    <div className="rounded-4xl bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6 sm:p-8 border border-purple-100/70">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-200 to-purple-200 shadow">
                          <Sparkles className="h-5 w-5 text-purple-600" />
                        </div>
                        <h4 className="text-xl sm:text-2xl font-bold text-gray-800 font-poppins">
                          {depy.tipsTitle}
                        </h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed font-nunito text-justify mb-6">
                        {depy.tipsIntro}
                      </p>
                      <ul className="space-y-4">
                        {depy.tips.map((tip: string, i: number) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: i * 0.05 }}
                            className="flex items-start gap-4 rounded-2xl bg-white/80 p-4 shadow-sm border border-white"
                          >
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-rose-soft to-purple-soft text-white text-sm font-bold font-poppins">
                              {i + 1}
                            </span>
                            <span className="text-gray-700 font-nunito leading-relaxed">{tip}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Κλείσιμο */}
                  <div className="mt-8 max-w-3xl mx-auto">
                    <div className="rounded-3xl bg-gradient-to-r from-warm-cream to-yellow-soft p-6 text-center">
                      <p className="text-gray-700 font-nunito leading-relaxed italic">
                        {depy.closing}
                      </p>
                      <p className="mt-4 text-sm font-semibold text-gray-600 font-quicksand not-italic">
                        {depy.author}
                      </p>
                    </div>
                  </div>

                  {/* Πηγές */}
                  <div className="mt-8 max-w-3xl mx-auto">
                    <button
                      type="button"
                      onClick={() => setShowDepySources(v => !v)}
                      className="flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-900 transition-colors font-quicksand"
                    >
                      <BookOpen className="h-4 w-4" />
                      {depy.sourcesTitle}
                      <ChevronDown className={`h-4 w-4 transition-transform ${showDepySources ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {showDepySources && (
                        <motion.ol
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden mt-4 space-y-3 list-decimal list-inside"
                        >
                          {depySources.map((src, i: number) => (
                            <li key={i} className="text-xs sm:text-sm text-gray-500 font-nunito leading-relaxed">
                              {src.text}{' '}
                              {src.url && (
                                <a
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 underline break-all"
                                >
                                  {src.url}
                                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                </a>
                              )}
                            </li>
                          ))}
                        </motion.ol>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle */}
            <div className="relative mt-8 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowDepyArticle(v => !v)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 px-8 py-3 font-semibold text-gray-700 shadow-md hover:shadow-lg transition-all font-quicksand border border-white/60"
              >
                {showDepyArticle ? depy.readLess : depy.readMore}
                <ChevronDown className={`h-5 w-5 transition-transform ${showDepyArticle ? 'rotate-180' : ''}`} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Condition Details Modal */}
        <AnimatePresence>
          {selectedCondition && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedCondition(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 font-poppins">
                    {selectedCondition.name}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedCondition(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>
                
                <div className="space-y-6">
                  {selectedCondition.definition && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 font-quicksand mb-3">
                        {language === 'gr' ? 'Ορισμός:' : 
                          language === 'en' ? 'Definition:' : 
                          'Définition:'}
                      </h4>
                      <p className="text-gray-600 font-nunito leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {selectedCondition.definition}
                      </p>
                    </div>
                  )}
                  
                  <div>
                  <h4 className="text-lg font-semibold text-gray-700 font-quicksand mb-3">
                      {language === 'gr' ? 'Συμπτώματα:' : 
                        language === 'en' ? 'Symptoms:' : 
                        'Symptômes:'}
                  </h4>
                  <ul className="space-y-3">
                      {selectedCondition.symptoms.map((symptom: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="w-2 h-2 bg-gradient-to-r from-rose-soft to-purple-soft rounded-full mr-3 mt-2 flex-shrink-0"
                        />
                          <span className="text-gray-600 font-nunito leading-relaxed">{symptom}</span>
                      </motion.li>
                    ))}
                  </ul>
                  </div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="mt-8 pt-6 border-t border-gray-200"
                >
                  <p className="text-center text-gray-500 font-quicksand">
                    {language === 'gr' 
                      ? 'Για περισσότερες πληροφορίες ή για να κλείσετε ραντεβού, επικοινωνήστε μαζί μας.'
                      : 'For more information or to book an appointment, please contact us.'
                    }
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </section>
  );
};

export default Services;