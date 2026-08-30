import { useState, useRef, useEffect } from 'react';
import { FormData, SymptomSeverity } from '../types/form';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Users, Copy, ExternalLink, X, Check, HelpCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const REFERRAL_URL = 'https://thprefferal.bolt.host/';

function ReferralModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = REFERRAL_URL;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-white border-2 border-black p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors border border-black"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <Users className="w-5 h-5" />
          <h2 className="text-lg font-bold">Refer a Friend</h2>
        </div>

        <div className="space-y-3">
          <div className="border-2 border-black p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Copy &amp; Send Link</p>
            <p className="text-xs text-gray-600 mb-3">Click to copy the link below and paste it to your friend in any chat.</p>
            <div className="flex items-center bg-gray-50 border border-gray-300 p-2 mb-3">
              <span className="text-xs text-gray-700 flex-1 truncate font-mono">{REFERRAL_URL}</span>
            </div>
            <button
              onClick={handleCopy}
              className={`w-full flex items-center justify-center gap-2 p-3 border-2 border-black font-medium text-sm transition-colors ${
                copied ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Click to Copy
                </>
              )}
            </button>
          </div>

          <div className="border-2 border-black p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Open Referral Link</p>
            <p className="text-xs text-gray-600 mb-3">Open the referral page directly in a new tab.</p>
            <a
              href={REFERRAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 p-3 bg-black text-white border-2 border-black font-medium text-sm hover:bg-gray-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Refer a Friend Link
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const maleGoals = [
  'Optimize testosterone/DHT naturally',
  'Lose body fat / get leaner',
  'Build muscle and strength',
  'Fix libido/sexual performance',
  'Increase energy and mental clarity',
  'Other'
];

const femaleGoals = [
  'Balance hormones',
  'Lose body fat / get leaner',
  'Build muscle and tone',
  'Fix libido/sexual health',
  'Increase energy and mental clarity',
  'Regulate menstrual cycle',
  'Other'
];

const maleSymptoms = [
  'Low energy',
  'Brain fog',
  'Weak libido',
  'Soft physique',
  'Poor sleep',
  'Low confidence',
  'Gynecomastia',
  'Other'
];

const femaleSymptoms = [
  'Low energy',
  'Brain fog',
  'Low libido',
  'Stubborn fat',
  'Irregular periods',
  'PMS/mood swings',
  'PCOS',
  'Thyroid issues',
  'Other'
];

const malePreviousAttempts = [
  'TRT/HRT',
  'Supplements',
  'Diet protocols',
  'Training programs',
  'Other coaches',
  'Nothing yet'
];

const femalePreviousAttempts = [
  'Birth control/HRT',
  'Supplements',
  'Diet protocols',
  'Training programs',
  'Other coaches',
  'Nothing yet'
];

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [showBodyFatHelper, setShowBodyFatHelper] = useState(false);
  const formContentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    gender: '',
    currentStateGoals: [],
    otherGoal: '',
    mostImportantGoal: '',
    currentWeight: '',
    height: '',
    age: '',
    bodyFatCurrent: '',
    bodyFatGoal: '',
    bodyFatDuration: '',
    symptomSeverities: [],
    otherSymptom: '',
    symptomDuration: '',
    bloodworkStatus: '',
    testosteroneLevel: '',
    lastLabsDate: '',
    previousAttempts: [],
    supplementsUsed: '',
    whatTried: '',
    howLongStuck: '',
    whyStoppedWorking: '',
    whyStillLooking: '',
    hoursPerWeek: '',
    currentTrainingProgram: '',
    medicalConditions: '',
    stressSleepSituation: '',
    consequences: '',
    lifeSolved: '',
    howFoundUs: '',
    commitmentLevel: '',
    investmentRange: '',
    wasReferred: '',
    referredBy: '',
    email: '',
    phone: '',
    instagram: ''
  });

  const getTotalSteps = () => {
    return 14;
  };

  const handleStepBack = () => {
    setShowValidationError(false);
    setStep(step - 1);
  };

  const handleCheckbox = (field: keyof FormData, value: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(value)) {
      setFormData({ ...formData, [field]: currentArray.filter(v => v !== value) });
    } else {
      setFormData({ ...formData, [field]: [...currentArray, value] });
    }
  };

  const handleSymptomSeverity = (symptom: string, severity: number) => {
    const existing = formData.symptomSeverities.find(s => s.symptom === symptom);
    if (existing) {
      setFormData({
        ...formData,
        symptomSeverities: formData.symptomSeverities.map(s =>
          s.symptom === symptom ? { ...s, severity } : s
        )
      });
    } else {
      setFormData({
        ...formData,
        symptomSeverities: [...formData.symptomSeverities, { symptom, severity }]
      });
    }
  };

  const removeSymptom = (symptom: string) => {
    setFormData({
      ...formData,
      symptomSeverities: formData.symptomSeverities.filter(s => s.symptom !== symptom)
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.gender !== '' && formData.fullName.trim() !== '';
      case 2:
        return formData.currentStateGoals.length > 0;
      case 3:
        return formData.bodyFatCurrent !== '' && formData.bodyFatGoal !== '';
      case 4:
        return formData.symptomSeverities.length > 0;
      case 5:
        return formData.bloodworkStatus !== '';
      case 6:
        return formData.previousAttempts.length > 0;
      case 7:
        return formData.whyStillLooking.trim() !== '';
      case 8:
        return formData.hoursPerWeek.trim() !== '' && formData.currentTrainingProgram.trim() !== '' &&
               formData.medicalConditions.trim() !== '' && formData.stressSleepSituation.trim() !== '';
      case 9:
        return formData.consequences.trim() !== '' && formData.lifeSolved.trim() !== '';
      case 10:
        return formData.howFoundUs.trim() !== '';
      case 11:
        return formData.commitmentLevel !== '';
      case 12:
        return formData.investmentRange !== '';
      case 13:
        return formData.wasReferred !== '';
      case 14:
        return formData.email.trim() !== '';
      default:
        return false;
    }
  };

  const getMissingFields = (): string[] => {
    switch (step) {
      case 1: {
        const missing = [];
        if (formData.fullName.trim() === '') missing.push('Full Name');
        if (formData.gender === '') missing.push('Gender (Male/Female)');
        return missing;
      }
      case 2:
        return formData.currentStateGoals.length === 0 ? ['At least one goal'] : [];
      case 3: {
        const missing = [];
        if (formData.bodyFatCurrent === '') missing.push('Current Body Fat %');
        if (formData.bodyFatGoal === '') missing.push('Goal Body Fat %');
        return missing;
      }
      case 4:
        return formData.symptomSeverities.length === 0 ? ['At least one symptom with a severity rating'] : [];
      case 5:
        return formData.bloodworkStatus === '' ? ['Bloodwork status'] : [];
      case 6:
        return formData.previousAttempts.length === 0 ? ['At least one previous attempt'] : [];
      case 7:
        return formData.whyStillLooking.trim() === '' ? ['Why you\'re still looking for help'] : [];
      case 8: {
        const missing = [];
        if (formData.hoursPerWeek.trim() === '') missing.push('Hours per week');
        if (formData.currentTrainingProgram.trim() === '') missing.push('Current training program');
        if (formData.medicalConditions.trim() === '') missing.push('Medical conditions (write "None" if none)');
        if (formData.stressSleepSituation.trim() === '') missing.push('Stress/sleep situation');
        return missing;
      }
      case 9: {
        const missing = [];
        if (formData.consequences.trim() === '') missing.push('What happens if not fixed in 6 months');
        if (formData.lifeSolved.trim() === '') missing.push('What life looks like if solved');
        return missing;
      }
      case 10:
        return formData.howFoundUs.trim() === '' ? ['How you found THP'] : [];
      case 11:
        return formData.commitmentLevel === '' ? ['Commitment level (1–10)'] : [];
      case 12:
        return formData.investmentRange === '' ? ['Investment range'] : [];
      case 13:
        return formData.wasReferred === '' ? ['Whether you were referred'] : [];
      case 14:
        return formData.email.trim() === '' ? ['Email address'] : [];
      default:
        return [];
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      setShowValidationError(false);
      setStep(step + 1);
      formContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setShowValidationError(true);
      setShakeKey(k => k + 1);
      const firstInvalid = formContentRef.current?.querySelector('[data-invalid="true"]') as HTMLElement | null;
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus?.();
      }
    }
  };

  const handleSubmitClick = () => {
    if (canProceed()) {
      setShowValidationError(false);
      handleSubmit();
    } else {
      setShowValidationError(true);
      setShakeKey(k => k + 1);
    }
  };

  const autoAdvance = () => {
    setTimeout(() => {
      setShowValidationError(false);
      setStep(s => s + 1);
      formContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const symptomsList = formData.symptomSeverities
        .map(s => `${s.symptom} (Severity: ${s.severity}/5)`)
        .join(', ');

      const emailParams = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        instagram: formData.instagram || 'Not provided',
        gender: formData.gender,
        currentStateGoals: formData.currentStateGoals.join(', '),
        otherGoal: formData.otherGoal || 'N/A',
        mostImportantGoal: formData.mostImportantGoal || 'Not specified',
        currentWeight: formData.currentWeight || 'Not provided',
        height: formData.height || 'Not provided',
        age: formData.age || 'Not provided',
        bodyFatCurrent: formData.bodyFatCurrent || 'Not provided',
        bodyFatGoal: formData.bodyFatGoal || 'Not provided',
        bodyFatDuration: formData.bodyFatDuration || 'Not provided',
        symptoms: symptomsList,
        otherSymptom: formData.otherSymptom || 'N/A',
        symptomDuration: formData.symptomDuration || 'Not provided',
        bloodworkStatus: formData.bloodworkStatus,
        testosteroneLevel: formData.testosteroneLevel || 'Not provided',
        lastLabsDate: formData.lastLabsDate || 'Not provided',
        previousAttempts: formData.previousAttempts.join(', '),
        supplementsUsed: formData.supplementsUsed || 'None',
        whatTried: formData.whatTried || 'Not provided',
        howLongStuck: formData.howLongStuck || 'Not provided',
        whyStoppedWorking: formData.whyStoppedWorking || 'Not provided',
        whyStillLooking: formData.whyStillLooking,
        hoursPerWeek: formData.hoursPerWeek,
        currentTrainingProgram: formData.currentTrainingProgram,
        medicalConditions: formData.medicalConditions,
        stressSleepSituation: formData.stressSleepSituation,
        consequences: formData.consequences,
        lifeSolved: formData.lifeSolved,
        howFoundUs: formData.howFoundUs || 'Not provided',
        commitmentLevel: formData.commitmentLevel || 'Not provided',
        investmentRange: formData.investmentRange,
        wasReferred: formData.wasReferred,
        referredBy: formData.referredBy || 'N/A'
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSubmitSuccess(true);

      // Save to DB in background — does not affect success state
      supabase.from('application_forms').insert({
        full_name: formData.fullName,
        gender: formData.gender,
        current_state_goals: formData.currentStateGoals,
        other_goal: formData.otherGoal || null,
        most_important_goal: formData.mostImportantGoal || null,
        current_weight: formData.currentWeight || null,
        height: formData.height || null,
        age: parseInt(formData.age) || null,
        body_fat_current: parseFloat(formData.bodyFatCurrent) || null,
        body_fat_goal: parseFloat(formData.bodyFatGoal) || null,
        body_fat_duration: formData.bodyFatDuration || null,
        symptom_severities: formData.symptomSeverities,
        other_symptom: formData.otherSymptom || null,
        symptom_duration: formData.symptomDuration || null,
        bloodwork_status: formData.bloodworkStatus,
        testosterone_level: formData.testosteroneLevel || null,
        last_labs_date: formData.lastLabsDate || null,
        previous_attempts: formData.previousAttempts,
        supplements_used: formData.supplementsUsed || null,
        what_tried: formData.whatTried || null,
        how_long_stuck: formData.howLongStuck || null,
        why_stopped_working: formData.whyStoppedWorking || null,
        why_still_looking: formData.whyStillLooking,
        hours_per_week: formData.hoursPerWeek,
        current_training_program: formData.currentTrainingProgram,
        medical_conditions: formData.medicalConditions,
        stress_sleep_situation: formData.stressSleepSituation,
        consequences: formData.consequences,
        life_solved: formData.lifeSolved,
        how_found_us: formData.howFoundUs || null,
        commitment_level: parseInt(formData.commitmentLevel) || null,
        investment_range: formData.investmentRange,
        was_referred: formData.wasReferred === 'Yes',
        referred_by: formData.referredBy || null,
        email: formData.email,
        phone: formData.phone || null,
        instagram_username: formData.instagram || null
      }).then(({ error }) => {
        if (error) console.error('Background DB save failed:', error);
      });

    } catch (error: any) {
      console.error('Email submission error:', error);
      alert(`There was an error submitting your application: ${error?.text || error?.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: 'url(/images/thpback2.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white border-2 border-black p-8 text-center shadow-2xl">
            <p className="text-lg font-bold mb-6 leading-snug">
              What's up boss, now that you got your application filled out go ahead and schedule a call
            </p>
            <a
              href="https://cal.com/ali-filali-uks4xi/30min"
              rel="noopener noreferrer"
              className="inline-block w-full bg-black text-white font-bold py-4 px-6 text-base tracking-widest hover:bg-gray-800 transition-colors"
            >
              Schedule my call
            </a>
          </div>
        </div>
      </div>
    );
  }

  const totalSteps = getTotalSteps();

  return (
    <>
      {showReferral && <ReferralModal onClose={() => setShowReferral(false)} />}
      <button
        onClick={() => setShowReferral(true)}
        className="fixed top-4 left-4 z-40 flex items-center gap-2 bg-black text-white border-2 border-white px-3 py-2 text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg"
      >
        <Users className="w-4 h-4" />
        Refer a Friend
      </button>
      <div
        className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(/images/thpback2.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-[450px]">
        <div className="mb-6 bg-white/20 backdrop-blur-md border-2 border-black p-4">
          <h1 className="text-2xl font-bold mb-2">THP Coaching Application Form</h1>
          <p className="text-sm">Answer honestly. This determines if you qualify.</p>
        </div>

        <div className="mb-4 bg-white/20 backdrop-blur-md border-2 border-black p-4">
          <div className="text-sm font-medium mb-2">Step {step} of {totalSteps}</div>
          <div className="w-full h-2 border border-black bg-white/30">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div ref={formContentRef} className="border-2 border-black p-6 mb-4 flex flex-col bg-white/20 backdrop-blur-md">
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold mb-4">I am:</h2>
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  data-invalid={showValidationError && formData.fullName.trim() === '' ? 'true' : undefined}
                  className={`w-full border-2 p-3 text-sm bg-white/80 ${
                    showValidationError && formData.fullName.trim() === '' ? 'border-red-500 animate-pulse-red' : 'border-black'
                  }`}
                  placeholder="Enter your full name"
                />
                {showValidationError && formData.fullName.trim() === '' && (
                  <p className="text-red-600 text-xs mt-1 font-medium">Type your full name here</p>
                )}
              </div>
              <div>
                <p className={`text-sm font-medium mb-2 ${showValidationError && formData.gender === '' ? 'text-red-600' : ''}`}>
                  Gender * {showValidationError && formData.gender === '' && <span className="text-xs font-normal">(tap one)</span>}
                </p>
                <div className={`space-y-3 p-3 border-2 ${showValidationError && formData.gender === '' ? 'border-red-500 animate-pulse-red' : 'border-transparent'}`}
                  data-invalid={showValidationError && formData.gender === '' ? 'true' : undefined}
                >
                  {['Male', 'Female'].map(gender => (
                    <label key={gender} htmlFor={`gender-${gender}`} className="flex items-center cursor-pointer min-h-[44px]">
                      <input
                        id={`gender-${gender}`}
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                        className="w-5 h-5 border-2 border-black mr-3"
                      />
                      <span className="text-base">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold mb-1">Current Goals:</h2>
              <p className={`text-xs mb-4 ${showValidationError && formData.currentStateGoals.length === 0 ? 'text-red-600 font-semibold' : 'text-[#666666]'}`}>
                {showValidationError && formData.currentStateGoals.length === 0 ? 'Tap at least one option below' : 'Select all that apply'}
              </p>
              <div className={`space-y-2 mb-6 p-3 border-2 ${showValidationError && formData.currentStateGoals.length === 0 ? 'border-red-500 animate-pulse-red' : 'border-transparent'}`}
                data-invalid={showValidationError && formData.currentStateGoals.length === 0 ? 'true' : undefined}
              >
                {(formData.gender === 'Male' ? maleGoals : femaleGoals).map(goal => (
                  <label key={goal} htmlFor={`goal-${goal}`} className="flex items-start cursor-pointer min-h-[44px] py-1">
                    <input
                      id={`goal-${goal}`}
                      type="checkbox"
                      checked={formData.currentStateGoals.includes(goal)}
                      onChange={() => handleCheckbox('currentStateGoals', goal)}
                      className="w-5 h-5 border-2 border-black mr-3 mt-0.5"
                    />
                    <span className="text-sm">{goal}</span>
                  </label>
                ))}
                {formData.currentStateGoals.includes('Other') && (
                  <input
                    type="text"
                    value={formData.otherGoal}
                    onChange={(e) => setFormData({ ...formData, otherGoal: e.target.value })}
                    placeholder="Specify other goal"
                    className="w-full border-2 border-black p-2 text-sm ml-8 mt-2"
                  />
                )}
              </div>

              <div>
                <h3 className="text-base font-bold mb-2">What's your single most important goal right now, and why does it matter to you personally?</h3>
                <textarea
                  value={formData.mostImportantGoal}
                  onChange={(e) => setFormData({ ...formData, mostImportantGoal: e.target.value })}
                  rows={6}
                  className="w-full border-2 border-black p-3 text-sm resize-none"
                  placeholder="Tell us what matters most to you..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold mb-4">Body Composition:</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current weight (lbs)</label>
                  <input
                    type="number"
                    value={formData.currentWeight}
                    onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                    className="w-full border-2 border-black p-3 text-sm"
                    min="0"
                    placeholder="Enter current weight"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Height (e.g., 5'10" or 178 cm)</label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full border-2 border-black p-3 text-sm"
                    placeholder="Enter height"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full border-2 border-black p-3 text-sm"
                    min="0"
                    max="120"
                    placeholder="Enter age"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className={`block text-sm font-medium ${showValidationError && formData.bodyFatCurrent === '' ? 'text-red-600' : ''}`}>Current body fat % *</label>
                    <button type="button" onClick={() => setShowBodyFatHelper(!showBodyFatHelper)} className="text-gray-500 hover:text-black">
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                  {showBodyFatHelper && (
                    <div className="bg-gray-100 border border-gray-300 p-3 mb-2 text-xs space-y-1">
                      <p className="font-semibold mb-1">Not sure? Here's a rough guide:</p>
                      <p><strong>Men:</strong> 10-14% = lean/abs visible, 15-19% = fit, 20-24% = average, 25-30% = overweight, 30%+ = obese</p>
                      <p><strong>Women:</strong> 18-22% = lean/toned, 23-27% = fit, 28-32% = average, 33-38% = overweight, 38%+ = obese</p>
                      <p className="text-gray-500 mt-1">Just give your best guess -- we'll help you dial it in.</p>
                    </div>
                  )}
                  <input
                    type="number"
                    value={formData.bodyFatCurrent}
                    onChange={(e) => setFormData({ ...formData, bodyFatCurrent: e.target.value })}
                    data-invalid={showValidationError && formData.bodyFatCurrent === '' ? 'true' : undefined}
                    className={`w-full border-2 p-3 text-sm ${
                      showValidationError && formData.bodyFatCurrent === '' ? 'border-red-500 animate-pulse-red' : 'border-black'
                    }`}
                    min="0"
                    max="100"
                    placeholder="Enter current body fat % (best guess is fine)"
                  />
                  {showValidationError && formData.bodyFatCurrent === '' && (
                    <p className="text-red-600 text-xs mt-1 font-medium">Required -- tap the ? icon if you need help estimating</p>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${showValidationError && formData.bodyFatGoal === '' ? 'text-red-600' : ''}`}>Goal body fat % *</label>
                  <input
                    type="number"
                    value={formData.bodyFatGoal}
                    onChange={(e) => setFormData({ ...formData, bodyFatGoal: e.target.value })}
                    data-invalid={showValidationError && formData.bodyFatGoal === '' ? 'true' : undefined}
                    className={`w-full border-2 p-3 text-sm ${
                      showValidationError && formData.bodyFatGoal === '' ? 'border-red-500 animate-pulse-red' : 'border-black'
                    }`}
                    min="0"
                    max="100"
                    placeholder="Where do you want to get to?"
                  />
                  {showValidationError && formData.bodyFatGoal === '' && (
                    <p className="text-red-600 text-xs mt-1 font-medium">Required -- what body fat % are you aiming for?</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">How long have you been at your current body fat?</label>
                  <input
                    type="text"
                    value={formData.bodyFatDuration}
                    onChange={(e) => setFormData({ ...formData, bodyFatDuration: e.target.value })}
                    className="w-full border-2 border-black p-3 text-sm"
                    placeholder="e.g., 6 months, 2 years"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-lg font-bold mb-1">Symptoms:</h2>
              <p className={`text-xs mb-4 ${showValidationError && formData.symptomSeverities.length === 0 ? 'text-red-600 font-semibold' : 'text-[#666666]'}`}>
                {showValidationError && formData.symptomSeverities.length === 0 ? 'Tap at least one symptom below to continue' : 'Select symptoms and rate their severity (1 = mild, 5 = debilitating)'}
              </p>

              <div className={`space-y-4 mb-6 ${showValidationError && formData.symptomSeverities.length === 0 ? 'border-2 border-red-500 animate-pulse-red p-2' : ''}`}
                data-invalid={showValidationError && formData.symptomSeverities.length === 0 ? 'true' : undefined}
              >
                {(formData.gender === 'Male' ? maleSymptoms : femaleSymptoms).map(symptom => {
                  const existing = formData.symptomSeverities.find(s => s.symptom === symptom);
                  const isSelected = !!existing;

                  return (
                    <div key={symptom} className="border-2 border-black p-3">
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor={`symptom-${symptom}`} className="flex items-center cursor-pointer flex-1 min-h-[44px]">
                          <input
                            id={`symptom-${symptom}`}
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                removeSymptom(symptom);
                              } else {
                                handleSymptomSeverity(symptom, 3);
                              }
                            }}
                            className="w-5 h-5 border-2 border-black mr-3"
                          />
                          <span className="text-sm font-medium">{symptom}</span>
                        </label>
                      </div>

                      {isSelected && (
                        <div className="ml-8">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-[#666666]">Severity:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(level => (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => handleSymptomSeverity(symptom, level)}
                                  className={`w-10 h-10 border-2 border-black text-sm font-bold transition-colors ${
                                    existing?.severity === level
                                      ? 'bg-black text-white'
                                      : 'bg-white text-black hover:bg-gray-100'
                                  }`}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-[#666666] ml-14">
                            {existing?.severity === 1 && 'Mild'}
                            {existing?.severity === 2 && 'Noticeable'}
                            {existing?.severity === 3 && 'Moderate'}
                            {existing?.severity === 4 && 'Severe'}
                            {existing?.severity === 5 && 'Debilitating'}
                          </p>
                        </div>
                      )}

                      {symptom === 'Other' && isSelected && (
                        <input
                          type="text"
                          value={formData.otherSymptom}
                          onChange={(e) => setFormData({ ...formData, otherSymptom: e.target.value })}
                          placeholder="Specify other symptom"
                          className="w-full border-2 border-black p-2 text-sm ml-8 mt-2"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">How long have you been experiencing these symptoms?</label>
                <input
                  type="text"
                  value={formData.symptomDuration}
                  onChange={(e) => setFormData({ ...formData, symptomDuration: e.target.value })}
                  className="w-full border-2 border-black p-3 text-sm"
                  placeholder="e.g., 6 months, 2 years, since college"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-lg font-bold mb-4">Bloodwork:</h2>
              <p className={`text-xs mb-3 ${showValidationError && formData.bloodworkStatus === '' ? 'text-red-600 font-semibold' : 'text-[#666666]'}`}>
                {showValidationError && formData.bloodworkStatus === '' ? 'Tap one option below' : 'Have you had blood work done recently?'}
              </p>
              <div className={`space-y-3 mb-4 ${showValidationError && formData.bloodworkStatus === '' ? 'border-2 border-red-500 animate-pulse-red p-3' : ''}`}
                data-invalid={showValidationError && formData.bloodworkStatus === '' ? 'true' : undefined}
              >
                {formData.gender === 'Male' ? (
                  <>
                    {['Yes', 'No but willing', 'No not interested'].map(option => (
                      <label key={option} htmlFor={`bloodwork-${option}`} className="flex items-center cursor-pointer min-h-[44px]">
                        <input
                          id={`bloodwork-${option}`}
                          type="radio"
                          name="bloodwork"
                          value={option}
                          checked={formData.bloodworkStatus === option}
                          onChange={(e) => {
                            setFormData({ ...formData, bloodworkStatus: e.target.value });
                            if (e.target.value !== 'Yes') autoAdvance();
                          }}
                          className="w-5 h-5 border-2 border-black mr-3"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                    {formData.bloodworkStatus === 'Yes' && (
                      <input
                        type="text"
                        value={formData.testosteroneLevel}
                        onChange={(e) => setFormData({ ...formData, testosteroneLevel: e.target.value })}
                        placeholder="Testosterone level (optional)"
                        className="w-full border-2 border-black p-2 text-sm ml-8 mt-2"
                      />
                    )}
                  </>
                ) : (
                  ['Yes labs available', 'No but willing', 'No not interested'].map(option => (
                    <label key={option} htmlFor={`bloodwork-f-${option}`} className="flex items-center cursor-pointer min-h-[44px]">
                      <input
                        id={`bloodwork-f-${option}`}
                        type="radio"
                        name="bloodwork"
                        value={option}
                        checked={formData.bloodworkStatus === option}
                        onChange={(e) => {
                          setFormData({ ...formData, bloodworkStatus: e.target.value });
                          if (e.target.value !== 'Yes labs available') autoAdvance();
                        }}
                        className="w-5 h-5 border-2 border-black mr-3"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))
                )}
              </div>

              {(formData.bloodworkStatus === 'Yes' || formData.bloodworkStatus === 'Yes labs available') && (
                <div>
                  <label className="block text-sm font-medium mb-2">When were your last labs done?</label>
                  <input
                    type="text"
                    value={formData.lastLabsDate}
                    onChange={(e) => setFormData({ ...formData, lastLabsDate: e.target.value })}
                    className="w-full border-2 border-black p-3 text-sm"
                    placeholder="e.g., 2 months ago, January 2025, last year"
                  />
                </div>
              )}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold mb-1">What You've Tried:</h2>
                <p className={`text-xs mb-4 ${showValidationError && formData.previousAttempts.length === 0 ? 'text-red-600 font-semibold' : 'text-[#666666]'}`}>
                  {showValidationError && formData.previousAttempts.length === 0 ? 'Tap at least one option below' : 'Select all that apply'}
                </p>
                <div className={`space-y-2 ${showValidationError && formData.previousAttempts.length === 0 ? 'border-2 border-red-500 animate-pulse-red p-3' : ''}`}
                  data-invalid={showValidationError && formData.previousAttempts.length === 0 ? 'true' : undefined}
                >
                  {(formData.gender === 'Male' ? malePreviousAttempts : femalePreviousAttempts).map(attempt => (
                    <label key={attempt} htmlFor={`attempt-${attempt}`} className="flex items-start cursor-pointer min-h-[44px] py-1">
                      <input
                        id={`attempt-${attempt}`}
                        type="checkbox"
                        checked={formData.previousAttempts.includes(attempt)}
                        onChange={() => handleCheckbox('previousAttempts', attempt)}
                        className="w-5 h-5 border-2 border-black mr-3 mt-0.5"
                      />
                      <span className="text-sm">{attempt}</span>
                    </label>
                  ))}
                  {formData.previousAttempts.includes('Supplements') && (
                    <input
                      type="text"
                      value={formData.supplementsUsed}
                      onChange={(e) => setFormData({ ...formData, supplementsUsed: e.target.value })}
                      placeholder="Which supplements?"
                      className="w-full border-2 border-black p-2 text-sm ml-8 mt-2"
                    />
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-4">What have you tried, how long did you stick to it, and why did it stop working?</h2>
                <div className="space-y-4">
                  <textarea
                    value={formData.whatTried}
                    onChange={(e) => setFormData({ ...formData, whatTried: e.target.value })}
                    rows={4}
                    className="w-full border-2 border-black p-3 text-sm resize-none"
                    placeholder="What did you try?"
                  />
                  <textarea
                    value={formData.howLongStuck}
                    onChange={(e) => setFormData({ ...formData, howLongStuck: e.target.value })}
                    rows={4}
                    className="w-full border-2 border-black p-3 text-sm resize-none"
                    placeholder="How long did you stick to it?"
                  />
                  <textarea
                    value={formData.whyStoppedWorking}
                    onChange={(e) => setFormData({ ...formData, whyStoppedWorking: e.target.value })}
                    rows={4}
                    className="w-full border-2 border-black p-3 text-sm resize-none"
                    placeholder="Why did it stop working?"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div>
              <h2 className="text-lg font-bold mb-1">Why are you still looking for help?</h2>
              <p className="text-xs text-[#666666] mb-4">Be specific — what have previous coaches, doctors, or programmes failed to address?</p>
              <textarea
                value={formData.whyStillLooking}
                onChange={(e) => setFormData({ ...formData, whyStillLooking: e.target.value })}
                rows={8}
                data-invalid={showValidationError && formData.whyStillLooking.trim() === '' ? 'true' : undefined}
                className={`w-full border-2 p-3 text-sm resize-none ${
                  showValidationError && formData.whyStillLooking.trim() === '' ? 'border-red-500 animate-pulse-red' : 'border-black'
                }`}
                placeholder="Tell us your story..."
              />
              {showValidationError && formData.whyStillLooking.trim() === '' && (
                <p className="text-red-600 text-xs mt-1 font-medium">This field is required -- just a sentence or two is fine</p>
              )}
            </div>
          )}

          {step === 8 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold mb-4">How many hours per week can you realistically commit to this? *</h2>
                <input
                  type="text"
                  value={formData.hoursPerWeek}
                  onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                  data-invalid={showValidationError && formData.hoursPerWeek.trim() === '' ? 'true' : undefined}
                  className={`w-full border-2 p-3 text-sm ${
                    showValidationError && formData.hoursPerWeek.trim() === '' ? 'border-red-500 animate-pulse-red' : 'border-black'
                  }`}
                  placeholder="e.g., 5-7 hours per week"
                />
                {showValidationError && formData.hoursPerWeek.trim() === '' && (
                  <p className="text-red-600 text-xs mt-1 font-medium">Just type a number like "5" or "5-7 hours"</p>
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold mb-4">Do you have a current training programme? If yes, briefly describe it. *</h2>
                <textarea
                  value={formData.currentTrainingProgram}
                  onChange={(e) => setFormData({ ...formData, currentTrainingProgram: e.target.value })}
                  rows={4}
                  data-invalid={showValidationError && formData.currentTrainingProgram.trim() === '' ? 'true' : undefined}
                  className={`w-full border-2 p-3 text-sm resize-none ${
                    showValidationError && formData.currentTrainingProgram.trim() === '' ? 'border-red-500 animate-pulse-red' : 'border-black'
                  }`}
                  placeholder="Describe your current training programme, or type 'No' if you don't have one"
                />
                {showValidationError && formData.currentTrainingProgram.trim() === '' && (
                  <p className="text-red-600 text-xs mt-1 font-medium">Type your training routine, or just "No" if you don't have one</p>
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold mb-4">Do you have any diagnosed conditions or take any medications? *</h2>
                <textarea
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                  rows={4}
                  data-invalid={showValidationError && formData.medicalConditions.trim() === '' ? 'true' : undefined}
                  className={`w-full border-2 p-3 text-sm resize-none ${
                    showValidationError && formData.medicalConditions.trim() === '' ? 'border-red-500 animate-pulse-red' : 'border-black'
                  }`}
                  placeholder="List any diagnosed conditions or medications, or type 'None'"
                />
                {showValidationError && formData.medicalConditions.trim() === '' && (
                  <p className="text-red-600 text-xs mt-1 font-medium">Type your conditions/medications, or just "None"</p>
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold mb-4">What does your stress/sleep situation look like right now? *</h2>
                <textarea
                  value={formData.stressSleepSituation}
                  onChange={(e) => setFormData({ ...formData, stressSleepSituation: e.target.value })}
                  rows={4}
                  data-invalid={showValidationError && formData.stressSleepSituation.trim() === '' ? 'true' : undefined}
                  className={`w-full border-2 p-3 text-sm resize-none ${
                    showValidationError && formData.stressSleepSituation.trim() === '' ? 'border-red-500 animate-pulse-red' : 'border-black'
                  }`}
                  placeholder="Describe your current stress levels and sleep quality"
                />
                {showValidationError && formData.stressSleepSituation.trim() === '' && (
                  <p className="text-red-600 text-xs mt-1 font-medium">Just describe your stress and sleep in a sentence or two</p>
                )}
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold mb-4">What happens if you DON'T fix this in 6 months? *</h2>
                <textarea
                  value={formData.consequences}
                  onChange={(e) => setFormData({ ...formData, consequences: e.target.value })}
                  rows={8}
                  data-invalid={showValidationError && formData.consequences.trim() === '' ? 'true' : undefined}
                  className={`w-full border-2 p-3 text-sm resize-none ${
                    showValidationError && formData.consequences.trim() === '' ? 'border-red-500 animate-pulse-red' : 'border-black'
                  }`}
                  placeholder="Be honest with yourself..."
                />
                {showValidationError && formData.consequences.trim() === '' && (
                  <p className="text-red-600 text-xs mt-1 font-medium">Type what happens if nothing changes -- be real with yourself</p>
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold mb-4">What would your life look like in 6 months if this was completely solved? *</h2>
                <textarea
                  value={formData.lifeSolved}
                  onChange={(e) => setFormData({ ...formData, lifeSolved: e.target.value })}
                  rows={8}
                  data-invalid={showValidationError && formData.lifeSolved.trim() === '' ? 'true' : undefined}
                  className={`w-full border-2 p-3 text-sm resize-none ${
                    showValidationError && formData.lifeSolved.trim() === '' ? 'border-red-500 animate-pulse-red' : 'border-black'
                  }`}
                  placeholder="Describe your ideal outcome..."
                />
                {showValidationError && formData.lifeSolved.trim() === '' && (
                  <p className="text-red-600 text-xs mt-1 font-medium">Describe your vision -- what does the best version of your life look like?</p>
                )}
              </div>
            </div>
          )}

          {step === 10 && (
            <div>
              <h2 className="text-lg font-bold mb-4">How did you find THP? *</h2>
              <textarea
                value={formData.howFoundUs}
                onChange={(e) => setFormData({ ...formData, howFoundUs: e.target.value })}
                rows={4}
                data-invalid={showValidationError && formData.howFoundUs.trim() === '' ? 'true' : undefined}
                className={`w-full border-2 p-3 text-sm resize-none ${
                  showValidationError && formData.howFoundUs.trim() === '' ? 'border-red-500 animate-pulse-red' : 'border-black'
                }`}
                placeholder="e.g., Instagram, YouTube, friend referral, Google..."
              />
              {showValidationError && formData.howFoundUs.trim() === '' && (
                <p className="text-red-600 text-xs mt-1 font-medium">Just type where you heard about us -- Instagram, YouTube, a friend, etc.</p>
              )}
            </div>
          )}

          {step === 11 && (
            <div>
              <h2 className="text-lg font-bold mb-4">On a scale of 1–10, how confident are you that you can commit to this programme right now?</h2>
              <p className={`text-xs mb-3 ${showValidationError && formData.commitmentLevel === '' ? 'text-red-600 font-semibold' : 'text-[#666666]'}`}>
                {showValidationError && formData.commitmentLevel === '' ? 'Tap a number below' : 'Just tap one'}
              </p>
              <div className={`space-y-3 ${showValidationError && formData.commitmentLevel === '' ? 'border-2 border-red-500 animate-pulse-red p-3' : ''}`}
                data-invalid={showValidationError && formData.commitmentLevel === '' ? 'true' : undefined}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                  <label key={level} htmlFor={`commitment-${level}`} className="flex items-center cursor-pointer min-h-[44px]">
                    <input
                      id={`commitment-${level}`}
                      type="radio"
                      name="commitment"
                      value={level}
                      checked={formData.commitmentLevel === String(level)}
                      onChange={(e) => {
                        setFormData({ ...formData, commitmentLevel: e.target.value });
                        autoAdvance();
                      }}
                      className="w-5 h-5 border-2 border-black mr-3"
                    />
                    <span className="text-sm">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 12 && (
            <div>
              <h2 className="text-lg font-bold mb-4">Investment Range:</h2>
              <p className={`text-xs mb-3 ${showValidationError && formData.investmentRange === '' ? 'text-red-600 font-semibold' : 'text-[#666666]'}`}>
                {showValidationError && formData.investmentRange === '' ? 'Tap one option below' : 'Select your range'}
              </p>
              <div className={`space-y-3 ${showValidationError && formData.investmentRange === '' ? 'border-2 border-red-500 animate-pulse-red p-3' : ''}`}
                data-invalid={showValidationError && formData.investmentRange === '' ? 'true' : undefined}
              >
                {['$1000-$1500', '$1500+ (psychological mentorship, 1 space left)'].map(range => (
                  <label key={range} htmlFor={`investment-${range}`} className="flex items-center cursor-pointer min-h-[44px]">
                    <input
                      id={`investment-${range}`}
                      type="radio"
                      name="investment"
                      value={range}
                      checked={formData.investmentRange === range}
                      onChange={(e) => {
                        setFormData({ ...formData, investmentRange: e.target.value });
                        autoAdvance();
                      }}
                      className="w-5 h-5 border-2 border-black mr-3"
                    />
                    <span className="text-sm">{range}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 13 && (
            <div>
              <h2 className="text-lg font-bold mb-4">Were you referred?</h2>
              <p className={`text-xs mb-3 ${showValidationError && formData.wasReferred === '' ? 'text-red-600 font-semibold' : 'text-[#666666]'}`}>
                {showValidationError && formData.wasReferred === '' ? 'Tap Yes or No below' : ''}
              </p>
              <div className={`space-y-3 ${showValidationError && formData.wasReferred === '' ? 'border-2 border-red-500 animate-pulse-red p-3' : ''}`}
                data-invalid={showValidationError && formData.wasReferred === '' ? 'true' : undefined}
              >
                {['Yes', 'No'].map(option => (
                  <label key={option} htmlFor={`referred-${option}`} className="flex items-center cursor-pointer min-h-[44px]">
                    <input
                      id={`referred-${option}`}
                      type="radio"
                      name="wasReferred"
                      value={option}
                      checked={formData.wasReferred === option}
                      onChange={(e) => {
                        setFormData({ ...formData, wasReferred: e.target.value });
                        if (e.target.value === 'No') autoAdvance();
                      }}
                      className="w-5 h-5 border-2 border-black mr-3"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
                {formData.wasReferred === 'Yes' && (
                  <div className="ml-8 mt-3">
                    <label className="block text-sm font-medium mb-2">Please state who referred you</label>
                    <input
                      type="text"
                      value={formData.referredBy}
                      onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                      className="w-full border-2 border-black p-3 text-sm"
                      placeholder="Enter name of person who referred you"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 14 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold mb-4">Contact Information:</h2>
              <div>
                <label className={`block text-sm font-medium mb-2 ${showValidationError && formData.email.trim() === '' ? 'text-red-600' : ''}`}>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-invalid={showValidationError && formData.email.trim() === '' ? 'true' : undefined}
                  className={`w-full border-2 p-3 text-sm ${
                    showValidationError && formData.email.trim() === '' ? 'border-red-500 animate-pulse-red' : 'border-black'
                  }`}
                  placeholder="your@email.com"
                  required
                />
                {showValidationError && formData.email.trim() === '' && (
                  <p className="text-red-600 text-xs mt-1 font-medium">We need your email to get back to you</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border-2 border-black p-3 text-sm"
                  placeholder="(555) 555-5555"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Instagram Username</label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full border-2 border-black p-3 text-sm"
                  placeholder="@username"
                />
              </div>
            </div>
          )}
        </div>

        {showValidationError && getMissingFields().length > 0 && (
          <div className="mb-2 bg-red-100 border-2 border-red-600 p-3 text-sm text-red-800">
            <strong>Please complete the following before continuing:</strong>
            <ul className="mt-1 list-disc list-inside space-y-0.5">
              {getMissingFields().map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 bg-white/20 backdrop-blur-md border-2 border-black p-3">
          {step > 1 && (
            <button
              onClick={handleStepBack}
              className="flex-1 border-2 border-black p-3 font-medium hover:bg-black hover:text-white transition-colors flex items-center justify-center bg-white/40 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
          )}

          {step < totalSteps ? (
            <button
              key={`next-${shakeKey}`}
              onClick={handleNext}
              className={`flex-1 bg-black text-white p-3 font-medium hover:bg-gray-800 transition-colors flex items-center justify-center ${showValidationError ? 'animate-shake' : ''}`}
            >
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          ) : (
            <button
              key={`submit-${shakeKey}`}
              onClick={handleSubmitClick}
              disabled={isSubmitting}
              className={`flex-1 bg-black text-white p-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors ${showValidationError ? 'animate-shake' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'See If I\'m A Fit'}
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
