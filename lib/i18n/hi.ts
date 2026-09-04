// Hindi Railway Jargon definitions for Berth Right

export const JARGON_HI = {
  RAC: {
    abbr: "आरएसी (RAC)",
    title: "रद्दीकरण के विरुद्ध आरक्षण (Reservation Against Cancellation)",
    plain: "आपको एक बर्थ नंबर मिलता है, लेकिन आपको एक अन्य यात्री के साथ साइड-लोअर बर्थ साझा करनी होती है जब तक कि पूरी बर्थ उपलब्ध न हो जाए या यात्रा समाप्त न हो जाए।",
  },
  GNWL: {
    abbr: "जीएनडब्ल्यूएल (GNWL)",
    title: "सामान्य प्रतीक्षा सूची (General Waiting List)",
    plain: "यह सामान्य वेटलिस्ट है। जब तक यह आरएसी या कन्फर्म नहीं हो जाती, आप ट्रेन में यात्रा नहीं कर सकते।",
  },
  RLWL: {
    abbr: "आरएलडब्ल्यूएल (RLWL)",
    title: "रिमोट लोकेशन वेटिंग लिस्ट (Remote Location Waiting List)",
    plain: "मध्यवर्ती स्टेशनों के लिए वेटलिस्ट। आरएसी या कन्फर्म होने से पहले आप ट्रेन में नहीं चढ़ सकते।",
  },
  PQWL: {
    abbr: "पीक्यूडब्ल्यूएल (PQWL)",
    title: "पूल कोटा वेटिंग लिस्ट (Pooled Quota Waiting List)",
    plain: "साझा सीट कोटे की प्रतीक्षा सूची। आरएसी या कन्फर्म होने तक यात्रा की अनुमति नहीं है।",
  },
  clerkage: {
    abbr: "क्लर्केज (Clerkage)",
    title: "टिकट रद्दीकरण शुल्क (Cancellation processing charge)",
    plain: "टिकट रद्द करने पर काटा जाने वाला मामूली क्लर्क शुल्क (सामान्यतः ₹60 + GST)।",
  },
  chart: {
    abbr: "चार्ट बनना (Chart preparation)",
    title: "अंतिम सीट आवंटन सूची",
    plain: "वह समय जब रेलवे तय करता है कि कौन किस सीट/बर्थ पर बैठेगा। यह प्रस्थान से कुछ घंटे पहले जारी होता है।",
  },
} as const;
