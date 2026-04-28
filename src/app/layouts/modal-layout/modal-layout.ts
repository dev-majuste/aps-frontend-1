import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-layout',
  imports: [CommonModule],
  templateUrl: './modal-layout.html',
  styleUrl: './modal-layout.css',
})
export class ModalLayout {
  @Output() fechar = new EventEmitter<void>();

  close() {
    this.fechar.emit();
  }
}
