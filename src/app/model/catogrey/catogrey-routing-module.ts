import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Catogrey } from './component/catogrey/catogrey';
const routes: Routes = [
  {
    path:'',
    component:Catogrey
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatogreyRoutingModule { }
