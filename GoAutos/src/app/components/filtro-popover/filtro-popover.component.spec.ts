import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FiltroPopoverComponent } from './filtro-popover.component';

describe('FiltroPopoverComponent', () => {
  let component: FiltroPopoverComponent;
  let fixture: ComponentFixture<FiltroPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroPopoverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltroPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
