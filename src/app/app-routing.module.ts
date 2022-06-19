import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsFolderComponent } from './pages/details-folder/details-folder.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'folder/:id',
    component: DetailsFolderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
