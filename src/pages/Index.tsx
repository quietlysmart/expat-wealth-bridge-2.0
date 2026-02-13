import heroImage from "@/assets/hero_02.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { Shield, Landmark, LineChart, Wallet, CalendarIcon } from "lucide-react";
import { API_CONFIG } from "@/config/api";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Autoplay from "embla-carousel-autoplay";
const countries = ["Australia", "France", "Germany", "Italy", "Netherlands", "New Zealand", "Norway", "UK", "USA", "Argentina", "Austria", "Belgium", "Brazil", "Canada", "Chile", "China", "Denmark", "Finland", "Hong Kong", "India", "Indonesia", "Ireland", "Japan", "Malaysia", "Mexico", "Philippines", "Singapore", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "UAE", "Vietnam", "Other"];
const phoneCountryCodes = [
  { label: "United States (+1)", value: "+1" },
  { label: "United Kingdom (+44)", value: "+44" },
  { label: "Australia (+61)", value: "+61" },
  { label: "Singapore (+65)", value: "+65" },
  { label: "Hong Kong (+852)", value: "+852" },
  { label: "Thailand (+66)", value: "+66" },
  { label: "UAE (+971)", value: "+971" },
  { label: "India (+91)", value: "+91" },
  { label: "Canada (+1)", value: "+1-ca" },
  { label: "New Zealand (+64)", value: "+64" },
];

export default function Index() {
  useEffect(() => {
    // Ensure we start at the top for active section tracking
    if (location.hash === "" || location.hash === "#top") {
      window.scrollTo(0, 0);
    }
  }, []);

  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const [callDate, setCallDate] = useState<Date | undefined>(undefined);
  const [callTime, setCallTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const isContactInfoComplete = useMemo(
    () =>
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      phoneCountryCode.trim().length > 0 &&
      phoneNumber.trim().length > 0,
    [name, email, phoneCountryCode, phoneNumber]
  );

  // Generate time slots from 08:00 to 20:00 in 30-minute increments
  const timeSlots = useMemo(() => {
    const slots = ["Anytime"];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 20) slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  // Format timezone for display
  const timezoneDisplay = useMemo(() => {
    try {
      const offset = new Date().getTimezoneOffset();
      const hours = Math.abs(Math.floor(offset / 60));
      const minutes = Math.abs(offset % 60);
      const sign = offset <= 0 ? '+' : '-';
      return `GMT${sign}${hours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''}`;
    } catch {
      return 'Local time';
    }
  }, []);

  const autoplayPlugin = useRef(
    Autoplay({
      delay: 4500,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isContactInfoComplete) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name, email, and phone number before submitting.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const selectedCountryCode = phoneCountryCode === "+1-ca" ? "+1" : phoneCountryCode;
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phoneCountryCode: selectedCountryCode,
      phoneNumber: formData.get('phoneNumber') as string,
      phone: `${selectedCountryCode} ${(formData.get('phoneNumber') as string).trim()}`,
      countryOfResidence: formData.get('countryOfResidence') as string,
      countryOfOrigin: formData.get('countryOfOrigin') as string,
      preferredCallDate: callDate?.toISOString() || '',
      preferredCallTime: callTime,
      timezone: timezone,
      notes: formData.get('notes') as string,
    };

    try {
      if (API_CONFIG.ENABLE_BACKEND) {
        // Backend is enabled - send to API endpoint
        const response = await fetch(API_CONFIG.BACKEND_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          toast({ 
            title: "Thanks!", 
            description: "We'll be in touch within 24 hours." 
          });
          e.currentTarget.reset();
          setName("");
          setEmail("");
          setPhoneCountryCode("");
          setPhoneNumber("");
          setCallDate(undefined);
        } else {
          throw new Error(result.message || 'Failed to send');
        }
      } else {
        // Local mode - just show success (no actual backend call)
        console.log('Form data (local mode):', data);
        toast({ 
          title: "Thanks!", 
          description: "We'll be in touch within 24 hours." 
        });
        e.currentTarget.reset();
        setName("");
        setEmail("");
        setPhoneCountryCode("");
        setPhoneNumber("");
        setCallDate(undefined);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({ 
        title: "Error", 
        description: "Something went wrong. Please try again or email us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="top">
      <Header />

      <main>
        {/* Hero */}
        <section aria-label="Hero" className="relative">
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src={heroImage}
              alt="Relaxed expat couple walking along an Asian beach promenade at golden hour"
              className="h-[68vh] w-full object-cover"
              loading="eager"
              decoding="async"
            />
            
          </div>

          <div className="section relative z-10 flex min-h-[68vh] items-center">
            <div className="max-w-3xl">
              <img
                src="/lovable-uploads/e42d4598-a60d-455e-9dc8-cc52b8022da2.png"
                alt="Global Expat Wealth logo"
                className="mb-6 h-28 md:h-32"
                loading="eager"
                decoding="async"
              />
              <h1 className="mb-5 text-hero-foreground text-5xl font-bold leading-tight md:text-6xl">
                Independent Financial Advice for Expats in Asia
              </h1>
              <p className="mb-8 max-w-2xl text-lg text-hero-foreground opacity-90">
                Plan, invest, protect and pass on your wealth with objective, cross-border guidance tailored to life abroad.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-nowrap">
                <Button size="lg" asChild>
                  <a href="#contact" aria-label="Book a Free 30-Min Consultation">Book a Free 30-Min Consultation</a>
                </Button>
              </div>

              <p className="mt-6 text-base md:text-lg text-white">
                27 years' cross-border experience • Independent (access to any fund/ETF)
              </p>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section id="services" className="section">
          <Reveal>
            <div className="mb-8">
              <h2 className="text-4xl font-bold">What We Do</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Landmark, title: "Financial Planning for Expats", desc: "Understand goals, build your personal plan, and align saving, investing and protection for your life abroad." },
              { icon: LineChart, title: "Wealth Creation & Tax Planning", desc: "Invest lump sums, build diversified portfolios and use tax-efficient structures for inflation-beating returns." },
              { icon: Shield, title: "Protection, Trusts & Estate Planning", desc: "Life & critical-illness cover and beneficiary trusts to protect family and ensure fast access—no probate delays." },
              { icon: Wallet, title: "Planning for Retirement", desc: "Understanding your income requirements in retirement and setting up a regular savings plan." },
              { icon: LineChart, title: "Citizenship by Investment", desc: "We offer a route to citizenship / golden visa by investment in a range of countries, not unlike the Portuguese golden visa." },
              { icon: Landmark, title: "Pension Transfers", desc: "Provide service and investment advice on paid-up UK money purchase pensions." },
            ].map((s, i) => (
              <Reveal key={i}>
                <Card className="h-full card-hover">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <s.icon className="h-7 w-7 text-primary" />
                      <CardTitle className="text-xl font-semibold">{s.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80">{s.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Why Us */}
        <section id="why" className="section">
          <div className="grid items-start gap-10 md:grid-cols-2">
            <Reveal>
              <div>
                <h2 className="mb-4 text-4xl font-bold">Your Guide for Expats' Cross-Border Finance</h2>
                <p className="text-foreground/90 leading-relaxed">
                  As an expat, your financial life spans countries, currencies and tax systems. I make it simple. Independent means I can select any solution or fund on the market—no sales quotas, only your best outcome. After 27 years across Bangkok, KL and Dubai, I've learned the job is part numbers, part listening. You share the life you want; we build the plan that gets you there.
                </p>
                <ul className="mt-6 list-disc pl-6 text-foreground/90">
                  <li>Independent adviser, 27 yrs experience</li>
                  <li>Access to any fund/ETF or insurer</li>
                  <li>Ongoing stewardship, not one-off sales</li>
                </ul>
              </div>
            </Reveal>
            <Reveal>
              <Card className="h-full card-hover">
                <CardHeader>
                  <CardTitle>Challenges We Solve</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <Wallet className="mt-1 h-7 w-7 text-primary" />
                      <p><strong>Building a retirement pot</strong> – Benefit of dollar cost averaging and compound growth.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <LineChart className="mt-1 h-7 w-7 text-primary" />
                      <p><strong>Taking over existing assets</strong> – As your investment advisor we take over service from your existing advisor.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Wallet className="mt-1 h-7 w-7 text-primary" />
                      <p><strong>Consolidation of paid-up pensions</strong> – We evaluate options including off-shore SIPP and handle transfers end-to-end.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <LineChart className="mt-1 h-7 w-7 text-primary" />
                      <p><strong>Currency erosion</strong> – FX-aware portfolios and multi-currency platforms reduce leakage.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="mt-1 h-7 w-7 text-primary" />
                      <p><strong>Tax surprises</strong> – Clear, actionable cross-border tax planning to keep more returns compounding.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="mt-1 h-7 w-7 text-primary" />
                      <p><strong>Family security</strong> – Beneficiary trusts & life insurance so your family is protected if the worst happens.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="section bg-secondary/30 rounded-lg">
          <Reveal>
            <h2 className="mb-8 text-4xl font-bold">How It Works</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { step: 1, title: "Discovery Call", desc: "Map goals, pensions, passports, timeline." },
              { step: 2, title: "Your Personal Blueprint", desc: "The right mix of transfers, lump-sum investing and protection." },
              { step: 3, title: "Ongoing Stewardship", desc: "Reviews, rebalancing, currency hedging, next-gen planning." },
            ].map((s) => (
              <Reveal key={s.step}>
                <Card className="h-full card-hover">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="badge-gold">{s.step}</span>
                      <CardTitle>{s.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80">{s.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Why Choose Dan */}
        <section className="section bg-secondary/40 rounded-lg">
          <Reveal><h2 className="mb-6 text-4xl font-bold">Why Choose Us</h2></Reveal>
          <Card className="card-hover">
            <CardContent className="pt-6">
              <ul className="list-disc pl-6 leading-relaxed text-foreground/90">
                <li>27 years' experience advising expats across Asia</li>
                <li>Background with asset managers, pension providers and the UK's largest wealth manager</li>
                <li>Professional qualifications - level 4 DIP PFS, gave regulated advice in the UK</li>
                <li>Independent: whole-of-market access plus trusted specialists when needed</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Testimonials */}
        <section className="section">
          <Reveal><h2 className="mb-6 text-4xl font-bold">Testimonials</h2></Reveal>
          <div className="relative">
            <Carousel 
              className="mx-auto max-w-3xl" 
              opts={{ loop: true }}
              plugins={[autoplayPlugin.current]}
            >
              <CarouselContent>
                <CarouselItem>
                  <Card className="p-6">
                    <p className="text-lg leading-relaxed">"Dan moved three frozen UK schemes into one low-fee SIPP, reduced charges and provided investment advice. I finally know what my retirement in Chiang Mai will cost."</p>
                    <p className="mt-4 text-sm text-muted-foreground">— John D., British engineer, Thailand</p>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card className="p-6">
                    <p className="text-lg leading-relaxed">"From life cover to visa paperwork, GEW handled everything while I focused on launching my Phuket café."</p>
                    <p className="mt-4 text-sm text-muted-foreground">— Sarah M., ex-London entrepreneur</p>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card className="p-6">
                    <p className="text-lg leading-relaxed">"Dan arranged life assurance to protect my young family in Thailand and set up a regular savings plan for retirement."</p>
                    <p className="mt-4 text-sm text-muted-foreground">— James K., British teacher, Bangkok</p>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Webinar */}
        <section id="webinar" className="section bg-primary/5 rounded-lg">
          <Reveal>
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-3 text-4xl font-bold text-center">Webinar: How British Expats Can Secure UK Pensions in Asia</h2>
              <p className="mb-8 text-lg text-foreground/90 text-center">Watch Dan's 30-minute walk-through on pension transfers, tax-efficient investing, and protecting your family while living in Asia.</p>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg border border-border shadow-sm"
                  src="https://www.youtube.com/embed/ETnI9P5c3ak"
                  title="How British Expats Can Secure UK Pensions in Asia"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>
        </section>

        {/* Contact */}
        <section id="contact" className="section bg-accent/20 rounded-lg">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-4xl font-bold">Ready to Bridge the Gap to a Worry-Free Retirement?</h2>
              <p className="text-foreground/90">Tell us where you call home and what keeps you up at night—we'll reply within 24 hours.</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form className="grid gap-4" onSubmit={onSubmit}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder="Jane Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="jane@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="phone-country-code">Phone country code</Label>
                      <Select name="phoneCountryCode" value={phoneCountryCode} onValueChange={setPhoneCountryCode}>
                        <SelectTrigger id="phone-country-code" aria-label="Phone country code">
                          <SelectValue placeholder="Select code" />
                        </SelectTrigger>
                        <SelectContent>
                          {phoneCountryCodes.map((code) => (
                            <SelectItem key={code.label} value={code.value}>{code.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phone-number">Phone number</Label>
                      <Input
                        id="phone-number"
                        name="phoneNumber"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        required
                        placeholder="e.g. 9876543210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label>Country of residence</Label>
                      <Select name="countryOfResidence" required>
                        <SelectTrigger aria-label="Country of residence"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Country of origin</Label>
                      <Select name="countryOfOrigin" required>
                        <SelectTrigger aria-label="Country of origin"><SelectValue placeholder="Select country" /></SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="call-date">Preferred call date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="call-date"
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!callDate ? "text-muted-foreground" : ""}`}
                            type="button"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {callDate ? callDate.toLocaleDateString() : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={callDate}
                            onSelect={setCallDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="call-time">Preferred call time</Label>
                      <Select value={callTime} onValueChange={setCallTime}>
                        <SelectTrigger id="call-time" aria-label="Preferred call time">
                          <SelectValue placeholder="Choose a time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Times shown in your local timezone ({timezoneDisplay})
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Anything else?</Label>
                    <Textarea id="notes" name="notes" placeholder="Share your goals or questions..." rows={4} />
                  </div>

                  <div>
                    <Button size="lg" type="submit" disabled={isSubmitting || !isContactInfoComplete}>
                      {isSubmitting ? "Sending..." : "Book a Free 30-Min Call"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
