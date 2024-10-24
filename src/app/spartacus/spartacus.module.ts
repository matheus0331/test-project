import {NgModule} from '@angular/core';
import {SpartacusConfigurationModule} from './spartacus-configuration.module';
import {SpartacusFeaturesModule} from './spartacus-features.module';
import {BaseStorefrontModule} from '@spartacus/storefront';

@NgModule({
  declarations: [],
  imports: [
    SpartacusFeaturesModule,
    SpartacusConfigurationModule,
    BaseStorefrontModule
  ],
  exports: [BaseStorefrontModule]
})
export class SpartacusModule {
}
