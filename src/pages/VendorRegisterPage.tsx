import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
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
} from "lucide-react";
import "./VendorRegisterPage.css";

type VendorFormData = {
  contactName: string;
  designation: string;
  mobile: string;
  whatsapp: string;
  email: string;

  businessName: string;
  businessType: string;
  yearEstablished: string;
  website: string;
  address: string;
  city: string;
  state: string;
  pincode: string;

  productCategories: string[];
  brands: string;
  productTypes: string;
  skuCount: string;
  salesType: string;

  catalogue: File | null;

  deliveryAreas: string;
  dispatchTime: string;
  shippingMethod: string;
  returnPolicy: string;

  panNumber: string;
  gstNumber: string;

  businessRegistration: File | null;
  panDocument: File | null;
  gstDocument: File | null;
  addressProof: File | null;

  accountHolder: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifsc: string;
  upiId: string;

  password: string;
  confirmPassword: string;

  terms: boolean;
  verificationConsent: boolean;
  vendorAgreement: boolean;
};

const productCategories = [
  "AC Accessories",
  "Electrical Accessories",
  "Plumbing Materials",
  "Home Appliances",
  "Cleaning Products",
  "Water Purifier Parts",
  "Refrigerator Parts",
  "Washing Machine Parts",
  "TV Accessories",
  "Tools & Equipment",
  "Safety Equipment",
  "Other",
];

const initialFormData: VendorFormData = {
  contactName: "",
  designation: "",
  mobile: "",
  whatsapp: "",
  email: "",

  businessName: "",
  businessType: "",
  yearEstablished: "",
  website: "",
  address: "",
  city: "",
  state: "",
  pincode: "",

  productCategories: [],
  brands: "",
  productTypes: "",
  skuCount: "",
  salesType: "",

  catalogue: null,

  deliveryAreas: "",
  dispatchTime: "",
  shippingMethod: "",
  returnPolicy: "",

  panNumber: "",
  gstNumber: "",

  businessRegistration: null,
  panDocument: null,
  gstDocument: null,
  addressProof: null,

  accountHolder: "",
  bankName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  ifsc: "",
  upiId: "",

  password: "",
  confirmPassword: "",

  terms: false,
  verificationConsent: false,
  vendorAgreement: false,
};

function VendorRegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<VendorFormData>(initialFormData);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [showAccountNumber, setShowAccountNumber] =
    useState(false);
  const [showConfirmAccountNumber, setShowConfirmAccountNumber] =
    useState(false);

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: keyof VendorFormData
  ) => {
    const file = event.target.files?.[0] ?? null;

    setFormData((previous) => ({
      ...previous,
      [field]: file,
    }));

    setError("");
  };

  const handleCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: checked,
    }));

    setError("");
  };

  const toggleProductCategory = (category: string) => {
    setFormData((previous) => {
      const exists =
        previous.productCategories.includes(category);

      return {
        ...previous,
        productCategories: exists
          ? previous.productCategories.filter(
              (item) => item !== category
            )
          : [...previous.productCategories, category],
      };
    });

    setError("");
  };

  const validateForm = () => {
    if (!formData.contactName.trim()) {
      return "Please enter the contact person's name.";
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      return "Please enter a valid 10-digit mobile number.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (!formData.businessName.trim()) {
      return "Please enter your business name.";
    }

    if (!formData.businessType) {
      return "Please select your business type.";
    }

    if (!formData.address.trim()) {
      return "Please enter your business address.";
    }

    if (!formData.city.trim()) {
      return "Please enter your city.";
    }

    if (!formData.state.trim()) {
      return "Please enter your state.";
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      return "Please enter a valid 6-digit pincode.";
    }

    if (!formData.productCategories.length) {
      return "Please select at least one product category.";
    }

    if (!formData.brands.trim()) {
      return "Please enter the brands you sell.";
    }

    if (!formData.productTypes.trim()) {
      return "Please describe the products you sell.";
    }

    if (!formData.skuCount) {
      return "Please select your approximate SKU count.";
    }

    if (!formData.salesType) {
      return "Please select your sales model.";
    }

    if (!formData.catalogue) {
      return "Please upload your product catalogue.";
    }

    if (!formData.deliveryAreas.trim()) {
      return "Please enter your delivery areas.";
    }

    if (!formData.dispatchTime) {
      return "Please select your dispatch time.";
    }

    if (!formData.shippingMethod) {
      return "Please select your shipping method.";
    }

    if (!formData.returnPolicy) {
      return "Please select your return/replacement policy.";
    }

    if (!formData.panNumber.trim()) {
      return "Please enter your PAN number.";
    }

    if (!formData.businessRegistration) {
      return "Please upload your business registration document.";
    }

    if (!formData.panDocument) {
      return "Please upload your PAN document.";
    }

    if (!formData.addressProof) {
      return "Please upload your address proof.";
    }

    if (!formData.accountHolder.trim()) {
      return "Please enter the account holder name.";
    }

    if (!formData.bankName.trim()) {
      return "Please enter your bank name.";
    }

    if (!formData.accountNumber.trim()) {
      return "Please enter your bank account number.";
    }

    if (
      formData.accountNumber !==
      formData.confirmAccountNumber
    ) {
      return "Bank account numbers do not match.";
    }

    if (!formData.ifsc.trim()) {
      return "Please enter your IFSC code.";
    }

    if (formData.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!formData.terms) {
      return "Please accept the Terms & Conditions.";
    }

    if (!formData.verificationConsent) {
      return "Please provide verification consent.";
    }

    if (!formData.vendorAgreement) {
      return "Please accept the Vendor Agreement.";
    }

    return "";
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setError("");
    setIsSubmitting(true);

    // API integration will be connected here later.
    await new Promise((resolve) => setTimeout(resolve, 900));

    setIsSubmitting(false);
    setSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (submitted) {
    return (
      <main className="vendor-register-page">
        <section className="vendor-success-section">
          <div className="vendor-success-card">
            <div className="vendor-success-icon">
              <Check size={34} />
            </div>

            <span className="vendor-eyebrow">
              APPLICATION SUBMITTED
            </span>

            <h1>Welcome to the OneService marketplace.</h1>

            <p>
              Your vendor application has been submitted
              successfully. Our team will review your business
              and product information before activation.
            </p>

            <div className="vendor-success-summary">
              <div>
                <span>Business</span>
                <strong>{formData.businessName}</strong>
              </div>

              <div>
                <span>Contact</span>
                <strong>{formData.contactName}</strong>
              </div>

              <div>
                <span>Mobile</span>
                <strong>+91 {formData.mobile}</strong>
              </div>
            </div>

            <div className="vendor-success-actions">
              <Link
                to="/"
                className="vendor-secondary-button"
              >
                Back to Home
              </Link>

              <button
                type="button"
                className="vendor-primary-button"
                onClick={() => navigate("/login")}
              >
                Go to Login
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="vendor-register-page">
      {/* HERO */}
      <section className="vendor-register-hero">
        <div className="vendor-register-hero-inner">
          <div>
            <span className="vendor-eyebrow">
              VENDOR REGISTRATION
            </span>

            <h1>
              Sell your products
              <br />
              through <span>NeedOneService.</span>
            </h1>

            <p>
              Register as a vendor and showcase your products
              and accessories to customers and service
              professionals across the NeedOneService network.
            </p>
          </div>

          <div className="vendor-hero-badge">
            <div className="vendor-hero-badge-icon">
              <FileText size={21} />
            </div>

            <div>
              <strong>Marketplace Vendor</strong>
              <span>
                Products, catalogue & business onboarding
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="vendor-register-content">
        <div className="vendor-register-container">
          <div className="vendor-register-top">
            <div>
              <span className="vendor-section-label">
                JOIN OUR NETWORK
              </span>

              <h2>Create your vendor profile</h2>

              <p>
                Provide your business, product and payment
                information.
              </p>
            </div>

            <div className="vendor-login-note">
              Already registered?
              <Link to="/login"> Sign in</Link>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="vendor-progress">
            <ProgressItem number="01" label="Contact" />
            <ProgressLine />
            <ProgressItem number="02" label="Business" />
            <ProgressLine />
            <ProgressItem number="03" label="Products" />
            <ProgressLine />
            <ProgressItem number="04" label="Delivery" />
            <ProgressLine />
            <ProgressItem number="05" label="Verification" />
          </div>

          <form
            className="vendor-register-form"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="vendor-form-error">
                {error}
              </div>
            )}

            {/* CONTACT */}
            <section className="vendor-form-section">
              <SectionHeading
                number="01"
                title="Contact person"
                description="Tell us who we should contact regarding your vendor account."
              />

              <div className="vendor-form-grid">
                <label className="vendor-field">
                  <span>Full name *</span>

                  <div className="vendor-input-wrap">
                    <UserRound size={17} />

                    <input
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleTextChange}
                      placeholder="Enter full name"
                    />
                  </div>
                </label>

                <label className="vendor-field">
                  <span>Designation</span>

                  <input
                    name="designation"
                    value={formData.designation}
                    onChange={handleTextChange}
                    placeholder="Owner / Manager / Director"
                  />
                </label>

                <label className="vendor-field">
                  <span>Mobile number *</span>

                  <div className="vendor-input-wrap">
                    <Phone size={17} />

                    <span className="vendor-country-code">
                      +91
                    </span>

                    <input
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleTextChange}
                      maxLength={10}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </label>

                <label className="vendor-field">
                  <span>WhatsApp number</span>

                  <input
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleTextChange}
                    maxLength={10}
                    placeholder="WhatsApp number"
                  />
                </label>

                <label className="vendor-field vendor-field-full">
                  <span>Email address *</span>

                  <div className="vendor-input-wrap">
                    <Mail size={17} />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleTextChange}
                      placeholder="business@example.com"
                    />
                  </div>
                </label>
              </div>
            </section>

            {/* BUSINESS */}
            <section className="vendor-form-section">
              <SectionHeading
                number="02"
                title="Business information"
                description="Provide the basic details of your business or store."
              />

              <div className="vendor-form-grid">
                <label className="vendor-field">
                  <span>Business / Store name *</span>

                  <input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleTextChange}
                    placeholder="Enter business name"
                  />
                </label>

                <label className="vendor-field">
                  <span>Business type *</span>

                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select business type
                    </option>
                    <option value="manufacturer">
                      Manufacturer
                    </option>
                    <option value="distributor">
                      Distributor
                    </option>
                    <option value="wholesaler">
                      Wholesaler
                    </option>
                    <option value="retailer">
                      Retailer
                    </option>
                    <option value="dealer">Dealer</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="vendor-field">
                  <span>Year established</span>

                  <input
                    name="yearEstablished"
                    value={formData.yearEstablished}
                    onChange={handleTextChange}
                    placeholder="e.g. 2018"
                  />
                </label>

                <label className="vendor-field">
                  <span>Website</span>

                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleTextChange}
                    placeholder="https://yourbusiness.com"
                  />
                </label>

                <label className="vendor-field vendor-field-full">
                  <span>Business address *</span>

                  <div className="vendor-input-wrap vendor-textarea-wrap">
                    <MapPin size={17} />

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleTextChange}
                      placeholder="Enter complete business address"
                      rows={4}
                    />
                  </div>
                </label>

                <label className="vendor-field">
                  <span>City *</span>

                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleTextChange}
                    placeholder="Enter city"
                  />
                </label>

                <label className="vendor-field">
                  <span>State *</span>

                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleTextChange}
                    placeholder="Enter state"
                  />
                </label>

                <label className="vendor-field">
                  <span>Pincode *</span>

                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleTextChange}
                    maxLength={6}
                    placeholder="6-digit pincode"
                  />
                </label>
              </div>
            </section>

            {/* PRODUCTS */}
            <section className="vendor-form-section">
              <SectionHeading
                number="03"
                title="Products & brands"
                description="Tell us what you want to sell through the OneService marketplace."
              />

              <div className="vendor-form-grid">
                <div className="vendor-field vendor-field-full">
                  <span>Product categories *</span>

                  <div className="vendor-chip-grid">
                    {productCategories.map((category) => {
                      const selected =
                        formData.productCategories.includes(
                          category
                        );

                      return (
                        <button
                          key={category}
                          type="button"
                          className={`vendor-product-chip ${
                            selected ? "selected" : ""
                          }`}
                          onClick={() =>
                            toggleProductCategory(category)
                          }
                        >
                          {selected && <Check size={14} />}
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="vendor-field">
                  <span>Brands you sell *</span>

                  <input
                    name="brands"
                    value={formData.brands}
                    onChange={handleTextChange}
                    placeholder="e.g. LG, Samsung, Voltas"
                  />
                </label>

                <label className="vendor-field">
                  <span>Approximate SKU count *</span>

                  <select
                    name="skuCount"
                    value={formData.skuCount}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select SKU count
                    </option>
                    <option value="1-20">1–20</option>
                    <option value="21-50">21–50</option>
                    <option value="51-100">51–100</option>
                    <option value="101-500">101–500</option>
                    <option value="501-1000">501–1,000</option>
                    <option value="1000+">1,000+</option>
                  </select>
                </label>

                <label className="vendor-field vendor-field-full">
                  <span>Products you sell *</span>

                  <textarea
                    name="productTypes"
                    value={formData.productTypes}
                    onChange={handleTextChange}
                    placeholder="Describe the products, accessories, spare parts or equipment you sell..."
                    rows={4}
                  />
                </label>

                <label className="vendor-field">
                  <span>Sales model *</span>

                  <select
                    name="salesType"
                    value={formData.salesType}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select sales model
                    </option>
                    <option value="wholesale">
                      Wholesale
                    </option>
                    <option value="retail">Retail</option>
                    <option value="both">
                      Wholesale & Retail
                    </option>
                  </select>
                </label>

                <FileUpload
                  label="Product catalogue *"
                  file={formData.catalogue}
                  onChange={(event) =>
                    handleFileChange(event, "catalogue")
                  }
                  hint="PDF, XLSX, JPG or PNG"
                />
              </div>
            </section>

            {/* DELIVERY */}
            <section className="vendor-form-section">
              <SectionHeading
                number="04"
                title="Order & delivery"
                description="Tell us how orders will be processed and delivered."
              />

              <div className="vendor-form-grid">
                <label className="vendor-field vendor-field-full">
                  <span>Delivery areas *</span>

                  <input
                    name="deliveryAreas"
                    value={formData.deliveryAreas}
                    onChange={handleTextChange}
                    placeholder="Cities, states or PIN codes you can deliver to"
                  />
                </label>

                <label className="vendor-field">
                  <span>Dispatch time *</span>

                  <select
                    name="dispatchTime"
                    value={formData.dispatchTime}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select dispatch time
                    </option>
                    <option value="same-day">
                      Same day
                    </option>
                    <option value="1-2-days">
                      1–2 business days
                    </option>
                    <option value="3-5-days">
                      3–5 business days
                    </option>
                    <option value="5-plus">
                      More than 5 business days
                    </option>
                  </select>
                </label>

                <label className="vendor-field">
                  <span>Shipping method *</span>

                  <select
                    name="shippingMethod"
                    value={formData.shippingMethod}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select shipping method
                    </option>
                    <option value="vendor-shipping">
                      Vendor-managed shipping
                    </option>
                    <option value="courier">
                      Courier partner
                    </option>
                    <option value="logistics">
                      Logistics company
                    </option>
                    <option value="customer-pickup">
                      Customer pickup
                    </option>
                    <option value="mixed">
                      Multiple methods
                    </option>
                  </select>
                </label>

                <label className="vendor-field vendor-field-full">
                  <span>Return / replacement policy *</span>

                  <select
                    name="returnPolicy"
                    value={formData.returnPolicy}
                    onChange={handleTextChange}
                  >
                    <option value="">
                      Select your policy
                    </option>
                    <option value="7-days">
                      7-day return / replacement
                    </option>
                    <option value="15-days">
                      15-day return / replacement
                    </option>
                    <option value="30-days">
                      30-day return / replacement
                    </option>
                    <option value="brand-warranty">
                      Brand warranty only
                    </option>
                    <option value="case-by-case">
                      Case-by-case
                    </option>
                  </select>
                </label>
              </div>
            </section>

            {/* VERIFICATION */}
            <section className="vendor-form-section">
              <SectionHeading
                number="05"
                title="Business verification"
                description="Upload the documents required to verify your vendor account."
              />

              <div className="vendor-form-grid">
                <label className="vendor-field">
                  <span>PAN number *</span>

                  <input
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleTextChange}
                    placeholder="Enter PAN number"
                  />
                </label>

                <label className="vendor-field">
                  <span>GST number</span>

                  <input
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleTextChange}
                    placeholder="If applicable"
                  />
                </label>

                <FileUpload
                  label="Business registration *"
                  file={formData.businessRegistration}
                  onChange={(event) =>
                    handleFileChange(
                      event,
                      "businessRegistration"
                    )
                  }
                  hint="PDF, JPG or PNG"
                />

                <FileUpload
                  label="PAN document *"
                  file={formData.panDocument}
                  onChange={(event) =>
                    handleFileChange(
                      event,
                      "panDocument"
                    )
                  }
                  hint="PDF, JPG or PNG"
                />

                <FileUpload
                  label="GST document"
                  file={formData.gstDocument}
                  onChange={(event) =>
                    handleFileChange(
                      event,
                      "gstDocument"
                    )
                  }
                  hint="PDF, JPG or PNG"
                />

                <FileUpload
                  label="Business address proof *"
                  file={formData.addressProof}
                  onChange={(event) =>
                    handleFileChange(
                      event,
                      "addressProof"
                    )
                  }
                  hint="PDF, JPG or PNG"
                />
              </div>
            </section>

            {/* PAYMENT */}
            <section className="vendor-form-section">
              <SectionHeading
                number="06"
                title="Payment details"
                description="Provide the account where marketplace payments can be settled."
              />

              <div className="vendor-form-grid">
                <label className="vendor-field">
                  <span>Account holder name *</span>

                  <input
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleTextChange}
                    placeholder="As per bank account"
                  />
                </label>

                <label className="vendor-field">
                  <span>Bank name *</span>

                  <input
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleTextChange}
                    placeholder="Enter bank name"
                  />
                </label>

                <label className="vendor-field">
                  <span>Account number *</span>

                  <div className="vendor-input-wrap">
                    <input
                      type={
                        showAccountNumber
                          ? "text"
                          : "password"
                      }
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleTextChange}
                      placeholder="Enter account number"
                    />

                    <button
                      type="button"
                      className="vendor-password-button"
                      onClick={() =>
                        setShowAccountNumber(
                          (previous) => !previous
                        )
                      }
                    >
                      {showAccountNumber ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </label>

                <label className="vendor-field">
                  <span>Confirm account number *</span>

                  <div className="vendor-input-wrap">
                    <input
                      type={
                        showConfirmAccountNumber
                          ? "text"
                          : "password"
                      }
                      name="confirmAccountNumber"
                      value={
                        formData.confirmAccountNumber
                      }
                      onChange={handleTextChange}
                      placeholder="Re-enter account number"
                    />

                    <button
                      type="button"
                      className="vendor-password-button"
                      onClick={() =>
                        setShowConfirmAccountNumber(
                          (previous) => !previous
                        )
                      }
                    >
                      {showConfirmAccountNumber ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </label>

                <label className="vendor-field">
                  <span>IFSC code *</span>

                  <input
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={handleTextChange}
                    placeholder="Enter IFSC code"
                  />
                </label>

                <label className="vendor-field">
                  <span>UPI ID</span>

                  <input
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleTextChange}
                    placeholder="business@upi"
                  />
                </label>
              </div>
            </section>

            {/* SECURITY */}
            <section className="vendor-form-section">
              <SectionHeading
                number="07"
                title="Account security"
                description="Create secure login credentials for your vendor account."
              />

              <div className="vendor-form-grid">
                <label className="vendor-field">
                  <span>Password *</span>

                  <div className="vendor-input-wrap">
                    <LockKeyhole size={17} />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleTextChange}
                      placeholder="Minimum 8 characters"
                    />

                    <button
                      type="button"
                      className="vendor-password-button"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </label>

                <label className="vendor-field">
                  <span>Confirm password *</span>

                  <div className="vendor-input-wrap">
                    <LockKeyhole size={17} />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleTextChange}
                      placeholder="Re-enter password"
                    />

                    <button
                      type="button"
                      className="vendor-password-button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </label>
              </div>
            </section>

            {/* AGREEMENTS */}
            <section className="vendor-consent-section">
              <label className="vendor-check-row">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleCheckboxChange}
                />

                <span>
                  I agree to the{" "}
                  <Link to="/terms">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <label className="vendor-check-row">
                <input
                  type="checkbox"
                  name="verificationConsent"
                  checked={formData.verificationConsent}
                  onChange={handleCheckboxChange}
                />

                <span>
                  I authorize NeedOneService to verify the
                  business and documents submitted in this
                  application.
                </span>
              </label>

              <label className="vendor-check-row">
                <input
                  type="checkbox"
                  name="vendorAgreement"
                  checked={formData.vendorAgreement}
                  onChange={handleCheckboxChange}
                />

                <span>
                  I agree to the OneService Vendor Agreement
                  and marketplace requirements.
                </span>
              </label>
            </section>

            {/* SUBMIT */}
            <div className="vendor-submit-area">
              <div className="vendor-submit-note">
                <FileText size={17} />

                <span>
                  Your vendor account will be reviewed before
                  marketplace activation.
                </span>
              </div>

              <button
                type="submit"
                className="vendor-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Submit Vendor Application"}

                {!isSubmitting && (
                  <ArrowRight size={18} />
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   SMALL REUSABLE UI
========================================================= */

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="vendor-form-heading">
      <div className="vendor-form-number">{number}</div>

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function ProgressItem({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="vendor-progress-item active">
      <span>{number}</span>
      <strong>{label}</strong>
    </div>
  );
}

function ProgressLine() {
  return <div className="vendor-progress-line" />;
}

function FileUpload({
  label,
  file,
  onChange,
  hint,
}: {
  label: string;
  file: File | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  hint: string;
}) {
  return (
    <label className="vendor-file-upload">
      <span>{label}</span>

      <div className="vendor-file-box">
        <Upload size={18} />

        <div>
          <strong>
            {file ? file.name : "Choose a document"}
          </strong>

          <small>
            {file
              ? `${Math.round(file.size / 1024)} KB`
              : hint}
          </small>
        </div>
      </div>

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
        onChange={onChange}
      />
    </label>
  );
}

export default VendorRegisterPage;