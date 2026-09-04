"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Screen from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, ShieldAlert } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// Mock OTP — SPEC.md §4.2. Clearly fake, not in the main booking path.
// Any 6-digit code is accepted. Documented credential: 000000.
export default function LoginPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const [otp, setOtp] = useState("000000");
  const [error, setError] = useState("");

  const submit = () => {
    if (!/^\d{6}$/.test(otp)) {
      setError(
        lang === "hi"
          ? "कोई भी 6 अंक दर्ज करें। यह एक मॉक है। 000000 आज़माएं।"
          : lang === "mr"
          ? "कोणतेही ६ अंक प्रविष्ट करा. हा एक मॉक आहे. ०००००० वापरून पहा."
          : "Enter any 6 digits. This is a mock. Try 000000."
      );
      return;
    }
    router.push("/");
  };

  return (
    <Screen>
      <div className="flex flex-col gap-1 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <KeyRound className="size-5 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {lang === "hi" ? "मॉक प्रमाणीकरण (ओटीपी)" : lang === "mr" ? "मॉक प्रमाणीकरण (ओटीपी)" : "Mock OTP Authentication"}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start pt-2">
        <div className="rounded-xl border-2 border-dashed border-fuchsia-400 bg-fuchsia-50/80 p-4 shadow-2xs">
          <div className="flex items-center gap-1.5 text-fuchsia-700 font-bold text-sm">
            <ShieldAlert className="size-4" />
            <p>{lang === "hi" ? "मॉक ओटीपी — केवल डेमो" : lang === "mr" ? "मॉक ओटीपी — फक्त डेमो" : "MOCK OTP — DEMO ONLY"}</p>
          </div>
          <p className="text-xs text-fuchsia-900 mt-1.5 leading-relaxed">
            {lang === "hi"
              ? "कोई वास्तविक फोन नंबर, एसएमएस या खाता नहीं है। कोई भी 6 अंकों का कोड काम करता है (उदा. 000000)।"
              : lang === "mr"
              ? "कोणताही खरा फोन नंबर, एसएमएस किंवा खाते नाही. कोणताही ६ अंकी कोड चालतो (उदा. ००००००)."
              : "No real phone, no SMS, no account. Any 6-digit code works. Try 000000."}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="otp" className="text-xs font-semibold">
              {lang === "hi" ? "वन-टाइम पासवर्ड (ओटीपी)" : lang === "mr" ? "वन-टाइम पासवर्ड (ओटीपी)" : "One-time password"}
            </Label>
            <Input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              className="min-h-11 font-mono text-center tracking-widest text-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          {error && <p className="text-xs text-rose-600">{error}</p>}

          <Button
            type="button"
            onClick={submit}
            size="lg"
            className="min-h-11 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium"
          >
            {lang === "hi" ? "जारी रखें (काल्पनिक)" : lang === "mr" ? "पुढे जा (काल्पनिक)" : "Continue (fake)"}
          </Button>
        </div>
      </div>
    </Screen>
  );
}
