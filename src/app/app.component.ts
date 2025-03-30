import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CardHeaderComponent } from './commons/components/card-header/card-header.component';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';  // Importando os operadores corretamente
import { MenuBarComponent } from './commons/components/menu-bar/menu-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CardHeaderComponent, MenuBarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']  // Corrigido para styleUrls em vez de styleUrl
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'barber-shop-ui';

  private routeSubscription?: Subscription;

  constructor(
    private readonly router: Router, 
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // A assinatura de navegação agora usa o filtro e mapeamento corretamente
    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getRouteTitle(this.activatedRoute))  // Corrigido para a função correta
    ).subscribe((title: string) => {
      this.title = title;  // Atualiza o título da aplicação com o título da rota
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();  // Limpa a assinatura
    }
  }

  private getRouteTitle(route: ActivatedRoute): string {
    let child = route;
    while (child.firstChild) {
      child = child.firstChild;
    }
    return child.snapshot.data['title'] || 'Default Title';  // Retorna o título ou o padrão
  }
}
