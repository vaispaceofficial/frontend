import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Eye, EyeOff,
  GraduationCap, Languages, LockKeyhole, ShieldCheck,
  Upload,
} from "lucide-react";
import "./StudentRegisterPage.css";

type Language = "en" | "te" | "hi";
type StudentFormData = {
  fullName: string; mobile: string; whatsapp: string; email: string; dob: string; gender: string;
  address: string; city: string; state: string; pincode: string;
  educationLevel: string; course: string; institution: string; specialization: string; graduationYear: string;
  skills: string; experienceLevel: string; interestedAreas: string[];
  learningFormat: string; preferredMode: string; preferredDays: string[]; preferredTime: string; availability: string;
  learningGoals: string[]; careerGoal: string; certificationInterest: string;
  profilePhoto: File | null; educationProof: File | null;
  password: string; confirmPassword: string; terms: boolean; consent: boolean;
};
const initialForm: StudentFormData = {
  fullName: "", mobile: "", whatsapp: "", email: "", dob: "", gender: "", address: "", city: "", state: "", pincode: "",
  educationLevel: "", course: "", institution: "", specialization: "", graduationYear: "", skills: "", experienceLevel: "",
  interestedAreas: [], learningFormat: "", preferredMode: "", preferredDays: [], preferredTime: "", availability: "",
  learningGoals: [], careerGoal: "", certificationInterest: "", profilePhoto: null, educationProof: null,
  password: "", confirmPassword: "", terms: false, consent: false,
};
const interestOptions = ["AC & Cooling", "Electrical", "Plumbing", "Carpentry", "Home Appliances", "Cleaning", "Water Purification", "Refrigeration", "Washing Machine Repair", "TV Repair", "Home Maintenance", "Other"];
const goalOptions = ["Learn a new skill", "Improve existing skills", "Get certified", "Become a technician", "Find employment", "Start a service business", "Work as a freelancer", "Build practical experience"];
const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const translations = {
  en: {
    language: "Language", english: "English", telugu: "Telugu", hindi: "Hindi", signIn: "Already registered?", login: "Sign in",
    network: "ONESERVICE LEARNING NETWORK", eyebrow: "STUDENT REGISTRATION", heading: "Learn skills.", brand: "Build your future.",
    intro: "Join the NeedOneService learning network to develop practical skills, gain experience, get trained and explore career opportunities.", secure: "Secure student registration",
    step: "STEP", of: "OF", completed: "completed", stepNames: [["Personal information", "Your identity and contact details"], ["Address & location", "Where you are based"], ["Education", "Your current or most recent education"], ["Skills & interests", "Skills you have and areas you want to learn"], ["Learning & goals", "Your preferred schedule and career goals"], ["Account & consent", "Secure your account and confirm your consent"]],
    personalTitle: "Personal information", personalDesc: "Tell us a little about yourself so the OneService team can identify and contact you.",
    addressTitle: "Address & location", addressDesc: "Provide your location so relevant learning and training opportunities can be shared with you.",
    educationTitle: "Education", educationDesc: "Tell us about your current or most recent education and add optional supporting proof.",
    skillsTitle: "Skills & interests", skillsDesc: "Choose the service areas you want to learn or develop and describe your current experience.",
    learningTitle: "Learning preferences & goals", learningDesc: "Help us understand how and when you prefer to learn, and what you want to achieve.",
    securityTitle: "Account & consent", securityDesc: "Create secure login details and review the required consent statements.",
    fullName: "Full name", fullNameHint: "Enter your full name", mobile: "Mobile number", mobileHint: "10-digit mobile number", whatsapp: "WhatsApp number", whatsappHint: "WhatsApp number, if different", email: "Email address", emailHint: "student@example.com", dob: "Date of birth", gender: "Gender", choose: "Select an option",
    address: "Full address", addressHint: "House / street, area and landmark", city: "City", cityHint: "Enter your city", state: "State", stateHint: "Enter your state", pincode: "PIN code", pincodeHint: "6-digit PIN code",
    educationLevel: "Education level", course: "Course / program", courseHint: "e.g. Diploma in Electrical", institution: "Institution", institutionHint: "College / school / institute", specialization: "Specialization", specializationHint: "Your specialization", graduationYear: "Graduation / completion year", graduationHint: "e.g. 2027", educationProof: "Education proof", educationProofHint: "Optional — PDF, JPG or PNG",
    experienceLevel: "Experience level", skills: "Current skills", skillsHint: "e.g. basic wiring, tools", interestedAreas: "Areas you are interested in", learningFormat: "Learning format", preferredMode: "Preferred mode", preferredDays: "Preferred learning days", preferredTime: "Preferred time", availability: "Availability", availabilityHint: "e.g. 6 PM to 9 PM on weekdays",
    learningGoals: "What do you want to achieve?", careerGoal: "Career goal", careerGoalHint: "Tell us what kind of career or work you want to build...", certificationInterest: "Certification interest", profilePhoto: "Profile photo", profilePhotoHint: "Optional — JPG or PNG",
    password: "Create password", passwordHint: "Minimum 8 characters", confirmPassword: "Confirm password", confirmHint: "Re-enter your password", termsStart: "I agree to the", termsLink: "Terms & Conditions", and: "and", privacyLink: "Privacy Policy", termsEnd: ".", consent: "I consent to NeedOneService reviewing my registration information for learning, training and career opportunities.", securityNote: "Use a strong password and upload only documents you are authorized to share. Your details should be handled securely.",
    back: "Back", next: "Save & Continue", submit: "Create Student Profile", safe: "Your details should be handled securely", help: "Need help with registration?", contact: "Contact our team", successEyebrow: "REGISTRATION SUBMITTED", successTitle: "Your learning journey starts here.", successDesc: "Your student registration has been captured in this form. Your profile can be reviewed when registration is connected to the OneService backend.", summary: "Registration summary", student: "Student", interest: "Interest", goal: "Goal", frontendNote: "This confirms completion in the frontend only; your details have not been sent to a server.", home: "Back to Home", chooseFile: "Choose a document", selected: "File selected", required: "This field is required.", invalidMobile: "Enter a valid 10-digit Indian mobile number.", invalidEmail: "Enter a valid email address.", invalidPincode: "Enter a valid 6-digit PIN code.", passwordShort: "Use at least 8 characters.", passwordMismatch: "Passwords do not match.", acceptTerms: "You must accept the Terms & Conditions.", acceptConsent: "Please provide consent for your information to be reviewed.", uploadImage: "Choose a JPG, PNG or WEBP image.", uploadDoc: "Choose a PDF, JPG or PNG document.", fileSize: "File size must be 5 MB or less.",
    genderOptions: ["Male", "Female", "Other", "Prefer not to say"], educationOptions: ["School", "Intermediate / 12th", "ITI", "Diploma", "Undergraduate", "Postgraduate", "Vocational Training", "Other"], experienceOptions: ["Beginner", "Some knowledge", "Intermediate", "Experienced"], formatOptions: ["Online", "Offline", "Online & Offline"], modeOptions: ["Live classes", "Self-paced learning", "Practical training", "Mixed learning"], timeOptions: ["Morning", "Afternoon", "Evening", "Weekends"], certificationOptions: ["Yes, I want certification", "Maybe, depending on the course", "No, skills are my priority"], interests: interestOptions, goals: goalOptions, days: dayOptions,
  },
  te: {
    language: "భాష", english: "ఇంగ్లీష్", telugu: "తెలుగు", hindi: "హిందీ", signIn: "ఇప్పటికే నమోదు చేసుకున్నారా?", login: "సైన్ ఇన్",
    network: "వన్‌సర్వీస్ లెర్నింగ్ నెట్‌వర్క్", eyebrow: "విద్యార్థి నమోదు", heading: "నైపుణ్యాలు నేర్చుకోండి.", brand: "మీ భవిష్యత్తును నిర్మించుకోండి.",
    intro: "ప్రాయోగిక నైపుణ్యాలు అభివృద్ధి చేసుకోవడానికి, అనుభవం పొందడానికి, శిక్షణ పొందడానికి మరియు కెరీర్ అవకాశాలను అన్వేషించడానికి NeedOneService లెర్నింగ్ నెట్‌వర్క్‌లో చేరండి.", secure: "సురక్షిత విద్యార్థి నమోదు",
    step: "దశ", of: "లో", completed: "పూర్తి", stepNames: [["వ్యక్తిగత సమాచారం", "మీ గుర్తింపు మరియు సంప్రదింపు వివరాలు"], ["చిరునామా & ప్రాంతం", "మీరు నివసించే ప్రాంతం"], ["విద్య", "మీ ప్రస్తుత లేదా ఇటీవలి విద్య"], ["నైపుణ్యాలు & ఆసక్తులు", "మీ నైపుణ్యాలు మరియు నేర్చుకోవాలనుకునే అంశాలు"], ["అభ్యాసం & లక్ష్యాలు", "మీ షెడ్యూల్ మరియు కెరీర్ లక్ష్యాలు"], ["ఖాతా & సమ్మతి", "ఖాతాను సురక్షితం చేసి సమ్మతిని నిర్ధారించండి"]],
    personalTitle: "వ్యక్తిగత సమాచారం", personalDesc: "OneService బృందం మిమ్మల్ని గుర్తించి సంప్రదించేందుకు మీ వివరాలను నమోదు చేయండి.", addressTitle: "చిరునామా & ప్రాంతం", addressDesc: "మీకు తగిన అభ్యాసం మరియు శిక్షణ అవకాశాలను అందించేందుకు మీ ప్రాంతాన్ని నమోదు చేయండి.", educationTitle: "విద్య", educationDesc: "మీ ప్రస్తుత లేదా ఇటీవలి విద్య వివరాలను నమోదు చేసి, అవసరమైతే ఆధార పత్రాన్ని జోడించండి.", skillsTitle: "నైపుణ్యాలు & ఆసక్తులు", skillsDesc: "మీరు నేర్చుకోవాలనుకునే సేవా రంగాలను ఎంచుకుని, ప్రస్తుత అనుభవాన్ని వివరించండి.", learningTitle: "అభ్యాస ప్రాధాన్యతలు & లక్ష్యాలు", learningDesc: "మీరు ఎప్పుడు, ఎలా నేర్చుకోవాలనుకుంటున్నారో మరియు ఏమి సాధించాలనుకుంటున్నారో తెలియజేయండి.", securityTitle: "ఖాతా & సమ్మతి", securityDesc: "సురక్షిత లాగిన్ వివరాలను సృష్టించి అవసరమైన సమ్మతులను నిర్ధారించండి.",
    fullName: "పూర్తి పేరు", fullNameHint: "మీ పూర్తి పేరు నమోదు చేయండి", mobile: "మొబైల్ నంబర్", mobileHint: "10 అంకెల మొబైల్ నంబర్", whatsapp: "వాట్సాప్ నంబర్", whatsappHint: "వేరుగా ఉంటే వాట్సాప్ నంబర్", email: "ఈమెయిల్ చిరునామా", emailHint: "student@example.com", dob: "పుట్టిన తేదీ", gender: "లింగం", choose: "ఎంచుకోండి",
    address: "పూర్తి చిరునామా", addressHint: "ఇల్లు / వీధి, ప్రాంతం మరియు గుర్తింపు స్థలం", city: "నగరం", cityHint: "నగరం నమోదు చేయండి", state: "రాష్ట్రం", stateHint: "రాష్ట్రం నమోదు చేయండి", pincode: "పిన్ కోడ్", pincodeHint: "6 అంకెల పిన్ కోడ్",
    educationLevel: "విద్యా స్థాయి", course: "కోర్సు / ప్రోగ్రామ్", courseHint: "ఉదా. ఎలక్ట్రికల్ డిప్లొమా", institution: "విద్యాసంస్థ", institutionHint: "కళాశాల / పాఠశాల / సంస్థ", specialization: "ప్రత్యేకత", specializationHint: "మీ ప్రత్యేకత", graduationYear: "పూర్తి చేసిన సంవత్సరం", graduationHint: "ఉదా. 2027", educationProof: "విద్యా ఆధారం", educationProofHint: "ఐచ్ఛికం — PDF, JPG లేదా PNG",
    experienceLevel: "అనుభవ స్థాయి", skills: "ప్రస్తుత నైపుణ్యాలు", skillsHint: "ఉదా. ప్రాథమిక వైరింగ్, పరికరాలు", interestedAreas: "మీ ఆసక్తి రంగాలు", learningFormat: "అభ్యాస విధానం", preferredMode: "ప్రాధాన్య అభ్యాస పద్ధతి", preferredDays: "అభ్యాస రోజులు", preferredTime: "ప్రాధాన్య సమయం", availability: "అందుబాటు", availabilityHint: "ఉదా. వారపు రోజుల్లో సాయంత్రం 6–9",
    learningGoals: "మీరు ఏమి సాధించాలనుకుంటున్నారు?", careerGoal: "కెరీర్ లక్ష్యం", careerGoalHint: "మీరు నిర్మించాలనుకునే కెరీర్ లేదా పనిని వివరించండి...", certificationInterest: "సర్టిఫికేషన్ ఆసక్తి", profilePhoto: "ప్రొఫైల్ ఫోటో", profilePhotoHint: "ఐచ్ఛికం — JPG లేదా PNG",
    password: "పాస్‌వర్డ్ సృష్టించండి", passwordHint: "కనీసం 8 అక్షరాలు", confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి", confirmHint: "మళ్లీ పాస్‌వర్డ్ నమోదు చేయండి", termsStart: "నేను అంగీకరిస్తున్నాను:", termsLink: "నిబంధనలు", and: "మరియు", privacyLink: "గోప్యతా విధానం", termsEnd: ".", consent: "అభ్యాసం, శిక్షణ మరియు కెరీర్ అవకాశాల కోసం నా నమోదు వివరాలను NeedOneService పరిశీలించడానికి నేను సమ్మతిస్తున్నాను.", securityNote: "బలమైన పాస్‌వర్డ్ ఉపయోగించండి. మీరు పంచుకోవడానికి అనుమతి ఉన్న పత్రాలను మాత్రమే అప్‌లోడ్ చేయండి. మీ వివరాలను సురక్షితంగా నిర్వహించాలి.",
    back: "వెనక్కి", next: "సేవ్ చేసి కొనసాగించండి", submit: "విద్యార్థి ప్రొఫైల్ సృష్టించండి", safe: "మీ వివరాలు సురక్షితంగా నిర్వహించబడతాయి", help: "నమోదులో సహాయం కావాలా?", contact: "మా బృందాన్ని సంప్రదించండి", successEyebrow: "నమోదు సమర్పించబడింది", successTitle: "మీ అభ్యాస ప్రయాణం ఇక్కడ ప్రారంభమవుతుంది.", successDesc: "ఈ ఫారమ్‌లో మీ విద్యార్థి నమోదు వివరాలు నమోదు చేయబడ్డాయి. OneService బ్యాక్‌ఎండ్‌తో అనుసంధానించిన తర్వాత మీ ప్రొఫైల్‌ను సమీక్షించవచ్చు.", summary: "నమోదు సారాంశం", student: "విద్యార్థి", interest: "ఆసక్తి", goal: "లక్ష్యం", frontendNote: "ఇది ఫ్రంట్‌ఎండ్‌లో మాత్రమే పూర్తయినట్లు చూపిస్తుంది; మీ వివరాలు సర్వర్‌కు పంపబడలేదు.", home: "హోమ్‌కు తిరిగి వెళ్లండి", chooseFile: "పత్రాన్ని ఎంచుకోండి", selected: "ఫైల్ ఎంచుకోబడింది", required: "ఈ ఫీల్డ్ తప్పనిసరి.", invalidMobile: "చెల్లుబాటు అయ్యే 10 అంకెల భారతీయ మొబైల్ నంబర్ నమోదు చేయండి.", invalidEmail: "చెల్లుబాటు అయ్యే ఈమెయిల్ చిరునామా నమోదు చేయండి.", invalidPincode: "చెల్లుబాటు అయ్యే 6 అంకెల పిన్ కోడ్ నమోదు చేయండి.", passwordShort: "కనీసం 8 అక్షరాలు ఉపయోగించండి.", passwordMismatch: "పాస్‌వర్డ్‌లు సరిపోలడం లేదు.", acceptTerms: "నిబంధనలకు అంగీకరించాలి.", acceptConsent: "మీ వివరాలను సమీక్షించడానికి సమ్మతి ఇవ్వండి.", uploadImage: "JPG, PNG లేదా WEBP చిత్రాన్ని ఎంచుకోండి.", uploadDoc: "PDF, JPG లేదా PNG పత్రాన్ని ఎంచుకోండి.", fileSize: "ఫైల్ పరిమాణం 5 MB లేదా అంతకంటే తక్కువ ఉండాలి.",
    genderOptions: ["పురుషుడు", "స్త్రీ", "ఇతరులు", "చెప్పదలచుకోలేదు"], educationOptions: ["పాఠశాల", "ఇంటర్మీడియట్ / 12వ తరగతి", "ITI", "డిప్లొమా", "అండర్‌గ్రాడ్యుయేట్", "పోస్ట్‌గ్రాడ్యుయేట్", "వృత్తి శిక్షణ", "ఇతరులు"], experienceOptions: ["ప్రారంభ స్థాయి", "కొంత పరిజ్ఞానం", "మధ్యస్థం", "అనుభవం ఉంది"], formatOptions: ["ఆన్‌లైన్", "ఆఫ్‌లైన్", "ఆన్‌లైన్ & ఆఫ్‌లైన్"], modeOptions: ["ప్రత్యక్ష తరగతులు", "స్వీయ అభ్యాసం", "ప్రాయోగిక శిక్షణ", "మిశ్రమ అభ్యాసం"], timeOptions: ["ఉదయం", "మధ్యాహ్నం", "సాయంత్రం", "వారాంతాలు"], certificationOptions: ["అవును, సర్టిఫికేషన్ కావాలి", "కోర్సును బట్టి ఉండవచ్చు", "లేదు, నైపుణ్యాలే ముఖ్యం"], interests: ["ఏసీ & కూలింగ్", "ఎలక్ట్రికల్", "ప్లంబింగ్", "కార్పెంట్రీ", "గృహోపకరణాలు", "క్లీనింగ్", "నీటి శుద్ధి", "రిఫ్రిజరేషన్", "వాషింగ్ మెషీన్ రిపేర్", "టీవీ రిపేర్", "గృహ నిర్వహణ", "ఇతరులు"], goals: ["కొత్త నైపుణ్యం నేర్చుకోవడం", "ప్రస్తుత నైపుణ్యాలను మెరుగుపరచడం", "సర్టిఫికేషన్ పొందడం", "టెక్నీషియన్ కావడం", "ఉద్యోగం పొందడం", "సేవా వ్యాపారం ప్రారంభించడం", "ఫ్రీలాన్సర్‌గా పని చేయడం", "ప్రాయోగిక అనుభవం పొందడం"], days: ["సోమవారం", "మంగళవారం", "బుధవారం", "గురువారం", "శుక్రవారం", "శనివారం", "ఆదివారం"],
  },
  hi: {
    language: "भाषा", english: "अंग्रेज़ी", telugu: "तेलुगु", hindi: "हिन्दी", signIn: "पहले से पंजीकृत हैं?", login: "साइन इन",
    network: "ONESERVICE लर्निंग नेटवर्क", eyebrow: "विद्यार्थी पंजीकरण", heading: "कौशल सीखें।", brand: "अपना भविष्य बनाएं।",
    intro: "व्यावहारिक कौशल विकसित करने, अनुभव प्राप्त करने, प्रशिक्षण लेने और करियर के अवसर खोजने के लिए NeedOneService लर्निंग नेटवर्क से जुड़ें।", secure: "सुरक्षित विद्यार्थी पंजीकरण",
    step: "चरण", of: "में से", completed: "पूर्ण", stepNames: [["व्यक्तिगत जानकारी", "आपकी पहचान और संपर्क विवरण"], ["पता और स्थान", "आपका निवास स्थान"], ["शिक्षा", "आपकी वर्तमान या पिछली शिक्षा"], ["कौशल और रुचियां", "आपके कौशल और सीखने के क्षेत्र"], ["सीखना और लक्ष्य", "आपकी समय-सारणी और करियर लक्ष्य"], ["खाता और सहमति", "खाता सुरक्षित करें और सहमति दें"]],
    personalTitle: "व्यक्तिगत जानकारी", personalDesc: "OneService टीम को आपकी पहचान और संपर्क करने में मदद के लिए विवरण दें।", addressTitle: "पता और स्थान", addressDesc: "उपयुक्त सीखने और प्रशिक्षण के अवसर साझा करने के लिए अपना स्थान बताएं।", educationTitle: "शिक्षा", educationDesc: "अपनी वर्तमान या पिछली शिक्षा बताएं और चाहें तो प्रमाण-पत्र जोड़ें।", skillsTitle: "कौशल और रुचियां", skillsDesc: "वे सेवा क्षेत्र चुनें जिन्हें आप सीखना या विकसित करना चाहते हैं।", learningTitle: "सीखने की पसंद और लक्ष्य", learningDesc: "बताएं कि आप कब और कैसे सीखना चाहते हैं और क्या हासिल करना चाहते हैं।", securityTitle: "खाता और सहमति", securityDesc: "सुरक्षित लॉगिन विवरण बनाएं और आवश्यक सहमति की पुष्टि करें।",
    fullName: "पूरा नाम", fullNameHint: "अपना पूरा नाम दर्ज करें", mobile: "मोबाइल नंबर", mobileHint: "10 अंकों का मोबाइल नंबर", whatsapp: "व्हाट्सऐप नंबर", whatsappHint: "अलग होने पर व्हाट्सऐप नंबर", email: "ईमेल पता", emailHint: "student@example.com", dob: "जन्म तिथि", gender: "लिंग", choose: "विकल्प चुनें",
    address: "पूरा पता", addressHint: "मकान / सड़क, क्षेत्र और पहचान-चिह्न", city: "शहर", cityHint: "शहर दर्ज करें", state: "राज्य", stateHint: "राज्य दर्ज करें", pincode: "पिन कोड", pincodeHint: "6 अंकों का पिन कोड",
    educationLevel: "शिक्षा का स्तर", course: "कोर्स / कार्यक्रम", courseHint: "जैसे इलेक्ट्रिकल में डिप्लोमा", institution: "संस्थान", institutionHint: "कॉलेज / स्कूल / संस्थान", specialization: "विशेषज्ञता", specializationHint: "अपनी विशेषज्ञता", graduationYear: "पूरा करने का वर्ष", graduationHint: "जैसे 2027", educationProof: "शिक्षा प्रमाण", educationProofHint: "वैकल्पिक — PDF, JPG या PNG",
    experienceLevel: "अनुभव का स्तर", skills: "वर्तमान कौशल", skillsHint: "जैसे बुनियादी वायरिंग, उपकरण", interestedAreas: "आपकी रुचि के क्षेत्र", learningFormat: "सीखने का प्रारूप", preferredMode: "पसंदीदा तरीका", preferredDays: "पसंदीदा दिन", preferredTime: "पसंदीदा समय", availability: "उपलब्धता", availabilityHint: "जैसे कार्यदिवसों में शाम 6 से 9 बजे",
    learningGoals: "आप क्या हासिल करना चाहते हैं?", careerGoal: "करियर लक्ष्य", careerGoalHint: "बताएं कि आप किस तरह का करियर या काम बनाना चाहते हैं...", certificationInterest: "प्रमाणपत्र में रुचि", profilePhoto: "प्रोफ़ाइल फोटो", profilePhotoHint: "वैकल्पिक — JPG या PNG",
    password: "पासवर्ड बनाएं", passwordHint: "कम से कम 8 अक्षर", confirmPassword: "पासवर्ड की पुष्टि करें", confirmHint: "पासवर्ड दोबारा दर्ज करें", termsStart: "मैं सहमत हूं:", termsLink: "नियम और शर्तें", and: "और", privacyLink: "गोपनीयता नीति", termsEnd: "।", consent: "मैं सीखने, प्रशिक्षण और करियर अवसरों के लिए NeedOneService को मेरी पंजीकरण जानकारी की समीक्षा करने की सहमति देता/देती हूं।", securityNote: "मजबूत पासवर्ड इस्तेमाल करें और केवल वही दस्तावेज़ अपलोड करें जिन्हें साझा करने की अनुमति है। आपके विवरण सुरक्षित रखे जाने चाहिए।",
    back: "वापस", next: "सहेजें और जारी रखें", submit: "विद्यार्थी प्रोफ़ाइल बनाएं", safe: "आपके विवरण सुरक्षित रखे जाने चाहिए", help: "पंजीकरण में सहायता चाहिए?", contact: "हमारी टीम से संपर्क करें", successEyebrow: "पंजीकरण जमा हुआ", successTitle: "आपकी सीखने की यात्रा यहीं से शुरू होती है।", successDesc: "इस फ़ॉर्म में आपका विद्यार्थी पंजीकरण दर्ज किया गया है। OneService बैकएंड से जुड़ने के बाद प्रोफ़ाइल की समीक्षा की जा सकती है।", summary: "पंजीकरण सारांश", student: "विद्यार्थी", interest: "रुचि", goal: "लक्ष्य", frontendNote: "यह केवल फ्रंटएंड में पूर्णता दिखाता है; विवरण सर्वर पर नहीं भेजे गए हैं।", home: "होम पर वापस जाएं", chooseFile: "दस्तावेज़ चुनें", selected: "फ़ाइल चुनी गई", required: "यह फ़ील्ड आवश्यक है।", invalidMobile: "मान्य 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।", invalidEmail: "मान्य ईमेल पता दर्ज करें।", invalidPincode: "मान्य 6 अंकों का पिन कोड दर्ज करें।", passwordShort: "कम से कम 8 अक्षर इस्तेमाल करें।", passwordMismatch: "पासवर्ड मेल नहीं खाते।", acceptTerms: "नियम और शर्तें स्वीकार करें।", acceptConsent: "जानकारी की समीक्षा के लिए सहमति दें।", uploadImage: "JPG, PNG या WEBP छवि चुनें।", uploadDoc: "PDF, JPG या PNG दस्तावेज़ चुनें।", fileSize: "फ़ाइल का आकार 5 MB या कम होना चाहिए।",
    genderOptions: ["पुरुष", "महिला", "अन्य", "बताना नहीं चाहते"], educationOptions: ["स्कूल", "इंटरमीडिएट / 12वीं", "ITI", "डिप्लोमा", "स्नातक", "स्नातकोत्तर", "व्यावसायिक प्रशिक्षण", "अन्य"], experienceOptions: ["शुरुआती", "कुछ जानकारी", "मध्यम स्तर", "अनुभवी"], formatOptions: ["ऑनलाइन", "ऑफ़लाइन", "ऑनलाइन और ऑफ़लाइन"], modeOptions: ["लाइव कक्षाएं", "अपनी गति से सीखना", "व्यावहारिक प्रशिक्षण", "मिश्रित सीखना"], timeOptions: ["सुबह", "दोपहर", "शाम", "सप्ताहांत"], certificationOptions: ["हां, प्रमाणपत्र चाहिए", "कोर्स पर निर्भर करेगा", "नहीं, कौशल प्राथमिकता है"], interests: ["एसी और कूलिंग", "इलेक्ट्रिकल", "प्लंबिंग", "बढ़ईगीरी", "घरेलू उपकरण", "सफाई", "जल शुद्धिकरण", "रेफ्रिजरेशन", "वॉशिंग मशीन मरम्मत", "टीवी मरम्मत", "घर का रखरखाव", "अन्य"], goals: ["नया कौशल सीखना", "मौजूदा कौशल सुधारना", "प्रमाणपत्र प्राप्त करना", "तकनीशियन बनना", "रोज़गार पाना", "सेवा व्यवसाय शुरू करना", "फ्रीलांसर के रूप में काम करना", "व्यावहारिक अनुभव बनाना"], days: ["सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार", "रविवार"],
  },
} as const;

type StringField = { [K in keyof StudentFormData]: StudentFormData[K] extends string ? K : never }[keyof StudentFormData];


function StudentRegisterPage() {
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];
  const [form, setForm] = useState<StudentFormData>(initialForm);
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const progress = Math.round(((step + 1) / 6) * 100);
  const update = (name: keyof StudentFormData, value: StudentFormData[keyof StudentFormData]) => {
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === "checkbox") update(target.name as keyof StudentFormData, target.checked);
    else update(target.name as keyof StudentFormData, target.value);
  };
  const handleFile = (event: ChangeEvent<HTMLInputElement>, name: "profilePhoto" | "educationProof") => {
    const file = event.target.files?.[0] ?? null;
    if (file && file.size > 5 * 1024 * 1024) { setErrors((p) => ({ ...p, [name]: t.fileSize })); event.target.value = ""; return; }
    if (file && name === "profilePhoto" && !["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setErrors((p) => ({ ...p, [name]: t.uploadImage })); event.target.value = ""; return; }
    if (file && name === "educationProof" && !["application/pdf", "image/jpeg", "image/png"].includes(file.type)) { setErrors((p) => ({ ...p, [name]: t.uploadDoc })); event.target.value = ""; return; }
    update(name, file);
  };
  const toggleArray = (name: "interestedAreas" | "preferredDays" | "learningGoals", value: string) => {
    const current = form[name];
    update(name, current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };
  const validateStep = (index: number) => {
    const nextErrors: Partial<Record<keyof StudentFormData, string>> = {};
    const required = (key: keyof StudentFormData, condition = true) => { if (condition) nextErrors[key] = t.required; };
    if (index === 0) {
      required("fullName", !form.fullName.trim());
      if (!/^[6-9]\d{9}$/.test(form.mobile)) nextErrors.mobile = t.invalidMobile;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = t.invalidEmail;
      required("dob", !form.dob); required("gender", !form.gender);
    }
    if (index === 1) {
      required("address", !form.address.trim()); required("city", !form.city.trim()); required("state", !form.state.trim());
      if (!/^\d{6}$/.test(form.pincode)) nextErrors.pincode = t.invalidPincode;
    }
    if (index === 2) {
      required("educationLevel", !form.educationLevel); required("course", !form.course.trim()); required("institution", !form.institution.trim());
      if (form.graduationYear && !/^\d{4}$/.test(form.graduationYear)) nextErrors.graduationYear = t.required;
    }
    if (index === 3) {
      required("experienceLevel", !form.experienceLevel); required("interestedAreas", !form.interestedAreas.length);
    }
    if (index === 4) {
      required("learningFormat", !form.learningFormat); required("preferredMode", !form.preferredMode); required("preferredDays", !form.preferredDays.length);
      required("preferredTime", !form.preferredTime); required("availability", !form.availability.trim()); required("learningGoals", !form.learningGoals.length);
      required("careerGoal", !form.careerGoal.trim()); required("certificationInterest", !form.certificationInterest);
    }
    if (index === 5) {
      if (form.password.length < 8) nextErrors.password = t.passwordShort;
      if (form.password !== form.confirmPassword) nextErrors.confirmPassword = t.passwordMismatch;
      if (!form.terms) nextErrors.terms = t.acceptTerms;
      if (!form.consent) nextErrors.consent = t.acceptConsent;
    }
    setErrors((previous) => ({ ...previous, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };
  const goNext = () => { if (validateStep(step)) { setStep((current) => Math.min(5, current + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); } };
  const goBack = () => { setStep((current) => Math.max(0, current - 1)); setErrors({}); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStep(5)) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const field = (name: StringField, label: string, placeholder = "", type = "text", options?: readonly string[], full = false, required = false) => (
    <label className={`partner-field${full ? " partner-field-full" : ""}`} key={name}>
      <span>{label}{required && <b className="partner-required"> *</b>}</span>
      {options ? <select id={name} name={name} value={form[name] as string} onChange={handleChange} aria-invalid={Boolean(errors[name])}><option value="">{t.choose}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input id={name} name={name} type={type} value={form[name] as string} onChange={handleChange} placeholder={placeholder} aria-invalid={Boolean(errors[name])} maxLength={name === "mobile" || name === "whatsapp" ? 10 : name === "pincode" ? 6 : undefined} autoComplete={name === "password" || name === "confirmPassword" ? "new-password" : undefined} />}
      {errors[name] && <small className="partner-form-error">{errors[name]}</small>}
    </label>
  );
  const textarea = (name: "address" | "careerGoal", label: string, placeholder: string, full = false) => (
    <label className={`partner-field${full ? " partner-field-full" : ""}`} key={name}><span>{label}<b className="partner-required"> *</b></span><textarea id={name} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} rows={4} aria-invalid={Boolean(errors[name])} />{errors[name] && <small className="partner-form-error">{errors[name]}</small>}</label>
  );
  const fileField = (name: "profilePhoto" | "educationProof", label: string, hint: string) => (
    <label className="partner-field" key={name}><span>{label}</span><input className="partner-file-input" id={name} type="file" accept={name === "profilePhoto" ? ".jpg,.jpeg,.png,.webp" : ".pdf,.jpg,.jpeg,.png"} onChange={(event) => handleFile(event, name)} /><span className="partner-upload-box"><Upload size={19} /><strong>{form[name]?.name ?? t.chooseFile}</strong><small>{form[name] ? `${Math.max(1, Math.round(form[name]!.size / 1024))} KB` : hint}</small></span>{errors[name] && <small className="partner-form-error">{errors[name]}</small>}</label>
  );
  const passwordField = (name: "password" | "confirmPassword", label: string, visible: boolean, toggle: () => void, placeholder: string) => (
    <label className="partner-field" key={name}><span>{label}<b className="partner-required"> *</b></span><span className="partner-input-wrap"><input id={name} name={name} type={visible ? "text" : "password"} value={form[name]} onChange={handleChange} placeholder={placeholder} autoComplete="new-password" aria-invalid={Boolean(errors[name])} /><button type="button" className="partner-password-toggle" onClick={toggle} aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{errors[name] && <small className="partner-form-error">{errors[name]}</small>}</label>
  );
  const chips = (name: "interestedAreas" | "preferredDays" | "learningGoals", label: string, options: readonly string[], full = true) => (
    <div className={`partner-field${full ? " partner-field-full" : ""}`} key={name}><span className="partner-field-label">{label}<b className="partner-required"> *</b></span><div className="partner-choice-grid">{options.map((option) => { const selected = form[name].includes(option); return <button type="button" key={option} className={`partner-choice-chip${selected ? " selected" : ""}`} onClick={() => toggleArray(name, option)} aria-pressed={selected}>{selected && <Check size={14} />} {option}</button>; })}</div>{errors[name] && <small className="partner-form-error">{errors[name]}</small>}</div>
  );

  const stepContent = [
    <div className="partner-form-grid" key="personal">{field("fullName", t.fullName, t.fullNameHint, "text", undefined, true, true)}{field("mobile", t.mobile, t.mobileHint, "tel", undefined, false, true)}{field("whatsapp", t.whatsapp, t.whatsappHint, "tel")}{field("email", t.email, t.emailHint, "email", undefined, true, true)}{field("dob", t.dob, "", "date", undefined, false, true)}{field("gender", t.gender, "", "text", t.genderOptions, false, true)}</div>,
    <div className="partner-form-grid" key="address">{textarea("address", t.address, t.addressHint, true)}{field("city", t.city, t.cityHint, "text", undefined, false, true)}{field("state", t.state, t.stateHint, "text", undefined, false, true)}{field("pincode", t.pincode, t.pincodeHint, "text", undefined, false, true)}</div>,
    <div className="partner-form-grid" key="education">{field("educationLevel", t.educationLevel, "", "text", t.educationOptions, false, true)}{field("course", t.course, t.courseHint, "text", undefined, false, true)}{field("institution", t.institution, t.institutionHint, "text", undefined, false, true)}{field("specialization", t.specialization, t.specializationHint)}{field("graduationYear", t.graduationYear, t.graduationHint)}{fileField("educationProof", t.educationProof, t.educationProofHint)}</div>,
    <div className="partner-form-grid" key="skills">{field("experienceLevel", t.experienceLevel, "", "text", t.experienceOptions, false, true)}{field("skills", t.skills, t.skillsHint)}{chips("interestedAreas", t.interestedAreas, t.interests)}</div>,
    <div className="partner-form-grid" key="learning">{field("learningFormat", t.learningFormat, "", "text", t.formatOptions, false, true)}{field("preferredMode", t.preferredMode, "", "text", t.modeOptions, false, true)}{chips("preferredDays", t.preferredDays, t.days)}{field("preferredTime", t.preferredTime, "", "text", t.timeOptions, false, true)}{field("availability", t.availability, t.availabilityHint, "text", undefined, false, true)}{chips("learningGoals", t.learningGoals, t.goals)}{textarea("careerGoal", t.careerGoal, t.careerGoalHint, true)}{field("certificationInterest", t.certificationInterest, "", "text", t.certificationOptions, false, true)}{fileField("profilePhoto", t.profilePhoto, t.profilePhotoHint)}</div>,
    <div className="partner-form-grid" key="security"><div className="partner-field-full partner-form-grid">{passwordField("password", t.password, showPassword, () => setShowPassword((value) => !value), t.passwordHint)}{passwordField("confirmPassword", t.confirmPassword, showConfirmPassword, () => setShowConfirmPassword((value) => !value), t.confirmHint)}</div><div className="partner-field-full partner-consent-list"><label className="partner-consent"><input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} aria-invalid={Boolean(errors.terms)} /><span>{t.termsStart} <Link to="/terms" target="_blank" rel="noreferrer">{t.termsLink}</Link> {t.and} <Link to="/privacy" target="_blank" rel="noreferrer">{t.privacyLink}</Link>{t.termsEnd}<b className="partner-required"> *</b>{errors.terms && <small className="partner-form-error">{errors.terms}</small>}</span></label><label className="partner-consent"><input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} aria-invalid={Boolean(errors.consent)} /><span>{t.consent}<b className="partner-required"> *</b>{errors.consent && <small className="partner-form-error">{errors.consent}</small>}</span></label></div><div className="partner-field-full partner-secure-note"><ShieldCheck size={17} /><span>{t.securityNote}</span></div></div>,
  ];

  if (submitted) return <main className="partner-register-page"><section className="partner-wizard"><header className="partner-wizard-header"><Link to="/" className="partner-brand"><span className="partner-brand-mark"><GraduationCap size={20} /></span><span><strong>NeedOneService</strong><small>{t.network}</small></span></Link><LanguagePicker language={language} setLanguage={setLanguage} t={t} /></header><section className="partner-wizard-card partner-success-card"><div className="partner-success-icon"><CheckCircle2 size={34} /></div><span className="partner-eyebrow">{t.successEyebrow}</span><h1>{t.successTitle}</h1><p>{t.successDesc}</p><div className="partner-review-summary"><h3>{t.summary}</h3><p><strong>{t.student}</strong><span>{form.fullName}</span></p><p><strong>{t.email}</strong><span>{form.email}</span></p><p><strong>{t.interest}</strong><span>{form.interestedAreas[0] ?? "—"}</span></p><p><strong>{t.goal}</strong><span>{form.learningGoals[0] ?? "—"}</span></p></div><p>{t.frontendNote}</p><Link to="/" className="partner-submit-button">{t.home}<ArrowRight size={16} /></Link></section></section></main>;

  const titles = [t.personalTitle, t.addressTitle, t.educationTitle, t.skillsTitle, t.learningTitle, t.securityTitle];
  const descriptions = [t.personalDesc, t.addressDesc, t.educationDesc, t.skillsDesc, t.learningDesc, t.securityDesc];
  return <main className="partner-register-page"><section className="partner-wizard">
    <header className="partner-wizard-header"><Link to="/" className="partner-brand"><span className="partner-brand-mark"><GraduationCap size={20} /></span><span><strong>NeedOneService</strong><small>{t.network}</small></span></Link><div className="partner-header-actions"><LanguagePicker language={language} setLanguage={setLanguage} t={t} /><div className="partner-login-note">{t.signIn} <Link to="/login">{t.login}</Link></div></div></header>
    <div className="partner-wizard-intro"><div><span className="partner-eyebrow">{t.eyebrow}</span><h1>{t.heading} <span>{t.brand}</span></h1><p>{t.intro}</p></div><div className="partner-secure-note"><LockKeyhole size={16} /><span>{t.secure}</span></div></div>
    <div className="partner-wizard-card"><div className="partner-progress-header"><div><span className="partner-step-count">{t.step} {String(step + 1).padStart(2, "0")} {t.of} 06</span><h2>{t.stepNames[step][0]}</h2><p>{t.stepNames[step][1]}</p></div><div className="partner-progress-percent">{progress}% <span>{t.completed}</span></div></div>
      <div className="partner-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={6} aria-valuenow={step + 1} aria-label={t.intro}><div className="partner-progress-fill" style={{ width: `${progress}%` }} /></div>
      <nav className="partner-step-navigation" aria-label="Registration steps">{t.stepNames.map((item, index) => { const stepLabels = ["Personal", "Address", "Education", "Skills", "Learning", "Account"]; return <button type="button" key={item[0]} className={`partner-step-indicator${index === step ? " active" : ""}${index < step ? " completed" : ""}`} onClick={() => { if (index < step) { setStep(index); setErrors({}); } }} disabled={index >= step} aria-current={index === step ? "step" : undefined} aria-label={item[0]}><span className="partner-step-icon">{String(index + 1).padStart(2, "0")}</span><span className="partner-step-label">{stepLabels[index]}</span></button>; })}</nav>
      <form className="partner-form-content" onSubmit={handleSubmit} noValidate><section className="partner-form-section"><div className="partner-form-heading"><span className="partner-form-number">{String(step + 1).padStart(2, "0")}</span><div><h3>{titles[step]}</h3><p>{descriptions[step]}</p></div></div>{stepContent[step]}</section>
        <footer className="partner-form-footer"><button type="button" className="partner-back-button" onClick={goBack} disabled={step === 0}><ArrowLeft size={16} />{t.back}</button><span className="partner-footer-hint"><LockKeyhole size={13} />{t.safe}</span>{step < 5 ? <button type="button" className="partner-submit-button" onClick={goNext}>{t.next}<ArrowRight size={16} /></button> : <button type="submit" className="partner-submit-button">{t.submit}<Check size={17} /></button>}</footer>
      </form></div><p className="partner-wizard-bottom-note">{t.help} <Link to="/contact">{t.contact}</Link></p>
  </section></main>;
}

function LanguagePicker({ language, setLanguage, t }: { language: Language; setLanguage: (language: Language) => void; t: (typeof translations)[Language] }) {
  return <label className="partner-language-picker"><Languages size={16} /><span>{t.language}</span><select aria-label={t.language} value={language} onChange={(event) => setLanguage(event.target.value as Language)}><option value="en">{t.english}</option><option value="te">{t.telugu}</option><option value="hi">{t.hindi}</option></select></label>;
}

export default StudentRegisterPage;
