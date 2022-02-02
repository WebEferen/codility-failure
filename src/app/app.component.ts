import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

// Mocks inside the file without querying (simplicity).
const MOCK_URL = 'http://localhost:4200/assets/mocks.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  private subscription: Subscription = new Subscription();

  isLoading: boolean = false;
  items: string[] = [];

  @Output() onSubmit = new EventEmitter<string>();
  @Input() value: string = '';

  constructor(private httpClient: HttpClient) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleSearch(event: any) {
    event.stopPropagation();
    event.preventDefault();

    const value: string = event.target.value;
    if (value === '') {
      this.items = [];
      return;
    }

    this.subscription = this.httpClient.get<string[]>(`${MOCK_URL}?q=${value}`).pipe(
      tap(() => this.isLoading = true),
      debounceTime(500),
      tap(() => this.isLoading = false),
    ).subscribe((data) => this.items = data);
  }

  handleSubmit(id: string) {
    this.value = id;
    this.items = [];

    this.onSubmit.emit(id);
  }
}
