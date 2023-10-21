import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DasboardComponent } from './dasboard/dasboard.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MailComponent } from './mail/mail.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LockScreenComponent } from './lock-screen/lock-screen.component';
import { ViewMessageComponent } from './view-message/view-message.component';
import { ComposeComponent } from './compose/compose.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { FormImageCropComponent } from './form-image-crop/form-image-crop.component';
import { FormImgZoomComponent } from './form-img-zoom/form-img-zoom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { EmployeesComponent } from './employees/employees.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FooternavComponent } from './footernav/footernav.component';
import { PackagesComponent } from './packages/packages.component';
import { BlogsComponent } from './blogs/blogs.component';
import { OrdersComponent } from './orders/orders.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ReportsComponent } from './reports/reports.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ClientsComponent } from './clients/clients.component';

// import * as CanvasJSAngularChart from '../assets/charts/canvasjs.angular.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgChartsModule } from 'ng2-charts';
//Material Imports
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCommonModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatRippleModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSortModule} from '@angular/material/sort';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {MatChipsModule} from '@angular/material/chips';
import {MatNativeDateModule} from '@angular/material/core';
import { TodoComponent } from './todo/todo.component';
import { StatesComponent } from './states/states.component';
import { ServicesComponent } from './services/services.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatCardModule } from '@angular/material/card';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';


//Material Imports End

import { NgpImagePickerModule } from 'ngp-image-picker';
import { ChatComponent } from './chat/chat.component';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { RegisteredAgentsComponent } from './registered-agents/registered-agents.component';
import { BottomSheetforRejectionsComponent } from './bottom-sheetfor-rejections/bottom-sheetfor-rejections.component';
import { ComissionAgentsComponent } from './comission-agents/comission-agents.component';
import { DeleteOrderComponent } from './delete-order/delete-order.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { BusinessAddressComponent } from './business-address/business-address.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { SettingComponent } from './setting/setting.component';
import { EmployeeModalComponent } from './employee-modal/employee-modal.component';
import { ImageLoaderComponent } from './image-loader/image-loader.component';
import { RecordNotFoundComponent } from './record-not-found/record-not-found.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AddOrderComponent } from './add-order/add-order.component';
import { SocialMediaLeadsComponent } from './social-media-leads/social-media-leads.component';
import { QuillModule } from 'ngx-quill';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

// var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;
@NgModule({
  declarations: [
    AppComponent,
    DasboardComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    MailComponent,
    ForgotPasswordComponent,
    LockScreenComponent,
    ViewMessageComponent,
    ComposeComponent,
    HeaderComponent,
    SidebarComponent,
    FileuploadComponent,
    FormImageCropComponent,
    FormImgZoomComponent,
    TestimonialsComponent,
    EmployeesComponent,
    FooternavComponent,
    PackagesComponent,
    BlogsComponent,
    OrdersComponent,
    AppointmentsComponent,
    ReportsComponent,
    BreadcrumbComponent,
    ClientsComponent,
    TodoComponent,
    StatesComponent,
    ServicesComponent,
    ChatComponent,
    RegisteredAgentsComponent,
    BottomSheetforRejectionsComponent,
    ComissionAgentsComponent,
    DeleteOrderComponent,
    ServiceDetailComponent,
    BusinessAddressComponent,
    ManagerDashboardComponent,
    SettingComponent,
    EmployeeModalComponent,
    ImageLoaderComponent,
    RecordNotFoundComponent,
    NotificationsComponent,
    AddOrderComponent,
    SocialMediaLeadsComponent
  ],
  imports: [
  BrowserModule,
  NgxWebstorageModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    // Ng2SearchPipeModule,
    NgChartsModule,
    NgpImagePickerModule,
    CdkTreeModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HttpClientModule,MatInputModule,ReactiveFormsModule,MatSlideToggleModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCardModule,
    MatNativeDateModule,
    MatChipsModule,
    MatCommonModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatMenuModule,
    MatListModule,
    MatPaginatorModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatStepperModule,
    MatSnackBarModule,
    MatSortModule,
    MatSliderModule,
    MatSidenavModule,
    MatTreeModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatTableModule,
    FormsModule,
    QuillModule.forRoot(),
    NgxSkeletonLoaderModule,
  ],
  providers: [
    {provide : LocationStrategy , useClass: HashLocationStrategy}
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
