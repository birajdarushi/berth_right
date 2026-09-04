// Mandatory static copy for the phrasing layer — SPEC.md §10.3.
// A live demo must never depend on the network call succeeding.

export type ExplainTopic =
  | "rac"
  | "pairing"
  | "chart"
  | "entitlement"
  | "boarding"
  | "preference";

export type ExplainLocale = "en" | "hi" | "mr";

export const EXPLAIN_FALLBACKS: Record<ExplainTopic, Record<ExplainLocale, string>> = {
  rac: {
    en: "RAC means you already have a berth number — but it is a side-lower berth shared with one other person. You may board. A waitlisted ticket (GNWL, RLWL, PQWL) is different: you cannot board until it becomes RAC or confirmed.",
    hi: "आरएसी (RAC) का मतलब है कि आपके पास पहले से ही एक बर्थ नंबर है — लेकिन यह एक साइड-लोअर बर्थ है जिसे एक अन्य व्यक्ति के साथ साझा करना होता है। आप ट्रेन में चढ़ सकते हैं। वेटलिस्टेड टिकट (GNWL, RLWL, PQWL) अलग है: जब तक यह आरएसी या कन्फर्म नहीं हो जाता, आप यात्रा नहीं कर सकते।",
    mr: "आरएसी म्हणजे तुम्हाला बर्थ क्रमांक मिळाला आहे — पण ती साइड-लोअर बर्थ दुसऱ्या एका प्रवाशासोबत शेअर करावी लागते. तुम्ही गाडीत चढू शकता. वेटलिस्ट (जीएनडब्ल्यूएल, आरएलडब्ल्यूएल, पीक्यूडब्ल्यूएल) वेगळी आहे: आरएसी किंवा कन्फर्म होईपर्यंत चढता येत नाही.",
  },
  pairing: {
    en: "Who shares your berth is decided by a fixed set of rules, not by a language model. Same-gender-only is never broken. An unaccompanied child is never paired with an unrelated adult. You only see the other person's gender and stations — not their name.",
    hi: "आपकी बर्थ किसके साथ साझा होगी, यह नियमों के एक निश्चित सेट द्वारा तय किया जाता है, किसी भाषा मॉडल द्वारा नहीं। 'केवल समान लिंग' का नियम कभी नहीं तोड़ा जाता। बिना साथी वाले बच्चे को किसी अनजान वयस्क के साथ पेयर नहीं किया जाता। आपको केवल दूसरे व्यक्ति का लिंग और स्टेशन दिखाई देते हैं — नाम नहीं।",
    mr: "तुमची बर्थ कोणासोबत शेअर होईल हे ठरलेल्या नियमांनी ठरते, भाषा मॉडेलने नाही. सेम-जेंडर-ओन्ली कधीच मोडले जात नाही. एकटे प्रवास करणाऱ्या अल्पवयीन मुलाची जोडी नकोत्या प्रौढासोबत होत नाही. तुम्हाला फक्त दुसऱ्या व्यक्तीचे लिंग आणि स्थानके दिसतात — नाव नाही.",
  },
  chart: {
    en: "Chart preparation is when the final list is locked. Three things can happen: you get a full berth, you stay RAC with your sharing preference honoured, or you stay RAC with the preference unmet — in which case a remedy (escalation and a proposed refund) is offered.",
    hi: "चार्ट बनना वह समय है जब अंतिम सीट सूची तय होती है। तीन स्थितियां हो सकती हैं: आपको पूरी बर्थ मिल जाए, आप अपनी साझा प्राथमिकता के साथ आरएसी रहें, या प्राथमिकता पूरी न होने पर आरएसी रहें — ऐसी स्थिति में शिकायत और 50% प्रस्तावित रिफंड का विकल्प मिलता है।",
    mr: "चार्ट तयार होताना अंतिम यादी बंद होते. तीन शक्यता: पूर्ण बर्थ मिळणे, आरएसी राहून पसंती पाळली जाणे, किंवा आरएसी राहून पसंती न पाळली जाणे — त्यावेळी तक्रार आणि प्रस्तावित परतावा दाखवला जातो.",
  },
  entitlement: {
    en: "This refund is a proposal, not current railway policy. If you stay RAC through the final chart and never get a full berth, half the fare would go back to your bank automatically — no fee, no wallet, no claim form. A 2026 parliamentary committee said charging full fare in that case is not justified.",
    hi: "यह रिफंड एक नीतिगत प्रस्ताव है, वर्तमान रेलवे नीति नहीं। यदि आप अंतिम चार्ट तक आरएसी रहते हैं और पूरी बर्थ नहीं मिलती है, तो आधा किराया स्वतः आपके बैंक खाते में वापस आ जाएगा — बिना किसी शुल्क या फॉर्म के। 2026 की एक संसदीय समिति ने इस स्थिति में पूरा किराया वसूलने को अनुचित बताया था।",
    mr: "हा परतावा प्रस्ताव आहे, सध्याचे रेल्वे धोरण नाही. अंतिम चार्टनंतरही आरएसी राहिल्यास आणि पूर्ण बर्थ न मिळाल्यास, भाड्याचा अर्धा भाग थेट बँकेत परत — शुल्क नाही, वॉलेट नाही, अर्ज नाही. २०२६ च्या संसदीय समितीने पूर्ण भाडे आकारणे अन्यायकारक म्हटले.",
  },
  boarding: {
    en: "If your ticket is RAC or confirmed, you may board. If it is still a waitlist (GNWL, RLWL, PQWL), you may not. Boarding on an unconfirmed waitlisted e-ticket is not permitted and can carry a penalty.",
    hi: "यदि आपका टिकट आरएसी या कन्फर्म है, तो आप ट्रेन में चढ़ सकते हैं। यदि यह अभी भी वेटलिस्ट (GNWL, RLWL, PQWL) है, तो आप नहीं चढ़ सकते। बिना कन्फर्म वेटलिस्ट ई-टिकट पर यात्रा की अनुमति नहीं है और जुर्माना लग सकता है।",
    mr: "तिकिट आरएसी किंवा कन्फर्म असेल तर चढता येते. अजून वेटलिस्ट (जीएनडब्ल्यूएल, आरएलडब्ल्यूएल, पीक्यूडब्ल्यूएल) असेल तर चढता येत नाही. न कन्फर्म झालेल्या वेटलिस्ट ई-तिकिटाने चढणे परवानगीचे नाही आणि दंड होऊ शकतो.",
  },
  preference: {
    en: "Choosing same-gender only is a hard rule: you will only share with someone of the same gender, or travel unpaired. That can move you down the RAC queue when few same-gender passengers are waiting. The number shown is an estimate from this demo's seed data, not a live railway queue.",
    hi: "केवल समान लिंग चुनना एक सख्त नियम है: आप केवल उसी लिंग के व्यक्ति के साथ बर्थ साझा करेंगे, या अकेले यात्रा करेंगे। यदि उसी लिंग के कम यात्री प्रतीक्षा कर रहे हों, तो यह आपको आरएसी कतार में नीचे ले जा सकता है। दिखाया गया नंबर डेमो डेटा का अनुमान है, वास्तविक रेलवे कतार नहीं।",
    mr: "फक्त त्याच लिंगाची व्यक्ती हा कडक नियम आहे: त्याच लिंगाच्या प्रवाशासोबत शेअर, नाहीतर एकटे. रांगेत त्याच लिंगाचे प्रवासी कमी असतील तर तुमचे स्थान मागे जाऊ शकते. दाखवलेली संख्या डेमो डेटावरून अंदाज आहे, जिवंत रांगेवरून नाही.",
  },
};

export function fallbackText(topic: ExplainTopic, locale: ExplainLocale): string {
  return EXPLAIN_FALLBACKS[topic]?.[locale] ?? EXPLAIN_FALLBACKS[topic].en;
}

export function isExplainTopic(value: string): value is ExplainTopic {
  return value in EXPLAIN_FALLBACKS;
}

export function isExplainLocale(value: string): value is ExplainLocale {
  return value === "en" || value === "hi" || value === "mr";
}
