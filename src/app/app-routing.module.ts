import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './pages/order/order.component';
import { AdminComponent } from './pages/admin/admin.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: OrderComponent },
      { path: 'admin', component: AdminComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
