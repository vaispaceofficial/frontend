import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  LockKeyhole,
  Upload,
  UserRound,
  Building2,
  Package,
  Truck,
  BadgeCheck,
  Wallet,
  ShieldCheck,
  X,
} from "lucide-react";

import "./VendorRegisterPage.css";

type Language = "en" | "te" | "hi";

type VendorFormData = {
  fullName: string;
  mobile: string;
  email: string;
  alternateMobile: string;
  businessName: string;
  businessType: string;
  businessCategory: string;
  gstNumber: string;
  panNumber: string;
  businessAddress: string;
  city: string;
  state: string;
  pincode: string;
  products: string;
  productBrands: string;
  productDescription: string;
  minimumOrder: string;
  deliveryAvailable: string;
  deliveryRadius: string;
  shippingMethod: string;
  returnPolicy: string;
  idType: string;
  idNumber: string;
  idDocument: File | null;
  businessDocument: File | null;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  branchName: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  privacy: boolean;
};

const initialForm: VendorFormData = {
  fullName: "",
  mobile: "",
  email: "",
  alternateMobile: "",
  businessName: "",
  businessType: "",
  businessCategory: "",
  gstNumber: "",
  panNumber: "",
  businessAddress: "",
  city: "",
  state: "",
  pincode: "",
  products: "",
  productBrands: "",
  productDescription: "",
  minimumOrder: "",
  deliveryAvailable: "",
  deliveryRadius: "",
  shippingMethod: "",
  returnPolicy: "",
  idType: "",
  idNumber: "",
  idDocument: null,
  businessDocument: null,
  bankName: "",
  accountHolder: "",
  accountNumber: "",
  confirmAccountNumber: "",
  ifscCode: "",
  branchName: "",
  password: "",
  confirmPassword: "",
  terms: false,
  privacy: false,
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    pageEyebrow: "VENDOR PARTNER PROGRAM",
    pageTitle: "Grow your business with OneService",
    pageDescription:
      "Join our vendor network and connect your products with more customers. Complete the steps below to submit your registration.",
    language: "Language",
    english: "English",
    telugu: "తెలుగు",
    hindi: "हिन्दी",
    step: "Step",
    of: "of",
    contactStep: "Contact details",
    businessStep: "Business details",
    productsStep: "Products",
    deliveryStep: "Delivery",
    verificationStep: "Verification",
    bankStep: "Bank & security",
    contactTitle: "Let's get to know you",
    contactDescription: "Enter your contact details so we can reach you.",
    fullName: "Full name",
    fullNamePlaceholder: "Enter your full name",
    mobile: "Mobile number",
    mobilePlaceholder: "10-digit mobile number",
    alternateMobile: "Alternate mobile number",
    alternateMobilePlaceholder: "Optional alternate number",
    email: "Email address",
    emailPlaceholder: "you@example.com",
    businessTitle: "Tell us about your business",
    businessDescription: "Share your business information and location.",
    businessName: "Business name",
    businessNamePlaceholder: "Enter your registered business name",
    businessType: "Business type",
    selectBusinessType: "Select business type",
    individual: "Individual / Sole proprietor",
    partnership: "Partnership",
    privateLimited: "Private limited company",
    publicLimited: "Public limited company",
    llp: "Limited liability partnership (LLP)",
    other: "Other",
    businessCategory: "Business category",
    selectCategory: "Select a category",
    appliances: "Home appliances",
    electronics: "Electronics & accessories",
    furniture: "Furniture & home decor",
    fashion: "Fashion & clothing",
    sports: "Sports & fitness",
    tools: "Tools & spare parts",
    groceries: "Daily essentials",
    otherCategory: "Other products",
    gst: "GST number",
    gstPlaceholder: "Enter GST number (if applicable)",
    pan: "PAN number",
    panPlaceholder: "Enter PAN number",
    address: "Business address",
    addressPlaceholder: "Street, building, area",
    city: "City",
    cityPlaceholder: "Enter city",
    state: "State",
    statePlaceholder: "Enter state",
    pincode: "PIN code",
    pincodePlaceholder: "6-digit PIN code",
    productsTitle: "What do you sell?",
    productsDescription:
      "Help customers understand the products you offer.",
    products: "Products you sell",
    productsPlaceholder: "Select or describe the products you sell",
    brands: "Brands you deal in",
    brandsPlaceholder: "Enter brand names, separated by commas",
    productDescription: "Product description",
    productDescriptionPlaceholder:
      "Describe your products, quality, and specialities",
    minimumOrder: "Minimum order value (₹)",
    minimumOrderPlaceholder: "e.g. 500",
    deliveryTitle: "Delivery and returns",
    deliveryDescription:
      "Tell us how customers can receive their orders.",
    deliveryAvailable: "Do you provide delivery?",
    yes: "Yes",
    no: "No",
    deliveryRadius: "Delivery coverage",
    deliveryRadiusPlaceholder: "e.g. Within 20 km / Andhra Pradesh",
    shippingMethod: "Shipping method",
    shippingMethodPlaceholder: "Select shipping method",
    ownDelivery: "Own delivery team",
    courier: "Courier / logistics partner",
    both: "Both",
    pickup: "Customer pickup",
    returnPolicy: "Return and replacement policy",
    returnPolicyPlaceholder: "Describe your return or replacement policy",
    verificationTitle: "Verify your identity and business",
    verificationDescription:
      "Upload the documents required to review your vendor application.",
    idType: "Identity document type",
    selectIdType: "Select identity document",
    aadhaar: "Aadhaar card",
    panCard: "PAN card",
    passport: "Passport",
    drivingLicense: "Driving licence",
    voterId: "Voter ID",
    idNumber: "Identity document number",
    idNumberPlaceholder: "Enter document number",
    idDocument: "Identity document",
    businessDocument: "Business registration document",
    uploadHint: "Click to upload or drag a file here",
    uploadFormats: "PDF, JPG or PNG · Maximum 5 MB",
    uploaded: "Uploaded",
    bankTitle: "Payment and account security",
    bankDescription:
      "Provide bank details for vendor payments and secure your account.",
    bankName: "Bank name",
    bankNamePlaceholder: "Enter bank name",
    accountHolder: "Account holder name",
    accountHolderPlaceholder: "As printed on your bank account",
    accountNumber: "Account number",
    accountNumberPlaceholder: "Enter account number",
    confirmAccountNumber: "Confirm account number",
    confirmAccountNumberPlaceholder: "Re-enter account number",
    ifsc: "IFSC code",
    ifscPlaceholder: "e.g. SBIN0001234",
    branchName: "Bank branch",
    branchNamePlaceholder: "Enter branch name",
    password: "Create password",
    passwordPlaceholder: "At least 8 characters",
    confirmPassword: "Confirm password",
    confirmPasswordPlaceholder: "Re-enter your password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    agreeTerms: "I agree to the terms and conditions.",
    agreePrivacy: "I agree to the processing of my information for vendor registration.",
    back: "Back",
    next: "Save and continue",
    submit: "Submit registration",
    submitting: "Submitting...",
    required: "This field is required.",
    invalidMobile: "Enter a valid 10-digit Indian mobile number.",
    invalidEmail: "Enter a valid email address.",
    invalidPincode: "Enter a valid 6-digit PIN code.",
    invalidPan: "Enter a valid PAN number.",
    invalidGst: "Enter a valid GST number.",
    invalidIfsc: "Enter a valid IFSC code.",
    passwordLength: "Password must contain at least 8 characters.",
    passwordMismatch: "Passwords do not match.",
    accountMismatch: "Account numbers do not match.",
    termsRequired: "Please accept both consent statements.",
    fileTooLarge: "File size must be 5 MB or less.",
    invalidFile: "Upload a PDF, JPG or PNG file.",
    deliveryRequired: "Please specify whether delivery is available.",
    successTitle: "Registration submitted!",
    successDescription:
      "Thank you for applying to become a OneService vendor. Your details have been submitted for review.",
    successNote:
      "Our team will review your application and contact you using the details you provided.",
    startAgain: "Register another vendor",
    applicationSummary: "Application summary",
    vendorName: "Contact person",
    vendorBusiness: "Business",
    vendorEmail: "Email",
    vendorLocation: "Location",
    securityNote: "Your information is handled securely.",
    requiredFields: "Please complete all required fields before continuing.",
    stepContact: "Contact",
    stepBusiness: "Business",
    stepProducts: "Products",
    stepDelivery: "Delivery",
    stepVerification: "Verification",
    stepBank: "Bank & security",
    optional: "Optional",
    selectOption: "Select an option",
  },
  te: {
    pageEyebrow: "వెండర్ భాగస్వామ్య కార్యక్రమం",
    pageTitle: "OneServiceతో మీ వ్యాపారాన్ని అభివృద్ధి చేయండి",
    pageDescription:
      "మా వెండర్ నెట్‌వర్క్‌లో చేరి మరింత మంది కస్టమర్లను చేరుకోండి. నమోదు కోసం క్రింది దశలను పూర్తి చేయండి.",
    language: "భాష",
    english: "English",
    telugu: "తెలుగు",
    hindi: "हिन्दी",
    step: "దశ",
    of: "లో",
    contactStep: "సంప్రదింపు వివరాలు",
    businessStep: "వ్యాపార వివరాలు",
    productsStep: "ఉత్పత్తులు",
    deliveryStep: "డెలివరీ",
    verificationStep: "ధృవీకరణ",
    bankStep: "బ్యాంక్ మరియు భద్రత",
    contactTitle: "మీ గురించి తెలుసుకుందాం",
    contactDescription: "మిమ్మల్ని సంప్రదించడానికి మీ వివరాలను నమోదు చేయండి.",
    fullName: "పూర్తి పేరు",
    fullNamePlaceholder: "మీ పూర్తి పేరు నమోదు చేయండి",
    mobile: "మొబైల్ నంబర్",
    mobilePlaceholder: "10 అంకెల మొబైల్ నంబర్",
    alternateMobile: "ప్రత్యామ్నాయ మొబైల్ నంబర్",
    alternateMobilePlaceholder: "ఐచ్ఛిక ప్రత్యామ్నాయ నంబర్",
    email: "ఇమెయిల్ చిరునామా",
    emailPlaceholder: "you@example.com",
    businessTitle: "మీ వ్యాపారం గురించి చెప్పండి",
    businessDescription: "మీ వ్యాపార సమాచారం మరియు చిరునామాను నమోదు చేయండి.",
    businessName: "వ్యాపార పేరు",
    businessNamePlaceholder: "మీ వ్యాపార పేరును నమోదు చేయండి",
    businessType: "వ్యాపార రకం",
    selectBusinessType: "వ్యాపార రకాన్ని ఎంచుకోండి",
    individual: "వ్యక్తిగత / ఏకైక యజమాని",
    partnership: "భాగస్వామ్య సంస్థ",
    privateLimited: "ప్రైవేట్ లిమిటెడ్ కంపెనీ",
    publicLimited: "పబ్లిక్ లిమిటెడ్ కంపెనీ",
    llp: "లిమిటెడ్ లయబిలిటీ పార్ట్‌నర్‌షిప్ (LLP)",
    other: "ఇతర",
    businessCategory: "వ్యాపార వర్గం",
    selectCategory: "వర్గాన్ని ఎంచుకోండి",
    appliances: "గృహోపకరణాలు",
    electronics: "ఎలక్ట్రానిక్స్ మరియు యాక్సెసరీలు",
    furniture: "ఫర్నిచర్ మరియు గృహ అలంకరణ",
    fashion: "ఫ్యాషన్ మరియు దుస్తులు",
    sports: "క్రీడలు మరియు ఫిట్‌నెస్",
    tools: "పరికరాలు మరియు విడిభాగాలు",
    groceries: "రోజువారీ అవసరాలు",
    otherCategory: "ఇతర ఉత్పత్తులు",
    gst: "GST నంబర్",
    gstPlaceholder: "GST నంబర్ నమోదు చేయండి (వర్తిస్తే)",
    pan: "PAN నంబర్",
    panPlaceholder: "PAN నంబర్ నమోదు చేయండి",
    address: "వ్యాపార చిరునామా",
    addressPlaceholder: "వీధి, భవనం, ప్రాంతం",
    city: "నగరం",
    cityPlaceholder: "నగరాన్ని నమోదు చేయండి",
    state: "రాష్ట్రం",
    statePlaceholder: "రాష్ట్రాన్ని నమోదు చేయండి",
    pincode: "పిన్ కోడ్",
    pincodePlaceholder: "6 అంకెల పిన్ కోడ్",
    productsTitle: "మీరు ఏమి విక్రయిస్తారు?",
    productsDescription: "మీరు అందించే ఉత్పత్తుల గురించి వివరించండి.",
    products: "మీరు విక్రయించే ఉత్పత్తులు",
    productsPlaceholder: "ఉత్పత్తులను ఎంచుకోండి లేదా వివరించండి",
    brands: "మీరు విక్రయించే బ్రాండ్లు",
    brandsPlaceholder: "కామాలతో వేరు చేసి బ్రాండ్ల పేర్లు నమోదు చేయండి",
    productDescription: "ఉత్పత్తుల వివరణ",
    productDescriptionPlaceholder: "ఉత్పత్తులు, నాణ్యత, ప్రత్యేకతలను వివరించండి",
    minimumOrder: "కనీస ఆర్డర్ విలువ (₹)",
    minimumOrderPlaceholder: "ఉదా. 500",
    deliveryTitle: "డెలివరీ మరియు రిటర్న్స్",
    deliveryDescription: "కస్టమర్లకు ఆర్డర్లు ఎలా అందిస్తారో తెలియజేయండి.",
    deliveryAvailable: "మీరు డెలివరీ అందిస్తారా?",
    yes: "అవును",
    no: "కాదు",
    deliveryRadius: "డెలివరీ పరిధి",
    deliveryRadiusPlaceholder: "ఉదా. 20 కి.మీ. పరిధిలో / ఆంధ్రప్రదేశ్",
    shippingMethod: "రవాణా విధానం",
    shippingMethodPlaceholder: "రవాణా విధానాన్ని ఎంచుకోండి",
    ownDelivery: "సొంత డెలివరీ బృందం",
    courier: "కొరియర్ / లాజిస్టిక్స్ భాగస్వామి",
    both: "రెండూ",
    pickup: "కస్టమర్ స్వయంగా తీసుకెళ్లడం",
    returnPolicy: "రిటర్న్ మరియు రీప్లేస్‌మెంట్ విధానం",
    returnPolicyPlaceholder: "రిటర్న్ లేదా మార్పిడి విధానాన్ని వివరించండి",
    verificationTitle: "మీ గుర్తింపు మరియు వ్యాపారాన్ని ధృవీకరించండి",
    verificationDescription: "మీ వెండర్ దరఖాస్తు పరిశీలన కోసం అవసరమైన పత్రాలను అప్‌లోడ్ చేయండి.",
    idType: "గుర్తింపు పత్రం రకం",
    selectIdType: "గుర్తింపు పత్రాన్ని ఎంచుకోండి",
    aadhaar: "ఆధార్ కార్డు",
    panCard: "PAN కార్డు",
    passport: "పాస్‌పోర్ట్",
    drivingLicense: "డ్రైవింగ్ లైసెన్స్",
    voterId: "ఓటర్ ఐడీ",
    idNumber: "గుర్తింపు పత్రం నంబర్",
    idNumberPlaceholder: "పత్రం నంబర్ నమోదు చేయండి",
    idDocument: "గుర్తింపు పత్రం",
    businessDocument: "వ్యాపార నమోదు పత్రం",
    uploadHint: "ఫైల్ అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి లేదా ఇక్కడికి లాగండి",
    uploadFormats: "PDF, JPG లేదా PNG · గరిష్ఠంగా 5 MB",
    uploaded: "అప్‌లోడ్ అయింది",
    bankTitle: "చెల్లింపులు మరియు ఖాతా భద్రత",
    bankDescription: "వెండర్ చెల్లింపుల కోసం బ్యాంక్ వివరాలు నమోదు చేయండి.",
    bankName: "బ్యాంక్ పేరు",
    bankNamePlaceholder: "బ్యాంక్ పేరు నమోదు చేయండి",
    accountHolder: "ఖాతాదారుని పేరు",
    accountHolderPlaceholder: "బ్యాంక్ ఖాతాలో ఉన్న పేరును నమోదు చేయండి",
    accountNumber: "ఖాతా నంబర్",
    accountNumberPlaceholder: "ఖాతా నంబర్ నమోదు చేయండి",
    confirmAccountNumber: "ఖాతా నంబర్‌ను నిర్ధారించండి",
    confirmAccountNumberPlaceholder: "ఖాతా నంబర్‌ను మళ్లీ నమోదు చేయండి",
    ifsc: "IFSC కోడ్",
    ifscPlaceholder: "ఉదా. SBIN0001234",
    branchName: "బ్యాంక్ శాఖ",
    branchNamePlaceholder: "శాఖ పేరును నమోదు చేయండి",
    password: "పాస్‌వర్డ్ సృష్టించండి",
    passwordPlaceholder: "కనీసం 8 అక్షరాలు",
    confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి",
    confirmPasswordPlaceholder: "పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి",
    showPassword: "పాస్‌వర్డ్ చూపించండి",
    hidePassword: "పాస్‌వర్డ్ దాచండి",
    agreeTerms: "నిబంధనలు మరియు షరతులకు అంగీకరిస్తున్నాను.",
    agreePrivacy: "వెండర్ నమోదు కోసం నా సమాచార వినియోగానికి అంగీకరిస్తున్నాను.",
    back: "వెనక్కి",
    next: "సేవ్ చేసి కొనసాగించండి",
    submit: "నమోదు సమర్పించండి",
    submitting: "సమర్పిస్తోంది...",
    required: "ఈ వివరాన్ని తప్పనిసరిగా నమోదు చేయాలి.",
    invalidMobile: "సరైన 10 అంకెల భారతీయ మొబైల్ నంబర్ నమోదు చేయండి.",
    invalidEmail: "సరైన ఇమెయిల్ చిరునామా నమోదు చేయండి.",
    invalidPincode: "సరైన 6 అంకెల పిన్ కోడ్ నమోదు చేయండి.",
    invalidPan: "సరైన PAN నంబర్ నమోదు చేయండి.",
    invalidGst: "సరైన GST నంబర్ నమోదు చేయండి.",
    invalidIfsc: "సరైన IFSC కోడ్ నమోదు చేయండి.",
    passwordLength: "పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి.",
    passwordMismatch: "పాస్‌వర్డ్‌లు సరిపోలడం లేదు.",
    accountMismatch: "ఖాతా నంబర్‌లు సరిపోలడం లేదు.",
    termsRequired: "రెండు అంగీకారాలను నిర్ధారించండి.",
    fileTooLarge: "ఫైల్ పరిమాణం 5 MB లేదా అంతకంటే తక్కువ ఉండాలి.",
    invalidFile: "PDF, JPG లేదా PNG ఫైల్ అప్‌లోడ్ చేయండి.",
    deliveryRequired: "డెలివరీ అందుబాటులో ఉందో లేదో ఎంచుకోండి.",
    successTitle: "నమోదు సమర్పించబడింది!",
    successDescription: "OneService వెండర్‌గా చేరడానికి దరఖాస్తు చేసినందుకు ధన్యవాదాలు. మీ వివరాలు పరిశీలనకు పంపబడ్డాయి.",
    successNote: "మా బృందం మీ దరఖాస్తును పరిశీలించి మీరు అందించిన వివరాల ద్వారా సంప్రదిస్తుంది.",
    startAgain: "మరో వెండర్‌ను నమోదు చేయండి",
    applicationSummary: "దరఖాస్తు సారాంశం",
    vendorName: "సంప్రదింపు వ్యక్తి",
    vendorBusiness: "వ్యాపారం",
    vendorEmail: "ఇమెయిల్",
    vendorLocation: "ప్రాంతం",
    securityNote: "మీ సమాచారం సురక్షితంగా నిర్వహించబడుతుంది.",
    requiredFields: "కొనసాగించే ముందు అవసరమైన వివరాలను పూర్తి చేయండి.",
    stepContact: "సంప్రదింపు",
    stepBusiness: "వ్యాపారం",
    stepProducts: "ఉత్పత్తులు",
    stepDelivery: "డెలివరీ",
    stepVerification: "ధృవీకరణ",
    stepBank: "బ్యాంక్ మరియు భద్రత",
    optional: "ఐచ్ఛికం",
    selectOption: "ఒక ఎంపికను ఎంచుకోండి",
  },
  hi: {
    pageEyebrow: "विक्रेता साझेदारी कार्यक्रम",
    pageTitle: "OneService के साथ अपना व्यवसाय बढ़ाएँ",
    pageDescription:
      "हमारे विक्रेता नेटवर्क से जुड़ें और अधिक ग्राहकों तक पहुँचें। पंजीकरण के लिए नीचे दिए गए चरण पूरे करें।",
    language: "भाषा",
    english: "English",
    telugu: "తెలుగు",
    hindi: "हिन्दी",
    step: "चरण",
    of: "में से",
    contactStep: "संपर्क विवरण",
    businessStep: "व्यवसाय विवरण",
    productsStep: "उत्पाद",
    deliveryStep: "डिलीवरी",
    verificationStep: "सत्यापन",
    bankStep: "बैंक और सुरक्षा",
    contactTitle: "आइए, आपको जानें",
    contactDescription: "आपसे संपर्क करने के लिए अपना विवरण भरें।",
    fullName: "पूरा नाम",
    fullNamePlaceholder: "अपना पूरा नाम दर्ज करें",
    mobile: "मोबाइल नंबर",
    mobilePlaceholder: "10 अंकों का मोबाइल नंबर",
    alternateMobile: "वैकल्पिक मोबाइल नंबर",
    alternateMobilePlaceholder: "वैकल्पिक नंबर (ज़रूरी नहीं)",
    email: "ईमेल पता",
    emailPlaceholder: "you@example.com",
    businessTitle: "अपने व्यवसाय के बारे में बताएँ",
    businessDescription: "अपने व्यवसाय की जानकारी और पता दर्ज करें।",
    businessName: "व्यवसाय का नाम",
    businessNamePlaceholder: "अपने व्यवसाय का नाम दर्ज करें",
    businessType: "व्यवसाय का प्रकार",
    selectBusinessType: "व्यवसाय का प्रकार चुनें",
    individual: "व्यक्तिगत / एकल स्वामित्व",
    partnership: "साझेदारी",
    privateLimited: "प्राइवेट लिमिटेड कंपनी",
    publicLimited: "पब्लिक लिमिटेड कंपनी",
    llp: "लिमिटेड लायबिलिटी पार्टनरशिप (LLP)",
    other: "अन्य",
    businessCategory: "व्यवसाय श्रेणी",
    selectCategory: "श्रेणी चुनें",
    appliances: "घरेलू उपकरण",
    electronics: "इलेक्ट्रॉनिक्स और एक्सेसरीज़",
    furniture: "फर्नीचर और घर की सजावट",
    fashion: "फैशन और कपड़े",
    sports: "खेल और फिटनेस",
    tools: "औज़ार और स्पेयर पार्ट्स",
    groceries: "दैनिक आवश्यक वस्तुएँ",
    otherCategory: "अन्य उत्पाद",
    gst: "GST नंबर",
    gstPlaceholder: "GST नंबर दर्ज करें (यदि लागू हो)",
    pan: "PAN नंबर",
    panPlaceholder: "PAN नंबर दर्ज करें",
    address: "व्यवसाय का पता",
    addressPlaceholder: "सड़क, भवन, क्षेत्र",
    city: "शहर",
    cityPlaceholder: "शहर दर्ज करें",
    state: "राज्य",
    statePlaceholder: "राज्य दर्ज करें",
    pincode: "पिन कोड",
    pincodePlaceholder: "6 अंकों का पिन कोड",
    productsTitle: "आप क्या बेचते हैं?",
    productsDescription: "अपने उत्पादों के बारे में जानकारी दें।",
    products: "आपके उत्पाद",
    productsPlaceholder: "अपने उत्पाद चुनें या उनका विवरण दें",
    brands: "आपके ब्रांड",
    brandsPlaceholder: "कॉमा लगाकर ब्रांड के नाम दर्ज करें",
    productDescription: "उत्पाद विवरण",
    productDescriptionPlaceholder: "अपने उत्पादों, गुणवत्ता और विशेषताओं का वर्णन करें",
    minimumOrder: "न्यूनतम ऑर्डर मूल्य (₹)",
    minimumOrderPlaceholder: "उदा. 500",
    deliveryTitle: "डिलीवरी और वापसी",
    deliveryDescription: "बताएँ कि ग्राहकों तक ऑर्डर कैसे पहुँचेंगे।",
    deliveryAvailable: "क्या आप डिलीवरी देते हैं?",
    yes: "हाँ",
    no: "नहीं",
    deliveryRadius: "डिलीवरी क्षेत्र",
    deliveryRadiusPlaceholder: "उदा. 20 किमी के भीतर / आंध्र प्रदेश",
    shippingMethod: "शिपिंग का तरीका",
    shippingMethodPlaceholder: "शिपिंग का तरीका चुनें",
    ownDelivery: "अपनी डिलीवरी टीम",
    courier: "कूरियर / लॉजिस्टिक्स पार्टनर",
    both: "दोनों",
    pickup: "ग्राहक द्वारा स्वयं लेना",
    returnPolicy: "वापसी और प्रतिस्थापन नीति",
    returnPolicyPlaceholder: "वापसी या प्रतिस्थापन नीति का वर्णन करें",
    verificationTitle: "अपनी पहचान और व्यवसाय सत्यापित करें",
    verificationDescription: "विक्रेता आवेदन की समीक्षा के लिए आवश्यक दस्तावेज़ अपलोड करें।",
    idType: "पहचान दस्तावेज़ का प्रकार",
    selectIdType: "पहचान दस्तावेज़ चुनें",
    aadhaar: "आधार कार्ड",
    panCard: "PAN कार्ड",
    passport: "पासपोर्ट",
    drivingLicense: "ड्राइविंग लाइसेंस",
    voterId: "वोटर ID",
    idNumber: "पहचान दस्तावेज़ नंबर",
    idNumberPlaceholder: "दस्तावेज़ नंबर दर्ज करें",
    idDocument: "पहचान दस्तावेज़",
    businessDocument: "व्यवसाय पंजीकरण दस्तावेज़",
    uploadHint: "फ़ाइल अपलोड करने के लिए क्लिक करें या यहाँ खींचें",
    uploadFormats: "PDF, JPG या PNG · अधिकतम 5 MB",
    uploaded: "अपलोड हो गया",
    bankTitle: "भुगतान और खाता सुरक्षा",
    bankDescription: "विक्रेता भुगतान के लिए बैंक विवरण भरें और अपना खाता सुरक्षित करें।",
    bankName: "बैंक का नाम",
    bankNamePlaceholder: "बैंक का नाम दर्ज करें",
    accountHolder: "खाताधारक का नाम",
    accountHolderPlaceholder: "बैंक खाते में दर्ज नाम",
    accountNumber: "खाता नंबर",
    accountNumberPlaceholder: "खाता नंबर दर्ज करें",
    confirmAccountNumber: "खाता नंबर की पुष्टि करें",
    confirmAccountNumberPlaceholder: "खाता नंबर दोबारा दर्ज करें",
    ifsc: "IFSC कोड",
    ifscPlaceholder: "उदा. SBIN0001234",
    branchName: "बैंक शाखा",
    branchNamePlaceholder: "शाखा का नाम दर्ज करें",
    password: "पासवर्ड बनाएँ",
    passwordPlaceholder: "कम से कम 8 अक्षर",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "पासवर्ड दोबारा दर्ज करें",
    showPassword: "पासवर्ड दिखाएँ",
    hidePassword: "पासवर्ड छिपाएँ",
    agreeTerms: "मैं नियम और शर्तों से सहमत हूँ।",
    agreePrivacy: "मैं विक्रेता पंजीकरण के लिए अपनी जानकारी के उपयोग से सहमत हूँ।",
    back: "वापस",
    next: "सेव करें और आगे बढ़ें",
    submit: "पंजीकरण जमा करें",
    submitting: "जमा किया जा रहा है...",
    required: "यह फ़ील्ड आवश्यक है।",
    invalidMobile: "मान्य 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।",
    invalidEmail: "मान्य ईमेल पता दर्ज करें।",
    invalidPincode: "मान्य 6 अंकों का पिन कोड दर्ज करें।",
    invalidPan: "मान्य PAN नंबर दर्ज करें।",
    invalidGst: "मान्य GST नंबर दर्ज करें।",
    invalidIfsc: "मान्य IFSC कोड दर्ज करें।",
    passwordLength: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
    passwordMismatch: "पासवर्ड मेल नहीं खाते।",
    accountMismatch: "खाता नंबर मेल नहीं खाते।",
    termsRequired: "दोनों सहमति विकल्प स्वीकार करें।",
    fileTooLarge: "फ़ाइल का आकार 5 MB या उससे कम होना चाहिए।",
    invalidFile: "PDF, JPG या PNG फ़ाइल अपलोड करें।",
    deliveryRequired: "कृपया डिलीवरी उपलब्धता चुनें।",
    successTitle: "पंजीकरण जमा हो गया!",
    successDescription: "OneService विक्रेता बनने के लिए धन्यवाद। आपका विवरण समीक्षा के लिए जमा कर दिया गया है।",
    successNote: "हमारी टीम आपके आवेदन की समीक्षा करेगी और आपके दिए गए विवरण के माध्यम से संपर्क करेगी।",
    startAgain: "दूसरे विक्रेता का पंजीकरण करें",
    applicationSummary: "आवेदन सारांश",
    vendorName: "संपर्क व्यक्ति",
    vendorBusiness: "व्यवसाय",
    vendorEmail: "ईमेल",
    vendorLocation: "स्थान",
    securityNote: "आपकी जानकारी सुरक्षित रूप से संभाली जाती है।",
    requiredFields: "आगे बढ़ने से पहले सभी आवश्यक विवरण भरें।",
    stepContact: "संपर्क",
    stepBusiness: "व्यवसाय",
    stepProducts: "उत्पाद",
    stepDelivery: "डिलीवरी",
    stepVerification: "सत्यापन",
    stepBank: "बैंक और सुरक्षा",
    optional: "वैकल्पिक",
    selectOption: "एक विकल्प चुनें",
  },
};

const stepTitles = [
  "contactStep",
  "businessStep",
  "productsStep",
  "deliveryStep",
  "verificationStep",
  "bankStep",
] as const;

const stepIcons = [
  UserRound,
  Building2,
  Package,
  Truck,
  BadgeCheck,
  Wallet,
];

export default function VendorRegisterPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<VendorFormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const t = (key: string) =>
    translations[language][key] ?? translations.en[key] ?? key;

  const updateField = (
    name: keyof VendorFormData,
    value: string | boolean | File | null,
  ) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setGeneralError("");
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    updateField(name as keyof VendorFormData, value);
  };

  const handleFile = (
    event: ChangeEvent<HTMLInputElement>,
    name: "idDocument" | "businessDocument",
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((previous) => ({ ...previous, [name]: t("invalidFile") }));
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({ ...previous, [name]: t("fileTooLarge") }));
      event.target.value = "";
      return;
    }

    updateField(name, file);
  };

  const validateStep = (currentStep: number) => {
    const nextErrors: Record<string, string> = {};

    const required = (field: keyof VendorFormData) => {
      const value = formData[field];
      if (typeof value === "string" && !value.trim()) {
        nextErrors[field] = t("required");
      }
    };

    if (currentStep === 0) {
      required("fullName");
      required("mobile");
      required("email");

      if (formData.mobile && !/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
        nextErrors.mobile = t("invalidMobile");
      }

      if (
        formData.alternateMobile &&
        !/^[6-9]\d{9}$/.test(formData.alternateMobile.trim())
      ) {
        nextErrors.alternateMobile = t("invalidMobile");
      }

      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
      ) {
        nextErrors.email = t("invalidEmail");
      }
    }

    if (currentStep === 1) {
      required("businessName");
      required("businessType");
      required("businessCategory");
      required("businessAddress");
      required("city");
      required("state");
      required("pincode");

      if (formData.pincode && !/^\d{6}$/.test(formData.pincode.trim())) {
        nextErrors.pincode = t("invalidPincode");
      }

      if (
        formData.panNumber &&
        !/^[A-Z]{5}\d{4}[A-Z]$/i.test(formData.panNumber.trim())
      ) {
        nextErrors.panNumber = t("invalidPan");
      }

      if (
        formData.gstNumber &&
        !/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]$/i.test(
          formData.gstNumber.trim(),
        )
      ) {
        nextErrors.gstNumber = t("invalidGst");
      }
    }

    if (currentStep === 2) {
      required("products");
      required("productDescription");
    }

    if (currentStep === 3) {
      required("deliveryAvailable");

      if (formData.deliveryAvailable === "yes") {
        required("deliveryRadius");
        required("shippingMethod");
      }
    }

    if (currentStep === 4) {
      required("idType");
      required("idNumber");

      if (!formData.idDocument) {
        nextErrors.idDocument = t("required");
      }
    }

    if (currentStep === 5) {
      required("bankName");
      required("accountHolder");
      required("accountNumber");
      required("confirmAccountNumber");
      required("ifscCode");
      required("password");
      required("confirmPassword");

      if (
        formData.accountNumber &&
        formData.confirmAccountNumber &&
        formData.accountNumber !== formData.confirmAccountNumber
      ) {
        nextErrors.confirmAccountNumber = t("accountMismatch");
      }

      if (
        formData.ifscCode &&
        !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(formData.ifscCode.trim())
      ) {
        nextErrors.ifscCode = t("invalidIfsc");
      }

      if (
        formData.password &&
        formData.password.length < 8
      ) {
        nextErrors.password = t("passwordLength");
      }

      if (
        formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
      ) {
        nextErrors.confirmPassword = t("passwordMismatch");
      }

      if (!formData.terms || !formData.privacy) {
        nextErrors.terms = t("termsRequired");
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) {
      setGeneralError(t("requiredFields"));
      return;
    }

    setGeneralError("");
    setStep((previous) => Math.min(previous + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setGeneralError("");
    setErrors({});
    setStep((previous) => Math.max(previous - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateStep(5)) {
      setGeneralError(t("requiredFields"));
      return;
    }

    setSubmitting(true);
    setGeneralError("");

    try {
      /*
       * Demo submission:
       * Replace this block with your backend API request when available.
       * File objects need FormData if your API accepts uploaded documents.
       */
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setGeneralError("Unable to submit registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (
    name: keyof VendorFormData,
    label: string,
    placeholder: string,
    options?: {
      type?: string;
      required?: boolean;
      textarea?: boolean;
      optional?: boolean;
      autoComplete?: string;
    },
  ) => (
    <div className="vendor-form-group" key={name}>
      <label className="vendor-label" htmlFor={name}>
        {t(label)}
        {options?.optional && (
          <span className="vendor-optional"> ({t("optional")})</span>
        )}
      </label>

      {options?.textarea ? (
        <textarea
          id={name}
          name={name}
          className="vendor-input vendor-textarea"
          placeholder={t(placeholder)}
          value={String(formData[name] ?? "")}
          onChange={handleChange}
          rows={4}
        />
      ) : (
        <input
          id={name}
          name={name}
          className={`vendor-input ${errors[name] ? "vendor-input-error" : ""}`}
          type={options?.type ?? "text"}
          placeholder={t(placeholder)}
          value={String(formData[name] ?? "")}
          onChange={handleChange}
          autoComplete={options?.autoComplete}
          required={options?.required}
        />
      )}

      {errors[name] && (
        <span className="vendor-error-text">{errors[name]}</span>
      )}
    </div>
  );

  const selectField = (
    name: keyof VendorFormData,
    label: string,
    placeholder: string,
    options: Array<[string, string]>,
  ) => (
    <div className="vendor-form-group" key={name}>
      <label className="vendor-label" htmlFor={name}>
        {t(label)}
      </label>

      <select
        id={name}
        name={name}
        className={`vendor-input vendor-select ${errors[name] ? "vendor-input-error" : ""}`}
        value={String(formData[name] ?? "")}
        onChange={handleChange}
      >
        <option value="">{t(placeholder)}</option>
        {options.map(([value, labelKey]) => (
          <option value={value} key={value}>
            {t(labelKey)}
          </option>
        ))}
      </select>

      {errors[name] && (
        <span className="vendor-error-text">{errors[name]}</span>
      )}
    </div>
  );

  const fileField = (
    name: "idDocument" | "businessDocument",
    label: string,
  ) => (
    <div className="vendor-form-group" key={name}>
      <label className="vendor-label" htmlFor={name}>
        {t(label)}
        {name === "businessDocument" && (
          <span className="vendor-optional"> ({t("optional")})</span>
        )}
      </label>

      <label className="vendor-upload-box" htmlFor={name}>
        {formData[name] ? (
          <>
            <CheckCircle2 size={23} />
            <span className="vendor-upload-name">{formData[name]?.name}</span>
            <span className="vendor-uploaded">{t("uploaded")}</span>
          </>
        ) : (
          <>
            <Upload size={25} />
            <span>{t("uploadHint")}</span>
            <small>{t("uploadFormats")}</small>
          </>
        )}
      </label>

      <input
        id={name}
        name={name}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        className="vendor-file-input"
        onChange={(event) => handleFile(event, name)}
      />

      {errors[name] && (
        <span className="vendor-error-text">{errors[name]}</span>
      )}
    </div>
  );

  const passwordField = (
    name: "password" | "confirmPassword",
    label: string,
    placeholder: string,
    visible: boolean,
    toggle: () => void,
  ) => (
    <div className="vendor-form-group" key={name}>
      <label className="vendor-label" htmlFor={name}>
        {t(label)}
      </label>
      <div className="vendor-password-wrap">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          className={`vendor-input ${errors[name] ? "vendor-input-error" : ""}`}
          placeholder={t(placeholder)}
          value={formData[name]}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <button
          type="button"
          className="vendor-password-toggle"
          onClick={toggle}
          aria-label={visible ? t("hidePassword") : t("showPassword")}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {errors[name] && (
        <span className="vendor-error-text">{errors[name]}</span>
      )}
    </div>
  );

  const renderStep = (): ReactNode => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="vendor-step-heading">
              <span className="vendor-section-kicker">{t("stepContact")}</span>
              <h2>{t("contactTitle")}</h2>
              <p>{t("contactDescription")}</p>
            </div>

            <div className="vendor-form-grid">
              {field("fullName", "fullName", "fullNamePlaceholder", {
                required: true,
                autoComplete: "name",
              })}
              {field("mobile", "mobile", "mobilePlaceholder", {
                required: true,
                autoComplete: "tel",
              })}
              {field("email", "email", "emailPlaceholder", {
                type: "email",
                required: true,
                autoComplete: "email",
              })}
              {field(
                "alternateMobile",
                "alternateMobile",
                "alternateMobilePlaceholder",
                { optional: true },
              )}
            </div>
          </>
        );

      case 1:
        return (
          <>
            <div className="vendor-step-heading">
              <span className="vendor-section-kicker">{t("stepBusiness")}</span>
              <h2>{t("businessTitle")}</h2>
              <p>{t("businessDescription")}</p>
            </div>

            <div className="vendor-form-grid">
              {field("businessName", "businessName", "businessNamePlaceholder")}
              {selectField("businessType", "businessType", "selectBusinessType", [
                ["individual", "individual"],
                ["partnership", "partnership"],
                ["private-limited", "privateLimited"],
                ["public-limited", "publicLimited"],
                ["llp", "llp"],
                ["other", "other"],
              ])}
              {selectField("businessCategory", "businessCategory", "selectCategory", [
                ["appliances", "appliances"],
                ["electronics", "electronics"],
                ["furniture", "furniture"],
                ["fashion", "fashion"],
                ["sports", "sports"],
                ["tools", "tools"],
                ["groceries", "groceries"],
                ["other", "otherCategory"],
              ])}
              {field("gstNumber", "gst", "gstPlaceholder", { optional: true })}
              {field("panNumber", "pan", "panPlaceholder", { optional: true })}
              {field("businessAddress", "address", "addressPlaceholder")}
              {field("city", "city", "cityPlaceholder")}
              {field("state", "state", "statePlaceholder")}
              {field("pincode", "pincode", "pincodePlaceholder")}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="vendor-step-heading">
              <span className="vendor-section-kicker">{t("stepProducts")}</span>
              <h2>{t("productsTitle")}</h2>
              <p>{t("productsDescription")}</p>
            </div>

            <div className="vendor-form-grid">
              {field("products", "products", "productsPlaceholder", {
                textarea: true,
              })}
              {field("productBrands", "brands", "brandsPlaceholder", {
                optional: true,
              })}
              {field(
                "productDescription",
                "productDescription",
                "productDescriptionPlaceholder",
                { textarea: true },
              )}
              {field(
                "minimumOrder",
                "minimumOrder",
                "minimumOrderPlaceholder",
                { type: "number", optional: true },
              )}
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="vendor-step-heading">
              <span className="vendor-section-kicker">{t("stepDelivery")}</span>
              <h2>{t("deliveryTitle")}</h2>
              <p>{t("deliveryDescription")}</p>
            </div>

            <div className="vendor-form-grid">
              <div className="vendor-form-group vendor-full-width">
                <span className="vendor-label">{t("deliveryAvailable")}</span>
                <div className="vendor-choice-row">
                  {(["yes", "no"] as const).map((value) => (
                    <label className="vendor-choice" key={value}>
                      <input
                        type="radio"
                        name="deliveryAvailable"
                        value={value}
                        checked={formData.deliveryAvailable === value}
                        onChange={handleChange}
                      />
                      <span>{t(value)}</span>
                    </label>
                  ))}
                </div>
                {errors.deliveryAvailable && (
                  <span className="vendor-error-text">
                    {errors.deliveryAvailable}
                  </span>
                )}
              </div>

              {formData.deliveryAvailable === "yes" && (
                <>
                  {field(
                    "deliveryRadius",
                    "deliveryRadius",
                    "deliveryRadiusPlaceholder",
                  )}
                  {selectField(
                    "shippingMethod",
                    "shippingMethod",
                    "shippingMethodPlaceholder",
                    [
                      ["own", "ownDelivery"],
                      ["courier", "courier"],
                      ["both", "both"],
                      ["pickup", "pickup"],
                    ],
                  )}
                </>
              )}

              {field("returnPolicy", "returnPolicy", "returnPolicyPlaceholder", {
                textarea: true,
                optional: true,
              })}
            </div>
          </>
        );

      case 4:
        return (
          <>
            <div className="vendor-step-heading">
              <span className="vendor-section-kicker">
                {t("stepVerification")}
              </span>
              <h2>{t("verificationTitle")}</h2>
              <p>{t("verificationDescription")}</p>
            </div>

            <div className="vendor-form-grid">
              {selectField("idType", "idType", "selectIdType", [
                ["aadhaar", "aadhaar"],
                ["pan", "panCard"],
                ["passport", "passport"],
                ["driving-license", "drivingLicense"],
                ["voter-id", "voterId"],
              ])}
              {field("idNumber", "idNumber", "idNumberPlaceholder")}
              {fileField("idDocument", "idDocument")}
              {fileField("businessDocument", "businessDocument")}
            </div>

            <div className="vendor-info-note">
              <ShieldCheck size={18} />
              <span>{t("securityNote")}</span>
            </div>
          </>
        );

      default:
        return (
          <>
            <div className="vendor-step-heading">
              <span className="vendor-section-kicker">{t("stepBank")}</span>
              <h2>{t("bankTitle")}</h2>
              <p>{t("bankDescription")}</p>
            </div>

            <div className="vendor-form-grid">
              {field("bankName", "bankName", "bankNamePlaceholder")}
              {field("accountHolder", "accountHolder", "accountHolderPlaceholder")}
              {field("accountNumber", "accountNumber", "accountNumberPlaceholder")}
              {field(
                "confirmAccountNumber",
                "confirmAccountNumber",
                "confirmAccountNumberPlaceholder",
              )}
              {field("ifscCode", "ifsc", "ifscPlaceholder")}
              {field("branchName", "branchName", "branchNamePlaceholder", {
                optional: true,
              })}

              {passwordField(
                "password",
                "password",
                "passwordPlaceholder",
                showPassword,
                () => setShowPassword((previous) => !previous),
              )}

              {passwordField(
                "confirmPassword",
                "confirmPassword",
                "confirmPasswordPlaceholder",
                showConfirmPassword,
                () => setShowConfirmPassword((previous) => !previous),
              )}
            </div>

            <div className="vendor-consent-list">
              <label className="vendor-consent">
                <input
                  type="checkbox"
                  checked={formData.terms}
                  onChange={(event) => updateField("terms", event.target.checked)}
                />
                <span>{t("agreeTerms")}</span>
              </label>

              <label className="vendor-consent">
                <input
                  type="checkbox"
                  checked={formData.privacy}
                  onChange={(event) => updateField("privacy", event.target.checked)}
                />
                <span>{t("agreePrivacy")}</span>
              </label>

              {errors.terms && (
                <span className="vendor-error-text">{errors.terms}</span>
              )}
            </div>
          </>
        );
    }
  };

  if (submitted) {
    return (
      <main className="vendor-register-page">
        <section className="vendor-register-card vendor-success-card">
          <div className="vendor-language-switcher">
            <Globe size={17} />
            <label htmlFor="vendor-language-success">{t("language")}</label>
            <select
              id="vendor-language-success"
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className="vendor-language-select"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          <div className="vendor-success-icon">
            <CheckCircle2 size={42} />
          </div>
          <h1>{t("successTitle")}</h1>
          <p className="vendor-success-description">{t("successDescription")}</p>

          <div className="vendor-summary">
            <h3>{t("applicationSummary")}</h3>
            <p>
              <strong>{t("vendorName")}:</strong> {formData.fullName}
            </p>
            <p>
              <strong>{t("vendorBusiness")}:</strong> {formData.businessName}
            </p>
            <p>
              <strong>{t("vendorEmail")}:</strong> {formData.email}
            </p>
            <p>
              <strong>{t("vendorLocation")}:</strong>{" "}
              {[formData.city, formData.state, formData.pincode]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>

          <p className="vendor-success-note">{t("successNote")}</p>

          <button
            type="button"
            className="vendor-primary-button"
            onClick={() => {
              setFormData(initialForm);
              setErrors({});
              setStep(0);
              setSubmitted(false);
            }}
          >
            {t("startAgain")}
            <ArrowRight size={18} />
          </button>
        </section>
      </main>
    );
  }

  const StepIcon = stepIcons[step];

  return (
    <main className="vendor-register-page">
      <div className="vendor-register-shell">
        <header className="vendor-register-header">
          <div className="vendor-header-topline">
            <span className="vendor-eyebrow">{t("pageEyebrow")}</span>

            <div className="vendor-language-switcher">
              <Globe size={17} />
              <label htmlFor="vendor-language">{t("language")}</label>
              <select
                id="vendor-language"
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
                className="vendor-language-select"
              >
                <option value="en">{t("english")}</option>
                <option value="te">{t("telugu")}</option>
                <option value="hi">{t("hindi")}</option>
              </select>
            </div>
          </div>

          <h1>{t("pageTitle")}</h1>
          <p>{t("pageDescription")}</p>
        </header>

        <section className="vendor-register-card">
          <div className="vendor-progress-header">
            <div className="vendor-progress-copy">
              <span>
                {t("step")} {step + 1} {t("of")} 6
              </span>
              <strong>{t(stepTitles[step])}</strong>
            </div>
            <span className="vendor-progress-percentage">
              {Math.round(((step + 1) / 6) * 100)}%
            </span>
          </div>

          <div
            className="vendor-progress-track"
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={6}
          >
            <div
              className="vendor-progress-fill"
              style={{ width: `${((step + 1) / 6) * 100}%` }}
            />
          </div>

          <nav className="vendor-step-navigation" aria-label="Registration steps">
            {stepTitles.map((title, index) => {
              const Icon = stepIcons[index];
              const completed = index < step;
              const active = index === step;

              return (
                <button
                  type="button"
                  key={title}
                  className={[
                    "vendor-step-indicator",
                    active ? "active" : "",
                    completed ? "completed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    if (index < step) {
                      setStep(index);
                      setErrors({});
                      setGeneralError("");
                    }
                  }}
                  disabled={index >= step}
                  aria-current={active ? "step" : undefined}
                >
                  <span className="vendor-step-icon">
                    {completed ? <Check size={17} /> : <Icon size={17} />}
                  </span>
                  <span className="vendor-step-label">
                    {t(title)}
                  </span>
                </button>
              );
            })}
          </nav>

          <form onSubmit={handleSubmit} noValidate>
            <div className="vendor-form-content">
              <div className="vendor-current-step-icon">
                <StepIcon size={23} />
              </div>

              {renderStep()}

              {generalError && (
                <div className="vendor-general-error" role="alert">
                  <X size={17} />
                  <span>{generalError}</span>
                </div>
              )}

              <div className="vendor-form-actions">
                {step > 0 ? (
                  <button
                    type="button"
                    className="vendor-secondary-button"
                    onClick={goBack}
                  >
                    <ArrowLeft size={18} />
                    {t("back")}
                  </button>
                ) : (
                  <span />
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    className="vendor-primary-button"
                    onClick={goNext}
                  >
                    {t("next")}
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="vendor-primary-button"
                    disabled={submitting}
                  >
                    {submitting ? t("submitting") : t("submit")}
                    {submitting ? (
                      <span className="vendor-button-spinner" />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </section>

        <footer className="vendor-register-footer">
          <LockKeyhole size={15} />
          <span>{t("securityNote")}</span>
        </footer>
      </div>
    </main>
  );
}