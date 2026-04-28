import { Component, Input, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-auth-layout',
  imports: [RouterLink],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {
  @Input() titulo: string = '';
  @Input() content: string = '';
  @Input() link: string = '';
}
