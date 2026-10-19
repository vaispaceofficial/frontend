import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BookOpen, BriefcaseBusiness, Check, CheckCircle2,
  Eye, EyeOff, GraduationCap, Languages, LockKeyhole, MapPin, ShieldCheck,
  Upload, UserRound,
} from "lucide-react";
import "./TutorRegisterPage.css";

type Language = "en" | "te" | "hi";
type TutorFormData = {
  fullName: string; profilePhoto: File | null; mobile: string; whatsapp: string; email: string;
  dob: string; gender: string; address: string; city: string; state: string; pincode: string;
  expertise: string; secondaryExpertise: string; qualification: string; specialization: string;
  certifications: string; teachingExperience: string; currentOccupation: string;
  previousTeachingExperience: string; teachingFormat: string; preferredMode: string;
  preferredDays: string; preferredTime: string; availability: string; courseTitle: string;
  courseDescription: string; courseLevel: string; courseDuration: string; sessionFrequency: string;
  practicalTraining: string; certificationProvided: string; qualificationProof: File | null;
  experienceProof: File | null; profileDocument: File | null; password: string;
  confirmPassword: string; terms: boolean; verificationConsent: boolean;
};
const initialForm: TutorFormData = {
  fullName: "", profilePhoto: null, mobile: "", whatsapp: "", email: "", dob: "", gender: "", address: "", city: "", state: "", pincode: "",
  expertise: "", secondaryExpertise: "", qualification: "", specialization: "", certifications: "", teachingExperience: "", currentOccupation: "",
  previousTeachingExperience: "", teachingFormat: "", preferredMode: "", preferredDays: "", preferredTime: "", availability: "", courseTitle: "",
  courseDescription: "", courseLevel: "", courseDuration: "", sessionFrequency: "", practicalTraining: "", certificationProvided: "",
  qualificationProof: null, experienceProof: null, profileDocument: null, password: "", confirmPassword: "", terms: false, verificationConsent: false,
};
const expertiseOptions = ["AC & Cooling", "Electrical", "Plumbing", "Carpentry", "Home Appliances", "Refrigeration", "Washing Machine Repair", "TV Repair", "Water Purification", "Cleaning & Home Maintenance", "Beauty & Personal Services", "Other"];
const experienceOptions = ["No teaching experience", "Less than 1 year", "1–2 years", "3–5 years", "5–10 years", "More than 10 years"];
const levelOptions = ["Beginner", "Intermediate", "Advanced", "All Levels"];
const translations = {
  en: {
    translate: "Language", english: "English", telugu: "Telugu", hindi: "Hindi", signIn: "Already registered?", login: "Sign in",
    network: "ONESERVICE TUTOR NETWORK", eyebrow: "TUTOR & TRAINER REGISTRATION", heading: "Share your skills.", brand: "Shape someone’s future.",
    intro: "Register as a tutor or trainer on OneService. Complete each step to tell us about your expertise, availability, and training offer.", secure: "Secure registration",
    step: "STEP", of: "OF", completed: "completed", steps: [["Personal information", "Your contact details and profile"], ["Address & location", "Where learners can find you"], ["Expertise & qualifications", "Your skills, education and credentials"], ["Teaching experience", "Your background and availability"], ["Course & documents", "Your training offer and supporting files"], ["Account & consent", "Secure your account and confirm consent"]],
    personalTitle: "Personal information", personalDesc: "Start with your basic details so learners and the OneService team can identify and contact you.",
    addressTitle: "Address & location", addressDesc: "Tell us where you are based so learners can find relevant local training.",
    expertiseTitle: "Expertise & qualifications", expertiseDesc: "Share your core skills, education, specializations and professional credentials.",
    experienceTitle: "Teaching experience", experienceDesc: "Tell us about your teaching background, format and availability.",
    courseTitleSection: "Course & documents", courseDesc: "Describe the course or training you offer and add supporting documents.",
    securityTitle: "Account & consent", securityDesc: "Create secure login details and review the required consent statements.",
    fullName: "Full name", fullNameHint: "Enter your full name", mobile: "Mobile number", mobileHint: "10-digit mobile number", whatsapp: "WhatsApp number", whatsappHint: "If different from mobile", email: "Email address", emailHint: "you@example.com", dob: "Date of birth", gender: "Gender", choose: "Select", profilePhoto: "Profile photo", photoHint: "JPG, PNG or WEBP · Max 5 MB",
    address: "Full address", addressHint: "House / street, area and landmark", city: "City", cityHint: "Enter your city", state: "State", stateHint: "Enter your state", pincode: "PIN code", pincodeHint: "6-digit PIN code",
    expertise: "Primary expertise", secondaryExpertise: "Secondary expertise", qualification: "Highest qualification", qualificationHint: "e.g. Diploma, B.Tech, ITI", specialization: "Specialization", specializationHint: "Your subject or technical specialty", certifications: "Certifications", certificationsHint: "List relevant certifications",
    teachingExperience: "Teaching experience", currentOccupation: "Current occupation", occupationHint: "Your current role", previousTeachingExperience: "Previous teaching experience", previousHint: "Describe your teaching background", teachingFormat: "Teaching format", preferredMode: "Preferred teaching mode", preferredDays: "Preferred days", daysHint: "e.g. Weekdays, weekends, Monday–Friday", preferredTime: "Preferred time", availability: "Availability details", availabilityHint: "e.g. 10 hours per week",
    courseName: "Course / training title", courseNameHint: "e.g. Basic AC Repair", courseDescription: "Course description", courseDescriptionHint: "What will learners learn from you?", courseLevel: "Course level", courseDuration: "Course duration", durationHint: "e.g. 4 weeks or 20 hours", sessionFrequency: "Session frequency", practicalTraining: "Practical training included?", certificationProvided: "Certificate provided?", qualificationProof: "Qualification proof", qualificationProofHint: "Certificate or qualification document · Max 5 MB", experienceProof: "Experience proof", experienceProofHint: "Experience letter or related evidence · Max 5 MB", profileDocument: "Additional profile document", profileDocumentHint: "Optional supporting document · Max 5 MB",
    password: "Create password", passwordHint: "At least 8 characters", confirmPassword: "Confirm password", confirmHint: "Re-enter your password", terms: "I agree to the OneService", termsLink: "Terms and Conditions", accurate: "and confirm that the information I provided is accurate.", verification: "I consent to OneService reviewing my details and documents for tutor verification.", securityNote: "Use a strong password and upload only documents you are authorized to share. Documents may be used for verification.",
    back: "Back", continue: "Save & Continue", submit: "Complete registration", safe: "Your details should be handled securely", help: "Need help with registration?", contact: "Contact our team", successEyebrow: "REGISTRATION COMPLETE", successTitle: "Thank you for registering!", successDesc: "Your tutor registration details have been captured. Your profile can be reviewed once the registration form is connected to the OneService backend.", summary: "Registration summary", name: "Name", primaryExpertise: "Primary expertise", teachingExp: "Teaching experience", frontendNote: "This screen confirms completion in the frontend only; it does not submit your details to a server.", home: "Back to Home", chooseFile: "Choose a file to upload", uploaded: "File selected", required: "This field is required.", invalidMobile: "Enter a valid 10-digit Indian mobile number.", invalidEmail: "Enter a valid email address.", invalidPincode: "Enter a valid 6-digit PIN code.", passwordShort: "Use at least 8 characters.", passwordMismatch: "Passwords do not match.", acceptTerms: "You must accept the terms to continue.", acceptVerification: "Please provide consent for document verification.", uploadImage: "Upload a JPG, PNG, or WEBP image.", uploadDoc: "Upload a PDF, JPG, or PNG file.", fileSize: "File size must be 5 MB or less.",
    genderOptions: ["Female", "Male", "Non-binary", "Prefer not to say"], teachingFormats: ["One-to-one", "Group classes", "Both"], modes: ["Online", "In-person", "Hybrid"], times: ["Morning", "Afternoon", "Evening", "Flexible"], levels: levelOptions, frequencies: ["Daily", "2–3 times a week", "Weekly", "Flexible"], yesNo: ["Yes", "No", "Depends on course"], certificateOptions: ["Yes", "No", "Not applicable"],
  },
  te: {
    translate: "భాష", english: "ఇంగ్లీష్", telugu: "తెలుగు", hindi: "హిందీ", signIn: "ఇప్పటికే నమోదు చేసుకున్నారా?", login: "సైన్ ఇన్",
    network: "వన్‌సర్వీస్ ట్యూటర్ నెట్‌వర్క్", eyebrow: "ట్యూటర్ & శిక్షకుల నమోదు", heading: "మీ నైపుణ్యాలను పంచుకోండి.", brand: "మరొకరి భవిష్యత్తును తీర్చిదిద్దండి.",
    intro: "OneServiceలో ట్యూటర్ లేదా శిక్షకుడిగా నమోదు చేసుకోండి. మీ నైపుణ్యం, అందుబాటు మరియు శిక్షణ వివరాలను ప్రతి దశలో నమోదు చేయండి.", secure: "సురక్షిత నమోదు",
    step: "దశ", of: "లో", completed: "పూర్తి", steps: [["వ్యక్తిగత సమాచారం", "మీ సంప్రదింపు వివరాలు మరియు ప్రొఫైల్"], ["చిరునామా & ప్రాంతం", "విద్యార్థులు మిమ్మల్ని కనుగొనే స్థలం"], ["నైపుణ్యాలు & అర్హతలు", "మీ నైపుణ్యాలు, విద్య మరియు ధృవపత్రాలు"], ["బోధనా అనుభవం", "మీ అనుభవం మరియు అందుబాటు"], ["కోర్సు & పత్రాలు", "మీ శిక్షణ మరియు ఆధార పత్రాలు"], ["ఖాతా & సమ్మతి", "ఖాతాను సురక్షితం చేసి సమ్మతిని నిర్ధారించండి"]],
    personalTitle: "వ్యక్తిగత సమాచారం", personalDesc: "విద్యార్థులు మరియు OneService బృందం మిమ్మల్ని గుర్తించి సంప్రదించేందుకు ప్రాథమిక వివరాలను నమోదు చేయండి.", addressTitle: "చిరునామా & ప్రాంతం", addressDesc: "స్థానిక శిక్షణ కోసం మీరు ఎక్కడ ఉన్నారో తెలియజేయండి.", expertiseTitle: "నైపుణ్యాలు & అర్హతలు", expertiseDesc: "మీ నైపుణ్యాలు, విద్య, ప్రత్యేకతలు మరియు వృత్తిపరమైన ధృవపత్రాలను పంచుకోండి.", experienceTitle: "బోధనా అనుభవం", experienceDesc: "మీ బోధనా అనుభవం, విధానం మరియు అందుబాటు గురించి తెలియజేయండి.", courseTitleSection: "కోర్సు & పత్రాలు", courseDesc: "మీరు అందించే కోర్సు లేదా శిక్షణను వివరించి ఆధార పత్రాలను జోడించండి.", securityTitle: "ఖాతా & సమ్మతి", securityDesc: "సురక్షిత లాగిన్ వివరాలను సృష్టించి అవసరమైన సమ్మతులను పరిశీలించండి.",
    fullName: "పూర్తి పేరు", fullNameHint: "మీ పూర్తి పేరు నమోదు చేయండి", mobile: "మొబైల్ నంబర్", mobileHint: "10 అంకెల మొబైల్ నంబర్", whatsapp: "వాట్సాప్ నంబర్", whatsappHint: "మొబైల్‌కు భిన్నంగా ఉంటే", email: "ఇమెయిల్ చిరునామా", emailHint: "you@example.com", dob: "పుట్టిన తేదీ", gender: "లింగం", choose: "ఎంచుకోండి", profilePhoto: "ప్రొఫైల్ ఫోటో", photoHint: "JPG, PNG లేదా WEBP · గరిష్ఠం 5 MB",
    address: "పూర్తి చిరునామా", addressHint: "ఇల్లు / వీధి, ప్రాంతం మరియు ల్యాండ్‌మార్క్", city: "నగరం", cityHint: "నగరం నమోదు చేయండి", state: "రాష్ట్రం", stateHint: "రాష్ట్రం నమోదు చేయండి", pincode: "పిన్ కోడ్", pincodeHint: "6 అంకెల పిన్ కోడ్",
    expertise: "ప్రధాన నైపుణ్యం", secondaryExpertise: "ద్వితీయ నైపుణ్యం", qualification: "అత్యున్నత విద్యార్హత", qualificationHint: "ఉదా. డిప్లొమా, B.Tech, ITI", specialization: "ప్రత్యేకత", specializationHint: "మీ విషయం లేదా సాంకేతిక ప్రత్యేకత", certifications: "ధృవపత్రాలు", certificationsHint: "సంబంధిత ధృవపత్రాలను జాబితా చేయండి",
    teachingExperience: "బోధనా అనుభవం", currentOccupation: "ప్రస్తుత వృత్తి", occupationHint: "మీ ప్రస్తుత పాత్ర", previousTeachingExperience: "గత బోధనా అనుభవం", previousHint: "మీ బోధనా నేపథ్యాన్ని వివరించండి", teachingFormat: "బోధనా విధానం", preferredMode: "ఇష్టమైన బోధనా మోడ్", preferredDays: "ఇష్టమైన రోజులు", daysHint: "ఉదా. వారపు రోజులు, వారాంతాలు", preferredTime: "ఇష్టమైన సమయం", availability: "అందుబాటు వివరాలు", availabilityHint: "ఉదా. వారానికి 10 గంటలు",
    courseName: "కోర్సు / శిక్షణ శీర్షిక", courseNameHint: "ఉదా. ప్రాథమిక AC మరమ్మత్తు", courseDescription: "కోర్సు వివరణ", courseDescriptionHint: "విద్యార్థులు మీ వద్ద ఏమి నేర్చుకుంటారు?", courseLevel: "కోర్సు స్థాయి", courseDuration: "కోర్సు వ్యవధి", durationHint: "ఉదా. 4 వారాలు లేదా 20 గంటలు", sessionFrequency: "సెషన్‌ల తరచుదనం", practicalTraining: "ప్రాక్టికల్ శిక్షణ ఉందా?", certificationProvided: "సర్టిఫికేట్ ఇస్తారా?", qualificationProof: "విద్యార్హత ఆధారం", qualificationProofHint: "సర్టిఫికేట్ లేదా విద్యార్హత పత్రం · గరిష్ఠం 5 MB", experienceProof: "అనుభవ ఆధారం", experienceProofHint: "అనుభవ పత్రం లేదా సంబంధిత ఆధారం · గరిష్ఠం 5 MB", profileDocument: "అదనపు ప్రొఫైల్ పత్రం", profileDocumentHint: "ఐచ్ఛిక ఆధార పత్రం · గరిష్ఠం 5 MB",
    password: "పాస్‌వర్డ్ సృష్టించండి", passwordHint: "కనీసం 8 అక్షరాలు", confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి", confirmHint: "పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి", terms: "నేను OneService", termsLink: "నిబంధనలు మరియు షరతులు", accurate: "కు అంగీకరిస్తున్నాను మరియు ఇచ్చిన సమాచారం నిజమని నిర్ధారిస్తున్నాను.", verification: "ట్యూటర్ ధృవీకరణ కోసం నా వివరాలు మరియు పత్రాలను పరిశీలించడానికి OneServiceకు సమ్మతి ఇస్తున్నాను.", securityNote: "బలమైన పాస్‌వర్డ్ ఉపయోగించండి. మీరు పంచుకోవడానికి అధికారం ఉన్న పత్రాలనే అప్‌లోడ్ చేయండి.",
    back: "వెనుకకు", continue: "సేవ్ చేసి కొనసాగించండి", submit: "నమోదు పూర్తి చేయండి", safe: "మీ వివరాలను సురక్షితంగా నిర్వహించాలి", help: "నమోదులో సహాయం కావాలా?", contact: "మా బృందాన్ని సంప్రదించండి", successEyebrow: "నమోదు పూర్తయింది", successTitle: "నమోదు చేసుకున్నందుకు ధన్యవాదాలు!", successDesc: "మీ ట్యూటర్ నమోదు వివరాలు స్వీకరించబడ్డాయి. OneService బ్యాకెండ్‌కు ఫారమ్ అనుసంధానించిన తర్వాత మీ ప్రొఫైల్‌ను సమీక్షించవచ్చు.", summary: "నమోదు సారాంశం", name: "పేరు", primaryExpertise: "ప్రధాన నైపుణ్యం", teachingExp: "బోధనా అనుభవం", frontendNote: "ఇది ఫ్రంట్‌ఎండ్‌లో మాత్రమే పూర్తయినట్లు చూపిస్తుంది; మీ వివరాలు సర్వర్‌కు పంపబడవు.", home: "హోమ్‌కు తిరిగి వెళ్లండి", chooseFile: "అప్‌లోడ్ చేయడానికి ఫైల్ ఎంచుకోండి", uploaded: "ఫైల్ ఎంచుకోబడింది", required: "ఈ ఫీల్డ్ తప్పనిసరి.", invalidMobile: "చెల్లుబాటు అయ్యే 10 అంకెల భారతీయ మొబైల్ నంబర్ నమోదు చేయండి.", invalidEmail: "చెల్లుబాటు అయ్యే ఇమెయిల్ నమోదు చేయండి.", invalidPincode: "చెల్లుబాటు అయ్యే 6 అంకెల పిన్ కోడ్ నమోదు చేయండి.", passwordShort: "కనీసం 8 అక్షరాలు ఉపయోగించండి.", passwordMismatch: "పాస్‌వర్డ్‌లు సరిపోలడం లేదు.", acceptTerms: "కొనసాగించడానికి నిబంధనలను అంగీకరించాలి.", acceptVerification: "పత్రాల ధృవీకరణకు సమ్మతి ఇవ్వండి.", uploadImage: "JPG, PNG లేదా WEBP చిత్రాన్ని అప్‌లోడ్ చేయండి.", uploadDoc: "PDF, JPG లేదా PNG ఫైల్ అప్‌లోడ్ చేయండి.", fileSize: "ఫైల్ పరిమాణం 5 MB లేదా అంతకంటే తక్కువగా ఉండాలి.",
    genderOptions: ["స్త్రీ", "పురుషుడు", "నాన్-బైనరీ", "చెప్పదలచుకోలేదు"], teachingFormats: ["ఒకరికి ఒకరు", "గ్రూప్ తరగతులు", "రెండూ"], modes: ["ఆన్‌లైన్", "ప్రత్యక్షంగా", "హైబ్రిడ్"], times: ["ఉదయం", "మధ్యాహ్నం", "సాయంత్రం", "అనుకూలం"], levels: ["ప్రారంభ స్థాయి", "మధ్యస్థం", "అధునాతనం", "అన్ని స్థాయిలు"], frequencies: ["ప్రతిరోజూ", "వారానికి 2–3 సార్లు", "వారానికి ఒకసారి", "అనుకూలం"], yesNo: ["అవును", "కాదు", "కోర్సును బట్టి"], certificateOptions: ["అవును", "కాదు", "వర్తించదు"],
  },
  hi: {
    translate: "भाषा", english: "अंग्रेज़ी", telugu: "तेलुगु", hindi: "हिन्दी", signIn: "पहले से पंजीकृत हैं?", login: "साइन इन",
    network: "ONESERVICE ट्यूटर नेटवर्क", eyebrow: "ट्यूटर और प्रशिक्षक पंजीकरण", heading: "अपने कौशल साझा करें।", brand: "किसी का भविष्य सँवारें।", intro: "OneService पर ट्यूटर या प्रशिक्षक के रूप में पंजीकरण करें। अपने कौशल, उपलब्धता और प्रशिक्षण के बारे में चरण-दर-चरण जानकारी दें।", secure: "सुरक्षित पंजीकरण",
    step: "चरण", of: "में से", completed: "पूर्ण", steps: [["व्यक्तिगत जानकारी", "आपका संपर्क विवरण और प्रोफ़ाइल"], ["पता और स्थान", "जहाँ विद्यार्थी आपको खोज सकें"], ["कौशल और योग्यताएँ", "आपके कौशल, शिक्षा और प्रमाणपत्र"], ["शिक्षण अनुभव", "आपकी पृष्ठभूमि और उपलब्धता"], ["कोर्स और दस्तावेज़", "आपका प्रशिक्षण और सहायक फ़ाइलें"], ["खाता और सहमति", "खाता सुरक्षित करें और सहमति की पुष्टि करें"]],
    personalTitle: "व्यक्तिगत जानकारी", personalDesc: "विद्यार्थियों और OneService टीम को आपसे संपर्क करने में मदद के लिए अपनी बुनियादी जानकारी दें।", addressTitle: "पता और स्थान", addressDesc: "स्थानीय प्रशिक्षण के लिए अपना स्थान बताएँ।", expertiseTitle: "कौशल और योग्यताएँ", expertiseDesc: "अपने कौशल, शिक्षा, विशेषज्ञता और पेशेवर प्रमाणपत्र साझा करें।", experienceTitle: "शिक्षण अनुभव", experienceDesc: "अपने शिक्षण अनुभव, तरीके और उपलब्धता के बारे में बताएँ।", courseTitleSection: "कोर्स और दस्तावेज़", courseDesc: "अपने कोर्स या प्रशिक्षण का विवरण दें और सहायक दस्तावेज़ जोड़ें।", securityTitle: "खाता और सहमति", securityDesc: "सुरक्षित लॉगिन बनाएँ और आवश्यक सहमति विवरण पढ़ें।",
    fullName: "पूरा नाम", fullNameHint: "अपना पूरा नाम दर्ज करें", mobile: "मोबाइल नंबर", mobileHint: "10 अंकों का मोबाइल नंबर", whatsapp: "व्हाट्सऐप नंबर", whatsappHint: "मोबाइल से अलग होने पर", email: "ईमेल पता", emailHint: "you@example.com", dob: "जन्म तिथि", gender: "लिंग", choose: "चुनें", profilePhoto: "प्रोफ़ाइल फ़ोटो", photoHint: "JPG, PNG या WEBP · अधिकतम 5 MB", address: "पूरा पता", addressHint: "मकान / सड़क, क्षेत्र और लैंडमार्क", city: "शहर", cityHint: "शहर दर्ज करें", state: "राज्य", stateHint: "राज्य दर्ज करें", pincode: "पिन कोड", pincodeHint: "6 अंकों का पिन कोड",
    expertise: "मुख्य विशेषज्ञता", secondaryExpertise: "द्वितीयक विशेषज्ञता", qualification: "उच्चतम योग्यता", qualificationHint: "जैसे डिप्लोमा, B.Tech, ITI", specialization: "विशेषज्ञता", specializationHint: "आपका विषय या तकनीकी विशेषज्ञता", certifications: "प्रमाणपत्र", certificationsHint: "संबंधित प्रमाणपत्र सूचीबद्ध करें", teachingExperience: "शिक्षण अनुभव", currentOccupation: "वर्तमान पेशा", occupationHint: "आपकी वर्तमान भूमिका", previousTeachingExperience: "पिछला शिक्षण अनुभव", previousHint: "अपने शिक्षण अनुभव का वर्णन करें", teachingFormat: "शिक्षण प्रारूप", preferredMode: "पसंदीदा शिक्षण मोड", preferredDays: "पसंदीदा दिन", daysHint: "जैसे सप्ताह के दिन, सप्ताहांत", preferredTime: "पसंदीदा समय", availability: "उपलब्धता विवरण", availabilityHint: "जैसे प्रति सप्ताह 10 घंटे",
    courseName: "कोर्स / प्रशिक्षण शीर्षक", courseNameHint: "जैसे बेसिक AC मरम्मत", courseDescription: "कोर्स विवरण", courseDescriptionHint: "विद्यार्थी आपसे क्या सीखेंगे?", courseLevel: "कोर्स स्तर", courseDuration: "कोर्स अवधि", durationHint: "जैसे 4 सप्ताह या 20 घंटे", sessionFrequency: "सत्र की आवृत्ति", practicalTraining: "क्या व्यावहारिक प्रशिक्षण शामिल है?", certificationProvided: "क्या प्रमाणपत्र दिया जाएगा?", qualificationProof: "योग्यता प्रमाण", qualificationProofHint: "प्रमाणपत्र या योग्यता दस्तावेज़ · अधिकतम 5 MB", experienceProof: "अनुभव प्रमाण", experienceProofHint: "अनुभव पत्र या संबंधित प्रमाण · अधिकतम 5 MB", profileDocument: "अतिरिक्त प्रोफ़ाइल दस्तावेज़", profileDocumentHint: "वैकल्पिक सहायक दस्तावेज़ · अधिकतम 5 MB",
    password: "पासवर्ड बनाएँ", passwordHint: "कम से कम 8 अक्षर", confirmPassword: "पासवर्ड की पुष्टि करें", confirmHint: "पासवर्ड फिर से दर्ज करें", terms: "मैं OneService की", termsLink: "नियम और शर्तें", accurate: "से सहमत हूँ और पुष्टि करता/करती हूँ कि दी गई जानकारी सही है।", verification: "मैं ट्यूटर सत्यापन के लिए अपने विवरण और दस्तावेज़ों की समीक्षा करने की OneService को सहमति देता/देती हूँ।", securityNote: "मज़बूत पासवर्ड रखें और केवल वही दस्तावेज़ अपलोड करें जिन्हें साझा करने का अधिकार है।", back: "वापस", continue: "सेव करें और आगे बढ़ें", submit: "पंजीकरण पूरा करें", safe: "आपकी जानकारी सुरक्षित रूप से संभाली जानी चाहिए", help: "पंजीकरण में सहायता चाहिए?", contact: "हमारी टीम से संपर्क करें", successEyebrow: "पंजीकरण पूरा हुआ", successTitle: "पंजीकरण करने के लिए धन्यवाद!", successDesc: "आपके ट्यूटर पंजीकरण विवरण दर्ज कर लिए गए हैं। OneService बैकएंड से जुड़ने के बाद आपकी प्रोफ़ाइल की समीक्षा की जा सकती है।", summary: "पंजीकरण सारांश", name: "नाम", primaryExpertise: "मुख्य विशेषज्ञता", teachingExp: "शिक्षण अनुभव", frontendNote: "यह स्क्रीन केवल फ्रंटएंड में पूर्णता की पुष्टि करती है; विवरण सर्वर पर नहीं भेजे जाते।", home: "होम पर वापस जाएँ", chooseFile: "अपलोड करने के लिए फ़ाइल चुनें", uploaded: "फ़ाइल चुनी गई", required: "यह फ़ील्ड आवश्यक है।", invalidMobile: "मान्य 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।", invalidEmail: "मान्य ईमेल पता दर्ज करें।", invalidPincode: "मान्य 6 अंकों का पिन कोड दर्ज करें।", passwordShort: "कम से कम 8 अक्षर उपयोग करें।", passwordMismatch: "पासवर्ड मेल नहीं खाते।", acceptTerms: "आगे बढ़ने के लिए नियम स्वीकार करें।", acceptVerification: "दस्तावेज़ सत्यापन के लिए सहमति दें।", uploadImage: "JPG, PNG या WEBP छवि अपलोड करें।", uploadDoc: "PDF, JPG या PNG फ़ाइल अपलोड करें।", fileSize: "फ़ाइल का आकार 5 MB या उससे कम होना चाहिए।",
    genderOptions: ["महिला", "पुरुष", "नॉन-बाइनरी", "बताना पसंद नहीं"], teachingFormats: ["एक-से-एक", "समूह कक्षाएँ", "दोनों"], modes: ["ऑनलाइन", "व्यक्तिगत रूप से", "हाइब्रिड"], times: ["सुबह", "दोपहर", "शाम", "लचीला"], levels: ["शुरुआती", "मध्यवर्ती", "उन्नत", "सभी स्तर"], frequencies: ["प्रतिदिन", "सप्ताह में 2–3 बार", "साप्ताहिक", "लचीला"], yesNo: ["हाँ", "नहीं", "कोर्स पर निर्भर"], certificateOptions: ["हाँ", "नहीं", "लागू नहीं"],
  },
} as const;


type StringField = { [K in keyof TutorFormData]: TutorFormData[K] extends string ? K : never }[keyof TutorFormData];
const stepsMeta = [
  { labelKey: 0, icon: UserRound }, { labelKey: 1, icon: MapPin }, { labelKey: 2, icon: GraduationCap },
  { labelKey: 3, icon: BriefcaseBusiness }, { labelKey: 4, icon: BookOpen }, { labelKey: 5, icon: LockKeyhole },
];

export default function TutorRegisterPage() {
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];
  const [form, setForm] = useState<TutorFormData>(initialForm);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const progress = Math.round(((step + 1) / t.steps.length) * 100);
  const stepFields: (keyof TutorFormData)[][] = [
    ["fullName", "mobile", "whatsapp", "email", "dob", "gender", "profilePhoto"],
    ["address", "city", "state", "pincode"],
    ["expertise", "secondaryExpertise", "qualification", "specialization", "certifications"],
    ["teachingExperience", "currentOccupation", "previousTeachingExperience", "teachingFormat", "preferredMode", "preferredDays", "preferredTime", "availability"],
    ["courseTitle", "courseDescription", "courseLevel", "courseDuration", "sessionFrequency", "practicalTraining", "certificationProvided", "qualificationProof", "experienceProof", "profileDocument"],
    ["password", "confirmPassword", "terms", "verificationConsent"],
  ];
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = event.target;
    const { name, value } = target;
    setForm((prev) => ({ ...prev, [name]: target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, fieldName: "profilePhoto" | "qualificationProof" | "experienceProof" | "profileDocument") => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    const isPhoto = fieldName === "profilePhoto";
    const allowed = isPhoto ? ["image/jpeg", "image/png", "image/webp"] : ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) { setErrors((p) => ({ ...p, [fieldName]: isPhoto ? t.uploadImage : t.uploadDoc })); event.target.value = ""; return; }
    if (file.size > 5 * 1024 * 1024) { setErrors((p) => ({ ...p, [fieldName]: t.fileSize })); event.target.value = ""; return; }
    setForm((p) => ({ ...p, [fieldName]: file })); setErrors((p) => ({ ...p, [fieldName]: "" }));
  };
  const validateStep = (index: number) => {
    const next: Record<string, string> = {};
    const required = (key: keyof TutorFormData, message = t.required) => { const v = form[key]; if (typeof v === "string" && !v.trim()) next[key] = message; };
    if (index === 0) {
      required("fullName"); required("mobile"); required("email");
      if (form.mobile && !/^[6-9]\d{9}$/.test(form.mobile.trim())) next.mobile = t.invalidMobile;
      if (form.whatsapp && !/^[6-9]\d{9}$/.test(form.whatsapp.trim())) next.whatsapp = t.invalidMobile;
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = t.invalidEmail;
    }
    if (index === 1) { required("address"); required("city"); required("state"); required("pincode"); if (form.pincode && !/^\d{6}$/.test(form.pincode.trim())) next.pincode = t.invalidPincode; }
    if (index === 2) { required("expertise"); required("qualification"); }
    if (index === 3) { required("teachingExperience"); required("teachingFormat"); required("preferredMode"); }
    if (index === 4) { required("courseTitle"); required("courseDescription"); }
    if (index === 5) {
      required("password"); required("confirmPassword");
      if (form.password && form.password.length < 8) next.password = t.passwordShort;
      if (form.confirmPassword && form.password !== form.confirmPassword) next.confirmPassword = t.passwordMismatch;
      if (!form.terms) next.terms = t.acceptTerms;
      if (!form.verificationConsent) next.verificationConsent = t.acceptVerification;
    }
    setErrors((prev) => { const updated = { ...prev }; stepFields[index].forEach((key) => delete updated[key]); return { ...updated, ...next }; });
    return Object.keys(next).length === 0;
  };
  const goNext = () => { if (validateStep(step)) setStep((s) => Math.min(s + 1, stepsMeta.length - 1)); };
  const goBack = () => { setErrors({}); setStep((s) => Math.max(s - 1, 0)); };
  const goToStep = (target: number) => { if (target < step) { setErrors({}); setStep(target); } };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (validateStep(5)) setSubmitted(true); };
  const field = (name: StringField, label: string, placeholder = "", type = "text", options?: readonly string[], full = false, required = false): ReactNode => (
    <label className={`partner-field${full ? " partner-field-full" : ""}`} key={name}>
      <span>{label}{required && <b className="partner-required"> *</b>}</span>
      {options ? <select id={name} name={name} value={form[name] as string} onChange={handleChange} aria-invalid={Boolean(errors[name])}>
        <option value="">{t.choose} {label.toLowerCase()}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select> : <input id={name} name={name} type={type} value={form[name] as string} onChange={handleChange} placeholder={placeholder} aria-invalid={Boolean(errors[name])} autoComplete={name === "email" ? "email" : name === "mobile" ? "tel" : undefined} />}
      {errors[name] && <small className="partner-form-error">{errors[name]}</small>}
    </label>
  );
  const textarea = (name: "address" | "courseDescription", label: string, placeholder: string, required = false) => (
    <label className="partner-field partner-field-full" key={name}><span>{label}{required && <b className="partner-required"> *</b>}</span>
      <textarea id={name} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} aria-invalid={Boolean(errors[name])} />
      {errors[name] && <small className="partner-form-error">{errors[name]}</small>}
    </label>
  );
  const fileField = (name: "profilePhoto" | "qualificationProof" | "experienceProof" | "profileDocument", label: string, hint: string) => (
    <label className="partner-file-upload" key={name}><span>{label}</span><span className="partner-file-box"><Upload size={18} /><span className="partner-file-copy"><strong>{form[name]?.name ?? t.chooseFile}</strong><small>{form[name] ? `${Math.max(1, Math.round(form[name]!.size / 1024))} KB` : hint}</small></span><span className="partner-file-action">{form[name] ? t.uploaded : t.choose}</span><input type="file" accept={name === "profilePhoto" ? "image/png,image/jpeg,image/webp" : ".pdf,.png,.jpg,.jpeg"} onChange={(e) => handleFileChange(e, name)} /></span>{errors[name] && <small className="partner-form-error">{errors[name]}</small>}</label>
  );
  const passwordField = (name: "password" | "confirmPassword", label: string, visible: boolean, toggle: () => void, placeholder: string) => (
    <label className="partner-field" key={name}><span>{label}<b className="partner-required"> *</b></span><span className="partner-input-wrap"><input id={name} name={name} type={visible ? "text" : "password"} value={form[name]} onChange={handleChange} autoComplete="new-password" placeholder={placeholder} aria-invalid={Boolean(errors[name])} /><button type="button" className="partner-password-toggle" onClick={toggle} aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{errors[name] && <small className="partner-form-error">{errors[name]}</small>}</label>
  );
  const stepContent = [
    <div className="partner-form-grid" key="personal">{field("fullName", t.fullName, t.fullNameHint, "text", undefined, false, true)}{field("mobile", t.mobile, t.mobileHint, "tel", undefined, false, true)}{field("whatsapp", t.whatsapp, t.whatsappHint, "tel")}{field("email", t.email, t.emailHint, "email", undefined, false, true)}{field("dob", t.dob, "", "date")}{field("gender", t.gender, "", "text", t.genderOptions)}{fileField("profilePhoto", t.profilePhoto, t.photoHint)}</div>,
    <div className="partner-form-grid" key="address">{textarea("address", t.address, t.addressHint, true)}{field("city", t.city, t.cityHint, "text", undefined, false, true)}{field("state", t.state, t.stateHint, "text", undefined, false, true)}{field("pincode", t.pincode, t.pincodeHint, "text", undefined, false, true)}</div>,
    <div className="partner-form-grid" key="expertise">{field("expertise", t.expertise, "", "text", expertiseOptions, false, true)}{field("secondaryExpertise", t.secondaryExpertise, "", "text", expertiseOptions)}{field("qualification", t.qualification, t.qualificationHint, "text", undefined, false, true)}{field("specialization", t.specialization, t.specializationHint)}{field("certifications", t.certifications, t.certificationsHint, "text", undefined, true)}</div>,
    <div className="partner-form-grid" key="experience">{field("teachingExperience", t.teachingExperience, "", "text", experienceOptions, false, true)}{field("currentOccupation", t.currentOccupation, t.occupationHint)}{field("previousTeachingExperience", t.previousTeachingExperience, t.previousHint, "text", undefined, true)}{field("teachingFormat", t.teachingFormat, "", "text", t.teachingFormats, true, true)}{field("preferredMode", t.preferredMode, "", "text", t.modes, false, true)}{field("preferredDays", t.preferredDays, t.daysHint)}{field("preferredTime", t.preferredTime, "", "text", t.times)}{field("availability", t.availability, t.availabilityHint)}</div>,
    <div className="partner-form-grid" key="course">{field("courseTitle", t.courseName, t.courseNameHint, "text", undefined, true, true)}{textarea("courseDescription", t.courseDescription, t.courseDescriptionHint, true)}{field("courseLevel", t.courseLevel, "", "text", t.levels)}{field("courseDuration", t.courseDuration, t.durationHint)}{field("sessionFrequency", t.sessionFrequency, "", "text", t.frequencies)}{field("practicalTraining", t.practicalTraining, "", "text", t.yesNo)}{field("certificationProvided", t.certificationProvided, "", "text", t.certificateOptions)}{fileField("qualificationProof", t.qualificationProof, t.qualificationProofHint)}{fileField("experienceProof", t.experienceProof, t.experienceProofHint)}{fileField("profileDocument", t.profileDocument, t.profileDocumentHint)}</div>,
    <div className="partner-form-grid" key="security"><div className="partner-field-full partner-form-grid">{passwordField("password", t.password, true === showPassword, () => setShowPassword((v) => !v), t.passwordHint)}{passwordField("confirmPassword", t.confirmPassword, showConfirmPassword, () => setShowConfirmPassword((v) => !v), t.confirmHint)}</div><div className="partner-field-full partner-consent-list"><label className="partner-consent"><input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} aria-invalid={Boolean(errors.terms)} /><span>{t.terms} <Link to="/terms" target="_blank" rel="noreferrer">{t.termsLink}</Link> {t.accurate}<b className="partner-required"> *</b>{errors.terms && <small className="partner-form-error">{errors.terms}</small>}</span></label><label className="partner-consent"><input type="checkbox" name="verificationConsent" checked={form.verificationConsent} onChange={handleChange} aria-invalid={Boolean(errors.verificationConsent)} /><span>{t.verification}<b className="partner-required"> *</b>{errors.verificationConsent && <small className="partner-form-error">{errors.verificationConsent}</small>}</span></label></div><div className="partner-field-full partner-secure-note"><ShieldCheck size={17} /><span>{t.securityNote}</span></div></div>,
  ];
  if (submitted) return <main className="partner-register-page"><section className="partner-wizard"><header className="partner-wizard-header"><Link to="/" className="partner-brand"><span><strong>NeedOneService</strong><small>{t.network}</small></span></Link><div className="partner-header-actions"><LanguagePicker language={language} setLanguage={setLanguage} t={t} /></div></header><section className="partner-wizard-card partner-success-card"><div className="partner-success-icon"><CheckCircle2 size={34} /></div><span className="partner-eyebrow">{t.successEyebrow}</span><h1>{t.successTitle}</h1><p>{t.successDesc}</p><div className="partner-review-summary"><h3>{t.summary}</h3><p><strong>{t.name}</strong><span>{form.fullName}</span></p><p><strong>{t.email}</strong><span>{form.email}</span></p><p><strong>{t.primaryExpertise}</strong><span>{form.expertise}</span></p><p><strong>{t.teachingExp}</strong><span>{form.teachingExperience}</span></p></div><p>{t.frontendNote}</p><Link to="/" className="partner-submit-button">{t.home}<ArrowRight size={16} /></Link></section></section></main>;
  return (
    <main className="partner-register-page">
      <section className="partner-wizard">
        <header className="partner-wizard-header">
          <Link to="/" className="partner-brand"><span className="partner-brand-mark"><GraduationCap size={20} /></span><span><strong>NeedOneService</strong><small>{t.network}</small></span></Link>
          <div className="partner-header-actions"><LanguagePicker language={language} setLanguage={setLanguage} t={t} /><div className="partner-login-note">{t.signIn} <Link to="/login">{t.login}</Link></div></div>
        </header>
        <div className="partner-wizard-intro"><div><span className="partner-eyebrow">{t.eyebrow}</span><h1>{t.heading} <span>{t.brand}</span></h1><p>{t.intro}</p></div><div className="partner-secure-note"><LockKeyhole size={16} /><span>{t.secure}</span></div></div>
        <div className="partner-wizard-card">
          <div className="partner-progress-header"><div><span className="partner-step-count">{t.step} {String(step + 1).padStart(2, "0")} {t.of} {String(t.steps.length).padStart(2, "0")}</span><h2>{t.steps[step][0]}</h2><p>{t.steps[step][1]}</p></div><div className="partner-progress-percent">{progress}%<span> {t.completed}</span></div></div>
          <div className="partner-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={t.steps.length} aria-valuenow={step + 1} aria-label={t.intro}><div className="partner-progress-fill" style={{ width: `${progress}%` }} /></div>
          <nav className="partner-step-navigation" aria-label="Registration steps">{stepsMeta.map((item, index) => { const Icon = item.icon; const completed = index < step; const active = index === step; return <button type="button" key={index} className={`partner-step-indicator${active ? " active" : ""}${completed ? " completed" : ""}`} onClick={() => goToStep(index)} disabled={index >= step} aria-current={active ? "step" : undefined} aria-label={t.steps[index][0]}><span className="partner-step-icon">{completed ? <Check size={17} /> : <Icon size={17} />}</span><span className="partner-step-label">{t.steps[index][0].split(" ")[0]}</span></button>; })}</nav>
          <form className="partner-form-content" onSubmit={handleSubmit} noValidate>
            <section className="partner-form-section"><div className="partner-form-heading"><span className="partner-form-number">{String(step + 1).padStart(2, "0")}</span><div><h3>{[t.personalTitle, t.addressTitle, t.expertiseTitle, t.experienceTitle, t.courseTitleSection, t.securityTitle][step]}</h3><p>{[t.personalDesc, t.addressDesc, t.expertiseDesc, t.experienceDesc, t.courseDesc, t.securityDesc][step]}</p></div></div>{stepContent[step]}</section>
            <footer className="partner-form-footer"><button type="button" className="partner-back-button" onClick={goBack} disabled={step === 0}><ArrowLeft size={16} />{t.back}</button><span className="partner-footer-hint"><LockKeyhole size={13} />{t.safe}</span>{step < stepsMeta.length - 1 ? <button type="button" className="partner-submit-button" onClick={goNext}>{t.continue}<ArrowRight size={16} /></button> : <button type="submit" className="partner-submit-button">{t.submit}<Check size={17} /></button>}</footer>
          </form>
        </div>
        <p className="partner-wizard-bottom-note">{t.help} <Link to="/contact">{t.contact}</Link></p>
      </section>
    </main>
  );
}

function LanguagePicker({ language, setLanguage, t }: { language: Language; setLanguage: (language: Language) => void; t: (typeof translations)[Language] }) {
  return <label className="partner-language-picker"><Languages size={16} /><span>{t.translate}</span><select aria-label={t.translate} value={language} onChange={(event) => setLanguage(event.target.value as Language)}><option value="en">{t.english}</option><option value="te">{t.telugu}</option><option value="hi">{t.hindi}</option></select></label>;
}
