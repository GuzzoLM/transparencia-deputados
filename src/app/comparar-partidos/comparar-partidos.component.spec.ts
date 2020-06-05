import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompararPartidosComponent } from './comparar-partidos.component';

describe('CompararPartidosComponent', () => {
  let component: CompararPartidosComponent;
  let fixture: ComponentFixture<CompararPartidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompararPartidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompararPartidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
