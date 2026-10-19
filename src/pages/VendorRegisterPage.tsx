
import { useState } from "react";
import { Link } from "react-router-dom";
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

type FormData = {
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

const initial: FormData = {
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

const steps = [
  "contactStep",
  "businessStep",
  "productsStep",
  "deliveryStep",
  "verificationStep",
  "bankStep",
] as const;

const icons = [
  UserRound,
  Building2,
  Package,
  Truck,
  BadgeCheck,
  Wallet,
];

const dict: Record<Language, Record<string, string>> = {
  en: {
    pageEyebrow: "VENDOR PARTNER PROGRAM",
    pageTitle: "Grow your business with NeedOneService",
    pageDescription:
      "Join our vendor network and connect your products with more customers.",

    language: "Language",
    english: "English",
    telugu: "తెలుగు",
    hindi: "हिन्दी",
    alreadyRegistered: "Already registered?",
    signIn: "Sign in",

    login: "Sign in",
    step: "Step",
    of: "of",
    contactStep: "Contact details",
    businessStep: "Business details",
    productsStep: "Products",
    deliveryStep: "Delivery",
    verificationStep: "Verification",
    bankStep: "Bank & security",

    contactTitle: "Let's get to know you",
    contactDescription:
      "Enter your contact details so we can reach you.",
    fullName: "Full name",
    mobile: "Mobile number",
    email: "Email address",
    alternateMobile: "Alternate mobile number",

    businessTitle: "Tell us about your business",
    businessName: "Business name",
    businessType: "Business type",
    businessCategory: "Business category",
    gstNumber: "GST number",
    panNumber: "PAN number",
    businessAddress: "Business address",
    city: "City",
    state: "State",
    pincode: "PIN code",

    productsTitle: "What do you sell?",
    products: "Products you sell",
    productBrands: "Brands you deal in",
    productDescription: "Product description",
    minimumOrder: "Minimum order value (₹)",

    deliveryTitle: "Delivery and returns",
    deliveryAvailable: "Do you provide delivery?",
    deliveryRadius: "Delivery coverage",
    shippingMethod: "Shipping method",
    returnPolicy: "Return and replacement policy",

    verificationTitle: "Verify your identity and business",
    idType: "Identity document type",
    idNumber: "Identity document number",
    idDocument: "Identity document",
    businessDocument: "Business registration document",

    bankTitle: "Payment and account security",
    bankName: "Bank name",
    accountHolder: "Account holder name",
    accountNumber: "Account number",
    confirmAccountNumber: "Confirm account number",
    ifscCode: "IFSC code",
    branchName: "Bank branch",
    password: "Create password",
    confirmPassword: "Confirm password",

    agreeTerms: "I agree to the terms and conditions.",
    agreePrivacy:
      "I agree to the processing of my information for vendor registration.",

    back: "Back",
    next: "Save and continue",
    submit: "Submit registration",
    submitting: "Submitting...",

    required: "This field is required.",
    requiredFields:
      "Please complete all required fields before continuing.",
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

    yes: "Yes",
    no: "No",
    optional: "Optional",
    selectOption: "Select an option",
    selectBusinessType: "Select business type",

    individual: "Individual / Sole proprietor",
    partnership: "Partnership",
    privateLimited: "Private limited company",
    publicLimited: "Public limited company",
    llp: "Limited liability partnership (LLP)",
    other: "Other",

    selectCategory: "Select a category",
    appliances: "Home appliances",
    electronics: "Electronics & accessories",
    furniture: "Furniture & home decor",
    fashion: "Fashion & clothing",
    sports: "Sports & fitness",
    tools: "Tools & spare parts",
    groceries: "Daily essentials",
    otherCategory: "Other products",

    gstPlaceholder: "Enter GST number (if applicable)",
    panPlaceholder: "Enter PAN number",
    addressPlaceholder: "Street, building, area",
    productsPlaceholder: "Describe the products you sell",
    brandsPlaceholder: "Brand names, separated by commas",
    productDescriptionPlaceholder:
      "Describe products, quality, and specialities",
    minimumOrderPlaceholder: "e.g. 500",
    deliveryRadiusPlaceholder:
      "e.g. Within 20 km / Andhra Pradesh",
    shippingMethodPlaceholder: "Select shipping method",
    ownDelivery: "Own delivery team",
    courier: "Courier / logistics partner",
    both: "Both",
    pickup: "Customer pickup",
    returnPolicyPlaceholder: "Describe your return policy",

    selectIdType: "Select identity document",
    aadhaar: "Aadhaar card",
    panCard: "PAN card",
    passport: "Passport",
    drivingLicense: "Driving licence",
    voterId: "Voter ID",
    idNumberPlaceholder: "Enter document number",

    uploadHint: "Click to upload or drag a file here",
    uploadFormats: "PDF, JPG or PNG · Maximum 5 MB",
    uploaded: "Uploaded",

    bankNamePlaceholder: "Enter bank name",
    accountHolderPlaceholder: "As printed on your bank account",
    accountNumberPlaceholder: "Enter account number",
    confirmAccountNumberPlaceholder: "Re-enter account number",
    ifscPlaceholder: "e.g. SBIN0001234",
    branchNamePlaceholder: "Enter branch name",
    passwordPlaceholder: "At least 8 characters",
    confirmPasswordPlaceholder: "Re-enter your password",
    showPassword: "Show password",
    hidePassword: "Hide password",

    securityNote: "Your information is handled securely.",
    successTitle: "Registration submitted!",
    successDescription:
      "Thank you for applying to become a NeedOneService vendor. Your details have been submitted for review.",
    successNote:
      "Our team will review your application and contact you using the details you provided.",
    startAgain: "Register another vendor",
    applicationSummary: "Application summary",
    vendorName: "Contact person",
    vendorBusiness: "Business",
    vendorEmail: "Email",
    vendorLocation: "Location",

    uploadBusiness:
      "Upload a business registration document (optional)",
    stepContact: "Contact",
    stepBusiness: "Business",
    stepProducts: "Products",
    stepDelivery: "Delivery",
    stepVerification: "Verification",
    stepBank: "Bank & security",
  },

  te: {
    pageEyebrow: "వెండర్ భాగస్వామ్య కార్యక్రమం",
    pageTitle: "NeedOneServiceతో మీ వ్యాపారాన్ని అభివృద్ధి చేయండి",
    pageDescription:
      "మా వెండర్ నెట్‌వర్క్‌లో చేరి మరింత మంది కస్టమర్లను చేరుకోండి.",

    language: "భాష",
    english: "English",
    telugu: "తెలుగు",
    hindi: "हिन्दी",
    alreadyRegistered: "ఇప్పటికే నమోదు చేసుకున్నారా?",
    signIn: "లాగిన్",

    login: "లాగిన్",
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
    mobile: "మొబైల్ నంబర్",
    email: "ఇమెయిల్ చిరునామా",
    alternateMobile: "ప్రత్యామ్నాయ మొబైల్ నంబర్",

    businessTitle: "మీ వ్యాపారం గురించి చెప్పండి",
    businessName: "వ్యాపార పేరు",
    businessType: "వ్యాపార రకం",
    businessCategory: "వ్యాపార వర్గం",
    gstNumber: "GST నంబర్",
    panNumber: "PAN నంబర్",
    businessAddress: "వ్యాపార చిరునామా",
    city: "నగరం",
    state: "రాష్ట్రం",
    pincode: "పిన్ కోడ్",

    productsTitle: "మీరు ఏమి విక్రయిస్తారు?",
    products: "విక్రయించే ఉత్పత్తులు",
    productBrands: "బ్రాండ్లు",
    productDescription: "ఉత్పత్తుల వివరణ",
    minimumOrder: "కనీస ఆర్డర్ విలువ (₹)",

    deliveryTitle: "డెలివరీ మరియు రిటర్న్స్",
    deliveryAvailable: "మీరు డెలివరీ అందిస్తారా?",
    deliveryRadius: "డెలివరీ పరిధి",
    shippingMethod: "రవాణా విధానం",
    returnPolicy: "రిటర్న్ విధానం",

    verificationTitle: "మీ గుర్తింపు మరియు వ్యాపారాన్ని ధృవీకరించండి",
    idType: "గుర్తింపు పత్రం రకం",
    idNumber: "గుర్తింపు పత్రం నంబర్",
    idDocument: "గుర్తింపు పత్రం",
    businessDocument: "వ్యాపార నమోదు పత్రం",

    bankTitle: "చెల్లింపులు మరియు ఖాతా భద్రత",
    bankName: "బ్యాంక్ పేరు",
    accountHolder: "ఖాతాదారుని పేరు",
    accountNumber: "ఖాతా నంబర్",
    confirmAccountNumber: "ఖాతా నంబర్ నిర్ధారణ",
    ifscCode: "IFSC కోడ్",
    branchName: "బ్యాంక్ శాఖ",
    password: "పాస్‌వర్డ్ సృష్టించండి",
    confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి",

    agreeTerms: "నిబంధనలు మరియు షరతులకు అంగీకరిస్తున్నాను.",
    agreePrivacy: "వెండర్ నమోదు కోసం నా సమాచార వినియోగానికి అంగీకరిస్తున్నాను.",

    back: "వెనక్కి",
    next: "సేవ్ చేసి కొనసాగించండి",
    submit: "నమోదు సమర్పించండి",
    submitting: "సమర్పిస్తోంది...",

    required: "ఈ వివరాన్ని తప్పనిసరిగా నమోదు చేయాలి.",
    requiredFields: "కొనసాగించే ముందు అవసరమైన వివరాలను పూర్తి చేయండి.",
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

    yes: "అవును",
    no: "కాదు",
    optional: "ఐచ్ఛికం",
    selectOption: "ఒక ఎంపికను ఎంచుకోండి",
    selectBusinessType: "వ్యాపార రకాన్ని ఎంచుకోండి",

    individual: "వ్యక్తిగత / ఏకైక యజమాని",
    partnership: "భాగస్వామ్య సంస్థ",
    privateLimited: "ప్రైవేట్ లిమిటెడ్ కంపెనీ",
    publicLimited: "పబ్లిక్ లిమిటెడ్ కంపెనీ",
    llp: "LLP",
    other: "ఇతర",

    selectCategory: "వర్గాన్ని ఎంచుకోండి",
    appliances: "గృహోపకరణాలు",
    electronics: "ఎలక్ట్రానిక్స్ మరియు యాక్సెసరీలు",
    furniture: "ఫర్నిచర్ మరియు గృహ అలంకరణ",
    fashion: "ఫ్యాషన్ మరియు దుస్తులు",
    sports: "క్రీడలు మరియు ఫిట్‌నెస్",
    tools: "పరికరాలు మరియు విడిభాగాలు",
    groceries: "రోజువారీ అవసరాలు",
    otherCategory: "ఇతర ఉత్పత్తులు",

    uploadHint: "ఫైల్ అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి",
    uploadFormats: "PDF, JPG లేదా PNG · గరిష్ఠంగా 5 MB",
    uploaded: "అప్‌లోడ్ అయింది",

    securityNote: "మీ సమాచారం సురక్షితంగా నిర్వహించబడుతుంది.",
    successTitle: "నమోదు సమర్పించబడింది!",
    successDescription: "మీ వెండర్ దరఖాస్తు పరిశీలనకు పంపబడింది.",
    successNote: "మా బృందం మీ దరఖాస్తును పరిశీలించి సంప్రదిస్తుంది.",
    startAgain: "మరో వెండర్‌ను నమోదు చేయండి",
    applicationSummary: "దరఖాస్తు సారాంశం",
    vendorName: "సంప్రదింపు వ్యక్తి",
    vendorBusiness: "వ్యాపారం",
    vendorEmail: "ఇమెయిల్",
    vendorLocation: "ప్రాంతం",

    stepContact: "సంప్రదింపు",
    stepBusiness: "వ్యాపారం",
    stepProducts: "ఉత్పత్తులు",
    stepDelivery: "డెలివరీ",
    stepVerification: "ధృవీకరణ",
    stepBank: "బ్యాంక్ మరియు భద్రత",
  },

  hi: {
    pageEyebrow: "विक्रेता साझेदारी कार्यक्रम",
    pageTitle: "NeedOneService के साथ अपना व्यवसाय बढ़ाएँ",
    pageDescription:
      "हमारे विक्रेता नेटवर्क से जुड़ें और अधिक ग्राहकों तक पहुँचें।",

    language: "भाषा",
    english: "English",
    telugu: "తెలుగు",
    hindi: "हिन्दी",
    alreadyRegistered: "पहले से पंजीकृत हैं?",
    signIn: "साइन इन",

    login: "साइन इन",
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
    mobile: "मोबाइल नंबर",
    email: "ईमेल पता",
    alternateMobile: "वैकल्पिक मोबाइल नंबर",

    businessTitle: "अपने व्यवसाय के बारे में बताएँ",
    businessName: "व्यवसाय का नाम",
    businessType: "व्यवसाय का प्रकार",
    businessCategory: "व्यवसाय श्रेणी",
    gstNumber: "GST नंबर",
    panNumber: "PAN नंबर",
    businessAddress: "व्यवसाय का पता",
    city: "शहर",
    state: "राज्य",
    pincode: "पिन कोड",

    productsTitle: "आप क्या बेचते हैं?",
    products: "आपके उत्पाद",
    productBrands: "आपके ब्रांड",
    productDescription: "उत्पाद विवरण",
    minimumOrder: "न्यूनतम ऑर्डर मूल्य (₹)",

    deliveryTitle: "डिलीवरी और वापसी",
    deliveryAvailable: "क्या आप डिलीवरी देते हैं?",
    deliveryRadius: "डिलीवरी क्षेत्र",
    shippingMethod: "शिपिंग का तरीका",
    returnPolicy: "वापसी नीति",

    verificationTitle: "अपनी पहचान और व्यवसाय सत्यापित करें",
    idType: "पहचान दस्तावेज़ का प्रकार",
    idNumber: "पहचान दस्तावेज़ नंबर",
    idDocument: "पहचान दस्तावेज़",
    businessDocument: "व्यवसाय पंजीकरण दस्तावेज़",

    bankTitle: "भुगतान और खाता सुरक्षा",
    bankName: "बैंक का नाम",
    accountHolder: "खाताधारक का नाम",
    accountNumber: "खाता नंबर",
    confirmAccountNumber: "खाता नंबर की पुष्टि करें",
    ifscCode: "IFSC कोड",
    branchName: "बैंक शाखा",
    password: "पासवर्ड बनाएँ",
    confirmPassword: "पासवर्ड की पुष्टि करें",

    agreeTerms: "मैं नियम और शर्तों से सहमत हूँ।",
    agreePrivacy: "मैं विक्रेता पंजीकरण के लिए अपनी जानकारी के उपयोग से सहमत हूँ।",

    back: "वापस",
    next: "सेव करें और आगे बढ़ें",
    submit: "पंजीकरण जमा करें",
    submitting: "जमा किया जा रहा है...",

    required: "यह फ़ील्ड आवश्यक है।",
    requiredFields: "आगे बढ़ने से पहले सभी आवश्यक विवरण भरें।",
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
    invalidFile: "PDF, JPG या PNG फ़ाइल अपलोड करें.",

    yes: "हाँ",
    no: "नहीं",
    optional: "वैकल्पिक",
    selectOption: "एक विकल्प चुनें",
    selectBusinessType: "व्यवसाय का प्रकार चुनें",

    individual: "व्यक्तिगत / एकल स्वामित्व",
    partnership: "साझेदारी",
    privateLimited: "प्राइवेट लिमिटेड कंपनी",
    publicLimited: "पब्लिक लिमिटेड कंपनी",
    llp: "LLP",
    other: "अन्य",

    selectCategory: "श्रेणी चुनें",
    appliances: "घरेलू उपकरण",
    electronics: "इलेक्ट्रॉनिक्स और एक्सेसरीज़",
    furniture: "फर्नीचर और घर की सजावट",
    fashion: "फैशन और कपड़े",
    sports: "खेल और फिटनेस",
    tools: "औज़ार और स्पेयर पार्ट्स",
    groceries: "दैनिक आवश्यक वस्तुएँ",
    otherCategory: "अन्य उत्पाद",

    uploadHint: "फ़ाइल अपलोड करने के लिए क्लिक करें",
    uploadFormats: "PDF, JPG या PNG · अधिकतम 5 MB",
    uploaded: "अपलोड हो गया",

    securityNote: "आपकी जानकारी सुरक्षित रूप से संभाली जाती है।",
    successTitle: "पंजीकरण जमा हो गया!",
    successDescription: "आपका विक्रेता आवेदन समीक्षा के लिए जमा कर दिया गया है।",
    successNote: "हमारी टीम आपके आवेदन की समीक्षा करके संपर्क करेगी।",
    startAgain: "दूसरे विक्रेता का पंजीकरण करें",
    applicationSummary: "आवेदन सारांश",
    vendorName: "संपर्क व्यक्ति",
    vendorBusiness: "व्यवसाय",
    vendorEmail: "ईमेल",
    vendorLocation: "स्थान",

    stepContact: "संपर्क",
    stepBusiness: "व्यवसाय",
    stepProducts: "उत्पाद",
    stepDelivery: "डिलीवरी",
    stepVerification: "सत्यापन",
    stepBank: "बैंक और सुरक्षा",
  },
};

const placeholders: Partial<Record<keyof FormData, string>> = {
  fullName: "Enter your full name",
  mobile: "10-digit mobile number",
  email: "you@example.com",
  alternateMobile: "Optional alternate number",
  businessName: "Enter your registered business name",
  gstNumber: "Enter GST number (if applicable)",
  panNumber: "Enter PAN number",
  businessAddress: "Street, building, area",
  city: "Enter city",
  state: "Enter state",
  pincode: "6-digit PIN code",
  products: "Select or describe the products you sell",
  productBrands: "Enter brand names, separated by commas",
  productDescription: "Describe your products, quality, and specialities",
  minimumOrder: "e.g. 500",
  deliveryRadius: "e.g. Within 20 km / Andhra Pradesh",
  returnPolicy: "Describe your return or replacement policy",
  idNumber: "Enter document number",
  bankName: "Enter bank name",
  accountHolder: "As printed on your bank account",
  accountNumber: "Enter account number",
  confirmAccountNumber: "Re-enter account number",
  ifscCode: "e.g. SBIN0001234",
  branchName: "Enter branch name",
  password: "At least 8 characters",
  confirmPassword: "Re-enter your password",
};

export default function VendorRegisterPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = (key: string) => dict[language][key] ?? dict.en[key] ?? key;

  const update = (
    name: keyof FormData,
    value: string | boolean | File | null,
  ) => {
    setData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setGeneralError("");
  };

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    update(e.target.name as keyof FormData, e.target.value);
  };

  const validate = (currentStep: number) => {
    const nextErrors: Record<string, string> = {};

    const required = (key: keyof FormData) => {
      const value = data[key];
      if (typeof value === "string" && !value.trim()) {
        nextErrors[key] = t("required");
      }
    };

    if (currentStep === 0) {
      (["fullName", "mobile", "email"] as const).forEach(required);

      if (data.mobile && !/^[6-9]\d{9}$/.test(data.mobile.trim())) {
        nextErrors.mobile = t("invalidMobile");
      }

      if (
        data.alternateMobile &&
        !/^[6-9]\d{9}$/.test(data.alternateMobile.trim())
      ) {
        nextErrors.alternateMobile = t("invalidMobile");
      }

      if (
        data.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
      ) {
        nextErrors.email = t("invalidEmail");
      }
    }

    if (currentStep === 1) {
      (
        [
          "businessName",
          "businessType",
          "businessCategory",
          "businessAddress",
          "city",
          "state",
          "pincode",
        ] as const
      ).forEach(required);

      if (data.pincode && !/^\d{6}$/.test(data.pincode.trim())) {
        nextErrors.pincode = t("invalidPincode");
      }

      if (data.panNumber && !/^[A-Z]{5}\d{4}[A-Z]$/i.test(data.panNumber.trim())) {
        nextErrors.panNumber = t("invalidPan");
      }

      if (
        data.gstNumber &&
        !/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]$/i.test(
          data.gstNumber.trim(),
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

      if (data.deliveryAvailable === "yes") {
        required("deliveryRadius");
        required("shippingMethod");
      }
    }

    if (currentStep === 4) {
      required("idType");
      required("idNumber");

      if (!data.idDocument) {
        nextErrors.idDocument = t("required");
      }
    }

    if (currentStep === 5) {
      (
        [
          "bankName",
          "accountHolder",
          "accountNumber",
          "confirmAccountNumber",
          "ifscCode",
          "password",
          "confirmPassword",
        ] as const
      ).forEach(required);

      if (
        data.accountNumber &&
        data.confirmAccountNumber &&
        data.accountNumber !== data.confirmAccountNumber
      ) {
        nextErrors.confirmAccountNumber = t("accountMismatch");
      }

      if (
        data.ifscCode &&
        !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(data.ifscCode.trim())
      ) {
        nextErrors.ifscCode = t("invalidIfsc");
      }

      if (data.password && data.password.length < 8) {
        nextErrors.password = t("passwordLength");
      }

      if (
        data.password &&
        data.confirmPassword &&
        data.password !== data.confirmPassword
      ) {
        nextErrors.confirmPassword = t("passwordMismatch");
      }

      if (!data.terms || !data.privacy) {
        nextErrors.terms = t("termsRequired");
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    if (!validate(step)) {
      setGeneralError(t("requiredFields"));
      return;
    }

    setGeneralError("");
    setStep((current) => Math.min(5, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setErrors({});
    setGeneralError("");
    setStep((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fileChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: "idDocument" | "businessDocument",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      setErrors((previous) => ({ ...previous, [key]: t("invalidFile") }));
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({ ...previous, [key]: t("fileTooLarge") }));
      e.target.value = "";
      return;
    }

    update(key, file);
  };

  const field = (
    name: keyof FormData,
    options: { type?: string; textarea?: boolean; optional?: boolean } = {},
  ) => {
    const value = data[name];

    return (
      <div className="vendor-form-group" key={name}>
        <label className="vendor-label" htmlFor={name}>
          {t(name)}
          {options.optional && (
            <span className="vendor-optional"> ({t("optional")})</span>
          )}
        </label>

        {options.textarea ? (
          <textarea
            id={name}
            name={name}
            className={`vendor-input vendor-textarea ${
              errors[name] ? "vendor-input-error" : ""
            }`}
            placeholder={placeholders[name] ?? t(name)}
            value={String(value ?? "")}
            onChange={onChange}
            rows={3}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={options.type ?? "text"}
            className={`vendor-input ${
              errors[name] ? "vendor-input-error" : ""
            }`}
            placeholder={placeholders[name] ?? t(name)}
            value={String(value ?? "")}
            onChange={onChange}
          />
        )}

        {errors[name] && (
          <span className="vendor-error-text">{errors[name]}</span>
        )}
      </div>
    );
  };

  const select = (
    name: keyof FormData,
    options: [string, string][],
    placeholder?: string,
  ) => (
    <div className="vendor-form-group" key={name}>
      <label className="vendor-label" htmlFor={name}>
        {t(name)}
      </label>

      <select
        id={name}
        name={name}
        className={`vendor-input vendor-select ${
          errors[name] ? "vendor-input-error" : ""
        }`}
        value={String(data[name] ?? "")}
        onChange={onChange}
      >
        <option value="">{t(placeholder ?? "selectOption")}</option>
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {t(label)}
          </option>
        ))}
      </select>

      {errors[name] && (
        <span className="vendor-error-text">{errors[name]}</span>
      )}
    </div>
  );

  const fileField = (name: "idDocument" | "businessDocument") => (
    <div className="vendor-form-group" key={name}>
      <label className="vendor-label" htmlFor={name}>
        {t(name)}
        {name === "businessDocument" && (
          <span className="vendor-optional"> ({t("optional")})</span>
        )}
      </label>

      <label className="vendor-upload-box" htmlFor={name}>
        {data[name] ? (
          <>
            <CheckCircle2 size={22} />
            <span className="vendor-upload-name">{data[name]?.name}</span>
            <span className="vendor-uploaded">{t("uploaded")}</span>
          </>
        ) : (
          <>
            <Upload size={23} />
            <span>{t("uploadHint")}</span>
            <small>{t("uploadFormats")}</small>
          </>
        )}
      </label>

      <input
        id={name}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        className="vendor-file-input"
        onChange={(e) => fileChange(e, name)}
      />

      {errors[name] && (
        <span className="vendor-error-text">{errors[name]}</span>
      )}
    </div>
  );

  const password = (
    name: "password" | "confirmPassword",
    visible: boolean,
    toggle: () => void,
  ) => (
    <div className="vendor-form-group" key={name}>
      <label className="vendor-label" htmlFor={name}>
        {t(name)}
      </label>

      <div className="vendor-password-wrap">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          className={`vendor-input ${
            errors[name] ? "vendor-input-error" : ""
          }`}
          placeholder={placeholders[name]}
          value={data[name]}
          onChange={onChange}
          autoComplete="new-password"
        />

        <button
          type="button"
          className="vendor-password-toggle"
          aria-label={visible ? t("hidePassword") : t("showPassword")}
          onClick={toggle}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>

      {errors[name] && (
        <span className="vendor-error-text">{errors[name]}</span>
      )}
    </div>
  );

  let content: ReactNode;

  switch (step) {
    case 0:
      content = (
        <>
          <Heading
            kicker="stepContact"
            title="contactTitle"
            desc="contactDescription"
            t={t}
          />
          <div className="vendor-form-grid">
            {field("fullName")}
            {field("mobile", { type: "tel" })}
            {field("email", { type: "email" })}
            {field("alternateMobile", { type: "tel", optional: true })}
          </div>
        </>
      );
      break;

    case 1:
      content = (
        <>
          <Heading
            kicker="stepBusiness"
            title="businessTitle"
            desc="businessTitle"
            t={t}
          />
          <div className="vendor-form-grid">
            {field("businessName")}
            {select(
              "businessType",
              [
                ["individual", "individual"],
                ["partnership", "partnership"],
                ["private-limited", "privateLimited"],
                ["public-limited", "publicLimited"],
                ["llp", "llp"],
                ["other", "other"],
              ],
              "selectBusinessType",
            )}
            {select(
              "businessCategory",
              [
                ["appliances", "appliances"],
                ["electronics", "electronics"],
                ["furniture", "furniture"],
                ["fashion", "fashion"],
                ["sports", "sports"],
                ["tools", "tools"],
                ["groceries", "groceries"],
                ["other", "otherCategory"],
              ],
              "selectCategory",
            )}
            {field("gstNumber", { optional: true })}
            {field("panNumber", { optional: true })}
            {field("businessAddress")}
            {field("city")}
            {field("state")}
            {field("pincode")}
          </div>
        </>
      );
      break;

    case 2:
      content = (
        <>
          <Heading
            kicker="stepProducts"
            title="productsTitle"
            desc="productsTitle"
            t={t}
          />
          <div className="vendor-form-grid">
            {field("products", { textarea: true })}
            {field("productBrands", { optional: true })}
            {field("productDescription", { textarea: true })}
            {field("minimumOrder", { type: "number", optional: true })}
          </div>
        </>
      );
      break;

    case 3:
      content = (
        <>
          <Heading
            kicker="stepDelivery"
            title="deliveryTitle"
            desc="deliveryTitle"
            t={t}
          />
          <div className="vendor-form-grid">
            <div className="vendor-form-group vendor-full-width">
              <span className="vendor-label">{t("deliveryAvailable")}</span>

              <div className="vendor-choice-row">
                {["yes", "no"].map((value) => (
                  <label className="vendor-choice" key={value}>
                    <input
                      type="radio"
                      name="deliveryAvailable"
                      value={value}
                      checked={data.deliveryAvailable === value}
                      onChange={onChange}
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

            {data.deliveryAvailable === "yes" && (
              <>
                {field("deliveryRadius")}
                {select(
                  "shippingMethod",
                  [
                    ["own", "ownDelivery"],
                    ["courier", "courier"],
                    ["both", "both"],
                    ["pickup", "pickup"],
                  ],
                  "shippingMethodPlaceholder",
                )}
              </>
            )}

            {field("returnPolicy", { textarea: true, optional: true })}
          </div>
        </>
      );
      break;

    case 4:
      content = (
        <>
          <Heading
            kicker="stepVerification"
            title="verificationTitle"
            desc="verificationTitle"
            t={t}
          />
          <div className="vendor-form-grid">
            {select(
              "idType",
              [
                ["aadhaar", "aadhaar"],
                ["pan", "panCard"],
                ["passport", "passport"],
                ["driving-license", "drivingLicense"],
                ["voter-id", "voterId"],
              ],
              "selectIdType",
            )}
            {field("idNumber")}
            {fileField("idDocument")}
            {fileField("businessDocument")}
          </div>

          <div className="vendor-info-note">
            <ShieldCheck size={18} />
            <span>{t("securityNote")}</span>
          </div>
        </>
      );
      break;

    default:
      content = (
        <>
          <Heading
            kicker="stepBank"
            title="bankTitle"
            desc="bankTitle"
            t={t}
          />

          <div className="vendor-form-grid">
            {field("bankName")}
            {field("accountHolder")}
            {field("accountNumber")}
            {field("confirmAccountNumber")}
            {field("ifscCode")}
            {field("branchName", { optional: true })}
            {password("password", showPassword, () =>
              setShowPassword((value) => !value),
            )}
            {password("confirmPassword", showConfirm, () =>
              setShowConfirm((value) => !value),
            )}
          </div>

          <div className="vendor-consent-list">
            <label className="vendor-consent">
              <input
                type="checkbox"
                checked={data.terms}
                onChange={(e) => update("terms", e.target.checked)}
              />
              <span>{t("agreeTerms")}</span>
            </label>

            <label className="vendor-consent">
              <input
                type="checkbox"
                checked={data.privacy}
                onChange={(e) => update("privacy", e.target.checked)}
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

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate(5)) {
      setGeneralError(t("requiredFields"));
      return;
    }

    setSubmitting(true);
    setGeneralError("");

    try {
      // Replace this demonstration delay with your registration API call.
      await new Promise((resolve) => window.setTimeout(resolve, 400));
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setGeneralError("Unable to submit registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const languagePicker = (
    <div className="vendor-language-switcher">
      <Globe size={16} />
      <label htmlFor="vendor-language">{t("language")}</label>

      <select
        id="vendor-language"
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="vendor-language-select"
      >
        <option value="en">English</option>
        <option value="te">తెలుగు</option>
        <option value="hi">हिन्दी</option>
      </select>
    </div>
  );

  // Reusable header actions: language selector + sign-in prompt.
  const headerActions = (
    <div className="vendor-header-actions">
      {languagePicker}

      <p className="partner-signin">
        {t("alreadyRegistered")}{" "}
        <Link to="/login">{t("signIn")}</Link>
      </p>
    </div>
  );

  if (submitted) {
    return (
      <main className="vendor-register-page">
        <div className="vendor-wizard">
          <header className="vendor-register-header vendor-success-header">
            {headerActions}
          </header>

          <section className="vendor-register-card vendor-success-card">
            <div className="vendor-success-icon">
              <CheckCircle2 size={42} />
            </div>

            <span className="vendor-eyebrow">{t("pageEyebrow")}</span>
            <h1>{t("successTitle")}</h1>
            <p className="vendor-success-description">
              {t("successDescription")}
            </p>

            <div className="vendor-summary">
              <h3>{t("applicationSummary")}</h3>
              <p>
                <strong>{t("vendorName")}:</strong> {data.fullName}
              </p>
              <p>
                <strong>{t("vendorBusiness")}:</strong> {data.businessName}
              </p>
              <p>
                <strong>{t("vendorEmail")}:</strong> {data.email}
              </p>
              <p>
                <strong>{t("vendorLocation")}:</strong>{" "}
                {[data.city, data.state, data.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <p className="vendor-success-note">{t("successNote")}</p>

            <button
              type="button"
              className="vendor-primary-button"
              onClick={() => {
                setData(initial);
                setErrors({});
                setStep(0);
                setSubmitted(false);
                setGeneralError("");
              }}
            >
              {t("startAgain")}
              <ArrowRight size={17} />
            </button>
          </section>
        </div>
      </main>
    );
  }

  const ActiveIcon = icons[step];

  return (
    <main className="vendor-register-page">
      <div className="vendor-wizard">
        <header className="vendor-register-header">
          <div className="vendor-header-topline">
            <div className="vendor-brand" aria-hidden="true" />
            {headerActions}
          </div>

          <div className="vendor-header-copy">
            <span className="vendor-eyebrow">{t("pageEyebrow")}</span>
            <h1>{t("pageTitle")}</h1>
            <p>{t("pageDescription")}</p>
          </div>
        </header>

        <section className="vendor-register-card">
          <div className="vendor-progress-header">
            <div className="vendor-progress-copy">
              <span>
                {t("step")} {step + 1} {t("of")} 6
              </span>
              <strong>{t(steps[step])}</strong>
            </div>

            <span className="vendor-progress-percentage">
              {Math.round(((step + 1) / 6) * 100)}%
            </span>
          </div>

          <div className="vendor-progress-track" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={6}>
            <div
              className="vendor-progress-fill"
              style={{ width: `${((step + 1) / 6) * 100}%` }}
            />
          </div>

          <nav className="vendor-step-navigation" aria-label="Registration steps">
            {steps.map((key, index) => {
              const done = index < step;
              const active = index === step;

              return (
                <button
                  type="button"
                  key={key}
                  className={`vendor-step-indicator ${
                    active ? "active" : ""
                  } ${done ? "completed" : ""}`}
                  disabled={index >= step}
                  onClick={() => {
                    setStep(index);
                    setErrors({});
                    setGeneralError("");
                  }}
                  aria-current={active ? "step" : undefined}
                >
                  <span className="vendor-step-icon">
                    {done ? <Check size={15} /> : index + 1}
                  </span>
                  <span className="vendor-step-label">{t(key)}</span>
                </button>
              );
            })}
          </nav>

          <form onSubmit={submit} noValidate>
            <div className="vendor-form-content">
              <div className="vendor-current-step-icon">
                <ActiveIcon size={22} />
              </div>

              {content}

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
                    onClick={back}
                  >
                    <ArrowLeft size={17} />
                    {t("back")}
                  </button>
                ) : (
                  <span />
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    className="vendor-primary-button"
                    onClick={next}
                  >
                    {t("next")}
                    <ArrowRight size={17} />
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
                      <CheckCircle2 size={17} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </section>

        <footer className="vendor-register-footer">
          <LockKeyhole size={14} />
          <span>{t("securityNote")}</span>
        </footer>
      </div>
    </main>
  );
}

function Heading({
  kicker,
  title,
  desc,
  t,
}: {
  kicker: string;
  title: string;
  desc: string;
  t: (key: string) => string;
}) {
  return (
    <div className="vendor-step-heading">
      <span className="vendor-section-kicker">{t(kicker)}</span>
      <h2>{t(title)}</h2>
      <p>{t(desc)}</p>
    </div>
  );
}
