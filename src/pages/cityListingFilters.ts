
export type ListingFilterGroup = {
    id: string;
    label: string;
    options: string[];
};

const educationFilters: Record<string, ListingFilterGroup[]> = {
    "Schools & Play Preschools": [
        {
            id: "board",
            label: "Syllabus / Board",
            options: ["CBSE", "ICSE", "State Board", "IB", "Cambridge"],
        },
        {
            id: "schoolType",
            label: "School Type",
            options: ["Play School", "Preschool", "Primary", "High School"],
        },
        {
            id: "medium",
            label: "Medium of Instruction",
            options: ["English", "Telugu", "Hindi"],
        },
    ],
    "Tutions & Academics": [
        {
            id: "subjects",
            label: "Subjects",
            options: [
                "Mathematics",
                "Physics",
                "Chemistry",
                "Biology",
                "English",
                "Accountancy",
            ],
        },
        {
            id: "exams",
            label: "Exam Preparation",
            options: ["JEE", "NEET", "EAMCET", "UPSC", "SSC", "Banking"],
        },
        {
            id: "teachingMode",
            label: "Teaching Mode",
            options: ["Classroom", "Online", "One-to-One", "Home Tuition"],
        },
    ],
    "Competitive Coaching": [
        {
            id: "exams",
            label: "Competitive Exams",
            options: ["JEE", "NEET", "EAMCET", "UPSC", "SSC", "Banking"],
        },
        {
            id: "teachingMode",
            label: "Teaching Mode",
            options: ["Classroom", "Online", "Hybrid"],
        },
    ],
    "Coaching Centres": [
        {
            id: "subjects",
            label: "Subjects",
            options: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
        },
        {
            id: "teachingMode",
            label: "Teaching Mode",
            options: ["Classroom", "Online", "Hybrid"],
        },
    ],
};

const healthFilters: Record<string, ListingFilterGroup[]> = {
    "Hospitals & Clinics": [
        {
            id: "specialties",
            label: "Medical Speciality",
            options: [
                "General Medicine",
                "Gynecology",
                "Orthopedics",
                "Physiotherapy",
                "Neurology",
                "Cardiology",
                "Dermatology",
                "Pediatrics",
            ],
        },
        {
            id: "facilities",
            label: "Facilities",
            options: ["Diagnostics", "Emergency", "Pharmacy", "Inpatient Care"],
        },
    ],
    "Specialized Clinics": [
        {
            id: "specialties",
            label: "Medical Speciality",
            options: [
                "Gynecology",
                "Orthopedics",
                "Physiotherapy",
                "Neurology",
                "Cardiology",
                "Dermatology",
                "Dental",
            ],
        },
    ],
    "Diagnostic Centres": [
        {
            id: "diagnostics",
            label: "Diagnostic Services",
            options: ["Blood Tests", "X-Ray", "MRI", "CT Scan", "Ultrasound"],
        },
    ],
};

const propertyFilters: Record<string, ListingFilterGroup[]> = {
    "Property Sales": [
        {
            id: "propertyType",
            label: "Property Type",
            options: ["Apartment", "Independent House", "Villa", "Plot", "Office"],
        },
        {
            id: "configuration",
            label: "Configuration",
            options: ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"],
        },
    ],
    "Rentals & Leasing": [
        {
            id: "propertyType",
            label: "Property Type",
            options: [
                "Apartment",
                "Independent House",
                "Villa",
                "Office",
                "Shop",
                "Warehouse",
            ],
        },
        {
            id: "furnishing",
            label: "Furnishing",
            options: ["Unfurnished", "Semi-Furnished", "Fully Furnished"],
        },
    ],
};

const categoryDefaults: Record<string, ListingFilterGroup[]> = {
    "civil-construction": [
        {
            id: "services",
            label: "Construction Services",
            options: [
                "Civil Contractors",
                "Architects",
                "Structural Engineering",
                "Renovation",
                "Building Materials",
                "Heavy Equipment",
            ],
        },
    ],
    interior: [
        {
            id: "services",
            label: "Interior Services",
            options: [
                "Interior Design",
                "Modular Kitchens",
                "Furniture",
                "Lighting",
                "Renovation",
                "Decor & Furnishings",
            ],
        },
    ],
    "professional-business": [
        {
            id: "services",
            label: "Professional Services",
            options: [
                "Legal",
                "Accounting",
                "Tax Consultancy",
                "Financial Services",
                "Business Registration",
            ],
        },
    ],
    "it-security": [
        {
            id: "services",
            label: "IT & Security Services",
            options: [
                "Computer Repair",
                "Networking",
                "CCTV",
                "Access Control",
                "Cybersecurity",
                "Automation",
            ],
        },
    ],
    "events-media": [
        {
            id: "services",
            label: "Event & Media Services",
            options: [
                "Event Planning",
                "Photography",
                "Videography",
                "Catering",
                "Entertainment",
            ],
        },
    ],
    "travel-logistics": [
        {
            id: "services",
            label: "Travel & Logistics",
            options: [
                "Travel Agency",
                "Vehicle Rental",
                "Packers & Movers",
                "Courier",
                "Freight Transport",
            ],
        },
    ],
    automotive: [
        {
            id: "services",
            label: "Automotive Services",
            options: [
                "Car Servicing",
                "Bike Servicing",
                "Engine Repair",
                "Car Interiors",
                "Dealerships",
                "Spare Parts",
            ],
        },
    ],
    industrial: [
        {
            id: "services",
            label: "Industrial Services",
            options: [
                "Machinery",
                "Industrial Tools",
                "Printing",
                "Packaging",
                "Manufacturing",
            ],
        },
    ],
    "hotel-bookings": [
        {
            id: "accommodation",
            label: "Accommodation Type",
            options: [
                "Hotels",
                "Resorts",
                "Budget Stays",
                "Luxury Stays",
                "Service Apartments",
                "Guest Houses",
                "Banquet Halls",
            ],
        },
    ],
};

const educationFallback: ListingFilterGroup[] = [
    {
        id: "educationServices",
        label: "Education Services",
        options: [
            "School",
            "College",
            "Competitive Coaching",
            "IT Training",
            "Skill Training",
            "Tuition",
        ],
    },
];

const healthFallback: ListingFilterGroup[] = [
    {
        id: "specialties",
        label: "Medical Speciality",
        options: [
            "General Medicine",
            "Gynecology",
            "Orthopedics",
            "Physiotherapy",
            "Neurology",
            "Diagnostics",
        ],
    },
];

const propertyFallback: ListingFilterGroup[] = [
    {
        id: "propertyType",
        label: "Property Type",
        options: [
            "Apartment",
            "Independent House",
            "Villa",
            "Plot",
            "Office",
            "Shop",
        ],
    },
];

export function getListingFilterGroups(
    categoryId: string,
    subcategory: string,
): ListingFilterGroup[] {
    const normalizedSubcategory = subcategory.trim().toLowerCase();

    if (categoryId === "education") {
        if (normalizedSubcategory === "all") {
            return Object.values(educationFilters).flat();
        }

        return educationFilters[subcategory] ?? educationFallback;
    }

    if (categoryId === "health") {
        if (normalizedSubcategory === "all") {
            return Object.values(healthFilters).flat();
        }

        return healthFilters[subcategory] ?? healthFallback;
    }

    if (categoryId === "real-estate" || categoryId === "find-my-property") {
        if (normalizedSubcategory === "all") {
            return Object.values(propertyFilters).flat();
        }

        return propertyFilters[subcategory] ?? propertyFallback;
    }

    return categoryDefaults[categoryId] ?? [
        {
            id: "services",
            label: "Services & Specialities",
            options: [],
        },
    ];
}
