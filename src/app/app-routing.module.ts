import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'find-device',
    loadChildren: () => import('./find-device/find-device.module').then(m => m.FindDeviceModule)
  },
  {
    path: 'controller',
    loadChildren: () => import('./controller/controller.module').then(m => m.ControllerModule)
  },
  {
    path: '',
    redirectTo: 'find-device',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
