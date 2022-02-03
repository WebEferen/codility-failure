import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, interval, of } from 'rxjs';
import { switchMap, debounce, tap } from 'rxjs/operators';

// Mocks inside the file without querying (simplicity).
const MOCK_URL = 'http://localhost:4200/assets/mocks.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private subject$: Subject<any> = new Subject();
  items$: Observable<string[]> = new Observable();

  isLoading: boolean = false;

  @Output() onSubmit = new EventEmitter<string>();
  @Input() value: string = '';

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
      this.items$ = this.subject$.pipe(
        tap(() => this.isLoading = true),
        debounce(() => interval(500)),
        switchMap((text: string) => {
          if (text === '') return of([]);
          return this.httpClient.get<string[]>(`${MOCK_URL}?q=${text}`);
        }),
        tap(() => this.isLoading = false)
      );
  }

  ngOnDestroy(): void {
    this.subject$.unsubscribe();
  }

  handleSearch(event: any) {
    event.stopPropagation();
    event.preventDefault();

    const value: string = event.target.value;
    return this.subject$.next(value);
  }

  handleSubmit(id: string) {
    this.value = id;
    this.subject$.next('');

    this.onSubmit.emit(id);
  }
}
