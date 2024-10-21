import {Component, ElementRef, ViewChild} from '@angular/core';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Component({
  selector: 'app-resume-terminal',
  templateUrl: './resume-terminal.component.html',
  styleUrls: ['./resume-terminal.component.css']
})
export class ResumeTerminalComponent {
  resumeContent = `
 Jake Steffen
 Software Developer
 ---------------------------
 Skills:
 .NET (C#) | SQL Server | Angular+Typescript | Azure Dev Ops | Visual Studio

 ---------------------------
 Projects:
   1. Real-time Data Collection Application
     - Provides real-time tracking of 80+ servers and workstations, including Windows and Linux,
       with a full-stack web interface (Angular) and .NET Web API (900+ endpoints) for
       data input, viewing, and export.
   2. API Integration and Data Retrieval
     - Created and maintain 20+ C# applications for fetching and storing data from various
       APIs, optimizing data processes, and ensuring data integrity. Collaborated for seamless
       integration and ongoing support.
 ---------------------------
 Experience:
 - Programmer/Analyst (4/2018-Present)
 - System Administrator (3/2015 - 4/2018)
 ---------------------------
 Education
 - Bachelor of Science Networking and Telecommunications (2014)
 `;
  typedText: string[] = [];
  typingSpeed = .1; // Speed in milliseconds

  ngOnInit() {
    this.startTyping();
  }

  startTyping() {
    let index = 0;
    const interval = setInterval(() => {
      if (index < this.resumeContent.length) {
        this.typedText.push(this.resumeContent[index++]);
      } else {
        clearInterval(interval);
      }
    }, this.typingSpeed);
  }
  downloadResume() {
    const pdf = new jsPDF('p', 'pt', 'a4'); // 'p' = portrait, 'pt' = points, 'a4' = page size

    const margin = 40;
    const lineHeight = 20;
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    let cursorY = margin;

    // Helper to add new page if content exceeds page height
    const checkPageHeight = (y: number) => {
      if (y > pageHeight - margin) {
        pdf.addPage();
        return margin;
      }
      return y;
    };

    // Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.text('Jake Steffen', margin, cursorY);
    cursorY += lineHeight;

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Software Developer', margin, cursorY);
    cursorY += lineHeight * 2;

    // Section Header
    const addSectionHeader = (title: string) => {
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 255); // Blue text
      pdf.text(title, margin, cursorY);
      cursorY += lineHeight;
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(1);
      pdf.line(margin, cursorY, pageWidth - margin, cursorY); // Horizontal line
      cursorY += lineHeight;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0); // Reset to black
    };

    // Text Block
    const addTextBlock = (text: string) => {
      const lines = pdf.splitTextToSize(text, pageWidth - margin * 2);
      lines.forEach((line:any) => {
        pdf.text(line, margin, cursorY);
        cursorY += lineHeight;
        cursorY = checkPageHeight(cursorY); // Add new page if needed
      });
      cursorY += lineHeight;
    };

    // Add Resume Content
    addSectionHeader('Skills');
    addTextBlock('Angular | C# | SQL Server | Azure DevOps | Visual Studio');

    addSectionHeader('Projects');
    addTextBlock(
      '1. Real-time Data Collection Application\n' +
      '   - Full-stack web interface with Angular, .NET Web API, SQL Server\n' +
      '   - Tracks 80+ servers (Windows and Linux) with real-time data\n' +
      '   - 900+ API endpoints for data input, export, and visualization'
    );

    addTextBlock(
      '2. API Integration and Data Retrieval\n' +
      '   - Developed 20+ C# applications to fetch and store API data\n' +
      '   - Automated data processes to ensure seamless integration'
    );

    addSectionHeader('Experience');
    addTextBlock(
      'Programmer/Analyst @ Hoosier Energy, Bloomington, IN (04/2018 - Present)\n' +
      '   - Analyze data needs and develop web-based solutions\n' +
      '   - Coordinate implementation, training, and ongoing support\n' +
      '   - Recommend operational improvements for efficiency'
    );

    addTextBlock(
      'System Administrator @ Hoosier Energy, Spencer, IN (03/2015 - 04/2018)\n' +
      '   - Managed 70+ servers and workstations\n' +
      '   - Supported NERC/CIP Compliance Assurance\n' +
      '   - Performed EMS maintenance'
    );

    addSectionHeader('Education');
    addTextBlock(
      'Bachelor of Science in Networking and Telecommunications\n' +
      'University of Phoenix (08/2010 - 09/2014)'
    );

    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, pageHeight - margin / 2);

    // Save the PDF
    pdf.save('Resume_Jake_Steffen.pdf');
  }
    //   const pdf = new jsPDF();
    //   const margin = 2;
    //   const pageHeight = pdf.internal.pageSize.height;
    //
    //   // Split the text into lines that fit the page width
    //   const lines = pdf.splitTextToSize(this.resumeContent, pdf.internal.pageSize.width - 2 * margin);
    //   let y = margin;
    //
    //   // Add text line by line, breaking to new pages if needed
    //   lines.forEach((line:any) => {
    //     if (y + 10 > pageHeight) {  // Check if the next line fits on the page
    //       pdf.addPage();
    //       y = margin;  // Reset y position for new page
    //     }
    //     pdf.text(line, margin, y);
    //     y += 10;  // Move y down for next line
    //   });
    //
    //   // Save the PDF
    //   pdf.save('Resume_Jake_Steffen.pdf');
    // }


}
