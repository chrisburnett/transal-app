import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WaypointFormPage } from './waypoint-form';

@NgModule({
  declarations: [
    WaypointFormPage,
  ],
  imports: [
    IonicPageModule.forChild(WaypointFormPage),
  ],
})
export class WaypointFormPageModule {}
