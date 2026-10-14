import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Conect } from './component/conect/conect';
const routes: Routes = [
  {
    path:'',
    component:Conect
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConectRoutingModule { }
