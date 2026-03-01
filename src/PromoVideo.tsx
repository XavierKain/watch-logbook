import React from "react";
import {
  Composition,
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
} from "remotion";

// === CONSTANTS ===
const GOLD = "#C9A84C";
const GOLD_DIM = "#A08535";
const SILVER = "#C0C0C0";
const BG = "#0A0A0F";
const BG_SURFACE = "#12121A";
const TEXT = "#E8E8ED";
const TEXT_DIM = "#8888A0";

// === SLIDE COMPONENTS ===

const SlideContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      backgroundColor: BG,
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 80,
      overflow: "hidden",
    }}
  >
    {/* Subtle gold radial glow */}
    <div
      style={{
        position: "absolute",
        top: -200,
        left: "50%",
        transform: "translateX(-50%)",
        width: 800,
        height: 800,
        background:
          "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)",
        pointerEvents: "none",
      }}
    />
    {/* Top accent line */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      }}
    />
    {children}
  </AbsoluteFill>
);

const AnimatedText: React.FC<{
  children: string;
  delay: number;
  style?: React.CSSProperties;
}> = ({ children, delay, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 80 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [40, 0]);

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)`, ...style }}>
      {children}
    </div>
  );
};

// --- SLIDE 1: PROBLEM ---
const ProblemSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({ frame: frame - 5, fps, config: { damping: 15, stiffness: 60 } });

  return (
    <SlideContainer>
      <div
        style={{
          transform: `scale(${iconScale})`,
          fontSize: 80,
          marginBottom: 40,
        }}
      >
        ⌚
      </div>
      <AnimatedText
        delay={10}
        style={{
          fontSize: 52,
          fontWeight: 800,
          color: TEXT,
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: -1,
        }}
      >
        Your watches deserve
      </AnimatedText>
      <AnimatedText
        delay={18}
        style={{
          fontSize: 52,
          fontWeight: 800,
          color: GOLD,
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: -1,
          marginTop: 8,
        }}
      >
        better than a spreadsheet
      </AnimatedText>
      <AnimatedText
        delay={30}
        style={{
          fontSize: 24,
          color: TEXT_DIM,
          textAlign: "center",
          marginTop: 40,
          lineHeight: 1.5,
          maxWidth: 700,
        }}
      >
        Scattered photos. Forgotten service dates. No overview of what you actually own.
      </AnimatedText>
    </SlideContainer>
  );
};

// --- SLIDE 2: SOLUTION ---
const SolutionSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 50 } });
  const glowOpacity = interpolate(
    spring({ frame: frame - 15, fps, config: { damping: 20, stiffness: 40 } }),
    [0, 1],
    [0, 0.3]
  );

  return (
    <SlideContainer>
      {/* Logo glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GOLD}40, transparent 70%)`,
          opacity: glowOpacity,
        }}
      />
      <div
        style={{
          transform: `scale(${logoScale})`,
          marginBottom: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            background: `linear-gradient(135deg, ${BG_SURFACE}, #1a1a25)`,
            border: `2px solid ${GOLD}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 56,
          }}
        >
          📖
        </div>
      </div>
      <AnimatedText
        delay={12}
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: TEXT_DIM,
          textAlign: "center",
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        Introducing
      </AnimatedText>
      <AnimatedText
        delay={20}
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: TEXT,
          textAlign: "center",
          letterSpacing: -2,
          marginTop: 16,
        }}
      >
        Watch Logbook
      </AnimatedText>
      <AnimatedText
        delay={30}
        style={{
          fontSize: 26,
          color: GOLD,
          textAlign: "center",
          marginTop: 20,
          fontWeight: 600,
        }}
      >
        Your watch collection, beautifully cataloged
      </AnimatedText>
    </SlideContainer>
  );
};

// --- SLIDE 3: FEATURES ---
const FeaturesSlide: React.FC = () => {
  const features = [
    { icon: "📸", label: "Photo Gallery" },
    { icon: "🔔", label: "Service Reminders" },
    { icon: "📊", label: "Collection Stats" },
    { icon: "✈️", label: "Offline-First" },
  ];

  return (
    <SlideContainer>
      <AnimatedText
        delay={0}
        style={{
          fontSize: 42,
          fontWeight: 800,
          color: TEXT,
          textAlign: "center",
          marginBottom: 60,
          letterSpacing: -1,
        }}
      >
        Everything you need
      </AnimatedText>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          width: "100%",
          maxWidth: 700,
        }}
      >
        {features.map((f, i) => (
          <FeatureCard key={f.label} icon={f.icon} label={f.label} delay={10 + i * 12} />
        ))}
      </div>
    </SlideContainer>
  );
};

const FeatureCard: React.FC<{ icon: string; label: string; delay: number }> = ({
  icon,
  label,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 70 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: BG_SURFACE,
        border: `1px solid rgba(255,255,255,0.05)`,
        borderRadius: 20,
        padding: "36px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ fontSize: 48 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: TEXT }}>{label}</div>
    </div>
  );
};

// --- SLIDE 4: CTA ---
const CTASlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulseScale = interpolate(
    Math.sin((frame / fps) * Math.PI * 2),
    [-1, 1],
    [0.97, 1.03]
  );

  return (
    <SlideContainer>
      <AnimatedText
        delay={0}
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: TEXT,
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: -1,
        }}
      >
        Start cataloging today
      </AnimatedText>
      <AnimatedText
        delay={12}
        style={{
          fontSize: 26,
          color: TEXT_DIM,
          textAlign: "center",
          marginTop: 24,
          marginBottom: 50,
        }}
      >
        No cloud. No subscription. Just your watches.
      </AnimatedText>
      <div
        style={{
          transform: `scale(${pulseScale})`,
        }}
      >
        <AnimatedText
          delay={24}
          style={{
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`,
            color: BG,
            fontSize: 28,
            fontWeight: 800,
            padding: "24px 64px",
            borderRadius: 16,
            textAlign: "center",
          }}
        >
          $4.99 — One Time
        </AnimatedText>
      </div>
      <AnimatedText
        delay={35}
        style={{
          fontSize: 20,
          color: SILVER,
          textAlign: "center",
          marginTop: 50,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        watchlogbook.app
      </AnimatedText>
    </SlideContainer>
  );
};

// === MAIN COMPOSITION ===
const DURATION_FRAMES = 360;
const FPS = 30;
const SLIDE_DURATION = 90; // 3s per slide

const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Sequence from={0} durationInFrames={SLIDE_DURATION}>
        <ProblemSlide />
      </Sequence>
      <Sequence from={SLIDE_DURATION} durationInFrames={SLIDE_DURATION}>
        <SolutionSlide />
      </Sequence>
      <Sequence from={SLIDE_DURATION * 2} durationInFrames={SLIDE_DURATION}>
        <FeaturesSlide />
      </Sequence>
      <Sequence from={SLIDE_DURATION * 3} durationInFrames={SLIDE_DURATION}>
        <CTASlide />
      </Sequence>
    </AbsoluteFill>
  );
};

export const PromoVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={Video}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
