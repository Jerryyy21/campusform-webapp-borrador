import { Routes } from '@angular/router';

import { LandigPage } from './screens/landig-page/landig-page';
import { LoginScreen } from './screens/login-screen/login-screen';
import { Registro } from './partials/registro/registro';
import { ProfesorScreen } from './screens/profesor-screen/profesor-screen';
import { AnalyticsPageComponent } from './screens/analytics-page/analytics-page';
import { DashboardScreen } from './screens/dashboard-screen/dashboard-screen';
import { AdminScreen } from './screens/admin-screen/admin-screen';
import { StudentPanelComponent } from './screens/student-panel/student-panel';
import { GestionUsuario } from './screens/panel-admin-profesor-alumno/gestion-usuario/gestion-usuario';
import { CategoriasAdministracion } from './screens/panel-admin-profesor-alumno/categorias-administracion/categorias-administracion';
import { ReportesAdmin } from './screens/panel-admin-profesor-alumno/reportes-admin/reportes-admin';
import { CategoriasScreen } from './screens/categorias/categorias-screen/categorias-screen';
import { FisicaComponent } from './screens/categorias/fisica/fisica';
import { InglesComponent } from './screens/categorias/ingles/ingles';
import { MatematicasComponent } from './screens/categorias/matematicas/matematicas';
import { ProgramacionComponent } from './screens/categorias/programacion/programacion';

export const routes: Routes = [

  { path: '', component: LandigPage },

  { path: 'login', component: LoginScreen },

  { path: 'register', component: Registro },

  { path: 'profesor', component: ProfesorScreen },

  { path: 'analytics-page', component: AnalyticsPageComponent },

  { path: 'dashboard', component: DashboardScreen, pathMatch: 'full' },
  { path: 'dashboard/categoria/fisica', component: FisicaComponent },
  { path: 'dashboard/categoria/ingles', component: InglesComponent },
  { path: 'dashboard/categoria/matematicas', component: MatematicasComponent },
  { path: 'dashboard/categoria/programacion', component: ProgramacionComponent },



  { path: 'admin', component: AdminScreen },

  { path: 'student-panel', component: StudentPanelComponent },

  { path: 'admin/usuarios', component: GestionUsuario },
  { path: 'admin/categorias', component: CategoriasAdministracion },
  { path: 'admin/reportes', component: ReportesAdmin },
  { path: '**', redirectTo: '' }

];
