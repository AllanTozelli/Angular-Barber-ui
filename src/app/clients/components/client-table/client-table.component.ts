import { AfterViewInit, Component, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ClientModelTable } from '../../client.models';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';  // Certifique-se de importar EventEmitter
import { SERVICES_TOKEN } from '../../../services/service.token';
import { IDialogManagerService } from '../../../services/idialog-manager.service';
import { DialogManagerService } from '../../../services/dialog-manager.service';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { YesNoDialogComponent } from '../../../commons/components/yes-no-dialog/yes-no-dialog.component';
import { CustomPaginator } from './custom-paginator';

@Component({
  selector: 'app-client-table',
  imports: [MatIconModule, MatPaginatorModule,MatTableModule],
  templateUrl: './client-table.component.html',
  styleUrls: ['./client-table.component.scss'],
  providers: [{ provide: SERVICES_TOKEN.DIALOG, useClass: DialogManagerService },
    {provide: MatPaginatorIntl, useClass: CustomPaginator}
  ]
})
export class ClientTableComponent implements AfterViewInit, OnChanges, OnDestroy {
onPageChange($event: PageEvent) {
throw new Error('Method not implemented.');
}

  @Input() clients: ClientModelTable[] = [];

  dataSource!: MatTableDataSource<ClientModelTable>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'email', 'phone', 'actions'];

  private dialogManagerServiceSubscription?: Subscription;

  // Corrigir o tipo do EventEmitter
  @Output() OnConfirmDelete = new EventEmitter<ClientModelTable>();  // Tipo correto

  @Output() OnRequestUpdate = new EventEmitter<ClientModelTable>();  // Tipo correto

  constructor(
    @Inject(SERVICES_TOKEN.DIALOG) private readonly dialogManagerService: IDialogManagerService
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clients'] && this.clients) {
      this.dataSource = new MatTableDataSource<ClientModelTable>(this.clients);
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.dialogManagerServiceSubscription) {
      this.dialogManagerServiceSubscription.unsubscribe();
    }
  }

  formatPhone(phone: string): string {
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)} - ${phone.substring(7)}`;
  }

  update(client: ClientModelTable){
    this.OnRequestUpdate.emit(client)

  }

  delete(client: ClientModelTable): void {
    this.dialogManagerService.showYesNoDialog(
      YesNoDialogComponent,
      { title: 'Exclusão de cliente', content: `Confirma a exclusão do cliente ${client.name}?` }
    ).subscribe(result => {
      if (result) {
        // Emitir evento para confirmar exclusão
        this.OnConfirmDelete.emit(client);

        // Filtra a lista de clientes para excluir o cliente
        const updatedList: ClientModelTable[] = this.dataSource.data.filter(c => c.id !== client.id);

        // Atualiza o dataSource com a nova lista filtrada
        this.dataSource = new MatTableDataSource<ClientModelTable>(updatedList);
      }
    });
  }

}
