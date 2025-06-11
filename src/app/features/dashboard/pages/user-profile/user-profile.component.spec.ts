import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    fullname: 'Test User',
    enable: true,
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['user$'], {
      user$: of(mockUser),
    });

    await TestBed.configureTestingModule({
      imports: [MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatDividerModule, NoopAnimationsModule],
      declarations: [UserProfileComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit()
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener y asignar currentUser desde AuthService', () => {
    expect(component.currentUser).toEqual(mockUser);
  });

  it('debería mostrar los datos del usuario en los campos', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const inputs = compiled.querySelectorAll('input');

    expect(inputs[0].value).toBe(mockUser.email as string);
    expect(inputs[1].value).toBe(mockUser.username as string);
    expect(inputs[2].value).toBe(mockUser.fullname as string);

    const slideToggleDebug = fixture.debugElement.query(By.directive(MatSlideToggle));
    expect(slideToggleDebug.componentInstance.checked).toBe(true);
    expect(slideToggleDebug.componentInstance.disabled).toBe(true);
  });
});
