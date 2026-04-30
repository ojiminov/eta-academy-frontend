import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'en' | 'uz'

export const translations = {
  en: {
    // Navbar
    nav: {
      browseCourses: 'Browse Courses',
      login: 'Login',
      getStarted: 'Get Started',
      dashboard: 'Dashboard',
      profile: 'Profile',
      logout: 'Logout',
      myCourses: 'My Courses',
    },
    // Landing
    landing: {
      heroTitle: 'Master English with',
      heroTitleAccent: 'Expert Teachers',
      heroSubtitle: 'Join thousands of students achieving fluency through structured courses, live feedback, and AI-powered learning tools.',
      heroCta: 'Start Learning Free',
      heroSecondary: 'View Courses',
      studentsCount: 'Active Students',
      coursesCount: 'Expert Courses',
      teachersCount: 'Certified Teachers',
      successRate: 'Success Rate',
      featuresTitle: 'Why Choose ETA Academy?',
      featuresSubtitle: 'Everything you need to achieve your English goals — in one platform.',
      feature1Title: 'Expert-Led Courses',
      feature1Desc: 'Learn from certified teachers with years of real-world experience in IELTS, Business English, and more.',
      feature2Title: 'Track Your Progress',
      feature2Desc: 'Visual dashboards, XP points, and streak tracking keep you motivated and on the path to fluency.',
      feature3Title: 'Get Certified',
      feature3Desc: 'Earn recognized certificates upon course completion to showcase your skills to employers.',
      feature4Title: 'All Levels Welcome',
      feature4Desc: 'From complete beginners (A1) to advanced learners (C2) — we have the right course for you.',
      coursesTitle: 'Popular Courses',
      coursesSubtitle: 'Start with our most loved courses — all designed by expert teachers.',
      viewAllCourses: 'View All Courses',
      testimonialTitle: 'What Our Students Say',
      pricingTitle: 'Simple, Transparent Pricing',
      pricingSubtitle: 'Start free, upgrade when you are ready.',
      pricingFreeTitle: 'Free',
      pricingFreePrice: '$0',
      pricingFreePeriod: 'forever',
      pricingProTitle: 'Pro',
      pricingProPrice: '$29',
      pricingProPeriod: 'per month',
      pricingEnterpriseTitle: 'Enterprise',
      pricingEnterprisePrice: 'Custom',
      pricingEnterprisePeriod: 'contact us',
      ctaTitle: 'Ready to Start Your English Journey?',
      ctaSubtitle: 'Join over 5,000 students already improving their English with ETA Academy.',
      ctaButton: 'Get Started Free',
      footerTagline: 'The leading English teaching academy for ambitious learners.',
    },
    // Auth
    auth: {
      loginTitle: 'Welcome back',
      loginSubtitle: 'Sign in to continue your learning journey',
      registerTitle: 'Create your account',
      registerSubtitle: 'Join thousands of English learners today',
      email: 'Email address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      forgotPassword: 'Forgot password?',
      loginButton: 'Sign In',
      registerButton: 'Create Account',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      signUp: 'Sign up',
      signIn: 'Sign in',
      forgotTitle: 'Reset your password',
      forgotSubtitle: 'Enter your email and we will send you a reset link',
      sendReset: 'Send Reset Link',
      backToLogin: 'Back to sign in',
    },
    // Dashboard
    dashboard: {
      welcome: 'Welcome back',
      xpPoints: 'XP Points',
      streakDays: 'Day Streak',
      coursesEnrolled: 'Courses Enrolled',
      certificates: 'Certificates',
      continuelearning: 'Continue Learning',
      recentActivity: 'Recent Activity',
      myProgress: 'My Progress',
      noCoursesYet: "You haven't enrolled in any courses yet.",
      browseCourses: 'Browse Courses',
    },
    // Courses
    courses: {
      allCourses: 'All Courses',
      searchPlaceholder: 'Search courses...',
      filterByLevel: 'Filter by Level',
      allLevels: 'All Levels',
      enrollNow: 'Enroll Now',
      learnMore: 'Learn More',
      free: 'Free',
      students: 'students',
      lessons: 'lessons',
      hours: 'hours',
    },
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Try Again',
    },
  },
  uz: {
    nav: {
      browseCourses: 'Kurslarni Ko\'rish',
      login: 'Kirish',
      getStarted: 'Boshlash',
      dashboard: 'Boshqaruv paneli',
      profile: 'Profil',
      logout: 'Chiqish',
      myCourses: 'Mening Kurslarim',
    },
    landing: {
      heroTitle: 'Ingliz tilini o\'rganing',
      heroTitleAccent: 'Ekspert O\'qituvchilar',
      heroSubtitle: 'Minglab talabalar bilan birga strukturlashtirilgan kurslar, jonli fikr-mulohaza va AI-asosidagi o\'rganish vositalari orqali til o\'rganing.',
      heroCta: 'Bepul Boshlash',
      heroSecondary: 'Kurslarni Ko\'rish',
      studentsCount: 'Faol Talabalar',
      coursesCount: 'Ekspert Kurslar',
      teachersCount: 'Sertifikatlangan O\'qituvchilar',
      successRate: 'Muvaffaqiyat Darajasi',
      featuresTitle: 'Nima uchun ETA Academy?',
      featuresSubtitle: 'Ingliz tili maqsadlaringizga erishish uchun kerak bo\'lgan hamma narsa — bir platformada.',
      feature1Title: 'Ekspert Kurslar',
      feature1Desc: 'IELTS, Biznes ingliz tili va boshqa sohalarda yillik tajribaga ega sertifikatlangan o\'qituvchilardan o\'rganing.',
      feature2Title: 'Rivojlanishingizni Kuzating',
      feature2Desc: 'Vizual statistika, XP ball va ketma-ketlik kuzatuvi sizni rag\'batlantiradi.',
      feature3Title: 'Sertifikat Oling',
      feature3Desc: 'Kursni yakunlagandan so\'ng ish beruvchilarga ko\'rsatish uchun tan olingan sertifikatlar oling.',
      feature4Title: 'Barcha Darajalar',
      feature4Desc: 'To\'liq boshlang\'ichlardan (A1) ilg\'or o\'rganchilargacha (C2) — sizga mos kurs bor.',
      coursesTitle: 'Mashhur Kurslar',
      coursesSubtitle: 'Eng sevimli kurslarimizdan boshlang — barchasi ekspert o\'qituvchilar tomonidan yaratilgan.',
      viewAllCourses: 'Barcha Kurslarni Ko\'rish',
      testimonialTitle: 'Talabalarimiz Nima Deydi',
      pricingTitle: 'Oddiy va Shaffof Narxlar',
      pricingSubtitle: 'Bepul boshlang, tayyor bo\'lganingizda yangilashtiring.',
      pricingFreeTitle: 'Bepul',
      pricingFreePrice: '$0',
      pricingFreePeriod: 'abadiy',
      pricingProTitle: 'Pro',
      pricingProPrice: '$29',
      pricingProPeriod: 'oyiga',
      pricingEnterpriseTitle: 'Korporativ',
      pricingEnterprisePrice: 'Maxsus',
      pricingEnterprisePeriod: 'biz bilan bog\'laning',
      ctaTitle: 'Ingliz tili sayohatingizni boshlashga tayyormisiz?',
      ctaSubtitle: 'ETA Academy bilan ingliz tilini yaxshilayotgan 5000 dan ortiq talabaga qo\'shiling.',
      ctaButton: 'Bepul Boshlash',
      footerTagline: 'Maqsadli o\'rganuvchilar uchun etakchi ingliz tili akademiyasi.',
    },
    auth: {
      loginTitle: 'Xush kelibsiz',
      loginSubtitle: 'O\'rganish sayohatingizni davom ettirish uchun kiring',
      registerTitle: 'Hisobingizni yarating',
      registerSubtitle: 'Bugun minglab ingliz tili o\'rganuvchilarga qo\'shiling',
      email: 'Elektron pochta',
      password: 'Parol',
      confirmPassword: 'Parolni tasdiqlang',
      firstName: 'Ism',
      lastName: 'Familiya',
      forgotPassword: 'Parolni unutdingizmi?',
      loginButton: 'Kirish',
      registerButton: 'Hisob Yaratish',
      noAccount: 'Hisobingiz yo\'qmi?',
      hasAccount: 'Hisobingiz bormi?',
      signUp: 'Ro\'yxatdan o\'tish',
      signIn: 'Kirish',
      forgotTitle: 'Parolingizni tiklang',
      forgotSubtitle: 'Elektron pochtangizni kiriting va biz tiklash havolasini yuboramiz',
      sendReset: 'Tiklash Havolasini Yuborish',
      backToLogin: 'Kirishga qaytish',
    },
    dashboard: {
      welcome: 'Xush kelibsiz',
      xpPoints: 'XP Ballar',
      streakDays: 'Kun Ketma-ketligi',
      coursesEnrolled: 'Yozilgan Kurslar',
      certificates: 'Sertifikatlar',
      continuelearning: 'O\'rganishni Davom Ettirish',
      recentActivity: 'So\'nggi Faoliyat',
      myProgress: 'Mening Rivojlanishim',
      noCoursesYet: 'Siz hali hech qanday kursga yozilmagansiz.',
      browseCourses: 'Kurslarni Ko\'rish',
    },
    courses: {
      allCourses: 'Barcha Kurslar',
      searchPlaceholder: 'Kurslarni qidirish...',
      filterByLevel: 'Daraja bo\'yicha filtrlash',
      allLevels: 'Barcha Darajalar',
      enrollNow: 'Hozir Yozilish',
      learnMore: 'Ko\'proq Bilish',
      free: 'Bepul',
      students: 'talaba',
      lessons: 'dars',
      hours: 'soat',
    },
    common: {
      loading: 'Yuklanmoqda...',
      error: 'Nimadir noto\'g\'ri ketdi',
      retry: 'Qayta Urinish',
    },
  },
}

type TranslationKey = typeof translations['en']

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationKey
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('eta-lang') as Language) || 'en'
  })

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('eta-lang', lang)
  }

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: translations[language],
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
