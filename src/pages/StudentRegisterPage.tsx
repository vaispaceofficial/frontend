
import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    Eye,
    EyeOff,
    GraduationCap,
    Languages,
    LockKeyhole,
    ShieldCheck,
    Upload,
} from "lucide-react";
import "./StudentRegisterPage.css";

type Language = "en" | "te" | "hi";

type StudentFormData = {
    // Step 1: Personal information
    fullName: string;
    dateOfBirth: string;
    gender: string;
    mobile: string;
    alternateMobile: string;
    email: string;

    // Step 2: Address
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;

    // Step 3: Education
    educationLevel: string;
    institution: string;
    course: string;
    fieldOfStudy: string;
    currentYear: string;
    graduationYear: string;
    studentId: string;

    // Step 4: Skills
    interestedAreas: string[];
    skills: string;
    experienceLevel: string;
    preferredLanguage: string;

    // Step 5: Learning preferences
    learningGoals: string[];
    learningMode: string;
    availability: string;
    weeklyHours: string;
    additionalDetails: string;

    // Step 6: Account and consent
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
    consentAccepted: boolean;
};

type ErrorMap = Partial<Record<keyof StudentFormData, string>>;

type StringField = Exclude<
    keyof StudentFormData,
    "interestedAreas" | "learningGoals" | "termsAccepted" | "consentAccepted"
>;

type Translation = {
    [key: string]: string | string[];
};

const initialForm: StudentFormData = {
    fullName: "",
    dateOfBirth: "",
    gender: "",
    mobile: "",
    alternateMobile: "",
    email: "",

    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",

    educationLevel: "",
    institution: "",
    course: "",
    fieldOfStudy: "",
    currentYear: "",
    graduationYear: "",
    studentId: "",

    interestedAreas: [],
    skills: "",
    experienceLevel: "",
    preferredLanguage: "English",

    learningGoals: [],
    learningMode: "",
    availability: "",
    weeklyHours: "",
    additionalDetails: "",

    password: "",
    confirmPassword: "",
    termsAccepted: false,
    consentAccepted: false,
};

const STEP_FIELDS: (keyof StudentFormData)[][] = [
    [
        "fullName",
        "dateOfBirth",
        "gender",
        "mobile",
        "email",
    ],
    [
        "address",
        "city",
        "state",
        "pincode",
        "country",
    ],
    [
        "educationLevel",
        "institution",
        "course",
        "fieldOfStudy",
        "currentYear",
    ],
    [
        "interestedAreas",
        "experienceLevel",
        "preferredLanguage",
    ],
    [
        "learningGoals",
        "learningMode",
        "availability",
    ],
    [
        "password",
        "confirmPassword",
        "termsAccepted",
        "consentAccepted",
    ],
];

const translations: Record<Language, Translation> = {
    en: {
        pageTitle: "Student Registration",
        pageSubtitle:
            "Build your future with NeedOneService. Complete your profile to get started.",
        brand: "NeedOneService",
        step: "STEP",
        of: "OF",
        personal: "Personal",
        addressStep: "Address",
        education: "Education",
        skillsStep: "Skills",
        learning: "Learning",
        account: "Account",
        personalTitle: "Personal Information",
        personalDescription:
            "Tell us a little about yourself so we can create your student profile.",
        fullName: "Full Name",
        fullNamePlaceholder: "Enter your full name",
        dateOfBirth: "Date of Birth",
        gender: "Gender",
        selectGender: "Select gender",
        male: "Male",
        female: "Female",
        other: "Other",
        preferNotToSay: "Prefer not to say",
        mobile: "Mobile Number",
        mobilePlaceholder: "10-digit mobile number",
        alternateMobile: "Alternate Mobile Number",
        alternateMobilePlaceholder: "Optional alternate number",
        email: "Email Address",
        emailPlaceholder: "you@example.com",

        addressTitle: "Address Details",
        addressDescription:
            "Add your current address so we can provide relevant opportunities near you.",
        address: "Street Address",
        addressPlaceholder: "House number, street, area",
        city: "City",
        cityPlaceholder: "Enter your city",
        state: "State",
        statePlaceholder: "Enter your state",
        pincode: "PIN Code",
        pincodePlaceholder: "6-digit PIN code",
        country: "Country",
        countryPlaceholder: "Enter your country",

        educationTitle: "Education Details",
        educationDescription:
            "Tell us about your current education and academic background.",
        educationLevel: "Education Level",
        selectEducationLevel: "Select education level",
        school: "School",
        intermediate: "Intermediate / 12th",
        diploma: "Diploma",
        undergraduate: "Undergraduate",
        postgraduate: "Postgraduate",
        doctorate: "Doctorate",
        otherEducation: "Other",
        institution: "Institution / College Name",
        institutionPlaceholder: "Enter school or college name",
        course: "Course / Qualification",
        coursePlaceholder: "e.g. B.Tech, B.Com, Diploma",
        fieldOfStudy: "Field of Study",
        fieldOfStudyPlaceholder: "e.g. Computer Science",
        currentYear: "Current Year / Semester",
        currentYearPlaceholder: "e.g. 2nd Year",
        graduationYear: "Expected Graduation Year",
        graduationYearPlaceholder: "e.g. 2027",
        studentId: "Student ID",
        studentIdPlaceholder: "Optional student ID",

        skillsTitle: "Skills & Interests",
        skillsDescription:
            "Choose the areas you are interested in and tell us about your skills.",
        interestedAreas: "Areas of Interest",
        selectInterests: "Select one or more areas",
        technology: "Technology & IT",
        design: "Design & Creative",
        business: "Business & Management",
        marketing: "Marketing & Communication",
        finance: "Finance & Accounting",
        educationInterest: "Education & Teaching",
        engineering: "Engineering",
        healthcare: "Healthcare",
        customerService: "Customer Service",
        dataAnalytics: "Data & Analytics",
        entrepreneurship: "Entrepreneurship",
        otherInterest: "Other",
        skills: "Skills",
        skillsPlaceholder:
            "List your skills, separated by commas",
        experienceLevel: "Experience Level",
        selectExperience: "Select experience level",
        beginner: "Beginner",
        intermediateLevel: "Intermediate",
        advanced: "Advanced",
        experienced: "Experienced",
        preferredLanguage: "Preferred Language",
        selectLanguage: "Select preferred language",

        learningTitle: "Learning Preferences",
        learningDescription:
            "Help us understand your goals and how you prefer to learn.",
        learningGoals: "Learning Goals",
        selectGoals: "Select one or more goals",
        improveSkills: "Improve my skills",
        careerGrowth: "Career development",
        internship: "Find an internship",
        jobReadiness: "Prepare for a job",
        certification: "Earn certifications",
        academicSupport: "Academic support",
        practicalExperience: "Gain practical experience",
        networking: "Build a professional network",
        learningMode: "Preferred Learning Mode",
        selectLearningMode: "Select learning mode",
        online: "Online",
        offline: "In person",
        hybrid: "Hybrid",
        selfPaced: "Self-paced",
        availability: "Availability",
        selectAvailability: "Select availability",
        weekdays: "Weekdays",
        weekends: "Weekends",
        mornings: "Mornings",
        evenings: "Evenings",
        flexible: "Flexible",
        weeklyHours: "Hours Available Per Week",
        selectWeeklyHours: "Select weekly hours",
        hours1to5: "1–5 hours",
        hours6to10: "6–10 hours",
        hours11to20: "11–20 hours",
        hours20plus: "20+ hours",
        additionalDetails: "Additional Information",
        additionalDetailsPlaceholder:
            "Share any learning goals or requirements you would like us to know about.",

        accountTitle: "Create Your Account",
        accountDescription:
            "Set a secure password and review the consent statements to complete registration.",
        password: "Password",
        passwordPlaceholder: "Create a strong password",
        confirmPassword: "Confirm Password",
        confirmPasswordPlaceholder: "Enter your password again",
        showPassword: "Show password",
        hidePassword: "Hide password",
        passwordHint:
            "Use at least 8 characters, including a letter and a number.",
        termsPrefix: "I agree to the",
        termsLink: "Terms and Conditions",
        and: "and",
        privacyLink: "Privacy Policy",
        consentText:
            "I consent to NeedOneService using the information I provide to manage my student registration and contact me about relevant services and opportunities.",
        securityTitle: "Your information matters",
        securityDescription:
            "Your password is not saved in this browser-based registration record.",
        back: "Back",
        next: "Continue",
        submit: "Complete Registration",
        required: "This field is required.",
        invalidEmail: "Enter a valid email address.",
        invalidMobile: "Enter a valid 10-digit mobile number.",
        invalidPincode: "Enter a valid 6-digit PIN code.",
        invalidDate: "Enter a valid date of birth.",
        futureDate: "Date of birth cannot be in the future.",
        invalidGraduationYear: "Enter a valid graduation year.",
        passwordLength: "Password must contain at least 8 characters.",
        passwordLetterNumber:
            "Password must contain at least one letter and one number.",
        passwordMismatch: "Passwords do not match.",
        acceptTerms: "Please accept the Terms and Conditions.",
        acceptConsent: "Please confirm your consent to continue.",
        selectAtLeastOne: "Select at least one option.",
        fixErrors: "Please correct the highlighted fields before continuing.",
        upload: "Upload Document",
        optional: "Optional",
        uploadHint:
            "Supported formats: PDF, JPG, PNG. Maximum file size: 5 MB.",
        resume: "Resume / CV",
        studentProof: "Student ID / Enrollment Proof",
        removeFile: "Remove file",
        successTitle: "Registration Details Saved!",
        successDescription:
            "Your student registration details have been saved in this browser.",
        successNote:
            "This is a frontend-only confirmation. Your registration has not been sent to a server.",
        goToProfile: "Go to Profile",
        returnToHome: "Return to Home",
        alreadyAccount: "Already have an account?",
        login: "Log in",
        language: "Language",
        english: "English",
        telugu: "Telugu",
        hindi: "Hindi",
        selected: "selected",
        chooseOption: "Choose an option",
        noFile: "No file selected",
        accountNextSteps:
            "You can review your submitted information from your profile if the profile page is configured to read student registration data.",
    },

    te: {
        pageTitle: "విద్యార్థి నమోదు",
        pageSubtitle:
            "NeedOneService తో మీ భవిష్యత్తును నిర్మించుకోండి. ప్రారంభించడానికి మీ వివరాలను నమోదు చేయండి.",
        brand: "NeedOneService",
        step: "దశ",
        of: "లో",
        personal: "వ్యక్తిగతం",
        addressStep: "చిరునామా",
        education: "విద్య",
        skillsStep: "నైపుణ్యాలు",
        learning: "అభ్యాసం",
        account: "ఖాతా",
        personalTitle: "వ్యక్తిగత సమాచారం",
        personalDescription:
            "మీ విద్యార్థి ప్రొఫైల్‌ను రూపొందించడానికి మీ వివరాలను నమోదు చేయండి.",
        fullName: "పూర్తి పేరు",
        fullNamePlaceholder: "మీ పూర్తి పేరు నమోదు చేయండి",
        dateOfBirth: "పుట్టిన తేదీ",
        gender: "లింగం",
        selectGender: "లింగాన్ని ఎంచుకోండి",
        male: "పురుషుడు",
        female: "స్త్రీ",
        other: "ఇతర",
        preferNotToSay: "తెలపకూడదని అనుకుంటున్నాను",
        mobile: "మొబైల్ నంబర్",
        mobilePlaceholder: "10 అంకెల మొబైల్ నంబర్",
        alternateMobile: "ప్రత్యామ్నాయ మొబైల్ నంబర్",
        alternateMobilePlaceholder: "ఐచ్ఛిక ప్రత్యామ్నాయ నంబర్",
        email: "ఈమెయిల్ చిరునామా",
        emailPlaceholder: "you@example.com",

        addressTitle: "చిరునామా వివరాలు",
        addressDescription:
            "మీకు సమీపంలోని అవకాశాలను అందించడానికి ప్రస్తుత చిరునామాను నమోదు చేయండి.",
        address: "వీధి చిరునామా",
        addressPlaceholder: "ఇంటి నంబర్, వీధి, ప్రాంతం",
        city: "నగరం",
        cityPlaceholder: "మీ నగరాన్ని నమోదు చేయండి",
        state: "రాష్ట్రం",
        statePlaceholder: "మీ రాష్ట్రాన్ని నమోదు చేయండి",
        pincode: "పిన్ కోడ్",
        pincodePlaceholder: "6 అంకెల పిన్ కోడ్",
        country: "దేశం",
        countryPlaceholder: "మీ దేశాన్ని నమోదు చేయండి",

        educationTitle: "విద్యా వివరాలు",
        educationDescription:
            "మీ ప్రస్తుత విద్య మరియు విద్యా నేపథ్యాన్ని నమోదు చేయండి.",
        educationLevel: "విద్యా స్థాయి",
        selectEducationLevel: "విద్యా స్థాయిని ఎంచుకోండి",
        school: "పాఠశాల",
        intermediate: "ఇంటర్మీడియట్ / 12వ తరగతి",
        diploma: "డిప్లొమా",
        undergraduate: "అండర్ గ్రాడ్యుయేట్",
        postgraduate: "పోస్ట్ గ్రాడ్యుయేట్",
        doctorate: "డాక్టరేట్",
        otherEducation: "ఇతర",
        institution: "సంస్థ / కళాశాల పేరు",
        institutionPlaceholder: "పాఠశాల లేదా కళాశాల పేరు నమోదు చేయండి",
        course: "కోర్సు / అర్హత",
        coursePlaceholder: "ఉదా. B.Tech, B.Com, Diploma",
        fieldOfStudy: "అధ్యయన విభాగం",
        fieldOfStudyPlaceholder: "ఉదా. కంప్యూటర్ సైన్స్",
        currentYear: "ప్రస్తుత సంవత్సరం / సెమిస్టర్",
        currentYearPlaceholder: "ఉదా. 2వ సంవత్సరం",
        graduationYear: "గ్రాడ్యుయేషన్ సంవత్సరం",
        graduationYearPlaceholder: "ఉదా. 2027",
        studentId: "విద్యార్థి ఐడి",
        studentIdPlaceholder: "ఐచ్ఛిక విద్యార్థి ఐడి",

        skillsTitle: "నైపుణ్యాలు మరియు ఆసక్తులు",
        skillsDescription:
            "మీకు ఆసక్తి ఉన్న రంగాలను ఎంచుకుని, మీ నైపుణ్యాలను తెలియజేయండి.",
        interestedAreas: "ఆసక్తి ఉన్న రంగాలు",
        selectInterests: "ఒకటి లేదా అంతకంటే ఎక్కువ రంగాలను ఎంచుకోండి",
        technology: "టెక్నాలజీ మరియు ఐటీ",
        design: "డిజైన్ మరియు సృజనాత్మకత",
        business: "వ్యాపారం మరియు నిర్వహణ",
        marketing: "మార్కెటింగ్ మరియు కమ్యూనికేషన్",
        finance: "ఫైనాన్స్ మరియు అకౌంటింగ్",
        educationInterest: "విద్య మరియు బోధన",
        engineering: "ఇంజినీరింగ్",
        healthcare: "ఆరోగ్య సంరక్షణ",
        customerService: "కస్టమర్ సర్వీస్",
        dataAnalytics: "డేటా మరియు అనలిటిక్స్",
        entrepreneurship: "వ్యాపారారంభం",
        otherInterest: "ఇతర",
        skills: "నైపుణ్యాలు",
        skillsPlaceholder: "కామాలతో వేరు చేసి నైపుణ్యాలను నమోదు చేయండి",
        experienceLevel: "అనుభవ స్థాయి",
        selectExperience: "అనుభవ స్థాయిని ఎంచుకోండి",
        beginner: "ప్రారంభ స్థాయి",
        intermediateLevel: "మధ్యస్థ స్థాయి",
        advanced: "ఉన్నత స్థాయి",
        experienced: "అనుభవం ఉంది",
        preferredLanguage: "ప్రాధాన్య భాష",
        selectLanguage: "భాషను ఎంచుకోండి",

        learningTitle: "అభ్యాస ప్రాధాన్యతలు",
        learningDescription:
            "మీ లక్ష్యాలు మరియు మీరు నేర్చుకోవాలనుకునే విధానాన్ని తెలియజేయండి.",
        learningGoals: "అభ్యాస లక్ష్యాలు",
        selectGoals: "ఒకటి లేదా అంతకంటే ఎక్కువ లక్ష్యాలను ఎంచుకోండి",
        improveSkills: "నా నైపుణ్యాలను మెరుగుపరచుకోవడం",
        careerGrowth: "వృత్తి అభివృద్ధి",
        internship: "ఇంటర్న్‌షిప్ పొందడం",
        jobReadiness: "ఉద్యోగానికి సిద్ధం కావడం",
        certification: "సర్టిఫికేషన్లు పొందడం",
        academicSupport: "విద్యా సహాయం",
        practicalExperience: "ప్రాక్టికల్ అనుభవం పొందడం",
        networking: "వృత్తిపరమైన పరిచయాలు పెంచుకోవడం",
        learningMode: "అభ్యాస విధానం",
        selectLearningMode: "అభ్యాస విధానాన్ని ఎంచుకోండి",
        online: "ఆన్‌లైన్",
        offline: "ప్రత్యక్షంగా",
        hybrid: "హైబ్రిడ్",
        selfPaced: "స్వీయ వేగంతో",
        availability: "అందుబాటు సమయం",
        selectAvailability: "అందుబాటు సమయాన్ని ఎంచుకోండి",
        weekdays: "వారపు రోజులు",
        weekends: "వారాంతాలు",
        mornings: "ఉదయం",
        evenings: "సాయంత్రం",
        flexible: "అనువైన సమయం",
        weeklyHours: "వారానికి అందుబాటులో ఉన్న గంటలు",
        selectWeeklyHours: "గంటలను ఎంచుకోండి",
        hours1to5: "1–5 గంటలు",
        hours6to10: "6–10 గంటలు",
        hours11to20: "11–20 గంటలు",
        hours20plus: "20+ గంటలు",
        additionalDetails: "అదనపు సమాచారం",
        additionalDetailsPlaceholder:
            "మీ అభ్యాస లక్ష్యాలు లేదా ఇతర అవసరాలను తెలియజేయండి.",

        accountTitle: "మీ ఖాతాను సృష్టించండి",
        accountDescription:
            "సురక్షిత పాస్‌వర్డ్‌ను సెట్ చేసి, నమోదు పూర్తి చేయడానికి సమ్మతి వివరాలను పరిశీలించండి.",
        password: "పాస్‌వర్డ్",
        passwordPlaceholder: "బలమైన పాస్‌వర్డ్ సృష్టించండి",
        confirmPassword: "పాస్‌వర్డ్‌ను నిర్ధారించండి",
        confirmPasswordPlaceholder: "పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి",
        showPassword: "పాస్‌వర్డ్ చూపించండి",
        hidePassword: "పాస్‌వర్డ్ దాచండి",
        passwordHint:
            "కనీసం 8 అక్షరాలు, ఒక అక్షరం మరియు ఒక సంఖ్య ఉపయోగించండి.",
        termsPrefix: "నేను అంగీకరిస్తున్నాను:",
        termsLink: "నిబంధనలు",
        and: "మరియు",
        privacyLink: "గోప్యతా విధానం",
        consentText:
            "నా విద్యార్థి నమోదును నిర్వహించడానికి మరియు సంబంధిత సేవలు, అవకాశాల గురించి నన్ను సంప్రదించడానికి NeedOneService నా సమాచారాన్ని ఉపయోగించేందుకు నేను సమ్మతిస్తున్నాను.",
        securityTitle: "మీ సమాచారం ముఖ్యం",
        securityDescription:
            "ఈ బ్రౌజర్ ఆధారిత నమోదు రికార్డులో మీ పాస్‌వర్డ్ సేవ్ చేయబడదు.",
        back: "వెనక్కి",
        next: "కొనసాగించండి",
        submit: "నమోదు పూర్తి చేయండి",
        required: "ఈ వివరాన్ని నమోదు చేయాలి.",
        invalidEmail: "సరైన ఈమెయిల్ చిరునామాను నమోదు చేయండి.",
        invalidMobile: "సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.",
        invalidPincode: "సరైన 6 అంకెల పిన్ కోడ్ నమోదు చేయండి.",
        invalidDate: "సరైన పుట్టిన తేదీ నమోదు చేయండి.",
        futureDate: "పుట్టిన తేదీ భవిష్యత్తులో ఉండకూడదు.",
        invalidGraduationYear: "సరైన గ్రాడ్యుయేషన్ సంవత్సరాన్ని నమోదు చేయండి.",
        passwordLength: "పాస్‌వర్డ్‌లో కనీసం 8 అక్షరాలు ఉండాలి.",
        passwordLetterNumber:
            "పాస్‌వర్డ్‌లో కనీసం ఒక అక్షరం మరియు ఒక సంఖ్య ఉండాలి.",
        passwordMismatch: "పాస్‌వర్డ్‌లు సరిపోలడం లేదు.",
        acceptTerms: "దయచేసి నిబంధనలను అంగీకరించండి.",
        acceptConsent: "కొనసాగించడానికి మీ సమ్మతిని నిర్ధారించండి.",
        selectAtLeastOne: "కనీసం ఒక ఎంపికను ఎంచుకోండి.",
        fixErrors: "కొనసాగించే ముందు గుర్తించిన వివరాలను సరిచేయండి.",
        upload: "పత్రాన్ని అప్‌లోడ్ చేయండి",
        optional: "ఐచ్ఛికం",
        uploadHint:
            "అనుమతించబడిన ఫార్మాట్‌లు: PDF, JPG, PNG. గరిష్ఠ పరిమాణం: 5 MB.",
        resume: "రెజ్యూమే / CV",
        studentProof: "విద్యార్థి ఐడి / నమోదు రుజువు",
        removeFile: "ఫైల్ తొలగించండి",
        successTitle: "నమోదు వివరాలు సేవ్ అయ్యాయి!",
        successDescription:
            "మీ విద్యార్థి నమోదు వివరాలు ఈ బ్రౌజర్‌లో సేవ్ చేయబడ్డాయి.",
        successNote:
            "ఇది ఫ్రంట్‌ఎండ్ నిర్ధారణ మాత్రమే. మీ నమోదు సర్వర్‌కు పంపబడలేదు.",
        goToProfile: "ప్రొఫైల్‌కు వెళ్లండి",
        returnToHome: "హోమ్‌కు తిరిగి వెళ్లండి",
        alreadyAccount: "ఇప్పటికే ఖాతా ఉందా?",
        login: "లాగిన్",
        language: "భాష",
        english: "ఆంగ్లం",
        telugu: "తెలుగు",
        hindi: "హిందీ",
        selected: "ఎంచుకున్నారు",
        chooseOption: "ఒక ఎంపికను ఎంచుకోండి",
        noFile: "ఫైల్ ఎంచుకోలేదు",
        accountNextSteps:
            "విద్యార్థి నమోదు వివరాలను చదివేలా ప్రొఫైల్ పేజీ అమర్చబడి ఉంటే, అక్కడ మీ వివరాలను పరిశీలించవచ్చు.",
    },

    hi: {
        pageTitle: "छात्र पंजीकरण",
        pageSubtitle:
            "NeedOneService के साथ अपना भविष्य बनाएं। शुरुआत करने के लिए अपनी जानकारी भरें।",
        brand: "NeedOneService",
        step: "चरण",
        of: "में से",
        personal: "व्यक्तिगत",
        addressStep: "पता",
        education: "शिक्षा",
        skillsStep: "कौशल",
        learning: "सीखना",
        account: "खाता",
        personalTitle: "व्यक्तिगत जानकारी",
        personalDescription:
            "अपनी छात्र प्रोफ़ाइल बनाने के लिए अपनी जानकारी भरें।",
        fullName: "पूरा नाम",
        fullNamePlaceholder: "अपना पूरा नाम दर्ज करें",
        dateOfBirth: "जन्म तिथि",
        gender: "लिंग",
        selectGender: "लिंग चुनें",
        male: "पुरुष",
        female: "महिला",
        other: "अन्य",
        preferNotToSay: "बताना नहीं चाहते",
        mobile: "मोबाइल नंबर",
        mobilePlaceholder: "10 अंकों का मोबाइल नंबर",
        alternateMobile: "वैकल्पिक मोबाइल नंबर",
        alternateMobilePlaceholder: "वैकल्पिक नंबर (ज़रूरी नहीं)",
        email: "ईमेल पता",
        emailPlaceholder: "you@example.com",

        addressTitle: "पते का विवरण",
        addressDescription:
            "अपने आस-पास के अवसरों के लिए अपना वर्तमान पता दर्ज करें।",
        address: "सड़क का पता",
        addressPlaceholder: "मकान नंबर, सड़क, क्षेत्र",
        city: "शहर",
        cityPlaceholder: "अपना शहर दर्ज करें",
        state: "राज्य",
        statePlaceholder: "अपना राज्य दर्ज करें",
        pincode: "पिन कोड",
        pincodePlaceholder: "6 अंकों का पिन कोड",
        country: "देश",
        countryPlaceholder: "अपना देश दर्ज करें",

        educationTitle: "शिक्षा का विवरण",
        educationDescription:
            "अपनी वर्तमान शिक्षा और शैक्षणिक पृष्ठभूमि की जानकारी दें।",
        educationLevel: "शिक्षा का स्तर",
        selectEducationLevel: "शिक्षा का स्तर चुनें",
        school: "स्कूल",
        intermediate: "इंटरमीडिएट / 12वीं",
        diploma: "डिप्लोमा",
        undergraduate: "स्नातक",
        postgraduate: "स्नातकोत्तर",
        doctorate: "डॉक्टरेट",
        otherEducation: "अन्य",
        institution: "संस्थान / कॉलेज का नाम",
        institutionPlaceholder: "स्कूल या कॉलेज का नाम दर्ज करें",
        course: "कोर्स / योग्यता",
        coursePlaceholder: "जैसे B.Tech, B.Com, Diploma",
        fieldOfStudy: "अध्ययन का विषय",
        fieldOfStudyPlaceholder: "जैसे कंप्यूटर साइंस",
        currentYear: "वर्तमान वर्ष / सेमेस्टर",
        currentYearPlaceholder: "जैसे दूसरा वर्ष",
        graduationYear: "स्नातक पूरा होने का वर्ष",
        graduationYearPlaceholder: "जैसे 2027",
        studentId: "छात्र आईडी",
        studentIdPlaceholder: "वैकल्पिक छात्र आईडी",

        skillsTitle: "कौशल और रुचियां",
        skillsDescription:
            "अपनी रुचि के क्षेत्रों को चुनें और अपने कौशल के बारे में बताएं।",
        interestedAreas: "रुचि के क्षेत्र",
        selectInterests: "एक या अधिक क्षेत्र चुनें",
        technology: "टेक्नोलॉजी और आईटी",
        design: "डिज़ाइन और रचनात्मकता",
        business: "व्यवसाय और प्रबंधन",
        marketing: "मार्केटिंग और संचार",
        finance: "वित्त और लेखांकन",
        educationInterest: "शिक्षा और अध्यापन",
        engineering: "इंजीनियरिंग",
        healthcare: "स्वास्थ्य सेवा",
        customerService: "ग्राहक सेवा",
        dataAnalytics: "डेटा और एनालिटिक्स",
        entrepreneurship: "उद्यमिता",
        otherInterest: "अन्य",
        skills: "कौशल",
        skillsPlaceholder: "अल्पविराम से अलग करके अपने कौशल लिखें",
        experienceLevel: "अनुभव का स्तर",
        selectExperience: "अनुभव का स्तर चुनें",
        beginner: "शुरुआती",
        intermediateLevel: "मध्यम",
        advanced: "उन्नत",
        experienced: "अनुभवी",
        preferredLanguage: "पसंदीदा भाषा",
        selectLanguage: "पसंदीदा भाषा चुनें",

        learningTitle: "सीखने की प्राथमिकताएं",
        learningDescription:
            "अपने लक्ष्यों और पसंदीदा सीखने के तरीके के बारे में बताएं।",
        learningGoals: "सीखने के लक्ष्य",
        selectGoals: "एक या अधिक लक्ष्य चुनें",
        improveSkills: "अपने कौशल में सुधार",
        careerGrowth: "करियर विकास",
        internship: "इंटर्नशिप ढूंढना",
        jobReadiness: "नौकरी की तैयारी",
        certification: "प्रमाणपत्र प्राप्त करना",
        academicSupport: "शैक्षणिक सहायता",
        practicalExperience: "व्यावहारिक अनुभव प्राप्त करना",
        networking: "पेशेवर संपर्क बनाना",
        learningMode: "सीखने का पसंदीदा तरीका",
        selectLearningMode: "सीखने का तरीका चुनें",
        online: "ऑनलाइन",
        offline: "व्यक्तिगत रूप से",
        hybrid: "हाइब्रिड",
        selfPaced: "अपनी गति से",
        availability: "उपलब्ध समय",
        selectAvailability: "उपलब्ध समय चुनें",
        weekdays: "कार्यदिवस",
        weekends: "सप्ताहांत",
        mornings: "सुबह",
        evenings: "शाम",
        flexible: "लचीला समय",
        weeklyHours: "प्रति सप्ताह उपलब्ध घंटे",
        selectWeeklyHours: "घंटे चुनें",
        hours1to5: "1–5 घंटे",
        hours6to10: "6–10 घंटे",
        hours11to20: "11–20 घंटे",
        hours20plus: "20+ घंटे",
        additionalDetails: "अतिरिक्त जानकारी",
        additionalDetailsPlaceholder:
            "अपने सीखने के लक्ष्यों या अन्य आवश्यकताओं के बारे में बताएं।",

        accountTitle: "अपना खाता बनाएं",
        accountDescription:
            "एक सुरक्षित पासवर्ड बनाएं और पंजीकरण पूरा करने के लिए सहमति की पुष्टि करें।",
        password: "पासवर्ड",
        passwordPlaceholder: "मजबूत पासवर्ड बनाएं",
        confirmPassword: "पासवर्ड की पुष्टि करें",
        confirmPasswordPlaceholder: "पासवर्ड दोबारा दर्ज करें",
        showPassword: "पासवर्ड दिखाएं",
        hidePassword: "पासवर्ड छिपाएं",
        passwordHint:
            "कम से कम 8 अक्षर, एक अक्षर और एक संख्या का उपयोग करें।",
        termsPrefix: "मैं सहमत हूं:",
        termsLink: "नियम और शर्तें",
        and: "और",
        privacyLink: "गोपनीयता नीति",
        consentText:
            "मैं NeedOneService को अपने छात्र पंजीकरण के प्रबंधन और संबंधित सेवाओं तथा अवसरों के बारे में मुझसे संपर्क करने के लिए मेरी दी गई जानकारी का उपयोग करने की सहमति देता/देती हूं।",
        securityTitle: "आपकी जानकारी महत्वपूर्ण है",
        securityDescription:
            "इस ब्राउज़र-आधारित पंजीकरण रिकॉर्ड में आपका पासवर्ड सेव नहीं किया जाएगा।",
        back: "वापस",
        next: "जारी रखें",
        submit: "पंजीकरण पूरा करें",
        required: "यह जानकारी आवश्यक है।",
        invalidEmail: "एक मान्य ईमेल पता दर्ज करें।",
        invalidMobile: "10 अंकों का मान्य मोबाइल नंबर दर्ज करें।",
        invalidPincode: "6 अंकों का मान्य पिन कोड दर्ज करें।",
        invalidDate: "मान्य जन्म तिथि दर्ज करें।",
        futureDate: "जन्म तिथि भविष्य की नहीं हो सकती।",
        invalidGraduationYear: "मान्य स्नातक वर्ष दर्ज करें।",
        passwordLength: "पासवर्ड में कम से कम 8 अक्षर होने चाहिए।",
        passwordLetterNumber:
            "पासवर्ड में कम से कम एक अक्षर और एक संख्या होनी चाहिए।",
        passwordMismatch: "दोनों पासवर्ड मेल नहीं खाते।",
        acceptTerms: "कृपया नियम और शर्तें स्वीकार करें।",
        acceptConsent: "जारी रखने के लिए अपनी सहमति की पुष्टि करें।",
        selectAtLeastOne: "कम से कम एक विकल्प चुनें।",
        fixErrors: "जारी रखने से पहले चिह्नित जानकारी ठीक करें।",
        upload: "दस्तावेज़ अपलोड करें",
        optional: "वैकल्पिक",
        uploadHint:
            "समर्थित फ़ॉर्मेट: PDF, JPG, PNG। अधिकतम फ़ाइल आकार: 5 MB।",
        resume: "रिज़्यूमे / CV",
        studentProof: "छात्र आईडी / नामांकन प्रमाण",
        removeFile: "फ़ाइल हटाएं",
        successTitle: "पंजीकरण विवरण सेव हो गया!",
        successDescription:
            "आपके छात्र पंजीकरण का विवरण इस ब्राउज़र में सेव हो गया है।",
        successNote:
            "यह केवल फ्रंटएंड पुष्टि है। आपका पंजीकरण सर्वर पर नहीं भेजा गया है।",
        goToProfile: "प्रोफ़ाइल पर जाएं",
        returnToHome: "होम पर लौटें",
        alreadyAccount: "पहले से खाता है?",
        login: "लॉग इन",
        language: "भाषा",
        english: "अंग्रेज़ी",
        telugu: "तेलुगु",
        hindi: "हिंदी",
        selected: "चयनित",
        chooseOption: "एक विकल्प चुनें",
        noFile: "कोई फ़ाइल नहीं चुनी गई",
        accountNextSteps:
            "यदि आपकी प्रोफ़ाइल छात्र पंजीकरण डेटा पढ़ने के लिए कॉन्फ़िगर की गई है, तो आप वहां अपने विवरण देख सकते हैं।",
    },
};

const INTEREST_OPTIONS = [
    { value: "Technology & IT", key: "technology" },
    { value: "Design & Creative", key: "design" },
    { value: "Business & Management", key: "business" },
    { value: "Marketing & Communication", key: "marketing" },
    { value: "Finance & Accounting", key: "finance" },
    { value: "Education & Teaching", key: "educationInterest" },
    { value: "Engineering", key: "engineering" },
    { value: "Healthcare", key: "healthcare" },
    { value: "Customer Service", key: "customerService" },
    { value: "Data & Analytics", key: "dataAnalytics" },
    { value: "Entrepreneurship", key: "entrepreneurship" },
    { value: "Other", key: "otherInterest" },
] as const;

const LEARNING_GOAL_OPTIONS = [
    { value: "Improve my skills", key: "improveSkills" },
    { value: "Career development", key: "careerGrowth" },
    { value: "Find an internship", key: "internship" },
    { value: "Prepare for a job", key: "jobReadiness" },
    { value: "Earn certifications", key: "certification" },
    { value: "Academic support", key: "academicSupport" },
    { value: "Gain practical experience", key: "practicalExperience" },
    { value: "Build a professional network", key: "networking" },
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
];
const ALLOWED_FILE_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

function isString(value: unknown): value is string {
    return typeof value === "string";
}

function getText(
    dictionary: Translation,
    key: string,
    fallback = key,
): string {
    const value = dictionary[key];
    return isString(value) ? value : fallback;
}

function cleanMobile(value: string): string {
    return value.replace(/\D/g, "").slice(0, 10);
}

function cleanPincode(value: string): string {
    return value.replace(/\D/g, "").slice(0, 6);
}

function validateFile(file: File): string | null {
    const extension = file.name
        .slice(file.name.lastIndexOf("."))
        .toLowerCase();

    const hasAllowedExtension = ALLOWED_FILE_EXTENSIONS.includes(extension);
    const hasAllowedType =
        ALLOWED_FILE_TYPES.includes(file.type) ||
        file.type === "";

    if (!hasAllowedExtension || !hasAllowedType) {
        return "Please choose a PDF, JPG, JPEG, or PNG file.";
    }

    if (file.size > MAX_FILE_SIZE) {
        return "The file size must not exceed 5 MB.";
    }

    return null;
}

function StudentRegisterPage() {
    const navigate = useNavigate();

    const [language, setLanguage] = useState<Language>("en");
    const [form, setForm] = useState<StudentFormData>(initialForm);
    const [errors, setErrors] = useState<ErrorMap>({});
    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [studentProofFile, setStudentProofFile] = useState<File | null>(null);
    const [fileErrors, setFileErrors] = useState<{
        resume?: string;
        studentProof?: string;
    }>({});

    const [formError, setFormError] = useState("");

    const t = translations[language];

    const stepNames = useMemo(
        () => [
            getText(t, "personal"),
            getText(t, "addressStep"),
            getText(t, "education"),
            getText(t, "skillsStep"),
            getText(t, "learning"),
            getText(t, "account"),
        ],
        [t],
    );

    const updateField = <K extends keyof StudentFormData>(
        field: K,
        value: StudentFormData[K],
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));

        setErrors((previous) => {
            if (!(field in previous)) return previous;

            const next = { ...previous };
            delete next[field];
            return next;
        });

        setFormError("");
    };

    const handleTextChange = (
        field: StringField,
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        let value = event.target.value;

        if (field === "mobile" || field === "alternateMobile") {
            value = cleanMobile(value);
        }

        if (field === "pincode") {
            value = cleanPincode(value);
        }

        updateField(field, value);
    };

    const toggleArrayOption = (
        field: "interestedAreas" | "learningGoals",
        value: string,
    ) => {
        const current = form[field];

        const next = current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value];

        updateField(field, next);
    };

    const handleFile = (
        event: ChangeEvent<HTMLInputElement>,
        field: "resume" | "studentProof",
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const error = validateFile(file);

        if (error) {
            setFileErrors((previous) => ({
                ...previous,
                [field]: error,
            }));
            event.target.value = "";
            return;
        }

        setFileErrors((previous) => ({
            ...previous,
            [field]: undefined,
        }));

        if (field === "resume") {
            setResumeFile(file);
        } else {
            setStudentProofFile(file);
        }
    };

    const removeFile = (field: "resume" | "studentProof") => {
        if (field === "resume") {
            setResumeFile(null);
        } else {
            setStudentProofFile(null);
        }

        setFileErrors((previous) => ({
            ...previous,
            [field]: undefined,
        }));
    };

    const validateStep = (stepIndex: number): boolean => {
        const nextErrors: ErrorMap = {};
        const fields = STEP_FIELDS[stepIndex] ?? [];

        fields.forEach((field) => {
            const value = form[field];

            if (field === "interestedAreas" || field === "learningGoals") {
                if (Array.isArray(value) && value.length === 0) {
                    nextErrors[field] = getText(t, "selectAtLeastOne");
                }
                return;
            }

            if (field === "termsAccepted") {
                if (value !== true) {
                    nextErrors.termsAccepted = getText(t, "acceptTerms");
                }
                return;
            }

            if (field === "consentAccepted") {
                if (value !== true) {
                    nextErrors.consentAccepted = getText(t, "acceptConsent");
                }
                return;
            }

            if (typeof value === "string" && value.trim() === "") {
                nextErrors[field] = getText(t, "required");
            }
        });

        if (stepIndex === 0) {
            const email = form.email.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (email && !emailRegex.test(email)) {
                nextErrors.email = getText(t, "invalidEmail");
            }

            if (form.mobile && !/^[6-9]\d{9}$/.test(form.mobile)) {
                nextErrors.mobile = getText(t, "invalidMobile");
            }

            if (
                form.alternateMobile &&
                !/^[6-9]\d{9}$/.test(form.alternateMobile)
            ) {
                nextErrors.alternateMobile = getText(t, "invalidMobile");
            }

            if (form.dateOfBirth) {
                const date = new Date(`${form.dateOfBirth}T00:00:00`);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (Number.isNaN(date.getTime())) {
                    nextErrors.dateOfBirth = getText(t, "invalidDate");
                } else if (date > today) {
                    nextErrors.dateOfBirth = getText(t, "futureDate");
                }
            }
        }

        if (stepIndex === 1) {
            if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
                nextErrors.pincode = getText(t, "invalidPincode");
            }
        }

        if (stepIndex === 2 && form.graduationYear) {
            const year = Number(form.graduationYear);
            const currentYear = new Date().getFullYear();

            if (
                !Number.isInteger(year) ||
                year < 1950 ||
                year > currentYear + 15
            ) {
                nextErrors.graduationYear = getText(
                    t,
                    "invalidGraduationYear",
                );
            }
        }

        if (stepIndex === 5) {
            if (form.password.length < 8) {
                nextErrors.password = getText(t, "passwordLength");
            } else if (
                !/[A-Za-z]/.test(form.password) ||
                !/\d/.test(form.password)
            ) {
                nextErrors.password = getText(t, "passwordLetterNumber");
            }

            if (form.confirmPassword !== form.password) {
                nextErrors.confirmPassword = getText(t, "passwordMismatch");
            }
        }

        if (stepIndex === 5) {
            if (fileErrors.resume || fileErrors.studentProof) {
                setFormError(getText(t, "fixErrors"));
                setErrors(nextErrors);
                return false;
            }
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            setFormError(getText(t, "fixErrors"));
            return false;
        }

        setFormError("");
        return true;
    };

    const goToStep = (nextStep: number) => {
        if (nextStep < 0 || nextStep >= STEP_FIELDS.length) return;

        if (nextStep > step) {
            for (let currentStep = step; currentStep < nextStep; currentStep += 1) {
                if (!validateStep(currentStep)) {
                    setStep(currentStep);
                    return;
                }
            }
        }

        setStep(nextStep);
        setFormError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleNext = () => {
        if (!validateStep(step)) return;

        if (step < STEP_FIELDS.length - 1) {
            setStep((previous) => previous + 1);
            setFormError("");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleBack = () => {
        if (step === 0) return;

        setStep((previous) => previous - 1);
        setFormError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateStep(step)) return;

        // Revalidate every step before saving.
        for (let index = 0; index < STEP_FIELDS.length; index += 1) {
            if (!validateStep(index)) {
                setStep(index);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
        }

        /*
         * Do not store the password or confirmPassword.
         * File objects are not serialized into localStorage.
         * Save only their names as metadata.
         *
         * Keep the profile fields flat for compatibility with existing
         * code that reads oneservice_student_application / oneservice_student.
         */
        const {
            password: _password,
            confirmPassword: _confirmPassword,
            termsAccepted: _termsAccepted,
            consentAccepted: _consentAccepted,
            ...studentDetails
        } = form;

        const now = new Date().toISOString();

        const studentApplication = {
            ...studentDetails,
            fullName: form.fullName.trim(),
            email: form.email.trim().toLowerCase(),
            mobile: form.mobile,
            alternateMobile: form.alternateMobile || "",
            address: form.address.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            pincode: form.pincode,
            country: form.country.trim(),
            interestedAreas: [...form.interestedAreas],
            learningGoals: [...form.learningGoals],
            resumeFileName: resumeFile?.name ?? "",
            studentProofFileName: studentProofFile?.name ?? "",
            role: "student",
            applicationStatus: "submitted",
            createdAt: now,
            updatedAt: now,
        };

        try {
            localStorage.setItem(
                "oneservice_student_application",
                JSON.stringify(studentApplication),
            );

            // Compatibility key for existing profile/dashboard code.
            localStorage.setItem(
                "oneservice_student",
                JSON.stringify(studentApplication),
            );

            window.dispatchEvent(
                new CustomEvent("oneservice-student-change", {
                    detail: studentApplication,
                }),
            );

            setFormError("");
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("Unable to save student registration:", error);
            setFormError(
                "Unable to save your details in this browser. Check available storage and try again.",
            );
        }
    };

    const fieldError = (field: keyof StudentFormData) => errors[field];

    const renderInput = (
        field: StringField,
        label: string,
        options?: {
            type?: string;
            placeholder?: string;
            required?: boolean;
            autoComplete?: string;
            maxLength?: number;
            min?: string;
            max?: string;
        },
    ) => {
        const error = fieldError(field);

        return (
            <div className={`partner-form-group ${error ? "has-error" : ""}`} key={field}>
                <label htmlFor={`student-${field}`} className="partner-label">
                    {label}
                    {options?.required !== false && (
                        <span className="partner-required"> *</span>
                    )}
                </label>

                <input
                    id={`student-${field}`}
                    name={field}
                    className="partner-input"
                    type={options?.type ?? "text"}
                    value={form[field] as string}
                    onChange={(event) => handleTextChange(field, event)}
                    placeholder={options?.placeholder ?? ""}
                    required={options?.required !== false}
                    autoComplete={options?.autoComplete}
                    maxLength={options?.maxLength}
                    min={options?.min}
                    max={options?.max}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `student-${field}-error` : undefined}
                />

                {error && (
                    <p
                        className="partner-field-error"
                        id={`student-${field}-error`}
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    };

    const renderSelect = (
        field: StringField,
        label: string,
        placeholder: string,
        options: { value: string; label: string }[],
        required = true,
    ) => {
        const error = fieldError(field);

        return (
            <div className={`partner-form-group ${error ? "has-error" : ""}`} key={field}>
                <label htmlFor={`student-${field}`} className="partner-label">
                    {label}
                    {required && <span className="partner-required"> *</span>}
                </label>

                <select
                    id={`student-${field}`}
                    name={field}
                    className="partner-input partner-select"
                    value={form[field] as string}
                    onChange={(event) => handleTextChange(field, event)}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `student-${field}-error` : undefined}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {error && (
                    <p
                        className="partner-field-error"
                        id={`student-${field}-error`}
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    };

    const renderTextarea = (
        field: "skills" | "additionalDetails",
        label: string,
        placeholder: string,
        required = false,
    ) => {
        const error = fieldError(field);

        return (
            <div className={`partner-form-group ${error ? "has-error" : ""}`} key={field}>
                <label htmlFor={`student-${field}`} className="partner-label">
                    {label}
                    {required && <span className="partner-required"> *</span>}
                </label>

                <textarea
                    id={`student-${field}`}
                    name={field}
                    className="partner-input partner-textarea"
                    value={form[field]}
                    onChange={(event) => handleTextChange(field, event)}
                    placeholder={placeholder}
                    rows={4}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `student-${field}-error` : undefined}
                />

                {error && (
                    <p
                        className="partner-field-error"
                        id={`student-${field}-error`}
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    };

    const renderChipGroup = (
        field: "interestedAreas" | "learningGoals",
        label: string,
        hint: string,
        options: readonly { value: string; key: string }[],
    ) => {
        const selected = form[field];
        const error = fieldError(field);

        return (
            <div className={`partner-form-group ${error ? "has-error" : ""}`} key={field}>
                <div className="partner-label">{label} *</div>
                <p className="partner-field-hint">{hint}</p>

                <div className="partner-choice-grid">
                    {options.map((option) => {
                        const active = selected.includes(option.value);

                        return (
                            <button
                                key={option.value}
                                type="button"
                                className={`partner-choice-chip ${active ? "active" : ""}`}
                                aria-pressed={active}
                                onClick={() =>
                                    toggleArrayOption(field, option.value)
                                }
                            >
                                {active && <Check size={15} aria-hidden="true" />}
                                {getText(t, option.key)}
                            </button>
                        );
                    })}
                </div>

                <p className="partner-field-hint">
                    {selected.length} {getText(t, "selected")}
                </p>

                {error && (
                    <p className="partner-field-error" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    };

    const renderPasswordInput = (
        field: "password" | "confirmPassword",
        label: string,
        placeholder: string,
        visible: boolean,
        toggleVisible: () => void,
    ) => {
        const error = fieldError(field);

        return (
            <div className={`partner-form-group ${error ? "has-error" : ""}`} key={field}>
                <label htmlFor={`student-${field}`} className="partner-label">
                    {label} <span className="partner-required">*</span>
                </label>

                <div className="partner-password-wrap">
                    <LockKeyhole
                        size={18}
                        className="partner-password-icon"
                        aria-hidden="true"
                    />

                    <input
                        id={`student-${field}`}
                        name={field}
                        type={visible ? "text" : "password"}
                        className="partner-input partner-password-input"
                        value={form[field]}
                        onChange={(event) => handleTextChange(field, event)}
                        placeholder={placeholder}
                        autoComplete={
                            field === "password" ? "new-password" : "new-password"
                        }
                        required
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? `student-${field}-error` : undefined}
                    />

                    <button
                        type="button"
                        className="partner-password-toggle"
                        onClick={toggleVisible}
                        aria-label={getText(
                            t,
                            visible ? "hidePassword" : "showPassword",
                        )}
                        title={getText(
                            t,
                            visible ? "hidePassword" : "showPassword",
                        )}
                    >
                        {visible ? (
                            <EyeOff size={18} aria-hidden="true" />
                        ) : (
                            <Eye size={18} aria-hidden="true" />
                        )}
                    </button>
                </div>

                {field === "password" && (
                    <p className="partner-field-hint">
                        {getText(t, "passwordHint")}
                    </p>
                )}

                {error && (
                    <p
                        className="partner-field-error"
                        id={`student-${field}-error`}
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    };

    const renderUpload = (
        field: "resume" | "studentProof",
        label: string,
        file: File | null,
    ) => {
        const error = fileErrors[field];
        const inputId = `student-${field}`;

        return (
            <div className={`partner-form-group ${error ? "has-error" : ""}`} key={field}>
                <label htmlFor={inputId} className="partner-label">
                    {label}
                    <span className="partner-optional">
                        {" "}
                        ({getText(t, "optional")})
                    </span>
                </label>

                <div className="partner-upload-box">
                    <input
                        id={inputId}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        onChange={(event) => handleFile(event, field)}
                        className="partner-upload-input"
                    />

                    <label htmlFor={inputId} className="partner-upload-label">
                        <Upload size={22} aria-hidden="true" />
                        <span>{getText(t, "upload")}</span>
                    </label>

                    {file ? (
                        <div className="partner-upload-selected">
                            <span className="partner-upload-filename">
                                {file.name}
                            </span>

                            <button
                                type="button"
                                className="partner-upload-remove"
                                onClick={() => removeFile(field)}
                            >
                                {getText(t, "removeFile")}
                            </button>
                        </div>
                    ) : (
                        <p className="partner-field-hint">
                            {getText(t, "noFile")}
                        </p>
                    )}
                </div>

                <p className="partner-field-hint">
                    {getText(t, "uploadHint")}
                </p>

                {error && (
                    <p className="partner-field-error" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    };

    const renderConsentCheckbox = (
        field: "termsAccepted" | "consentAccepted",
        label: ReactNode,
    ) => {
        const error = fieldError(field);

        return (
            <div className={`partner-consent-row ${error ? "has-error" : ""}`}>
                <label className="partner-checkbox-label">
                    <input
                        type="checkbox"
                        checked={form[field]}
                        onChange={(event) =>
                            updateField(field, event.target.checked)
                        }
                    />
                    <span>{label}</span>
                </label>

                {error && (
                    <p className="partner-field-error" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    };

    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <>
                        <div className="partner-section-heading">
                            <h2>{getText(t, "personalTitle")}</h2>
                            <p>{getText(t, "personalDescription")}</p>
                        </div>

                        <div className="partner-form-grid">
                            {renderInput("fullName", getText(t, "fullName"), {
                                placeholder: getText(t, "fullNamePlaceholder"),
                                autoComplete: "name",
                            })}

                            {renderInput("dateOfBirth", getText(t, "dateOfBirth"), {
                                type: "date",
                                required: true,
                            })}

                            {renderSelect(
                                "gender",
                                getText(t, "gender"),
                                getText(t, "selectGender"),
                                [
                                    { value: "Male", label: getText(t, "male") },
                                    { value: "Female", label: getText(t, "female") },
                                    { value: "Other", label: getText(t, "other") },
                                    {
                                        value: "Prefer not to say",
                                        label: getText(t, "preferNotToSay"),
                                    },
                                ],
                            )}

                            {renderInput("mobile", getText(t, "mobile"), {
                                type: "tel",
                                placeholder: getText(t, "mobilePlaceholder"),
                                autoComplete: "tel-national",
                                maxLength: 10,
                            })}

                            {renderInput(
                                "alternateMobile",
                                getText(t, "alternateMobile"),
                                {
                                    type: "tel",
                                    placeholder: getText(
                                        t,
                                        "alternateMobilePlaceholder",
                                    ),
                                    required: false,
                                    maxLength: 10,
                                },
                            )}

                            {renderInput("email", getText(t, "email"), {
                                type: "email",
                                placeholder: getText(t, "emailPlaceholder"),
                                autoComplete: "email",
                            })}
                        </div>
                    </>
                );

            case 1:
                return (
                    <>
                        <div className="partner-section-heading">
                            <h2>{getText(t, "addressTitle")}</h2>
                            <p>{getText(t, "addressDescription")}</p>
                        </div>

                        <div className="partner-form-grid">
                            <div className="partner-form-full">
                                {renderInput("address", getText(t, "address"), {
                                    placeholder: getText(t, "addressPlaceholder"),
                                    autoComplete: "street-address",
                                })}
                            </div>

                            {renderInput("city", getText(t, "city"), {
                                placeholder: getText(t, "cityPlaceholder"),
                                autoComplete: "address-level2",
                            })}

                            {renderInput("state", getText(t, "state"), {
                                placeholder: getText(t, "statePlaceholder"),
                                autoComplete: "address-level1",
                            })}

                            {renderInput("pincode", getText(t, "pincode"), {
                                placeholder: getText(t, "pincodePlaceholder"),
                                autoComplete: "postal-code",
                                maxLength: 6,
                            })}

                            {renderInput("country", getText(t, "country"), {
                                placeholder: getText(t, "countryPlaceholder"),
                                autoComplete: "country-name",
                            })}
                        </div>
                    </>
                );

            case 2:
                return (
                    <>
                        <div className="partner-section-heading">
                            <h2>{getText(t, "educationTitle")}</h2>
                            <p>{getText(t, "educationDescription")}</p>
                        </div>

                        <div className="partner-form-grid">
                            {renderSelect(
                                "educationLevel",
                                getText(t, "educationLevel"),
                                getText(t, "selectEducationLevel"),
                                [
                                    { value: "School", label: getText(t, "school") },
                                    {
                                        value: "Intermediate / 12th",
                                        label: getText(t, "intermediate"),
                                    },
                                    {
                                        value: "Diploma",
                                        label: getText(t, "diploma"),
                                    },
                                    {
                                        value: "Undergraduate",
                                        label: getText(t, "undergraduate"),
                                    },
                                    {
                                        value: "Postgraduate",
                                        label: getText(t, "postgraduate"),
                                    },
                                    {
                                        value: "Doctorate",
                                        label: getText(t, "doctorate"),
                                    },
                                    {
                                        value: "Other",
                                        label: getText(t, "otherEducation"),
                                    },
                                ],
                            )}

                            {renderInput("institution", getText(t, "institution"), {
                                placeholder: getText(t, "institutionPlaceholder"),
                            })}

                            {renderInput("course", getText(t, "course"), {
                                placeholder: getText(t, "coursePlaceholder"),
                            })}

                            {renderInput("fieldOfStudy", getText(t, "fieldOfStudy"), {
                                placeholder: getText(t, "fieldOfStudyPlaceholder"),
                            })}

                            {renderInput("currentYear", getText(t, "currentYear"), {
                                placeholder: getText(t, "currentYearPlaceholder"),
                            })}

                            {renderInput(
                                "graduationYear",
                                getText(t, "graduationYear"),
                                {
                                    placeholder: getText(t, "graduationYearPlaceholder"),
                                    required: false,
                                    maxLength: 4,
                                },
                            )}

                            {renderInput("studentId", getText(t, "studentId"), {
                                placeholder: getText(t, "studentIdPlaceholder"),
                                required: false,
                            })}
                        </div>
                    </>
                );

            case 3:
                return (
                    <>
                        <div className="partner-section-heading">
                            <h2>{getText(t, "skillsTitle")}</h2>
                            <p>{getText(t, "skillsDescription")}</p>
                        </div>

                        {renderChipGroup(
                            "interestedAreas",
                            getText(t, "interestedAreas"),
                            getText(t, "selectInterests"),
                            INTEREST_OPTIONS,
                        )}

                        <div className="partner-form-grid">
                            <div className="partner-form-full">
                                {renderTextarea(
                                    "skills",
                                    getText(t, "skills"),
                                    getText(t, "skillsPlaceholder"),
                                )}
                            </div>

                            {renderSelect(
                                "experienceLevel",
                                getText(t, "experienceLevel"),
                                getText(t, "selectExperience"),
                                [
                                    {
                                        value: "Beginner",
                                        label: getText(t, "beginner"),
                                    },
                                    {
                                        value: "Intermediate",
                                        label: getText(t, "intermediateLevel"),
                                    },
                                    {
                                        value: "Advanced",
                                        label: getText(t, "advanced"),
                                    },
                                    {
                                        value: "Experienced",
                                        label: getText(t, "experienced"),
                                    },
                                ],
                            )}

                            {renderSelect(
                                "preferredLanguage",
                                getText(t, "preferredLanguage"),
                                getText(t, "selectLanguage"),
                                [
                                    { value: "English", label: getText(t, "english") },
                                    { value: "Telugu", label: getText(t, "telugu") },
                                    { value: "Hindi", label: getText(t, "hindi") },
                                ],
                            )}
                        </div>
                    </>
                );

            case 4:
                return (
                    <>
                        <div className="partner-section-heading">
                            <h2>{getText(t, "learningTitle")}</h2>
                            <p>{getText(t, "learningDescription")}</p>
                        </div>

                        {renderChipGroup(
                            "learningGoals",
                            getText(t, "learningGoals"),
                            getText(t, "selectGoals"),
                            LEARNING_GOAL_OPTIONS,
                        )}

                        <div className="partner-form-grid">
                            {renderSelect(
                                "learningMode",
                                getText(t, "learningMode"),
                                getText(t, "selectLearningMode"),
                                [
                                    { value: "Online", label: getText(t, "online") },
                                    { value: "Offline", label: getText(t, "offline") },
                                    { value: "Hybrid", label: getText(t, "hybrid") },
                                    {
                                        value: "Self-paced",
                                        label: getText(t, "selfPaced"),
                                    },
                                ],
                            )}

                            {renderSelect(
                                "availability",
                                getText(t, "availability"),
                                getText(t, "selectAvailability"),
                                [
                                    {
                                        value: "Weekdays",
                                        label: getText(t, "weekdays"),
                                    },
                                    {
                                        value: "Weekends",
                                        label: getText(t, "weekends"),
                                    },
                                    {
                                        value: "Mornings",
                                        label: getText(t, "mornings"),
                                    },
                                    {
                                        value: "Evenings",
                                        label: getText(t, "evenings"),
                                    },
                                    {
                                        value: "Flexible",
                                        label: getText(t, "flexible"),
                                    },
                                ],
                            )}

                            {renderSelect(
                                "weeklyHours",
                                getText(t, "weeklyHours"),
                                getText(t, "selectWeeklyHours"),
                                [
                                    {
                                        value: "1–5 hours",
                                        label: getText(t, "hours1to5"),
                                    },
                                    {
                                        value: "6–10 hours",
                                        label: getText(t, "hours6to10"),
                                    },
                                    {
                                        value: "11–20 hours",
                                        label: getText(t, "hours11to20"),
                                    },
                                    {
                                        value: "20+ hours",
                                        label: getText(t, "hours20plus"),
                                    },
                                ],
                                false,
                            )}

                            <div className="partner-form-full">
                                {renderTextarea(
                                    "additionalDetails",
                                    getText(t, "additionalDetails"),
                                    getText(t, "additionalDetailsPlaceholder"),
                                )}
                            </div>
                        </div>
                    </>
                );

            case 5:
                return (
                    <>
                        <div className="partner-section-heading">
                            <h2>{getText(t, "accountTitle")}</h2>
                            <p>{getText(t, "accountDescription")}</p>
                        </div>

                        <div className="partner-form-grid">
                            <div className="partner-form-full">
                                {renderPasswordInput(
                                    "password",
                                    getText(t, "password"),
                                    getText(t, "passwordPlaceholder"),
                                    showPassword,
                                    () => setShowPassword((previous) => !previous),
                                )}
                            </div>

                            <div className="partner-form-full">
                                {renderPasswordInput(
                                    "confirmPassword",
                                    getText(t, "confirmPassword"),
                                    getText(t, "confirmPasswordPlaceholder"),
                                    showConfirmPassword,
                                    () =>
                                        setShowConfirmPassword(
                                            (previous) => !previous,
                                        ),
                                )}
                            </div>

                            <div className="partner-form-full">
                                {renderUpload(
                                    "resume",
                                    getText(t, "resume"),
                                    resumeFile,
                                )}

                                {renderUpload(
                                    "studentProof",
                                    getText(t, "studentProof"),
                                    studentProofFile,
                                )}
                            </div>
                        </div>

                        <div className="partner-security-note">
                            <ShieldCheck size={22} aria-hidden="true" />
                            <div>
                                <strong>{getText(t, "securityTitle")}</strong>
                                <p>{getText(t, "securityDescription")}</p>
                            </div>
                        </div>

                        <div className="partner-consent-section">
                            {renderConsentCheckbox(
                                "termsAccepted",
                                <>
                                    {getText(t, "termsPrefix")}{" "}
                                    <Link to="/terms">
                                        {getText(t, "termsLink")}
                                    </Link>{" "}
                                    {getText(t, "and")}{" "}
                                    <Link to="/privacy">
                                        {getText(t, "privacyLink")}
                                    </Link>
                                    .
                                </>,
                            )}

                            {renderConsentCheckbox(
                                "consentAccepted",
                                getText(t, "consentText"),
                            )}
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    if (submitted) {
        return (
            <main className="tutor-register-page partner-register-page student-register-page">
                <div className="partner-register-container">
                    <section className="partner-success-card" role="status">
                        <div className="partner-success-icon">
                            <CheckCircle2 size={54} aria-hidden="true" />
                        </div>

                        <h1>{getText(t, "successTitle")}</h1>
                        <p>{getText(t, "successDescription")}</p>

                        <div className="partner-success-notice">
                            <ShieldCheck size={20} aria-hidden="true" />
                            <span>{getText(t, "successNote")}</span>
                        </div>

                        <p className="partner-field-hint">
                            {getText(t, "accountNextSteps")}
                        </p>

                        <div className="partner-success-actions">
                            <button
                                type="button"
                                className="partner-btn partner-btn-primary"
                                onClick={() => navigate("/profile")}
                            >
                                {getText(t, "goToProfile")}
                                <ArrowRight size={18} aria-hidden="true" />
                            </button>

                            <button
                                type="button"
                                className="partner-btn partner-btn-secondary"
                                onClick={() => navigate("/")}
                            >
                                {getText(t, "returnToHome")}
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="tutor-register-page partner-register-page student-register-page">
            <div className="partner-register-container">
                <header className="partner-register-header">
                    <Link to="/" className="partner-brand">
                        <span className="partner-brand-icon">
                            <GraduationCap size={28} aria-hidden="true" />
                        </span>
                        <span>{getText(t, "brand")}</span>
                    </Link>

                    <div className="partner-language-picker">
                        <Languages size={18} aria-hidden="true" />
                        <label htmlFor="student-language">
                            {getText(t, "language")}
                        </label>
                        <select
                            id="student-language"
                            value={language}
                            onChange={(event) =>
                                setLanguage(event.target.value as Language)
                            }
                            aria-label={getText(t, "language")}
                        >
                            <option value="en">{getText(t, "english")}</option>
                            <option value="te">{getText(t, "telugu")}</option>
                            <option value="hi">{getText(t, "hindi")}</option>
                        </select>
                    </div>
                </header>

                <section className="partner-register-intro">
                    <div className="partner-register-intro-icon">
                        <GraduationCap size={32} aria-hidden="true" />
                    </div>

                    <h1>{getText(t, "pageTitle")}</h1>
                    <p>{getText(t, "pageSubtitle")}</p>

                    <p className="partner-login-prompt">
                        {getText(t, "alreadyAccount")}{" "}
                        <Link to="/login">{getText(t, "login")}</Link>
                    </p>
                </section>

                <section className="partner-wizard-card">
                    <nav
                        className="partner-stepper"
                        aria-label="Student registration progress"
                    >
                        {stepNames.map((name, index) => {
                            const isComplete = index < step;
                            const isCurrent = index === step;

                            return (
                                <button
                                    type="button"
                                    key={name}
                                    className={[
                                        "partner-step",
                                        isCurrent ? "active" : "",
                                        isComplete ? "completed" : "",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    onClick={() => goToStep(index)}
                                    aria-current={isCurrent ? "step" : undefined}
                                >
                                    <span className="partner-step-circle">
                                        {isComplete ? (
                                            <Check size={16} aria-hidden="true" />
                                        ) : (
                                            index + 1
                                        )}
                                    </span>

                                    <span className="partner-step-label">
                                        {name}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    <div
                        className="partner-progress-track"
                        role="progressbar"
                        aria-valuemin={1}
                        aria-valuemax={STEP_FIELDS.length}
                        aria-valuenow={step + 1}
                        aria-label={`${getText(t, "step")} ${step + 1} ${getText(t, "of")} ${STEP_FIELDS.length}`}
                    >
                        <div
                            className="partner-progress-fill"
                            style={{
                                width: `${((step + 1) / STEP_FIELDS.length) * 100}%`,
                            }}
                        />
                    </div>

                    <div className="partner-step-count">
                        {getText(t, "step")} {step + 1} {getText(t, "of")}{" "}
                        {STEP_FIELDS.length}
                    </div>

                    <form
                        className="partner-register-form"
                        onSubmit={
                            step === STEP_FIELDS.length - 1
                                ? handleSubmit
                                : (event) => {
                                      event.preventDefault();
                                      handleNext();
                                  }
                        }
                        noValidate
                    >
                        {renderStepContent()}

                        {formError && (
                            <div className="partner-form-alert" role="alert">
                                {formError}
                            </div>
                        )}

                        <div className="partner-wizard-actions">
                            <button
                                type="button"
                                className="partner-btn partner-btn-secondary"
                                onClick={handleBack}
                                disabled={step === 0}
                            >
                                <ArrowLeft size={18} aria-hidden="true" />
                                {getText(t, "back")}
                            </button>

                            {step < STEP_FIELDS.length - 1 ? (
                                <button
                                    type="submit"
                                    className="partner-btn partner-btn-primary"
                                >
                                    {getText(t, "next")}
                                    <ArrowRight size={18} aria-hidden="true" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="partner-btn partner-btn-primary"
                                >
                                    {getText(t, "submit")}
                                    <CheckCircle2 size={18} aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <footer className="partner-register-footer">
                    <ShieldCheck size={16} aria-hidden="true" />
                    <span>{getText(t, "securityTitle")}</span>
                </footer>
            </div>
        </main>
    );
}

export default StudentRegisterPage;
