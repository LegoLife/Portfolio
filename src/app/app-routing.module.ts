import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectsComponent} from "./projects/projects.component";
import {RealestateComponent} from "./realestate/realestate.component";
import {CalculatorComponent} from "./calculator/calculator.component";
import {HomeComponent} from "./home/home.component";
import {ResumeComponent} from "./resume/resume.component";
import {MortgagecalcComponent} from "./mortgagecalc/mortgagecalc.component";
import {DatageneratorComponent} from "./datagenerator/datagenerator.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {MarvelbrowserComponent} from "./marvelbrowser/marvelbrowser.component";

const routes: Routes = [
  {path:"", component: HomeComponent},
  {path:"home", component: HomeComponent},
  {path:"projects", component: ProjectsComponent},
  {path:"realestate", component: RealestateComponent},
  {path:"calculator",component:CalculatorComponent},
  {path:"resume",component:ResumeComponent},
  {path:"mortgagecalc",component:MortgagecalcComponent},
  {path:"datagenerator",component:DatageneratorComponent},
  {path:"dashboard",component:DashboardComponent},
  {path:"marvel-browser",component:MarvelbrowserComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
