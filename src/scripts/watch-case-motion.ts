import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
let dispose: (() => void) | undefined;

export function initWatchCase() {
  dispose?.();
  const root = document.querySelector<HTMLElement>('.watch-case');
  if (!root) return;
  const mm = gsap.matchMedia();
  mm.add({ reduce: '(prefers-reduced-motion: reduce)', desktop: '(min-width: 701px)', mobile: '(max-width: 700px)' }, context => {
    const { reduce, desktop } = context.conditions!;
    const events = new AbortController();
    const options = { signal: events.signal };
    const select = gsap.utils.selector(root);
    const dialog = root.querySelector<HTMLDialogElement>('.case-lightbox')!;
    const revealTweens: gsap.core.Tween[] = [];
    const counters: Array<{ node: Text; text: string }> = [];

    if (!reduce) {
      gsap.timeline({ defaults: { ease: 'power3.out', duration: .85 } })
        .from(select('.hero-copy > :not(.case-back)'), { y: 28, autoAlpha: 0, stagger: .11 }, 0)
        .from(select('.hero-visual img'), { y: 65, rotation: -7, scale: .88, autoAlpha: 0, duration: 1.35 }, .12)
        .from(select('.orbit'), { opacity: 0, duration: 1.4, stagger: .15 }, .35)
        .from(select('.visual-label, .project-meta > div'), { y: 15, autoAlpha: 0, stagger: .07 }, .65);

      // Animate the parent for depth without competing with the image entrance.
      if (desktop) gsap.to(select('.hero-visual'), { y: 60, ease: 'none', scrollTrigger: { trigger: root.querySelector('.case-hero'), start: 'top top', end: 'bottom top', scrub: 1 } });

      root.querySelectorAll<HTMLElement>('.section-heading, .decision-grid, .screens, .exception, .sleep-layout, .system-grid, .closing-grid, .collection-cover').forEach(group => {
        const targets = Array.from(group.children);
        revealTweens.push(gsap.from(targets, { y: desktop ? 35 : 20, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: group, start: 'top 88%', once: true } }));
      });
      root.querySelectorAll<HTMLElement>('.sleep-legend i, .swatches i').forEach(bar => {
        gsap.from(bar, { scaleX: 0, transformOrigin: 'left center', duration: .8, ease: 'power3.out', scrollTrigger: { trigger: bar, start: 'top 92%', once: true } });
      });
      root.querySelectorAll<HTMLElement>('.data-explainer b').forEach(el => {
        const node = el.firstChild;
        if (!(node instanceof Text)) return;
        const text = node.textContent || '';
        const value = Number(text);
        if (!Number.isFinite(value)) return;
        counters.push({ node, text });
        const state = { value: 0 };
        gsap.to(state, { value, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { node.textContent = (text.startsWith('+') ? '+' : '') + state.value.toFixed(text.includes('.') ? 1 : 0); }, onComplete: () => { node.textContent = text; } });
      });
    }

    const navLinks = Array.from(root.querySelectorAll<HTMLAnchorElement>('.case-nav a'));
    navLinks.forEach(link => {
      const section = root.querySelector<HTMLElement>(link.hash);
      if (!section) return;
      const activate = () => navLinks.forEach(item => { if (item === link) item.setAttribute('aria-current', 'location'); else item.removeAttribute('aria-current'); });
      ScrollTrigger.create({ trigger: section, start: 'top 38%', end: 'bottom 38%', onEnter: activate, onEnterBack: activate });
    });
    gsap.fromTo(select('.case-progress'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: true } });

    // Register event-created animations with matchMedia for complete cleanup.
    context.add('openScreen', (button: HTMLButtonElement) => {
      const image = dialog.querySelector('img')!;
      image.src = button.dataset.image!;
      image.alt = button.dataset.title!;
      dialog.querySelector('p')!.textContent = button.dataset.title!;
      if (!dialog.open) dialog.showModal();
      if (!reduce) gsap.fromTo(dialog, { y: 18, scale: .96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .3, ease: 'power3.out', overwrite: true });
    });
    root.querySelectorAll<HTMLButtonElement>('[data-image]').forEach(button => button.addEventListener('click', () => context.openScreen(button), options));
    dialog.querySelector('button')!.addEventListener('click', () => dialog.close(), options);
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); }, options);

    context.add('filterScreens', (button: HTMLButtonElement) => {
      const category = button.dataset.screenFilter;
      let count = 0;
      root.querySelectorAll<HTMLButtonElement>('[data-screen-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      root.querySelectorAll<HTMLElement>('[data-screen-category]').forEach(card => { card.hidden = category !== '全部' && card.dataset.screenCategory !== category; if (!card.hidden) count++; });
      root.querySelectorAll<HTMLElement>('[data-collection-group]').forEach(group => { group.hidden = category !== '全部' && group.dataset.collectionGroup !== category; });
      root.querySelector('.overview-count')!.textContent = `显示${category === '全部' ? '全部' : category} ${count} 个界面`;
      // Filtering changes the height of the long article; settle reveals before refresh.
      revealTweens.forEach(tween => tween.progress(1));
      if (!reduce) gsap.fromTo(select('[data-collection-group]:not([hidden]) .collection-composition'), { y: 18, opacity: .35 }, { y: 0, opacity: 1, duration: .45, stagger: .035, ease: 'power2.out', overwrite: true });
      ScrollTrigger.refresh();
    });
    root.querySelectorAll<HTMLButtonElement>('[data-screen-filter]').forEach(button => button.addEventListener('click', () => context.filterScreens(button), options));
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh, options);
    document.fonts.ready.then(() => { if (!events.signal.aborted) refresh(); });
    return () => { events.abort(); dialog.close(); counters.forEach(({ node, text }) => node.textContent = text); navLinks.forEach(link => link.removeAttribute('aria-current')); };
  }, root);
  dispose = () => mm.revert();
}

document.addEventListener('astro:before-swap', () => dispose?.());
document.addEventListener('astro:page-load', initWatchCase);
