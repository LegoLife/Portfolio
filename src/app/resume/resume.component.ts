
import domToImage from 'dom-to-image';
import jsPDF from 'jspdf';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent  {

  @ViewChild('capture', { static: false })
  captureElement!: ElementRef;

  year:number = new Date().getFullYear();


downloadResume() {

  const element = this.captureElement.nativeElement;



  html2canvas(element).then(canvas => {
    var imgWidth =200;
    const contentDataURL = canvas.toDataURL('image/png');
    let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
    pdf.setFillColor(211, 211, 211); // light grey color
    pdf.rect(0,0,500,42,"F");

    pdf.setFontSize(14);

    var name= "Jake Steffen";
    var email = "Email - jsteffen182@gmail.com";
    var gitHub = "GitHub - https://github.com/LegoLife";


    pdf.text(name,10,10);
    pdf.textWithLink(email, 10, 18, {
      url: 'mailto:jsteffen182@gmail.com'
    });

    pdf.textWithLink(gitHub, 10, 26, {
      url: 'https://github.com/LegoLife'
    });

    pdf.textWithLink(`Personal - https://legolife.github.io/Portfolio`, 10, 34, {
      url: "https://legolife.github.io/Portfolio"
    });

    pdf.setLineWidth(2.5);
    pdf.line(0, 42, 500, 42); // startX, startY, endX, endY

    var position = 44;

    var imgHeight = 260;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    var fileName=`Jake-Steffen-Resume-${new Date().getFullYear()}.pdf`;
    pdf.save(fileName); // Generated PDF
  });
    }



}
