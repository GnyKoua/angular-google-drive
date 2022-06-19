import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFolderComponent } from './details-folder.component';

describe('DetailsFolderComponent', () => {
  let component: DetailsFolderComponent;
  let fixture: ComponentFixture<DetailsFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
