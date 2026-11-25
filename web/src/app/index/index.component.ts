import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

const PRECIOS_REFERENCIALES: Record<string, number> = {
  'Limpieza básica': 25,
  'Facial hidratante relax': 30,
  'Facial renueva tu luminosidad': 30,
  'Limpieza profunda hidratante': 35,
  'Limpieza profunda detox': 35,
  'Tratamiento anti-acné': 40,
  'Tratamiento despigmentante': 40,
  'Facial corea Glow': 50,
  'Facial Glass skin PDRN': 60,
  'Facial lifting con radiofrecuencia': 40,
  'Corrección de textura y cicatrices': 50,
  'Facial Glow con ultrasonido': 35,
  'Masaje relajante cuerpo completo': 25,
  'Masaje relajante · 1 zona localizada': 15,
  'Masaje relajante con acupuntura': 30,
  Maderoterapia: 25,
  'Drenaje linfático': 20,
  'Limpieza profunda de espalda': 35,
  'Despigmentación química': 40,
  'Drenaje reductor térmico': 45,
  'Moldeo corporal intensivo': 60,
  'Cejas laminadas': 20,
  'Cejas henna': 15,
  'Laminado / Henna': 25,
  'Micropigmentación efecto polvo': 100,
  'Lifting de pestañas': 25,
  'Lifting efecto rímel': 30,
};

@Component({
  selector: 'app-inicio',
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class InicioComponent implements AfterViewInit, OnDestroy {
  private readonly removeListeners: (() => void)[] = [];

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    const root = this.host.nativeElement;

    root.querySelectorAll<HTMLElement>('.filter-tabs').forEach((tabBar) => {
      const targetId = tabBar.getAttribute('data-target');
      const grid = Array.from(root.querySelectorAll<HTMLElement>('.grid, .grid-sm'))
        .find((element) => element.id === targetId);
      if (!grid) return;

      const cards = grid.querySelectorAll<HTMLElement>('.card, .card-sm');
      const tabs = tabBar.querySelectorAll<HTMLButtonElement>('.tab');

      tabs.forEach((tab) => {
        this.removeListeners.push(this.renderer.listen(tab, 'click', () => {
          const filter = tab.getAttribute('data-filter');
          if (!filter) return;

          tabs.forEach((item) => this.renderer.removeClass(item, 'is-active'));
          this.renderer.addClass(tab, 'is-active');

          cards.forEach((card) => {
            card.hidden = filter !== 'all' && card.getAttribute('data-cat') !== filter;
          });
        }));
      });
    });

    const formatoPrecio = new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    });

    root.querySelectorAll<HTMLElement>('.card, .card-sm').forEach((card) => {
      const titulo = card.querySelector('h4, h5');
      if (!titulo) return;

      const nombre = titulo.textContent?.trim() ?? '';
      const precio = PRECIOS_REFERENCIALES[nombre];
      if (precio == null) {
        console.error('Falta definir un precio referencial para:', nombre);
        return;
      }

      const compacto = card.classList.contains('card-sm');
      const cuerpo = card.querySelector<HTMLElement>(
        compacto ? '.card-sm-body' : '.card-body',
      );
      if (!cuerpo) return;

      const precioEl = this.renderer.createElement('p') as HTMLParagraphElement;
      this.renderer.addClass(precioEl, compacto ? 'card-sm-price' : 'card-price');
      this.renderer.setProperty(precioEl, 'textContent', formatoPrecio.format(precio));
      this.renderer.appendChild(cuerpo, precioEl);

      const reservar = this.renderer.createElement('a') as HTMLAnchorElement;
      this.renderer.addClass(reservar, compacto ? 'card-sm-reserve' : 'card-reserve');
      this.renderer.setProperty(reservar, 'textContent', 'Reservar');
      this.renderer.setProperty(
        reservar,
        'href',
        `/reservar?servicio=${encodeURIComponent(nombre)}`,
      );
      this.renderer.setAttribute(reservar, 'aria-label', `Reservar ${nombre}`);
      this.renderer.appendChild(cuerpo, reservar);
    });
  }

  ngOnDestroy(): void {
    this.removeListeners.forEach((removeListener) => removeListener());
  }
}