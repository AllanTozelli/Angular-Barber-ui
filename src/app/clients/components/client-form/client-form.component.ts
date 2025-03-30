import { Component, Input, Output, EventEmitter } from '@angular/core';  // Corrigido import do EventEmitter
import { ClientModelForm } from '../../client.models';  // Suponho que você tenha esse modelo
import { FormsModule, NgForm } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';  // Para uso do ngx-mask

// Importação dos módulos do Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-form',
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    NgxMaskDirective
  ],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']  // Corrigido "styleUrl" para "styleUrls"
})
export class ClientFormComponent {

  @Input() client: ClientModelForm = { id: 0, name: '', email: '', phone: '' };  // Inicialização correta do cliente

  @Output() clientSubmited = new EventEmitter<ClientModelForm>();  // Corrigido import do EventEmitter

  // Método que emite o evento quando o formulário é submetido
  onSubmit(_: NgForm) {
    this.clientSubmited.emit(this.client);
  }
}
