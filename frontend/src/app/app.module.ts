import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { DataEntryComponent } from './screens/data-entry/data-entry.component';
import { RobbyExitComponent } from './screens/robby-exit/robby-exit.component';
import { AppRoutingModule } from './/app-routing.module';
import { MazeInfoService } from './services/maze-info.service';
import { RobbyTheRobotComponent } from './hero/robby-the-robot/robby-the-robot.component';


@NgModule({
  declarations: [
    AppComponent,
    DataEntryComponent,
    RobbyExitComponent,
    RobbyTheRobotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ MazeInfoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
