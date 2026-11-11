import { Component, input, output } from '@angular/core';
import { COULEURS, Signalement, ZONES } from '../signalement.service';

@Component({
  selector: 'app-carte',
  template: `
    <svg viewBox="0 0 600 380" role="img" aria-label="Carte schématique" (click)="clic($event)"
         style="width:100%;height:auto;display:block;cursor:crosshair;border-radius:4px">
      <rect width="600" height="380" fill="#cfe0e6"/>
      <path d="M130 0H600V380H200Q150 300 170 220Q125 140 130 0Z" fill="#e9e1cf"/>
      <path d="M150 130H600M240 0Q260 190 330 380M420 0Q430 200 470 380M170 250H600" stroke="#fbf8f2" stroke-width="6" fill="none"/>
      @for (z of zones; track z.n) {
        <text [attr.x]="z.x" [attr.y]="z.y - 18" text-anchor="middle" font-size="13" fill="#6b6558">{{ z.n }}</text>
      }
      @for (r of signalements(); track r.id) {
        <circle [attr.cx]="r.x" [attr.cy]="r.y" [attr.r]="selection() === r.id ? 13 : 9"
                [attr.fill]="couleurs[r.statut]" stroke="#fbf8f2" stroke-width="2.5" style="cursor:pointer"
                (click)="$event.stopPropagation(); choisirSignalement.emit(r.id)"/>
      }
      @if (repere(); as p) {
        <circle [attr.cx]="p.x" [attr.cy]="p.y" r="11" fill="#14213d" stroke="#fbf8f2" stroke-width="3"/>
      }
    </svg>`,
})
export class CarteComponent {
  signalements = input<Signalement[]>([]);
  selection = input<string | null>(null);
  repere = input<{ x: number; y: number } | null>(null);
  choisirSignalement = output<string>();
  choisirPosition = output<{ x: number; y: number }>();
  zones = ZONES;
  couleurs = COULEURS;

  clic(ev: MouseEvent) {
    const b = (ev.currentTarget as SVGSVGElement).getBoundingClientRect();
    this.choisirPosition.emit({
      x: Math.round(((ev.clientX - b.left) / b.width) * 600),
      y: Math.round(((ev.clientY - b.top) / b.height) * 380),
    });
  }
}
