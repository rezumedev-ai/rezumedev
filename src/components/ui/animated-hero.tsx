
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Link } from "react-router-dom";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { LogoCarousel } from "@/components/ui/logo-carousel";
import type { SVGProps } from "react";

// Logo SVG components
const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" {...props}>
    <path fill="#f35325" d="M1 1h10v10H1z"/>
    <path fill="#81bc06" d="M12 1h10v10H12z"/>
    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
    <path fill="#ffba08" d="M12 12h10v10H12z"/>
  </svg>
);

const AppleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" {...props}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" fill="currentColor"/>
  </svg>
);

// New optimized logos
const AmazonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="currentColor"
      d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"
    />
  </svg>
);

const MetaIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="currentColor"
      d="M503.5 241.5c-6.5-22.3-17-43.3-31-61.8-14.3-19-31.9-35.5-51.7-48.5-20.6-13.5-43.6-23.2-67.7-28.8-25.3-5.9-51.6-7.3-77.3-4.2-24.2 2.9-47.7 9.8-69.5 20.5-18.6 9-35.7 21-50.6 35.5-14.9 14.5-27.5 31.3-36.8 49.9-10.8 21.4-17.4 44.7-19.6 68.5-2 21.3-.4 42.8 4.8 63.5 5.4 21.5 14.8 41.8 27.8 59.9 12.3 17.1 27.5 32.1 44.8 44.1 18.6 12.9 39.3 22.3 61.1 27.7 21.4 5.3 43.7 6.7 65.6 4.3 21.4-2.4 42.2-8.6 61.5-18.2 19.7-9.8 37.5-23.1 52.4-39.2 13.8-14.9 24.8-32.2 32.4-50.9 4.9-12 8.4-24.5 10.4-37.3.8-5 1.3-10.1 1.6-15.1h-214c.7 29.9 4.2 53.9 10.5 72 6.2 17.8 14.4 31.2 24.7 40.2 9 7.9 19.2 13 30.5 15.2 11.5 2.3 23.5 1.7 35.8-1.7-1.7-21.3-7.8-44.5-18.2-69.6-10.5-25.3-24.4-48.9-41.6-70.8-17.4-22.1-37.4-42-59.8-59.4-11.1-8.6-22.7-16.5-34.7-23.7-4-2.4-8.1-4.6-12.2-6.8 2.1-.7 4.2-1.4 6.4-2 15.9-4.4 32.4-6.6 48.9-6.6 17.1 0 34.1 2.3 50.4 7 16.1 4.6 31.4 11.6 45.5 20.6 13.8 8.9 26.1 19.9 36.6 32.6 10.3 12.5 18.6 26.6 24.6 41.7h74.5c-1.3-24.5-6.8-48.5-16.4-71zm-223.8 86.1c14 18.6 24.9 38.5 32.7 59.4 1.3 3.5 2.5 7 3.7 10.5-17.7 5.4-34.3 4.2-49.7-3.5s-28.1-22.2-38.1-43c-10.1-20.9-16.7-47.8-19.8-80.6h110.4c-10.4 18.4-23.2 37.8-39.2 57.2z"
    />
  </svg>
);

const NetflixIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 111 30" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="#E50914"
      d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-4.187-.281-8.375-.53-12.656-.625V0h4.687v21.875c2.688.062 5.375.28 7.969.405v4.657zM64.25 10.657v4.687h-6.406V26H53.22V0h13.125v4.687h-8.5v5.97h6.406zm-18.906-5.97V26.25c-1.563 0-3.156 0-4.688.062V4.687h-4.844V0h14.406v4.687h-4.874zM30.75 15.593c-2.062 0-4.5 0-6.25.095v6.968c2.75-.188 5.5-.406 8.281-.5v4.5l-12.968 1.032V0H32.78v4.687H24.5V11c1.813 0 4.594-.094 6.25-.094v4.688zM4.78 12.968v16.375C3.094 29.531 1.593 29.75 0 30V0h4.469l6.093 17.032V0h4.688v28.062c-1.656.282-3.344.376-5.125.625L4.78 12.968z"
    />
  </svg>
);

const logos = [
  { name: "Google", id: 1, img: GoogleIcon },
  { name: "Microsoft", id: 2, img: MicrosoftIcon },
  { name: "Apple", id: 3, img: AppleIcon },
  { name: "Amazon", id: 4, img: AmazonIcon },
  { name: "Meta", id: 5, img: MetaIcon },
  { name: "Netflix", id: 6, img: NetflixIcon },
];

function AnimatedHero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Professional", "ATS-Friendly", "Modern", "Effective", "Customized"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              AI-Powered Resume Builder <FileText className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-primary">Create your</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Transform your career journey with our AI-powered resume builder. Create a professionally crafted, ATS-optimized resume that stands out to employers and gets you more interviews.
            </p>
          </div>
          <div className="flex flex-col gap-8 items-center">
            <Link to="/signup">
              <RainbowButton className="gap-4">
                Build Your Resume Now <MoveRight className="w-4 h-4" />
              </RainbowButton>
            </Link>
            <div className="pt-12 text-center">
              <GradientHeading variant="secondary" size="xs" weight="semi">
                Our users got hired at
              </GradientHeading>
              <div className="mt-8">
                <LogoCarousel columnCount={3} logos={logos} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };
