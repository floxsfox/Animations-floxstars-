import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Montserrat';

const {fontFamily} = loadFont('normal', {
  weights: ['500', '800'],
  subsets: ['latin'],
});

const C = {
  violet: '#8b5cf6',
  lilac: '#c4b5fd',
  pink: '#ff4fd8',
  cyan: '#22d3ee',
  gold: '#ffd166',
  bg: '#05030f',
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const FONT_SIZE = 200;
const LETTERS = ['F', 'L', 'O', 'X', 'S', 'T', 'A', 'R', 'S'];

// Bentuk bintang berkilau 4 sudut
const sparklePath = (r: number) =>
  `M0,${-r} Q0,0 ${r},0 Q0,0 0,${r} Q0,0 ${-r},0 Q0,0 0,${-r}Z`;

/* ---------- Background ---------- */

const Nebula: React.FC = () => {
  const frame = useCurrentFrame();
  const a = Math.sin(frame / 60) * 4;
  const b = Math.cos(frame / 75) * 3;
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(900px 700px at ${30 + a}% ${35 + b}%, rgba(139,92,246,0.38), transparent 60%),
          radial-gradient(1000px 800px at ${72 - a}% ${68 - b}%, rgba(255,79,216,0.22), transparent 60%),
          radial-gradient(900px 600px at 50% 105%, rgba(34,211,238,0.16), transparent 65%),
          ${C.bg}`,
      }}
    />
  );
};

const Starfield: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const stars = useMemo(
    () =>
      Array.from({length: 160}, (_, i) => ({
        x: random(`sx-${i}`) * width,
        y: random(`sy-${i}`) * height,
        r: 0.7 + random(`sr-${i}`) ** 2 * 2.6,
        drift: 0.15 + random(`sd-${i}`) * 0.9,
        phase: random(`sp-${i}`) * Math.PI * 2,
        tw: 0.05 + random(`st-${i}`) * 0.12,
        hue: random(`sh-${i}`),
      })),
    [width, height]
  );
  const fadeIn = interpolate(frame, [0, 25], [0, 1], clamp);

  return (
    <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
      {stars.map((s, i) => {
        const x = (((s.x - frame * s.drift * 0.6) % width) + width) % width;
        const o = (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(frame * s.tw + s.phase))) * fadeIn;
        const fill = s.hue < 0.7 ? '#ffffff' : s.hue < 0.85 ? C.lilac : '#a5f3fc';
        return (
          <g key={i}>
            {s.r > 2.2 && <circle cx={x} cy={s.y} r={s.r * 3.2} fill={fill} opacity={o * 0.14} />}
            <circle cx={x} cy={s.y} r={s.r} fill={fill} opacity={o} />
          </g>
        );
      })}
    </svg>
  );
};

const ShootingStar: React.FC<{start: number; x: number; y: number; angle: number}> = ({
  start,
  x,
  y,
  angle,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 26], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  if (p <= 0 || p >= 1) return null;
  const rad = (angle * Math.PI) / 180;
  const dist = 1500;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 340,
        height: 3,
        borderRadius: 3,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95))',
        boxShadow: '0 0 16px 2px rgba(196,181,253,0.8)',
        opacity: Math.sin(p * Math.PI),
        transformOrigin: '100% 50%',
        transform: `translate(${Math.cos(rad) * dist * p}px, ${Math.sin(rad) * dist * p}px) rotate(${angle}deg)`,
      }}
    />
  );
};

const Sparkle: React.FC<{x: number; y: number; size: number; start: number; color: string}> = ({
  x,
  y,
  size,
  start,
  color,
}) => {
  const frame = useCurrentFrame();
  const t = (frame - start) / 30;
  if (t < 0 || t > 1) return null;
  const s = Math.sin(t * Math.PI);
  return (
    <svg
      width={size * 2}
      height={size * 2}
      viewBox={`${-size} ${-size} ${size * 2} ${size * 2}`}
      style={{
        position: 'absolute',
        left: x - size,
        top: y - size,
        overflow: 'visible',
        opacity: s,
        transform: `rotate(${t * 90}deg) scale(${s})`,
        filter: `drop-shadow(0 0 10px ${color})`,
      }}
    >
      <path d={sparklePath(size)} fill={color} />
    </svg>
  );
};

/* ---------- Huruf "O" = cincin dengan bintang yang mengorbit ---------- */

const OrbitO: React.FC<{frame: number}> = ({frame}) => {
  const SIZE = 170;
  const CC = SIZE / 2;
  const R = 60;
  const theta = frame * 0.085 - 1.2;
  const trail = Array.from({length: 12}, (_, k) => {
    const a = theta - k * 0.11;
    return {
      x: CC + R * Math.cos(a),
      y: CC + R * Math.sin(a),
      o: (1 - k / 12) ** 1.6,
      r: 7 - k * 0.45,
    };
  });
  const hx = CC + R * Math.cos(theta);
  const hy = CC + R * Math.sin(theta);

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{display: 'block', margin: '0 6px'}}>
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor={C.lilac} />
          <stop offset="1" stopColor={C.violet} />
        </linearGradient>
      </defs>
      <circle cx={CC} cy={CC} r={R} fill="none" stroke="url(#ringGrad)" strokeWidth={24} />
      {trail.map((t, k) => (
        <circle key={k} cx={t.x} cy={t.y} r={t.r} fill={C.gold} opacity={t.o} />
      ))}
      <g
        transform={`translate(${hx} ${hy}) rotate(${frame * 4})`}
        style={{filter: `drop-shadow(0 0 8px ${C.gold})`}}
      >
        <path d={sparklePath(17)} fill="#ffffff" />
      </g>
    </svg>
  );
};

/* ---------- Komposisi utama ---------- */

export const Floxstars: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();

  const sparkles = useMemo(
    () =>
      Array.from({length: 16}, (_, i) => ({
        x: width / 2 + (random(`kx-${i}`) - 0.5) * 1500,
        y: height / 2 - 40 + (random(`ky-${i}`) - 0.5) * 380,
        size: 10 + random(`kz-${i}`) * 16,
        start: 62 + Math.floor(random(`kt-${i}`) * 90),
        color: [C.lilac, C.gold, '#ffffff', C.pink, C.cyan][i % 5],
      })),
    [width, height]
  );

  const camera = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const master = interpolate(frame, [0, 10, durationInFrames - 14, durationInFrames], [0, 1, 1, 0], clamp);

  const lineW = interpolate(frame, [96, 138], [0, 920], {...clamp, easing: Easing.out(Easing.cubic)});
  const tagO = interpolate(frame, [112, 142], [0, 1], clamp);
  const tagY = interpolate(frame, [112, 142], [16, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const tagLS = interpolate(frame, [112, 160], [1.1, 0.62], {...clamp, easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{backgroundColor: C.bg, opacity: master}}>
      <Nebula />
      <Starfield />
      <ShootingStar start={6} x={140} y={120} angle={24} />
      <ShootingStar start={44} x={700} y={40} angle={30} />
      <ShootingStar start={128} x={80} y={420} angle={18} />

      <AbsoluteFill
        style={{justifyContent: 'center', alignItems: 'center', transform: `scale(${camera})`}}
      >
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
            {LETTERS.map((ch, i) => {
              const s = spring({
                frame: frame - (14 + i * 4),
                fps,
                config: {damping: 11, stiffness: 110, mass: 0.9},
              });
              const settle = interpolate(frame, [70, 100], [0, 1], clamp);
              const float = Math.sin((frame - i * 6) / 16) * 7 * settle;
              const y = (1 - s) * 140 + float;
              const rot = (1 - s) * (i % 2 === 0 ? -14 : 14);
              const sc = 0.5 + 0.5 * s;
              const op = interpolate(s, [0, 0.35], [0, 1], clamp);
              const blur = interpolate(s, [0, 1], [22, 0], clamp);
              const shimmer = interpolate(frame, [92 + i * 3, 118 + i * 3], [100, 0], {
                ...clamp,
                easing: Easing.inOut(Easing.cubic),
              });

              return (
                <div
                  key={i}
                  style={{
                    display: 'inline-block',
                    opacity: op,
                    transform: `translateY(${y}px) rotate(${rot}deg) scale(${sc})`,
                    filter: `blur(${blur}px) drop-shadow(0 0 28px rgba(139,92,246,0.55))`,
                  }}
                >
                  {i === 2 ? (
                    <OrbitO frame={frame} />
                  ) : (
                    <span
                      style={{
                        display: 'block',
                        fontFamily,
                        fontWeight: 800,
                        fontSize: FONT_SIZE,
                        lineHeight: 1,
                        letterSpacing: -2,
                        color: 'transparent',
                        WebkitTextFillColor: 'transparent',
                        backgroundImage: `linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.95) 50%, transparent 65%), linear-gradient(180deg, #ffffff 8%, ${C.lilac} 52%, ${C.violet} 100%)`,
                        backgroundSize: '300% 100%, 100% 100%',
                        backgroundPosition: `${shimmer}% 0, 0 0`,
                        backgroundRepeat: 'no-repeat',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                      }}
                    >
                      {ch}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Garis cahaya */}
          <div style={{position: 'relative', marginTop: 30, height: 4, display: 'flex', justifyContent: 'center'}}>
            <div
              style={{
                width: lineW,
                height: 4,
                borderRadius: 4,
                background: `linear-gradient(90deg, transparent, ${C.pink}, ${C.violet}, ${C.cyan}, transparent)`,
                boxShadow: `0 0 22px ${C.violet}`,
              }}
            />
            <svg
              width={40}
              height={40}
              viewBox="-20 -20 40 40"
              style={{
                position: 'absolute',
                top: -18,
                opacity: interpolate(frame, [120, 136], [0, 1], clamp),
                transform: `rotate(${frame * 2}deg)`,
                filter: `drop-shadow(0 0 10px ${C.gold})`,
              }}
            >
              <path d={sparklePath(14)} fill="#ffffff" />
            </svg>
          </div>

          {/* Tagline */}
          <div
            style={{
              marginTop: 42,
              fontFamily,
              fontWeight: 500,
              fontSize: 34,
              color: C.lilac,
              textTransform: 'uppercase',
              letterSpacing: `${tagLS}em`,
              marginRight: `-${tagLS}em`,
              opacity: tagO,
              transform: `translateY(${tagY}px)`,
            }}
          >
            Shine beyond the stars
          </div>
        </div>
      </AbsoluteFill>

      {sparkles.map((sp, i) => (
        <Sparkle key={i} {...sp} />
      ))}

      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)'}}
      />
    </AbsoluteFill>
  );
};
