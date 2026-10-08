import Reveal from './Reveal';

/** Consistent cinematic section heading: eyebrow / title / subtitle. */
export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', titleClass = '' }) {
  return (
    <div className={`mb-14 flex flex-col ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
      <Reveal>
        <p className="section-eyebrow mb-4">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={`serif text-4xl md:text-6xl font-medium glow-text ${titleClass}`}>
          {typeof title === 'string' ? <span className="text-gradient">{title}</span> : title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-2xl text-white/60 text-base md:text-lg leading-relaxed">{subtitle}</p>
        </Reveal>
      )}
      <Reveal delay={0.22}>
        <div className={`mt-7 h-px w-24 line-gradient ${align === 'center' ? '' : 'origin-left'}`} />
      </Reveal>
    </div>
  );
}
