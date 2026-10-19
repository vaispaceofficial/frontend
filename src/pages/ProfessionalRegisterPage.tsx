import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Mail,
} from "lucide-react";
import "./ProfessionalRegisterPage.css";

type Language = "en" | "te" | "hi";

type ProfessionalFormData = {
  fullName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  category: string;
  services: string[];
  experience: string;
  currentOccupation: string;
  previousEmployer: string;
  previousExperience: string;
  serviceArea: string;
  idType: string;
  idNumber: string;
  governmentId: File | null;
  addressProof: File | null;
  experienceCertificate: File | null;
  qualificationCertificate: File | null;
  workType: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
  emergencyAvailability: string;
  profilePhoto: File | null;
  password: string;
  confirmPassword: string;
  terms: boolean;
  verificationConsent: boolean;
};

const initialForm: ProfessionalFormData = {
  fullName: "",
  mobile: "",
  whatsapp: "",
  email: "",
  dob: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  category: "",
  services: [],
  experience: "",
  currentOccupation: "",
  previousEmployer: "",
  previousExperience: "",
  serviceArea: "",
  idType: "",
  idNumber: "",
  governmentId: null,
  addressProof: null,
  experienceCertificate: null,
  qualificationCertificate: null,
  workType: "",
  workingDays: [],
  startTime: "",
  endTime: "",
  emergencyAvailability: "",
  profilePhoto: null,
  password: "",
  confirmPassword: "",
  terms: false,
  verificationConsent: false,
};

const serviceOptionsByCategory: Record<string, string[]> = {
  "AC & Cooling": [
    "AC installation",
    "AC servicing",
    "AC repair",
    "Gas refilling",
  ],
  Electrical: [
    "Electrical repairs",
    "Wiring",
    "Fan installation",
    "Lighting installation",
  ],
  Plumbing: [
    "Pipe repairs",
    "Tap installation",
    "Leakage repair",
    "Bathroom plumbing",
  ],
  Carpentry: [
    "Furniture repair",
    "Door repair",
    "Furniture assembly",
    "Woodwork",
  ],
  "Home Appliances": [
    "Appliance installation",
    "Appliance repair",
    "Preventive maintenance",
  ],
  Cleaning: [
    "Home cleaning",
    "Deep cleaning",
    "Kitchen cleaning",
    "Bathroom cleaning",
  ],
  "Water Purification": [
    "RO installation",
    "RO servicing",
    "Filter replacement",
  ],
  Refrigeration: [
    "Refrigerator repair",
    "Refrigerator servicing",
    "Cooling issues",
  ],
  "Washing Machine Repair": [
    "Washing machine repair",
    "Installation",
    "Drum and motor issues",
  ],
  "TV Repair": [
    "TV installation",
    "Screen issues",
    "TV servicing",
  ],
  "Home Maintenance": [
    "General maintenance",
    "Minor repairs",
    "Inspection",
  ],
  Painting: [
    "Interior painting",
    "Exterior painting",
    "Touch-up painting",
  ],
  "Pest Control": [
    "General pest control",
    "Termite treatment",
    "Mosquito control",
  ],
  Other: ["Other professional services"],
};

const serviceCategories = Object.keys(serviceOptionsByCategory);

const workingDayValues = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const experienceValues = [
  "Fresher",
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "6–10 years",
  "More than 10 years",
];

const genderValues = [
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
];

const idValues = [
  "Aadhaar Card",
  "PAN Card",
  "Voter ID",
  "Driving Licence",
  "Passport",
  "Other Government ID",
];

const workTypeValues = [
  "Full-time",
  "Part-time",
  "Freelance",
  "On-demand",
];

const emergencyValues = [
  "Yes",
  "No",
  "Advance notice required",
];

const categoryLabels: Record<string, Record<Language, string>> = {
  "AC & Cooling": {
    en: "AC & Cooling",
    te: "ఏసీ మరియు కూలింగ్",
    hi: "एसी और कूलिंग",
  },
  Electrical: {
    en: "Electrical",
    te: "ఎలక్ట్రికల్",
    hi: "इलेक्ट्रिकल",
  },
  Plumbing: {
    en: "Plumbing",
    te: "ప్లంబింగ్",
    hi: "प्लंबिंग",
  },
  Carpentry: {
    en: "Carpentry",
    te: "వడ్రంగి పని",
    hi: "बढ़ईगीरी",
  },
  "Home Appliances": {
    en: "Home Appliances",
    te: "గృహోపకరణాలు",
    hi: "घरेलू उपकरण",
  },
  Cleaning: {
    en: "Cleaning",
    te: "శుభ్రపరిచే సేవలు",
    hi: "सफाई सेवाएँ",
  },
  "Water Purification": {
    en: "Water Purification",
    te: "నీటి శుద్ధి",
    hi: "जल शुद्धिकरण",
  },
  Refrigeration: {
    en: "Refrigeration",
    te: "రిఫ్రిజిరేషన్",
    hi: "रेफ्रिजरेशन",
  },
  "Washing Machine Repair": {
    en: "Washing Machine Repair",
    te: "వాషింగ్ మెషీన్ మరమ్మతు",
    hi: "वॉशिंग मशीन मरम्मत",
  },
  "TV Repair": {
    en: "TV Repair",
    te: "టీవీ మరమ్మతు",
    hi: "टीवी मरम्मत",
  },
  "Home Maintenance": {
    en: "Home Maintenance",
    te: "ఇంటి నిర్వహణ",
    hi: "घर का रखरखाव",
  },
  Painting: {
    en: "Painting",
    te: "పెయింటింగ్",
    hi: "पेंटिंग",
  },
  "Pest Control": {
    en: "Pest Control",
    te: "కీటక నియంత్రణ",
    hi: "कीट नियंत्रण",
  },
  Other: {
    en: "Other",
    te: "ఇతరులు",
    hi: "अन्य",
  },
};

const serviceLabels: Record<string, Record<Language, string>> = {
  "AC installation": {
    en: "AC installation",
    te: "ఏసీ ఇన్‌స్టాలేషన్",
    hi: "एसी इंस्टॉलेशन",
  },
  "AC servicing": {
    en: "AC servicing",
    te: "ఏసీ సర్వీసింగ్",
    hi: "एसी सर्विसिंग",
  },
  "AC repair": {
    en: "AC repair",
    te: "ఏసీ మరమ్మతు",
    hi: "एसी मरम्मत",
  },
  "Gas refilling": {
    en: "Gas refilling",
    te: "గ్యాస్ నింపడం",
    hi: "गैस भरना",
  },
  "Electrical repairs": {
    en: "Electrical repairs",
    te: "ఎలక్ట్రికల్ మరమ్మతులు",
    hi: "इलेक्ट्रिकल मरम्मत",
  },
  Wiring: {
    en: "Wiring",
    te: "వైరింగ్",
    hi: "वायरिंग",
  },
  "Fan installation": {
    en: "Fan installation",
    te: "ఫ్యాన్ ఇన్‌స్టాలేషన్",
    hi: "पंखा इंस्टॉलेशन",
  },
  "Lighting installation": {
    en: "Lighting installation",
    te: "లైటింగ్ ఇన్‌స్టాలేషన్",
    hi: "लाइट इंस्टॉलेशन",
  },
  "Pipe repairs": {
    en: "Pipe repairs",
    te: "పైపు మరమ్మతులు",
    hi: "पाइप मरम्मत",
  },
  "Tap installation": {
    en: "Tap installation",
    te: "ట్యాప్ ఇన్‌స్టాలేషన్",
    hi: "नल इंस्टॉलेशन",
  },
  "Leakage repair": {
    en: "Leakage repair",
    te: "లీకేజీ మరమ్మతు",
    hi: "रिसाव मरम्मत",
  },
  "Bathroom plumbing": {
    en: "Bathroom plumbing",
    te: "బాత్రూమ్ ప్లంబింగ్",
    hi: "बाथरूम प्लंबिंग",
  },
  "Furniture repair": {
    en: "Furniture repair",
    te: "ఫర్నిచర్ మరమ్మతు",
    hi: "फर्नीचर मरम्मत",
  },
  "Door repair": {
    en: "Door repair",
    te: "తలుపు మరమ్మతు",
    hi: "दरवाज़े की मरम्मत",
  },
  "Furniture assembly": {
    en: "Furniture assembly",
    te: "ఫర్నిచర్ అమరిక",
    hi: "फर्नीचर असेंबली",
  },
  Woodwork: {
    en: "Woodwork",
    te: "చెక్క పని",
    hi: "लकड़ी का काम",
  },
  "Appliance installation": {
    en: "Appliance installation",
    te: "ఉపకరణాల ఇన్‌స్టాలేషన్",
    hi: "उपकरण इंस्टॉलेशन",
  },
  "Appliance repair": {
    en: "Appliance repair",
    te: "ఉపకరణాల మరమ్మతు",
    hi: "उपकरण मरम्मत",
  },
  "Preventive maintenance": {
    en: "Preventive maintenance",
    te: "నివారణ నిర్వహణ",
    hi: "निवारक रखरखाव",
  },
  "Home cleaning": {
    en: "Home cleaning",
    te: "ఇంటి శుభ్రత",
    hi: "घर की सफाई",
  },
  "Deep cleaning": {
    en: "Deep cleaning",
    te: "డీప్ క్లీనింగ్",
    hi: "डीप क्लीनिंग",
  },
  "Kitchen cleaning": {
    en: "Kitchen cleaning",
    te: "వంటగది శుభ్రత",
    hi: "रसोई की सफाई",
  },
  "Bathroom cleaning": {
    en: "Bathroom cleaning",
    te: "బాత్రూమ్ శుభ్రత",
    hi: "बाथरूम की सफाई",
  },
  "RO installation": {
    en: "RO installation",
    te: "ఆర్‌ఓ ఇన్‌స్టాలేషన్",
    hi: "आरओ इंस्टॉलेशन",
  },
  "RO servicing": {
    en: "RO servicing",
    te: "ఆర్‌ఓ సర్వీసింగ్",
    hi: "आरओ सर्विसिंग",
  },
  "Filter replacement": {
    en: "Filter replacement",
    te: "ఫిల్టర్ మార్పు",
    hi: "फ़िल्टर बदलना",
  },
  "Refrigerator repair": {
    en: "Refrigerator repair",
    te: "రిఫ్రిజిరేటర్ మరమ్మతు",
    hi: "रेफ्रिजरेटर मरम्मत",
  },
  "Refrigerator servicing": {
    en: "Refrigerator servicing",
    te: "రిఫ్రిజిరేటర్ సర్వీసింగ్",
    hi: "रेफ्रिजरेटर सर्विसिंग",
  },
  "Cooling issues": {
    en: "Cooling issues",
    te: "కూలింగ్ సమస్యలు",
    hi: "कूलिंग समस्याएँ",
  },
  "Washing machine repair": {
    en: "Washing machine repair",
    te: "వాషింగ్ మెషీన్ మరమ్మతు",
    hi: "वॉशिंग मशीन मरम्मत",
  },
  Installation: {
    en: "Installation",
    te: "ఇన్‌స్టాలేషన్",
    hi: "इंस्टॉलेशन",
  },
  "Drum and motor issues": {
    en: "Drum and motor issues",
    te: "డ్రమ్ మరియు మోటార్ సమస్యలు",
    hi: "ड्रम और मोटर समस्याएँ",
  },
  "TV installation": {
    en: "TV installation",
    te: "టీవీ ఇన్‌స్టాలేషన్",
    hi: "टीवी इंस्टॉलेशन",
  },
  "Screen issues": {
    en: "Screen issues",
    te: "స్క్రీన్ సమస్యలు",
    hi: "स्क्रीन समस्याएँ",
  },
  "TV servicing": {
    en: "TV servicing",
    te: "టీవీ సర్వీసింగ్",
    hi: "टीवी सर्विसिंग",
  },
  "General maintenance": {
    en: "General maintenance",
    te: "సాధారణ నిర్వహణ",
    hi: "सामान्य रखरखाव",
  },
  "Minor repairs": {
    en: "Minor repairs",
    te: "చిన్న మరమ్మతులు",
    hi: "छोटी मरम्मत",
  },
  Inspection: {
    en: "Inspection",
    te: "తనిఖీ",
    hi: "जाँच",
  },
  "Interior painting": {
    en: "Interior painting",
    te: "ఇంటి లోపలి పెయింటింగ్",
    hi: "इंटीरियर पेंटिंग",
  },
  "Exterior painting": {
    en: "Exterior painting",
    te: "బయటి పెయింటింగ్",
    hi: "एक्सटीरियर पेंटिंग",
  },
  "Touch-up painting": {
    en: "Touch-up painting",
    te: "టచ్-అప్ పెయింటింగ్",
    hi: "टच-अप पेंटिंग",
  },
  "General pest control": {
    en: "General pest control",
    te: "సాధారణ కీటక నియంత్రణ",
    hi: "सामान्य कीट नियंत्रण",
  },
  "Termite treatment": {
    en: "Termite treatment",
    te: "చెదపురుగుల చికిత్స",
    hi: "दीमक उपचार",
  },
  "Mosquito control": {
    en: "Mosquito control",
    te: "దోమల నియంత్రణ",
    hi: "मच्छर नियंत्रण",
  },
  "Other professional services": {
    en: "Other professional services",
    te: "ఇతర వృత్తిపరమైన సేవలు",
    hi: "अन्य पेशेवर सेवाएँ",
  },
};

const translations = {
  en: {
    language: "Language",
    english: "English",
    telugu: "Telugu",
    hindi: "Hindi",
    signIn: "Already registered?",
    login: "Sign in",
    network: "NeedOneService PROFESSIONAL NETWORK",
    eyebrow: "PROFESSIONAL REGISTRATION",
    heading: "Showcase your skills.",
    brand: "NeedOneService",
    intro:
      "Join the NeedOneService professional network to connect with customers, showcase your expertise and grow your service business.",
    secure: "Secure registration",
    step: "STEP",
    of: "OF",
    personalTitle: "Personal information",
    personalDesc: "Tell us about yourself and how customers can contact you.",
    addressTitle: "Address & location",
    addressDesc: "Provide your address and the areas you serve.",
    professionalTitle: "Professional details",
    professionalDesc: "Describe your skills, services and experience.",
    verificationTitle: "Identity verification",
    verificationDesc: "Provide your identification details and supporting documents.",
    availabilityTitle: "Work availability",
    availabilityDesc: "Tell us when you work and whether you accept emergency requests.",
    securityTitle: "Account & consent",
    securityDesc: "Create your password and review the required consent statements.",
    fullName: "Full name",
    fullNameHint: "Enter your full name",
    mobile: "Mobile number",
    mobileHint: "10-digit mobile number",
    whatsapp: "WhatsApp number",
    whatsappHint: "WhatsApp number, if different",
    email: "Email address",
    emailHint: "professional@example.com",
    dob: "Date of birth",
    gender: "Gender",
    choose: "Select an option",
    address: "Full address",
    addressHint: "House / street, area and landmark",
    city: "City",
    cityHint: "Enter your city",
    state: "State",
    stateHint: "Enter your state",
    pincode: "PIN code",
    pincodeHint: "6-digit PIN code",
    category: "Professional category",
    categoryHint: "Select your main service category",
    services: "Services you provide",
servicesHint: "Select all services you offer. You can choose multiple options.",
    experience: "Years of experience",
    experienceHint: "Select your experience",
    currentOccupation: "Current occupation",
    occupationHint: "e.g. Independent technician",
    previousEmployer: "Previous employer",
    employerHint: "Company or employer name, if applicable",
    previousExperience: "Previous experience",
    previousExperienceHint: "Describe your previous work experience",
    serviceArea: "Service area",
    serviceAreaHint: "Areas or localities you serve",
    idType: "Government ID type",
    idNumber: "Government ID number",
    idNumberHint: "Enter the ID number",
    governmentId: "Government ID document",
    addressProof: "Address proof",
    experienceCertificate: "Experience certificate",
    qualificationCertificate: "Qualification certificate",
    documentHint: "PDF, JPG or PNG — up to 5 MB",
    profilePhoto: "Profile photo",
    profilePhotoHint: "Optional — JPG, PNG or WEBP",
    workType: "Work type",
    workingDays: "Working days",
    startTime: "Start time",
    endTime: "End time",
    emergencyAvailability: "Emergency availability",
    password: "Create password",
    passwordHint: "Minimum 8 characters",
    confirmPassword: "Confirm password",
    confirmHint: "Re-enter your password",
    termsStart: "I agree to the",
    termsLink: "Terms & Conditions",
    and: "and",
    privacyLink: "Privacy Policy",
    termsEnd: ".",
    consent:
      "I consent to NeedOneService reviewing my professional details and documents for registration and verification.",
    securityNote:
      "Use a strong password and upload only documents you are authorized to share.",
    back: "Back",
    next: "Save & Continue",
    submit: "Create Professional Profile",
    safe: "Your details should be handled securely",
    help: "Need help with registration?",
    contact: "Contact our team",
    successEyebrow: "REGISTRATION COMPLETED",
    successTitle: "Your professional journey starts here.",
    successDesc:
      "You have completed this registration form. Your information has not been sent to a server yet.",
    summary: "Registration summary",
    professional: "Professional",
    categorySummary: "Category",
    frontendNote:
      "Frontend demonstration only. Backend integration is required to submit and save your details.",
    home: "Back to Home",
    chooseFile: "Choose a document",
    required: "This field is required.",
    invalidMobile: "Enter a valid 10-digit Indian mobile number.",
    invalidEmail: "Enter a valid email address.",
    invalidPincode: "Enter a valid 6-digit PIN code.",
    invalidDate: "Enter a valid date of birth.",
    invalidTime: "End time must be later than start time.",
    passwordShort: "Use at least 8 characters.",
    passwordMismatch: "Passwords do not match.",
    acceptTerms: "You must accept the Terms & Conditions.",
    acceptConsent: "Please consent to professional verification.",
    fileSize: "File size must be 5 MB or less.",
    uploadImage: "Choose a JPG, PNG or WEBP image.",
    uploadDoc: "Choose a PDF, JPG or PNG document.",
    genderOptions: ["Male", "Female", "Other", "Prefer not to say"],
    experienceOptions: experienceValues,
    idOptions: idValues,
    workTypeOptions: workTypeValues,
    emergencyOptions: emergencyValues,
    days: workingDayValues,
    stepNames: [
      "Personal information",
      "Address & location",
      "Professional details",
      "Identity verification",
      "Work availability",
      "Account & consent",
    ],
  },
  te: {
    language: "భాష",
    english: "English",
    telugu: "తెలుగు",
    hindi: "हिन्दी",
    signIn: "ఇప్పటికే ఖాతా ఉందా?",
    login: "లాగిన్",
    network: "మా ప్రొఫెషనల్ నెట్‌వర్క్‌లో చేరండి",
    eyebrow: "ప్రొఫెషనల్ నమోదు",
    heading: "మీ నైపుణ్యాలను ప్రదర్శించండి.",
    brand: "ONE SERVICE",
    intro: "మా ప్రొఫెషనల్ నెట్‌వర్క్‌లో చేరి కస్టమర్లను చేరుకోండి, మీ నైపుణ్యాలను ప్రదర్శించండి.",
    secure: "సురక్షిత ప్రొఫెషనల్ నమోదు",
    step: "దశ",
    of: "లో",
    personalTitle: "వ్యక్తిగత వివరాలు",
    personalDesc: "మీ గురించి మరియు మిమ్మల్ని ఎలా సంప్రదించాలో తెలియజేయండి.",
    addressTitle: "చిరునామా మరియు ప్రాంతం",
    addressDesc: "మీ చిరునామా మరియు మీరు సేవలు అందించే ప్రాంతాలను నమోదు చేయండి.",
    professionalTitle: "వృత్తిపరమైన వివరాలు",
    professionalDesc: "మీ నైపుణ్యాలు, సేవలు మరియు అనుభవాన్ని వివరించండి.",
    verificationTitle: "గుర్తింపు ధృవీకరణ",
    verificationDesc: "గుర్తింపు వివరాలు మరియు అవసరమైన పత్రాలను అందించండి.",
    availabilityTitle: "పని లభ్యత",
    availabilityDesc: "మీ పని రోజులు, సమయాలు మరియు అత్యవసర సేవల లభ్యతను తెలియజేయండి.",
    securityTitle: "ఖాతా మరియు సమ్మతి",
    securityDesc: "పాస్‌వర్డ్‌ను సృష్టించి అవసరమైన సమ్మతులను అంగీకరించండి.",
    fullName: "పూర్తి పేరు",
    fullNameHint: "మీ పూర్తి పేరును నమోదు చేయండి",
    mobile: "మొబైల్ నంబర్",
    mobileHint: "10 అంకెల మొబైల్ నంబర్",
    whatsapp: "WhatsApp నంబర్",
    whatsappHint: "వేరే WhatsApp నంబర్ ఉంటే నమోదు చేయండి",
    email: "ఇమెయిల్ చిరునామా",
    emailHint: "మీ ఇమెయిల్‌ను నమోదు చేయండి",
    dob: "పుట్టిన తేదీ",
    gender: "లింగం",
    choose: "ఎంచుకోండి",
    address: "పూర్తి చిరునామా",
    addressHint: "ఇంటి నంబర్, వీధి, ప్రాంతం, గుర్తింపు స్థలం",
    city: "నగరం",
    cityHint: "మీ నగరాన్ని నమోదు చేయండి",
    state: "రాష్ట్రం",
    stateHint: "మీ రాష్ట్రాన్ని నమోదు చేయండి",
    pincode: "పిన్‌కోడ్",
    pincodeHint: "6 అంకెల పిన్‌కోడ్",
    category: "వృత్తి విభాగం",
    categoryHint: "మీ ప్రధాన సేవా విభాగాన్ని ఎంచుకోండి",
    services: "మీరు అందించే సేవలు",
    servicesHint: "మీరు అందించే అన్ని సేవలను ఎంచుకోండి. ఒకటి కంటే ఎక్కువ ఎంచుకోవచ్చు.",
    experience: "పని అనుభవం",
    experienceHint: "మీ అనుభవాన్ని ఎంచుకోండి",
    currentOccupation: "ప్రస్తుత వృత్తి",
    occupationHint: "ఉదా. స్వతంత్ర టెక్నీషియన్",
    previousEmployer: "మునుపటి యజమాని",
    employerHint: "సంస్థ లేదా యజమాని పేరు",
    previousExperience: "మునుపటి పని అనుభవం",
    previousExperienceHint: "మీ మునుపటి పని అనుభవాన్ని వివరించండి",
    serviceArea: "సేవలు అందించే ప్రాంతం",
    serviceAreaHint: "మీరు సేవలు అందించే ప్రాంతాలు",
    idType: "ప్రభుత్వ గుర్తింపు పత్రం",
    idNumber: "గుర్తింపు పత్రం నంబర్",
    idNumberHint: "పత్రం నంబర్‌ను నమోదు చేయండి",
    governmentId: "ప్రభుత్వ గుర్తింపు పత్రం",
    addressProof: "చిరునామా రుజువు",
    experienceCertificate: "అనుభవ ధృవీకరణ పత్రం",
    qualificationCertificate: "విద్యార్హత ధృవీకరణ పత్రం",
    documentHint: "PDF, JPG లేదా PNG — గరిష్ఠంగా 5 MB",
    profilePhoto: "ప్రొఫైల్ ఫోటో",
    profilePhotoHint: "ఐచ్ఛికం — JPG, PNG లేదా WEBP",
    workType: "పని విధానం",
    workingDays: "పని రోజులు",
    startTime: "ప్రారంభ సమయం",
    endTime: "ముగింపు సమయం",
    emergencyAvailability: "అత్యవసర సేవల లభ్యత",
    password: "పాస్‌వర్డ్ సృష్టించండి",
    passwordHint: "కనీసం 8 అక్షరాలు",
    confirmPassword: "పాస్‌వర్డ్‌ను నిర్ధారించండి",
    confirmHint: "పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి",
    termsStart: "నేను అంగీకరిస్తున్నాను:",
    termsLink: "నిబంధనలు మరియు షరతులు",
    and: "మరియు",
    privacyLink: "గోప్యతా విధానం",
    termsEnd: ".",
    consent: "నమోదు మరియు ధృవీకరణ కోసం నా వివరాలు, పత్రాలను పరిశీలించడానికి నేను సమ్మతిస్తున్నాను.",
    securityNote: "మీరు పంచుకోవడానికి అనుమతి ఉన్న పత్రాలను మాత్రమే అప్‌లోడ్ చేయండి.",
    back: "వెనక్కి",
    next: "కొనసాగించండి",
    submit: "ప్రొఫెషనల్ ప్రొఫైల్ సృష్టించండి",
    safe: "మీ వివరాలు సురక్షితంగా నిర్వహించబడాలి",
    help: "నమోదుకు సహాయం కావాలా?",
    contact: "మా బృందాన్ని సంప్రదించండి",
    successEyebrow: "నమోదు పూర్తయింది",
    successTitle: "మీ వృత్తిపరమైన ప్రయాణం ఇక్కడ ప్రారంభమవుతుంది.",
    successDesc: "మీరు ఈ నమోదు ఫారమ్‌ను పూర్తి చేశారు. మీ వివరాలు ఇంకా సర్వర్‌కు పంపబడలేదు.",
    summary: "నమోదు సారాంశం",
    professional: "ప్రొఫెషనల్",
    categorySummary: "విభాగం",
    frontendNote: "ఇది ఫ్రంట్‌ఎండ్ డెమో మాత్రమే. వివరాలను భద్రపరచడానికి బ్యాక్‌ఎండ్ అనుసంధానం అవసరం.",
    home: "హోమ్‌కు తిరిగి వెళ్లండి",
    chooseFile: "పత్రాన్ని ఎంచుకోండి",
    required: "ఈ వివరాన్ని నమోదు చేయాలి.",
    invalidMobile: "సరైన 10 అంకెల భారతీయ మొబైల్ నంబర్‌ను నమోదు చేయండి.",
    invalidEmail: "సరైన ఇమెయిల్ చిరునామాను నమోదు చేయండి.",
    invalidPincode: "సరైన 6 అంకెల పిన్‌కోడ్‌ను నమోదు చేయండి.",
    invalidDate: "సరైన పుట్టిన తేదీని నమోదు చేయండి.",
    invalidTime: "ముగింపు సమయం ప్రారంభ సమయం కంటే తర్వాత ఉండాలి.",
    passwordShort: "పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి.",
    passwordMismatch: "రెండు పాస్‌వర్డ్‌లు సరిపోలడం లేదు.",
    acceptTerms: "కొనసాగించడానికి నిబంధనలను అంగీకరించండి.",
    acceptConsent: "ధృవీకరణ సమ్మతిని అంగీకరించండి.",
    fileSize: "ఫైల్ పరిమాణం 5 MB లేదా అంతకంటే తక్కువ ఉండాలి.",
    uploadImage: "JPG, PNG లేదా WEBP చిత్రాన్ని ఎంచుకోండి.",
    uploadDoc: "PDF, JPG లేదా PNG పత్రాన్ని ఎంచుకోండి.",
    genderOptions: ["పురుషుడు", "స్త్రీ", "ఇతరులు", "తెలియజేయదలచుకోలేదు"],
    experienceOptions: ["అనుభవం లేదు", "1 సంవత్సరం కంటే తక్కువ", "1–2 సంవత్సరాలు", "3–5 సంవత్సరాలు", "6–10 సంవత్సరాలు", "10 సంవత్సరాల కంటే ఎక్కువ"],
    idOptions: ["ఆధార్ కార్డు", "పాన్ కార్డు", "ఓటరు గుర్తింపు కార్డు", "డ్రైవింగ్ లైసెన్స్", "పాస్‌పోర్ట్", "ఇతర ప్రభుత్వ గుర్తింపు పత్రం"],
    workTypeOptions: ["పూర్తి సమయం", "పార్ట్ టైమ్", "ఫ్రీలాన్స్", "అవసరాన్ని బట్టి"],
    emergencyOptions: ["అవును", "కాదు", "ముందస్తు సమాచారం అవసరం"],
    days: ["సోమవారం", "మంగళవారం", "బుధవారం", "గురువారం", "శుక్రవారం", "శనివారం", "ఆదివారం"],
    stepNames: ["వ్యక్తిగత వివరాలు", "చిరునామా", "వృత్తిపరమైన వివరాలు", "గుర్తింపు ధృవీకరణ", "పని లభ్యత", "ఖాతా మరియు సమ్మతి"],
  },
  hi: {
    language: "भाषा",
    english: "English",
    telugu: "తెలుగు",
    hindi: "हिन्दी",
    signIn: "पहले से खाता है?",
    login: "लॉग इन",
    network: "ONESERVICE प्रोफेशनल नेटवर्क",
    eyebrow: "प्रोफेशनल पंजीकरण",
    heading: "अपने कौशल को प्रदर्शित करें।",
    brand: "ONE SERVICE",
    intro: "ग्राहकों से जुड़ने और अपना सेवा व्यवसाय बढ़ाने के लिए हमारे प्रोफेशनल नेटवर्क से जुड़ें।",
    secure: "सुरक्षित प्रोफेशनल पंजीकरण",
    step: "चरण",
    of: "में से",
    personalTitle: "व्यक्तिगत जानकारी",
    personalDesc: "अपने बारे में और संपर्क जानकारी बताएँ।",
    addressTitle: "पता और स्थान",
    addressDesc: "अपना पता और सेवा क्षेत्र दर्ज करें।",
    professionalTitle: "पेशेवर जानकारी",
    professionalDesc: "अपने कौशल, सेवाओं और अनुभव का विवरण दें।",
    verificationTitle: "पहचान सत्यापन",
    verificationDesc: "पहचान विवरण और आवश्यक दस्तावेज़ प्रदान करें।",
    availabilityTitle: "कार्य उपलब्धता",
    availabilityDesc: "अपने कार्य दिवस, समय और आपातकालीन उपलब्धता बताएँ।",
    securityTitle: "खाता और सहमति",
    securityDesc: "पासवर्ड बनाएँ और आवश्यक सहमति दें।",
    fullName: "पूरा नाम",
    fullNameHint: "अपना पूरा नाम दर्ज करें",
    mobile: "मोबाइल नंबर",
    mobileHint: "10 अंकों का मोबाइल नंबर",
    whatsapp: "WhatsApp नंबर",
    whatsappHint: "यदि अलग है तो WhatsApp नंबर दर्ज करें",
    email: "ईमेल पता",
    emailHint: "अपना ईमेल दर्ज करें",
    dob: "जन्म तिथि",
    gender: "लिंग",
    choose: "विकल्प चुनें",
    address: "पूरा पता",
    addressHint: "मकान नंबर, सड़क, क्षेत्र और पहचान स्थल",
    city: "शहर",
    cityHint: "अपने शहर का नाम दर्ज करें",
    state: "राज्य",
    stateHint: "अपने राज्य का नाम दर्ज करें",
    pincode: "पिनकोड",
    pincodeHint: "6 अंकों का पिनकोड",
    category: "पेशेवर श्रेणी",
    categoryHint: "अपनी मुख्य सेवा श्रेणी चुनें",
    services: "आपके द्वारा प्रदान की जाने वाली सेवाएँ",
    servicesHint: "अपनी सभी सेवाएँ चुनें। आप एक से अधिक विकल्प चुन सकते हैं।",
    experience: "कार्य अनुभव",
    experienceHint: "अपना अनुभव चुनें",
    currentOccupation: "वर्तमान पेशा",
    occupationHint: "उदा. स्वतंत्र तकनीशियन",
    previousEmployer: "पिछला नियोक्ता",
    employerHint: "कंपनी या नियोक्ता का नाम",
    previousExperience: "पिछला कार्य अनुभव",
    previousExperienceHint: "अपने पिछले कार्य अनुभव का विवरण दें",
    serviceArea: "सेवा क्षेत्र",
    serviceAreaHint: "वे क्षेत्र जहाँ आप सेवाएँ प्रदान करते हैं",
    idType: "सरकारी पहचान पत्र का प्रकार",
    idNumber: "पहचान पत्र संख्या",
    idNumberHint: "पहचान पत्र संख्या दर्ज करें",
    governmentId: "सरकारी पहचान दस्तावेज़",
    addressProof: "पते का प्रमाण",
    experienceCertificate: "अनुभव प्रमाणपत्र",
    qualificationCertificate: "योग्यता प्रमाणपत्र",
    documentHint: "PDF, JPG या PNG — अधिकतम 5 MB",
    profilePhoto: "प्रोफ़ाइल फ़ोटो",
    profilePhotoHint: "वैकल्पिक — JPG, PNG या WEBP",
    workType: "कार्य का प्रकार",
    workingDays: "कार्य दिवस",
    startTime: "शुरू होने का समय",
    endTime: "समाप्त होने का समय",
    emergencyAvailability: "आपातकालीन उपलब्धता",
    password: "पासवर्ड बनाएँ",
    passwordHint: "कम से कम 8 अक्षर",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    confirmHint: "पासवर्ड दोबारा दर्ज करें",
    termsStart: "मैं सहमत हूँ:",
    termsLink: "नियम और शर्तें",
    and: "और",
    privacyLink: "गोपनीयता नीति",
    termsEnd: "।",
    consent: "मैं पंजीकरण और सत्यापन के लिए अपनी जानकारी तथा दस्तावेज़ों की समीक्षा की सहमति देता/देती हूँ।",
    securityNote: "केवल वही दस्तावेज़ अपलोड करें जिन्हें साझा करने की आपको अनुमति है।",
    back: "वापस",
    next: "आगे बढ़ें",
    submit: "प्रोफेशनल प्रोफ़ाइल बनाएँ",
    safe: "आपकी जानकारी सुरक्षित रूप से संभाली जानी चाहिए",
    help: "पंजीकरण में मदद चाहिए?",
    contact: "हमारी टीम से संपर्क करें",
    successEyebrow: "पंजीकरण पूरा हुआ",
    successTitle: "आपकी पेशेवर यात्रा यहाँ से शुरू होती है।",
    successDesc: "आपने यह पंजीकरण फ़ॉर्म पूरा कर लिया है। आपकी जानकारी अभी सर्वर पर नहीं भेजी गई है।",
    summary: "पंजीकरण सारांश",
    professional: "प्रोफेशनल",
    categorySummary: "श्रेणी",
    frontendNote: "यह केवल फ्रंटएंड डेमो है। जानकारी सेव करने के लिए बैकएंड एकीकरण आवश्यक है।",
    home: "होम पर वापस जाएँ",
    chooseFile: "दस्तावेज़ चुनें",
    required: "यह जानकारी आवश्यक है।",
    invalidMobile: "सही 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।",
    invalidEmail: "सही ईमेल पता दर्ज करें।",
    invalidPincode: "सही 6 अंकों का पिनकोड दर्ज करें।",
    invalidDate: "सही जन्म तिथि दर्ज करें।",
    invalidTime: "समाप्ति का समय शुरू होने के समय के बाद होना चाहिए।",
    passwordShort: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
    passwordMismatch: "दोनों पासवर्ड मेल नहीं खाते।",
    acceptTerms: "आगे बढ़ने के लिए नियम और शर्तें स्वीकार करें।",
    acceptConsent: "कृपया सत्यापन की सहमति स्वीकार करें।",
    fileSize: "फ़ाइल का आकार 5 MB या उससे कम होना चाहिए।",
    uploadImage: "JPG, PNG या WEBP छवि चुनें।",
    uploadDoc: "PDF, JPG या PNG दस्तावेज़ चुनें।",
    genderOptions: ["पुरुष", "महिला", "अन्य", "बताना नहीं चाहते"],
    experienceOptions: ["नया / अनुभव नहीं", "1 वर्ष से कम", "1–2 वर्ष", "3–5 वर्ष", "6–10 वर्ष", "10 वर्ष से अधिक"],
    idOptions: ["आधार कार्ड", "पैन कार्ड", "मतदाता पहचान पत्र", "ड्राइविंग लाइसेंस", "पासपोर्ट", "अन्य सरकारी पहचान दस्तावेज़"],
    workTypeOptions: ["पूर्णकालिक", "अंशकालिक", "फ्रीलांस", "आवश्यकतानुसार"],
    emergencyOptions: ["हाँ", "नहीं", "पहले से सूचना आवश्यक"],
    days: ["सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार", "रविवार"],
    stepNames: ["व्यक्तिगत जानकारी", "पता और स्थान", "पेशेवर जानकारी", "पहचान सत्यापन", "कार्य उपलब्धता", "खाता और सहमति"],
  },
} as const;

type TranslationKey = keyof typeof translations.en;

type LanguagePickerProps = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

function LanguagePicker({
  language,
  setLanguage,
  t,
}: LanguagePickerProps) {
  return (
    <div className="partner-language-picker">
      <label htmlFor="partner-language">{t("language")}</label>
      <select
        id="partner-language"
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
      >
        <option value="en">{t("english")}</option>
        <option value="te">{t("telugu")}</option>
        <option value="hi">{t("hindi")}</option>
      </select>
    </div>
  );
}

export default function ProfessionalRegisterPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] =
    useState<ProfessionalFormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const dictionary = translations[language];

  const t = (key: TranslationKey): string => {
    const value = dictionary[key];
    return typeof value === "string" ? value : key;
  };

  const updateField = <K extends keyof ProfessionalFormData>(
    key: K,
    value: ProfessionalFormData[K],
  ) => {
    setFormData((previous) => ({ ...previous, [key]: value }));

    setErrors((previous) => {
      const next = { ...previous };
      delete next[key];

      if (key === "password") {
        delete next.confirmPassword;
      }

      if (key === "startTime" || key === "endTime") {
        delete next.startTime;
        delete next.endTime;
      }

      return next;
    });
  };

  const validateStep = (step: number): boolean => {
    const nextErrors: Record<string, string> = {};

    const required = (key: keyof ProfessionalFormData) => {
      const value = formData[key];

      if (
        value === "" ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        nextErrors[key] = t("required");
      }
    };

    if (step === 0) {
      required("fullName");
      required("mobile");
      required("email");
      required("dob");
      required("gender");

      if (
        formData.mobile &&
        !/^[6-9]\d{9}$/.test(formData.mobile.trim())
      ) {
        nextErrors.mobile = t("invalidMobile");
      }

      if (
        formData.whatsapp &&
        !/^[6-9]\d{9}$/.test(formData.whatsapp.trim())
      ) {
        nextErrors.whatsapp = t("invalidMobile");
      }

      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
      ) {
        nextErrors.email = t("invalidEmail");
      }

      if (formData.dob) {
        const birthDate = new Date(`${formData.dob}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (
          Number.isNaN(birthDate.getTime()) ||
          birthDate >= today
        ) {
          nextErrors.dob = t("invalidDate");
        }
      }
    }

    if (step === 1) {
      required("address");
      required("city");
      required("state");
      required("pincode");

      if (
        formData.pincode &&
        !/^\d{6}$/.test(formData.pincode.trim())
      ) {
        nextErrors.pincode = t("invalidPincode");
      }
    }

    if (step === 2) {
      required("category");
      required("services");
      required("experience");
    }

    if (step === 3) {
      required("idType");
      required("idNumber");
      required("governmentId");
      required("addressProof");
    }

    if (step === 4) {
      required("serviceArea");
      required("workType");
      required("workingDays");
      required("startTime");
      required("endTime");
      required("emergencyAvailability");

      if (
        formData.startTime &&
        formData.endTime &&
        formData.startTime >= formData.endTime
      ) {
        nextErrors.endTime = t("invalidTime");
      }
    }

    if (step === 5) {
      required("password");
      required("confirmPassword");

      if (formData.password && formData.password.length < 8) {
        nextErrors.password = t("passwordShort");
      }

      if (
        formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
      ) {
        nextErrors.confirmPassword = t("passwordMismatch");
      }

      if (!formData.terms) {
        nextErrors.terms = t("acceptTerms");
      }

      if (!formData.verificationConsent) {
        nextErrors.verificationConsent = t("acceptConsent");
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;

    setCurrentStep((step) => Math.min(step + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setErrors({});
    setCurrentStep((step) => Math.max(step - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateStep(5)) return;

    // Frontend demonstration only.
    // Connect the registration API here to save the data.
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputClass = (key: string) =>
    `partner-input${errors[key] ? " partner-input-error" : ""}`;

  const renderError = (key: string) =>
    errors[key] ? (
      <span className="partner-error" role="alert">
        {errors[key]}
      </span>
    ) : null;

  const renderInput = (
    key: keyof ProfessionalFormData,
    label: string,
    placeholder: string,
    type = "text",
  ) => {
    const value = formData[key];

    return (
      <div className="partner-field" key={key}>
        <label className="partner-label" htmlFor={key}>
          {label}
        </label>

        <input
          id={key}
          className={inputClass(key)}
          type={type}
          value={typeof value === "string" ? value : ""}
          placeholder={placeholder}
          onChange={(event) =>
            updateField(key, event.target.value as never)
          }
          aria-invalid={Boolean(errors[key])}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
          autoComplete={
            key === "fullName"
              ? "name"
              : key === "mobile"
                ? "tel"
                : key === "whatsapp"
                  ? "tel"
                  : key === "email"
                    ? "email"
                    : key === "address"
                      ? "street-address"
                      : "off"
          }
        />

        {errors[key] && (
          <span id={`${key}-error`} className="partner-error" role="alert">
            {errors[key]}
          </span>
        )}
      </div>
    );
  };

  const renderSelect = (
    key: keyof ProfessionalFormData,
    label: string,
    options: readonly string[],
    optionLabels?: readonly string[],
  ) => {
    const value = formData[key];

    return (
      <div className="partner-field" key={key}>
        <label className="partner-label" htmlFor={key}>
          {label}
        </label>

        <select
          id={key}
          className={inputClass(key)}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => {
            const nextValue = event.target.value;

            if (key === "category") {
              setFormData((previous) => ({
                ...previous,
                category: nextValue,
                services: [],
              }));

              setErrors((previous) => {
                const next = { ...previous };
                delete next.category;
                delete next.services;
                return next;
              });
            } else {
              updateField(key, nextValue as never);
            }
          }}
          aria-invalid={Boolean(errors[key])}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
        >
          <option value="">{t("choose")}</option>

          {options.map((option, index) => (
            <option key={option} value={option}>
              {optionLabels?.[index] ?? option}
            </option>
          ))}
        </select>

        {errors[key] && (
          <span id={`${key}-error`} className="partner-error" role="alert">
            {errors[key]}
          </span>
        )}
      </div>
    );
  };

  const renderFileInput = (
    key:
      | "governmentId"
      | "addressProof"
      | "experienceCertificate"
      | "qualificationCertificate"
      | "profilePhoto",
    label: string,
    accept: string,
    imageOnly = false,
  ) => (
    <div className="partner-field" key={key}>
      <label className="partner-label" htmlFor={key}>
        {label}
      </label>

      <input
        id={key}
        className={inputClass(key)}
        type="file"
        accept={accept}
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;

          if (!file) {
            updateField(key, null);
            return;
          }

          if (file.size > 5 * 1024 * 1024) {
            setErrors((previous) => ({
              ...previous,
              [key]: t("fileSize"),
            }));
            event.target.value = "";
            return;
          }

          const allowedTypes = imageOnly
            ? ["image/jpeg", "image/png", "image/webp"]
            : ["application/pdf", "image/jpeg", "image/png"];

          if (!allowedTypes.includes(file.type)) {
            setErrors((previous) => ({
              ...previous,
              [key]: imageOnly ? t("uploadImage") : t("uploadDoc"),
            }));
            event.target.value = "";
            return;
          }

          updateField(key, file);
        }}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
      />

      {formData[key] && (
        <p className="partner-field-hint">
          {formData[key]?.name}
        </p>
      )}

      {errors[key] && (
        <span id={`${key}-error`} className="partner-error" role="alert">
          {errors[key]}
        </span>
      )}
    </div>
  );

  const renderCheckbox = (
    key: "terms" | "verificationConsent",
    label: string,
  ) => (
    <label className="partner-checkbox" key={key}>
      <input
        type="checkbox"
        checked={formData[key]}
        onChange={(event) => updateField(key, event.target.checked)}
        aria-invalid={Boolean(errors[key])}
      />

      <span>
        {label}
        {renderError(key)}
      </span>
    </label>
  );

  const renderDayOptions = () => (
    <div className="partner-field partner-full-width">
  <span className="partner-label">{t("services")}</span>

  <p className="partner-services-hint">
    {t("servicesHint")}
  </p>

  <div className="partner-chip-group">
    {(serviceOptionsByCategory[formData.category] ?? []).map(
      (service) => {
        const selected = formData.services.includes(service);

        return (
          <button
            type="button"
            key={service}
            className={`partner-chip${selected ? " active" : ""}`}
            aria-pressed={selected}
            onClick={() => {
              const updated = selected
                ? formData.services.filter(
                    (item) => item !== service
                  )
                : [...formData.services, service];

              updateField("services", updated);
            }}
          >
            {selected && <Check size={14} />}
            {serviceLabels[service]?.[language] ?? service}
          </button>
        );
      }
    )}
  </div>

  {formData.services.length > 0 && (
    <p className="partner-selected-count">
      {formData.services.length} service
      {formData.services.length !== 1 ? "s" : ""} selected
    </p>
  )}

  {renderError("services")}
</div>
  );

  const stepTitles = [
    t("personalTitle"),
    t("addressTitle"),
    t("professionalTitle"),
    t("verificationTitle"),
    t("availabilityTitle"),
    t("securityTitle"),
  ];

  const stepDescriptions = [
    t("personalDesc"),
    t("addressDesc"),
    t("professionalDesc"),
    t("verificationDesc"),
    t("availabilityDesc"),
    t("securityDesc"),
  ];

  if (submitted) {
    return (
      <main className="partner-page">
        <div className="partner-shell">
          <header className="partner-topbar">
            <Link className="partner-brand" to="/">
              <span className="partner-brand-mark">O</span>
              <span>{t("brand")}</span>
            </Link>

            <LanguagePicker
              language={language}
              setLanguage={setLanguage}
              t={t}
            />
          </header>

          <section className="partner-success">
            <div className="partner-success-icon">
              <CheckCircle2 size={42} />
            </div>

            <span className="partner-eyebrow">
              {t("successEyebrow")}
            </span>

            <h1>{t("successTitle")}</h1>
            <p>{t("successDesc")}</p>

            <div className="partner-summary">
              <h2>{t("summary")}</h2>

              <div className="partner-summary-row">
                <span>{t("professional")}</span>
                <strong>{formData.fullName}</strong>
              </div>

              <div className="partner-summary-row">
                <span>{t("email")}</span>
                <strong>{formData.email}</strong>
              </div>

              <div className="partner-summary-row">
                <span>{t("mobile")}</span>
                <strong>{formData.mobile}</strong>
              </div>

              <div className="partner-summary-row">
                <span>{t("categorySummary")}</span>
                <strong>
                  {categoryLabels[formData.category]?.[language] ??
                    formData.category}
                </strong>
              </div>
            </div>

            <p className="partner-note">{t("frontendNote")}</p>

            <Link className="partner-primary-btn" to="/">
              <ArrowLeft size={18} />
              {t("home")}
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="partner-page">
      <div className="partner-shell">
        <header className="partner-topbar">
          {/* <Link className="partner-brand" to="/">
            <span className="partner-brand-mark">O</span>
            <span>{t("brand")}</span>
          </Link> */}

          <div className="partner-topbar-actions">
            <LanguagePicker
              language={language}
              setLanguage={setLanguage}
              t={t}
            />

            <span className="partner-signin">
              {t("signIn")} <Link to="/login">{t("login")}</Link>
            </span>

          </div>
        </header>

        <section className="partner-hero">
          <div className="partner-hero-copy">
            <span className="partner-eyebrow">{t("eyebrow")}</span>
            <h1>{t("heading")}</h1>
            <p>{t("intro")}</p>
          </div>

          <div className="partner-secure-row">
            <div className="partner-secure-label">
              <ShieldCheck size={17} />
              <span>{t("secure")}</span>
            </div>
          </div>
        </section>

        <section className="partner-form-card">
          <div className="partner-progress-header">
            <div>
              <span className="partner-step-counter">
                {t("step")} {currentStep + 1} {t("of")} 6
              </span>

              <h2>{stepTitles[currentStep]}</h2>
              <p>{stepDescriptions[currentStep]}</p>
            </div>

            <span className="partner-progress-percent">
              {Math.round(((currentStep + 1) / 6) * 100)}%
            </span>
          </div>

          <div
            className="partner-progress-track"
            role="progressbar"
            aria-label="Registration progress"
            aria-valuemin={0}
            aria-valuemax={6}
            aria-valuenow={currentStep + 1}
          >
            <div
              className="partner-progress-fill"
              style={{
                width: `${((currentStep + 1) / 6) * 100}%`,
              }}
            />
          </div>

          <div className="partner-stepper">
            {dictionary.stepNames.map((name, index) => (
              <button
                type="button"
                key={name}
                className={`partner-step-item${index === currentStep ? " active" : ""}${index < currentStep ? " completed" : ""}`}
                onClick={() => {
                  if (index < currentStep) {
                    setCurrentStep(index);
                    setErrors({});
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                disabled={index >= currentStep}
                aria-current={index === currentStep ? "step" : undefined}
              >
                <span className="partner-step-number">
                  {index < currentStep ? <Check size={15} /> : index + 1}
                </span>

                <span className="partner-step-name">{name}</span>
              </button>
            ))}
          </div>

          <form
            className="partner-form"
            noValidate
            onSubmit={(event) => {
              if (currentStep < 5) {
                event.preventDefault();
                goNext();
              } else {
                handleSubmit(event);
              }
            }}
          >
            {currentStep === 0 && (
              <div className="partner-form-grid">
                {renderFileInput(
                  "profilePhoto",
                  t("profilePhoto"),
                  "image/jpeg,image/png,image/webp",
                  true,
                )}

                <p className="partner-field-hint partner-full-width">
                  {t("profilePhotoHint")}
                </p>

                {renderInput("fullName", t("fullName"), t("fullNameHint"))}
                {renderInput("mobile", t("mobile"), t("mobileHint"), "tel")}
                {renderInput("whatsapp", t("whatsapp"), t("whatsappHint"), "tel")}
                {renderInput("email", t("email"), t("emailHint"), "email")}
                {renderInput("dob", t("dob"), "", "date")}

                {renderSelect(
                  "gender",
                  t("gender"),
                  genderValues,
                  dictionary.genderOptions,
                )}
              </div>
            )}

            {currentStep === 1 && (
              <div className="partner-form-grid">
                {renderInput("address", t("address"), t("addressHint"))}
                {renderInput("city", t("city"), t("cityHint"))}
                {renderInput("state", t("state"), t("stateHint"))}
                {renderInput("pincode", t("pincode"), t("pincodeHint"), "text")}
              </div>
            )}

            {currentStep === 2 && (
              <div className="partner-form-grid">
                {renderSelect(
                  "category",
                  t("category"),
                  serviceCategories,
                  serviceCategories.map(
                    (category) =>
                      categoryLabels[category]?.[language] ?? category,
                  ),
                )}

                <div className="partner-field partner-full-width">
                  <span className="partner-label">{t("services")}</span>

                  <div className="partner-chip-group">
                    {(serviceOptionsByCategory[formData.category] ?? []).map(
                      (service) => {
                        const selected =
                          formData.services.includes(service);

                        return (
                          <button
                            type="button"
                            key={service}
                            className={`partner-chip${selected ? " active" : ""}`}
                            aria-pressed={selected}
                            onClick={() => {
                              const updated = selected
                                ? formData.services.filter(
                                  (item) => item !== service,
                                )
                                : [...formData.services, service];

                              updateField("services", updated);
                            }}
                          >
                            {serviceLabels[service]?.[language] ?? service}
                          </button>
                        );
                      },
                    )}
                  </div>

                  {renderError("services")}
                </div>

                {renderSelect(
                  "experience",
                  t("experience"),
                  experienceValues,
                  dictionary.experienceOptions,
                )}

                {renderInput(
                  "currentOccupation",
                  t("currentOccupation"),
                  t("occupationHint"),
                )}

                {renderInput(
                  "previousEmployer",
                  t("previousEmployer"),
                  t("employerHint"),
                )}

                <div className="partner-field partner-full-width">
                  <label
                    className="partner-label"
                    htmlFor="previousExperience"
                  >
                    {t("previousExperience")}
                  </label>

                  <textarea
                    id="previousExperience"
                    className={inputClass("previousExperience")}
                    value={formData.previousExperience}
                    placeholder={t("previousExperienceHint")}
                    onChange={(event) =>
                      updateField("previousExperience", event.target.value)
                    }
                    rows={3}
                  />

                  {renderError("previousExperience")}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="partner-form-grid">
                {renderSelect(
                  "idType",
                  t("idType"),
                  idValues,
                  dictionary.idOptions,
                )}

                {renderInput("idNumber", t("idNumber"), t("idNumberHint"))}

                {renderFileInput(
                  "governmentId",
                  t("governmentId"),
                  ".pdf,.jpg,.jpeg,.png",
                )}

                {renderFileInput(
                  "addressProof",
                  t("addressProof"),
                  ".pdf,.jpg,.jpeg,.png",
                )}

                {renderFileInput(
                  "experienceCertificate",
                  t("experienceCertificate"),
                  ".pdf,.jpg,.jpeg,.png",
                )}

                {renderFileInput(
                  "qualificationCertificate",
                  t("qualificationCertificate"),
                  ".pdf,.jpg,.jpeg,.png",
                )}

                <p className="partner-field-hint partner-full-width">
                  {t("documentHint")}
                </p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="partner-form-grid">
                {renderInput(
                  "serviceArea",
                  t("serviceArea"),
                  t("serviceAreaHint"),
                )}

                {renderSelect(
                  "workType",
                  t("workType"),
                  workTypeValues,
                  dictionary.workTypeOptions,
                )}

                {renderDayOptions()}

                {renderInput("startTime", t("startTime"), "", "time")}
                {renderInput("endTime", t("endTime"), "", "time")}

                {renderSelect(
                  "emergencyAvailability",
                  t("emergencyAvailability"),
                  emergencyValues,
                  dictionary.emergencyOptions,
                )}
              </div>
            )}

            {currentStep === 5 && (
              <div className="partner-form-grid">
                <div className="partner-field">
                  <label className="partner-label" htmlFor="password">
                    {t("password")}
                  </label>

                  <div className="partner-password-wrap">
                    <input
                      id="password"
                      className={inputClass("password")}
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      placeholder={t("passwordHint")}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      autoComplete="new-password"
                      aria-invalid={Boolean(errors.password)}
                    />

                    <button
                      type="button"
                      className="partner-password-toggle"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {renderError("password")}
                </div>

                <div className="partner-field">
                  <label
                    className="partner-label"
                    htmlFor="confirmPassword"
                  >
                    {t("confirmPassword")}
                  </label>

                  <div className="partner-password-wrap">
                    <input
                      id="confirmPassword"
                      className={inputClass("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      placeholder={t("confirmHint")}
                      onChange={(event) =>
                        updateField("confirmPassword", event.target.value)
                      }
                      autoComplete="new-password"
                      aria-invalid={Boolean(errors.confirmPassword)}
                    />

                    <button
                      type="button"
                      className="partner-password-toggle"
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {renderError("confirmPassword")}
                </div>

                <div className="partner-consent-group partner-full-width">
                  {renderCheckbox(
                    "terms",
                    `${t("termsStart")} ${t("termsLink")} ${t("and")} ${t("privacyLink")}${t("termsEnd")}`,
                  )}

                  {renderCheckbox(
                    "verificationConsent",
                    t("consent"),
                  )}
                </div>

                <div className="partner-security-note partner-full-width">
                  <ShieldCheck size={19} />
                  <span>{t("securityNote")}</span>
                </div>
              </div>
            )}

            <div className="partner-form-footer">
              <div className="partner-footer-security">
                <LockKeyhole size={16} />
                <span>{t("safe")}</span>
              </div>

              <div className="partner-footer-actions">
                {currentStep > 0 && (
                  <button
                    type="button"
                    className="partner-secondary-btn"
                    onClick={goBack}
                  >
                    <ArrowLeft size={17} />
                    {t("back")}
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    type="submit"
                    className="partner-primary-btn"
                  >
                    {t("next")}
                    <ArrowRight size={17} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="partner-primary-btn"
                  >
                    {t("submit")}
                    <Check size={17} />
                  </button>
                )}
              </div>
            </div>
          </form>
        </section>

        <footer className="partner-page-footer">
          <span>{t("help")}</span>

          <a href="mailto:support@oneservice.com">
            <Mail size={15} />
            {t("contact")}
          </a>
        </footer>
      </div>
    </main>
  );
}
