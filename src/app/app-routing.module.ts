import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectsComponent} from "./projects/projects.component";
import {RealestateComponent} from "./realestate/realestate.component";
import {HomeComponent} from "./home/home.component";
import {ResumeComponent} from "./resume/resume.component";
import {MortgagecalcComponent} from "./mortgagecalc/mortgagecalc.component";
import {DatageneratorComponent} from "./datagenerator/datagenerator.component";
import {DashboardComponent} from "./dashboard-login/dashboard/dashboard.component";
import {MarvelbrowserComponent} from "./marvelbrowser/marvelbrowser.component";
import {DashboardLoginComponent} from "./dashboard-login/dashboard-login.component";
import {InvestmentCalculatorComponent} from "./investment-calculator/investment-calculator.component";

const routes: Routes = [
  {path:"", component: HomeComponent},
  {path:"home", component: HomeComponent},
  {path:"projects", component: ProjectsComponent},
  {path:"realestate", component: RealestateComponent},
  {path:"investment-calculator",component:InvestmentCalculatorComponent},
  {path:"resume",component:ResumeComponent},
  {path:"mortgagecalc",component:MortgagecalcComponent},
  {path:"datagenerator",component:DatageneratorComponent},
  {
    path:"dashboard-login",
    component:DashboardLoginComponent
  },
  {path:"dashboard",component:DashboardComponent},
  {path:"marvel-browser",component:MarvelbrowserComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
