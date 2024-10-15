import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {RealestateComponent} from './realestate/realestate.component';
import {ProjectsComponent} from './projects/projects.component';
import {HomeComponent} from './home/home.component';
import {FormsModule} from '@angular/forms';
import {ResumeComponent} from './resume/resume.component';
import {MortgagecalcComponent} from './mortgagecalc/mortgagecalc.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSliderModule} from "@angular/material/slider";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {DatageneratorComponent} from './datagenerator/datagenerator.component';
import {ClipboardModule} from "@angular/cdk/clipboard";
import { DashboardComponent } from './dashboard-login/dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import {DataTablesModule} from "angular-datatables";
import { ProjectNavComponent } from './project-nav/project-nav.component';
import { MarvelbrowserComponent } from './marvelbrowser/marvelbrowser.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardLoginComponent } from './dashboard-login/dashboard-login.component';
import {NgOptimizedImage} from "@angular/common";
import { InvestmentCalculatorComponent } from './investment-calculator/investment-calculator.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RealestateComponent,
    ProjectsComponent,
    HomeComponent,
    ResumeComponent,
    MortgagecalcComponent,
    DatageneratorComponent,
    DashboardComponent,
    ProjectNavComponent,
    MarvelbrowserComponent,
    DashboardLoginComponent,
    InvestmentCalculatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatCardModule,
    MatInputModule,
    ClipboardModule,
    NgChartsModule,
    DataTablesModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
