
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Link } from "react-router-dom";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { LogoCarousel } from "@/components/ui/logo-carousel";
import type { SVGProps } from "react";

// Logo SVG components with fixed viewBox and fill properties
const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const MicrosoftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 23 23" fill="currentColor" {...props}>
    <path d="M1 1h10v10H1z"/>
    <path d="M12 1h10v10H12z"/>
    <path d="M1 12h10v10H1z"/>
    <path d="M12 12h10v10H12z"/>
  </svg>
);

const AmazonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="currentColor" {...props}>
    <path d="M24.707 7.189c0-1.467.137-2.669.384-3.572.274-.94.646-1.889 1.126-2.837.137-.274.11-.549-.083-.823C25.89-.317 25.561-.427 25.151-.427c-.329 0-.74.165-1.26.494-1.778 1.095-3.283 2.724-4.489 4.926-1.205 2.202-1.807 4.241-1.807 6.133v2.226c0 .302.164.521.494.659.329.137.63.083.906-.165.933-.823 1.697-1.451 2.284-1.889.587-.438 1.36-.878 2.311-1.316l.017-3.422z"/>
  </svg>
);

const AppleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 384 512" fill="currentColor" {...props}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </svg>
);

const MetaIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
    <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 75c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z"/>
  </svg>
);

const logos = [
  { name: "Google", id: 1, img: GoogleIcon },
  { name: "Microsoft", id: 2, img: MicrosoftIcon },
  { name: "Amazon", id: 3, img: AmazonIcon },
  { name: "Apple", id: 4, img: AppleIcon },
  { name: "Meta", id: 5, img: MetaIcon },
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
