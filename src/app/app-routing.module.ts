import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComposeComponent } from './compose/compose.component';
import { DasboardComponent } from './dasboard/dasboard.component';
import { EmployeesComponent } from './employees/employees.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormImageCropComponent } from './form-image-crop/form-image-crop.component';
import { FormImgZoomComponent } from './form-img-zoom/form-img-zoom.component';
import { LockScreenComponent } from './lock-screen/lock-screen.component';
import { LoginComponent } from './login/login.component';
import { MailComponent } from './mail/mail.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { ViewMessageComponent } from './view-message/view-message.component';
import { ClientsComponent } from './clients/clients.component';
import { BlogsComponent } from './blogs/blogs.component';
import { OrdersComponent } from './orders/orders.component';
import { PackagesComponent } from './packages/packages.component';
import { ReportsComponent } from './reports/reports.component';
import { TodoComponent } from './todo/todo.component';
import { StatesComponent } from './states/states.component';
import { ServicesComponent } from './services/services.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatComponent } from './chat/chat.component';
import { RegisteredAgentsComponent } from './registered-agents/registered-agents.component';
import { ComissionAgentsComponent } from './comission-agents/comission-agents.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { BusinessAddressComponent } from './business-address/business-address.component';
import { SettingComponent } from './setting/setting.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { HeaderComponent } from './header/header.component';
import { AddOrderComponent } from './add-order/add-order.component';
import { SocialMediaLeadsComponent } from './social-media-leads/social-media-leads.component';

const routes: Routes = [
  {path:'', component:LoginComponent},
  {path:'dashboard',component:DasboardComponent},
  {path:'profile', component:ProfileComponent},
  {path:'register',component:RegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'forgot-password',component:ForgotPasswordComponent},
  {path:'lock-screen',component:LockScreenComponent},
  {path:'inbox', component:MailComponent},
  {path:'compose-message',component:ComposeComponent},
  {path:'view-message',component:ViewMessageComponent},  
  {path:'form-upload',component:FileuploadComponent},
  {path:'form-image-crop', component:FormImageCropComponent},
  {path:'form-image-zoom', component:FormImgZoomComponent},
  {path:'testimonials', component:TestimonialsComponent},
  {path:'employees', component:EmployeesComponent},
  {path:'clients', component:ClientsComponent},
  {path:'blogs', component:BlogsComponent},
  {path:'orders', component:OrdersComponent},
  {path:'packages', component:PackagesComponent},
  {path:'reports', component:ReportsComponent},
  {path:'todo', component:TodoComponent},
  {path:'services', component:ServicesComponent},
  {path:'states', component:StatesComponent},
  {path:'sidebar', component:SidebarComponent},
  {path:'chat', component: ChatComponent},
  {path:'register-agent', component: RegisteredAgentsComponent},
  {path:'commission-agents', component: ComissionAgentsComponent},
  {path:'manager-dashboard', component: ManagerDashboardComponent},  
  {path:'business-address', component: BusinessAddressComponent}, 
  {path:'setting', component: SettingComponent},  
  {path:'notifications', component:NotificationsComponent},
  {path:'header', component:HeaderComponent},
  {path:'add-order', component:AddOrderComponent},
  {path:'social-media-leads', component:SocialMediaLeadsComponent},



];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
