import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharePage } from './share.page';

import { SharePageRoutingModule } from './share-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharePageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [SharePage],
})
export class SharePageModule {}
