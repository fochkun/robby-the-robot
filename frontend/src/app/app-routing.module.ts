import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataEntryComponent } from './screens/data-entry/data-entry.component';
import { RobbyExitComponent } from './screens/robby-exit/robby-exit.component';


const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: DataEntryComponent },
  { path: 'exit', component: RobbyExitComponent },
  { path: 'exit/:data', component: RobbyExitComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
