
import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  FileText,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Upload,
  UserRound,
  Languages,
  ShieldCheck,
} from "lucide-react";
import "./PartnerRegisterPage.css";

type Language = "en" | "te" | "hi";

type SellerFormData = {
  contactName: string;
  designation: string;
  mobile: string;
  whatsapp: string;
  email: string;
  sellerType: string;
  businessName: string;
  businessType: string;
  yearEstablished: string;
  website: string;
  categories: string[];
  brands: string;
  products: string;
  productCondition: string;
  authorizedSeller: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  deliveryCoverage: string;
  dispatchTime: string;
  inventory: string;
  returnPolicy: string;
  panNumber: string;
  gstNumber: string;
  businessRegistration: File | null;
  panDocument: File | null;
  gstDocument: File | null;
  addressProof: File | null;
  brandAuthorizationDocument: File | null;
  productCatalogue: File | null;
  password: string;
  confirmPassword: string;
  terms: boolean;
  verificationConsent: boolean;
  productAuthenticityConsent: boolean;
};

const translations = {
  en: {
    translate: "Translate",
    english: "English",
    telugu: "Telugu",
    hindi: "Hindi",
    network: "SELLER NETWORK",
    signIn: "Already registered?",
    login: "Sign in",
    eyebrow: "PRODUCT & SPARE-PARTS SELLER REGISTRATION",
    heading: "Grow your sales with",
    brand: "NeedOneService.",
    intro: "Register your business to sell products and spare parts through NeedOneService.",
    secure: "Secure registration",
    steps: [
      ["Contact", "Your contact details"],
      ["Business", "Seller and business details"],
      ["Products", "Products and authenticity"],
      ["Fulfilment", "Stock, shipping and returns"],
      ["Documents", "Business verification"],
      ["Security", "Account and consent"],
    ],
    step: "STEP",
    of: "OF",
    completed: "completed",
    contactTitle: "Seller contact information",
    contactDesc: "Who owns the business and should we contact?",
    fullName: "Owner / contact person's full name *",
    designation: "Designation",
    mobile: "Mobile number *",
    whatsapp: "WhatsApp number",
    email: "Business email address *",
    businessTitle: "Business and seller profile",
    businessDesc: "Tell us who you are and how your business operates.",
    sellerType: "Seller type *",
    chooseSeller: "Select seller type",
    manufacturer: "Manufacturer",
    wholesaler: "Wholesaler",
    distributor: "Distributor",
    retailer: "Retailer",
    authorizedDealer: "Authorized dealer",
    importer: "Importer",
    other: "Other",
    businessName: "Registered business / store name *",
    legalType: "Legal business structure *",
    chooseType: "Select business structure",
    sole: "Sole proprietorship",
    partnership: "Partnership",
    privateLimited: "Private limited company",
    llp: "LLP",
    individual: "Individual seller",
    year: "Year established",
    website: "Website / online store",
    productTitle: "Products and authenticity",
    productDesc: "Tell us what you sell so we can review your catalogue.",
    categories: "Product categories *",
    brands: "Brands sold *",
    brandsHint: "List the brands you stock, separated by commas",
    products: "Products / spare parts offered *",
    productsHint: "Describe products, spare parts, model numbers or SKUs",
    condition: "Product condition *",
    chooseCondition: "Select product condition",
    new: "New products",
    refurbished: "Refurbished products",
    both: "New and refurbished",
    authorization: "Are you an authorized seller for any brand? *",
    chooseAnswer: "Select an answer",
    yes: "Yes",
    no: "No",
    catalogue: "Product catalogue / product images",
    optional: "Optional",
    locationTitle: "Stock and fulfilment",
    locationDesc: "Help customers understand where you dispatch from and how orders are handled.",
    address: "Business / dispatch address *",
    city: "City *",
    state: "State *",
    pincode: "6-digit pincode *",
    coverage: "Delivery coverage *",
    coverageHint: "Cities, states or PIN codes you can deliver to",
    dispatch: "Typical dispatch time *",
    chooseDispatch: "Select dispatch time",
    sameDay: "Same day",
    oneTwo: "1-2 business days",
    threeFive: "3-5 business days",
    overFive: "More than 5 business days",
    inventory: "Stock availability *",
    chooseInventory: "Select stock arrangement",
    ready: "Ready stock",
    orderBased: "Order-based / made to order",
    mixed: "Both ready stock and order-based",
    returns: "Return / replacement policy *",
    chooseReturns: "Select your policy",
    sevenDays: "Returns within 7 days",
    fifteenDays: "Returns within 15 days",
    replacement: "Replacement only",
    manufacturerPolicy: "Manufacturer warranty / policy",
    noReturns: "No returns (where legally permitted)",
    documentsTitle: "Seller verification",
    documentsDesc: "Upload clear documents. PDF, JPG and PNG files up to 5 MB each.",
    pan: "Business / proprietor PAN *",
    gst: "GSTIN (if applicable)",
    registration: "Business registration proof",
    panDoc: "PAN document *",
    gstDoc: "GST certificate",
    addressProof: "Business address proof *",
    brandDoc: "Brand authorization proof",
    required: "Required",
    conditional: "If applicable",
    securityTitle: "Account security and consent",
    securityDesc: "Create your account and confirm your seller obligations.",
    password: "Password *",
    confirmPassword: "Confirm password *",
    passwordHint: "Use at least 8 characters",
    confirmHint: "Re-enter your password",
    reviewTitle: "Ready to submit your seller application?",
    reviewDesc: "NeedOneService may review your identity, business, products and supporting documents before activating your seller account.",
    terms: "I agree to the",
    termsLink: "Terms & Conditions",
    privacy: "Privacy Policy",
    verification: "I authorize NeedOneService to verify my submitted business details and documents.",
    authenticity: "I confirm that my products are genuine, lawfully sourced and accurately described, and that I will not list counterfeit or misleading products.",
    back: "Back",
    save: "Save & Continue",
    submit: "Submit Application",
    submitting: "Submitting...",
    safe: "Your details should be handled securely",
    help: "Need help with registration?",
    contactUs: "Contact our team",
    successEyebrow: "APPLICATION RECEIVED",
    successTitle: "Thank you for registering with NeedOneService.",
    successDesc: "Your seller application has been recorded in this demo. Actual registration, document verification and account creation require a connected backend.",
    business: "Business",
    contact: "Contact",
    backHome: "Back to Home",
    loginButton: "Go to Login",
    fileChoose: "Choose a file",
    browse: "Browse",
    change: "Change",
    maxSize: "PDF, JPG or PNG · Max 5 MB",
    fileSizeError: "Each file must be smaller than 5 MB.",
    invalidMobile: "Enter a valid 10-digit Indian mobile number.",
    invalidEmail: "Enter a valid email address.",
    invalidYear: "Enter a valid year of establishment.",
    invalidWebsite: "Enter a valid website URL beginning with https:// or http://.",
    requiredContact: "Enter the contact person's name.",
    requiredSeller: "Select your seller type.",
    requiredBusiness: "Enter your business name.",
    requiredLegalType: "Select your legal business structure.",
    requiredCategories: "Select at least one product category.",
    requiredBrands: "Enter at least one brand you sell.",
    requiredProducts: "Describe the products or spare parts you sell.",
    requiredCondition: "Select the product condition.",
    requiredAuthorization: "Answer the brand authorization question.",
    requiredAddress: "Enter your business / dispatch address.",
    requiredCity: "Enter your city.",
    requiredState: "Enter your state.",
    invalidPincode: "Enter a valid 6-digit pincode.",
    requiredCoverage: "Enter your delivery coverage.",
    requiredDispatch: "Select your typical dispatch time.",
    requiredInventory: "Select your stock arrangement.",
    requiredReturns: "Select your return policy.",
    invalidPan: "Enter a valid PAN number.",
    invalidGST: "Enter a valid GSTIN or leave it blank if not applicable.",
    requiredPanDoc: "Upload your PAN document.",
    requiredAddressProof: "Upload your business address proof.",
    requiredRegistration: "Upload business registration proof for this business structure.",
    requiredBrandDoc: "Upload brand authorization proof or change your answer if it does not apply.",
    requiredPassword: "Password must contain at least 8 characters.",
    passwordMismatch: "Passwords do not match.",
    requiredTerms: "Accept the Terms & Conditions and Privacy Policy.",
    requiredVerification: "Provide consent for business verification.",
    requiredAuthenticity: "Confirm the product authenticity declaration.",
    submissionError: "Unable to submit your application. Please try again.",
    categoriesList: [
      "Home appliances",
      "AC & refrigeration spares",
      "Washing machine spares",
      "Refrigerator spares",
      "Electrical products",
      "Plumbing products",
      "Water purifier filters & spares",
      "TV & electronics",
      "Mobile & computer accessories",
      "Tools & hardware",
      "Other",
    ],
  },
  te: {
    translate: "భాష మార్చండి",
    english: "English",
    telugu: "తెలుగు",
    hindi: "హిందీ",
    network: "విక్రేతల నెట్‌వర్క్",
    signIn: "ఇప్పటికే నమోదు చేసుకున్నారా?",
    login: "సైన్ ఇన్",
    eyebrow: "ఉత్పత్తులు మరియు స్పేర్ పార్ట్స్ విక్రేత నమోదు",
    heading: "మీ అమ్మకాలను పెంచుకోండి",
    brand: "NeedOneService తో.",
    intro: "NeedOneService ద్వారా ఉత్పత్తులు మరియు స్పేర్ పార్ట్స్ విక్రయించడానికి మీ వ్యాపారాన్ని నమోదు చేయండి.",
    secure: "సురక్షిత నమోదు",
    steps: [
      ["సంప్రదింపు", "మీ సంప్రదింపు వివరాలు"],
      ["వ్యాపారం", "విక్రేత మరియు వ్యాపార వివరాలు"],
      ["ఉత్పత్తులు", "ఉత్పత్తులు మరియు ప్రామాణికత"],
      ["డెలివరీ", "స్టాక్, షిప్పింగ్ మరియు రిటర్న్స్"],
      ["పత్రాలు", "వ్యాపార ధృవీకరణ"],
      ["భద్రత", "ఖాతా మరియు సమ్మతి"],
    ],
    step: "దశ",
    of: "లో",
    completed: "పూర్తి",
    contactTitle: "విక్రేత సంప్రదింపు వివరాలు",
    contactDesc: "వ్యాపార యజమాని ఎవరు? ఎవరిని సంప్రదించాలి?",
    fullName: "యజమాని / సంప్రదింపు వ్యక్తి పూర్తి పేరు *",
    designation: "హోదా",
    mobile: "మొబైల్ నంబర్ *",
    whatsapp: "వాట్సాప్ నంబర్",
    email: "వ్యాపార ఇమెయిల్ *",
    businessTitle: "వ్యాపారం మరియు విక్రేత వివరాలు",
    businessDesc: "మీ వ్యాపారం గురించి వివరాలు నమోదు చేయండి.",
    sellerType: "విక్రేత రకం *",
    chooseSeller: "విక్రేత రకాన్ని ఎంచుకోండి",
    manufacturer: "తయారీదారు",
    wholesaler: "హోల్‌సేలర్",
    distributor: "పంపిణీదారు",
    retailer: "రిటైలర్",
    authorizedDealer: "అధీకృత డీలర్",
    importer: "దిగుమతిదారు",
    other: "ఇతర",
    businessName: "నమోదిత వ్యాపారం / స్టోర్ పేరు *",
    legalType: "వ్యాపార చట్టపరమైన నిర్మాణం *",
    chooseType: "వ్యాపార నిర్మాణాన్ని ఎంచుకోండి",
    sole: "ఏకైక యాజమాన్యం",
    partnership: "భాగస్వామ్య సంస్థ",
    privateLimited: "ప్రైవేట్ లిమిటెడ్ కంపెనీ",
    llp: "LLP",
    individual: "వ్యక్తిగత విక్రేత",
    year: "ప్రారంభించిన సంవత్సరం",
    website: "వెబ్‌సైట్ / ఆన్‌లైన్ స్టోర్",
    productTitle: "ఉత్పత్తులు మరియు ప్రామాణికత",
    productDesc: "మీ ఉత్పత్తుల వివరాలను నమోదు చేయండి.",
    categories: "ఉత్పత్తి వర్గాలు *",
    brands: "విక్రయించే బ్రాండ్లు *",
    brandsHint: "కామాలతో వేరు చేసి బ్రాండ్ల పేర్లు నమోదు చేయండి",
    products: "విక్రయించే ఉత్పత్తులు / స్పేర్ పార్ట్స్ *",
    productsHint: "ఉత్పత్తులు, స్పేర్ పార్ట్స్, మోడల్ నంబర్లు లేదా SKU వివరించండి",
    condition: "ఉత్పత్తుల స్థితి *",
    chooseCondition: "ఉత్పత్తుల స్థితిని ఎంచుకోండి",
    new: "కొత్త ఉత్పత్తులు",
    refurbished: "పునరుద్ధరించిన ఉత్పత్తులు",
    both: "కొత్త మరియు పునరుద్ధరించినవి",
    authorization: "మీరు ఏదైనా బ్రాండ్‌కు అధీకృత విక్రేతనా? *",
    chooseAnswer: "సమాధానం ఎంచుకోండి",
    yes: "అవును",
    no: "కాదు",
    catalogue: "ఉత్పత్తుల జాబితా / చిత్రాలు",
    optional: "ఐచ్ఛికం",
    locationTitle: "స్టాక్ మరియు డెలివరీ",
    locationDesc: "మీరు ఎక్కడి నుంచి పంపిస్తారు, ఆర్డర్లను ఎలా నిర్వహిస్తారు?",
    address: "వ్యాపార / పంపిణీ చిరునామా *",
    city: "నగరం *",
    state: "రాష్ట్రం *",
    pincode: "6 అంకెల పిన్‌కోడ్ *",
    coverage: "డెలివరీ పరిధి *",
    coverageHint: "డెలివరీ చేయగల నగరాలు, రాష్ట్రాలు లేదా పిన్‌కోడ్లు",
    dispatch: "సాధారణంగా పంపించే సమయం *",
    chooseDispatch: "పంపించే సమయాన్ని ఎంచుకోండి",
    sameDay: "అదే రోజు",
    oneTwo: "1–2 పని రోజులు",
    threeFive: "3–5 పని రోజులు",
    overFive: "5 పని రోజుల కంటే ఎక్కువ",
    inventory: "స్టాక్ లభ్యత *",
    chooseInventory: "స్టాక్ విధానాన్ని ఎంచుకోండి",
    ready: "సిద్ధంగా ఉన్న స్టాక్",
    orderBased: "ఆర్డర్ వచ్చిన తర్వాత తయారీ / సేకరణ",
    mixed: "రెండు విధానాలు",
    returns: "రిటర్న్ / రీప్లేస్‌మెంట్ విధానం *",
    chooseReturns: "విధానాన్ని ఎంచుకోండి",
    sevenDays: "7 రోజుల్లో రిటర్న్",
    fifteenDays: "15 రోజుల్లో రిటర్న్",
    replacement: "రీప్లేస్‌మెంట్ మాత్రమే",
    manufacturerPolicy: "తయారీదారు వారంటీ / విధానం",
    noReturns: "రిటర్న్స్ లేవు (చట్టం అనుమతించిన చోట మాత్రమే)",
    documentsTitle: "విక్రేత ధృవీకరణ",
    documentsDesc: "PDF, JPG లేదా PNG ఫైళ్లు; ఒక్కొక్కటి గరిష్ఠంగా 5 MB.",
    pan: "వ్యాపార / యజమాని PAN *",
    gst: "GSTIN (వర్తిస్తే)",
    registration: "వ్యాపార నమోదు పత్రం",
    panDoc: "PAN పత్రం *",
    gstDoc: "GST సర్టిఫికేట్",
    addressProof: "వ్యాపార చిరునామా రుజువు *",
    brandDoc: "బ్రాండ్ అధికారం పత్రం",
    required: "తప్పనిసరి",
    conditional: "వర్తిస్తే",
    securityTitle: "ఖాతా భద్రత మరియు సమ్మతి",
    securityDesc: "ఖాతా సృష్టించి విక్రేత నిబంధనలను అంగీకరించండి.",
    password: "పాస్‌వర్డ్ *",
    confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి *",
    passwordHint: "కనీసం 8 అక్షరాలు ఉపయోగించండి",
    confirmHint: "పాస్‌వర్డ్ మళ్లీ నమోదు చేయండి",
    reviewTitle: "విక్రేత దరఖాస్తును సమర్పించడానికి సిద్ధంగా ఉన్నారా?",
    reviewDesc: "ఖాతా ప్రారంభానికి ముందు NeedOneService మీ వివరాలు, ఉత్పత్తులు మరియు పత్రాలను పరిశీలించవచ్చు.",
    terms: "నేను అంగీకరిస్తున్నాను:",
    termsLink: "నిబంధనలు",
    privacy: "గోప్యతా విధానం",
    verification: "నా వ్యాపార వివరాలు మరియు పత్రాలను NeedOneService ధృవీకరించడానికి నేను అనుమతిస్తున్నాను.",
    authenticity: "నా ఉత్పత్తులు అసలైనవని, చట్టబద్ధంగా పొందినవని, సరైన వివరాలతో ఉన్నాయని ధృవీకరిస్తున్నాను.",
    back: "వెనుకకు",
    save: "కొనసాగించండి",
    submit: "దరఖాస్తు సమర్పించండి",
    submitting: "సమర్పిస్తోంది...",
    safe: "మీ వివరాలను సురక్షితంగా నిర్వహించాలి",
    help: "నమోదులో సహాయం కావాలా?",
    contactUs: "మా బృందాన్ని సంప్రదించండి",
    successEyebrow: "దరఖాస్తు స్వీకరించబడింది",
    successTitle: "NeedOneServiceలో నమోదు చేసుకున్నందుకు ధన్యవాదాలు.",
    successDesc: "ఈ డెమోలో మీ దరఖాస్తు నమోదు అయింది. నిజమైన నమోదు, పత్రాల ధృవీకరణ మరియు ఖాతా సృష్టికి బ్యాకెండ్ అవసరం.",
    business: "వ్యాపారం",
    contact: "సంప్రదింపు",
    backHome: "హోమ్‌కు తిరిగి వెళ్లండి",
    loginButton: "లాగిన్",
    fileChoose: "ఫైల్ ఎంచుకోండి",
    browse: "ఎంచుకోండి",
    change: "మార్చండి",
    maxSize: "PDF, JPG లేదా PNG · గరిష్ఠం 5 MB",
    fileSizeError: "ప్రతి ఫైల్ 5 MB కంటే చిన్నదిగా ఉండాలి.",
    invalidMobile: "సరైన 10 అంకెల భారతీయ మొబైల్ నంబర్ నమోదు చేయండి.",
    invalidEmail: "సరైన ఇమెయిల్ నమోదు చేయండి.",
    invalidYear: "సరైన ప్రారంభ సంవత్సరం నమోదు చేయండి.",
    invalidWebsite: "https:// లేదా http:// తో ప్రారంభమయ్యే సరైన వెబ్‌సైట్ నమోదు చేయండి.",
    requiredContact: "సంప్రదింపు వ్యక్తి పేరు నమోదు చేయండి.",
    requiredSeller: "విక్రేత రకాన్ని ఎంచుకోండి.",
    requiredBusiness: "వ్యాపార పేరు నమోదు చేయండి.",
    requiredLegalType: "వ్యాపార నిర్మాణాన్ని ఎంచుకోండి.",
    requiredCategories: "కనీసం ఒక ఉత్పత్తి వర్గాన్ని ఎంచుకోండి.",
    requiredBrands: "మీరు విక్రయించే బ్రాండ్లను నమోదు చేయండి.",
    requiredProducts: "విక్రయించే ఉత్పత్తులు లేదా స్పేర్ పార్ట్స్ వివరించండి.",
    requiredCondition: "ఉత్పత్తుల స్థితిని ఎంచుకోండి.",
    requiredAuthorization: "బ్రాండ్ అధికారం ప్రశ్నకు సమాధానం ఇవ్వండి.",
    requiredAddress: "వ్యాపార చిరునామా నమోదు చేయండి.",
    requiredCity: "నగరం నమోదు చేయండి.",
    requiredState: "రాష్ట్రం నమోదు చేయండి.",
    invalidPincode: "సరైన 6 అంకెల పిన్‌కోడ్ నమోదు చేయండి.",
    requiredCoverage: "డెలివరీ పరిధిని నమోదు చేయండి.",
    requiredDispatch: "పంపించే సమయాన్ని ఎంచుకోండి.",
    requiredInventory: "స్టాక్ విధానాన్ని ఎంచుకోండి.",
    requiredReturns: "రిటర్న్ విధానాన్ని ఎంచుకోండి.",
    invalidPan: "సరైన PAN నంబర్ నమోదు చేయండి.",
    invalidGST: "సరైన GSTIN నమోదు చేయండి లేదా వర్తించకపోతే ఖాళీగా ఉంచండి.",
    requiredPanDoc: "PAN పత్రాన్ని అప్‌లోడ్ చేయండి.",
    requiredAddressProof: "వ్యాపార చిరునామా రుజువును అప్‌లోడ్ చేయండి.",
    requiredRegistration: "ఈ వ్యాపార నిర్మాణానికి వ్యాపార నమోదు పత్రం అప్‌లోడ్ చేయండి.",
    requiredBrandDoc: "బ్రాండ్ అధికారం పత్రాన్ని అప్‌లోడ్ చేయండి లేదా వర్తించదని సమాధానం మార్చండి.",
    requiredPassword: "పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి.",
    passwordMismatch: "పాస్‌వర్డ్‌లు సరిపోలడం లేదు.",
    requiredTerms: "నిబంధనలు మరియు గోప్యతా విధానాన్ని అంగీకరించండి.",
    requiredVerification: "వ్యాపార ధృవీకరణకు సమ్మతి ఇవ్వండి.",
    requiredAuthenticity: "ఉత్పత్తుల ప్రామాణికత ప్రకటనను అంగీకరించండి.",
    submissionError: "దరఖాస్తును సమర్పించలేకపోయాం. మళ్లీ ప్రయత్నించండి.",
    categoriesList: [
      "గృహోపకరణాలు",
      "ఏసీ మరియు రిఫ్రిజిరేషన్ స్పేర్స్",
      "వాషింగ్ మెషీన్ స్పేర్స్",
      "రిఫ్రిజిరేటర్ స్పేర్స్",
      "ఎలక్ట్రికల్ ఉత్పత్తులు",
      "ప్లంబింగ్ ఉత్పత్తులు",
      "వాటర్ ప్యూరిఫైయర్ ఫిల్టర్లు మరియు స్పేర్స్",
      "టీవీ మరియు ఎలక్ట్రానిక్స్",
      "మొబైల్ మరియు కంప్యూటర్ యాక్సెసరీలు",
      "టూల్స్ మరియు హార్డ్‌వేర్",
      "ఇతర",
    ],
  },
  hi: {
    translate: "भाषा बदलें",
    english: "English",
    telugu: "तेलुगु",
    hindi: "हिन्दी",
    network: "विक्रेता नेटवर्क",
    signIn: "पहले से पंजीकृत हैं?",
    login: "साइन इन",
    eyebrow: "उत्पाद और स्पेयर-पार्ट्स विक्रेता पंजीकरण",
    heading: "अपनी बिक्री बढ़ाएँ",
    brand: "NeedOneService के साथ।",
    intro: "NeedOneService के माध्यम से उत्पाद और स्पेयर पार्ट्स बेचने के लिए अपना व्यवसाय पंजीकृत करें।",
    secure: "सुरक्षित पंजीकरण",
    steps: [
      ["संपर्क", "आपकी संपर्क जानकारी"],
      ["व्यवसाय", "विक्रेता और व्यवसाय विवरण"],
      ["उत्पाद", "उत्पाद और प्रामाणिकता"],
      ["डिलीवरी", "स्टॉक, शिपिंग और रिटर्न"],
      ["दस्तावेज़", "व्यवसाय सत्यापन"],
      ["सुरक्षा", "खाता और सहमति"],
    ],
    step: "चरण",
    of: "में से",
    completed: "पूरा",
    contactTitle: "विक्रेता संपर्क जानकारी",
    contactDesc: "व्यवसाय का मालिक कौन है और किससे संपर्क किया जाए?",
    fullName: "मालिक / संपर्क व्यक्ति का पूरा नाम *",
    designation: "पद",
    mobile: "मोबाइल नंबर *",
    whatsapp: "व्हाट्सऐप नंबर",
    email: "व्यावसायिक ईमेल *",
    businessTitle: "व्यवसाय और विक्रेता प्रोफ़ाइल",
    businessDesc: "अपने व्यवसाय और उसके प्रकार के बारे में बताएँ।",
    sellerType: "विक्रेता का प्रकार *",
    chooseSeller: "विक्रेता का प्रकार चुनें",
    manufacturer: "निर्माता",
    wholesaler: "थोक विक्रेता",
    distributor: "वितरक",
    retailer: "खुदरा विक्रेता",
    authorizedDealer: "अधिकृत डीलर",
    importer: "आयातक",
    other: "अन्य",
    businessName: "पंजीकृत व्यवसाय / स्टोर का नाम *",
    legalType: "व्यवसाय का कानूनी ढाँचा *",
    chooseType: "व्यवसाय का ढाँचा चुनें",
    sole: "एकल स्वामित्व",
    partnership: "साझेदारी",
    privateLimited: "प्राइवेट लिमिटेड कंपनी",
    llp: "LLP",
    individual: "व्यक्तिगत विक्रेता",
    year: "स्थापना वर्ष",
    website: "वेबसाइट / ऑनलाइन स्टोर",
    productTitle: "उत्पाद और प्रामाणिकता",
    productDesc: "जाँच के लिए अपने उत्पादों की जानकारी दें।",
    categories: "उत्पाद श्रेणियाँ *",
    brands: "बेचे जाने वाले ब्रांड *",
    brandsHint: "ब्रांड के नाम अल्पविराम से अलग करके लिखें",
    products: "बेचे जाने वाले उत्पाद / स्पेयर पार्ट्स *",
    productsHint: "उत्पाद, पार्ट्स, मॉडल नंबर या SKU का विवरण दें",
    condition: "उत्पाद की स्थिति *",
    chooseCondition: "उत्पाद की स्थिति चुनें",
    new: "नए उत्पाद",
    refurbished: "नवीनीकृत उत्पाद",
    both: "नए और नवीनीकृत",
    authorization: "क्या आप किसी ब्रांड के अधिकृत विक्रेता हैं? *",
    chooseAnswer: "उत्तर चुनें",
    yes: "हाँ",
    no: "नहीं",
    catalogue: "उत्पाद कैटलॉग / उत्पाद की तस्वीरें",
    optional: "वैकल्पिक",
    locationTitle: "स्टॉक और ऑर्डर पूर्ति",
    locationDesc: "अपना डिस्पैच स्थान और ऑर्डर प्रक्रिया बताएँ।",
    address: "व्यवसाय / डिस्पैच पता *",
    city: "शहर *",
    state: "राज्य *",
    pincode: "6 अंकों का पिनकोड *",
    coverage: "डिलीवरी क्षेत्र *",
    coverageHint: "वे शहर, राज्य या पिनकोड जहाँ डिलीवरी कर सकते हैं",
    dispatch: "सामान्य डिस्पैच समय *",
    chooseDispatch: "डिस्पैच समय चुनें",
    sameDay: "उसी दिन",
    oneTwo: "1–2 कार्यदिवस",
    threeFive: "3–5 कार्यदिवस",
    overFive: "5 कार्यदिवस से अधिक",
    inventory: "स्टॉक की उपलब्धता *",
    chooseInventory: "स्टॉक व्यवस्था चुनें",
    ready: "तैयार स्टॉक",
    orderBased: "ऑर्डर मिलने पर तैयार किया जाता है",
    mixed: "दोनों प्रकार",
    returns: "रिटर्न / रिप्लेसमेंट नीति *",
    chooseReturns: "नीति चुनें",
    sevenDays: "7 दिनों के भीतर रिटर्न",
    fifteenDays: "15 दिनों के भीतर रिटर्न",
    replacement: "केवल रिप्लेसमेंट",
    manufacturerPolicy: "निर्माता की वारंटी / नीति",
    noReturns: "रिटर्न नहीं (जहाँ कानून अनुमति देता है)",
    documentsTitle: "विक्रेता सत्यापन",
    documentsDesc: "PDF, JPG या PNG फ़ाइलें अपलोड करें; प्रत्येक अधिकतम 5 MB।",
    pan: "व्यवसाय / मालिक का PAN *",
    gst: "GSTIN (यदि लागू हो)",
    registration: "व्यवसाय पंजीकरण प्रमाण",
    panDoc: "PAN दस्तावेज़ *",
    gstDoc: "GST प्रमाणपत्र",
    addressProof: "व्यवसाय के पते का प्रमाण *",
    brandDoc: "ब्रांड प्राधिकरण प्रमाण",
    required: "अनिवार्य",
    conditional: "यदि लागू हो",
    securityTitle: "खाता सुरक्षा और सहमति",
    securityDesc: "खाता बनाएँ और विक्रेता की शर्तें स्वीकार करें।",
    password: "पासवर्ड *",
    confirmPassword: "पासवर्ड की पुष्टि करें *",
    passwordHint: "कम से कम 8 अक्षर रखें",
    confirmHint: "पासवर्ड फिर से लिखें",
    reviewTitle: "क्या आप विक्रेता आवेदन जमा करने के लिए तैयार हैं?",
    reviewDesc: "खाता सक्रिय करने से पहले NeedOneService आपके व्यवसाय, उत्पादों और दस्तावेज़ों की जाँच कर सकता है।",
    terms: "मैं सहमत हूँ:",
    termsLink: "नियम और शर्तें",
    privacy: "गोपनीयता नीति",
    verification: "मैं NeedOneService को मेरे व्यवसाय विवरण और दस्तावेज़ सत्यापित करने की अनुमति देता/देती हूँ।",
    authenticity: "मैं पुष्टि करता/करती हूँ कि मेरे उत्पाद असली, कानूनी रूप से प्राप्त और सही विवरण वाले हैं।",
    back: "वापस",
    save: "आगे बढ़ें",
    submit: "आवेदन जमा करें",
    submitting: "जमा हो रहा है...",
    safe: "आपकी जानकारी सुरक्षित रखी जानी चाहिए",
    help: "पंजीकरण में सहायता चाहिए?",
    contactUs: "हमारी टीम से संपर्क करें",
    successEyebrow: "आवेदन प्राप्त हुआ",
    successTitle: "NeedOneService में पंजीकरण के लिए धन्यवाद।",
    successDesc: "इस डेमो में आपका आवेदन दर्ज हुआ है। वास्तविक पंजीकरण, दस्तावेज़ सत्यापन और खाता बनाने के लिए बैकएंड आवश्यक है।",
    business: "व्यवसाय",
    contact: "संपर्क",
    backHome: "होम पर जाएँ",
    loginButton: "लॉगिन",
    fileChoose: "फ़ाइल चुनें",
    browse: "ब्राउज़ करें",
    change: "बदलें",
    maxSize: "PDF, JPG या PNG · अधिकतम 5 MB",
    fileSizeError: "प्रत्येक फ़ाइल 5 MB से छोटी होनी चाहिए।",
    invalidMobile: "मान्य 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।",
    invalidEmail: "मान्य ईमेल पता दर्ज करें।",
    invalidYear: "मान्य स्थापना वर्ष दर्ज करें।",
    invalidWebsite: "https:// या http:// से शुरू होने वाला मान्य URL दर्ज करें।",
    requiredContact: "संपर्क व्यक्ति का नाम दर्ज करें।",
    requiredSeller: "विक्रेता का प्रकार चुनें।",
    requiredBusiness: "व्यवसाय का नाम दर्ज करें।",
    requiredLegalType: "व्यवसाय का कानूनी ढाँचा चुनें।",
    requiredCategories: "कम से कम एक उत्पाद श्रेणी चुनें।",
    requiredBrands: "बेचे जाने वाले ब्रांड दर्ज करें।",
    requiredProducts: "उत्पाद या स्पेयर पार्ट्स का विवरण दें।",
    requiredCondition: "उत्पाद की स्थिति चुनें।",
    requiredAuthorization: "ब्रांड प्राधिकरण के प्रश्न का उत्तर दें।",
    requiredAddress: "व्यवसाय का पता दर्ज करें।",
    requiredCity: "शहर दर्ज करें।",
    requiredState: "राज्य दर्ज करें।",
    invalidPincode: "मान्य 6 अंकों का पिनकोड दर्ज करें।",
    requiredCoverage: "डिलीवरी क्षेत्र दर्ज करें।",
    requiredDispatch: "डिस्पैच समय चुनें।",
    requiredInventory: "स्टॉक व्यवस्था चुनें।",
    requiredReturns: "रिटर्न नीति चुनें।",
    invalidPan: "मान्य PAN नंबर दर्ज करें।",
    invalidGST: "मान्य GSTIN दर्ज करें या लागू न होने पर खाली छोड़ें।",
    requiredPanDoc: "PAN दस्तावेज़ अपलोड करें।",
    requiredAddressProof: "पते का प्रमाण अपलोड करें।",
    requiredRegistration: "इस व्यवसाय ढाँचे के लिए पंजीकरण प्रमाण अपलोड करें।",
    requiredBrandDoc: "ब्रांड प्राधिकरण प्रमाण अपलोड करें या लागू न होने पर उत्तर बदलें।",
    requiredPassword: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
    passwordMismatch: "पासवर्ड मेल नहीं खाते।",
    requiredTerms: "नियम और गोपनीयता नीति स्वीकार करें।",
    requiredVerification: "व्यवसाय सत्यापन की सहमति दें।",
    requiredAuthenticity: "उत्पाद की प्रामाणिकता की पुष्टि करें।",
    submissionError: "आवेदन जमा नहीं हो सका। फिर से प्रयास करें।",
    categoriesList: [
      "घरेलू उपकरण",
      "AC और रेफ्रिजरेशन स्पेयर पार्ट्स",
      "वॉशिंग मशीन स्पेयर पार्ट्स",
      "रेफ्रिजरेटर स्पेयर पार्ट्स",
      "इलेक्ट्रिकल उत्पाद",
      "प्लंबिंग उत्पाद",
      "वॉटर प्यूरीफायर फ़िल्टर और पार्ट्स",
      "टीवी और इलेक्ट्रॉनिक्स",
      "मोबाइल और कंप्यूटर एक्सेसरीज़",
      "टूल्स और हार्डवेयर",
      "अन्य",
    ],
  },
};

const initialFormData: SellerFormData = {
  contactName: "",
  designation: "",
  mobile: "",
  whatsapp: "",
  email: "",
  sellerType: "",
  businessName: "",
  businessType: "",
  yearEstablished: "",
  website: "",
  categories: [],
  brands: "",
  products: "",
  productCondition: "",
  authorizedSeller: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  deliveryCoverage: "",
  dispatchTime: "",
  inventory: "",
  returnPolicy: "",
  panNumber: "",
  gstNumber: "",
  businessRegistration: null,
  panDocument: null,
  gstDocument: null,
  addressProof: null,
  brandAuthorizationDocument: null,
  productCatalogue: null,
  password: "",
  confirmPassword: "",
  terms: false,
  verificationConsent: false,
  productAuthenticityConsent: false,
};

const businessRegistrationRequired = (type: string) =>
  ["partnership", "private-limited", "llp"].includes(type);

function PartnerRegisterPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];

  const [formData, setFormData] =
    useState<SellerFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: keyof SellerFormData
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (file && file.size > 5 * 1024 * 1024) {
      setError(t.fileSizeError);
      event.target.value = "";
      return;
    }

    if (
      file &&
      !["application/pdf", "image/jpeg", "image/png"].includes(file.type)
    ) {
      setError(t.maxSize);
      event.target.value = "";
      return;
    }

    setFormData((previous) => ({ ...previous, [field]: file }));
    setError("");
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData((previous) => ({ ...previous, [name]: checked }));
    setError("");
  };

  const toggleCategory = (category: string) => {
    setFormData((previous) => ({
      ...previous,
      categories: previous.categories.includes(category)
        ? previous.categories.filter((item) => item !== category)
        : [...previous.categories, category],
    }));
    setError("");
  };

  const validateStep = (step: number): string => {
    switch (step) {
      case 0:
        if (!formData.contactName.trim()) return t.requiredContact;
        if (!/^[6-9]\d{9}$/.test(formData.mobile)) return t.invalidMobile;
        if (formData.whatsapp && !/^[6-9]\d{9}$/.test(formData.whatsapp))
          return t.invalidMobile;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
          return t.invalidEmail;
        return "";

      case 1:
        if (!formData.sellerType) return t.requiredSeller;
        if (!formData.businessName.trim()) return t.requiredBusiness;
        if (!formData.businessType) return t.requiredLegalType;
        if (
          formData.yearEstablished &&
          (!/^\d{4}$/.test(formData.yearEstablished) ||
            Number(formData.yearEstablished) < 1800 ||
            Number(formData.yearEstablished) > new Date().getFullYear())
        ) {
          return t.invalidYear;
        }
        if (
          formData.website &&
          !/^https?:\/\/.+\..+/i.test(formData.website.trim())
        ) {
          return t.invalidWebsite;
        }
        return "";

      case 2:
        if (!formData.categories.length) return t.requiredCategories;
        if (!formData.brands.trim()) return t.requiredBrands;
        if (!formData.products.trim()) return t.requiredProducts;
        if (!formData.productCondition) return t.requiredCondition;
        if (!formData.authorizedSeller) return t.requiredAuthorization;
        if (
          formData.authorizedSeller === "yes" &&
          !formData.brandAuthorizationDocument
        ) {
          return t.requiredBrandDoc;
        }
        return "";

      case 3:
        if (!formData.address.trim()) return t.requiredAddress;
        if (!formData.city.trim()) return t.requiredCity;
        if (!formData.state.trim()) return t.requiredState;
        if (!/^\d{6}$/.test(formData.pincode)) return t.invalidPincode;
        if (!formData.deliveryCoverage.trim()) return t.requiredCoverage;
        if (!formData.dispatchTime) return t.requiredDispatch;
        if (!formData.inventory) return t.requiredInventory;
        if (!formData.returnPolicy) return t.requiredReturns;
        return "";

      case 4:
        if (!/^[A-Z]{5}\d{4}[A-Z]$/i.test(formData.panNumber.trim()))
          return t.invalidPan;

        if (
          formData.gstNumber &&
          !/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/i.test(
            formData.gstNumber.trim()
          )
        ) {
          return t.invalidGST;
        }

        if (!formData.panDocument) return t.requiredPanDoc;
        if (!formData.addressProof) return t.requiredAddressProof;

        if (
          businessRegistrationRequired(formData.businessType) &&
          !formData.businessRegistration
        ) {
          return t.requiredRegistration;
        }
        return "";

      case 5:
        if (formData.password.length < 8) return t.requiredPassword;
        if (
          !formData.confirmPassword ||
          formData.password !== formData.confirmPassword
        ) {
          return t.passwordMismatch;
        }
        if (!formData.terms) return t.requiredTerms;
        if (!formData.verificationConsent) return t.requiredVerification;
        if (!formData.productAuthenticityConsent)
          return t.requiredAuthenticity;
        return "";

      default:
        return "";
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, t.steps.length - 1)));
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    const validationError = validateStep(currentStep);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (currentStep < t.steps.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentStep < t.steps.length - 1) {
      handleNext();
      return;
    }

    const validationError = validateStep(currentStep);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      /*
       * Frontend demo submission:
       * - Save application details for the Seller Hub.
       * - Never store the password, PAN/GSTIN values, or uploaded files
       *   in localStorage.
       * - Real registration and document storage require a backend API.
       */
      const application = {
        id: `SEL-${Date.now()}`,
        role: "seller",
        status: "Pending",
        submittedAt: new Date().toISOString(),

        contactName: formData.contactName.trim(),
        fullName: formData.contactName.trim(),
        designation: formData.designation.trim(),
        mobile: formData.mobile,
        whatsapp: formData.whatsapp,
        email: formData.email.trim(),

        sellerType: formData.sellerType,
        businessName: formData.businessName.trim(),
        businessType: formData.businessType,
        yearEstablished: formData.yearEstablished,
        website: formData.website.trim(),

        categories: [...formData.categories],
        brands: formData.brands.trim(),
        products: formData.products.trim(),
        productCondition: formData.productCondition,
        authorizedSeller: formData.authorizedSeller,

        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode,
        deliveryCoverage: formData.deliveryCoverage.trim(),
        dispatchTime: formData.dispatchTime,
        inventory: formData.inventory,
        returnPolicy: formData.returnPolicy,

        hasBusinessRegistration: Boolean(formData.businessRegistration),
        hasPanDocument: Boolean(formData.panDocument),
        hasGstDocument: Boolean(formData.gstDocument),
        hasAddressProof: Boolean(formData.addressProof),
        hasBrandAuthorizationDocument: Boolean(
          formData.brandAuthorizationDocument
        ),
        hasProductCatalogue: Boolean(formData.productCatalogue),

        termsAccepted: formData.terms,
        verificationConsent: formData.verificationConsent,
        productAuthenticityConsent: formData.productAuthenticityConsent,
      };

      localStorage.setItem(
        "oneservice_partner_application",
        JSON.stringify(application)
      );

      // Keep this alias so other OneService pages can find the seller application.
      localStorage.setItem(
        "oneservice_seller_application",
        JSON.stringify(application)
      );

      localStorage.setItem("oneservice_workspace_role", "seller");

      // Notify profile/navigation components in the current browser tab.
      window.dispatchEvent(new Event("oneservice-workspace-change"));
      window.dispatchEvent(new Event("oneservice-seller-change"));
      window.dispatchEvent(new Event("storage"));

      navigate("/profile", { replace: true });
    } catch (submissionError) {
      console.error("Unable to save the seller application:", submissionError);
      setError(t.submissionError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = t.categoriesList;

  return (
    <main className="partner-register-page">
      <section className="partner-wizard">
        <header className="partner-wizard-header">
          <Link to="/" className="partner-brand" aria-label="NeedOneService home">
            {/* Existing brand mark and text can be restored here if required. */}
          </Link>

          <div className="partner-header-actions">
            <label className="partner-language-picker">
              <Languages size={17} />
              <span>{t.translate}</span>
              <select
                aria-label={t.translate}
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value as Language);
                  setError("");
                }}
              >
                <option value="en">{t.english}</option>
                <option value="te">{t.telugu}</option>
                <option value="hi">{t.hindi}</option>
              </select>
            </label>

            <div className="partner-login-note">
              {t.signIn} <Link to="/login">{t.login}</Link>
            </div>
          </div>
        </header>

        <div className="partner-wizard-intro">
          <div>
            <span className="partner-eyebrow">{t.eyebrow}</span>
            <h1>
              {t.heading} <span>{t.brand}</span>
            </h1>
            <p>{t.intro}</p>
          </div>

          <div className="partner-secure-note">
            <LockKeyhole size={16} />
            <span>{t.secure}</span>
          </div>
        </div>

        <div className="partner-wizard-card">
          <div className="partner-progress-header">
            <div>
              <span className="partner-step-count">
                {t.step} {String(currentStep + 1).padStart(2, "0")} {t.of}{" "}
                {String(t.steps.length).padStart(2, "0")}
              </span>
              <h2>{t.steps[currentStep][0]}</h2>
              <p>{t.steps[currentStep][1]}</p>
            </div>

            <div className="partner-progress-percent">
              {Math.round(((currentStep + 1) / t.steps.length) * 100)}%
              <span> {t.completed}</span>
            </div>
          </div>

          <div
            className="partner-progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={t.steps.length}
            aria-valuenow={currentStep + 1}
            aria-label={t.intro}
          >
            <div
              className="partner-progress-fill"
              style={{
                width: `${((currentStep + 1) / t.steps.length) * 100}%`,
              }}
            />
          </div>

          <div className="partner-step-indicators">
            {t.steps.map((step, index) => (
              <div
                key={step[0]}
                className={`partner-step-indicator ${
                  index === currentStep ? "current" : ""
                } ${index < currentStep ? "completed" : ""}`}
              >
                <span>
                  {index < currentStep ? (
                    <Check size={14} />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
                <small>{step[0]}</small>
              </div>
            ))}
          </div>

          <form
            className="partner-register-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {error && (
              <div className="partner-form-error" role="alert">
                <span>{error}</span>
                <button
                  type="button"
                  aria-label="Dismiss error"
                  onClick={() => setError("")}
                >
                  ×
                </button>
              </div>
            )}

            {currentStep === 0 && (
              <FormStep
                number="01"
                title={t.contactTitle}
                description={t.contactDesc}
              >
                <div className="partner-form-grid">
                  <Field label={t.fullName}>
                    <div className="partner-input-wrap">
                      <UserRound size={16} />
                      <input
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleTextChange}
                        placeholder={t.fullName.replace(" *", "")}
                        autoComplete="name"
                        autoFocus
                      />
                    </div>
                  </Field>

                  <Field label={t.designation}>
                    <input
                      name="designation"
                      value={formData.designation}
                      onChange={handleTextChange}
                      placeholder={t.designation}
                    />
                  </Field>

                  <Field label={t.mobile}>
                    <div className="partner-input-wrap">
                      <Phone size={16} />
                      <span className="partner-country-code">+91</span>
                      <input
                        name="mobile"
                        type="tel"
                        inputMode="numeric"
                        value={formData.mobile}
                        onChange={(event) => {
                          setFormData((previous) => ({
                            ...previous,
                            mobile: event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10),
                          }));
                          setError("");
                        }}
                        maxLength={10}
                        placeholder="10"
                        autoComplete="tel-national"
                      />
                    </div>
                  </Field>

                  <Field label={t.whatsapp}>
                    <input
                      name="whatsapp"
                      type="tel"
                      inputMode="numeric"
                      value={formData.whatsapp}
                      onChange={(event) => {
                        setFormData((previous) => ({
                          ...previous,
                          whatsapp: event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10),
                        }));
                        setError("");
                      }}
                      maxLength={10}
                      placeholder="10"
                    />
                  </Field>

                  <Field label={t.email} full>
                    <div className="partner-input-wrap">
                      <Mail size={16} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleTextChange}
                        placeholder="business@example.com"
                        autoComplete="email"
                      />
                    </div>
                  </Field>
                </div>
              </FormStep>
            )}

            {currentStep === 1 && (
              <FormStep
                number="02"
                title={t.businessTitle}
                description={t.businessDesc}
              >
                <div className="partner-form-grid">
                  <Field label={t.sellerType}>
                    <select
                      name="sellerType"
                      value={formData.sellerType}
                      onChange={handleTextChange}
                    >
                      <option value="">{t.chooseSeller}</option>
                      <option value="manufacturer">{t.manufacturer}</option>
                      <option value="wholesaler">{t.wholesaler}</option>
                      <option value="distributor">{t.distributor}</option>
                      <option value="retailer">{t.retailer}</option>
                      <option value="authorized-dealer">
                        {t.authorizedDealer}
                      </option>
                      <option value="importer">{t.importer}</option>
                      <option value="other">{t.other}</option>
                    </select>
                  </Field>

                  <Field label={t.businessName}>
                    <input
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleTextChange}
                      placeholder={t.businessName.replace(" *", "")}
                      autoFocus
                    />
                  </Field>

                  <Field label={t.legalType}>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleTextChange}
                    >
                      <option value="">{t.chooseType}</option>
                      <option value="sole-proprietorship">{t.sole}</option>
                      <option value="partnership">{t.partnership}</option>
                      <option value="private-limited">
                        {t.privateLimited}
                      </option>
                      <option value="llp">{t.llp}</option>
                      <option value="individual">{t.individual}</option>
                      <option value="other">{t.other}</option>
                    </select>
                  </Field>

                  <Field label={t.year}>
                    <input
                      type="number"
                      name="yearEstablished"
                      value={formData.yearEstablished}
                      onChange={handleTextChange}
                      min="1800"
                      max={new Date().getFullYear()}
                      placeholder="2020"
                    />
                  </Field>

                  <Field label={t.website} full>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleTextChange}
                      placeholder="https://yourbusiness.com"
                    />
                  </Field>
                </div>
              </FormStep>
            )}

            {currentStep === 2 && (
              <FormStep
                number="03"
                title={t.productTitle}
                description={t.productDesc}
              >
                <div className="partner-form-grid">
                  <Field label={t.categories} full>
                    <div className="partner-chip-grid">
                      {categories.map((category) => {
                        const selected =
                          formData.categories.includes(category);

                        return (
                          <button
                            key={category}
                            type="button"
                            aria-pressed={selected}
                            className={`partner-service-chip ${
                              selected ? "selected" : ""
                            }`}
                            onClick={() => toggleCategory(category)}
                          >
                            {selected && <Check size={13} />}
                            {category}
                          </button>
                        );
                      })}
                    </div>
                  </Field>

                  <Field label={t.brands} full>
                    <input
                      name="brands"
                      value={formData.brands}
                      onChange={handleTextChange}
                      placeholder={t.brandsHint}
                    />
                  </Field>

                  <Field label={t.products} full>
                    <textarea
                      name="products"
                      value={formData.products}
                      onChange={handleTextChange}
                      placeholder={t.productsHint}
                      rows={3}
                    />
                  </Field>

                  <Field label={t.condition}>
                    <select
                      name="productCondition"
                      value={formData.productCondition}
                      onChange={handleTextChange}
                    >
                      <option value="">{t.chooseCondition}</option>
                      <option value="new">{t.new}</option>
                      <option value="refurbished">{t.refurbished}</option>
                      <option value="both">{t.both}</option>
                    </select>
                  </Field>

                  <Field label={t.authorization}>
                    <select
                      name="authorizedSeller"
                      value={formData.authorizedSeller}
                      onChange={handleTextChange}
                    >
                      <option value="">{t.chooseAnswer}</option>
                      <option value="yes">{t.yes}</option>
                      <option value="no">{t.no}</option>
                    </select>
                  </Field>

                  {formData.authorizedSeller === "yes" && (
                    <FileUpload
                      label={t.brandDoc}
                      file={formData.brandAuthorizationDocument}
                      onChange={(event) =>
                        handleFileChange(
                          event,
                          "brandAuthorizationDocument"
                        )
                      }
                      t={t}
                    />
                  )}

                  <FileUpload
                    label={`${t.catalogue} (${t.optional})`}
                    file={formData.productCatalogue}
                    onChange={(event) =>
                      handleFileChange(event, "productCatalogue")
                    }
                    t={t}
                  />
                </div>
              </FormStep>
            )}

            {currentStep === 3 && (
              <FormStep
                number="04"
                title={t.locationTitle}
                description={t.locationDesc}
              >
                <div className="partner-form-grid">
                  <Field label={t.address} full>
                    <div className="partner-input-wrap partner-textarea-wrap">
                      <MapPin size={16} />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleTextChange}
                        placeholder={t.address.replace(" *", "")}
                        rows={3}
                        autoFocus
                      />
                    </div>
                  </Field>

                  <Field label={t.city}>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleTextChange}
                      placeholder={t.city}
                    />
                  </Field>

                  <Field label={t.state}>
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleTextChange}
                      placeholder={t.state}
                    />
                  </Field>

                  <Field label={t.pincode}>
                    <input
                      name="pincode"
                      inputMode="numeric"
                      value={formData.pincode}
                      onChange={(event) => {
                        setFormData((previous) => ({
                          ...previous,
                          pincode: event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6),
                        }));
                        setError("");
                      }}
                      maxLength={6}
                      placeholder="000000"
                      autoComplete="postal-code"
                    />
                  </Field>

                  <Field label={t.coverage} full>
                    <input
                      name="deliveryCoverage"
                      value={formData.deliveryCoverage}
                      onChange={handleTextChange}
                      placeholder={t.coverageHint}
                    />
                  </Field>

                  <Field label={t.dispatch}>
                    <select
                      name="dispatchTime"
                      value={formData.dispatchTime}
                      onChange={handleTextChange}
                    >
                      <option value="">{t.chooseDispatch}</option>
                      <option value="same-day">{t.sameDay}</option>
                      <option value="1-2-days">{t.oneTwo}</option>
                      <option value="3-5-days">{t.threeFive}</option>
                      <option value="over-5-days">{t.overFive}</option>
                    </select>
                  </Field>

                  <Field label={t.inventory}>
                    <select
                      name="inventory"
                      value={formData.inventory}
                      onChange={handleTextChange}
                    >
                      <option value="">{t.chooseInventory}</option>
                      <option value="ready-stock">{t.ready}</option>
                      <option value="order-based">{t.orderBased}</option>
                      <option value="mixed">{t.mixed}</option>
                    </select>
                  </Field>

                  <Field label={t.returns} full>
                    <select
                      name="returnPolicy"
                      value={formData.returnPolicy}
                      onChange={handleTextChange}
                    >
                      <option value="">{t.chooseReturns}</option>
                      <option value="7-days">{t.sevenDays}</option>
                      <option value="15-days">{t.fifteenDays}</option>
                      <option value="replacement-only">
                        {t.replacement}
                      </option>
                      <option value="manufacturer-policy">
                        {t.manufacturerPolicy}
                      </option>
                      <option value="no-returns">{t.noReturns}</option>
                    </select>
                  </Field>
                </div>
              </FormStep>
            )}

            {currentStep === 4 && (
              <FormStep
                number="05"
                title={t.documentsTitle}
                description={t.documentsDesc}
              >
                <div className="partner-form-grid">
                  <Field label={t.pan}>
                    <input
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleTextChange}
                      placeholder="ABCDE1234F"
                      autoFocus
                      style={{ textTransform: "uppercase" }}
                      maxLength={10}
                    />
                  </Field>

                  <Field label={t.gst}>
                    <input
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleTextChange}
                      placeholder="15-character GSTIN"
                      style={{ textTransform: "uppercase" }}
                      maxLength={15}
                    />
                  </Field>

                  <FileUpload
                    label={`${t.registration} (${
                      businessRegistrationRequired(formData.businessType)
                        ? t.required
                        : t.conditional
                    })`}
                    file={formData.businessRegistration}
                    onChange={(event) =>
                      handleFileChange(event, "businessRegistration")
                    }
                    t={t}
                  />

                  <FileUpload
                    label={t.panDoc}
                    file={formData.panDocument}
                    onChange={(event) =>
                      handleFileChange(event, "panDocument")
                    }
                    t={t}
                  />

                  <FileUpload
                    label={`${t.gstDoc} (${t.conditional})`}
                    file={formData.gstDocument}
                    onChange={(event) =>
                      handleFileChange(event, "gstDocument")
                    }
                    t={t}
                  />

                  <FileUpload
                    label={t.addressProof}
                    file={formData.addressProof}
                    onChange={(event) =>
                      handleFileChange(event, "addressProof")
                    }
                    t={t}
                  />

                  {formData.authorizedSeller === "yes" && (
                    <div className="partner-review-summary partner-field-full">
                      <ShieldCheck size={20} />
                      <p>{t.requiredBrandDoc}</p>
                    </div>
                  )}
                </div>
              </FormStep>
            )}

            {currentStep === 5 && (
              <FormStep
                number="06"
                title={t.securityTitle}
                description={t.securityDesc}
              >
                <div className="partner-form-grid">
                  <Field label={t.password}>
                    <div className="partner-input-wrap">
                      <LockKeyhole size={16} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleTextChange}
                        placeholder={t.passwordHint}
                        autoComplete="new-password"
                        autoFocus
                      />
                      <button
                        type="button"
                        className="partner-password-button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() =>
                          setShowPassword((visible) => !visible)
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </Field>

                  <Field label={t.confirmPassword}>
                    <div className="partner-input-wrap">
                      <LockKeyhole size={16} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleTextChange}
                        placeholder={t.confirmHint}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="partner-password-button"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() =>
                          setShowConfirmPassword((visible) => !visible)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </Field>

                  <div className="partner-review-summary partner-field-full">
                    <span className="partner-review-icon">
                      <FileText size={18} />
                    </span>
                    <div>
                      <strong>{t.reviewTitle}</strong>
                      <p>{t.reviewDesc}</p>
                    </div>
                  </div>

                  <div className="partner-consent-section partner-field-full">
                    <label className="partner-check-row">
                      <input
                        type="checkbox"
                        name="terms"
                        checked={formData.terms}
                        onChange={handleCheckboxChange}
                      />
                      <span>
                        {t.terms} <Link to="/terms">{t.termsLink}</Link> and{" "}
                        <Link to="/privacy">{t.privacy}</Link>.
                      </span>
                    </label>

                    <label className="partner-check-row">
                      <input
                        type="checkbox"
                        name="verificationConsent"
                        checked={formData.verificationConsent}
                        onChange={handleCheckboxChange}
                      />
                      <span>{t.verification}</span>
                    </label>

                    <label className="partner-check-row">
                      <input
                        type="checkbox"
                        name="productAuthenticityConsent"
                        checked={formData.productAuthenticityConsent}
                        onChange={handleCheckboxChange}
                      />
                      <span>{t.authenticity}</span>
                    </label>
                  </div>
                </div>
              </FormStep>
            )}

            <footer className="partner-wizard-footer">
              <button
                type="button"
                className="partner-back-button"
                onClick={() => goToStep(currentStep - 1)}
                disabled={currentStep === 0 || isSubmitting}
              >
                <ArrowLeft size={16} />
                {t.back}
              </button>

              <span className="partner-footer-hint">
                <LockKeyhole size={13} />
                {t.safe}
              </span>

              {currentStep < t.steps.length - 1 ? (
                <button
                  type="button"
                  className="partner-submit-button"
                  onClick={handleNext}
                >
                  {t.save}
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="partner-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.submitting : t.submit}
                  {!isSubmitting && <Check size={17} />}
                </button>
              )}
            </footer>
          </form>
        </div>

        <p className="partner-wizard-bottom-note">
          {t.help} <Link to="/contact">{t.contactUs}</Link>
        </p>
      </section>
    </main>
  );
}

type FormStepProps = {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
};

function FormStep({
  number,
  title,
  description,
  children,
}: FormStepProps) {
  return (
    <section className="partner-form-section">
      <div className="partner-form-heading">
        <span className="partner-form-number">{number}</span>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

type FieldProps = {
  label: string;
  full?: boolean;
  children: ReactNode;
};

function Field({ label, full = false, children }: FieldProps) {
  return (
    <label className={`partner-field ${full ? "partner-field-full" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

type FileUploadProps = {
  label: string;
  file: File | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  t: (typeof translations)[Language];
};

function FileUpload({ label, file, onChange, t }: FileUploadProps) {
  return (
    <label className="partner-file-upload">
      <span>{label}</span>
      <span className="partner-file-box">
        <Upload size={18} />
        <span className="partner-file-copy">
          <strong>{file ? file.name : t.fileChoose}</strong>
          <small>
            {file
              ? `${Math.max(1, Math.round(file.size / 1024))} KB`
              : t.maxSize}
          </small>
        </span>
        <span className="partner-file-action">
          {file ? t.change : t.browse}
        </span>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={onChange}
        />
      </span>
    </label>
  );
}

export default PartnerRegisterPage;
