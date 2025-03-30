import { AfterViewInit, Component, Inject, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ClientModelTable } from '../../client.models';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { EventEmitter } from 'stream';
import { SERVICES_TOKEN } from '../../../services/service.token';
import { IDialogManagerService } from '../../../services/idialog-manager.service';
import { DialogManagerService } from '../../../services/dialog-manager.service';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';



@Component({
  selector: 'app-client-table',
  imports: [MatTableModule, MatIconModule,MatPaginatorModule],
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.scss',
  providers: [{provide: SERVICES_TOKEN.DIALOG, useClass: DialogManagerService}]
})
export class ClientTableComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() clients: ClientModelTable[] = []

  dataSource!: MatTableDataSource<ClientModelTable>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = ['name', 'email','phone', 'actions']

  private dialogManagerServiceSubscription?: Subscription

  @Output() confirmDelete = new EventEmitter<ClientModelTable>()

  @Output() requestUpdate = new EventEmitter<ClientModelTable>()

  constructor(
    @Inject(SERVICES_TOKEN.DIALOG) private readonly dialogManagerService: IDialogManagerService    
  ){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['clients'] && this.clients){
      this.dataSource= new MatTableDataSource<ClientModelTable>(this.clients)
      if(this.paginator){
        this.dataSource.paginator = this.paginator
      }
    }
  }
  ngOnDestroy(): void {
    if(this.dialogManagerServiceSubscription){
      this.dialogManagerServiceSubscription.unsubscribe()
    }
  }

  formatPhone(phone: string){
    return `(${phone.substring(0,2)}) ${phone.substring(2,7)} - ${phone.substring(7)}`
  }


}
