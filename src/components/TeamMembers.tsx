import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ioannaCertificate from '../assets/ioanna_certificate.png';
import wolverhampton from '../assets/WOLVERHAMPTON.png';
import sofiaCertificate from '../assets/sofia_certificate.png';
import sofiaMaster from '../assets/sofia_master.png';
import sofia2 from '../assets/sofia_2.png';
import certificatSystemique from '../assets/Certificat Systemique.png';
import analytikiVeveosiStergiou from '../assets/Αναλυτική Βεβαίωση Στεργίου ΣΥΣΤΗΜΙΚΗ.png';
import metaptychiakoEkseliktikisSxolikis from '../assets/ΜΕΤΑΠΤΥΧΙΑΚΟ ΕΞΕΛΙΚΤΙΚΗΣ ΣΧΟΛΙΚΗΣ ΨΥΧΟΛΟΓΙΑΣ.png';
import metaptychiakoEfarmoges from '../assets/ΜΕΤΑΠΤΥΧΙΑΚΟ ΕΦΑΡΜΟΓΕΣ ΤΗΣ ΨΥΧΟΛΟΓΙΑΣ ΣΤΗΝ ΥΓΕΙΑ.png';
import ptychioPsychologias from '../assets/ΠΤΥΧΙΟ ΨΥΧΟΛΟΓΙΑΣ.png';
import mariaPtychio from '../assets/Μαρία Κ. Δημητριάδουπτυχίο (1).png';
import mariaMetaptychiako from '../assets/Μαρία Κ. ΔημητριάδουΜεταπτυχιακο (1).png';
import mariaAdeiaAskiseos from '../assets/Μαρία Κ. ΔημητριάδουΑΔΕΙΑΑΣΚΗΣΕΩΣ (1).png';
import mariaVeveosi from '../assets/Μαρία Κ. Δημητριάδουβεβαιωση (1).png';
import ioannaCarouselPhoto from '../assets/πισσάρη.png';
import sofiaCarouselPhoto from '../assets/sofia.jpeg';
import eiriniPhoto from '../assets/Eirini_Stergiou.jpg';
import mariaPhoto from '../assets/Μαρία Κ. Δημητριάδου.jpg';

interface TeamMembersProps {
  language: string;
}

type Lang = 'gr' | 'en' | 'fr';

const formatBioParagraph = (paragraph: string) =>
  paragraph.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-black">$1</span>');

const TeamMembers: React.FC<TeamMembersProps> = ({ language }) => {
  const lang = language as Lang;

  const [activeIndex, setActiveIndex] = useState(0);
  const [bioMemberId, setBioMemberId] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [selectedPDFs, setSelectedPDFs] = useState<string[]>([]);

  const content = {
    gr: {
      title: 'Η ομάδα της Δρ. Φύτρου',
      subtitle: 'Οι συνεργάτες μας είναι ψυχολόγοι και ψυχοθεραπευτές, εξειδικευμένοι στην παιδική ψυχοπαθολογία και εποπτεύονται εβδομαδιαίως από την Δρ. Φύτρου για τα περιστατικά του ιατρείου.',
      viewButton: 'Προβολή Πτυχίου/Εκπαιδεύσεων',
      bioButton: 'Βιογραφικό',
      degreesButton: 'Πτυχία',
      closeButton: 'Κλείσιμο'
    },
    en: {
      title: 'Dr. Fytrou\'s Team',
      subtitle: 'Our collaborators are psychologists and psychotherapists, specialized in child psychopathology and supervised weekly by Dr. Fytrou for the clinic\'s cases.',
      viewButton: 'View Degree/Training',
      bioButton: 'Biography',
      degreesButton: 'Degrees',
      closeButton: 'Close'
    },
    fr: {
      title: 'L\'équipe du Dr Fytrou',
      subtitle: 'Nos collaborateurs sont des psychologues et psychothérapeutes, spécialisés en psychopathologie de l\'enfant et supervisés hebdomadairement par le Dr Fytrou pour les cas de la clinique.',
      viewButton: 'Voir Diplôme/Formation',
      bioButton: 'Biographie',
      degreesButton: 'Diplômes',
      closeButton: 'Fermer'
    }
  };

  const handleViewCertificates = (memberId: number) => {
    setSelectedMember(memberId);
    if (memberId === 1) {
      setSelectedPDFs([ioannaCertificate, wolverhampton]);
    } else if (memberId === 2) {
      setSelectedPDFs([sofiaCertificate, sofiaMaster, sofia2]);
    } else if (memberId === 3) {
      setSelectedPDFs([
        ptychioPsychologias,
        metaptychiakoEkseliktikisSxolikis,
        metaptychiakoEfarmoges,
        certificatSystemique,
        analytikiVeveosiStergiou
      ]);
    } else if (memberId === 4) {
      setSelectedPDFs([
        mariaPtychio,
        mariaMetaptychiako,
        mariaAdeiaAskiseos,
        mariaVeveosi
      ]);
    }
  };

  const handleCloseCertificatesModal = () => {
    setSelectedMember(null);
    setSelectedPDFs([]);
  };

  const handleCloseBioModal = () => {
    setBioMemberId(null);
  };

  const teamMembers = {
    gr: [
      {
        id: 1,
        name: 'Ιωάννα Πισσάρη',
        image: ioannaCarouselPhoto,
        bio: `Η κυρία Πισσάρη ολοκλήρωσε τις σπουδές της στην Ψυχολογία στο Εθνικό Καποδιστριακό Πανεπιστήμιο Αθηνών και ακολούθησε **Μεταπτυχιακό Πρόγραμμα Σπουδών στην Κλινική Ψυχική Υγεία** στο Πανεπιστήμιο «University of Wolverhampton» της Αγγλίας.

Το ενδιαφέρον της στρέφεται γύρω από την **4ετή εκπαίδευση της στην Γνωστική Συμπεριφορική Ψυχοθεραπεία** από την Εταιρεία Γνωσιακής Συμπεριφορικής Ψυχοθεραπείας, ενώ παράλληλα είναι εξειδικευμένη στο **Φάσμα του Αυτισμού** και την **Διαταραχή Ελλειματικής Προσοχής και Υπερκινητικότητας (ΔΕΠΥ)** από το Πανεπιστήμιου «University of Derby» της Αγγλίας.

Η κυρία Πισσάρη είναι **Υπέρμαχος της προστασίας των γυναικών και των ασθενών**. Έχει υποστηρίξει με την συμμετοχή της, επιστημονικές έρευνες και ημερίδες, πληθώρα ασθενών της Γενικής Ιδιωτικής Γυναικολογικής Κλινικής ΙΑΣΩ. Έχει στενή συνεργασία με το Εθνικό Κέντρο Κοινωνικών Ερευνών και την Ευρωπαϊκή Ένωση ΕΚΚΕ όπου διεξάγει έρευνες που αφορούν την κακοποίηση και τη προστασία των κακοποιημένων γυναικών. Επιπλέον ήταν Υπεύθυνη Ομάδας στο πρόγραμμα «Project C Foundation» όπου υποστήριζε ασθενείς μέσα από Πλατφόρμες Κοινωνικής Δικτύωσης.

Είναι η ιδανική ειδικός για τη **Πρώτη Συνεδρία των γονέων** με το Ιατρείο μας, την **Εξέταση και Ψυχοθεραπεία παιδιών και εφήβων** και για **Συμβουλευτική γονέων**.

Η κλινική παιδοψυχολόγος μιλάει **άψογα ελληνικά και αγγλικά**.`
      },
      {
        id: 2,
        name: 'Σοφία Σπυριάδου',
        image: sofiaCarouselPhoto,
        bio: `Η κυρία Σπυριάδου ολοκλήρωσε τις σπουδές της στη Ψυχολογία στο Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης και ακολούθησε **Μεταπτυχιακό Πρόγραμμα Σπουδών στην Κλινική Ψυχική Υγεία** στο ίδιο Πανεπιστήμιο.

Έχει εκπαιδευτεί στην **Κλινική Ψυχομετρία και Νευροψυχολογία** στη Γ' Πανεπιστημιακή Ψυχιατρική Κλινική του ΑΧΕΠΑ. Εμπλουτίζει τις γνώσεις της με την **4ετή εκπαίδευση της στη Γνωσιακή Συμπεριφορική Ψυχοθεραπεία** στην Ελληνική Εταιρεία Γνωσιακής και Συμπεριφορικής Ψυχοθεραπείας.

Είναι **πιστοποιημένη στη χορήγηση ψυχομετρικών εργαλείων** όπως : Τεστ νοημοσύνης ενηλίκων **WAIS- V**, Τεστ νοημοσύνης ανηλίκων **WISC- III**, Κλίμακα κατάθλιψης **Hamilton-D**, **SCI- PANSS**, για την σχιζοφρένεια, Κλίμακα μανίας, διπολικής διαταραχής, Young Mania Rating Scale. Έχει εκπαιδευτεί από το Αμερικανικό Πανεπιστήμιο του Κολοράντο «University of Colorado,陕西» στη **σχολική ψυχολογία**. Έχοντας τεράστια εμπειρία στο ελληνικό και το γερμανικό σύστημα εκπαίδευσης, διαθέτει όλα τα εφόδια να συνοδεύσει τα παιδιά και τους εφήβους στις δυσκολίες τους κατά τα σχολικά χρόνια.

Είναι η ιδανική ειδικός για τη **Πρώτη Συνεδρία των γονέων** με το Ιατρείο μας, την **Εξέταση και Ψυχοθεραπεία παιδιών και εφήβων** και τους γονείς τους σε **Συμβουλευτική γονέων**.

Η κλινική παιδοψυχολόγος μιλάει **άψογα ελληνικά και γερμανικά**.`
      },
      {
        id: 3,
        name: 'Ειρήνη Στεργίου',
        image: eiriniPhoto,
        bio: `Η κυρία Στεργίου ολοκλήρωσε τις σπουδές της στη Ψυχολογία στο Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης, ακολούθησε το πρώτο της **Μεταπτυχιακό Πρόγραμμα σπουδών στην Αναπτυξιακή και Σχολική Ψυχολογία** και έπειτα ολοκλήρωσε και δεύτερο της **Μεταπτυχιακό Πρόγραμμα σπουδών στις Εφαρμογές της Ψυχολογίας στην Υγεία**, στο τμήμα ιατρικής στο ίδιο Πανεπιστήμιο.

Έχει ολοκληρώσει την **4ετή εκπαίδευση της στη Συστημική Οικογενειακή Ψυχοθεραπεία** στο Ινστιτούτο Συστημικής Σκέψης και Ψυχοθεραπείας, ενώ είναι **πιστοποιημένη στη χορήγηση και αξιολόγηση ψυχομετρικών εργαλείων** όπως το **WISC-V**.

Έχει έντονη επιστημονική δραστηριότητα, επί του παρόντος, στο Νοσοκομείο **«Hôpital Du Jura»** στο Ντελεμόντ της Ελβετίας και στο Ιδιωτικό Ψυχιατρικό Κέντρο **«Les Toises»** της Λωζάνης. To ενδιαφέρον της αφορά κυρίως τις **νευροαναπτυξιακές διαταραχές (ΔΕΠΥ, αυτισμός)**, την **παιδική κατάθλιψη και το πένθος**. Στην Ελλάδα συμμετείχε σε διεπιστημονικές ομάδες Εθελοντικών Προγραμμάτων της Unicef όπως το **«Solidarity Now»**, του Διεθνή Οργανισμού Μετανάστευσης όπως το **«Helios»** και των **Γιατρών Χωρίς Σύνορα**.

Είναι η ιδανική ειδικός για **Εξέταση και Ψυχοθεραπεία παιδιών και εφήβων και για Συμβουλευτική γονέων**.

Η **αναπτυξιακή παιδοψυχολόγος μιλάει άψογα ελληνικά και γαλλικά**.`
      },
      {
        id: 4,
        name: 'Μαρία Κ. Δημητριάδου',
        image: mariaPhoto,
        bio: `Η κυρία Δημητριάδου ολοκλήρωσε τις σπουδές της στην Ψυχολογίας στο Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης και ακολούθησε το **Μεταπτυχιακό Πρόγραμμα Σπουδών στην Κλινική Ψυχική Υγεία** στην Ιατρική Σχολή του ίδιου Πανεπιστημίου.

Είναι **υποψήφια διδάκτωρ (PhDc)** στο Πανεπιστήμιο Δυτικής Μακεδονίας και έχει εκπαιδευτεί στη **Γνωστική Συμπεριφορική Θεραπεία**.

Το κλινικό της ενδιαφέρον εστιάζει κυρίως στην υποστήριξη ενηλίκων και εφήβων, με **αγχώδη διαταραχή, κρίσεις πανικού, συναισθηματικές διαταραχές (κατάθλιψη, πένθος, δυσθυμία)** και **διατροφικές διαταραχές**. Έχει εκπαιδευτεί στην αντιμετώπιση ασθενών με **χρόνια σωματική νόσο** και με **επαγγελματική εξουθένωση (burn out)**.

Μέσα από την πολυετή ενασχόλησή της με ευάλωτες κοινωνικές ομάδες δημιουργεί εξατομικευμένα προγράμματα ενδυνάμωσης νέων, με την προσέγγιση της να βασίζεται στην κλινική γνώση και την ενσυναίσθηση. Στόχος της είναι η εξατομικευμένη φροντίδα, η ενίσχυση της αυτοεκτίμησης και η καλλιέργεια της ψυχικής ανθεκτικότητας.

Είναι η ιδανική ειδικός για τη **Πρώτη Συνεδρία των γονέων** με το Ιατρείο μας, την **Εξέταση-Ψυχοθεραπεία εφήβων** και **Συμβουλευτική γονέων εφήβων**.

Η κλινική παιδοψυχολόγος μιλάει **άψογα ελληνικά**.`
      }
    ],
    en: [
      {
        id: 1,
        name: 'Ioanna Pissari',
        image: ioannaCarouselPhoto,
        bio: `Ms. Pissari completed her studies in Psychology at the National and Kapodistrian University of Athens and followed a **Master's Program in Clinical Mental Health** at the University "University of Wolverhampton" in England.

Her interest revolves around her **4-year training in Cognitive Behavioral Therapy** from the Cognitive Behavioral Therapy Society, while she is also specialized in **Autism Spectrum** and **Attention Deficit Hyperactivity Disorder (ADHD)** from the University "University of Derby" in England.

Ms. Pissari is a **Champion of women's and patients' protection**. She has supported, through her participation, scientific research and conferences, a multitude of patients from the General Private Gynecological Clinic IASO. She has close collaboration with the National Center for Social Research and the European Union EKKE where she conducts research concerning abuse and protection of abused women. Furthermore, she was Group Leader in the "Project C Foundation" program where she supported patients through Social Networking Platforms.

She is the ideal specialist for the **First Parent Session** with our Clinic, **Examination and Psychotherapy of children and adolescents** and for **Parent Counseling**.

The clinical child psychologist speaks **fluent Greek and English**.`
      },
      {
        id: 2,
        name: 'Sofia Spyriadou',
        image: sofiaCarouselPhoto,
        bio: `Ms. Spyriadou completed her studies in Psychology at Aristotle University of Thessaloniki and followed a **Master's Program in Clinical Mental Health** at the same University.

She has been trained in **Clinical Psychometry and Neuropsychology** at the 3rd University Psychiatric Clinic of AHEPA. She enriches her knowledge with her **4-year training in Cognitive Behavioral Therapy** at the Greek Society of Cognitive and Behavioral Therapy.

She is **certified in administering psychometric tools** such as: Adult Intelligence Test **WAIS-V**, Juvenile Intelligence Test **WISC-III**, Depression Scale **Hamilton-D**, **SCI-PANSS** for schizophrenia, Mania Scale, bipolar disorder, Young Mania Rating Scale. She has been trained by the American University of Colorado "University of Colorado, USA" in **school psychology**. Having extensive experience in the Greek and German education system, she has all the tools to support children and adolescents in their difficulties during school years.

She is the ideal specialist for the **First Parent Session** with our Clinic, **Examination and Psychotherapy of children and adolescents** and their parents in **Parent Counseling**.

The clinical child psychologist speaks **fluent Greek and German**.`
      },
      {
        id: 3,
        name: 'Eirini Stergiou',
        image: eiriniPhoto,
        bio: `Ms. Stergiou completed her studies in Psychology at Aristotle University of Thessaloniki, followed her first **Master's Program in Developmental and School Psychology** and then completed her second **Master's Program in Applications of Psychology in Health**, in the medical department of the same University.

She has completed her **4-year training in Systemic Family Psychotherapy** at the Institute of Systemic Thinking and Psychotherapy, while she is **certified in administering and evaluating psychometric tools** such as **WISC-V**.

She has intense scientific activity, currently at the **"Hôpital Du Jura"** Hospital in Delémont, Switzerland and at the Private Psychiatric Center **"Les Toises"** in Lausanne. Her interest mainly concerns **neurodevelopmental disorders (ADHD, autism)**, **childhood depression and grief**. In Greece, she participated in interdisciplinary groups of UNICEF Volunteer Programs such as **"Solidarity Now"**, of the International Organization for Migration such as **"Helios"** and **"Doctors Without Borders"**.

She is the ideal specialist for **Examination and Psychotherapy of children and adolescents and for Parent Counseling**.

The **developmental child psychologist speaks fluent Greek and French**.`
      },
      {
        id: 4,
        name: 'Maria K. Dimitriadou',
        image: mariaPhoto,
        bio: `Ms. Dimitriadou completed her studies in Psychology at Aristotle University of Thessaloniki and followed the **Master's Program in Clinical Mental Health** at the Medical School of the same University.

She is a **PhD candidate (PhDc)** at the University of Western Macedonia and has been trained in **Cognitive Behavioral Therapy**.

Her clinical interest focuses mainly on the support of adults and adolescents with **anxiety disorder, panic attacks, emotional disorders (depression, grief, dysthymia)** and **eating disorders**. She has been trained in the management of patients with **chronic somatic illness** and **professional burnout (burn out)**.

Through her many years of involvement with vulnerable social groups, she creates individualized empowerment programs for young people, with her approach based on clinical knowledge and empathy. Her goal is individualized care, the strengthening of self-esteem and the cultivation of mental resilience.

She is the ideal specialist for the **First Parent Session** with our Clinic, the **Examination and Psychotherapy of adolescents** and **Counseling for parents of adolescents**.

The clinical child psychologist speaks **fluent Greek**.`
      }
    ],
    fr: [
      {
        id: 1,
        name: 'Ioanna Pissari',
        image: ioannaCarouselPhoto,
        bio: `Mme Pissari a terminé ses études en Psychologie à l'Université Nationale et Kapodistrienne d'Athènes et a suivi un **Programme de Master en Santé Mentale Clinique** à l'Université "University of Wolverhampton" en Angleterre.

Son intérêt tourne autour de sa **formation de 4 ans en Thérapie Cognitivo-Comportementale** de la Société de Thérapie Cognitivo-Comportementale, tandis qu'elle est également spécialisée dans le **Spectre de l'Autisme** et le **Trouble Déficitaire de l'Attention avec Hyperactivité (TDAH)** de l'Université "University of Derby" en Angleterre.

Mme Pissari est une **Championne de la protection des femmes et des patients**. Elle a soutenu, par sa participation, des recherches scientifiques et des conférences, une multitude de patients de la Clinique Gynécologique Privée Générale IASO. Elle a une collaboration étroite avec le Centre National de Recherche Sociale et l'Union Européenne EKKE où elle mène des recherches concernant l'abus et la protection des femmes maltraitées. De plus, elle était Responsable d'Équipe dans le programme "Project C Foundation" où elle soutenait les patients via des Plateformes de Réseaux Sociaux.

Elle est la spécialiste idéale pour la **Première Session Parentale** avec notre Clinique, l'**Examen et Psychothérapie des enfants et adolescents** et pour le **Conseil Parental**.

La psychologue clinique pour enfants parle **couramment le grec et l'anglais**.`
      },
      {
        id: 2,
        name: 'Sofia Spyriadou',
        image: sofiaCarouselPhoto,
        bio: `Mme Spyriadou a terminé ses études en Psychologie à l'Université Aristote de Thessalonique et a suivi un **Programme de Master en Santé Mentale Clinique** à la même Université.

Elle a été formée en **Psychométrie Clinique et Neuropsychologie** à la 3ème Clinique Psychiatrique Universitaire d'AHEPA. Elle enrichit ses connaissances avec sa **formation de 4 ans en Thérapie Cognitivo-Comportementale** à la Société Grecque de Thérapie Cognitivo-Comportementale.

Elle est **certifiée dans l'administration d'outils psychométriques** tels que : Test d'intelligence adulte **WAIS-V**, Test d'intelligence juvénile **WISC-III**, Échelle de dépression **Hamilton-D**, **SCI-PANSS** pour la schizophrénie, Échelle de manie, trouble bipolaire, Young Mania Rating Scale. Elle a été formée par l'Université Américaine du Colorado "University of Colorado, USA" en **psychologie scolaire**. Ayant une vaste expérience dans le système éducatif grec et allemand, elle dispose de tous les outils pour accompagner les enfants et adolescents dans leurs difficultés pendant les années scolaires.

Elle est la spécialiste idéale pour la **Première Session Parentale** avec notre Clinique, l'**Examen et Psychothérapie des enfants et adolescents** et leurs parents en **Conseil Parental**.

La psychologue clinique pour enfants parle **couramment le grec et l'allemand**.`
      },
      {
        id: 3,
        name: 'Eirini Stergiou',
        image: eiriniPhoto,
        bio: `Mme Stergiou a terminé ses études en Psychologie à l'Université Aristote de Thessalonique, a suivi son premier **Programme de Master en Psychologie du Développement et Scolaire** puis a terminé son deuxième **Programme de Master en Applications de la Psychologie dans la Santé**, dans le département médical de la même Université.

Elle a terminé sa **formation de 4 ans en Psychothérapie Familiale Systémique** à l'Institut de Pensée Systémique et Psychothérapie, tandis qu'elle est **certifiée dans l'administration et l'évaluation d'outils psychométriques** tels que **WISC-V**.

Elle a une activité scientifique intense, actuellement à l'Hôpital **"Hôpital Du Jura"** à Delémont, Suisse et au Centre Psychiatrique Privé **"Les Toises"** à Lausanne. Son intérêt concerne principalement les **troubles neurodéveloppementaux (TDAH, autisme)**, la **dépression infantile et le deuil**. En Grèce, elle a participé à des groupes interdisciplinaires de Programmes de Bénévoles UNICEF comme **"Solidarity Now"**, de l'Organisation Internationale pour les Migrations comme **"Helios"** et **"Médecins Sans Frontières"**.

Elle est la spécialiste idéale pour l'**Examen et Psychothérapie des enfants et adolescents et pour le Conseil Parental**.

La **psychologue du développement pour enfants parle couramment le grec et le français**.`
      },
      {
        id: 4,
        name: 'Maria K. Dimitriadou',
        image: mariaPhoto,
        bio: `Mme Dimitriadou a terminé ses études en Psychologie à l'Université Aristote de Thessalonique et a suivi le **Programme de Master en Santé Mentale Clinique** à la Faculté de Médecine de la même Université.

Elle est **doctorante (PhDc)** à l'Université de Macédoine Occidentale et a été formée en **Thérapie Cognitivo-Comportementale**.

Son intérêt clinique se concentre principalement sur le soutien des adultes et des adolescents souffrant de **troubles anxieux, crises de panique, troubles émotionnels (dépression, deuil, dysthymie)** et **troubles alimentaires**. Elle a été formée à la prise en charge des patients atteints de **maladie somatique chronique** et de **burn-out professionnel (burn out)**.

À travers ses nombreuses années d'engagement auprès de groupes sociaux vulnérables, elle crée des programmes individualisés de renforcement pour les jeunes, son approche reposant sur la connaissance clinique et l'empathie. Son objectif est la prise en charge personnalisée, le renforcement de l'estime de soi et la culture de la résilience psychologique.

Elle est la spécialiste idéale pour la **Première Session Parentale** avec notre Clinique, l'**Examen-Psychothérapie des adolescents** et le **Conseil aux parents d'adolescents**.

La psychologue clinique pour enfants parle **couramment le grec**.`
      }
    ]
  };

  const CAROUSEL_ORDER = [1, 4, 2, 3];
  const members = CAROUSEL_ORDER.map((id) => teamMembers[lang].find((m) => m.id === id)!);
  const memberCount = members.length;

  const goToSlide = useCallback((index: number) => {
    setActiveIndex((index + memberCount) % memberCount);
  }, [memberCount]);

  const goNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  const bioMember = bioMemberId !== null
    ? members.find((m) => m.id === bioMemberId)
    : null;

  const renderBioContent = (bio: string) => (
    <div className="space-y-4">
      {bio.split('\n\n').map((paragraph: string, pIndex: number) => (
        <p
          key={pIndex}
          className="text-gray-700 leading-relaxed text-xs sm:text-sm text-justify"
          dangerouslySetInnerHTML={{
            __html: formatBioParagraph(paragraph)
          }}
        />
      ))}
    </div>
  );

  const subtitleHtml = lang === 'gr'
    ? content[lang].subtitle.replace(
        'εποπτεύονται εβδομαδιαίως από την Δρ. Φύτρου',
        '<u>εποπτεύονται εβδομαδιαίως από την Δρ. Φύτρου</u>'
      )
    : content[lang].subtitle;

  return (
    <section
      id="team"
      className="relative py-10 sm:py-14 overflow-hidden bg-gradient-to-br from-purple-50/90 via-pink-50/70 to-blue-50/90"
      data-section="team"
    >
      <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-purple-soft/15 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-rose-soft/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-soft/10 blur-3xl" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
              {content[lang].title}
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-rose-soft via-purple-soft to-blue-soft mx-auto mb-4 rounded-full" />
          <p
            className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-bold font-nunito"
            dangerouslySetInnerHTML={{ __html: subtitleHtml }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto p-1 rounded-4xl bg-gradient-to-br from-pink-200/80 via-purple-200/70 to-blue-200/80 shadow-xl"
        >
          <div className="rounded-[1.85rem] overflow-hidden bg-white/95 backdrop-blur-sm shadow-2xl border border-white/80">
            <div className="relative">
              <div className="relative min-h-[22rem] sm:min-h-[26rem] md:min-h-[30rem] max-h-[34rem] flex items-center justify-center bg-gradient-to-br from-pastel-pink via-baby-blue/80 to-mint-green/70 px-4 sm:px-8 py-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_55%)]" aria-hidden />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={members[activeIndex].id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.45 }}
                    className="relative z-[1] flex items-center justify-center w-full h-full"
                  >
                    <img
                      src={members[activeIndex].image}
                      alt={members[activeIndex].name}
                      className="max-h-[20rem] sm:max-h-[24rem] md:max-h-[28rem] w-auto max-w-full object-contain drop-shadow-lg"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={goPrev}
                aria-label={lang === 'gr' ? 'Προηγούμενη συνεργάτιδα' : 'Previous team member'}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 shadow-lg border border-white/70 flex items-center justify-center text-gray-700 hover:scale-105 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label={lang === 'gr' ? 'Επόμενη συνεργάτιδα' : 'Next team member'}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 shadow-lg border border-white/70 flex items-center justify-center text-gray-700 hover:scale-105 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 flex flex-col items-center text-center bg-gradient-to-b from-white via-purple-50/40 to-blue-50/50">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={members[activeIndex].id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="flex w-full flex-col items-center"
                >
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 font-poppins">
                    <span className="underline decoration-purple-300/80 decoration-2 underline-offset-4">
                      {members[activeIndex].name}
                    </span>
                  </h3>
                  <div className="flex justify-center mb-5">
                    <div className="w-16 h-1 bg-gradient-to-r from-rose-soft via-purple-soft to-blue-soft rounded-full" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBioMemberId(members[activeIndex].id)}
                    className="inline-flex items-center justify-center bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 text-gray-700 px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 font-quicksand border border-white/60"
                  >
                    {content[lang].bioButton}
                  </motion.button>
                </motion.div>
              </AnimatePresence>

              <div
                className="flex justify-center gap-2 mt-6"
                role="tablist"
                aria-label={lang === 'gr' ? 'Επιλογή συνεργάτιδας' : 'Select team member'}
              >
                {members.map((member, index) => (
                  <button
                    key={member.id}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={member.name}
                    onClick={() => goToSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? 'w-8 bg-gradient-to-r from-rose-soft via-purple-soft to-blue-soft shadow-sm'
                        : 'w-2.5 bg-purple-200/80 hover:bg-purple-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {bioMember && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseBioModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-rose-soft to-purple-soft text-white p-4 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold font-poppins">
                <span className="underline">{bioMember.name}</span>
              </h3>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseBioModal}
                className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label={content[lang].closeButton}
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto">
              {renderBioContent(bioMember.bio)}

              <div className="mt-6 flex justify-center">
                <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
              </div>

              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleViewCertificates(bioMember.id);
                    setBioMemberId(null);
                  }}
                  className="bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 font-quicksand border border-white/50"
                >
                  {content[lang].degreesButton}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {selectedMember !== null && selectedPDFs.length > 0 && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseCertificatesModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-rose-soft to-purple-soft text-white p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold font-poppins">
                {content[lang].viewButton}
              </h3>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseCertificatesModal}
                className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-4">
                {selectedPDFs.map((image, imageIndex) => (
                  <div key={imageIndex} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    {image.toLowerCase().endsWith('.pdf') ? (
                      <iframe
                        src={image}
                        title={`Certificate PDF ${imageIndex + 1}`}
                        className="w-full h-[70vh] min-h-[500px]"
                      />
                    ) : (
                      <img
                        src={image}
                        alt={`Certificate ${imageIndex + 1}`}
                        className="w-full h-auto object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default TeamMembers;
